import {createClient} from 'npm:@supabase/supabase-js@2'

const cors={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'
}

Deno.serve(async req=>{
  if(req.method==='OPTIONS') return new Response('ok',{headers:cors})

  try{
    const token=(req.headers.get('Authorization')||'')
      .replace(/^Bearer\s+/i,'')
      .trim()

    if(!token) throw new Error('Falta token DJ')

    const parts=token.split('.')
    if(parts.length!==3) throw new Error('Token DJ inválido')

    const jwt=JSON.parse(
      atob(parts[1].replace(/-/g,'+').replace(/_/g,'/'))
    )

    if(!jwt.sub||jwt.role!=='authenticated'){
      throw new Error('DJ no autenticado')
    }

    const {event_id,action}=await req.json()
    if(!event_id) throw new Error('Falta event_id')

    const admin=createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const {data:event,error:eventError}=await admin
      .from('events')
      .select('id,name,owner_id')
      .eq('id',event_id)
      .single()

    if(eventError||!event) throw new Error('Evento no encontrado')
    if(event.owner_id!==jwt.sub) throw new Error('No eres propietario del evento')

    const directModules:any={
      requests:['song_requests','event_id'],
      reactions:['song_reactions','event_id'],
      greetings:['party_greetings','event_id'],
      karaoke:['karaoke_entries','event_id'],
      games:['party_game_sessions','event_id'],
      announcements:['event_announcements','event_id'],
      push:['event_push_subscriptions','event_id'],
      analytics:['event_visits','event_id']
    }

    const countDirect=async(table:string,column='event_id')=>{
      const {count,error}=await admin
        .from(table)
        .select('*',{count:'exact',head:true})
        .eq(column,event_id)

      if(error){
        console.warn('COUNT_DIRECT_FAILED',table,error.message)
        return 0
      }

      return count||0
    }

    const requestIds=async()=>{
      const {data,error}=await admin
        .from('song_requests')
        .select('id')
        .eq('event_id',event_id)

      if(error) throw error
      return (data||[]).map((x:any)=>x.id)
    }

    const countVotes=async(ids:string[])=>{
      if(!ids.length) return 0
      const {count,error}=await admin
        .from('song_votes')
        .select('*',{count:'exact',head:true})
        .in('request_id',ids)

      if(error) throw error
      return count||0
    }

    const getPhotos=async()=>{
      const {data,error}=await admin
        .from('party_photos')
        .select('id,storage_path,file_size')
        .eq('event_id',event_id)

      if(error){
        console.warn('PHOTO_STATS_FAILED',error.message)
        return []
      }

      return data||[]
    }

    const getStats=async()=>{
      const ids=await requestIds()
      const photos=await getPhotos()
      const stats:any={}

      for(const [key,[table,column]] of Object.entries(directModules) as any){
        stats[key]=await countDirect(table,column)
      }

      stats.votes=await countVotes(ids)
      stats.photos=photos.length
      stats.photo_bytes=photos.reduce(
        (sum:number,item:any)=>sum+Number(item.file_size||0),
        0
      )

      stats.total_rows=[
        'requests','votes','reactions','photos','greetings',
        'karaoke','games','announcements','push','analytics'
      ].reduce((sum,key)=>sum+Number(stats[key]||0),0)

      return {stats,request_ids:ids,photos}
    }

    const current=await getStats()

    if(action==='stats'){
      return Response.json(
        {
          ok:true,
          stats:current.stats,
          event_name:event.name
        },
        {headers:{...cors,'Content-Type':'application/json'}}
      )
    }

    const cleanupPhotos=async()=>{
      const photos=current.photos
      const paths=photos
        .map((x:any)=>x.storage_path)
        .filter(Boolean)

      if(paths.length){
        const {error}=await admin.storage
          .from('party-photos')
          .remove(paths)

        if(error) throw error
      }

      const bytes=photos.reduce(
        (sum:number,item:any)=>sum+Number(item.file_size||0),
        0
      )

      const {error}=await admin
        .from('party_photos')
        .delete()
        .eq('event_id',event_id)

      if(error) throw error
      return {rows:photos.length,bytes}
    }

    const cleanupVotes=async()=>{
      const ids=current.request_ids
      if(!ids.length) return {rows:0,bytes:0}

      const rows=await countVotes(ids)
      const {error}=await admin
        .from('song_votes')
        .delete()
        .in('request_id',ids)

      if(error) throw error
      return {rows,bytes:0}
    }

    const cleanupDirect=async(key:string)=>{
      const module=directModules[key]
      if(!module) throw new Error('Módulo no soportado')

      const [table,column]=module
      const rows=Number(current.stats[key]||0)
      const {error}=await admin
        .from(table)
        .delete()
        .eq(column,event_id)

      if(error) throw error
      return {rows,bytes:0}
    }

    const cleanup=async(key:string)=>{
      if(key==='photos') return cleanupPhotos()
      if(key==='votes') return cleanupVotes()
      return cleanupDirect(key)
    }

    let deletedRows=0
    let freedBytes=0

    if(action==='cleanup_all'){
      const {error:historyError}=await admin
        .from('event_history_summary')
        .insert({
          event_id,
          snapshot:{event_name:event.name,...current.stats},
          created_by:jwt.sub
        })

      if(historyError) throw historyError

      // Dependencias: votos y reacciones antes de peticiones.
      const cleanupOrder=[
        'photos','games','karaoke','greetings','announcements',
        'votes','reactions','requests','push','analytics'
      ]

      for(const key of cleanupOrder){
        const result=await cleanup(key)
        deletedRows+=result.rows
        freedBytes+=result.bytes
      }

      await admin
        .from('party_game_projection')
        .delete()
        .eq('event_id',event_id)

      await admin
        .from('social_live_projection')
        .delete()
        .eq('event_id',event_id)

      await admin
        .from('events')
        .update({
          featured_request_id:null,
          projected_photo_id:null,
          projected_photo_until:null,
          projected_greeting_id:null,
          projected_greeting_until:null,
          projected_karaoke_type:null,
          projected_karaoke_entry_id:null,
          projected_karaoke_until:null
        })
        .eq('id',event_id)
    }else if(String(action).startsWith('cleanup_')){
      const key=String(action).replace('cleanup_','')
      const result=await cleanup(key)
      deletedRows=result.rows
      freedBytes=result.bytes
    }else{
      throw new Error('Acción inválida')
    }

    const {error:logError}=await admin
      .from('event_cleanup_log')
      .insert({
        event_id,
        action,
        deleted_rows:deletedRows,
        freed_bytes:freedBytes,
        executed_by:jwt.sub
      })

    if(logError) console.warn('CLEANUP_LOG_FAILED',logError.message)

    return Response.json(
      {
        ok:true,
        deleted_rows:deletedRows,
        freed_bytes:freedBytes
      },
      {headers:{...cors,'Content-Type':'application/json'}}
    )
  }catch(error){
    const message=error instanceof Error?error.message:String(error)
    console.error('MANAGE_EVENT_DATA_ERROR',message)
    return Response.json(
      {ok:false,error:message},
      {status:400,headers:{...cors,'Content-Type':'application/json'}}
    )
  }
})
