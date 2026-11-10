// Smoki: 3 rodzaje (ognisty, lodowy, jadowity), skrzydła z kośćmi i błoną, ziejący w stronę celu

function boneBetween(a, b, rad, m, parent, seg) {
  const d = b.clone().sub(a), len = d.length();
  const o = new THREE.Mesh(new THREE.CylinderGeometry(rad * 0.7, rad, len, seg || 5), m);
  o.position.copy(a).addScaledVector(d, 0.5);
  o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  o.castShadow = true; parent.add(o); return o;
}

function membrane(tris, m, parent, ox, oy, oz) {
  const pos = [];
  tris.forEach(t => t.forEach(p => pos.push(p.x, p.y, p.z)));
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.computeVertexNormals();
  const o = new THREE.Mesh(geo, m); o.castShadow = true; o.position.set(ox || 0, oy || 0, oz || 0); parent.add(o); return o;
}

function dragonWing(s, o) {
  const V = (x, y, z) => new THREE.Vector3(x * s, y, z);
  const S = V(0, 0, 0), E = V(2.3, 1.0, -0.3), W = V(4.3, 0.4, -0.2), B = V(0.5, -0.7, -3.6);
  const tips = [V(7.2, -0.5, -1.2), V(6.6, -1.2, -3.2), V(4.6, -1.5, -4.8)];
  const wing = new THREE.Group(), inner = new THREE.Group(), outer = new THREE.Group();
  wing.add(inner); outer.position.copy(W); wing.add(outer);
  boneBetween(S, E, 0.22, o.bone, inner); boneBetween(E, W, 0.17, o.bone, inner);
  const claw = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.6, 5), o.claw); claw.position.copy(W).add(V(0.15, 0.45, 0)); inner.add(claw);
  const O = new THREE.Vector3();
  const rel = p => p.clone().sub(W);
  const bound = [];
  const all = tips.map(rel).concat([rel(B)]);
  all.forEach((p, i) => {
    bound.push(p);
    if (i < all.length - 1) bound.push(p.clone().add(all[i + 1]).multiplyScalar(0.5 * 0.72));
  });
  tips.forEach(t => boneBetween(O, rel(t), 0.1, o.bone, outer, 4));
  const tris = []; for (let i = 0; i < bound.length - 1; i++) tris.push([O, bound[i], bound[i + 1]]);
  membrane(tris, o.wing, outer);
  membrane([[S, E, W], [S, W, B]], o.wing, inner);
  wing.userData.outer = outer;
  return wing;
}

function buildDragon(o) {
  const r = new THREE.Group(), g = new THREE.Group(); r.add(g);
  const P = {}, body = mat(o.body), dark = mat(o.dark), belly = mat(o.belly);
  const wingM = new THREE.MeshLambertMaterial({ color: o.wingCol, side: THREE.DoubleSide, transparent: !!o.wingAlpha, opacity: o.wingAlpha || 1 });
  const glow = new THREE.MeshBasicMaterial({ color: o.glow });
  const bd = mesh(new THREE.SphereGeometry(1.4, 14, 10), body, 0, 0, 0, g); bd.scale.set(1, 0.9, 1.9);
  const bel = mesh(new THREE.SphereGeometry(1.25, 10, 8), belly, 0, -0.35, 0.1, g); bel.scale.set(0.8, 0.7, 1.7);
  const neck = new THREE.Group(); neck.position.set(0, 0.5, 2.1); g.add(neck);
  CYL(0.45, 0.65, 1.8, body, 0, 0.5, 0.5, neck, 8).rotation.x = 0.7;
  const head = new THREE.Group(); head.position.set(0, 1.4, 1.5); neck.add(head);
  mesh(new THREE.BoxGeometry(0.8, 0.7, 1.4), body, 0, 0, 0.3, head);
  mesh(new THREE.BoxGeometry(0.7, 0.25, 0.9), dark, 0, -0.3, 0.55, head);
  [-1, 1].forEach(s => {
    mesh(new THREE.ConeGeometry(0.12, 1.0, 6), o.horn, s * 0.3, 0.55, -0.2, head).rotation.x = -0.9;
    mesh(new THREE.SphereGeometry(0.1, 6, 6), glow, s * 0.42, 0.15, 0.4, head, false);
    mesh(new THREE.ConeGeometry(0.05, 0.25, 4), M.white, s * 0.25, -0.1, 1.0, head, false).rotation.x = Math.PI;
  });
  P.mouth = mesh(new THREE.SphereGeometry(0.35, 8, 6), glow, 0, -0.1, 1.1, head, false); P.mouth.scale.setScalar(0.01);
  P.head = head;
  const tail = new THREE.Group(); tail.position.set(0, 0, -2.4); g.add(tail);
  mesh(new THREE.ConeGeometry(0.7, 3.5, 8), body, 0, 0, -1.4, tail).rotation.x = -Math.PI / 2;
  mesh(new THREE.ConeGeometry(0.3, 0.7, 4), dark, 0, 0, -3.4, tail).rotation.x = -Math.PI / 2;
  P.tail = tail;
  const wo = { bone: dark, claw: M.white, wing: wingM };
  const wl = dragonWing(-1, wo), wr = dragonWing(1, wo);
  wl.position.set(-1.2, 0.8, 0.3); wr.position.set(1.2, 0.8, 0.3); g.add(wl); g.add(wr);
  P.wingL = wl; P.wingR = wr;
  [-1, 1].forEach(s => { const l = CYL(0.2, 0.3, 1.0, dark, s * 0.9, -1.1, 0.7, g, 6); l.rotation.x = 0.3; });
  for (let i = 0; i < 6; i++) mesh(new THREE.ConeGeometry(0.16, 0.5, 4), o.spike, 0, 1.2 - i * 0.03, 1.4 - i * 0.55, g).rotation.x = -0.2;
  if (o.deco) o.deco(g, P, head, tail, { body, dark, belly, glow });
  r.userData.P = P; r.userData.g = g; r.scale.setScalar(o.scale);
  return r;
}

const _ice = new THREE.MeshPhongMaterial({ color: 0xbff0ff, transparent: true, opacity: 0.85, shininess: 90 });
const _sac = new THREE.MeshBasicMaterial({ color: 0x9bff3a });

BUILDERS.dragon = e => buildDragon({ body: 0xa82a1a, dark: 0x701810, belly: 0xd8a050, wingCol: 0x8a2018, glow: 0xffdd00, horn: M.white, spike: mat(0x701810), scale: 1.3 });

BUILDERS.icedragon = e => buildDragon({ body: 0x7ab8e0, dark: 0x3a6a96, belly: 0xe8f6ff, wingCol: 0xcfeeff, wingAlpha: 0.78, glow: 0x66ffff, horn: _ice, spike: _ice, scale: 1.45,
  deco(g, P, head, tail) {
    for (let i = 0; i < 7; i++) { const c = mesh(new THREE.ConeGeometry(0.22, 0.9 + (i % 3) * 0.3, 5), _ice, (i % 2 ? 0.35 : -0.35), 1.15, 1.6 - i * 0.55, g, false); c.rotation.z = (i % 2 ? -0.35 : 0.35); }
    [-1, 1].forEach(s => mesh(new THREE.ConeGeometry(0.15, 0.8, 5), _ice, s * 0.6, 0.7, -0.1, head, false).rotation.z = -s * 0.8);
    mesh(new THREE.ConeGeometry(0.45, 1.3, 5), _ice, 0, 0, -3.7, tail, false).rotation.x = -Math.PI / 2;
  } });

BUILDERS.poisondragon = e => buildDragon({ body: 0x3f7a2a, dark: 0x25461a, belly: 0xb08a3a, wingCol: 0x4a2a6a, wingAlpha: 0.92, glow: 0xb6ff2a, horn: mat(0x2a1a3a), spike: mat(0x7a3aa0), scale: 1.2,
  deco(g, P, head, tail) {
    [[-1, 0.9], [1, 0.9], [-1, -0.4], [1, -0.4]].forEach(([s, z]) => mesh(new THREE.SphereGeometry(0.32, 8, 6), _sac, s * 1.15, 0.1, z, g, false));
    mesh(new THREE.SphereGeometry(0.45, 8, 6), _sac, 0, 0, -3.6, tail, false);
    for (let i = 0; i < 5; i++) mesh(new THREE.ConeGeometry(0.1, 0.5, 4), mat(0x7a3aa0), (i % 2 ? 0.18 : -0.18), 0.2, -0.8 - i * 0.55, tail, false).rotation.x = -1.2;
  } });

const _ang = a => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };
const _mv = new THREE.Vector3();
const BREATH = {
  fire: { col: 0xff6a10, col2: 0xffd040, status: ['burn', 3, 4] },
  ice: { col: 0x9fe8ff, col2: 0xffffff, status: ['slow', 4, 0] },
  poison: { col: 0x7be02a, col2: 0xc8ff5a, status: ['poison', 5, 3] },
};

function dragonUpdate(e, dt, sp) {
  const P = e.P, pos = e.mesh.position, B = e.breath;
  if (e.state === 'walk') {
    e.ang += e.dir * dt * 0.18;
    const R = Math.max(e.orbitR, Math.hypot(pos.x, pos.z) - 22 * dt);
    pos.x = Math.cos(e.ang) * R; pos.z = Math.sin(e.ang) * R;
    pos.y += (e.alt + Math.sin(e.t * 0.8) * 3 - pos.y) * Math.min(1, dt * 0.8);
    if (R <= e.orbitR + 0.5) e.state = 'orbit';
  } else {
    e.ang += e.dir * dt * (0.22 * e.speedMul) * (B ? 0.35 : 1);
    e.orbitR += Math.sin(e.t * 0.4) * dt * 3;
    pos.x = Math.cos(e.ang) * e.orbitR; pos.z = Math.sin(e.ang) * e.orbitR;
    pos.y = e.alt + Math.sin(e.t * 0.8) * 3;
  }
  const tx = -Math.sin(e.ang) * e.dir, tz = Math.cos(e.ang) * e.dir;
  let want = Math.atan2(tx, tz), roll = -0.25 * e.dir * (e.state === 'orbit' ? 1 : 0), pitch = 0.2 + Math.sin(e.t * 3) * 0.05;
  if (B) {
    want = Math.atan2(B.target.x - pos.x, B.target.z - pos.z); roll = 0;
    const hd = Math.hypot(B.target.x - pos.x, B.target.z - pos.z) || 1;
    pitch = Math.min(1.0, 0.2 + Math.atan2(pos.y - B.target.y, hd) * 0.8);
  }
  if (e.yaw === null) e.yaw = want;
  const df = _ang(want - e.yaw), step = 2.4 * dt; e.yaw += Math.max(-step, Math.min(step, df));
  e.mesh.rotation.y = e.yaw; e.mesh.rotation.z += (roll - e.mesh.rotation.z) * Math.min(1, dt * 3);
  P.head.rotation.x += (pitch - P.head.rotation.x) * Math.min(1, dt * 5);
  const fl = Math.sin(e.t * 4.5), fl2 = Math.sin(e.t * 4.5 - 0.9);
  P.wingL.rotation.z = fl * 0.55; P.wingR.rotation.z = -fl * 0.55;
  P.wingL.userData.outer.rotation.z = fl2 * 0.28; P.wingR.userData.outer.rotation.z = -fl2 * 0.28;
  P.tail.rotation.y = Math.sin(e.t * 2) * 0.35;
  const K = BREATH[e.breathKind || 'fire'];
  if (!B && e.state === 'orbit' && e.attackT <= 0) {
    const toPlayer = Math.random() < 0.5;
    e.breath = { t: 0, toPlayer, target: toPlayer ? G.player.pos.clone() : new THREE.Vector3(rnd(-3, 3), TOWER_Y + 0.5, rnd(-3, 3)), wind: 1.1, dur: 1.3, acc: 0 };
    say('dragonBreath', {}, { prio: 1, cool: 9000 });
  } else if (B) {
    B.t += dt; if (B.toPlayer) B.target.copy(G.player.pos);
    P.mouth.getWorldPosition(_mv);
    const k = Math.min(1, B.t / B.wind);
    if (B.t < B.wind) {
      P.mouth.scale.setScalar(0.2 + k * 1.4);
      if (Math.random() < dt * 30) fx.burst(_mv.clone(), K.col2, 1, 3, 0.4, 0.2, 0);
    } else if (B.t < B.wind + B.dur) {
      P.mouth.scale.setScalar(1.6);
      B.acc += dt;
      while (B.acc > 0.07) {
        B.acc -= 0.07;
        const to = B.target.clone(); to.x += rnd(-1.4, 1.4); to.y += rnd(-0.8, 0.8); to.z += rnd(-1.4, 1.4);
        enemyProjectile(_mv.clone(), to, 34, Math.random() < 0.5 ? K.col : K.col2, 'tower', e.dmg * 0.1, 0.4, 0, { small: true, onHit: (direct) => { if (direct) applyStatus(K.status[0], K.status[1], K.status[2]); } });
      }
    } else {
      P.mouth.scale.setScalar(0.01); e.breath = null; e.attackT = e.cd * (0.8 + Math.random() * 0.5);
    }
  }
}

Object.assign(TYPES, {
  icedragon:    { name: 'Smok lodowy',  hp: 560, speed: 0.35, r: 3.6, cy: 0, dmg: 20, cd: 5.0, gold: 140, score: 330, flying: true, stop: 0, isDragon: true, breathKind: 'ice' },
  poisondragon: { name: 'Smok jadowity', hp: 500, speed: 0.35, r: 3.0, cy: 0, dmg: 18, cd: 4.2, gold: 140, score: 330, flying: true, stop: 0, isDragon: true, breathKind: 'poison' },
});
