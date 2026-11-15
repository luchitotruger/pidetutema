import { createClient } from 'npm:@supabase/supabase-js@2'
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'}
Deno.serve(async(req)=>{if(req.method==='OPTIONS')return new Response('ok',{headers:cors});try{
 const auth=req.headers.get('Authorization')||'',token=auth.replace(/^Bearer\s+/i,'').trim();if(!token)throw new Error('Falta token DJ')
 const parts=token.split('.');if(parts.length!==3)throw new Error('Token DJ invalido')
 const jwt=JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/')));if(!jwt.sub||jwt.role!=='authenticated')throw new Error('DJ no autenticado')
 const userId=jwt.sub as string,{action,event_id,greeting_id}=await req.json();if(!event_id)throw new Error('Falta event_id')
 const admin=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
 const {data:event,error:ee}=await admin.from('events').select('id,owner_id,projected_greeting_id').eq('id',event_id).single();if(ee||!event)throw new Error('Evento no encontrado');if(event.owner_id!==userId)throw new Error('No eres propietario del evento')
 const base=admin.from('party_greetings').select('id,status').eq('event_id',event_id)
 if(action==='stats'){const {data,error}=await base;if(error)throw error;const rows=data||[],stats={total:rows.length,pending:0,approved:0,rejected:0};rows.forEach(x=>{if(x.status in stats)(stats as any)[x.status]++});return Response.json({ok:true,stats},{headers:{...cors,'Content-Type':'application/json'}})}
 if(!['delete_one','delete_rejected','delete_event'].includes(action))throw new Error('Accion invalida')
 let q=base;if(action==='delete_one'){if(!greeting_id)throw new Error('Falta greeting_id');q=q.eq('id',greeting_id)}else if(action==='delete_rejected')q=q.eq('status','rejected')
 const {data,error}=await q;if(error)throw error;const ids=(data||[]).map(x=>x.id)
 if(!ids.length)return Response.json({ok:true,deleted:0},{headers:{...cors,'Content-Type':'application/json'}})
 if(event.projected_greeting_id&&ids.includes(event.projected_greeting_id)){const {error}=await admin.from('events').update({projected_greeting_id:null,projected_greeting_until:null}).eq('id',event_id);if(error)throw error}
 const {error:de}=await admin.from('party_greetings').delete().in('id',ids);if(de)throw de
 await admin.from('party_greeting_cleanup_log').insert({event_id,greeting_id:action==='delete_one'?greeting_id:null,action,deleted_count:ids.length,deleted_by:userId})
 return Response.json({ok:true,deleted:ids.length},{headers:{...cors,'Content-Type':'application/json'}})
 }catch(e){const m=e instanceof Error?e.message:String(e);console.error('MANAGE_PARTY_GREETINGS_ERROR:',m);return Response.json({ok:false,error:m},{status:400,headers:{...cors,'Content-Type':'application/json'}})}})
