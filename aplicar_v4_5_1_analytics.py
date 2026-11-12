from pathlib import Path
p=Path('app.js')
s=p.read_text(encoding='utf-8')
needle="const voterToken=localStorage.getItem('pide_tu_tema_voter')||crypto.randomUUID();localStorage.setItem('pide_tu_tema_voter',voterToken);"
insert=needle+"\n// ===== V4.5.1 ANALYTICS DE VISITANTES =====\nconst visitorToken=localStorage.getItem('pide_tu_tema_visitor')||crypto.randomUUID();localStorage.setItem('pide_tu_tema_visitor',visitorToken);\nfunction visitorDeviceInfo(){const ua=navigator.userAgent||'';let device_type=/iPad|Tablet/i.test(ua)?'tablet':/Mobi|Android|iPhone/i.test(ua)?'mobile':'desktop';let os=/iPhone|iPad|iPod/i.test(ua)?'iOS':/Android/i.test(ua)?'Android':/Windows/i.test(ua)?'Windows':/Mac OS X|Macintosh/i.test(ua)?'macOS':/Linux/i.test(ua)?'Linux':'Other';let browser=/Edg\//i.test(ua)?'Edge':/OPR\//i.test(ua)?'Opera':/CriOS|Chrome\//i.test(ua)?'Chrome':/FxiOS|Firefox\//i.test(ua)?'Firefox':/Safari\//i.test(ua)?'Safari':'Other';return{device_type,os,browser}}\nasync function registerEventVisit(){if(!db||!eventId||session||new URLSearchParams(location.search).get('modo')==='pantalla')return;const info=visitorDeviceInfo();const payload={event_id:eventId,visitor_id:visitorToken,...info,last_seen:new Date().toISOString()};const {error}=await db.from('event_visits').upsert(payload,{onConflict:'event_id,visitor_id'});if(error)console.warn('Analytics V4.5.1:',error.message)}"
if needle not in s: raise SystemExit('ERROR: no encontre voterToken')
s=s.replace(needle,insert,1)
needle2="currentEvent=e;eventId=e.id;projectorState.featured_request_id=e.featured_request_id||null;applyEventTheme(e);await refreshRows();"
replace2="currentEvent=e;eventId=e.id;projectorState.featured_request_id=e.featured_request_id||null;applyEventTheme(e);await registerEventVisit();await refreshRows();"
if needle2 not in s: raise SystemExit('ERROR: no encontre punto de load')
s=s.replace(needle2,replace2,1)
p.write_text(s,encoding='utf-8')
print('OK: app.js actualizado a V4.5.1')
