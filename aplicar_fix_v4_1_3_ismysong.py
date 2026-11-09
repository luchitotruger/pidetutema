from pathlib import Path
import shutil
p=Path('app.js')
if not p.exists(): raise SystemExit('ERROR: app.js no existe.')
s=p.read_text(encoding='utf-8')
if 'function isMySong(' in s:
    print('INFO: isMySong ya existe. No se modificó app.js.')
    raise SystemExit(0)
marker='function wasSongAlerted(id,status)'
if marker not in s:
    raise SystemExit('ERROR: No encontré el punto esperado para insertar isMySong. No se modificó app.js.')
shutil.copy2(p,Path('app.js.v4.1.3.bak'))
helper="function isMySong(id){return getMySongIds().includes(id)}\n"
s=s.replace(marker,helper+marker,1)
p.write_text(s,encoding='utf-8')
print('OK: V4.1.3 aplicado. Se agregó isMySong(id).')
print('Backup: app.js.v4.1.3.bak')
