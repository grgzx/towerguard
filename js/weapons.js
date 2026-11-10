// Efekty cząsteczkowe, pociski i uzbrojenie gracza
const GRAV = 20;

const fx = {
  list: [],
  geo: new THREE.SphereGeometry(1, 5, 4),
  burst(pos, color, n, speed, life, size, grav) {
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(this.geo, new THREE.MeshBasicMaterial({ color, transparent: true }));
      m.position.copy(pos); const s = size || 0.15; m.scale.setScalar(s * (0.6 + Math.random() * 0.8));
      scene.add(m);
      const v = new THREE.Vector3(rnd(-1, 1), rnd(-0.2, 1.2), rnd(-1, 1)).normalize().multiplyScalar(speed * (0.3 + Math.random()));
      this.list.push({ m, v, life: life * (0.6 + Math.random() * 0.6), t: 0, g: grav === undefined ? 6 : grav });
    }
  },
  ring(pos, color, radius, life) {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.85, 1, 32), new THREE.MeshBasicMaterial({ color, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    m.position.copy(pos); m.position.y += 0.15; m.rotation.x = -Math.PI / 2; scene.add(m);
    this.list.push({ ring: true, m, life, t: 0, radius, v: new THREE.Vector3(), g: 0 });
  },
  flash(pos, color, size, life) {
    const m = new THREE.Mesh(this.geo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 }));
    m.position.copy(pos); m.scale.setScalar(size); scene.add(m);
    this.list.push({ flash: true, m, life, t: 0, size, v: new THREE.Vector3(), g: 0 });
  },
  update(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i]; p.t += dt; const k = p.t / p.life;
      if (k >= 1) { scene.remove(p.m); p.m.material.dispose(); this.list.splice(i, 1); continue; }
      if (p.ring) { p.m.scale.setScalar(p.radius * k + 0.1); p.m.material.opacity = 1 - k; continue; }
      if (p.flash) { p.m.scale.setScalar(p.size * (0.5 + k)); p.m.material.opacity = 0.8 * (1 - k); continue; }
      p.v.y -= p.g * dt; p.m.position.addScaledVector(p.v, dt); p.m.material.opacity = 1 - k;
    }
  },
};

const bolts = [];
function lightningBolt(a, b) {
  const pts = [], n = 10, d = b.clone().sub(a);
  for (let i = 0; i <= n; i++) {
    const p = a.clone().addScaledVector(d, i / n);
    if (i > 0 && i < n) p.add(new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)).multiplyScalar(0.9));
    pts.push(p);
  }
  const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xbfe8ff, linewidth: 2 }));
  scene.add(l); bolts.push({ l, t: 0 });
  const l2 = new THREE.Line(l.geometry, new THREE.LineBasicMaterial({ color: 0x6aa0ff, transparent: true, opacity: 0.6 }));
  l2.position.y += 0.05; scene.add(l2); bolts.push({ l: l2, t: 0 });
}
function updateBolts(dt) {
  for (let i = bolts.length - 1; i >= 0; i--) { bolts[i].t += dt; if (bolts[i].t > 0.18) { scene.remove(bolts[i].l); bolts.splice(i, 1); } }
}

// ---- pociski ----
const projectiles = [];
const enemyShots = [];

// Strzała: środek na środku drzewca, grot wskazuje +Z (zgodnie z lookAt w locie)
function arrowMesh(len, col, headCol, thick, hs) {
  hs = hs || 1;
  const g = new THREE.Group();
  const steel = new THREE.MeshLambertMaterial({ color: headCol, emissive: 0x2a2a2e });
  const part = (geo, m, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); g.add(o); return o; };

  const shaft = part(new THREE.CylinderGeometry(thick, thick, len, 6), mat(col), 0, 0, 0); shaft.rotation.x = Math.PI / 2;

  const hl = Math.max(thick * 7, len * 0.1) * hs, hw = thick * 2.8 * hs, z0 = len / 2;
  // tuleja
  const sock = part(new THREE.CylinderGeometry(thick * 1.5, thick * 1.2, hl * 0.22, 8), steel, 0, 0, z0 + hl * 0.11); sock.rotation.x = Math.PI / 2;
  // płaskie ostrze w kształcie rombu
  const blade = part(new THREE.ConeGeometry(hw, hl, 4), steel, 0, 0, z0 + hl * 0.22 + hl / 2);
  blade.rotation.x = Math.PI / 2; blade.scale.set(1.5, 1, 0.38);
  // zadziory
  [-1, 1].forEach(s => {
    const barb = part(new THREE.ConeGeometry(hw * 0.4, hl * 0.55, 4), steel, s * hw * 1.25, 0, z0 + hl * 0.34);
    barb.rotation.x = -Math.PI / 2; barb.rotation.z = -s * 0.35; barb.scale.set(1, 1, 0.45);
  });

  // lotki: trzy sztuki co 120°
  const fl = [0xb02a2a, 0xeeeeee, 0xeeeeee];
  for (let i = 0; i < 3; i++) {
    const piv = new THREE.Group(); piv.rotation.z = i * Math.PI * 2 / 3; g.add(piv);
    const v = new THREE.Mesh(new THREE.BoxGeometry(thick * 0.3, thick * 3.2, len * 0.17), mat(fl[i]));
    v.position.set(0, thick * 2.8, -len / 2 + len * 0.12); piv.add(v);
  }
  // zakończenie (nok)
  const nock = part(new THREE.CylinderGeometry(thick * 1.3, thick * 1.1, thick * 2.5, 6), mat(0x222222), 0, 0, -len / 2 - thick * 0.8); nock.rotation.x = Math.PI / 2;
  return g;
}
function orbMesh(col, r, light) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), new THREE.MeshBasicMaterial({ color: col }));
  const halo = new THREE.Mesh(new THREE.SphereGeometry(r * 1.8, 10, 8), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.3, depthWrite: false }));
  m.add(halo);
  return m;
}

function spawnProjectile(o) {
  const p = Object.assign({ pos: new THREE.Vector3(), vel: new THREE.Vector3(), grav: 0, life: 6, dmg: 10, radius: 0, hitR: 0.3, pierce: false, trail: null, hit: new Set(), onGround: null, t: 0 }, o);
  p.mesh.position.copy(p.pos); scene.add(p.mesh); projectiles.push(p);
  return p;
}
function removeProj(i) { scene.remove(projectiles[i].mesh); projectiles.splice(i, 1); }

function explode(p, pos) {
  const R = p.radius;
  fx.burst(pos.clone(), p.color || 0xffaa30, 26, R * 2.4, 0.8, 0.28);
  fx.burst(pos.clone(), 0x444444, 10, R * 1.2, 1.2, 0.5, 1);
  fx.flash(pos.clone(), p.color || 0xffaa30, R * 0.7, 0.35);
  fx.ring(pos.clone().setY(Math.max(pos.y, 0.1)), p.color || 0xffaa30, R, 0.5);
  shake(Math.min(0.5, 0.05 * R + 0.05) * (1 - Math.min(1, pos.distanceTo(camera.position) / 90)));
  for (const e of enemies) {
    if (e.dead) continue;
    const d = e.center.distanceTo(pos) - e.r;
    if (d < R) {
      const f = 1 - Math.max(0, d) / R * 0.6;
      e.damage(p.dmg * f * G.dmgMul);
      if (p.burn) e.burn(p.burn[0], p.burn[1]);
      if (p.slow) e.slow(p.slow);
    }
  }
}

function updateProjectiles(dt) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.t += dt;
    const prev = p.pos.clone();
    p.vel.y -= p.grav * dt;
    p.pos.addScaledVector(p.vel, dt);
    p.mesh.position.copy(p.pos);
    if (p.orient) { _v.copy(p.pos).add(p.vel); p.mesh.lookAt(_v); }
    if (p.trail && Math.random() < 0.9) fx.burst(p.pos.clone(), p.trail, 1, 0.8, 0.4, 0.14, 0);
    if (p.spin) p.mesh.rotation.x += dt * 6;

    let done = false;
    // trafienie we wrogów (test odcinka)
    for (const e of enemies) {
      if (e.dead || p.hit.has(e)) continue;
      const c = e.center, seg = p.pos.clone().sub(prev), len = seg.length() || 1e-6;
      const tt = Math.max(0, Math.min(1, c.clone().sub(prev).dot(seg) / (len * len)));
      const closest = prev.clone().addScaledVector(seg, tt);
      if (closest.distanceTo(c) < e.r + p.hitR) {
        if (p.noEnemyHit) continue;
        if (p.radius > 0) { explode(p, closest); done = true; break; }
        e.damage(p.dmg * G.dmgMul); p.hit.add(e);
        if (p.slow) e.slow(p.slow);
        if (p.burn) e.burn(p.burn[0], p.burn[1]);
        fx.burst(closest, 0xcc2222, 6, 4, 0.5, 0.12);
        if (!p.helper) showHitmarker(e.dead);
        if (!p.pierce) { done = true; break; }
      }
    }
    if (!done && p.pos.y <= 0.05) {
      if (p.radius > 0) explode(p, p.pos.clone().setY(0.1));
      else fx.burst(p.pos.clone().setY(0.1), 0x6a5030, 5, 3, 0.5, 0.12);
      done = true;
    }
    if (!done && p.t > p.life) done = true;
    if (done) removeProj(i);
  }
}

// ---- pociski wrogów ----
function enemyProjectile(from, to, speed, color, target, dmg, size, splash, opts) {
  opts = typeof opts === 'function' ? { onHit: opts } : (opts || {});
  const d = to.clone().sub(from), T = d.length() / speed;
  const vel = d.divideScalar(T);
  const mesh = orbMesh(color, size, true);
  mesh.position.copy(from); scene.add(mesh);
  enemyShots.push({ mesh, pos: from.clone(), vel, target, dmg, t: 0, life: T + 0.2, color, splash, onHit: opts.onHit, small: opts.small });
}
function updateEnemyShots(dt) {
  for (let i = enemyShots.length - 1; i >= 0; i--) {
    const s = enemyShots[i]; s.t += dt;
    s.pos.addScaledVector(s.vel, dt); s.mesh.position.copy(s.pos);
    fx.burst(s.pos.clone(), s.color, 1, 0.6, 0.35, 0.18, 0);
    let hit = false, direct = false;
    if (s.pos.distanceTo(G.player.pos) < 1.3) { hurtPlayer(s.dmg); hit = true; direct = true; }
    else if (Math.abs(s.pos.x) < PLAT + 2 && Math.abs(s.pos.z) < PLAT + 2 && s.pos.y < TOWER_Y + 0.6 && s.pos.y > 0) { damageTower(s.dmg, s.pos); hit = true; }
    else if (s.t > s.life) hit = true;
    if (hit) {
      if (s.onHit) s.onHit(direct, s.pos);
      if (s.small) fx.burst(s.pos.clone(), s.color, 3, 4, 0.5, 0.2); else { fx.burst(s.pos.clone(), s.color, 14, 6, 0.6, 0.25); fx.flash(s.pos.clone(), s.color, 1.2, 0.3); }
      if (s.splash && s.pos.distanceTo(G.player.pos) < s.splash && s.target !== 'player') hurtPlayer(s.dmg * 0.5);
      scene.remove(s.mesh); enemyShots.splice(i, 1);
    }
  }
}

// ---- celowanie ----
const raycaster = new THREE.Raycaster();
const aim = { point: new THREE.Vector3(), dir: new THREE.Vector3(), enemy: null };
function computeAim() {
  camera.getWorldDirection(aim.dir);
  const o = camera.position;
  let best = Infinity; aim.enemy = null;
  for (const e of enemies) {
    if (e.dead) continue;
    const c = e.center.clone().sub(o), t = c.dot(aim.dir);
    if (t < 0) continue;
    const perp = c.sub(aim.dir.clone().multiplyScalar(t)).length();
    if (perp < e.r * 1.1 && t < best) { best = t; aim.enemy = e; }
  }
  if (aim.enemy) aim.point.copy(o).addScaledVector(aim.dir, best);
  else if (aim.dir.y < -0.01) { const t = -o.y / aim.dir.y; aim.point.copy(o).addScaledVector(aim.dir, Math.min(t, 300)); }
  else aim.point.copy(o).addScaledVector(aim.dir, 250);
}
function muzzle() {
  return camera.position.clone().addScaledVector(aim.dir, 1.2).add(new THREE.Vector3(Math.cos(G.player.yaw) * 0.35, -0.35, -Math.sin(G.player.yaw) * 0.35));
}
function ballisticVel(from, to, speed, grav) {
  const d = to.clone().sub(from), flat = Math.hypot(d.x, d.z) || 0.001, T = d.length() / speed;
  return new THREE.Vector3(d.x / T, d.y / T + 0.5 * grav * T, d.z / T);
}

// ---- uzbrojenie ----
const MORTAR_POS = new THREE.Vector3(-3.4, TOWER_Y + 1.4, -3.2);
const MORTAR_MIN = 10;

const WEAPONS = [
  { key: 1, name: 'Łuk', icon: '🏹', cd: 0.6, mana: 0,
    fire() {
      const o = muzzle(), tgt = leadTarget(70, 9);
      spawnProjectile({ mesh: arrowMesh(1.1, 0x8a6030, 0x999999, 0.03), pos: o, vel: ballisticVel(o, tgt, 70, 9), grav: 9, dmg: 28, hitR: 0.25, orient: true, trail: null });
      sfx('bow');
    } },
  { key: 2, name: 'Kusza', icon: '🎯', cd: 1.15, mana: 0,
    fire() {
      const o = muzzle(), tgt = leadTarget(115, 2);
      spawnProjectile({ mesh: arrowMesh(0.7, 0x5a3b1e, 0xcccccc, 0.045), pos: o, vel: ballisticVel(o, tgt, 115, 2), grav: 2, dmg: 60, hitR: 0.3, orient: true });
      sfx('bow');
    } },
  { key: 3, name: 'Moździerz', icon: '💣', cd: 2.8, mana: 0,
    fire() {
      let tgt = aim.point.clone(); tgt.y = 0;
      const flat = Math.hypot(tgt.x, tgt.z);
      if (flat < MORTAR_MIN) {
        if (flat < 0.01) tgt.set(MORTAR_MIN, 0, 0); else { tgt.x *= MORTAR_MIN / flat; tgt.z *= MORTAR_MIN / flat; }
        showMsg(t('mortarClose')); say('mortarClose', {}, { prio: 1, cool: 10000 });
      }
      const from = MORTAR_POS.clone(), d = tgt.clone().sub(from);
      const T = Math.max(1.6, Math.min(3.8, Math.hypot(d.x, d.z) / 26));
      const vel = new THREE.Vector3(d.x / T, d.y / T + 0.5 * GRAV * T * 1.0, d.z / T);
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 8), M.iron);
      spawnProjectile({ mesh, pos: from, vel, grav: GRAV, dmg: 110, radius: 7.5, hitR: 0.2, color: 0xff8a20, trail: 0x777777, noEnemyHit: true, life: 8 });
      fx.burst(from.clone(), 0x888888, 14, 5, 0.9, 0.4, 0); fx.flash(from.clone(), 0xffcc66, 1.6, 0.25);
      shake(0.25); sfx('boom');
    } },
  { key: 4, name: 'Kula ognia', icon: '🔥', cd: 0.75, mana: 14,
    fire() {
      const o = muzzle(), tgt = leadTarget(48, 0);
      spawnProjectile({ mesh: orbMesh(0xff7a1a, 0.4, true), pos: o, vel: ballisticVel(o, tgt, 48, 0), dmg: 48, radius: 4.2, hitR: 0.4, color: 0xff6a10, burn: [4, 10], trail: 0xffa030 });
      sfx('magic');
    } },
  { key: 5, name: 'Błyskawica', icon: '⚡', cd: 0.9, mana: 18,
    fire() {
      const o = muzzle(); let cur = aim.enemy; const hit = new Set();
      if (!cur) { let b = 14, bd = Infinity; for (const e of enemies) { if (e.dead) continue; const c = e.center.clone().sub(camera.position); const t = c.dot(aim.dir); if (t < 0) continue; const perp = c.sub(aim.dir.clone().multiplyScalar(t)).length(); if (perp < b * 0.5 + e.r && perp < bd) { bd = perp; cur = e; } } }
      let from = o;
      if (!cur) { lightningBolt(o, aim.point.clone()); fx.burst(aim.point.clone(), 0xbfe8ff, 6, 4, 0.4, 0.15); sfx('zap'); return; }
      for (let i = 0; i < 5 && cur; i++) {
        const c = cur.center.clone(); lightningBolt(from, c);
        cur.damage((60 - i * 8) * G.dmgMul); hit.add(cur); fx.burst(c.clone(), 0xbfe8ff, 8, 5, 0.5, 0.15); showHitmarker(cur.dead);
        from = c; let nx = null, nd = 14;
        for (const e of enemies) { if (e.dead || hit.has(e)) continue; const d = e.center.distanceTo(c); if (d < nd) { nd = d; nx = e; } }
        cur = nx;
      }
      shake(0.12); sfx('zap');
    } },
  { key: 6, name: 'Lód', icon: '❄️', cd: 0.5, mana: 10,
    fire() {
      const o = muzzle(), tgt = leadTarget(62, 0);
      spawnProjectile({ mesh: orbMesh(0x8fe0ff, 0.3, true), pos: o, vel: ballisticVel(o, tgt, 62, 0), dmg: 24, radius: 3.2, hitR: 0.35, color: 0x9fe8ff, slow: 4.5, trail: 0xd0f4ff });
      sfx('magic');
    } },
  { key: 7, name: 'Balista', icon: '🗡️', cd: 2.0, mana: 0,
    fire() {
      const o = muzzle(), tgt = leadTarget(135, 1);
      spawnProjectile({ mesh: arrowMesh(2.2, 0x6a4020, 0xbbbbbb, 0.07), pos: o, vel: ballisticVel(o, tgt, 135, 1), grav: 1, dmg: 95, hitR: 0.45, pierce: true, orient: true, life: 4 });
      shake(0.15); sfx('bow');
    } },
  { key: 8, name: 'Meteory', icon: '☄️', cd: 9, mana: 55,
    fire() {
      const c = aim.point.clone(); c.y = 0;
      if (Math.hypot(c.x, c.z) < 12) { const l = Math.hypot(c.x, c.z) || 1; c.x *= 12 / l; c.z *= 12 / l; }
      fx.ring(c, 0xff5a10, 11, 2.6);
      for (let i = 0; i < 8; i++) {
        G.timers.push({ t: i * 0.3 + 0.4, fn: () => {
          const tg = c.clone().add(new THREE.Vector3(rnd(-9, 9), 0, rnd(-9, 9)));
          const from = tg.clone().add(new THREE.Vector3(rnd(-20, 20), 90, rnd(-20, 20)));
          const m = orbMesh(0xff5a10, 1.1, true);
          const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9), mat(0x333333)); m.add(rock);
          spawnProjectile({ mesh: m, pos: from, vel: tg.clone().sub(from).normalize().multiplyScalar(75), dmg: 90, radius: 5.5, hitR: 0.5, color: 0xff5a10, trail: 0xff8a30, noEnemyHit: true, life: 5 });
        } });
      }
      say('meteor', {}, { prio: 1, cool: 6000 });
      sfx('magic');
    } },
  { key: 9, name: 'Uzdrowienie', icon: '✨', cd: 10, mana: 40,
    fire() {
      G.towerHp = Math.min(G.maxTowerHp, G.towerHp + G.maxTowerHp * 0.3);
      G.player.hp = Math.min(100, G.player.hp + 50);
      for (let i = 0; i < 3; i++) fx.ring(new THREE.Vector3(0, TOWER_Y + 0.5 + i * 0.3, 0), 0xfff2a0, 8 + i * 3, 0.9 + i * 0.2);
      fx.burst(new THREE.Vector3(G.player.pos.x, TOWER_Y + 1, G.player.pos.z), 0xfff2a0, 30, 4, 1.2, 0.2, -2);
      showMsg(t('healed')); clearStatus(); say('heal', {}, { prio: 1, cool: 4000 }); sfx('heal');
    } },
];

function leadTarget(speed, grav) {
  if (!aim.enemy) return aim.point.clone();
  return leadAt(aim.enemy, camera.position, speed);
}
function leadAt(e, from, speed) {
  const c = e.center.clone(), dist = c.distanceTo(from), T = dist / speed;
  if (e.isDragon) {
    const tx = -Math.sin(e.ang) * e.dir, tz = Math.cos(e.ang) * e.dir;
    const v = 0.22 * e.orbitR;
    c.x += tx * v * T; c.z += tz * v * T;
  } else if (e.state === 'walk') {
    const l = Math.hypot(e.mesh.position.x, e.mesh.position.z) || 1;
    const sp = e.speed * e.speedMul * (e.slowT > 0 ? 0.4 : 1) * (e.ranged || true ? 1 : 0);
    c.x -= e.mesh.position.x / l * sp * T * 0.9; c.z -= e.mesh.position.z / l * sp * T * 0.9;
  }
  return c;
}
