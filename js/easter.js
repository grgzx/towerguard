// Easter eggs: from wave 2 on, at most one passing curiosity per wave. Each builder returns { group, update(dt, age) } and
// update() returns false when the scene is over. The crew's comments are in lines_easter.js.
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
  const g = new THREE.Group(), car = new THREE.Group(), ch = eggChord(105, 190), DUR = 5.5, H = 24;
  const steel = eggMat(0xaab0ba, { emissive: 0x2c3036 }), dark = eggMat(0x1c2026), glass = eggMat(0x3a4a60, { emissive: 0x1a2432 });
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
  const trailG = new THREE.Group(); trailG.position.set(ch.x0, H + 0.1, ch.z0); trailG.rotation.y = ch.yaw; g.add(trailG);
  const trails = [-1.1, 1.1].map(x => { const p = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1), fireM); p.rotation.x = -Math.PI / 2; p.position.x = x; trailG.add(p); return p; });
  const flash = eggGlow(0xcfe8ff, 6, 0); g.add(flash);
  const len = Math.hypot(ch.x1 - ch.x0, ch.z1 - ch.z0); let gone = false;
  return { group: g, update(dt, age) {
    const u = Math.min(1, age / DUR), p = Math.pow(u, 1.7) * len, k = p / len;
    car.position.set(ch.x0 + (ch.x1 - ch.x0) * k, H + 0.5 + Math.sin(age * 5) * 0.2, ch.z0 + (ch.z1 - ch.z0) * k);
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

// ---- E.T. rides in the basket of a bicycle flying across the moon; his heart and fingertip glow ----
eggReg('et', () => {
  const g = new THREE.Group(), b = new THREE.Group(), ch = eggChord(105, 170), DUR = 15, H = 42;
  const iron = eggMat(0x2a2e34), red = eggMat(0xb02a2a), wicker = eggMat(0xb88a4a, { side: THREE.DoubleSide });
  const hoodie = eggMat(0x9a2a2a), jeans = eggMat(0x2e3c5c), tan = eggMat(0xe0b890);
  const skin = eggMat(0x8b7258), belly = eggMat(0xa89270), dk = eggMat(0x65503c), eyeM = eggMat(0x4a3a18);
  const black = new THREE.MeshBasicMaterial({ color: 0x080604 }), white = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const add = (geo, m, x, y, z, p) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); (p || b).add(o); return o; };
  const sph = (r) => new THREE.SphereGeometry(r, 10, 8);
  // bicycle
  const wheels = [-1.4, 1.4].map(z => { const w = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.07, 6, 16), iron); w.rotation.y = Math.PI / 2; w.position.set(0, 0.8, z); b.add(w); return w; });
  add(new THREE.BoxGeometry(0.09, 0.09, 2.1), red, 0, 1.55, 0.15);
  add(new THREE.BoxGeometry(0.09, 1.0, 0.09), red, 0, 1.15, -0.85);
  add(new THREE.BoxGeometry(0.09, 1.1, 0.09), red, 0, 1.15, 1.3).rotation.x = -0.2;
  add(new THREE.BoxGeometry(0.9, 0.07, 0.07), iron, 0, 1.9, 1.25);
  add(new THREE.BoxGeometry(0.28, 0.09, 0.5), iron, 0, 1.75, -0.95);
  add(new THREE.CylinderGeometry(0.62, 0.48, 0.55, 12, 1, true), wicker, 0, 2.1, 1.7);
  add(new THREE.CircleGeometry(0.48, 12), wicker, 0, 1.83, 1.7).rotation.x = -Math.PI / 2;
  add(new THREE.TorusGeometry(0.62, 0.04, 5, 14), wicker, 0, 2.375, 1.7).rotation.x = Math.PI / 2;
  // the boy pedalling
  const pedals = [0, 1].map(() => add(new THREE.BoxGeometry(0.35, 0.07, 0.22), iron, 0, 0.8, -0.2));
  const legs = [-1, 1].map(s => { const l = new THREE.Group(); l.position.set(s * 0.22, 2.0, -0.95); b.add(l); add(new THREE.BoxGeometry(0.2, 1, 0.22), jeans, 0, -0.5, 0, l); return l; });
  add(new THREE.BoxGeometry(0.8, 1.2, 0.5), hoodie, 0, 2.7, -1.1).rotation.x = 0.35;
  add(sph(0.33), tan, 0, 3.55, -0.75); add(sph(0.38), hoodie, 0, 3.55, -0.95).scale.set(1, 1, 0.9);
  [-1, 1].forEach(s => { const a = new THREE.Group(); a.position.set(s * 0.5, 3.15, -0.9); a.rotation.x = 0.527; b.add(a); add(new THREE.BoxGeometry(0.18, 0.18, 2.49), hoodie, 0, 0, 1.245, a); });
  // E.T. sitting in the basket
  const et = new THREE.Group(); et.position.set(0, 1.9, 1.7); et.scale.setScalar(0.8); b.add(et);
  [-1, 1].forEach(s => { add(new THREE.CylinderGeometry(0.13, 0.15, 0.4, 6), skin, s * 0.22, 0.25, 0.15, et); add(new THREE.BoxGeometry(0.26, 0.1, 0.4), dk, s * 0.22, 0.05, 0.3, et); });
  add(sph(0.5), skin, 0, 0.8, 0, et).scale.set(1, 1.05, 0.9);
  add(sph(0.4), belly, 0, 0.7, 0.28, et).scale.set(0.9, 1, 0.6);
  const heart = eggGlow(0xff4a30, 1.1, 0.7); heart.position.set(0, 0.95, 0.5); et.add(heart);
  add(new THREE.CylinderGeometry(0.15, 0.23, 0.75, 8), skin, 0, 1.45, 0.1, et);
  add(sph(0.52), skin, 0, 2.0, 0.2, et).scale.set(1.2, 1.0, 1.0);
  add(sph(0.4), skin, 0, 2.3, 0.12, et).scale.set(1.2, 0.8, 0.9);
  add(sph(0.3), skin, 0, 1.83, 0.45, et).scale.set(1.1, 0.8, 0.7);
  [-1, 1].forEach(s => {
    add(sph(0.18), eyeM, s * 0.3, 2.0, 0.56, et).scale.set(1, 1.15, 0.5);
    add(sph(0.1), black, s * 0.3, 2.0, 0.63, et);
    add(sph(0.035), white, s * 0.27, 2.06, 0.7, et);
    add(new THREE.BoxGeometry(0.4, 0.06, 0.08), dk, s * 0.3, 2.22, 0.55, et).rotation.z = -s * 0.2;
    add(sph(0.05), dk, s * 0.06, 1.77, 0.72, et);
  });
  add(new THREE.BoxGeometry(0.22, 0.03, 0.04), black, 0, 1.64, 0.7, et);
  const armR = new THREE.Group(); armR.position.set(0.5, 1.1, 0.15); armR.rotation.set(1.15, 0, -0.35); et.add(armR);
  add(new THREE.CylinderGeometry(0.06, 0.08, 1.1, 6), skin, 0, 0.55, 0, armR);
  add(new THREE.CylinderGeometry(0.035, 0.045, 0.4, 5), skin, 0, 1.3, 0, armR);
  const tip = eggGlow(0xff5a3a, 1.5, 0.95); tip.position.set(0, 1.52, 0); armR.add(tip);
  const armL = new THREE.Group(); armL.position.set(-0.5, 1.1, 0.15); armL.rotation.set(2.6, 0, 0.35); et.add(armL);
  add(new THREE.CylinderGeometry(0.06, 0.08, 1.0, 6), skin, 0, 0.5, 0, armL);
  // the moon sits exactly behind the middle of the flight path
  const moon = new THREE.Mesh(new THREE.CircleGeometry(30, 28), new THREE.MeshBasicMaterial({ color: 0xfff6d8, transparent: true, opacity: 0.9, fog: false, depthWrite: false }));
  const mx = (ch.x0 + ch.x1) / 2, mz = (ch.z0 + ch.z1) / 2, dist = Math.hypot(mx, mz), md = dist + 55, my = TOWER_Y + (H - TOWER_Y) * md / dist;
  moon.position.set(mx / dist * md, my, mz / dist * md); moon.lookAt(0, my, 0); g.add(moon);
  const halo = eggGlow(0xfff2c0, 90, 0.35); halo.position.copy(moon.position).multiplyScalar(0.98); g.add(halo);
  b.scale.setScalar(3.4); g.add(b);
  const theme = [392, 440, 523, 659, 784, 988]; let tn = 0;
  return { group: g, update(dt, age) {
    const u = age / DUR, ph = age * 4;
    b.position.set(ch.x0 + (ch.x1 - ch.x0) * u, H + Math.sin(age * 1.6) * 1.8, ch.z0 + (ch.z1 - ch.z0) * u);
    b.rotation.set(0, ch.yaw, Math.sin(age * 1.3) * 0.08, 'YXZ');
    wheels.forEach(w => w.rotation.x = age * 4);
    pedals.forEach((p, i) => {
      const a = ph + i * Math.PI, py = 0.8 + 0.38 * Math.cos(a), pz = -0.2 + 0.38 * Math.sin(a);
      p.position.set((i ? -1 : 1) * 0.3, py, pz);
      const l = legs[i], dy = py - 2.0, dz = pz + 0.95;
      l.rotation.x = Math.atan2(-dz, -dy); l.scale.y = Math.hypot(dy, dz);
    });
    et.rotation.z = Math.sin(age * 1.9) * 0.05;
    heart.material.opacity = 0.5 + 0.4 * Math.sin(age * 3.4); heart.scale.setScalar(1.0 + 0.2 * Math.sin(age * 3.4));
    tip.material.opacity = 0.65 + 0.3 * Math.sin(age * 6); tip.scale.setScalar(1.4 + 0.3 * Math.sin(age * 6));
    if (age > tn * 1.2 && tn < theme.length) { eggBeep('sine', theme[tn], theme[tn], 0.5, 0.05); tn++; }
    return u < 1;
  } };
});

// ---- A Starlink train: dozens of tiny lights in a perfect line crossing the sky ----
eggReg('starlink', () => {
  const g = new THREE.Group(), ch = eggChord(180, 260), N = 26, DUR = 18, H = 105;
  const pts = new Float32Array(N * 3);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
  const train = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xfff6e0, size: 7, map: world.glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, sizeAttenuation: false }));
  train.frustumCulled = false; g.add(train);
  const dx = ch.x1 - ch.x0, dz = ch.z1 - ch.z0, L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L, spacing = 12;
  return { group: g, update(dt, age) {
    const u = age / DUR, head = (u * (L + N * spacing)) ;
    for (let i = 0; i < N; i++) {
      const s = head - i * spacing;
      pts[i * 3] = ch.x0 + ux * s; pts[i * 3 + 1] = H + Math.sin(s * 0.004) * 6 - s * 0.01; pts[i * 3 + 2] = ch.z0 + uz * s;
      if (s < 0 || s > L) pts[i * 3 + 1] = -500;
    }
    geo.attributes.position.needsUpdate = true;
    return u < 1;
  } };
});

// ---- A T. rex sprints across the far plain; the ground shakes a little with every step ----
eggReg('trex', () => {
  const g = new THREE.Group(), r = new THREE.Group(), ch = eggChord(150, 130), DUR = 11;
  const skin = eggMat(0x5c7a3a), belly = eggMat(0x9db070), dark = eggMat(0x2c3a20);
  const add = (geo, m, x, y, z, p) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; (p || r).add(o); return o; };
  add(new THREE.SphereGeometry(2.2, 10, 8), skin, 0, 5.6, 0).scale.set(1, 1.1, 1.8);
  add(new THREE.SphereGeometry(1.6, 8, 8), belly, 0, 4.9, 0.7).scale.set(0.9, 0.9, 1.6);
  const neck = add(new THREE.CylinderGeometry(0.9, 1.5, 3, 8), skin, 0, 7.4, 3.3); neck.rotation.x = 0.7;
  add(new THREE.BoxGeometry(2.0, 1.6, 3.4), skin, 0, 9.0, 4.9);
  add(new THREE.BoxGeometry(1.8, 0.6, 3.0), belly, 0, 8.1, 4.9);
  [-1, 1].forEach(s => add(new THREE.SphereGeometry(0.22, 6, 6), eggMat(0xffe040), s * 1.0, 9.5, 5.4));
  const tail = add(new THREE.ConeGeometry(1.7, 9, 8), skin, 0, 5.0, -6.5); tail.rotation.x = -Math.PI / 2 - 0.12;
  [-1, 1].forEach(s => { add(new THREE.CylinderGeometry(0.15, 0.12, 1.6, 5), dark, s * 0.9, 5.0, 3.3).rotation.x = 0.9; });
  const legs = [-1, 1].map(s => {
    const l = new THREE.Group(); l.position.set(s * 1.5, 4.4, 0); r.add(l);
    add(new THREE.CylinderGeometry(0.9, 0.6, 3.2, 7), skin, 0, -1.4, 0, l);
    const foot = add(new THREE.BoxGeometry(1.2, 0.5, 2.2), dark, 0, -3.1, 0.7, l);
    return l;
  });
  r.scale.setScalar(1.3); r.rotation.y = ch.yaw; g.add(r);
  const dx = ch.x1 - ch.x0, dz = ch.z1 - ch.z0; let step = 0;
  return { group: g, update(dt, age) {
    const u = age / DUR, ph = age * 5.2;
    r.position.set(ch.x0 + dx * u, Math.abs(Math.sin(ph)) * 0.8, ch.z0 + dz * u);
    legs[0].rotation.x = Math.sin(ph) * 0.7; legs[1].rotation.x = -Math.sin(ph) * 0.7;
    r.rotation.x = Math.sin(ph * 2) * 0.03;
    if (Math.floor(ph / Math.PI) > step) { step = Math.floor(ph / Math.PI); if (G.running && !G.paused) { G.shake = Math.max(G.shake, 0.08); eggBeep('sine', 60, 30, 0.22, 0.18); } }
    return u < 1;
  } };
});

function skullTexture() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 80; const x = c.getContext('2d');
  x.fillStyle = '#10161a'; x.fillRect(0, 0, 128, 80);
  x.strokeStyle = '#c9e8d4'; x.lineWidth = 6; x.lineCap = 'round';
  x.beginPath(); x.moveTo(30, 62); x.lineTo(98, 22); x.moveTo(98, 62); x.lineTo(30, 22); x.stroke();
  x.fillStyle = '#e8f4ec'; x.beginPath(); x.arc(64, 38, 17, 0, 7); x.fill(); x.fillRect(55, 48, 18, 14);
  x.fillStyle = '#10161a'; x.beginPath(); x.arc(57, 37, 4.5, 0, 7); x.arc(71, 37, 4.5, 0, 7); x.fill();
  return new THREE.CanvasTexture(c);
}
function tatteredSail(w, h) {
  const sh = new THREE.Shape(), n = 7;
  sh.moveTo(-w * 0.5, 0.2 * h); sh.lineTo(-w * 0.42, h); sh.lineTo(w * 0.42, h); sh.lineTo(w * 0.5, 0.2 * h);
  for (let i = 1; i < n; i++) sh.lineTo(w * 0.5 - w * i / n, ((i * 37) % 5) / 5 * 0.3 * h + (i % 2 ? 0 : 0.02 * h));
  const hole = new THREE.Path(); hole.moveTo(-w * 0.1, h * 0.45); hole.lineTo(w * 0.12, h * 0.4); hole.lineTo(w * 0.02, h * 0.68); sh.holes.push(hole);
  return new THREE.ShapeGeometry(sh);
}

// ---- A ghostly galleon sails through the sky: tattered braced sails, glowing gun ports, a skull flag, green mist and drips ----
eggReg('dutchman', () => {
  const g = new THREE.Group(), s = new THREE.Group(), ch = eggChord(175, 230), DUR = 19, H = 42;
  const gm = (c, o, em) => new THREE.MeshLambertMaterial({ color: c, emissive: em, transparent: true, opacity: o });
  const hullM = gm(0x4b6e5c, 0.9, 0x10301f), darkM = gm(0x22342c, 0.92, 0x081810);
  const sailM = new THREE.MeshBasicMaterial({ color: 0xbfe0c8, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false });
  const glowM = new THREE.MeshBasicMaterial({ color: 0x9bffc4, transparent: true, opacity: 0.9 });
  const add = (geo, m, x, y, z, p) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); (p || s).add(o); return o; };
  // hull: a side profile (z along the ship, y up) extruded across the beam
  const pr = new THREE.Shape();
  pr.moveTo(-4.1, 0.2); pr.quadraticCurveTo(-3.9, -0.9, -2.8, -1.0); pr.lineTo(2.6, -0.9); pr.quadraticCurveTo(4.6, -0.5, 5.2, 0.9);
  pr.lineTo(5.5, 1.2); pr.lineTo(3.4, 0.85); pr.lineTo(-1.2, 0.85); pr.lineTo(-1.2, 1.9); pr.lineTo(-4.4, 2.1); pr.lineTo(-4.1, 0.2);
  const hg = new THREE.ExtrudeGeometry(pr, { depth: 2.6, bevelEnabled: false, curveSegments: 8 }); hg.rotateY(-Math.PI / 2); hg.translate(1.3, 0, 0);
  s.add(new THREE.Mesh(hg, hullM));
  [-1, 1].forEach(sd => [-0.6, 0.5, 1.6, 2.7, 3.7].forEach(z => add(new THREE.BoxGeometry(0.06, 0.34, 0.4), glowM, sd * 1.31, 0.1, z)));
  [-0.7, 0, 0.7].forEach(x => add(new THREE.BoxGeometry(0.5, 0.4, 0.06), glowM, x, 1.35, -4.3));
  add(new THREE.CylinderGeometry(0.08, 0.1, 3.4, 6), darkM, 0, 1.7, 7.0).rotation.x = 1.27;
  // masts, yards and braced, tattered sails
  const sails = [], D = 0.55;
  [[2.4, 6.2, [[1.4, 2.6, 2.4], [4.0, 2.0, 1.8]]], [0.2, 6.9, [[1.5, 3.0, 2.8], [4.5, 2.3, 2.0]]], [-2.1, 5.7, [[1.6, 2.2, 2.0], [3.9, 1.6, 1.4]]]].forEach(([z, top, list]) => {
    add(new THREE.CylinderGeometry(0.09, 0.14, top - 0.8, 6), darkM, 0, (top + 0.8) / 2, z);
    list.forEach(([y0, w, h]) => {
      const sail = add(tatteredSail(w, h), sailM, 0, y0, z + 0.1); sail.rotation.y = D; sails.push(sail);
      const yard = add(new THREE.CylinderGeometry(0.05, 0.05, w * 0.95, 5), darkM, 0, y0 + h, z + 0.1); yard.rotation.z = Math.PI / 2; yard.rotation.y = D;
    });
  });
  const flag = add(new THREE.PlaneGeometry(1.7, 1.06), new THREE.MeshBasicMaterial({ map: skullTexture(), side: THREE.DoubleSide, transparent: true, opacity: 0.95 }), 0, 7.0, -0.8);
  flag.rotation.y = Math.PI / 2;
  [[-1, 1], [1, 1], [-1, -1], [1, -1]].slice(0, 2).forEach(([x]) => { const l = eggGlow(0x8dffb8, 2.2, 0.75); l.position.set(x * 1.0, 2.6, -4.0); s.add(l); });
  const aura = eggGlow(0x66ffaa, 20, 0.2); aura.position.y = 2; s.add(aura);
  const mist = [];
  for (let i = 0; i < 6; i++) { const m = eggGlow(0x7bffb0, 6 + i * 1.3, 0.3); m.position.set(0, -0.2 + (i % 2) * 0.8, -5.5 - i * 2.4); s.add(m); mist.push(m); }
  const weeds = [];
  for (let i = 0; i < 8; i++) { const w = add(new THREE.ConeGeometry(0.1, 1.5 + (i % 3) * 0.5, 5), darkM, ((i % 3) - 1) * 0.7, -1.8, -3 + i * 1.0); w.rotation.x = Math.PI; weeds.push(w); }
  const N = 16, pos = new Float32Array(N * 3), sd = []; for (let i = 0; i < N; i++) sd.push({ x: (Math.random() - 0.5) * 2.4, z: -3.5 + Math.random() * 8, ph: Math.random(), sp: 0.25 + Math.random() * 0.3 });
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const drips = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0x8dffc0, size: 0.8, map: world.glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.8 }));
  drips.frustumCulled = false; s.add(drips);
  s.scale.setScalar(5.4); g.add(s);
  let moan = 0;
  return { group: g, update(dt, age) {
    const u = age / DUR;
    s.position.set(ch.x0 + (ch.x1 - ch.x0) * u, H + Math.sin(age * 0.9) * 3, ch.z0 + (ch.z1 - ch.z0) * u);
    s.rotation.set(Math.sin(age * 0.9 + 1) * 0.07, ch.yaw, Math.sin(age * 0.7) * 0.1, 'YXZ');
    sails.forEach((a, i) => { a.rotation.y = D + Math.sin(age * 1.8 + i) * 0.1; a.scale.y = 1 + Math.sin(age * 2.6 + i * 1.7) * 0.04; });
    flag.rotation.x = Math.sin(age * 5) * 0.25;
    mist.forEach((m, i) => { m.material.opacity = 0.14 + 0.1 * Math.sin(age * 2 + i * 1.3) + (i < 2 ? 0.1 : 0); });
    weeds.forEach((w, i) => { w.rotation.z = Math.sin(age * 2.2 + i) * 0.25; });
    for (let i = 0; i < N; i++) { const d = sd[i], k = (age * d.sp + d.ph) % 1; pos[i * 3] = d.x; pos[i * 3 + 1] = -1.1 - k * 7; pos[i * 3 + 2] = d.z; }
    dg.attributes.position.needsUpdate = true;
    if (age > moan) { moan += 6; eggBeep('sine', 0, 0, 2.2, 0.06, [196, 185, 175, 165, 156, 147, 139, 131]); }
    return u < 1;
  } };
});

// ---- Riders of Rohan: a line of horsemen thunders along the far horizon under a green banner; a horn sounds ----
eggReg('rohan', () => {
  const g = new THREE.Group(), ch = eggChord(105, 110), DUR = 10, N = 14;
  const dx = ch.x1 - ch.x0, dz = ch.z1 - ch.z0, L = Math.hypot(dx, dz);
  const coats = [eggMat(0x8a6a44), eggMat(0xd8d0c0), eggMat(0x4a3220), eggMat(0x6e5a48)];
  const armor = eggMat(0xaab0b8), cloak = eggMat(0x3e7a3a), spear = eggMat(0x5a4020), white = eggMat(0xf2f2ee);
  const bodyG = new THREE.BoxGeometry(0.9, 1.0, 2.3), neckG = new THREE.BoxGeometry(0.4, 1.0, 0.5), headG = new THREE.BoxGeometry(0.4, 0.5, 0.9);
  const legG = new THREE.BoxGeometry(0.2, 1.2, 0.2), riderG = new THREE.BoxGeometry(0.55, 0.9, 0.4), helmG = new THREE.SphereGeometry(0.28, 6, 6), spearG = new THREE.CylinderGeometry(0.03, 0.03, 3.4, 4);
  const riders = [];
  for (let i = 0; i < N; i++) {
    const h = new THREE.Group(), coat = coats[i % coats.length], leader = i === 0;
    const mk = (geo, m, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); h.add(o); return o; };
    mk(bodyG, coat, 0, 1.6, 0);
    mk(neckG, coat, 0, 2.3, 1.1).rotation.x = 0.5;
    mk(headG, coat, 0, 2.7, 1.55);
    const legs = [[-0.3, 0.9], [0.3, 0.9], [-0.3, -0.9], [0.3, -0.9]].map(([x, z]) => { const l = new THREE.Group(); l.position.set(x, 1.1, z); h.add(l); const m = new THREE.Mesh(legG, coat); m.position.y = -0.6; l.add(m); return l; });
    mk(riderG, leader ? cloak : armor, 0, 2.5, 0);
    mk(helmG, armor, 0, 3.2, 0);
    mk(spearG, spear, 0.45, 3.0, 0.1).rotation.x = 1.25;
    if (leader) {
      mk(new THREE.CylinderGeometry(0.05, 0.05, 4.2, 5), spear, -0.45, 3.6, 0);
      const flag = mk(new THREE.PlaneGeometry(1.8, 1.2), new THREE.MeshLambertMaterial({ color: 0x2e7a34, side: THREE.DoubleSide }), -0.45, 5.2, -0.9);
      flag.rotation.y = Math.PI / 2;
      const emblem = mk(new THREE.PlaneGeometry(0.7, 0.4), new THREE.MeshLambertMaterial({ color: 0xf2f2ee, side: THREE.DoubleSide }), -0.46, 5.2, -0.9); emblem.rotation.y = Math.PI / 2;
    }
    h.scale.setScalar(2.8); g.add(h);
    riders.push({ h, legs, off: leader ? 0 : 7 + (i % 5) * 4.2, side: leader ? 0 : ((i % 2) * 2 - 1) * (2.2 + (i % 3) * 1.6), ph: Math.random() * 6 });
  }
  let horn = false, rumble = 0;
  return { group: g, update(dt, age) {
    const u = age / DUR, lead = u * (L + 30) - 10;
    riders.forEach((r, i) => {
      const s = Math.max(-40, Math.min(L + 40, lead - r.off)), k = s / L, ph = age * 9 + r.ph;
      r.h.position.set(ch.x0 + dx * k - dz / L * r.side, Math.abs(Math.sin(ph)) * 0.5, ch.z0 + dz * k + dx / L * r.side);
      r.h.rotation.y = ch.yaw; r.h.visible = s > -35 && s < L + 35;
      r.legs.forEach((l, j) => { l.rotation.x = Math.sin(ph + (j % 2) * Math.PI + (j > 1 ? 1.2 : 0)) * 0.9; });
    });
    if (!horn && age > 0.3) { horn = true; eggBeep('sawtooth', 0, 0, 2.2, 0.07, [196, 196, 196, 262, 262, 262, 330, 330, 392, 392]); }
    if (age > rumble) { rumble += 0.35; eggBeep('sine', 70, 40, 0.3, 0.12); }
    return u < 1;
  } };
});

// ---- Two figures skip along the plain clapping coconut halves together; no horse in sight ----
eggReg('coconut', () => {
  const g = new THREE.Group(), ch = eggChord(75, 95), DUR = 17;
  const dx = ch.x1 - ch.x0, dz = ch.z1 - ch.z0;
  const mail = eggMat(0x9096a0), red = eggMat(0x9a2a2a), tunic = eggMat(0x8a6a44), skin = eggMat(0xe0b890), gold = eggMat(0xe6b830), nut = eggMat(0x5a3a1c), dark = eggMat(0x3a2a1a);
  function person(body, king) {
    const p = new THREE.Group(), mk = (geo, m, x, y, z, par) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); (par || p).add(o); o.castShadow = true; return o; };
    mk(new THREE.BoxGeometry(0.9, 1.3, 0.55), body, 0, 1.9, 0);
    mk(new THREE.SphereGeometry(0.32, 8, 8), skin, 0, 2.85, 0);
    const legs = [-1, 1].map(s => { const l = new THREE.Group(); l.position.set(s * 0.25, 1.25, 0); p.add(l); mk(new THREE.BoxGeometry(0.3, 1.2, 0.3), dark, 0, -0.6, 0, l); return l; });
    const arms = [-1, 1].map(s => { const a = new THREE.Group(); a.position.set(s * 0.6, 2.4, 0); p.add(a); mk(new THREE.BoxGeometry(0.22, 0.9, 0.22), body, 0, -0.35, 0.1, a); return a; });
    if (king) { mk(new THREE.CylinderGeometry(0.3, 0.26, 0.26, 8), gold, 0, 3.2, 0); mk(new THREE.BoxGeometry(0.95, 0.5, 0.58), red, 0, 2.15, 0); }
    return { p, legs, arms };
  }
  const arthur = person(mail, true), patsy = person(tunic, false);
  patsy.p.scale.setScalar(0.82);
  const nuts = [];
  [[arthur, 0], [patsy, 1]].forEach(([f]) => {
    [-1, 1].forEach(s => { const n = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), nut); n.position.set(s * 0.1, -0.85, 0.35); f.arms[s < 0 ? 0 : 1].add(n); nuts.push(n); });
  });
  const wrap = new THREE.Group(); wrap.rotation.y = ch.yaw; wrap.scale.setScalar(2.4); g.add(wrap);
  patsy.p.position.z = -2.6; wrap.add(arthur.p); wrap.add(patsy.p);
  let lastStep = -1;
  return { group: g, update(dt, age) {
    const u = age / DUR, ph = age * 6.5;
    wrap.position.set(ch.x0 + dx * u, 0, ch.z0 + dz * u);
    [arthur, patsy].forEach((f, i) => {
      const q = ph + i * 0.9, b = Math.abs(Math.sin(q)) * 0.45;
      f.p.position.y = b; f.legs[0].rotation.x = Math.sin(q) * 0.7; f.legs[1].rotation.x = -Math.sin(q) * 0.7;
      f.arms.forEach((a, k) => { a.rotation.x = -1.0 + Math.sin(q * 2 + k * Math.PI) * 0.35; a.rotation.z = (k ? -1 : 1) * 0.25; });
    });
    const step = Math.floor(ph / (Math.PI / 2));
    if (step !== lastStep) { lastStep = step; if (G.running && !G.paused) eggBeep('square', step % 2 ? 950 : 780, step % 2 ? 640 : 520, 0.07, 0.06); }
    return u < 1;
  } };
});
