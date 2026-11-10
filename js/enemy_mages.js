// Magowie (piromanta, mag lodu, burzomag, nekromanta), mroczne elfy, szaman orków i czary wrogów
const TICK = {};
const SPELLS = {};

function buildMage(o) {
  const r = new THREE.Group(), g = new THREE.Group(); r.add(g);
  const P = {}, robe = mat(o.robe), robe2 = mat(o.robe2);
  mesh(new THREE.ConeGeometry(0.75, 1.9, 12), robe, 0, 0.95, 0, g);
  CYL(0.3, 0.45, 0.5, robe2, 0, 1.75, 0, g, 10);
  P.head = mesh(new THREE.SphereGeometry(0.22, 10, 8), mat(o.skin || 0xe0c0a0), 0, 2.15, 0, g);
  if (o.hood) mesh(new THREE.ConeGeometry(0.34, 0.8, 8), robe2, 0, 2.5, -0.05, g).rotation.x = -0.1;
  else { mesh(new THREE.ConeGeometry(0.4, 0.9, 10), robe2, 0, 2.7, 0, g).rotation.x = -0.15; CYL(0.5, 0.5, 0.06, robe2, 0, 2.28, 0, g, 12); }
  if (o.beard !== false) { const b = mesh(new THREE.ConeGeometry(0.17, 0.5, 6), mat(o.beard || 0xffffff), 0, 1.9, 0.12, g); b.rotation.x = Math.PI; }
  const eyeM = new THREE.MeshBasicMaterial({ color: o.eye });
  [-1, 1].forEach(s => mesh(new THREE.SphereGeometry(0.035, 6, 6), eyeM, s * 0.08, 2.2, 0.2, g, false));
  P.armL = limb(0.16, 0.6, 0.16, robe, g, -0.4, 1.8, 0);
  P.armR = limb(0.16, 0.6, 0.16, robe, g, 0.4, 1.8, 0);
  const staff = new THREE.Group(); staff.position.set(0, -0.5, 0.15);
  CYL(0.04, 0.04, 2.3, M.woodD, 0, 0.5, 0, staff, 6);
  P.orb = mesh(new THREE.SphereGeometry(0.17, 10, 8), new THREE.MeshBasicMaterial({ color: o.orb }), 0, 1.75, 0, staff, false);
  if (o.topper) o.topper(staff);
  P.armR.add(staff); P.weapon = staff;
  if (o.deco) o.deco(g, P);
  r.userData.P = P; r.userData.g = g;
  return r;
}

BUILDERS.pyro = e => buildMage({ robe: 0x9a2a10, robe2 : 0x5a1408, orb: 0xff7a1a, eye: 0xffcc22, beard: 0x552211,
  topper: s => { for (let i = 0; i < 4; i++) mesh(new THREE.ConeGeometry(0.07, 0.35, 4), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xffd040 : 0xff4a10 }), Math.cos(i * 1.6) * 0.14, 1.95, Math.sin(i * 1.6) * 0.14, s, false); },
  deco: g => { [-1, 1].forEach(s => mesh(new THREE.ConeGeometry(0.06, 0.4, 5), new THREE.MeshBasicMaterial({ color: 0xff6a10 }), s * 0.5, 2.0, 0, g, false)); } });
BUILDERS.frost = e => buildMage({ robe: 0x2e6a9a, robe2: 0x163c5e, orb: 0x9fe8ff, eye: 0xaaffff, skin: 0xc8dfe8, beard: 0xdff6ff,
  topper: s => { for (let i = 0; i < 5; i++) mesh(new THREE.ConeGeometry(0.06, 0.45, 4), new THREE.MeshBasicMaterial({ color: 0xdff8ff }), Math.cos(i * 1.26) * 0.15, 1.95, Math.sin(i * 1.26) * 0.15, s, false); } });
BUILDERS.storm = e => buildMage({ robe: 0x3a3a6a, robe2: 0x1a1a38, orb: 0xfff07a, eye: 0xfff07a, beard: 0xdddddd, hood: true,
  topper: s => { const m = new THREE.MeshBasicMaterial({ color: 0xfff07a }); for (let i = 0; i < 3; i++) mesh(new THREE.BoxGeometry(0.06, 0.4, 0.06), m, (i - 1) * 0.15, 1.97, 0, s, false).rotation.z = (i - 1) * 0.5; } });
BUILDERS.necro = e => buildMage({ robe: 0x1c2a1c, robe2: 0x0c140c, orb: 0x7bff3a, eye: 0x7bff3a, skin: 0xc9d4b8, beard: false, hood: true,
  topper: s => { mesh(new THREE.SphereGeometry(0.2, 8, 6), mat(0xe8e4d0), 0, 2.0, 0, s); BOX(0.2, 0.12, 0.16, mat(0xe8e4d0), 0, 1.86, 0.05, s); },
  deco: g => { for (let i = 0; i < 3; i++) mesh(new THREE.SphereGeometry(0.1, 6, 6), mat(0xe8e4d0), -0.35 + i * 0.35, 1.2, 0.5, g); } });

function mageCastAt(e, o) {
  const from = e.mesh.position.clone(); from.y += 3.2;
  const toPlayer = Math.random() < (o.pl === undefined ? 0.4 : o.pl);
  const target = toPlayer ? G.player.pos.clone() : new THREE.Vector3(rnd(-3, 3), TOWER_Y - 2, rnd(-3, 3));
  if (!toPlayer) { target.x += e.mesh.position.x * 0.12; target.z += e.mesh.position.z * 0.12; }
  enemyProjectile(from, target, o.speed || 22, o.color, toPlayer ? 'player' : 'tower', e.dmg * (o.dmgMul || 1), o.size || 0.35, o.splash === undefined ? 2 : o.splash,
    { onHit: (direct) => { if (direct && o.status) applyStatus(o.status[0], o.status[1], o.status[2]); } });
}
SPELLS.dark = e => mageCastAt(e, { color: 0xb050ff });
SPELLS.fire = e => mageCastAt(e, { color: 0xff6a10, size: 0.5, splash: 4, status: ['burn', 4, 3], pl: 0.5 });
SPELLS.frost = e => mageCastAt(e, { color: 0x9fe8ff, size: 0.4, speed: 26, status: ['slow', 4, 0], pl: 0.55, dmgMul: 0.8 });
SPELLS.necro = e => mageCastAt(e, { color: 0x7bff3a, status: ['poison', 5, 2], pl: 0.5, dmgMul: 0.7 });
SPELLS.storm = e => {
  const toPlayer = Math.random() < 0.65;
  const c = toPlayer ? G.player.pos.clone() : new THREE.Vector3(rnd(-4, 4), TOWER_Y + 0.4, rnd(-4, 4));
  c.y = TOWER_Y + 0.45;
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.8, 2.2, 28), new THREE.MeshBasicMaterial({ color: 0xfff07a, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2; ring.position.copy(c); scene.add(ring);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(1.8, 28), new THREE.MeshBasicMaterial({ color: 0xffee66, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }));
  disc.rotation.x = -Math.PI / 2; disc.position.copy(c); scene.add(disc);
  const dmg = e.dmg * 1.6;
  G.timers.push({ t: 1.5, fn: () => {
    scene.remove(ring); scene.remove(disc);
    const top = c.clone(); top.y += 40; lightningBolt(top, c); fx.flash(c.clone(), 0xffffaa, 3, 0.3); fx.burst(c.clone(), 0xfff07a, 20, 8, 0.6, 0.25);
    shake(0.5);
    if (Math.hypot(G.player.pos.x - c.x, G.player.pos.z - c.z) < 2.0) { hurtPlayer(dmg); applyStatus('curse', 3, 0); }
    else if (!toPlayer) damageTower(dmg * 0.5);
  } });
  fx.ring(c.clone(), 0xfff07a, 2.2, 1.5);
};
TICK.necro = (e, dt) => {
  if (e.state !== 'attack') return;
  e.summonT = (e.summonT === undefined ? 4 : e.summonT) - dt;
  if (e.summonT <= 0 && enemies.length < 70) {
    e.summonT = 11 + Math.random() * 4;
    for (let i = 0; i < 2; i++) {
      const p = e.mesh.position.clone().add(new THREE.Vector3(rnd(-3, 3), 0, rnd(-3, 3))); p.y = 0;
      const m = new Enemy('goblin', p); m.hp = m.maxHp = 28; m.speedMul *= 1.1; m.minion = true; m.gold = 2; enemies.push(m);
      fx.burst(p.clone().add(new THREE.Vector3(0, 1, 0)), 0x7bff3a, 12, 4, 0.7, 0.2, -2);
    }
    say('necroSummon', {}, { prio: 1, cool: 12000 });
  }
};

Object.assign(TYPES, {
  pyro:  { name: 'Piromanta',   hp: 100, speed: 2.5, r: 0.9, cy: 1.5, dmg: 14, cd: 3.0, gold: 30, score: 60, ranged: true, stop: 40, isMage: true, spell: 'fire' },
  frost: { name: 'Mag lodu',    hp: 95,  speed: 2.5, r: 0.9, cy: 1.5, dmg: 12, cd: 2.8, gold: 30, score: 60, ranged: true, stop: 42, isMage: true, spell: 'frost' },
  storm: { name: 'Burzomag',    hp: 110, speed: 2.4, r: 0.9, cy: 1.5, dmg: 18, cd: 4.2, gold: 35, score: 70, ranged: true, stop: 36, isMage: true, spell: 'storm', noHover: false },
  necro: { name: 'Nekromanta',  hp: 120, speed: 2.2, r: 0.9, cy: 1.5, dmg: 10, cd: 3.4, gold: 40, score: 80, ranged: true, stop: 44, isMage: true, spell: 'necro' },
});
