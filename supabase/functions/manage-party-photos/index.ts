import { createClient } from 'npm:@supabase/supabase-js@2'

const cors={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'
}

Deno.serve(async(req)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors})
  try{
    const auth=req.headers.get('Authorization')||''
    const token=auth.replace(/^Bearer\s+/i,'').trim()
    if(!token)throw new Error('Falta token DJ')
    const parts=token.split('.')
    if(parts.length!==3)throw new Error('Token DJ invalido')
    const jwt=JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/')))
    if(!jwt.sub||jwt.role!=='authenticated')throw new Error('DJ no autenticado')
    const userId=jwt.sub as string

    const body=await req.json()
    const action=String(body.action||'')
    const eventId=String(body.event_id||'')
    const photoId=body.photo_id?String(body.photo_id):null
    if(!eventId)throw new Error('Falta event_id')

    const admin=createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    const {data:event,error:eventError}=await admin.from('events')
      .select('id,owner_id,projected_photo_id').eq('id',eventId).single()
    if(eventError||!event)throw new Error('Evento no encontrado')
    if(event.owner_id!==userId)throw new Error('No eres propietario del evento')

    const base=admin.from('party_photos').select('id,storage_path,status').eq('event_id',eventId)
    let photos:any[]=[]
    if(action==='stats'){
      const {data,error}=await base
      if(error)throw error
      photos=data||[]
      const paths=photos.map(x=>x.storage_path)
      let bytes=0
      for(let i=0;i<paths.length;i+=100){
        const chunk=paths.slice(i,i+100)
        for(const path of chunk){
          const folder=path.split('/').slice(0,-1).join('/')
          const name=path.split('/').pop()!
          const {data:list}=await admin.storage.from('party-photos').list(folder,{search:name,limit:10})
          const obj=(list||[]).find(x=>x.name===name)
          bytes+=Number(obj?.metadata?.size||0)
        }
      }
      const counts={pending:0,approved:0,rejected:0,total:photos.length}
      photos.forEach(x=>{if(x.status in counts)(counts as any)[x.status]++})
      return Response.json({ok:true,stats:{...counts,bytes}},{headers:{...cors,'Content-Type':'application/json'}})
    }

    if(!['delete_one','delete_rejected','delete_event'].includes(action))throw new Error('Accion invalida')
    let query=base
    if(action==='delete_one'){
      if(!photoId)throw new Error('Falta photo_id')
      query=query.eq('id',photoId)
    }else if(action==='delete_rejected')query=query.eq('status','rejected')
    const {data,error}=await query
    if(error)throw error
    photos=data||[]
    if(!photos.length)return Response.json({ok:true,deleted:0,bytes:0},{headers:{...cors,'Content-Type':'application/json'}})

    const ids=photos.map(x=>x.id),paths=photos.map(x=>x.storage_path)
    let bytes=0
    for(const path of paths){
      const folder=path.split('/').slice(0,-1).join('/')
      const name=path.split('/').pop()!
      const {data:list}=await admin.storage.from('party-photos').list(folder,{search:name,limit:10})
      const obj=(list||[]).find(x=>x.name===name)
      bytes+=Number(obj?.metadata?.size||0)
    }

    if(event.projected_photo_id&&ids.includes(event.projected_photo_id)){
      const {error}=await admin.from('events').update({projected_photo_id:null,projected_photo_until:null}).eq('id',eventId)
      if(error)throw error
    }

    // Supabase recomienda borrar objetos con Storage API, no con DELETE SQL.
    for(let i=0;i<paths.length;i+=1000){
      const {error}=await admin.storage.from('party-photos').remove(paths.slice(i,i+1000))
      if(error)throw error
    }
    const {error:deleteError}=await admin.from('party_photos').delete().in('id',ids)
    if(deleteError)throw deleteError
    await admin.from('party_photo_cleanup_log').insert({
      event_id:eventId,photo_id:action==='delete_one'?photoId:null,action,
      deleted_count:ids.length,deleted_bytes:bytes,deleted_by:userId
    })
    return Response.json({ok:true,deleted:ids.length,bytes},{headers:{...cors,'Content-Type':'application/json'}})
  }catch(e){
    const message=e instanceof Error?e.message:String(e)
    console.error('MANAGE_PARTY_PHOTOS_ERROR:',message)
    return Response.json({ok:false,error:message},{status:400,headers:{...cors,'Content-Type':'application/json'}})
  }
})
