import { createClient } from 'npm:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'}
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors})
 try{
  const auth=req.headers.get('Authorization')||''
  const supabaseUrl=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const userClient=createClient(supabaseUrl,anon,{global:{headers:{Authorization:auth}}})
  const {data:{user},error:ue}=await userClient.auth.getUser();if(ue||!user)throw new Error('DJ no autenticado')
  const body=await req.json(),{event_id,message,priority='important',duration_seconds=15,sound_enabled=true}=body
  if(!event_id||!String(message||'').trim())throw new Error('Faltan evento o mensaje')
  const admin=createClient(supabaseUrl,service)
  const {data:event,error:ee}=await admin.from('events').select('id,slug,owner_id').eq('id',event_id).single();if(ee||!event)throw new Error('Evento no encontrado');if(event.owner_id!==user.id)throw new Error('No eres propietario del evento')
  const {data:announcement,error:ae}=await admin.from('event_announcements').insert({event_id,message:String(message).trim().slice(0,240),priority,duration_seconds,sound_enabled,is_active:true,expires_at:Number(duration_seconds)>0?new Date(Date.now()+Number(duration_seconds)*1000).toISOString():null}).select('id').single();if(ae)throw ae
  const {data:subs,error:se}=await admin.from('event_push_subscriptions').select('id,endpoint,p256dh,auth').eq('event_id',event_id).eq('is_active',true);if(se)throw se
  webpush.setVapidDetails(Deno.env.get('VAPID_SUBJECT')!,Deno.env.get('VAPID_PUBLIC_KEY')!,Deno.env.get('VAPID_PRIVATE_KEY')!)
  const payload=JSON.stringify({title:'Pide Tu Tema · Luis DJ',body:String(message).trim(),priority,announcement_id:announcement.id,event_id,url:`/?evento=${encodeURIComponent(event.slug)}`})
  let sent=0,failed=0;const dead:string[]=[]
  await Promise.all((subs||[]).map(async s=>{try{await webpush.sendNotification({endpoint:s.endpoint,keys:{p256dh:s.p256dh,auth:s.auth}},payload,{TTL:3600,urgency:priority==='urgent'?'high':'normal'});sent++}catch(e){failed++;const code=(e as any)?.statusCode;if(code===404||code===410)dead.push(s.id)}}))
  if(dead.length)await admin.from('event_push_subscriptions').update({is_active:false,updated_at:new Date().toISOString()}).in('id',dead)
  return Response.json({ok:true,announcement_id:announcement.id,subscribed:(subs||[]).length,sent,failed},{headers:{...cors,'Content-Type':'application/json'}})
 }catch(e){return Response.json({ok:false,error:e instanceof Error?e.message:String(e)},{status:400,headers:{...cors,'Content-Type':'application/json'}})}
})
