// Warg riders, orc shaman, dark elves (archer, witch)

function buildWarg(rider) {
  const r = new THREE.Group(), g = new THREE.Group(); r.add(g);
  const P = {}, fur = mat(0x4a4038), fur2 = mat(0x2e2822), eyeM = new THREE.MeshBasicMaterial({ color: 0xff3322 });
  const body = mesh(new THREE.SphereGeometry(0.7, 10, 8), fur, 0, 1.0, 0, g); body.scale.set(0.9, 0.85, 1.9);
  const chest = mesh(new THREE.SphereGeometry(0.62, 8, 6), fur2, 0, 1.1, 0.9, g); chest.scale.set(1, 1, 1.1);
  const head = new THREE.Group(); head.position.set(0, 1.35, 1.65); g.add(head);
  mesh(new THREE.BoxGeometry(0.55, 0.5, 0.6), fur, 0, 0, 0, head);
  mesh(new THREE.BoxGeometry(0.34, 0.26, 0.55), fur2, 0, -0.1, 0.5, head);
  [-1, 1].forEach(s => {
    mesh(new THREE.ConeGeometry(0.1, 0.3, 4), fur2, s * 0.2, 0.36, -0.1, head);
    mesh(new THREE.SphereGeometry(0.05, 6, 6), eyeM, s * 0.2, 0.08, 0.28, head, false);
    mesh(new THREE.ConeGeometry(0.035, 0.16, 4), M.white, s * 0.1, -0.28, 0.72, head, false).rotation.x = Math.PI;
  });
  const tail = new THREE.Group(); tail.position.set(0, 1.2, -1.2); g.add(tail);
  mesh(new THREE.ConeGeometry(0.2, 1.1, 6), fur2, 0, -0.1, -0.5, tail).rotation.x = -2.0;
  const legs = [];
  [[-1, 0.85], [1, 0.85], [-1, -0.85], [1, -0.85]].forEach(([s, z]) => legs.push(limb(0.2, 0.9, 0.22, fur2, g, s * 0.38, 0.95, z)));
  P.legL = legs[0]; P.legR = legs[1]; P.legs = legs;
  P.head = head; P.tail = tail;
  P.anim = (s) => { legs[0].rotation.x = s * 0.9; legs[1].rotation.x = -s * 0.9; legs[2].rotation.x = -s * 0.9; legs[3].rotation.x = s * 0.9; tail.rotation.y = s * 0.4; head.rotation.x = s * 0.06; };
  const saddle = BOX(0.8, 0.12, 0.9, mat(0x5a3a20), 0, 1.75, 0, g);
  const rd = BUILDERS.ork(); rd.scale.setScalar(rider.scale || 0.95); rd.position.set(0, 1.78, -0.05);
  rd.userData.P.legL.rotation.x = -1.2; rd.userData.P.legR.rotation.x = -1.2;
  rd.userData.P.legL.rotation.z = 0.5; rd.userData.P.legR.rotation.z = -0.5;
  g.add(rd);
  P.rider = rd; P.armL = rd.userData.P.armL; P.armR = rd.userData.P.armR; P.weapon = rd.userData.P.weapon;
  if (rider.deco) rider.deco(rd, g);
  r.userData.P = P; r.userData.g = g;
  return r;
}
BUILDERS.warg = e => buildWarg({ scale: 0.95 });

function buildShaman() {
  const r = BUILDERS.ork(), P = r.userData.P, g = r.userData.g;
  P.armR.remove(P.weapon);
  const rob = mat(0x2f4a22), bone = mat(0xe8e4d0);
  const robe = mesh(new THREE.ConeGeometry(0.75, 1.3, 8), rob, 0, 0.7, 0, g); robe.scale.set(1.1, 1, 0.8);
  const skull = mesh(new THREE.SphereGeometry(0.2, 8, 6), bone, 0, 2.05, 0.1, g);
  [-1, 1].forEach(s => { const h = mesh(new THREE.ConeGeometry(0.1, 0.6, 5), bone, s * 0.28, 2.3, 0, g); h.rotation.z = -s * 0.5; });
  for (let i = 0; i < 5; i++) mesh(new THREE.SphereGeometry(0.07, 5, 5), bone, -0.4 + i * 0.2, 1.4, 0.3, g);
  const st = new THREE.Group(); st.position.set(0, -0.6, 0.1);
  CYL(0.05, 0.05, 2.0, M.woodD, 0, 0.5, 0, st, 6);
  P.orb = mesh(new THREE.SphereGeometry(0.2, 8, 6), new THREE.MeshBasicMaterial({ color: 0x7bff3a }), 0, 1.6, 0, st, false);
  [0, 1, 2].forEach(i => mesh(new THREE.ConeGeometry(0.04, 0.3, 4), bone, Math.cos(i * 2.1) * 0.18, 1.55, Math.sin(i * 2.1) * 0.18, st, false));
  P.armR.add(st); P.weapon = st;
  P.pose = e => { P.armR.rotation.x = -1.9 + Math.sin(e.t * 3) * 0.2; P.armL.rotation.x = -0.6; };
  return r;
}
BUILDERS.shaman = e => buildShaman();

function buildElf(o) {
  const r = makeHumanoid({ skin: 0x9a8ab8, cloth: o.cloth, cloth2: o.cloth2, scale: 1.12, bulk: 0.78, headR: 0.2, legLen: 0.95, eye: o.eye });
  const P = r.userData.P, g = r.userData.g, hg = P.head.parent;
  [-1, 1].forEach(s => { const ear = mesh(new THREE.ConeGeometry(0.06, 0.55, 4), mat(0x9a8ab8), s * 0.26, 1.9, 0, hg); ear.rotation.z = -s * 1.15; });
  mesh(new THREE.ConeGeometry(0.34, 0.6, 8), mat(o.cloth2), 0, 2.02, -0.05, g).rotation.x = -0.15;
  const cape = BOX(0.65, 1.2, 0.05, mat(o.cloth2), 0, 1.35, -0.26, g); cape.rotation.x = 0.1;
  P.armR.remove(P.weapon);
  if (o.bow) {
    const bow = new THREE.Group(); bow.position.set(0, -0.55, 0.15);
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.035, 5, 14, Math.PI), mat(0x2a1a3a)); arc.rotation.z = Math.PI / 2; arc.position.y = 0.4; bow.add(arc);
    BOX(0.012, 1.2, 0.012, mat(0xdddddd), -0.0, 0.4, -0.0, bow);
    P.armL.add(bow);
    P.pose = e => { P.armL.rotation.x = -1.55; P.armR.rotation.x = -1.35 + Math.sin(e.t * 5) * 0.08; };
  } else {
    const st = new THREE.Group(); st.position.set(0, -0.6, 0.1);
    CYL(0.035, 0.035, 1.7, mat(0x2a1a3a), 0, 0.4, 0, st, 6);
    P.orb = mesh(new THREE.SphereGeometry(0.15, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff4aa0 }), 0, 1.35, 0, st, false);
    mesh(new THREE.TorusGeometry(0.2, 0.025, 5, 12), mat(0x2a1a3a), 0, 1.35, 0, st).rotation.x = 1.2;
    P.armR.add(st); P.weapon = st;
    P.pose = e => { P.armR.rotation.x = -1.7 + Math.sin(e.t * 4) * 0.15; P.armL.rotation.x = -0.5; };
  }
  return r;
}
BUILDERS.elfarcher = e => buildElf({ cloth: 0x2a2a48, cloth2: 0x151530, eye: 0x66ddff, bow: true });
BUILDERS.elfwitch = e => buildElf({ cloth: 0x5a1a4a, cloth2: 0x2a0a28, eye: 0xff4aa0, bow: false });

SPELLS.arrow = e => {
  const from = e.mesh.position.clone(); from.y += 2.3;
  const def = pickDefender(e.mesh.position);
  enemyProjectile(from, defenderPoint(def), 46, 0x66ddff, defenderTag(def), e.dmg, 0.18, 0, { small: true });
};
SPELLS.curse = e => {
  const from = e.mesh.position.clone(); from.y += 2.6;
  const def = pickDefender(e.mesh.position);
  enemyProjectile(from, defenderPoint(def), 24, 0xff4aa0, defenderTag(def), e.dmg, 0.38, 1.5, { onHit: (direct) => { if (direct) applyStatus('curse', 5, 0); } });
};
SPELLS.shaman = e => {
  let n = 0;
  for (const o of enemies) {
    if (o.dead || o === e || (o.type !== 'ork' && o.type !== 'warg' && o.type !== 'shaman')) continue;
    if (o.mesh.position.distanceTo(e.mesh.position) < 28) { o.buffT = 6; n++; fx.burst(o.center.clone(), 0x7bff3a, 6, 3, 0.7, 0.18, -2); }
  }
  fx.ring(e.mesh.position.clone(), 0x7bff3a, 6, 0.8);
  if (n) say('shamanBuff', {}, { prio: 1, cool: 15000 });
  else {
    const from = e.mesh.position.clone(); from.y += 3;
    const def = pickDefender(e.mesh.position);
    enemyProjectile(from, defenderPoint(def), 22, 0x7bff3a, defenderTag(def), e.dmg, 0.3, 1);
  }
};

Object.assign(TYPES, {
  warg:      { hp: 200, speed: 5.4, r: 1.5, cy: 1.8, dmg: 16, cd: 1.3, gold: 24, score: 55, stop: 13 },
  shaman:    { hp: 130, speed: 2.2, r: 1.1, cy: 1.8, dmg: 10, cd: 5.0, gold: 35, score: 70, ranged: true, stop: 30, noHover: true, spell: 'shaman', stopMin: 26 },
  elfarcher: { hp: 70,  speed: 3.4, r: 0.8, cy: 1.6, dmg: 7,  cd: 1.5, gold: 22, score: 45, ranged: true, stop: 38, noHover: true, spell: 'arrow', stopMin: 34 },
  elfwitch:  { hp: 85,  speed: 3.0, r: 0.8, cy: 1.6, dmg: 9,  cd: 3.6, gold: 30, score: 55, ranged: true, stop: 40, noHover: true, spell: 'curse', stopMin: 36 },
});
