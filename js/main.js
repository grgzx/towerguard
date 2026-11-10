// Game logic, controls, waves, HUD, sound
const $ = id => document.getElementById(id);
const G = {
  running: false, paused: false, over: false, wave: 0, gold: 80, score: 0, kills: 0, bodies: {},
  towerHp: 1000, maxTowerHp: 1000, mana: 100, maxMana: 100, manaRegen: 7, dmgMul: 1,
  timers: [], spawnQ: [], spawnT: 0, breakT: 3, waveActive: false, sel: 0, cds: [], shake: 0, lvl: { dmg: 0, mana: 0 },
  player: { pos: new THREE.Vector3(0, TOWER_Y + 0.4 + EYE, 3), yaw: 0, pitch: 0, hp: 100 },
};
scene.add(camera);

// ---------- sound ----------
let AC = null;
function sfx(kind) {
  if (!AC) return;
  const t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
  o.connect(g); g.connect(AC.destination);
  const set = (type, f0, f1, dur, vol) => {
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.start(t); o.stop(t + dur);
  };
  if (kind === 'bow') set('triangle', 500, 120, 0.15, 0.12);
  else if (kind === 'boom') { set('sawtooth', 90, 25, 0.5, 0.3); }
  else if (kind === 'magic') set('sine', 300, 900, 0.25, 0.12);
  else if (kind === 'zap') set('sawtooth', 1200, 100, 0.2, 0.1);
  else if (kind === 'heal') set('sine', 500, 1000, 0.6, 0.12);
  else if (kind === 'hurt') set('square', 200, 60, 0.2, 0.1);
  else if (kind === 'hit') set('square', 150, 50, 0.12, 0.08);
}

// ---------- pomocnicze UI ----------
function showMsg(t) { const m = $('msg'); m.textContent = t; clearTimeout(showMsg.h); showMsg.h = setTimeout(() => m.textContent = '', 2500); }
function floatText() {}
function addScore(n) { G.score += n; }
function addGold(n) { G.gold += n; }
function shake(n) { G.shake = Math.max(G.shake, n); }
function banner(t) { const b = $('banner'); b.textContent = t; b.style.opacity = 1; setTimeout(() => b.style.opacity = 0, 2500); }
const lowEl = document.createElement('div'); lowEl.id = 'lowhp'; document.body.appendChild(lowEl);
const flashEl = document.createElement('div'); flashEl.className = 'dmgflash'; document.body.appendChild(flashEl);
function showHitmarker(kill) {
  const c = $('crosshair'); c.style.filter = kill ? 'drop-shadow(0 0 4px #f33) hue-rotate(150deg)' : 'drop-shadow(0 0 3px #ff0)';
  c.style.transform = 'scale(1.5)'; clearTimeout(showHitmarker.h);
  showHitmarker.h = setTimeout(() => { c.style.filter = ''; c.style.transform = ''; }, 90);
  sfx('hit');
}
function damageTower(n) {
  G.towerHp -= n; towerHit(); shake(0.25); sfx('hurt');
  if (G.towerHp <= 0) endGame(false);
}
function hurtPlayer(n) {
  G.player.hp -= n; flashEl.style.opacity = 1; setTimeout(() => flashEl.style.opacity = 0, 150); shake(0.3); sfx('hurt');
  if (G.player.hp <= 0) endGame(false, true);
}
function endGame(win, byPlayer) {
  if (G.over) return; G.over = true; G.running = false; document.exitPointerLock();
  $('overTitle').textContent = byPlayer ? t('overPlayer') : t('overTower');
  say(byPlayer ? 'gameOverPlayer' : 'gameOverTower', {}, { prio: 2, cool: 0 });
  $('overText').textContent = t('overText', G.wave, G.kills, G.score);
  $('overBodies').innerHTML = bodyHTML(true);
  $('over').classList.remove('hidden');
}

// ---------- hotbar ----------
function buildHotbar() {
  const hb = $('hotbar'); hb.innerHTML = '';
  WEAPONS.forEach((w, i) => {
    const d = document.createElement('div'); d.className = 'slot'; d.id = 'slot' + i;
    d.innerHTML = `<span class="k">${w.key}</span>${w.mana ? `<span class="cost">${w.mana}</span>` : ''}<div class="ic">${w.icon}</div><div class="nm">${weaponName(i)}</div><div class="cd"></div><div class="hc"></div>`;
    hb.appendChild(d); G.cds[i] = 0;
  });
}
function selectWeapon(i) {
  const changed = G.sel !== i && G.running; G.sel = i; if (changed && performance.now() - (G.weaponSayAt || 0) > 35000 && Math.random() < 0.3 && say('weapon' + WEAPONS[i].key, {}, { prio: 0, cool: 0, chance: 1 })) G.weaponSayAt = performance.now();
  WEAPONS.forEach((w, k) => $('slot' + k).classList.toggle('sel', k === i)); buildViewmodel(i);
}

// ---------- viewmodel ----------
let vm = null;
function buildViewmodel(i) {
  if (vm) camera.remove(vm);
  vm = new THREE.Group(); const k = WEAPONS[i].key;
  const wood = M.woodD, iron = M.iron;
  const add = (g, m, x, y, z, p) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); (p || vm).add(o); return o; };
  const skin = mat(0xc8946a), leather = mat(0x3a2414), bowWood = mat(0x7a4a22);
  if (k !== 1) add(new THREE.BoxGeometry(0.1, 0.1, 0.5), mat(0x7a5a3a), 0.22, -0.3, -0.45);
  if (k === 1) {
    const bow = new THREE.Group(); vm.add(bow);
    bow.position.set(0.27, -0.13, -0.85); bow.rotation.set(0.05, 0.12, 0.04);
    const HL = 0.34, TZ = 0.08;
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, -HL, TZ), new THREE.Vector3(0, 0, -0.14), new THREE.Vector3(0, HL, TZ));
    add(new THREE.TubeGeometry(curve, 24, 0.013, 6, false), bowWood, 0, 0, 0, bow);
    add(new THREE.BoxGeometry(0.045, 0.13, 0.05), leather, 0, 0, -0.03, bow);
    add(new THREE.SphereGeometry(0.03, 8, 6), skin, 0.01, -0.01, -0.02, bow);
    const fa = add(new THREE.BoxGeometry(0.05, 0.05, 0.45), mat(0x5a3a22), 0.06, -0.2, 0.3, bow); fa.rotation.x = 0.5;
    [-1, 1].forEach(sg => add(new THREE.SphereGeometry(0.014, 6, 6), mat(0xd8c8a0), 0, sg * HL, TZ, bow));
    const strMat = mat(0xeeeeee), Y = new THREE.Vector3(0, 1, 0);
    const seg = [0, 1].map(() => add(new THREE.CylinderGeometry(0.0022, 0.0022, 1, 4), strMat, 0, 0, 0, bow));
    const hand = add(new THREE.SphereGeometry(0.03, 8, 6), skin, 0, 0, 0, bow);
    const arrow = arrowMesh(0.62, 0x8a6030, 0xb8bcc4, 0.007, 1.3); arrow.rotation.y = Math.PI; bow.add(arrow);
    const place = (m, a, b2) => {
      const d = b2.clone().sub(a), len = d.length();
      m.position.copy(a).addScaledVector(d, 0.5); m.scale.set(1, len, 1); m.quaternion.setFromUnitVectors(Y, d.normalize());
    };
    vm.userData.upd = (cdFrac) => {
      const f = Math.max(0, Math.min(1, 1 - cdFrac)), draw = 0.22 * f * f * (3 - 2 * f);
      const N = new THREE.Vector3(0, 0, TZ + draw);
      place(seg[0], new THREE.Vector3(0, HL, TZ), N); place(seg[1], N, new THREE.Vector3(0, -HL, TZ));
      hand.position.set(0, 0, N.z + 0.02); hand.visible = f > 0.2;
      arrow.visible = f > 0.3; arrow.position.set(0, 0.022, N.z - 0.31);
    };
    vm.userData.upd(0);
  } else if (k === 2 || k === 7) {
    const s = k === 7 ? 1.4 : 1;
    add(new THREE.BoxGeometry(0.1 * s, 0.1, 0.8 * s), wood, 0.25, -0.22, -0.55);
    add(new THREE.BoxGeometry(0.8 * s, 0.04, 0.05), iron, 0.25, -0.17, -0.85 * s);
    add(new THREE.BoxGeometry(0.04, 0.04, 0.7 * s), iron, 0.25, -0.17, -0.55);
    const a = arrowMesh(0.6 * s, 0x6a4020, 0xcccccc, 0.014 * s, 1.2); a.rotation.y = Math.PI; a.position.set(0.25, -0.15, -0.6); vm.add(a);
  } else if (k === 3) {
    add(new THREE.SphereGeometry(0.16, 10, 8), iron, 0.3, -0.2, -0.55);
    add(new THREE.CylinderGeometry(0.01, 0.01, 0.12, 4), wood, 0.3, -0.02, -0.55);
    add(new THREE.SphereGeometry(0.025, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffaa22 }), 0.3, 0.05, -0.55);
  } else {
    const col = { 4: 0xff6a10, 5: 0x9fd0ff, 6: 0x8fe0ff, 8: 0xff3a10, 9: 0xfff2a0 }[k];
    const s = new THREE.Group(); s.position.set(0.28, -0.3, -0.5); s.rotation.x = 0.25; vm.add(s);
    add(new THREE.CylinderGeometry(0.018, 0.022, 1.0, 6), wood, 0, 0.3, 0, s);
    add(new THREE.SphereGeometry(0.07, 10, 8), new THREE.MeshBasicMaterial({ color: col }), 0, 0.85, 0, s);
  }
  vm.userData.kick = 0; camera.add(vm);
}

// ---------- sterowanie ----------
const keys = {}; let mouseDown = false;
const touchIn = { mx: 0, my: 0, fire: false, hold: -1 };
function toggleLang() { setLang(LANG === 'pl' ? 'en' : 'pl'); showMsg(t('langSet')); }
function toggleVoiceMsg() { const on = toggleVoice(); showMsg(t(on ? 'voiceOn' : 'voiceOff')); if (on) say('voiceOn', {}, { prio: 2, cool: 0 }); }
addEventListener('keydown', e => {
  keys[e.code] = true;
  if (!G.running) return;
  if (e.code === 'KeyP' || e.code === 'Escape') { if (e.code === 'KeyP') setPause(!G.paused); return; }
  const dm = /^Digit([1-9])$/.exec(e.code);
  if (dm && e.shiftKey) { buyHelper(+dm[1] - 1); return; }
  const n = parseInt(e.key);
  if (n >= 1 && n <= 9) selectWeapon(n - 1);
  if (e.code === 'KeyL') toggleLang();
  if (e.code === 'KeyM') toggleVoiceMsg();
  if (e.code === 'KeyR') buy('repair'); if (e.code === 'KeyT') buy('dmg'); if (e.code === 'KeyY') buy('mana');
});
addEventListener('keyup', e => keys[e.code] = false);
addEventListener('mousedown', e => { if (e.button === 0 && G.running && !G.paused) mouseDown = true; });
addEventListener('mouseup', e => { if (e.button === 0) mouseDown = false; });
addEventListener('mousemove', e => {
  if (!G.running || G.paused || document.pointerLockElement !== renderer.domElement) return;
  G.player.yaw -= e.movementX * 0.0022;
  G.player.pitch = Math.max(-1.45, Math.min(1.45, G.player.pitch - e.movementY * 0.0022));
});
document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement !== renderer.domElement && G.running && !G.paused) setPause(true);
});
addEventListener('contextmenu', e => e.preventDefault());

function costs() { return { repair: 60, dmg: 100 + G.lvl.dmg * 80, mana: 80 + G.lvl.mana * 60 }; }
['pl', 'en'].forEach(l => { LINES[l].orkCall = (LINES[l].orkCall || []).concat(LINES[l].orkCall2 || []); });
function buy(w) {
  const c = costs()[w];
  if (w === 'repair' && G.towerHp >= G.maxTowerHp - 0.5) { showMsg(t('towerFull')); return; }
  if (G.gold < c) { showMsg(t('noGold')); say('noGold', {}, { prio: 1, cool: 6000 }); return; }
  G.gold -= c;
  if (w === 'repair') { G.towerHp = Math.min(G.maxTowerHp, G.towerHp + G.maxTowerHp * 0.35); showMsg(t('repaired')); say('repair', {}, { cool: 2000 }); }
  if (w === 'dmg') { G.lvl.dmg++; G.dmgMul += 0.15; showMsg(t('dmgUp')); say('dmgUp', {}, { cool: 2000 }); }
  if (w === 'mana') { G.lvl.mana++; G.maxMana += 25; G.manaRegen += 2; showMsg(t('manaUp')); say('manaUp', {}, { cool: 2000 }); }
  sfx('heal');
}

function setPause(p) {
  G.paused = p; $('pause').classList.toggle('hidden', !p);
  if (p) stopSpeech(true);
  if (!p && !IS_TOUCH) renderer.domElement.requestPointerLock();
  if (p && window.touchReset) touchReset();
}
function startGame() {
  if (!AC) try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  enemies.forEach(e => scene.remove(e.mesh)); enemies.length = 0;
  projectiles.forEach(p => scene.remove(p.mesh)); projectiles.length = 0;
  enemyShots.forEach(p => scene.remove(p.mesh)); enemyShots.length = 0;
  stopSpeech(true); clearEggs();
  lowEl.style.opacity = 0;
  clearStatus(); clearHelpers();
  Object.assign(G, { weaponSayAt: performance.now(), chatT: 40, warnHp: false, warnTower: false, called: {}, running: true, paused: false, over: false, wave: 0, gold: 80, score: 0, kills: 0, bodies: {}, towerHp: 1000, maxTowerHp: 1000, mana: 100, maxMana: 100, manaRegen: 7,
    dmgMul: 1, timers: [], spawnQ: [], breakT: 3, waveActive: false, lvl: { dmg: 0, mana: 0 } });
  Object.assign(G.player, { hp: 100, yaw: 0, pitch: 0 }); G.player.pos.set(0, TOWER_Y + 0.4 + EYE, 3);
  _bodyKey = ''; buildHotbar(); selectWeapon(0);
  ['menu', 'over', 'pause'].forEach(i => $(i).classList.add('hidden'));
  if (IS_TOUCH) { if (window.touchEnter) touchEnter(); if (window.touchReset) touchReset(); } else renderer.domElement.requestPointerLock();
  banner(t('bannerStart'));
  say('start', {}, { prio: 2, cool: 0 });
}
document.querySelectorAll('.langbtn').forEach(b => b.onclick = () => setLang(b.dataset.lang));
applyLang();
$('start').onclick = startGame; $('restart').onclick = startGame; $('resume').onclick = () => setPause(false);

// ---------- fale ----------
function planWave(n) {
  const q = [];
  const add = (t, c) => { for (let i = 0; i < c; i++) q.push(t); };
  add('goblin', 4 + n * 2); add('ork', 1 + Math.floor(n * 1.2));
  if (n >= 2) add('thief', Math.floor(n / 2) + 1);
  const pick = (arr) => arr[Math.random() * arr.length | 0];
  if (n >= 2) add('mage', Math.max(1, Math.floor(n / 3)));
  if (n >= 3) for (let i = 0; i < Math.floor(n / 2); i++) q.push(pick(['pyro', 'frost', 'storm', 'necro'].slice(0, n >= 5 ? 4 : n >= 4 ? 3 : 2)));
  if (n >= 2) add('warg', Math.floor(n / 2));
  if (n >= 3) add('elfarcher', Math.floor(n / 2));
  if (n >= 4) add('elfwitch', Math.floor((n - 2) / 2));
  if (n >= 4) add('shaman', Math.floor((n - 2) / 3));
  if (n >= 3 && n % 2 === 1) for (let i = 0; i < Math.ceil((n - 2) / 3); i++) q.push(i === 0 && n < 5 ? 'dragon' : pick(n >= 7 ? ['dragon', 'icedragon', 'poisondragon'] : ['dragon', 'icedragon']));
  for (let i = q.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [q[i], q[j]] = [q[j], q[i]]; }
  return q;
}
function spawnEnemy(type) {
  const side = Math.random() * 4 | 0, ang = side * Math.PI / 2, dist = TYPES[type].isDragon ? 150 : (TYPES[type].ranged ? 110 : 120) + Math.random() * 20;
  const lat = rnd(-3, 3), ax = -Math.sin(ang), az = -Math.cos(ang);
  const pos = new THREE.Vector3(-ax * dist + az * lat * -1, 0, -az * dist + ax * lat);
  pos.set(Math.round(-ax) * dist + (ax ? 0 : lat), 0, Math.round(-az) * dist + (az ? 0 : lat));
  if (TYPES[type].isDragon) { pos.set(Math.cos(ang) * dist, TOWER_Y + 20, Math.sin(ang) * dist); }
  enemies.push(new Enemy(type, pos));
  if (!G.called) G.called = {};
  if (G.called[type] !== G.wave) {
    G.called[type] = G.wave;
    const d = dirName(dirOf(pos));
    say(type + 'Call', { d }, { prio: TYPES[type].isDragon ? 2 : 1, cool: 0 });
    if ((type === 'ork' || type === 'goblin') && Math.random() < 0.3) setTimeout(() => G.running && say(type + 'Taunt', {}, { prio: 0, cool: 15000 }), 2500);
  }
}
function updateWaves(dt) {
  if (!G.waveActive) {
    G.breakT -= dt;
    if (G.breakT <= 0) { G.wave++; eggOnWave(G.wave); G.spawnQ = planWave(G.wave); G.waveActive = true; G.spawnT = 0; banner(t('waveBanner', G.wave, waveTitle(G.wave))); say('waveStart', waveCtx(G.wave), { prio: 1, cool: 0 }); }
    return;
  }
  G.spawnT -= dt;
  if (G.spawnQ.length && G.spawnT <= 0) { spawnEnemy(G.spawnQ.pop()); G.spawnT = Math.max(0.5, 2.2 - G.wave * 0.1) * (0.6 + Math.random() * 0.8); }
  if (!G.spawnQ.length && enemies.length === 0) {
    G.waveActive = false; G.breakT = 9; addGold(40 + G.wave * 10); addScore(100 * G.wave);
    G.towerHp = Math.min(G.maxTowerHp, G.towerHp + 60); showMsg(t('waveClear', G.wave, 40 + G.wave * 10)); say('waveClear', Object.assign(waveCtx(G.wave), { p: 40 + G.wave * 10 }), { prio: 1, cool: 0 });
  }
}

// ---------- loop ----------
const labelPool = [];
function updateLabels() {
  const box = $('labels'); let n = 0;
  for (const e of enemies) {
    if (e.dead) continue;
    const p = e.center.clone(); p.y += e.r + 0.4; p.project(camera);
    if (p.z > 1 || Math.abs(p.x) > 1.1 || Math.abs(p.y) > 1.1) continue;
    if (e.center.distanceTo(camera.position) > 120) continue;
    let el = labelPool[n]; if (!el) { el = document.createElement('div'); el.className = 'hb'; el.innerHTML = '<div></div>'; box.appendChild(el); labelPool.push(el); }
    el.style.display = 'block'; el.style.left = (p.x * .5 + .5) * innerWidth + 'px'; el.style.top = (-p.y * .5 + .5) * innerHeight + 'px';
    el.firstChild.style.width = Math.max(0, e.hp / e.maxHp * 100) + '%'; n++;
  }
  for (let i = n; i < labelPool.length; i++) labelPool[i].style.display = 'none';
}
// ---------- minimap (up = the direction you are facing) ----------
const MM_COL = { ork: '#7bd13a', goblin: '#c6f06a', thief: '#ffd24a', mage: '#c070ff', dragon: '#ff4a2a', icedragon: '#7fe8ff', poisondragon: '#b6ff2a',
  warg: '#a07a40', shaman: '#3aff8a', elfarcher: '#6a8aff', elfwitch: '#ff4aa0', pyro: '#ff8a1a', frost: '#9fe8ff', storm: '#fff07a', necro: '#9bff3a' };
const MM_GROUP = { pyro: 'mage', frost: 'mage', storm: 'mage', necro: 'mage', elfwitch: 'elfarcher' };
const mmColor = t => MM_COL[MM_GROUP[t] || t];
const MM_SIDES = [['N', 0, -1], ['E', 1, 0], ['S', 0, 1], ['W', -1, 0]];
function drawMinimap() {
  const cv = $('minimap'), c = cv.getContext('2d'), S = cv.width, h = S / 2, R = 160, k = (h - 8) / R;
  const cs = Math.cos(G.player.yaw), sn = Math.sin(G.player.yaw);
  const mp = (x, z) => [h + (x * cs - z * sn) * k, h + (x * sn + z * cs) * k];
  const cnt = { N: 0, E: 0, S: 0, W: 0 };
  for (const e of enemies) {
    if (e.dead) continue;
    const p = e.mesh.position;
    cnt[Math.abs(p.x) > Math.abs(p.z) ? (p.x > 0 ? 'E' : 'W') : (p.z > 0 ? 'S' : 'N')]++;
  }
  c.clearRect(0, 0, S, S); c.save();
  c.beginPath(); c.arc(h, h, h - 2, 0, Math.PI * 2); c.clip();
  c.fillStyle = '#2f4a22'; c.fillRect(0, 0, S, S);
  c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 1.5;
  [50, 100, 150].forEach(r => { c.beginPath(); c.arc(h, h, r * k, 0, Math.PI * 2); c.stroke(); });
  // rzeka
  c.strokeStyle = '#3a78b8'; c.lineWidth = 14 * k; c.beginPath();
  let a = mp(-400, 120), b = mp(400, 120); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
  // drogi
  const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 180);
  for (const [name, dx, dz] of MM_SIDES) {
    a = mp(dx * 20, dz * 20); b = mp(dx * R * 1.2, dz * R * 1.2);
    c.lineCap = 'butt'; c.strokeStyle = '#9a7c50'; c.lineWidth = Math.max(8, 9 * k);
    c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
    if (cnt[name]) { c.strokeStyle = `rgba(255,50,30,${0.3 + 0.35 * pulse})`; c.stroke(); }
  }
  // mur
  c.strokeStyle = '#b8b2a0'; c.lineWidth = 4; c.beginPath();
  [[-26, -26], [26, -26], [26, 26], [-26, 26]].forEach(([x, z], i) => { const q = mp(x, z); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); });
  c.closePath(); c.stroke();
  // tower
  c.fillStyle = '#ddd'; c.strokeStyle = '#000'; c.lineWidth = 2;
  c.beginPath(); c.arc(h, h, 11 * k, 0, Math.PI * 2); c.fill(); c.stroke();
  // pole widzenia
  c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.moveTo(h, h);
  c.arc(h, h, h, -Math.PI / 2 - 0.85, -Math.PI / 2 + 0.85); c.closePath(); c.fill();
  // wrogowie
  for (const e of enemies) {
    if (e.dead) continue;
    const p = e.mesh.position; let x = p.x, z = p.z; const d = Math.hypot(x, z);
    if (d > R) { x *= R / d; z *= R / d; }
    const q = mp(x, z), big = !!e.isDragon, r = big ? 11 : ({ goblin: 5, thief: 6, elfarcher: 6, warg: 8 }[e.type] || 7);
    c.fillStyle = mmColor(e.type); c.strokeStyle = '#000'; c.lineWidth = 2; c.beginPath();
    if (big) { c.moveTo(q[0], q[1] - r); c.lineTo(q[0] + r, q[1] + r * 0.8); c.lineTo(q[0] - r, q[1] + r * 0.8); c.closePath(); }
    else c.arc(q[0], q[1], r, 0, Math.PI * 2);
    c.fill(); c.stroke();
  }
  c.restore();
  // kompas i liczniki
  c.font = 'bold 26px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
  for (const [name, dx, dz] of MM_SIDES) {
    const rr = h - 26, x = h + (dx * cs - dz * sn) * rr, y = h + (dx * sn + dz * cs) * rr, hot = cnt[name] > 0;
    c.lineWidth = 5; c.strokeStyle = '#000'; c.fillStyle = hot ? '#ff6a4a' : '#e8d8b0';
    const t = hot ? name + ' ' + cnt[name] : name;
    c.strokeText(t, x, y); c.fillText(t, x, y);
  }
}

function bodyHTML(full) {
  const list = Object.entries(G.bodies).sort((a, b) => b[1] - a[1]);
  if (!list.length) return full ? '' : `<b>☠ ${t('bodyTitle')}: 0</b>`;
  const rows = (full ? list : list.slice(0, 8)).map(([k, n]) => `<div><i style="background:${MM_COL[k] || '#ccc'}"></i><span>${enemyName(k)}</span><b>${n}</b></div>`).join('');
  const more = !full && list.length > 8 ? `<div class="more">+${list.length - 8}…</div>` : '';
  return `<h4>☠ ${t('bodyTitle')}: ${G.kills}</h4>${rows}${more}`;
}
let _bodyKey = '';
function updateBodies() {
  const key = LANG + G.kills + Object.keys(G.bodies).length;
  if (key !== _bodyKey) { _bodyKey = key; $('bodies').innerHTML = bodyHTML(false); }
}

function updateHUD() {
  drawMinimap(); updateBodies();
  const hp = G.player.hp, tf = G.towerHp / G.maxTowerHp;
  if (hp < 40) {
    const k = (40 - hp) / 40, beat = 0.7 + 0.3 * Math.sin(performance.now() / (260 - 120 * k));
    lowEl.style.opacity = Math.min(1, (0.35 + 0.65 * k) * beat);
  } else lowEl.style.opacity = 0;
  if (hp < 30 && !G.warnHp) { G.warnHp = true; showMsg(t('warnHp')); say(hp < 15 ? 'critHp' : 'lowHp', {}, { prio: 2, cool: 8000 }); } else if (hp > 60) G.warnHp = false;
  if (tf < 0.3 && !G.warnTower) { G.warnTower = true; showMsg(t('warnTower')); say('lowTower', {}, { prio: 2, cool: 8000 }); } else if (tf > 0.5) G.warnTower = false;
  $('towerHp').style.width = Math.max(0, G.towerHp / G.maxTowerHp * 100) + '%';
  $('playerHp').style.width = Math.max(0, G.player.hp) + '%';
  $('mana').style.width = G.mana / G.maxMana * 100 + '%';
  $('wave').textContent = G.wave; $('gold').textContent = Math.floor(G.gold); $('score').textContent = G.score;
  const c = costs(); $('cRepair').textContent = c.repair + '💰'; $('cDmg').textContent = c.dmg + '💰'; $('cMana').textContent = c.mana + '💰';
  WEAPONS.forEach((w, i) => {
    const s = $('slot' + i); s.querySelector('.cd').style.height = Math.max(0, G.cds[i] / w.cd) * 100 + '%';
    s.classList.toggle('no', w.mana > G.mana);
    const hc = s.querySelector('.hc'), shift = IS_TOUCH ? touchIn.hold === i : (keys.ShiftLeft || keys.ShiftRight), n = helperCount(i);
    const txt = shift ? (helpers.length >= HELPER_MAX ? '—' : '👤+' + helperCost(i) + '💰') : (n ? '👤' + n : '');
    if (hc._t !== txt) { hc.textContent = txt; hc._t = txt; }
    hc.classList.toggle('shop', !!shift);
  });
}

function tryFire() {
  const w = WEAPONS[G.sel];
  if (G.cds[G.sel] > 0) return;
  if (G.mana < w.mana) { showMsg(t('noMana')); say('noMana', {}, { prio: 1, cool: 8000 }); G.cds[G.sel] = 0.3; return; }
  G.mana -= w.mana; G.cds[G.sel] = w.cd;
  computeAim(); w.fire(); if (vm) vm.userData.kick = 1;
}

let last = performance.now(), time = 0;
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); last = now;
  if (G.running && !G.paused) {
    time += dt;
    const P = G.player, sp = 6 * playerSpeedMul();
    let fx_ = 0, fz = 0;
    if (keys.KeyW) fz -= 1; if (keys.KeyS) fz += 1; if (keys.KeyA) fx_ -= 1; if (keys.KeyD) fx_ += 1;
    fx_ += touchIn.mx; fz += touchIn.my;
    const l = Math.max(1, Math.hypot(fx_, fz)); fx_ /= l; fz /= l;
    const c = Math.cos(P.yaw), s = Math.sin(P.yaw);
    P.pos.x += (fx_ * c + fz * s) * sp * dt; P.pos.z += (-fx_ * s + fz * c) * sp * dt;
    const lim = PLAT + 1.0; P.pos.x = Math.max(-lim, Math.min(lim, P.pos.x)); P.pos.z = Math.max(-lim, Math.min(lim, P.pos.z));
    P.pos.y = TOWER_Y + 0.4 + EYE + ((fx_ || fz) ? Math.sin(time * 10) * 0.04 : 0);

    G.mana = Math.min(G.maxMana, G.mana + G.manaRegen * dt);
    for (let i = 0; i < G.cds.length; i++) G.cds[i] = Math.max(0, G.cds[i] - dt);
    if (mouseDown || touchIn.fire) tryFire();

    for (let i = G.timers.length - 1; i >= 0; i--) { G.timers[i].t -= dt; if (G.timers[i].t <= 0) { G.timers[i].fn(); G.timers.splice(i, 1); } }
    updateWaves(dt);
    G.chatT = (G.chatT === undefined ? 40 : G.chatT) - dt;
    if (G.chatT <= 0) { G.chatT = 50 + Math.random() * 50; say(Math.random() < 0.55 ? 'chat' : 'battle', {}, { prio: 0, cool: 0 }); }
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i]; e.update(dt);
      if (e.remove) { scene.remove(e.mesh); enemies.splice(i, 1); }
    }
    updateHelpers(dt); updateEggs(dt);
    updateProjectiles(dt); updateEnemyShots(dt); updateBolts(dt);
    updateLabels(); updateHUD();
  }
  if (G.running) {
    const P = G.player;
    G.shake = Math.max(0, G.shake - dt * 1.5);
    camera.position.copy(P.pos).add(new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)).multiplyScalar(G.shake * 0.25));
    camera.rotation.set(P.pitch, P.yaw, 0);
    if (vm) { vm.userData.kick = Math.max(0, vm.userData.kick - dt * 6); vm.position.set(0, Math.sin(time * 2) * 0.004 - vm.userData.kick * 0.05, vm.userData.kick * 0.08); vm.rotation.x = vm.userData.kick * 0.15; if (vm.userData.upd) vm.userData.upd(G.cds[G.sel] / WEAPONS[G.sel].cd); }
  } else {
    time += dt; camera.position.set(Math.cos(time * 0.1) * 12, TOWER_Y + 8, Math.sin(time * 0.1) * 12); camera.lookAt(0, TOWER_Y, 0);
  }
  if (!G.paused) { fx.update(dt); }
  updateWorld(time, dt); updateRubble(dt); if (G.running && !G.paused) updateStatus(dt);
  renderer.render(scene, camera);
}
requestAnimationFrame(loop);
