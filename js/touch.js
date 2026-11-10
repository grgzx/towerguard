// Touch controls for phones/tablets: floating joystick, look-drag, fire button, tappable hotbar
// (long press = hire a helper), side buttons, fullscreen/orientation/wake-lock helpers.
// Only active when IS_TOUCH (primary pointer is coarse). Desktop input is untouched.
(function () {
  if (!IS_TOUCH) return;
  document.body.classList.add('touch');
  if (/iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) document.body.classList.add('ios');
  else if (/android/i.test(navigator.userAgent)) document.body.classList.add('android');

  const LOOK_SENS = 0.0042, JOY_R = 48, HOLD_MS = 650;
  const touch = document.createElement('div'); touch.id = 'touch';
  touch.innerHTML =
    '<div id="tzMove" class="tz"></div><div id="tzLook" class="tz"></div>' +
    '<div id="joy"><div id="joyk"></div></div>' +
    '<div id="tFire" class="tbtn"><span></span></div>' +
    '<div id="tTop">' +
    '<div id="tPause" class="tbtn sm">⏸</div><div id="tVoice" class="tbtn sm">🔊</div><div id="tLang" class="tbtn sm">🌐</div></div>' +
    '<div id="tBuy">' +
    '<div id="tRepair" class="tbtn sm"><i>🔧</i><span class="tc"></span></div>' +
    '<div id="tDmg" class="tbtn sm"><i>⚔</i><span class="tc"></span></div>' +
    '<div id="tMana" class="tbtn sm"><i>🔮</i><span class="tc"></span></div></div>';
  document.body.appendChild(touch);
  const $t = id => document.getElementById(id);
  const live = () => G.running && !G.paused;

  // ---- joystick (left half): up/down walk, left/right turn the character ----
  const joy = $t('joy'), knob = $t('joyk');
  let joyId = null, jx0 = 0, jy0 = 0;
  const homeJoy = () => { joy.style.left = '70px'; joy.style.top = 'auto'; joy.style.bottom = '60px'; joy.classList.remove('on'); knob.style.transform = ''; };
  homeJoy();
  $t('tzMove').addEventListener('pointerdown', e => {
    if (joyId !== null || !live()) return;
    joyId = e.pointerId; e.target.setPointerCapture(e.pointerId);
    jx0 = e.clientX; jy0 = e.clientY;
    joy.style.left = (jx0 - 55) + 'px'; joy.style.top = (jy0 - 55) + 'px'; joy.style.bottom = 'auto'; joy.classList.add('on');
  });
  $t('tzMove').addEventListener('pointermove', e => {
    if (e.pointerId !== joyId) return;
    let dx = e.clientX - jx0, dy = e.clientY - jy0; const d = Math.hypot(dx, dy);
    if (d > JOY_R) { dx *= JOY_R / d; dy *= JOY_R / d; }
    knob.style.transform = `translate(${dx}px,${dy}px)`;
    const mx = dx / JOY_R, my = dy / JOY_R, m = Math.hypot(mx, my);
    if (m < 0.18) { touchIn.turn = 0; touchIn.my = 0; } else { touchIn.turn = Math.sign(mx) * Math.pow(Math.abs(mx), 1.4); touchIn.my = my; }
  });
  const joyEnd = e => { if (e.pointerId !== joyId) return; joyId = null; touchIn.turn = 0; touchIn.my = 0; homeJoy(); };
  ['pointerup', 'pointercancel'].forEach(n => $t('tzMove').addEventListener(n, joyEnd));

  // ---- look drag (right half, and the finger holding the fire button) ----
  function lookBy(dx, dy) {
    if (!live()) return;
    G.player.yaw -= dx * LOOK_SENS;
    G.player.pitch = Math.max(-1.45, Math.min(1.45, G.player.pitch - dy * LOOK_SENS));
  }
  function dragLook(el, onStart, onEnd) {
    let id = null, lx = 0, ly = 0;
    el.addEventListener('pointerdown', e => {
      if (id !== null) return; id = e.pointerId; el.setPointerCapture(e.pointerId); lx = e.clientX; ly = e.clientY; if (onStart) onStart(e);
    });
    el.addEventListener('pointermove', e => { if (e.pointerId !== id) return; lookBy(e.clientX - lx, e.clientY - ly); lx = e.clientX; ly = e.clientY; });
    const end = e => { if (e.pointerId !== id) return; id = null; if (onEnd) onEnd(e); };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  }
  dragLook($t('tzLook'));
  dragLook($t('tFire'), () => { if (live()) { touchIn.fire = true; $t('tFire').classList.add('down'); } }, () => { touchIn.fire = false; $t('tFire').classList.remove('down'); });

  // ---- side buttons ----
  const tap = (id, fn) => $t(id).addEventListener('pointerdown', e => { e.preventDefault(); if (G.running) fn(); });
  tap('tPause', () => setPause(!G.paused));
  tap('tVoice', () => { toggleVoiceMsg(); $t('tVoice').textContent = VOICE.on ? '🔊' : '🔇'; });
  tap('tLang', toggleLang);
  tap('tRepair', () => live() && buy('repair'));
  tap('tDmg', () => live() && buy('dmg'));
  tap('tMana', () => live() && buy('mana'));

  // ---- hotbar: tap = select weapon, long press = hire a helper (with a filling ring) ----
  const hb = $t('hotbar');
  let hold = null;
  function holdStop(clear) {
    if (!hold) return;
    cancelAnimationFrame(hold.raf); clearTimeout(hold.timer); if (hold.ring) hold.ring.remove();
    if (hold.slot) hold.slot.classList.remove('holding');
    touchIn.hold = -1; if (clear) hold = null;
  }
  hb.addEventListener('pointerdown', e => {
    const slot = e.target.closest('.slot'); if (!slot || !G.running || G.paused || hold) return;
    e.preventDefault();
    const idx = +slot.id.slice(4), ring = document.createElement('div'); ring.className = 'hold'; slot.appendChild(ring); slot.classList.add('holding');
    hold = { id: e.pointerId, idx, slot, ring, x: e.clientX, y: e.clientY, t0: performance.now(), done: false, raf: 0 };
    touchIn.hold = idx;
    const h = hold;
    h.timer = setTimeout(() => { if (hold !== h) return; h.done = true; holdStop(false); if (navigator.vibrate) navigator.vibrate(40); buyHelper(idx); }, HOLD_MS);
    const step = () => {
      if (hold !== h || h.done) return;
      const k = Math.min(1, (performance.now() - h.t0) / HOLD_MS);
      ring.style.height = (k * 100) + '%';
      h.raf = requestAnimationFrame(step);
    };
    step();
  });
  hb.addEventListener('pointermove', e => {
    if (!hold || e.pointerId !== hold.id || hold.done) return;
    if (Math.hypot(e.clientX - hold.x, e.clientY - hold.y) > 14) { holdStop(true); }
  });
  const hbEnd = e => {
    if (!hold || e.pointerId !== hold.id) return;
    const wasDone = hold.done, idx = hold.idx; holdStop(true);
    if (!wasDone && e.type === 'pointerup' && live()) selectWeapon(idx);
  };
  hb.addEventListener('pointerup', hbEnd); hb.addEventListener('pointercancel', hbEnd);

  // ---- bodycount panel: tap to expand/collapse ----
  $t('bodies').addEventListener('pointerdown', () => $t('bodies').classList.toggle('open'));

  // ---- periodic cosmetics: costs and the fire button icon ----
  setInterval(() => {
    const c = costs();
    $t('tRepair').querySelector('.tc').textContent = c.repair; $t('tDmg').querySelector('.tc').textContent = c.dmg; $t('tMana').querySelector('.tc').textContent = c.mana;
    const ic = WEAPONS[G.sel] && WEAPONS[G.sel].icon; const f = $t('tFire').firstChild; if (ic && f.textContent !== ic) f.textContent = ic;
  }, 250);

  // ---- page-level behaviour ----
  window.touchReset = () => {
    touchIn.turn = touchIn.my = 0; touchIn.fire = false; $t('tFire').classList.remove('down'); holdStop(true); homeJoy(); joyId = null;
  };
  const guard = e => { if (!e.target.closest || !e.target.closest('.panel, #rotate')) e.preventDefault(); };
  document.addEventListener('touchmove', guard, { passive: false });
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(n => document.addEventListener(n, e => e.preventDefault()));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (G.running && !G.paused) setPause(true); }
    else wakeLock();
  });
  const portrait = matchMedia('(orientation: portrait)');
  const onOrient = () => { if (portrait.matches && G.running && !G.paused) setPause(true); };
  if (portrait.addEventListener) portrait.addEventListener('change', onOrient); else portrait.addListener(onOrient);

  let wl = null;
  async function wakeLock() { try { if (navigator.wakeLock && !document.hidden) wl = await navigator.wakeLock.request('screen'); } catch (e) {} }
  // Called from a user gesture (the start tap): fullscreen + landscape lock where the browser allows it (not on iPhone Safari).
  window.touchEnter = () => {
    const el = document.documentElement, rq = el.requestFullscreen || el.webkitRequestFullscreen;
    try {
      const p = rq && rq.call(el);
      Promise.resolve(p).then(() => screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape')).catch(() => {});
    } catch (e) {}
    wakeLock();
  };

  // ---- aim assist toggle (on by default) ----
  const ab = document.getElementById('assistBtn');
  if (ab) {
    const upd = () => { ab.textContent = t(AIM_ASSIST ? 'assistOn' : 'assistOff'); };
    ab.onclick = () => { AIM_ASSIST = !AIM_ASSIST; try { localStorage.setItem('td_assist', AIM_ASSIST ? '1' : '0'); } catch (e) {} upd(); };
    window.updAssist = upd; upd();
  }
})();
