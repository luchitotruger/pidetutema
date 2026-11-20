'use strict';
/* PIDE TU TEMA - Pantalla Fiesta UX V2 - V5.47.0 */
(() => {
  const $ = id => document.getElementById(id);
  const VERSION = '5.47.0';
  const PRIORITY = {
    screenKaraoke: 100,
    screenPartyGame: 90,
    screenSocialLive: 80,
    screenPartyGreeting: 70,
    screenPartyPhoto: 60,
    screenDedication: 55,
    screenDjAd: 20
  };
  const LABEL = {
    screenKaraoke: 'KARAOKE', screenPartyGame: 'JUEGO EN VIVO',
    screenSocialLive: 'LA FIESTA HABLO', screenPartyGreeting: 'MENSAJE',
    screenPartyPhoto: 'FOTO DEL MOMENTO', screenDedication: 'DEDICATORIA',
    screenDjAd: 'LUIS DJ'
  };
  const state = { active: null, observer: null, ticker: null };

  function candidates() {
    return Object.keys(PRIORITY)
      .map(id => $(id))
      .filter(Boolean)
      .filter(node => !node.hidden)
      .sort((a, b) => PRIORITY[b.id] - PRIORITY[a.id]);
  }

  function paintStatus(active) {
    const badge = $('screenV2Status');
    if (!badge) return;
    if (active) {
      badge.hidden = false;
      badge.querySelector('b').textContent = LABEL[active.id] || 'EN VIVO';
    } else {
      badge.hidden = true;
    }
  }

  function arbitrate() {
    const list = candidates();
    const winner = list[0] || null;
    Object.keys(PRIORITY).forEach(id => {
      const node = $(id);
      if (!node) return;
      node.classList.toggle('v2-suppressed', Boolean(winner && node !== winner && !node.hidden));
      node.classList.toggle('v2-active-overlay', node === winner);
    });
    const mode = $('screenMode');
    if (mode) {
      mode.classList.toggle('v2-interrupted', Boolean(winner));
      mode.dataset.v2Scene = winner ? winner.id : 'normal';
    }
    if (winner !== state.active) {
      state.active = winner;
      paintStatus(winner);
    }
  }

  function addChrome() {
    const mode = $('screenMode');
    if (!mode || $('screenV2Status')) return;
    mode.classList.add('screen-ux-v2');
    const badge = document.createElement('div');
    badge.id = 'screenV2Status';
    badge.className = 'screen-v2-status';
    badge.hidden = true;
    badge.innerHTML = '<i></i><b>EN VIVO</b>';
    mode.appendChild(badge);

    const footer = mode.querySelector('.screen-footer');
    if (footer && !$('screenV2Participation')) {
      const participation = document.createElement('span');
      participation.id = 'screenV2Participation';
      participation.className = 'screen-v2-participation';
      participation.textContent = '📱 Escanea · Pide · Vota · Participa';
      footer.prepend(participation);
    }
  }

  function enrichBaseScene() {
    const root = $('screenScene');
    if (!root) return;
    root.classList.add('screen-v2-scene');
    const now = root.querySelector('.party-now, .party-scene-now, .party-now-playing');
    if (now) now.classList.add('v2-hero-now');
    root.querySelectorAll('.party-rank-row, .screen-rank-row').forEach((row, i) => {
      row.style.setProperty('--v2-delay', `${i * 70}ms`);
    });
  }

  function installObserver() {
    const mode = $('screenMode');
    if (!mode) return;
    state.observer?.disconnect();
    state.observer = new MutationObserver(mutations => {
      if (mutations.some(m => m.type === 'attributes' || m.type === 'childList')) {
        enrichBaseScene();
        requestAnimationFrame(arbitrate);
      }
    });
    state.observer.observe(mode, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'class'] });
  }

  function boot() {
    addChrome();
    installObserver();
    enrichBaseScene();
    arbitrate();
    clearInterval(state.ticker);
    state.ticker = setInterval(() => {
      if (!$('screenMode')?.hidden) {
        enrichBaseScene();
        arbitrate();
      }
    }, 1500);
    console.info(`[Pide Tu Tema] Pantalla Fiesta UX V2 ${VERSION} activa`);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
