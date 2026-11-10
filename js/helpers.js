// Pomocnicy na wieży: Shift + numer broni = kupno pomocnika strzelającego tą bronią.
// Staje przy ścianie, do której w chwili zakupu jest najbliżej gracz.
const helpers = [];
const HELPER_R = 5.2, HELPER_SLOTS = [1.3, -1.3, 2.5, -2.5], HELPER_MAX = 16;
const WALLS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const HD = [
  { cost: 120, cd: 0.9, range: 100, col: 0x4a6a2a, col2: 0x2e4418, sfx: 'bow' },
  { cost: 200, cd: 1.7, range: 120, col: 0x6a4a28, col2: 0x3c2a16, sfx: 'bow' },
  { cost: 260, cd: 3.6, range: 90, ground: true, col: 0x3a3a44, col2: 0x22222a, sfx: 'boom' },
  { cost: 240, cd: 1.2, range: 100, staff: 0xff6a10, col: 0xa02a14, col2: 0x601408, hat: true, sfx: 'magic' },
  { cost: 280, cd: 1.5, range: 70, staff: 0x9fd0ff, col: 0x2a4aa8, col2: 0x182c64, hat: true, sfx: 'zap' },
  { cost: 220, cd: 0.9, range: 95, staff: 0x8fe0ff, col: 0x3a8ab0, col2: 0x1e506e, hat: true, sfx: 'magic' },
  { cost: 300, cd: 3.0, range: 125, col: 0x5a5a62, col2: 0x34343c, sfx: 'bow' },
  { cost: 450, cd: 12, range: 100, ground: true, staff: 0xff3a10, col: 0xb85a14, col2: 0x6a3008, hat: true, sfx: 'magic' },
  { cost: 300, cd: 14, range: 0, self: true, staff: 0xfff2a0, col: 0xe8e0c0, col2: 0xb8a060, hat: true, sfx: 'heal' },
];

const HELPER_HP = 100;
const _hbG = new THREE.PlaneGeometry(1, 0.13), _hbBg = new THREE.MeshBasicMaterial({ color: 0x000000, depthTest: false, transparent: true, opacity: 0.7 }), _hbFg = new THREE.MeshBasicMaterial({ color: 0x5ad23a, depthTest: false });

function helperBar() {
  const g = new THREE.Group(), bg = new THREE.Mesh(_hbG, _hbBg), fg = new THREE.Mesh(_hbG, _hbFg);
  bg.scale.set(1.06, 1.35, 1); bg.renderOrder = 10; fg.renderOrder = 11; fg.position.z = 0.01;
  g.add(bg); g.add(fg); g.visible = false; g.userData.fg = fg; scene.add(g);
  return g;
}
function helperAt(p) {
  for (const h of helpers) if (Math.abs(p.x - h.pos.x) < 0.8 && Math.abs(p.z - h.pos.z) < 0.8 && p.y > h.pos.y - 0.2 && p.y < h.pos.y + 2.4) return h;
  return null;
}
function hurtHelper(h, n) {
  if (h.hp <= 0) return;
  h.hp -= n; h.hurt = 0.25;
  fx.burst(h.pos.clone().add(new THREE.Vector3(0, 1.3, 0)), 0xcc2222, 5, 3, 0.5, 0.12);
  if (h.hp <= 0) killHelper(h);
}
function hurtHelpersIn(c, r, n) { for (const h of helpers.slice()) if (Math.hypot(h.pos.x - c.x, h.pos.z - c.z) < r) hurtHelper(h, n); }
function healHelpers(n) { for (const h of helpers) h.hp = Math.min(HELPER_HP, h.hp + n); }
function killHelper(h) {
  const i = helpers.indexOf(h); if (i < 0) return;
  helpers.splice(i, 1); scene.remove(h.mesh); scene.remove(h.bar);
  fx.burst(h.pos.clone().add(new THREE.Vector3(0, 1.2, 0)), 0xcc2222, 18, 5, 0.8, 0.18);
  fx.burst(h.pos.clone().add(new THREE.Vector3(0, 1.2, 0)), 0x888888, 8, 2, 1, 0.4, -1);
  showMsg(t('helperDied', weaponName(h.kind))); say('helperDead', {}, { prio: 1, cool: 6000 });
}

function helperCount(k) { let n = 0; for (const h of helpers) if (h.kind === k) n++; return n; }
function helperCost(k) { return HD[k].cost + 40 * helpers.length; }

function buildHelper(k) {
  const d = HD[k];
  const r = makeHumanoid({ skin: 0xe0b890, cloth: d.col, cloth2: d.col2, scale: 0.92, headR: 0.22, legLen: 0.8, eye: 0x222222 });
  const g = r.userData.g, P = r.userData.P, hy = P.head.position.y;
  if (d.hat) mesh(new THREE.ConeGeometry(0.3, 0.75, 8), mat(d.col2), 0, hy + 0.5, 0, g).rotation.x = -0.1;
  else mesh(new THREE.SphereGeometry(0.26, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), M.iron, 0, hy + 0.04, 0, g);
  BOX(0.74, 0.1, 0.42, mat(0x3a2a18), 0, 1.0, 0, g);
  const wood = mat(0x6a4a2a);
  if (k === 0) {
    const w = new THREE.Group(); w.position.set(0, 1.4, 0.55); w.rotation.y = -Math.PI / 2; g.add(w);
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.035, 5, 14, Math.PI), wood); arc.rotation.z = -Math.PI / 2; arc.castShadow = true; w.add(arc);
    BOX(0.01, 1.1, 0.01, M.white, 0, 0, 0, w);
  } else if (k === 1 || k === 6) {
    const s = k === 6 ? 1.5 : 1, w = new THREE.Group(); w.position.set(0, 1.3, 0.5); w.scale.setScalar(s); g.add(w);
    BOX(0.1, 0.1, 0.8, wood, 0, 0, 0, w); BOX(0.8, 0.04, 0.05, M.iron, 0, 0.02, 0.32, w);
    const a = arrowMesh(0.6, 0x6a4020, 0xcccccc, 0.014, 1.2); a.position.set(0, 0.08, 0.1); w.add(a);
  } else if (k === 2) {
    mesh(new THREE.SphereGeometry(0.22, 10, 8), M.iron, 0, 1.25, 0.5, g);
    mesh(new THREE.SphereGeometry(0.04, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffaa22 }), 0, 1.5, 0.5, g, false);
  } else {
    CYL(0.035, 0.04, 2.1, M.woodD, 0.58, 1.1, 0.3, g, 6);
    P.orb = mesh(new THREE.SphereGeometry(0.13, 10, 8), new THREE.MeshBasicMaterial({ color: d.staff }), 0.58, 2.2, 0.3, g, false);
  }
  return r;
}

function freeSpot() {
  const p = G.player.pos;
  const order = WALLS.map((w, i) => [-(p.x * w[0] + p.z * w[1]), i]).sort((a, b) => a[0] - b[0]);
  for (const [, wi] of order) {
    const [dx, dz] = WALLS[wi];
    for (const off of HELPER_SLOTS) {
      const x = dx * HELPER_R - dz * off, z = dz * HELPER_R + dx * off;
      if (!helpers.some(h => Math.abs(h.pos.x - x) < 0.3 && Math.abs(h.pos.z - z) < 0.3)) return { x, z, yaw: Math.atan2(dx, dz) };
    }
  }
  return null;
}

function addHelper(k, spot) {
  const m = buildHelper(k);
  const pos = new THREE.Vector3(spot.x, TOWER_Y + 0.4, spot.z);
  m.position.copy(pos); m.rotation.y = spot.yaw; scene.add(m);
  helpers.push({ kind: k, mesh: m, P: m.userData.P, pos, hp: HELPER_HP, hurt: 0, bar: helperBar(), cd: 1 + Math.random() * 1.5, yaw: spot.yaw, idleYaw: spot.yaw, aimYaw: spot.yaw, idleT: 0, kick: 0, t: Math.random() * 10 });
  fx.burst(pos.clone().add(new THREE.Vector3(0, 1.2, 0)), 0xffe08a, 16, 3, 0.7, 0.15, -1);
  fx.ring(pos.clone().setY(TOWER_Y + 0.4), 0xffe08a, 1.6, 0.6);
}
function clearHelpers() { helpers.forEach(h => { scene.remove(h.mesh); scene.remove(h.bar); }); helpers.length = 0; }

function buyHelper(k) {
  if (!G.running || G.paused || G.over) return;
  if (helpers.length >= HELPER_MAX) { showMsg(t('helperFull')); return; }
  const c = helperCost(k);
  if (G.gold < c) { showMsg(t('noGold')); say('noGold', {}, { prio: 1, cool: 6000 }); return; }
  const spot = freeSpot();
  if (!spot) { showMsg(t('helperFull')); return; }
  G.gold -= c; addHelper(k, spot);
  showMsg(t('helperBought', weaponName(k))); say('helperHire', {}, { prio: 1, cool: 3000 }); sfx('heal');
}

function helperTarget(h) {
  const d = HD[h.kind], c = [];
  for (const e of enemies) {
    if (e.dead || (d.ground && e.flying)) continue;
    const dist = e.mesh.position.distanceTo(h.pos);
    if (dist < d.range) c.push([dist, e]);
  }
  if (!c.length) return null;
  c.sort((a, b) => a[0] - b[0]);
  return c[Math.random() * Math.min(3, c.length) | 0][1];
}
function helperMuzzle(h, e) {
  const d = e.center.clone().sub(h.pos); d.y = 0; d.normalize();
  return h.pos.clone().add(new THREE.Vector3(0, 1.5, 0)).addScaledVector(d, 0.9);
}

const HFIRE = [
  (h, e, o) => { const t = leadAt(e, o, 70); spawnProjectile({ mesh: arrowMesh(1.1, 0x8a6030, 0x999999, 0.03), pos: o, vel: ballisticVel(o, t, 70, 9), grav: 9, dmg: 28, hitR: 0.25, orient: true, helper: true }); },
  (h, e, o) => { const t = leadAt(e, o, 115); spawnProjectile({ mesh: arrowMesh(0.7, 0x5a3b1e, 0xcccccc, 0.045), pos: o, vel: ballisticVel(o, t, 115, 2), grav: 2, dmg: 60, hitR: 0.3, orient: true, helper: true }); },
  (h, e, o) => {
    const tgt = leadAt(e, o, 30); tgt.y = 0;
    const d = tgt.clone().sub(o), T = Math.max(1.6, Math.min(3.8, Math.hypot(d.x, d.z) / 26));
    const vel = new THREE.Vector3(d.x / T, d.y / T + 0.5 * GRAV * T, d.z / T);
    spawnProjectile({ mesh: new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 8), M.iron), pos: o, vel, grav: GRAV, dmg: 110, radius: 7.5, hitR: 0.2, color: 0xff8a20, trail: 0x777777, noEnemyHit: true, life: 8, helper: true });
    fx.burst(o.clone(), 0x888888, 10, 4, 0.8, 0.35, 0); fx.flash(o.clone(), 0xffcc66, 1.4, 0.25);
  },
  (h, e, o) => { const t = leadAt(e, o, 48); spawnProjectile({ mesh: orbMesh(0xff7a1a, 0.4, true), pos: o, vel: ballisticVel(o, t, 48, 0), dmg: 48, radius: 4.2, hitR: 0.4, color: 0xff6a10, burn: [4, 10], trail: 0xffa030, helper: true }); },
  (h, e, o) => {
    let cur = e, from = o; const hit = new Set();
    for (let i = 0; i < 4 && cur; i++) {
      const c = cur.center.clone(); lightningBolt(from, c);
      cur.damage((55 - i * 8) * G.dmgMul); hit.add(cur); fx.burst(c.clone(), 0xbfe8ff, 8, 5, 0.5, 0.15);
      from = c; let nx = null, nd = 14;
      for (const n of enemies) { if (n.dead || hit.has(n)) continue; const dd = n.center.distanceTo(c); if (dd < nd) { nd = dd; nx = n; } }
      cur = nx;
    }
  },
  (h, e, o) => { const t = leadAt(e, o, 62); spawnProjectile({ mesh: orbMesh(0x8fe0ff, 0.3, true), pos: o, vel: ballisticVel(o, t, 62, 0), dmg: 24, radius: 3.2, hitR: 0.35, color: 0x9fe8ff, slow: 4.5, trail: 0xd0f4ff, helper: true }); },
  (h, e, o) => { const t = leadAt(e, o, 135); spawnProjectile({ mesh: arrowMesh(2.2, 0x6a4020, 0xbbbbbb, 0.07), pos: o, vel: ballisticVel(o, t, 135, 1), grav: 1, dmg: 95, hitR: 0.45, pierce: true, orient: true, life: 4, helper: true }); },
  (h, e) => {
    let best = null, bn = 0;
    for (const a of enemies) {
      if (a.dead || a.flying) continue;
      let n = 0; for (const b of enemies) if (!b.dead && !b.flying && b.mesh.position.distanceTo(a.mesh.position) < 9) n++;
      if (n > bn) { bn = n; best = a; }
    }
    if (!best || bn < 2) return false;
    const c = best.mesh.position.clone(); c.y = 0;
    fx.ring(c, 0xff5a10, 11, 2.2);
    for (let i = 0; i < 6; i++) G.timers.push({ t: i * 0.3 + 0.4, fn: () => {
      const tg = c.clone().add(new THREE.Vector3(rnd(-8, 8), 0, rnd(-8, 8)));
      const from = tg.clone().add(new THREE.Vector3(rnd(-20, 20), 90, rnd(-20, 20)));
      const m = orbMesh(0xff5a10, 1.1, true); m.add(new THREE.Mesh(new THREE.DodecahedronGeometry(0.9), mat(0x333333)));
      spawnProjectile({ mesh: m, pos: from, vel: tg.clone().sub(from).normalize().multiplyScalar(75), dmg: 90, radius: 5.5, hitR: 0.5, color: 0xff5a10, trail: 0xff8a30, noEnemyHit: true, life: 5, helper: true });
    } });
  },
  (h) => {
    if (G.towerHp > G.maxTowerHp * 0.85 && G.player.hp > 70) return false;
    G.towerHp = Math.min(G.maxTowerHp, G.towerHp + G.maxTowerHp * 0.12);
    G.player.hp = Math.min(100, G.player.hp + 20); healHelpers(20);
    for (let i = 0; i < 2; i++) fx.ring(new THREE.Vector3(0, TOWER_Y + 0.5 + i * 0.3, 0), 0xfff2a0, 7 + i * 3, 0.9);
    fx.burst(h.pos.clone().add(new THREE.Vector3(0, 1.5, 0)), 0xfff2a0, 18, 3, 1, 0.18, -2);
  },
];

function updateHelpers(dt) {
  for (const h of helpers.slice()) {
    const d = HD[h.kind]; h.t += dt; h.cd -= dt; h.idleT -= dt;
    if (h.cd <= 0) {
      const e = d.self ? null : helperTarget(h);
      if (e || d.self) {
        let r;
        if (e) { const dx = e.mesh.position.x - h.pos.x, dz = e.mesh.position.z - h.pos.z; h.aimYaw = Math.atan2(dx, dz); h.idleT = 1.6; r = HFIRE[h.kind](h, e, helperMuzzle(h, e)); }
        else r = HFIRE[h.kind](h);
        if (r === false) h.cd = 1.5;
        else { h.cd = d.cd * (0.9 + Math.random() * 0.25); h.kick = 1; if (Math.random() < 0.4) sfx(d.sfx); }
      } else h.cd = 0.4;
    }
    if (h.idleT <= 0) h.aimYaw = h.idleYaw;
    let df = h.aimYaw - h.yaw; while (df > Math.PI) df -= Math.PI * 2; while (df < -Math.PI) df += Math.PI * 2;
    h.yaw += Math.max(-dt * 7, Math.min(dt * 7, df)); h.mesh.rotation.y = h.yaw;
    h.kick = Math.max(0, h.kick - dt * 3);
    const P = h.P;
    if (d.staff) { P.armR.rotation.x = -0.9 - h.kick * 0.9; P.armL.rotation.x = -0.2; if (P.orb) P.orb.scale.setScalar(1 + Math.sin(h.t * 6) * 0.2 + h.kick * 0.6); }
    else { P.armL.rotation.x = P.armR.rotation.x = -1.25 - h.kick * 0.12; }
    P.head.rotation.y = Math.sin(h.t * 0.8) * 0.2;
    h.hurt = Math.max(0, h.hurt - dt);
    h.bar.visible = h.hp < HELPER_HP; h.bar.position.set(h.pos.x, h.pos.y + 2.5, h.pos.z); h.bar.quaternion.copy(camera.quaternion);
    const k = Math.max(0, h.hp / HELPER_HP), fg = h.bar.userData.fg; fg.scale.set(k, 1, 1); fg.position.x = -(1 - k) * 0.5;
    h.mesh.position.x = h.pos.x + (h.hurt > 0 ? Math.sin(h.t * 90) * 0.04 : 0);
  }
}
