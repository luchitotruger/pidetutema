cat > supabase/functions/manage-party-media/index.ts <<'EOF'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type'
}

const MAX_VOICE_BYTES = 2 * 1024 * 1024
const MAX_VIDEO_BYTES = 20 * 1024 * 1024

const voiceTypes = new Set([
  'audio/webm',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg'
])

const videoTypes = new Set([
  'video/webm',
  'video/mp4',
  'video/quicktime'
])

function cleanName(value: string) {
  return value
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 120)
}

function json(data: unknown, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        ...cors,
        'Content-Type': 'application/json'
      }
    }
  )
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors })
  }

  try {
    const url = Deno.env.get('SUPABASE_URL')
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!url || !service) {
      throw new Error('Configuración Supabase incompleta')
    }

    const sb = createClient(url, service)
    const body = await req.json()

    const {
      event_id,
      visitor_id,
      display_name,
      kind,
      action,
      id
    } = body

    if (!event_id) {
      throw new Error('Evento requerido')
    }

    const { data: event, error: eventError } = await sb
      .from('events')
      .select('id,user_id,is_active')
      .eq('id', event_id)
      .single()

    if (eventError || !event) {
      throw new Error('Evento no encontrado')
    }

    /*
     * Acciones públicas controladas:
     * prepare_upload y finalize_upload.
     *
     * No requieren sesión DJ, pero validan:
     * - evento activo;
     * - tipo multimedia;
     * - MIME;
     * - tamaño;
     * - duración;
     * - ruta asociada al evento y visitante.
     */
    if (
      action === 'prepare_upload' ||
      action === 'finalize_upload'
    ) {
      if (!event.is_active) {
        throw new Error('El evento no está activo')
      }

      if (!['voice', 'video'].includes(kind)) {
        throw new Error('Tipo multimedia inválido')
      }

      if (!visitor_id || String(visitor_id).length > 160) {
        throw new Error('Identificador de visitante inválido')
      }
    }

    if (action === 'prepare_upload') {
      const mimeType = String(body.mime_type || '').toLowerCase()
      const sizeBytes = Number(body.size_bytes || 0)
      const originalName = cleanName(
        String(body.file_name || 'archivo')
      )

      const bucket =
        kind === 'voice'
          ? 'party-voice'
          : 'party-videos'

      const allowedTypes =
        kind === 'voice'
          ? voiceTypes
          : videoTypes

      const maxBytes =
        kind === 'voice'
          ? MAX_VOICE_BYTES
          : MAX_VIDEO_BYTES

      if (!allowedTypes.has(mimeType)) {
        throw new Error(
          kind === 'voice'
            ? 'Formato de audio no compatible'
            : 'Formato de video no compatible'
        )
      }

      if (
        !Number.isFinite(sizeBytes) ||
        sizeBytes <= 0 ||
        sizeBytes > maxBytes
      ) {
        throw new Error(
          kind === 'voice'
            ? 'El audio debe pesar máximo 2 MB'
            : 'El video debe pesar máximo 20 MB'
        )
      }

      const safeVisitor = cleanName(String(visitor_id))
      const extension =
        originalName.includes('.')
          ? originalName.split('.').pop()
          : kind === 'voice'
            ? 'webm'
            : 'mp4'

      const storagePath =
        `${event_id}/${safeVisitor}/` +
        `${crypto.randomUUID()}.${extension}`

      const { data, error } = await sb.storage
        .from(bucket)
        .createSignedUploadUrl(storagePath)

      if (error || !data?.token) {
        throw new Error(
          error?.message ||
          'No se pudo preparar la carga multimedia'
        )
      }

      return json({
        ok: true,
        bucket,
        path: storagePath,
        token: data.token
      })
    }

    if (action === 'finalize_upload') {
      const storagePath = String(body.storage_path || '')
      const mimeType = String(body.mime_type || '').toLowerCase()
      const duration = Number(body.duration_seconds || 0)
      const sizeBytes = Number(body.size_bytes || 0)

      const safeVisitor = cleanName(String(visitor_id))
      const requiredPrefix =
        `${event_id}/${safeVisitor}/`

      if (!storagePath.startsWith(requiredPrefix)) {
        throw new Error('Ruta multimedia inválida')
      }

      const table =
        kind === 'voice'
          ? 'party_voice_messages'
          : 'party_videos'

      const bucket =
        kind === 'voice'
          ? 'party-voice'
          : 'party-videos'

      const allowedTypes =
        kind === 'voice'
          ? voiceTypes
          : videoTypes

      const maxBytes =
        kind === 'voice'
          ? MAX_VOICE_BYTES
          : MAX_VIDEO_BYTES

      const maxDuration =
        kind === 'voice'
          ? 10
          : 8

      if (!allowedTypes.has(mimeType)) {
        throw new Error('Formato multimedia no compatible')
      }

      if (
        !Number.isFinite(sizeBytes) ||
        sizeBytes <= 0 ||
        sizeBytes > maxBytes
      ) {
        throw new Error('Tamaño multimedia inválido')
      }

      if (
        !Number.isFinite(duration) ||
        duration <= 0 ||
        duration > maxDuration
      ) {
        throw new Error(
          kind === 'voice'
            ? 'El audio debe durar máximo 10 segundos'
            : 'El video debe durar máximo 8 segundos'
        )
      }

      /*
       * Confirma que el archivo realmente existe
       * en el bucket antes de registrar la fila.
       */
      const folder = storagePath
        .split('/')
        .slice(0, -1)
        .join('/')

      const fileName = storagePath
        .split('/')
        .pop()

      const { data: files, error: listError } =
        await sb.storage
          .from(bucket)
          .list(folder, {
            search: fileName,
            limit: 10
          })

      if (
        listError ||
        !files?.some(file => file.name === fileName)
      ) {
        throw new Error(
          'El archivo multimedia no fue encontrado'
        )
      }

      /*
       * Evita abuso accidental:
       * máximo 5 contenidos pendientes por visitante,
       * evento y tipo.
       */
      const { count } = await sb
        .from(table)
        .select('id', {
          count: 'exact',
          head: true
        })
        .eq('event_id', event_id)
        .eq('visitor_id', visitor_id)
        .eq('status', 'pending')

      if ((count || 0) >= 5) {
        await sb.storage
          .from(bucket)
          .remove([storagePath])

        throw new Error(
          'Ya tienes 5 contenidos pendientes de revisión'
        )
      }

      const payload =
        kind === 'voice'
          ? {
              event_id,
              visitor_id,
              display_name:
                display_name || null,
              storage_path: storagePath,
              mime_type: mimeType,
              duration_seconds:
                Math.max(1, Math.round(duration)),
              status: 'pending'
            }
          : {
              event_id,
              visitor_id,
              display_name:
                display_name || null,
              storage_path: storagePath,
              mime_type: mimeType,
              duration_seconds: duration,
              size_bytes: sizeBytes,
              status: 'pending'
            }

      const { data, error } = await sb
        .from(table)
        .insert(payload)
        .select('id')
        .single()

      if (error) {
        await sb.storage
          .from(bucket)
          .remove([storagePath])

        throw error
      }

      return json({
        ok: true,
        id: data.id,
        status: 'pending'
      })
    }

    /*
     * Desde aquí todas las acciones son del DJ.
     */
    const auth =
      req.headers.get('Authorization') || ''

    const jwt = auth.replace(/^Bearer\s+/, '')

    const {
      data: { user }
    } = await sb.auth.getUser(jwt)

    if (!user) {
      throw new Error('No autorizado')
    }

    if (event.user_id !== user.id) {
      throw new Error('Evento no autorizado')
    }

    const map: Record<
      string,
      [string, string | null]
    > = {
      voice: [
        'party_voice_messages',
        'party-voice'
      ],
      video: [
        'party_videos',
        'party-videos'
      ],
      story: [
        'party_music_stories',
        null
      ]
    }

    const config = map[kind]

    if (!config) {
      throw new Error('Tipo inválido')
    }

    const [table, bucket] = config

    if (action === 'list') {
      const { data, error } = await sb
        .from(table)
        .select('*')
        .eq('event_id', event_id)
        .order('created_at', {
          ascending: false
        })

      if (error) throw error

      const items = []

      for (const item of data || []) {
        if (bucket && item.storage_path) {
          const { data: signed } =
            await sb.storage
              .from(bucket)
              .createSignedUrl(
                item.storage_path,
                300
              )

          items.push({
            ...item,
            url:
              signed?.signedUrl || null
          })
        } else {
          items.push(item)
        }
      }

      return json({
        ok: true,
        items
      })
    }

    if (action === 'status') {
      if (
        ![
          'approved',
          'rejected',
          'played',
          'projected'
        ].includes(body.status)
      ) {
        throw new Error('Estado inválido')
      }

      const { error } = await sb
        .from(table)
        .update({
          status: body.status
        })
        .eq('id', id)
        .eq('event_id', event_id)

      if (error) throw error

      return json({ ok: true })
    }

    if (action === 'delete') {
      const { data: item } = await sb
        .from(table)
        .select('*')
        .eq('id', id)
        .eq('event_id', event_id)
        .single()

      if (
        bucket &&
        item?.storage_path
      ) {
        await sb.storage
          .from(bucket)
          .remove([item.storage_path])
      }

      const { error } = await sb
        .from(table)
        .delete()
        .eq('id', id)
        .eq('event_id', event_id)

      if (error) throw error

      return json({ ok: true })
    }

    throw new Error('Acción inválida')
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : String(error)
      },
      400
    )
  }
})
EOF