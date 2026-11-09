from pathlib import Path
import shutil
p=Path('app.js')
if not p.exists(): raise SystemExit('ERROR: app.js no existe.')
s=p.read_text(encoding='utf-8')
missing=[]
if 'function isMySong(' not in s: missing.append("function isMySong(id){return getMySongIds().includes(id)}\n")
if 'function wasSongAlerted(' not in s: missing.append("function mySongAlertKey(id,status){return `pide_tu_tema_song_alert:${currentEvent?.slug||eventId||cfg.EVENT_SLUG||'event'}:${id}:${status}`}\nfunction wasSongAlerted(id,status){return localStorage.getItem(mySongAlertKey(id,status))==='1'}\nfunction markSongAlerted(id,status){localStorage.setItem(mySongAlertKey(id,status),'1')}\n")
if 'function notifyMySongStatus(' not in s: missing.append("function notifyMySongStatus(song){if(!song||!isMySong(song.id)||!['next','playing'].includes(song.status)||wasSongAlerted(song.id,song.status))return;markSongAlerted(song.id,song.status);if(song.status==='next'){beep();toast('🔥 ¡Prepárate!',`Tu canción viene pronto: ${song.title}${song.artist?' · '+song.artist:''}`,'song-alert');browserNotify('🔥 ¡Tu canción viene pronto!',`${song.title}${song.artist?' · '+song.artist:''} · ¡A la pista!`)}else{beep();setTimeout(beep,180);toast('🔊 ¡Está sonando tu canción!',`${song.title}${song.artist?' · '+song.artist:''} · ¡A bailar!`,'song-playing');browserNotify('🔊 ¡Está sonando tu canción!',`${song.title}${song.artist?' · '+song.artist:''} · ¡A bailar!`)}}\n")
if not missing:
 print('INFO: Las funciones requeridas ya existen. No se modificó app.js.')
 raise SystemExit(0)
marker='async function handleRealtime(payload)'
if marker not in s: raise SystemExit('ERROR: No encontré handleRealtime. No se modificó app.js.')
shutil.copy2(p,Path('app.js.v4.1.3b.bak'))
s=s.replace(marker,''.join(missing)+marker,1)
p.write_text(s,encoding='utf-8')
print('OK: V4.1.3b aplicado.')
print('Funciones agregadas:', len(missing))
