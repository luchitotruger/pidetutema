import { createClient } from 'npm:@supabase/supabase-js@2'
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'}
Deno.serve(async(req)=>{if(req.method==='OPTIONS')return new Response('ok',{headers:cors});try{
 const auth=req.headers.get('Authorization')||'',token=auth.replace(/^Bearer\s+/i,'').trim();if(!token)throw new Error('Falta token DJ')
 const parts=token.split('.');if(parts.length!==3)throw new Error('Token DJ invalido');const jwt=JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/')));if(!jwt.sub||jwt.role!=='authenticated')throw new Error('DJ no autenticado')
 const userId=jwt.sub as string,{action,event_id,entry_id}=await req.json();if(!event_id)throw new Error('Falta event_id')
 const admin=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
 const {data:event,error:ee}=await admin.from('events').select('id,owner_id,projected_karaoke_entry_id').eq('id',event_id).single();if(ee||!event)throw new Error('Evento no encontrado');if(event.owner_id!==userId)throw new Error('No eres propietario del evento')
 if(action==='stats'){
  const [{data:r},{data:e},{data:v}]=await Promise.all([admin.from('karaoke_rounds').select('id,status').eq('event_id',event_id),admin.from('karaoke_entries').select('id,status').eq('event_id',event_id),admin.from('karaoke_ratings').select('id').eq('event_id',event_id)])
  const entries=e||[];return Response.json({ok:true,stats:{rounds:(r||[]).length,entries:entries.length,finished:entries.filter(x=>x.status==='finished').length,ratings:(v||[]).length}},{headers:{...cors,'Content-Type':'application/json'}})
 }
 if(!['delete_one','delete_finished','delete_event'].includes(action))throw new Error('Accion invalida')
 let entries:any[]=[]
 if(action==='delete_event'){const {data,error}=await admin.from('karaoke_entries').select('id').eq('event_id',event_id);if(error)throw error;entries=data||[]}
 else {let q=admin.from('karaoke_entries').select('id').eq('event_id',event_id);if(action==='delete_one'){if(!entry_id)throw new Error('Falta entry_id');q=q.eq('id',entry_id)}else q=q.eq('status','finished');const {data,error}=await q;if(error)throw error;entries=data||[]}
 const ids=entries.map(x=>x.id);let ratingCount=0;if(ids.length){const {count}=await admin.from('karaoke_ratings').select('id',{count:'exact',head:true}).in('entry_id',ids);ratingCount=count||0}
 if(event.projected_karaoke_entry_id&&ids.includes(event.projected_karaoke_entry_id)){const {error}=await admin.from('events').update({projected_karaoke_type:null,projected_karaoke_entry_id:null,projected_karaoke_until:null}).eq('id',event_id);if(error)throw error}
 if(ids.length){const {error}=await admin.from('karaoke_entries').delete().in('id',ids);if(error)throw error}
 let roundCount=0;if(action==='delete_event'){
  await admin.from('events').update({projected_karaoke_type:null,projected_karaoke_entry_id:null,projected_karaoke_until:null}).eq('id',event_id)
  const {data:rounds}=await admin.from('karaoke_rounds').select('id').eq('event_id',event_id);roundCount=(rounds||[]).length
  if(roundCount){const {error}=await admin.from('karaoke_rounds').delete().eq('event_id',event_id);if(error)throw error}
 }
 await admin.from('karaoke_cleanup_log').insert({event_id,action,deleted_entries:ids.length,deleted_ratings:ratingCount,deleted_rounds:roundCount,deleted_by:userId})
 return Response.json({ok:true,deleted_entries:ids.length,deleted_ratings:ratingCount,deleted_rounds:roundCount},{headers:{...cors,'Content-Type':'application/json'}})
 }catch(e){const m=e instanceof Error?e.message:String(e);console.error('MANAGE_KARAOKE_ERROR:',m);return Response.json({ok:false,error:m},{status:400,headers:{...cors,'Content-Type':'application/json'}})}})
