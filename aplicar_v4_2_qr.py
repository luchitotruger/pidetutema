from pathlib import Path
import shutil, sys
root=Path(sys.argv[1] if len(sys.argv)>1 else '.')
html_p=root/'index.html'; css_p=root/'styles.css'; js_p=root/'app.js'
for p in (html_p,css_p,js_p):
    if not p.exists(): raise SystemExit(f'Falta {p}')
html=html_p.read_text(encoding='utf-8'); css=css_p.read_text(encoding='utf-8'); js=js_p.read_text(encoding='utf-8')
for p in (html_p,css_p,js_p): shutil.copy2(p,p.with_suffix(p.suffix+'.v4.1.bak'))
# HTML
html=html.replace('<script src="config.js"></script><script src="app.js"></script>', '<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>\n  <script src="config.js"></script><script src="app.js"></script>')
old='<button id="copyEventLink" class="tool-button" type="button">🔗 Copiar enlace</button><button id="toggleEventActive"'
new='<button id="copyEventLink" class="tool-button" type="button">🔗 Copiar enlace</button><button id="showEventQr" class="tool-button" type="button">▦ Ver QR</button><button id="toggleEventActive"'
if old not in html: raise SystemExit('No se encontró control de eventos V4.1 en index.html')
html=html.replace(old,new,1)
old='<aside class="screen-ranking"><span class="screen-section-label">🏆 LAS MÁS VOTADAS</span><div id="screenTop3"></div></aside>'
new='<aside class="screen-ranking"><span class="screen-section-label">🏆 LAS MÁS VOTADAS</span><div id="screenTop3"></div><div class="screen-qr-mini"><div id="screenQr"></div><span>📱 Escanea y pide tu canción</span></div></aside>'
if old not in html: raise SystemExit('No se encontró ranking del Modo Pantalla')
html=html.replace(old,new,1)
marker='<div id="loginModal" class="modal" hidden>'
modal='<div id="eventQrModal" class="qr-modal" hidden role="dialog" aria-modal="true" aria-labelledby="eventQrTitle"><div class="qr-card"><button id="closeEventQr" class="modal-close" type="button">×</button><span class="qr-kicker">📱 ACCESO AL EVENTO</span><h2 id="eventQrTitle">Código QR</h2><p id="eventQrName"></p><div id="eventQrCanvas" class="qr-canvas"></div><p id="eventQrUrl" class="qr-url"></p><div class="qr-actions"><button id="downloadEventQr" class="primary" type="button">⬇ Descargar PNG</button><button id="copyEventQrLink" class="tool-button" type="button">🔗 Copiar enlace</button></div></div></div>\n  '+marker
if marker not in html: raise SystemExit('No se encontró modal login')
html=html.replace(marker,modal,1)
# CSS
css += '''\n/* ===== V4.2 QR POR EVENTO ===== */\n.qr-modal{position:fixed;inset:0;z-index:16000;display:grid;place-items:center;padding:18px;background:rgba(3,1,10,.88);backdrop-filter:blur(10px)}.qr-modal[hidden]{display:none}.qr-card{position:relative;width:min(460px,100%);padding:28px;text-align:center;border:1px solid rgba(34,211,238,.35);border-radius:26px;background:linear-gradient(150deg,rgba(42,23,70,.99),rgba(18,11,34,.99));box-shadow:0 28px 80px rgba(0,0,0,.52)}.qr-kicker{color:#a5f3fc;font-size:.7rem;font-weight:900;letter-spacing:.14em}.qr-card h2{margin:7px 0 4px;font-size:1.8rem}.qr-card>p{color:#ddd6fe}.qr-canvas{display:grid;place-items:center;width:270px;height:270px;margin:17px auto;padding:14px;border-radius:20px;background:#fff;box-shadow:0 15px 38px rgba(0,0,0,.3)}.qr-canvas img,.qr-canvas canvas{width:100%!important;height:100%!important}.qr-url{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.75rem;color:#9f8dbb!important}.qr-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}.qr-actions .primary{margin:0}.qr-actions .tool-button{border-radius:14px}.screen-qr-mini{display:grid;place-items:center;margin-top:22px;padding-top:20px;border-top:1px solid rgba(255,255,255,.09)}.screen-qr-mini>div{display:grid;place-items:center;width:min(190px,15vw);height:min(190px,15vw);min-width:130px;min-height:130px;padding:9px;border-radius:16px;background:#fff}.screen-qr-mini img,.screen-qr-mini canvas{width:100%!important;height:100%!important}.screen-qr-mini span{margin-top:9px;color:#ddd6fe;font-size:clamp(.75rem,1.15vw,1rem);font-weight:800}.event-switcher-row{grid-template-columns:minmax(220px,1fr) auto auto auto}@media(max-width:780px){.event-switcher-row{grid-template-columns:1fr}.qr-actions{grid-template-columns:1fr}.qr-canvas{width:240px;height:240px}}@media(max-width:900px){.screen-qr-mini>div{width:150px;height:150px}}\n'''
# JS refs
old="eventManagerMeta:$('eventManagerMeta')}"
new="eventManagerMeta:$('eventManagerMeta'),showEventQr:$('showEventQr'),eventQrModal:$('eventQrModal'),closeEventQr:$('closeEventQr'),eventQrName:$('eventQrName'),eventQrCanvas:$('eventQrCanvas'),eventQrUrl:$('eventQrUrl'),downloadEventQr:$('downloadEventQr'),copyEventQrLink:$('copyEventQrLink'),screenQr:$('screenQr')}"
if old not in js: raise SystemExit('No se encontró mapa de elementos V4.1 en app.js')
js=js.replace(old,new,1)
marker='function publicEventUrl(event=currentEvent)'
helper="""function renderQr(target,url,size=240){if(!target||typeof QRCode==='undefined'){toast('QR no disponible','No se pudo cargar la librería QR','error');return}target.innerHTML='';new QRCode(target,{text:url,width:size,height:size,colorDark:'#090414',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M})}\nfunction openEventQr(){if(!currentEvent)return;const url=publicEventUrl();el.eventQrName.textContent=currentEvent.name;el.eventQrUrl.textContent=url;el.eventQrModal.hidden=false;renderQr(el.eventQrCanvas,url,240)}\nfunction closeEventQr(){el.eventQrModal.hidden=true}\nfunction downloadEventQr(){const canvas=el.eventQrCanvas.querySelector('canvas'),img=el.eventQrCanvas.querySelector('img'),a=document.createElement('a');a.download=`qr-${currentEvent?.slug||'evento'}.png`;a.href=canvas&&canvas.toDataURL?canvas.toDataURL('image/png'):img?.src||'';if(a.href)a.click()}\nfunction renderScreenQr(){if(!el.screenQr||!currentEvent)return;renderQr(el.screenQr,publicEventUrl(),180)}\n"""
if marker not in js: raise SystemExit('No se encontró publicEventUrl')
js=js.replace(marker,helper+marker,1)
old='function renderScreenMode(){if(!el.screenMode)return;'
if old not in js: raise SystemExit('No se encontró renderScreenMode')
js=js.replace(old,'function renderScreenMode(){if(!el.screenMode)return;renderScreenQr();',1)
marker='el.eventSelector.onchange='
bind="""el.showEventQr.onclick=openEventQr;el.closeEventQr.onclick=closeEventQr;el.eventQrModal.onclick=e=>{if(e.target===el.eventQrModal)closeEventQr()};el.downloadEventQr.onclick=downloadEventQr;el.copyEventQrLink.onclick=async()=>{try{await navigator.clipboard.writeText(publicEventUrl());toast('🔗 Enlace copiado',publicEventUrl(),'success')}catch{toast('No se pudo copiar','','error')}};\n"""
if marker not in js: raise SystemExit('No se encontró binding selector')
js=js.replace(marker,bind+marker,1)
html_p.write_text(html,encoding='utf-8'); css_p.write_text(css,encoding='utf-8'); js_p.write_text(js,encoding='utf-8')
print('V4.2 aplicada. Backups .v4.1.bak creados.')
