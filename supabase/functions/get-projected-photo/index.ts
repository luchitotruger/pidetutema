import { createClient } from 'npm:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors })
  }

  try {
    const { event_id } = await req.json()

    if (!event_id) {
      throw new Error('Falta event_id')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const admin = createClient(supabaseUrl, service)

    const { data: event, error: eventError } = await admin
      .from('events')
      .select('projected_photo_id,projected_photo_until')
      .eq('id', event_id)
      .single()

    if (eventError || !event) {
      throw new Error('Evento no encontrado')
    }

    if (
      !event.projected_photo_id ||
      !event.projected_photo_until ||
      new Date(event.projected_photo_until).getTime() <= Date.now()
    ) {
      return Response.json(
        { ok: true, photo: null },
        { headers: { ...cors, 'Content-Type': 'application/json' } }
      )
    }

    const { data: photo, error: photoError } = await admin
      .from('party_photos')
      .select('id,storage_path,status')
      .eq('id', event.projected_photo_id)
      .eq('event_id', event_id)
      .eq('status', 'approved')
      .single()

    if (photoError || !photo) {
      throw new Error('Foto aprobada no encontrada')
    }

    const { data: signed, error: signedError } = await admin.storage
      .from('party-photos')
      .createSignedUrl(photo.storage_path, 60)

    if (signedError || !signed?.signedUrl) {
      throw new Error(
        signedError?.message || 'No se pudo generar Signed URL'
      )
    }

    return Response.json(
      {
        ok: true,
        photo: {
          id: photo.id,
          url: signed.signedUrl,
          until: event.projected_photo_until
        }
      },
      {
        headers: {
          ...cors,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)

    console.error('GET_PROJECTED_PHOTO_ERROR:', message)

    return Response.json(
      { ok: false, error: message },
      {
        status: 400,
        headers: {
          ...cors,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
