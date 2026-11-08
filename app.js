'use strict';
const cfg=window.APP_CONFIG||{};
const configured=/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(cfg.SUPABASE_URL||'')&&!String(cfg.SUPABASE_PUBLISHABLE_KEY||'').startsWith('TU_');
const db=configured?supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;
const $=id=>document.getElementById(id); const el={guest:$('guest'),dj:$('dj'),djNav:$('djNav'),loginModal:$('loginModal'),loginForm:$('loginForm'),loginEmail:$('loginEmail'),loginPassword:$('loginPassword'),loginButton:$('loginButton'),loginNotice:$('loginNotice'),closeLogin:$('closeLogin'),requestForm:$('requestForm'),title:$('title'),artist:$('artist'),requester:$('requester'),message:$('message'),sendButton:$('sendButton'),notice:$('notice'),ranking:$('ranking'),djList:$('djList'),eventName:$('eventName'),djIdentity:$('djIdentity'),nRequests:$('nRequests'),nVotes:$('nVotes'),nQueue:$('nQueue'),refreshButton:$('refreshButton')};
const labels={pending:'Pendiente',accepted:'En lista',next:'Próxima',playing:'Sonando',played:'Reproducida',rejected:'Cerrada'};
let eventId=null,rows=[],session=null,channel=null;
const voterToken=localStorage.getItem('pide_tu_tema_voter')||crypto.randomUUID(); localStorage.setItem('pide_tu_tema_voter',voterToken);
function setNotice(text,error=false){el.notice.textContent=text;el.notice.style.color=error?'#fecdd3':'#a7f3d0'}
function showGuest(){el.guest.hidden=false;el.dj.hidden=true;document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.view==='guest'))}
async function openDj(){if(!configured){el.loginNotice.textContent='Completa config.js con Project URL y Publishable key.';el.loginModal.hidden=false;return}const {data}=await db.auth.getSession();session=data.session;if(!session){el.loginModal.hidden=false;setTimeout(()=>el.loginEmail.focus(),50);return}el.guest.hidden=true;el.dj.hidden=false;el.loginModal.hidden=true;document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===el.djNav));el.djIdentity.innerHTML=`<span>Sesión: ${esc(session.user.email)}</span><button class="logout" id="logoutBtn">Salir</button>`;$('logoutBtn').onclick=logout;await load()}
async function logout(){await db?.auth.signOut();session=null;showGuest();el.djIdentity.textContent=''}
async function load(){if(!db){setNotice('Falta configurar Supabase en config.js.',true);render();return}const {data:e,error}=await db.from('events').select('id,name').eq('slug',cfg.EVENT_SLUG).eq('is_active',true).maybeSingle();if(error||!e){setNotice('Evento no disponible. Revisa el slug y que esté activo.',true);return}eventId=e.id;el.eventName.textContent=e.name.toUpperCase()+' ✨';await refreshRows();if(channel)await db.removeChannel(channel);channel=db.channel(`event:${eventId}:requests`).on('postgres_changes',{event:'*',schema:'public',table:'song_requests',filter:`event_id=eq.${eventId}`},refreshRows).subscribe()}
async function refreshRows(){if(!db||!eventId)return;const {data,error}=await db.from('song_requests').select('id,title,artist,requester_name,message,votes,status,created_at').eq('event_id',eventId).neq('status','rejected').order('votes',{ascending:false}).order('created_at',{ascending:true});if(error){setNotice('No se pudieron cargar los pedidos.',true);return}rows=data||[];render()}
function songHTML(x,i,djMode=false){const actions=`<div class="actions"><button class="action" data-status="accepted" data-id="${x.id}">Aceptar</button><button class="action" data-status="next" data-id="${x.id}">Próxima</button><button class="action play" data-status="playing" data-id="${x.id}">Sonando</button><button class="action" data-status="played" data-id="${x.id}">Lista</button><button class="action close" data-status="rejected" data-id="${x.id}">Cerrar</button></div>`;return `<article class="song"><div class="rank">${i+1}</div><div class="song-info"><b>${esc(x.title)}</b><div class="meta">${esc(x.artist||'Artista por confirmar')} · ${esc(x.requester_name||'Invitado')}</div><span class="state">${labels[x.status]||x.status}</span></div>${djMode?actions:`<button class="vote" data-vote="${x.id}" aria-label="Votar por ${esc(x.title)}">♥ ${x.votes}</button>`}</article>`}
function render(){const visible=rows.filter(x=>x.status!=='played');const empty='<div class="empty">Aún no hay canciones. ¡Sé el primero en pedir! 🎶</div>';el.ranking.innerHTML=visible.length?visible.map((x,i)=>songHTML(x,i)).join(''):empty;el.djList.innerHTML=rows.length?rows.map((x,i)=>songHTML(x,i,true)).join(''):empty;el.nRequests.textContent=rows.length;el.nVotes.textContent=rows.reduce((a,x)=>a+x.votes,0);el.nQueue.textContent=rows.filter(x=>['accepted','next','playing'].includes(x.status)).length}
async function vote(id,button){button.disabled=true;const {error}=await db.rpc('vote_song',{request_id:id,voter_token:voterToken});button.disabled=false;if(error){setNotice(error.message.includes('duplicate')?'Ya votaste por esta canción. 💜':'No se pudo registrar el voto.',true)}else{setNotice('¡Voto registrado! 💜');await refreshRows()}}
async function setStatus(id,status){if(!session){el.loginModal.hidden=false;return}const {error}=await db.from('song_requests').update({status}).eq('id',id);if(error)alert('No autorizado para modificar este pedido.');else await refreshRows()}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

// 🔔 FUNCIÓN GLOBAL PARA MOSTRAR ALERTAS FLOTANTES EN LA CABINA
function mostrarNotificacionDJ(titulo, artista, invitado) {
  // Solo mostrar si el DJ está en su panel o la pantalla gigante está activa
  if (el.dj.hidden && el.tv.hidden) return;

  // Crear el contenedor flotante si no existe en el HTML
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  // Crear la tarjetita de la alerta
  const toast = document.createElement('div');
  toast.className = 'toast-alert';
  
  const nombreInvitado = invitado ? esc(invitado) : 'Un invitado';
  const nombreArtista = artista ? ` - ${esc(artista)}` : '';

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-size: 1.3rem;">🎵</span>
      <div style="flex: 1; min-width: 0;">
        <b style="color: var(--cyan); display: block; font-size: 0.85rem; letter-spacing: 0.5px;">¡NUEVO PEDIDO!</b>
        <span style="display: block; font-weight: bold; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${esc(titulo)}${nombreArtista}</span>
        <small style="color: var(--muted); font-size: 0.75rem;">Solicitado por: ${nombreInvitado}</small>
      </div>
    </div>
  `;

  // Añadir la alerta al contenedor de la pantalla
  container.appendChild(toast);

  // Remover la notificación automáticamente después de 4 segundos con animación
  setTimeout(() => {
    toast.style.animation = 'toast-leave 0.4s cubic-bezier(0.4, 0, 1, 1) forwards';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}


// ... Código anterior de la función load() se mantiene igual ...
eventId = e.id;
el.eventName.textContent = e.name.toUpperCase() + ' ✨';
await refreshRows();

if (channel) await db.removeChannel(channel);

// Configuración del canal en tiempo real optimizado con Notificaciones
channel = db.channel(`event:${eventId}:requests`)
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'song_requests', 
    filter: `event_id=eq.${eventId}` 
  }, (payload) => {
    // 🔔 Si entra una canción nueva y estás en el Panel DJ o Modo Pantalla, dispara la alerta
    if (payload.eventType === 'INSERT') {
      mostrarNotificacionDJ(payload.new.title, payload.new.artist, payload.new.requester_name);
    }
    // Actualiza la lista normalmente
    refreshRows();
  })
  .subscribe();




el.requestForm.addEventListener('submit',async e=>{e.preventDefault();if(!db||!eventId){setNotice('El evento todavía no está disponible.',true);return}el.sendButton.disabled=true;const payload={event_id:eventId,title:el.title.value.trim(),artist:el.artist.value.trim()||null,requester_name:el.requester.value.trim()||null,message:el.message.value.trim()||null};const {error}=await db.rpc('create_song_request',payload);el.sendButton.disabled=false;if(error){setNotice(error.message.includes('duplicate')?'Esa canción ya está en la lista. Mejor dale un corazón. ❤️':'No se pudo enviar el pedido.',true);return}el.requestForm.reset();setNotice('¡Pedido enviado al DJ! 🎉');await refreshRows()});
el.ranking.addEventListener('click',e=>{const b=e.target.closest('[data-vote]');if(b)vote(b.dataset.vote,b)});el.djList.addEventListener('click',e=>{const b=e.target.closest('[data-status]');if(b)setStatus(b.dataset.id,b.dataset.status)});
document.querySelector('[data-view="guest"]').onclick=showGuest;el.djNav.onclick=openDj;el.closeLogin.onclick=()=>el.loginModal.hidden=true;el.loginModal.onclick=e=>{if(e.target===el.loginModal)el.loginModal.hidden=true};el.refreshButton.onclick=refreshRows;
el.loginForm.onsubmit=async e=>{e.preventDefault();el.loginButton.disabled=true;el.loginNotice.textContent='Validando acceso…';const {data,error}=await db.auth.signInWithPassword({email:el.loginEmail.value.trim(),password:el.loginPassword.value});el.loginButton.disabled=false;if(error){el.loginNotice.textContent='Correo o contraseña incorrectos.';return}session=data.session;el.loginForm.reset();el.loginNotice.textContent='';await openDj()};



if(db)db.auth.onAuthStateChange((event,newSession)=>{session=newSession;if(event==='SIGNED_OUT')showGuest()});load();
