from pathlib import Path
import shutil
p=Path('app.js')
if not p.exists(): raise SystemExit('ERROR: app.js no existe en esta carpeta.')
s=p.read_text(encoding='utf-8')
shutil.copy2(p,Path('app.js.v4.1.bak'))

# 1) Al abrir Panel DJ, primero recuperar sesion, cargar evento y lista de eventos una sola vez.
old="""async function openDj(){if(!configured){el.loginNotice.textContent='Completa config.js.';el.loginModal.hidden=false;return}const {data}=await db.auth.getSession();session=data.session;if(!session){el.loginModal.hidden=false;setTimeout(()=>el.loginEmail.focus(),50);return}el.guest.hidden=true;el.dj.hidden=false;el.loginModal.hidden=true;unseen=0;updateBadge();document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===el.djNav));el.djIdentity.innerHTML=`<span>Sesión: ${esc(session.user.email)}</span><button class=\"logout\" id=\"logoutBtn\">Salir</button>`;$('logoutBtn').onclick=logout;await load();await loadOwnedEvents()}"""
new="""async function openDj(){if(!configured){el.loginNotice.textContent='Completa config.js.';el.loginModal.hidden=false;return}const {data}=await db.auth.getSession();session=data.session;if(!session){el.loginModal.hidden=false;setTimeout(()=>el.loginEmail.focus(),50);return}el.guest.hidden=true;el.dj.hidden=false;el.loginModal.hidden=true;unseen=0;updateBadge();document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===el.djNav));el.djIdentity.innerHTML=`<span>Sesión: ${esc(session.user.email)}</span><button class=\"logout\" id=\"logoutBtn\">Salir</button>`;$('logoutBtn').onclick=logout;await load();await loadOwnedEvents();renderEventManager()}"""
if old not in s: raise SystemExit('ERROR: no encontre openDj de V4.1. No se aplicaron cambios.')
s=s.replace(old,new,1)

# 2) Preservar que se estaba en Panel DJ al cambiar de evento.
old="""async function switchEvent(slug){if(!slug||slug===currentEvent?.slug)return;const u=new URL(location.href);u.searchParams.set('evento',slug);u.searchParams.delete('modo');location.href=u.toString()}"""
new="""async function switchEvent(slug){if(!slug||slug===currentEvent?.slug)return;const u=new URL(location.href);u.searchParams.set('evento',slug);u.searchParams.delete('modo');u.searchParams.set('panel','dj');location.href=u.toString()}"""
if old not in s: raise SystemExit('ERROR: no encontre switchEvent de V4.1. No se aplicaron cambios.')
s=s.replace(old,new,1)

# 3) Inicializacion determinista: recuperar sesion ANTES de load() y reabrir panel si URL trae panel=dj.
old="""window.addEventListener('online',()=>{setConnection(true,'Conectado en vivo');refreshRows()});window.addEventListener('offline',()=>setConnection(false,'Sin conexión'));if(db)db.auth.onAuthStateChange((event,newSession)=>{session=newSession;if(event==='SIGNED_OUT')showGuest()});load().then(()=>{if(new URLSearchParams(location.search).get('modo')==='pantalla')openScreenMode()});"""
new="""window.addEventListener('online',()=>{setConnection(true,'Conectado en vivo');refreshRows()});window.addEventListener('offline',()=>setConnection(false,'Sin conexión'));if(db)db.auth.onAuthStateChange((event,newSession)=>{session=newSession;if(event==='SIGNED_OUT')showGuest()});async function initializeApp(){if(db){const {data}=await db.auth.getSession();session=data.session||null}await load();const params=new URLSearchParams(location.search);if(params.get('modo')==='pantalla'){openScreenMode();return}if(session){await loadOwnedEvents();renderEventManager()}if(params.get('panel')==='dj'&&session)await openDj()}initializeApp();"""
if old not in s: raise SystemExit('ERROR: no encontre inicializacion final de V4.1. No se aplicaron cambios.')
s=s.replace(old,new,1)

# 4) storage de Mis canciones por slug real del evento; evita mezclar eventos si config tiene slug fijo.
s=s.replace("return `pide_tu_tema_my_songs:${cfg.EVENT_SLUG||eventId||'event'}`","return `pide_tu_tema_my_songs:${currentEvent?.slug||eventId||cfg.EVENT_SLUG||'event'}`")
s=s.replace("return `pide_tu_tema_number_one:${cfg.EVENT_SLUG||eventId||'event'}:${id}`","return `pide_tu_tema_number_one:${currentEvent?.slug||eventId||cfg.EVENT_SLUG||'event'}:${id}`")

p.write_text(s,encoding='utf-8')
print('OK: Fix V4.1.1 aplicado a app.js')
print('Backup: app.js.v4.1.bak')
