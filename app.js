const cfg=window.APP_CONFIG;
const configured=!cfg.SUPABASE_URL.startsWith('TU_');
const db=configured?supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;
let demo=[{id:'1',title:'Mentirosa',artist:'Ráfaga',requester_name:'Carolina · Mesa 4',votes:18,status:'pending'},{id:'2',title:'Vino y Cerveza',artist:'Amar Azul',requester_name:'Mesa 7',votes:14,status:'accepted'}];
const labels={pending:'Pendiente',accepted:'En lista',next:'Próxima',playing:'Sonando',played:'Reproducida',rejected:'Cerrada'};
let eventId=null, rows=[], session=null, channel=null;

const showGuest=()=>{guest.hidden=false;dj.hidden=true;document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view==='guest'))};
async function openDj(){
 if(!configured){loginNotice.textContent='Configura Supabase en config.js antes de acceder.';loginModal.hidden=false;return}
 const {data}=await db.auth.getSession(); session=data.session;
 if(!session){loginModal.hidden=false;setTimeout(()=>loginEmail.focus(),50);return}
 guest.hidden=true;dj.hidden=false;loginModal.hidden=true;document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view==='dj'));
 djIdentity.innerHTML=`<span>Sesión: ${esc(session.user.email)}</span><button class="logout" id="logoutBtn">Salir</button>`;
 document.getElementById('logoutBtn').onclick=logout; await load();
}
document.querySelector('[data-view="guest"]').onclick=showGuest;
djNav.onclick=openDj; closeLogin.onclick=()=>loginModal.hidden=true;
loginModal.onclick=e=>{if(e.target===loginModal)loginModal.hidden=true};
loginForm.onsubmit=async e=>{
 e.preventDefault(); loginButton.disabled=true; loginNotice.textContent='Validando acceso…';
 const {data,error}=await db.auth.signInWithPassword({email:loginEmail.value.trim(),password:loginPassword.value});
 loginButton.disabled=false;
 if(error){loginNotice.textContent='Correo o contraseña incorrectos.';return}
 session=data.session; loginForm.reset(); loginNotice.textContent=''; await openDj();
};
async function logout(){if(db)await db.auth.signOut();session=null;showGuest();djIdentity.textContent='';}
if(db)db.auth.onAuthStateChange((event,newSession)=>{session=newSession;if(event==='SIGNED_OUT')showGuest()});

async function load(){
 if(!db){rows=demo;render();return}
 const {data:e,error}=await db.from('events').select('id').eq('slug',cfg.EVENT_SLUG).eq('is_active',true).single();
 if(error){notice.textContent='Evento no disponible.';return}
 eventId=e.id;
 const {data,error:reqError}=await db.from('song_requests').select('*').eq('event_id',eventId).neq('status','rejected').order('votes',{ascending:false});
 if(reqError){notice.textContent='No se pudieron cargar los pedidos.';return}
 rows=data||[];render();
 if(channel)await db.removeChannel(channel);
 channel=db.channel('requests-'+eventId).on('postgres_changes',{event:'*',schema:'public',table:'song_requests',filter:'event_id=eq.'+eventId},()=>refreshRows()).subscribe();
}
async function refreshRows(){if(!db||!eventId)return;const {data}=await db.from('song_requests').select('*').eq('event_id',eventId).neq('status','rejected').order('votes',{ascending:false});rows=data||[];render()}
function songHTML(x,i,djMode=false){return `<div class="song"><div class="rank">${i+1}</div><div class="song-info"><b>${esc(x.title)}</b><div class="meta">${esc(x.artist||'Artista por confirmar')} · ${esc(x.requester_name||'Invitado')}</div><div class="state">${labels[x.status]||x.status}</div></div>${djMode?`<div class="actions"><button class="action accept" onclick="setStatus('${x.id}','accepted')">Aceptar</button><button class="action next" onclick="setStatus('${x.id}','next')">Próxima</button><button class="action play" onclick="setStatus('${x.id}','playing')">Sonando</button><button class="action close" onclick="setStatus('${x.id}','rejected')">Cerrar</button></div>`:`<button class="vote" onclick="vote('${x.id}')">♥ ${x.votes}</button>`}</div>`}
function render(){rows.sort((a,b)=>b.votes-a.votes);ranking.innerHTML=rows.map((x,i)=>songHTML(x,i)).join('');djList.innerHTML=rows.map((x,i)=>songHTML(x,i,true)).join('');nRequests.textContent=rows.length;nVotes.textContent=rows.reduce((a,x)=>a+x.votes,0);nQueue.textContent=rows.filter(x=>['accepted','next','playing'].includes(x.status)).length}
requestForm.onsubmit=async e=>{e.preventDefault();const row={event_id:eventId,title:title.value.trim(),artist:artist.value.trim(),requester_name:requester.value.trim(),message:message.value.trim(),votes:1,status:'pending'};if(!row.title)return;if(db){if(!eventId)await load();row.event_id=eventId;const {error}=await db.from('song_requests').insert(row);if(error)return notice.textContent='No se pudo enviar el pedido.'}else{row.id=Date.now().toString();demo.unshift(row);rows=demo;render()}requestForm.reset();notice.textContent='¡Pedido enviado al DJ! 🎉'};
async function vote(id){const x=rows.find(r=>r.id==id);if(!x)return;if(db){const {error}=await db.rpc('vote_song',{request_id:id});if(error)notice.textContent='No se pudo registrar el voto.'}else{x.votes++;render()}}
async function setStatus(id,status){
 if(!db||!session){loginModal.hidden=false;return}
 const {error}=await db.from('song_requests').update({status}).eq('id',id);
 if(error){alert('No autorizado para modificar este pedido.');return}
 await refreshRows();
}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
load();
