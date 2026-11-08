'use strict';

const cfg = window.APP_CONFIG || {};
// Valida si la URL de Supabase tiene el formato correcto y la clave no se quedó con el ejemplo por defecto
const configured = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(cfg.SUPABASE_URL || '') && !String(cfg.SUPABASE_PUBLISHABLE_KEY || '').startsWith('TU_');

const db = configured ? supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
}) : null;

// Atajos del DOM
const $ = id => document.getElementById(id); 
const el = {
  guest: $('guest'),
  dj: $('dj'),
  djNav: $('djNav'),
  loginModal: $('loginModal'),
  loginForm: $('loginForm'),
  loginEmail: $('loginEmail'),
  loginPassword: $('loginPassword'),
  loginButton: $('loginButton'),
  loginNotice: $('loginNotice'),
  closeLogin: $('closeLogin'),
  requestForm: $('requestForm'),
  title: $('title'),
  artist: $('artist'),
  requester: $('requester'),
  message: $('message'),
  sendButton: $('sendButton'),
  notice: $('notice'),
  ranking: $('ranking'),
  djList: $('djList'),
  djSearch: $('djSearch'), //  x.classList.toggle('active', x.dataset.view === 'guest'));
}

// 🛠️ MODO DESARROLLO: Función modificada para saltarse el Login temporalmente y ajustar el panel
async function openDj() {
  // CONFIGURACIÓN DE PRUEBA: Forzamos una sesión simulada localmente
  session = {
    user: { email: 'luchitotruger@gmail.com' }
  };

  el.guest.hidden = true;
  el.dj.hidden = false;
  el.loginModal.hidden = true;
  
  document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x === el.djNav));
  
  el.djIdentity.innerHTML = `<span>Sesión (Modo Dev): ${esc(session.user.email)}</span><button class="logout" id="logoutBtn">Salir</button>`;
  $('logoutBtn').onclick = logout;
  
  // Intenta descargar los datos de tu Supabase directamente
  await load();
}

async function logout() {
  await db?.auth.signOut();
  session = null;
  showGuest();
  el.djIdentity.textContent = '';
}

async function load() {
  if (!db) {
    setNotice('Falta configurar Supabase en config.js.', true);
    render();
    return;
  }
  const { data: e, error } = await db.from('events').select('id,name').eq('slug', cfg.EVENT_SLUG).eq('is_active', true).maybeSingle();
  if (error || !e) {
    setNotice('Evento no disponible. Revisa el slug y que esté activo.', true);
    return;
  }
  eventId = e.id;
  el.eventName.textContent = e.name.toUpperCase() + ' ✨';
  await refreshRows();
  
  if (channel) await db.removeChannel(channel);
  channel = db.channel(`event:${eventId}:requests`).on('postgres_changes', { event: '*', schema: 'public', table: 'song_requests', filter: `event_id=eq.${eventId}` }, refreshRows).subscribe();
}

async function refreshRows() {
  if (!db || !eventId) return;
  const { data, error } = await db.from('song_requests').select('id,title,artist,requester_name,message,votes,status,created_at').eq('event_id', eventId).neq('status', 'rejected').order('votes', { ascending: false }).order('created_at', { ascending: true });
  if (error) {
    setNotice('No se pudieron cargar los pedidos.', true);
    return;
  }
  rows = data || [];
  render();
}

function songHTML(x, i, djMode = false) {
  if (djMode) {
    const isPast = ['played', 'rejected'].includes(x.status);
    const isPlaying = x.status === 'playing';
    
    const actions = `<div class="actions">
      <button class="action ${x.status === 'accepted' ? 'active-status' : ''}" data-status="accepted" data-id="${x.id}" ${x.status === 'accepted' ? 'disabled' : ''}>Aceptar</button>
      <button class="action ${x.status === 'next' ? 'active-status' : ''}" data-status="next" data-id="${x.id}" ${x.status === 'next' ? 'disabled' : ''}>Próxima</button>
      <button class="action play ${isPlaying ? 'blink-status' : ''}" data-status="playing" data-id="${x.id}" ${isPlaying ? 'disabled' : ''}>Sonando</button>
      <button class="action" data-status="played" data-id="${x.id}">Lista</button>
      <button class="action close" data-status="rejected" data-id="${x.id}">Cerrar</button>
    </div>`;

    return `<article class="song ${isPlaying ? 'dj-playing' : ''} ${isPast ? 'dj-past' : ''}">
      <div class="rank" style="background: ${isPlaying ? 'var(--cyan)' : 'linear-gradient(135deg,#7c3aed,#db2777)'}">${x.votes} ♥</div>
      <div class="song-info">
        <b>${esc(x.title)}</b>
        <div class="meta">${esc(x.artist || 'Artista por confirmar')} · ${esc(x.requester_name || 'Invitado')}</div>
        <span class="state" style="color: ${isPlaying ? 'var(--cyan)' : 'var(--muted)'}">${labels[x.status] || x.status}</span>
      </div>
      ${actions}
    </article>`;
  }

  // Vista de Invitados
  return `<article class="song ${x.status === 'playing' ? 'blink-status' : ''}">
    <div class="rank">${i + 1}</div>
    <div class="song-info">
      <b>${esc(x.title)}</b>
      <div class="meta">${esc(x.artist || 'Artista por confirmar')} · ${esc(x.requester_name || 'Invitado')}</div>
      <span class="state">${labels[x.status] || x.status}</span>
    </div>
    <button class="vote" data-vote="${x.id}" aria-label="Votar por ${esc(x.title)}">♥ ${x.votes}</button>
  </article>`;
}

function render() {
  const visible = rows.filter(x => x.status !== 'played');
  const empty = '<div class="empty">Aún no hay canciones. ¡Sé el primero en pedir! 🎶</div>';
  
  // Renderizado del lado del Invitado
  el.ranking.innerHTML = visible.length ? visible.map((x, i) => songHTML(x, i)).join('') : empty;
  
  // Renderizado del lado del DJ aplicando filtros locales
  let djRows = rows;
  if (djFilterText) {
    djRows = rows.filter(x => 
      x.title.toLowerCase().includes(djFilterText) || 
      (x.artist && x.artist.toLowerCase().includes(djFilterText)) || 
      (x.requester_name && x.requester_name.toLowerCase().includes(djFilterText))
    );
  }
  
  el.djList.innerHTML = djRows.length ? djRows.map((x, i) => songHTML(x, i, true)).join('') : '<div class="empty">No se encontraron canciones. 🎧</div>';
  
  // Actualización de contadores de estadísticas globales
  el.nRequests.textContent = rows.length;
  el.nVotes.textContent = rows.reduce((a, x) => a + x.votes, 0);
  el.nQueue.textContent = rows.filter(x => ['accepted', 'next', 'playing'].includes(x.status)).length;
}

async function vote(id, button) {
  button.disabled = true;
  const { error } = await db.rpc('vote_song', { request_id: id, voter_token: voterToken });
  button.disabled = false;
  
  if (error) {
    if (error.message.includes('duplicate_vote')) {
      setNotice('Ya votaste por esta canción. 💜', true);
    } else if (error.message.includes('event_inactive')) {
      setNotice('El evento ya no está aceptando interacciones.', true);
    } else {
      setNotice('No se pudo registrar el voto.', true);
    }
  } else {
    setNotice('¡Voto registrado! 💜');
    await refreshRows();
  }
}

async function setStatus(id, status) {
  if (!session) {
    el.loginModal.hidden = false;
    return;
  }
  
  // Deshabilitar temporalmente los clics del DJ mientras procesa la transacción en la base de datos
  el.djList.style.pointerEvents = 'none';
  el.djList.style.opacity = '0.7';

  const { error } = await db.from('song_requests').update({ status }).eq('id', id);
  
  el.djList.style.pointerEvents = 'auto';
  el.djList.style.opacity = '1';

  if (error) alert('No autorizado para modificar este pedido o sesión expirada.');
  else await refreshRows();
}

function esc(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Escucha en tiempo real la barra de búsqueda del DJ
if (el.djSearch) {
  el.djSearch.addEventListener('input', e => {
    djFilterText = e.target.value.toLowerCase().trim();
    render();
  });
}

el.requestForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!db || !eventId) {
    setNotice('El evento todavía no está disponible.', true);
    return;
  }
  el.sendButton.disabled = true;
  const payload = { event_id: eventId, title: el.title.value.trim(), artist: el.artist.value.trim() || null, requester_name: el.requester.value.trim() || null, message: el.message.value.trim() || null };
  const { error } = await db.rpc('create_song_request', payload);
  el.sendButton.disabled = false;
  if (error) {
    setNotice(error.message.includes('duplicate') ? 'Esa canción ya está en la lista. Mejor dale un corazón. ❤️' : 'No se pudo enviar el pedido.', true);
    return;
  }
  el.requestForm.reset();
  setNotice('¡Pedido enviado al DJ! 🎉');
  await refreshRows();
});

el.ranking.addEventListener('click', e => {
  const b = e.target.closest('[data-vote]');
  if (b) vote(b.dataset.vote, b);
});

el.djList.addEventListener('click', e => {
  const b = e.target.closest('[data-status]');
  if (b) setStatus(b.dataset.id, b.dataset.status);
});

document.querySelector('[data-view="guest"]').onclick = showGuest;
el.djNav.onclick = openDj;
