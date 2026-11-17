import { createClient } from 'npm:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'}
const json=(body:any,status=200)=>Response.json(body,{status,headers:{...cors,'Content-Type':'application/json'}})
Deno.serve(async(req)=>{if(req.method==='OPTIONS')return new Response('ok',{headers:cors});try{
 const auth=req.headers.get('Authorization')||'',token=auth.replace(/^Bearer\s+/i,'').trim();if(!token)throw new Error('Falta token de autenticación')
 const admin=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
 const parts=token.split('.');if(parts.length!==3)throw new Error('Token inválido');const jwt=JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/')))
 const body=await req.json();const {event_id,message,priority='important',duration_seconds=15,sound_enabled=true,target_visitor_id=null,karaoke_entry_id=null,notification_type='announcement',title=null}=body;if(!event_id||!String(message||'').trim())throw new Error('Faltan evento o mensaje')
 const {data:event,error:ee}=await admin.from('events').select('id,slug,owner_id,is_active').eq('id',event_id).single();if(ee||!event)throw new Error('Evento no encontrado')
 const isPushTest=notification_type==='push_test'
 if(isPushTest){
  const visitor=String(target_visitor_id||'').trim();if(!visitor)throw new Error('Falta dispositivo para la prueba');if(!event.is_active)throw new Error('Evento no disponible')
  const {error:testError}=await admin.rpc(
    'register_push_test_v54461',
    {
      p_event_id:event_id,
      p_visitor_id:visitor
    }
  )
  if(testError)throw testError
 }else{
  if(!jwt.sub||jwt.role!=='authenticated')throw new Error('Usuario DJ no autenticado');if(event.owner_id!==jwt.sub)throw new Error('No eres propietario del evento')
 }
 let targetVisitor=target_visitor_id?String(target_visitor_id):null,singerName='',songTitle='',songArtist='',nominationType='self'
 if(notification_type==='karaoke_call'){
  if(!karaoke_entry_id)throw new Error('Falta karaoke_entry_id');const {data:entry,error:ke}=await admin.from('karaoke_entries').select('id,event_id,visitor_id,singer_name,song_title,song_artist,nomination_type').eq('id',karaoke_entry_id).eq('event_id',event_id).single();if(ke||!entry)throw new Error('Participación Karaoke no encontrada');targetVisitor=entry.visitor_id;singerName=entry.singer_name;songTitle=entry.song_title;songArtist=entry.song_artist||'';nominationType=entry.nomination_type||'self';const {data:last}=await admin.from('karaoke_call_alerts').select('last_sent_at,send_count').eq('entry_id',entry.id).maybeSingle();if(last&&Date.now()-new Date(last.last_sent_at).getTime()<15000)throw new Error('Espera 15 segundos antes de volver a llamar');await admin.from('karaoke_call_alerts').upsert({entry_id:entry.id,event_id,last_sent_at:new Date().toISOString(),send_count:Number(last?.send_count||0)+1})
 }
 let announcementId:string|null=null;if(notification_type==='announcement'){const {data:a,error:ae}=await admin.from('event_announcements').insert({event_id,message:String(message).trim().slice(0,240),priority,duration_seconds,sound_enabled,is_active:true,expires_at:Number(duration_seconds)>0?new Date(Date.now()+Number(duration_seconds)*1000).toISOString():null}).select('id').single();if(ae)throw ae;announcementId=a.id}
 let q=admin.from('event_push_subscriptions').select('id,endpoint,p256dh,auth,visitor_id').eq('event_id',event_id).eq('is_active',true);if(targetVisitor)q=q.eq('visitor_id',targetVisitor);const {data:subs,error:se}=await q;if(se)throw se
 if(isPushTest&&(subs||[]).length===0)throw new Error('No existe una suscripción activa para este dispositivo. Pulsa Reparar avisos.')
 webpush.setVapidDetails(Deno.env.get('VAPID_SUBJECT')!,Deno.env.get('VAPID_PUBLIC_KEY')!,Deno.env.get('VAPID_PRIVATE_KEY')!)
 const payload=JSON.stringify({title:title||'Pide Tu Tema · Luis DJ',body:String(message).trim(),priority,announcement_id:announcementId,event_id,url:`/?evento=${encodeURIComponent(event.slug)}&karaoke=call&entry=${encodeURIComponent(karaoke_entry_id||'')}`,notification_type,karaoke_entry_id,singer_name:singerName,song_title:songTitle,song_artist:songArtist,nomination_type:nominationType,require_interaction:notification_type==='karaoke_call'})
 let sent=0,failed=0;const dead:string[]=[];await Promise.all((subs||[]).map(async s=>{try{await webpush.sendNotification({endpoint:s.endpoint,keys:{p256dh:s.p256dh,auth:s.auth}},payload,{TTL:notification_type==='karaoke_call'?300:isPushTest?60:3600,urgency:priority==='urgent'?'high':'normal'});sent++}catch(e){failed++;const code=(e as any)?.statusCode;if(code===404||code===410)dead.push(s.id)}}));if(dead.length)await admin.from('event_push_subscriptions').update({is_active:false,updated_at:new Date().toISOString()}).in('id',dead)
 return json({ok:true,announcement_id:announcementId,targeted:!!targetVisitor,subscribed:(subs||[]).length,sent,failed})
 }catch(e){const message=e instanceof Error?e.message:String(e);console.error('SEND_EVENT_PUSH_ERROR:',message);return json({ok:false,error:message},400)}})
