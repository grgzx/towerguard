// Easter eggs: from wave 2 on, at most one passing curiosity per wave. Each builder returns { group, update(dt, age) } and
// update() returns false when the scene is over. The scenes are in easter2.js (E.T., Starlink, T. rex), the lines in lines_easter.js.
const EGG = { pending: null, pendingT: 0, cur: null, bag: [], builders: {} };
function eggReg(name, fn) { EGG.builders[name] = fn; }

function eggMat(c, o) { return new THREE.MeshLambertMaterial(Object.assign({ color: c }, o || {})); }
function eggGlow(color, size, opacity) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: world.glowTex, color, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: opacity || 0.9, fog: false }));
  s.scale.set(size, size, 1); return s;
}
// a straight chord at distance `dist` from the tower, random side and direction
function eggChord(dist, half) {
  const a = Math.random() * Math.PI * 2, nx = Math.cos(a), nz = Math.sin(a), s = Math.random() < 0.5 ? 1 : -1, tx = -nz * s, tz = nx * s;
  return { x0: nx * dist - tx * half, z0: nz * dist - tz * half, x1: nx * dist + tx * half, z1: nz * dist + tz * half, yaw: Math.atan2(tx, tz) };
}
function eggBeep(type, f0, f1, dur, vol, steps) {
  if (!AC) return;
  const t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.connect(g); g.connect(AC.destination);
  if (steps) steps.forEach((f, i) => o.frequency.setValueAtTime(f, t + i * dur / steps.length));
  else { o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur); }
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.start(t); o.stop(t + dur);
}

function eggPick() {
  if (!EGG.bag.length) EGG.bag = Object.keys(EGG.builders).sort(() => Math.random() - 0.5);
  return EGG.bag.pop();
}
function eggOnWave(n) {
  if (n < 2) return;
  EGG.pending = eggPick(); EGG.pendingT = 6 + Math.random() * 16;
}
function clearEggs() {
  if (EGG.cur) eggDispose(EGG.cur);
  EGG.cur = null; EGG.pending = null;
}
function eggDispose(c) {
  scene.remove(c.e.group);
  c.e.group.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
}
function updateEggs(dt) {
  if (EGG.pending && !EGG.cur) {
    EGG.pendingT -= dt;
    if (EGG.pendingT <= 0) {
      const name = EGG.pending; EGG.pending = null;
      const e = EGG.builders[name](); scene.add(e.group);
      EGG.cur = { name, e, age: 0 };
      say('egg_' + name, {}, { prio: 1, cool: 0 });
    }
  }
  const c = EGG.cur; if (!c) return;
  c.age += dt;
  if (c.e.update(dt, c.age) === false) { eggDispose(c); EGG.cur = null; }
}

// ---- Doc's time machine: speeds along a far road leaving two lines of fire, then vanishes in a flash ----
eggReg('delorean', () => {
  const g = new THREE.Group(), car = new THREE.Group(), ch = eggChord(105, 190), DUR = 5.5, H = 9;
  const steel = eggMat(0xc6cad2), dark = eggMat(0x1c2026), glass = eggMat(0x2c3644);
  const part = (w, h, d, m, x, y, z) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); car.add(b); return b; };
  part(2.0, 0.55, 4.4, steel, 0, 0.75, 0);
  part(1.85, 0.5, 2.0, glass, 0, 1.25, -0.25);
  part(1.7, 0.1, 1.8, steel, 0, 1.55, -0.25);
  part(1.9, 0.12, 1.4, steel, 0, 1.08, 1.5).rotation.x = 0.12;
  part(1.7, 0.3, 0.2, dark, 0, 0.95, -2.2);
  [-1, 1].forEach(s => {
    part(0.08, 0.6, 1.7, steel, s * 1.15, 1.45, -0.2).rotation.z = -s * 0.85;
    [-1.4, 1.4].forEach(z => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.25, 10), dark); w.position.set(s * 0.95, 0.35, z); car.add(w);
      const r = new THREE.Mesh(new THREE.CircleGeometry(0.45, 10), new THREE.MeshBasicMaterial({ color: 0x66ccff, transparent: true, opacity: 0.8 })); r.rotation.x = -Math.PI / 2; r.position.set(s * 0.95, 0.18, z); car.add(r);
    });
  });
  car.scale.setScalar(3.4); car.rotation.y = ch.yaw; g.add(car);
  const fireM = new THREE.MeshBasicMaterial({ color: 0xff7a18, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.9, depthWrite: false });
  const trailG = new THREE.Group(); trailG.position.set(ch.x0, 0.15, ch.z0); trailG.rotation.y = ch.yaw; g.add(trailG);
  const trails = [-1.1, 1.1].map(x => { const p = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1), fireM); p.rotation.x = -Math.PI / 2; p.position.x = x; trailG.add(p); return p; });
  const flash = eggGlow(0xcfe8ff, 6, 0); g.add(flash);
  const len = Math.hypot(ch.x1 - ch.x0, ch.z1 - ch.z0); let gone = false;
  return { group: g, update(dt, age) {
    const u = Math.min(1, age / DUR), p = Math.pow(u, 1.7) * len, k = p / len;
    car.position.set(ch.x0 + (ch.x1 - ch.x0) * k, H + Math.sin(age * 5) * 0.2, ch.z0 + (ch.z1 - ch.z0) * k);
    trails.forEach(t => { t.scale.y = Math.max(0.01, p); t.position.z = p / 2; });
    if (u >= 1 && !gone) { gone = true; car.visible = false; flash.position.copy(car.position); sfx('zap'); sfx('boom'); }
    if (gone) { const a = age - DUR; flash.material.opacity = Math.max(0, 1 - a * 2.2); flash.scale.setScalar(6 + a * 40); fireM.opacity = Math.max(0, 0.9 - a * 0.22); return a < 4.2; }
    flash.material.opacity = 0;
  } };
});

// ---- A witch on a broom flies across the sky, cackling ----
eggReg('witch', () => {
  const g = new THREE.Group(), w = new THREE.Group(), ch = eggChord(75, 230), DUR = 13, H = 34;
  const black = eggMat(0x16121c), green = eggMat(0x86b84e), straw = eggMat(0xb8964a), wood = eggMat(0x6b4524);
  const add = (geo, m, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); w.add(o); return o; };
  add(new THREE.CylinderGeometry(0.06, 0.06, 3.4, 6), wood, 0, 0, 0).rotation.x = Math.PI / 2;
  add(new THREE.ConeGeometry(0.45, 1.3, 8), straw, 0, 0, -2.2).rotation.x = Math.PI / 2;
  add(new THREE.ConeGeometry(0.6, 1.5, 8), black, 0, 0.8, -0.3);
  add(new THREE.SphereGeometry(0.3, 8, 8), green, 0, 1.75, -0.2);
  add(new THREE.ConeGeometry(0.07, 0.3, 6), green, 0, 1.72, 0.1).rotation.x = Math.PI / 2;
  add(new THREE.CylinderGeometry(0.55, 0.55, 0.06, 10), black, 0, 1.98, -0.2);
  const hat = add(new THREE.ConeGeometry(0.32, 1.0, 8), black, 0, 2.5, -0.2); hat.rotation.x = -0.25;
  const scarf = add(new THREE.BoxGeometry(0.16, 0.08, 1.2), eggMat(0x7a3ca8), 0, 1.5, -0.9);
  const moon = eggGlow(0xfff2c0, 14, 0.35); moon.position.y = 3; w.add(moon);
  w.scale.setScalar(2.4); g.add(w);
  let cackled = 0;
  return { group: g, update(dt, age) {
    const u = age / DUR, bob = Math.sin(age * 2.2);
    w.position.set(ch.x0 + (ch.x1 - ch.x0) * u, H + bob * 2.5, ch.z0 + (ch.z1 - ch.z0) * u);
    w.rotation.set(Math.cos(age * 2.2) * 0.12, ch.yaw, Math.sin(age * 1.4) * 0.2, 'YXZ');
    scarf.rotation.y = Math.sin(age * 9) * 0.4; hat.rotation.z = Math.sin(age * 7) * 0.08;
    if (age > cackled) { cackled += 5.5; eggBeep('sawtooth', 0, 0, 0.9, 0.05, [520, 780, 560, 820, 600, 860, 640, 900, 680, 700]); }
    return u < 1;
  } };
});
