// Wrogowie: ork, goblin, złodziej, zły mag, smok
const enemies = [];
const _v = new THREE.Vector3();

function limb(w, h, d, m, parent, x, y, z) {
  const piv = new THREE.Group(); piv.position.set(x, y, z);
  const b = BOX(w, h, d, m, 0, -h / 2, 0, piv);
  parent.add(piv); return piv;
}

function makeHumanoid(o) {
  const root = new THREE.Group(), g = new THREE.Group();
  root.add(g);
  const b = o.bulk || 1, L = o.legLen || 0.8;
  const skin = mat(o.skin), cloth = mat(o.cloth), cloth2 = mat(o.cloth2 || o.cloth);
  const P = {};
  P.legL = limb(0.22 * b, L, 0.24 * b, cloth2, g, -0.17 * b, L, 0);
  P.legR = limb(0.22 * b, L, 0.24 * b, cloth2, g, 0.17 * b, L, 0);
  P.torso = BOX(0.68 * b, 0.75, 0.38 * b, cloth, 0, L + 0.37, 0, g);
  P.armL = limb(0.2 * b, 0.7, 0.2 * b, skin, g, -0.44 * b, L + 0.68, 0);
  P.armR = limb(0.2 * b, 0.7, 0.2 * b, skin, g, 0.44 * b, L + 0.68, 0);
  const hr = o.headR || 0.22;
  P.head = mesh(new THREE.SphereGeometry(hr, 10, 8), skin, 0, L + 0.75 + hr * 0.8, 0, g);
  const eyeM = new THREE.MeshBasicMaterial({ color: o.eye || 0xffee55 });
  [-1, 1].forEach(s => mesh(new THREE.SphereGeometry(hr * 0.16, 6, 6), eyeM, s * hr * 0.4, L + 0.78 + hr * 0.8, hr * 0.85, g, false));
  root.userData.P = P; root.userData.g = g; root.scale.setScalar(o.scale || 1);
  return root;
}

const BUILDERS = {
  ork(e) {
    const r = makeHumanoid({ skin: 0x4f7a2c, cloth: 0x5a3a20, cloth2: 0x3a2a1c, scale: 1.45, bulk: 1.5, headR: 0.25, legLen: 0.8, eye: 0xff3322 });
    const P = r.userData.P;
    BOX(0.9, 0.2, 0.5, M.iron, 0, 1.45, 0, r.userData.g);
    [-1, 1].forEach(s => { const sh = mesh(new THREE.SphereGeometry(0.2, 8, 6), M.iron, s * 0.55, 1.5, 0, r.userData.g); });
    [-1, 1].forEach(s => mesh(new THREE.ConeGeometry(0.04, 0.18, 5), M.white, s * 0.1, 1.5, 0.27, P.head.parent, false).rotation.x = Math.PI);
    // topór
    const axe = new THREE.Group(); axe.position.set(0, -0.6, 0.1);
    CYL(0.04, 0.04, 1.3, M.woodD, 0, 0.2, 0, axe, 6);
    BOX(0.08, 0.4, 0.5, M.iron, 0, 0.75, 0.15, axe);
    P.armR.add(axe); P.weapon = axe;
    return r;
  },
  goblin(e) {
    const r = makeHumanoid({ skin: 0x8fbf3a, cloth: 0x6a4b2a, cloth2: 0x4a3420, scale: 0.85, bulk: 0.9, headR: 0.3, legLen: 0.6, eye: 0xffff00 });
    const P = r.userData.P, hg = P.head.parent;
    [-1, 1].forEach(s => { const ear = mesh(new THREE.ConeGeometry(0.12, 0.5, 4), mat(0x8fbf3a), s * 0.42, 1.52, 0, hg); ear.rotation.z = -s * Math.PI / 2.4; });
    const k = new THREE.Group(); k.position.set(0, -0.6, 0.1);
    BOX(0.06, 0.5, 0.03, M.iron, 0, 0.3, 0.1, k);
    k.children[0].rotation.x = Math.PI / 2.2;
    P.armR.add(k); P.weapon = k;
    return r;
  },
  thief(e) {
    const r = makeHumanoid({ skin: 0xd8b48a, cloth: 0x2b2b3a, cloth2: 0x1c1c26, scale: 1.0, bulk: 0.85, headR: 0.2, legLen: 0.85, eye: 0xffffff });
    const P = r.userData.P, g = r.userData.g;
    const hood = mesh(new THREE.ConeGeometry(0.3, 0.55, 8), mat(0x1c1c26), 0, 1.95, -0.02, g);
    BOX(0.5, 0.15, 0.1, mat(0x111111), 0, 1.58, 0.17, g); // maska
    const cape = BOX(0.7, 0.9, 0.06, mat(0x20202c), 0, 1.25, -0.25, g); cape.rotation.x = 0.15;
    const sack = mesh(new THREE.SphereGeometry(0.28, 8, 8), mat(0x8b6b3a), 0, 1.2, -0.38, g);
    e.sack = sack; sack.visible = false;
    const k = new THREE.Group(); k.position.set(0, -0.6, 0.1);
    BOX(0.05, 0.4, 0.03, M.iron, 0, 0.25, 0.1, k).rotation.x = Math.PI / 2.2;
    P.armR.add(k); P.weapon = k;
    return r;
  },
  mage(e) {
    const r = new THREE.Group(), g = new THREE.Group(); r.add(g);
    const P = {};
    const robe = mat(0x4a1f7a), robe2 = mat(0x2a0f4a);
    mesh(new THREE.ConeGeometry(0.75, 1.9, 12), robe, 0, 0.95, 0, g);
    CYL(0.3, 0.45, 0.5, robe2, 0, 1.75, 0, g, 10);
    P.head = mesh(new THREE.SphereGeometry(0.22, 10, 8), mat(0xe0c0a0), 0, 2.15, 0, g);
    mesh(new THREE.ConeGeometry(0.4, 0.9, 10), robe2, 0, 2.7, 0, g).rotation.x = -0.15;
    CYL(0.5, 0.5, 0.06, robe2, 0, 2.28, 0, g, 12);
    const beard = mesh(new THREE.ConeGeometry(0.17, 0.5, 6), M.white, 0, 1.9, 0.12, g); beard.rotation.x = Math.PI;
    const eyeM = new THREE.MeshBasicMaterial({ color: 0xff2020 });
    [-1, 1].forEach(s => mesh(new THREE.SphereGeometry(0.035, 6, 6), eyeM, s * 0.08, 2.2, 0.2, g, false));
    P.armL = limb(0.16, 0.6, 0.16, robe, g, -0.4, 1.8, 0);
    P.armR = limb(0.16, 0.6, 0.16, robe, g, 0.4, 1.8, 0);
    const staff = new THREE.Group(); staff.position.set(0, -0.5, 0.15);
    CYL(0.04, 0.04, 2.3, M.woodD, 0, 0.5, 0, staff, 6);
    const orb = mesh(new THREE.SphereGeometry(0.17, 10, 8), new THREE.MeshBasicMaterial({ color: 0xb050ff }), 0, 1.75, 0, staff, false);
        P.armR.add(staff); P.orb = orb; P.weapon = staff;
    r.userData.P = P; r.userData.g = g;
    return r;
  },
  dragon(e) {
    const r = new THREE.Group(), g = new THREE.Group(); r.add(g);
    const P = {};
    const red = mat(0xa82a1a), dark = mat(0x701810), belly = mat(0xd8a050), wingM = new THREE.MeshLambertMaterial({ color: 0x8a2018, side: THREE.DoubleSide });
    const body = mesh(new THREE.SphereGeometry(1.4, 12, 10), red, 0, 0, 0, g); body.scale.set(1, 0.9, 1.9);
    const bel = mesh(new THREE.SphereGeometry(1.25, 10, 8), belly, 0, -0.35, 0.1, g); bel.scale.set(0.8, 0.7, 1.7);
    // szyja i głowa
    const neck = new THREE.Group(); neck.position.set(0, 0.5, 2.1); g.add(neck);
    const n1 = CYL(0.45, 0.65, 1.8, red, 0, 0.5, 0.5, neck, 8); n1.rotation.x = 0.7;
    const head = new THREE.Group(); head.position.set(0, 1.4, 1.5); neck.add(head);
    mesh(new THREE.BoxGeometry(0.8, 0.7, 1.4), red, 0, 0, 0.3, head);
    mesh(new THREE.BoxGeometry(0.7, 0.25, 0.9), dark, 0, -0.3, 0.55, head);
    [-1, 1].forEach(s => {
      mesh(new THREE.ConeGeometry(0.12, 0.9, 6), M.white, s * 0.3, 0.55, -0.2, head).rotation.x = -0.9;
      mesh(new THREE.SphereGeometry(0.1, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffdd00 }), s * 0.42, 0.15, 0.4, head, false);
      mesh(new THREE.ConeGeometry(0.05, 0.25, 4), M.white, s * 0.25, -0.1, 1.0, head, false).rotation.x = Math.PI;
    });
    P.head = head;
    // ogon
    const tail = new THREE.Group(); tail.position.set(0, 0, -2.4); g.add(tail);
    const t1 = mesh(new THREE.ConeGeometry(0.7, 3.5, 8), red, 0, 0, -1.4, tail); t1.rotation.x = -Math.PI / 2;
    mesh(new THREE.ConeGeometry(0.3, 0.7, 4), dark, 0, 0, -3.4, tail).rotation.x = -Math.PI / 2;
    P.tail = tail;
    // skrzydła
    function wing(s) {
      const w = new THREE.Group(); w.position.set(s * 1.2, 0.8, 0.3);
      const arm = BOX(4.5, 0.18, 0.18, dark, s * 2.25, 0, 0, w);
      const mem = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 2.8), wingM);
      mem.rotation.x = -Math.PI / 2; mem.position.set(s * 2.2, 0, -1.3); mem.castShadow = true; w.add(mem);
      for (let i = 1; i <= 3; i++) BOX(0.06, 0.06, 2.7, dark, s * i * 1.1, 0, -1.3, w);
      g.add(w); return w;
    }
    P.wingL = wing(-1); P.wingR = wing(1);
    // łapy
    [-1, 1].forEach(s => { const l = CYL(0.2, 0.3, 1.0, dark, s * 0.9, -1.1, 0.7, g, 6); l.rotation.x = 0.3; });
    r.userData.P = P; r.userData.g = g; r.scale.setScalar(1.3);
    return r;
  },
};

const TYPES = {
  ork:    { name: 'Ork',       hp: 160, speed: 2.4, r: 1.15, cy: 1.7, dmg: 14, cd: 1.4, gold: 14, score: 30, stop: 13 },
  goblin: { name: 'Goblin',    hp: 40,  speed: 4.0, r: 0.65, cy: 0.9, dmg: 4,  cd: 0.7, gold: 5,  score: 10, stop: 13 },
  thief:  { name: 'Złodziej',  hp: 60,  speed: 6.2, r: 0.7,  cy: 1.2, dmg: 0,  cd: 1.0, gold: 20, score: 25, stop: 13 },
  mage:   { name: 'Mag',       hp: 90,  speed: 2.6, r: 0.9,  cy: 1.5, dmg: 12, cd: 3.2, gold: 25, score: 50, ranged: true, stop: 40, isMage: true, spell: 'dark' },
  dragon: { name: 'Smok',      hp: 520, speed: 0.35, r: 3.2, cy: 0,   dmg: 22, cd: 4.5, gold: 120, score: 300, flying: true, stop: 0, isDragon: true, breathKind: 'fire' },
};

class Enemy {
  constructor(type, pos) {
    const T = TYPES[type]; Object.assign(this, T);
    this.type = type; this.maxHp = this.hp *= (1 + (G.wave - 1) * 0.12);
    this.maxHp = this.hp;
    this.mesh = BUILDERS[type](this);
    this.mesh.position.copy(pos);
    scene.add(this.mesh);
    this.P = this.mesh.userData.P;
    this.t = Math.random() * 10; this.attackT = Math.random() * this.cd; this.state = 'walk';
    this.slowT = 0; this.burnT = 0; this.burnDps = 0; this.dead = false; this.deadT = 0; this.hurt = 0;
    this.speedMul = 1 + Math.min(G.wave * 0.025, 0.5);
    if (this.isDragon) { this.yaw = null; this.breath = null; this.ang = Math.atan2(pos.z, pos.x); this.orbitR = 32; this.alt = TOWER_Y + 9; this.dir = Math.random() < .5 ? 1 : -1; }
    if (this.ranged) this.stop = (this.stopMin || 34) + Math.random() * 8;
    this.label = null;
  }
  get center() { return new THREE.Vector3(this.mesh.position.x, this.mesh.position.y + this.cy * (this.mesh.scale.y), this.mesh.position.z); }

  damage(n, kind) {
    if (this.dead) return;
    this.hp -= n; this.hurt = 0.15;
    if (this.hp <= 0) this.die();
  }
  slow(t) { this.slowT = Math.max(this.slowT, t); }
  burn(t, dps) { this.burnT = Math.max(this.burnT, t); this.burnDps = Math.max(this.burnDps, dps); }

  die() {
    this.dead = true; this.deadT = 0;
    G.kills++; G.bodies[this.type] = (G.bodies[this.type] || 0) + 1; addScore(this.score); addGold(this.gold);
    if (G.kills === 1) say('firstKill', {}, { prio: 1, cool: 0 });
    else if (G.kills % 40 === 0) say('killMilestone', { k: G.kills }, { prio: 1, cool: 0 });
    if (this.isDragon) say('dragonDead', {}, { prio: 1, cool: 0 });
    else if (this.isMage && Math.random() < 0.5) say('mageDead', {}, { prio: 1, cool: 5000 });
    else if (this.type === 'thief' && this.hasStolen) say('thiefDead', {}, { prio: 2, cool: 0 });
    else if ((this.type === 'elfarcher' || this.type === 'elfwitch') && Math.random() < 0.5) say('elfDead', {}, { prio: 1, cool: 8000 });
    fx.burst(this.center.clone(), 0xffd040, 8, 5, 0.6, 0.18);
    floatText('+' + this.gold + '💰');
    if (this.hasStolen) { addGold(this.stolen); this.stolen = 0; }
  }

  update(dt) {
    this.t += dt;
    if (this.dead) {
      this.deadT += dt;
      if (this.flying) { this.mesh.position.y -= dt * 18; this.mesh.rotation.z += dt * 3; if (this.mesh.position.y <= 0.5) { this.mesh.position.y = 0.5; if (!this.crashed) { this.crashed = true; fx.burst(this.mesh.position.clone(), 0xff8020, 40, 14, 1.0, 0.5); shake(0.5); } } }
      else { this.mesh.rotation.x = Math.min(this.mesh.rotation.x + dt * 4, Math.PI / 2); this.mesh.position.y = Math.max(0, this.mesh.position.y - dt * 0.2); }
      if (this.deadT > 1.6) { this.remove = true; }
      return;
    }
    let sp = this.speed * this.speedMul;
    if (this.slowT > 0) { this.slowT -= dt; sp *= 0.4; if (Math.random() < dt * 8) fx.burst(this.center.clone(), 0x9fe0ff, 1, 1.2, 0.5, 0.15); }
    if (this.burnT > 0) { this.burnT -= dt; this.damage(this.burnDps * dt); if (Math.random() < dt * 14) fx.burst(this.center.clone(), 0xff7a20, 1, 1.5, 0.5, 0.2); } else this.burnDps = 0;
    if (this.buffT > 0) { this.buffT -= dt; sp *= 1.35; if (Math.random() < dt * 6) fx.burst(this.center.clone(), 0x7bff3a, 1, 1.2, 0.5, 0.15, -1); }
    this.hurt = Math.max(0, this.hurt - dt);
    this.attackT -= dt;
    if (TICK[this.type]) TICK[this.type](this, dt);
    const pos = this.mesh.position, P = this.P;
    const cheb = Math.max(Math.abs(pos.x), Math.abs(pos.z));

    if (this.isDragon) return this.updateDragon(dt, sp);

    const face = (dx, dz) => { this.mesh.rotation.y = Math.atan2(dx, dz); };
    const walkAnim = (k) => {
      const s = Math.sin(this.t * k);
      P.legL && (P.legL.rotation.x = s * 0.7); P.legR && (P.legR.rotation.x = -s * 0.7);
      P.armL && (P.armL.rotation.x = -s * 0.6);
      if (P.armR && this.state !== 'attack') P.armR.rotation.x = s * 0.6;
      this.mesh.userData.g.position.y = Math.abs(s) * 0.07;
    };

    if (this.state === 'flee') {
      const d = _v.set(pos.x, 0, pos.z).normalize();
      pos.x += d.x * sp * 1.15 * dt; pos.z += d.z * sp * 1.15 * dt;
      face(d.x, d.z); walkAnim(sp * 3);
      if (cheb > 150) { this.escaped = true; this.remove = true; this.hasStolen = false; showMsg(t('escaped', this.stolen)); say('escaped', { g: this.stolen }, { prio: 1, cool: 0 }); }
      return;
    }

    if (this.ranged) {
      const dist = Math.hypot(pos.x, pos.z);
      if (dist > this.stop) {
        pos.x -= pos.x / dist * sp * dt; pos.z -= pos.z / dist * sp * dt;
        face(-pos.x, -pos.z); walkAnim(sp * 2.5); this.state = 'walk';
      } else {
        this.state = 'attack'; face(-pos.x, -pos.z);
        if (P.pose) P.pose(this); else { P.armR.rotation.x = -1.6 - Math.sin(this.t * 4) * 0.15; P.armL.rotation.x = -0.5; }
        if (this.attackT <= 0) { this.attackT = this.cd * (0.8 + Math.random() * 0.5); this.cast(); }
      }
      pos.y = this.noHover ? 0 : 0.15 + Math.sin(this.t * 2) * 0.12;
      if (P.orb) P.orb.scale.setScalar(1 + Math.sin(this.t * 8) * 0.25);
      return;
    }

    if (cheb > this.stop) {
      // ruch w stronę wieży, zwężając tor do osi bramy
      const tx = Math.abs(pos.x) > Math.abs(pos.z) ? 0 : pos.x * 0.995, tz = Math.abs(pos.x) > Math.abs(pos.z) ? pos.z * 0.995 : 0;
      const dx = (Math.abs(pos.x) > Math.abs(pos.z) ? -Math.sign(pos.x) : (tx - pos.x) * 0.02), dz = (Math.abs(pos.x) > Math.abs(pos.z) ? (tz - pos.z) * 0.02 : -Math.sign(pos.z));
      const l = Math.hypot(dx, dz);
      pos.x += dx / l * sp * dt; pos.z += dz / l * sp * dt;
      face(dx, dz); walkAnim(sp * 2.6); this.state = 'walk';
    } else {
      this.state = 'attack';
      face(-pos.x, -pos.z);
      const swing = Math.sin(this.t * 7);
      P.armR.rotation.x = -1.2 + swing * 1.1; P.armL.rotation.x = swing * 0.3;
      P.legL.rotation.x = P.legR.rotation.x = 0;
      if (this.attackT <= 0) {
        this.attackT = this.cd;
        if (this.type === 'thief') this.steal();
        else {
          const from = pos.clone(); from.y += 2.2 * this.mesh.scale.y;
          const to = new THREE.Vector3(rnd(-2, 2), TOWER_Y - 1, rnd(-2, 2)); to.x += pos.x * 0.35; to.z += pos.z * 0.35;
          enemyProjectile(from, to, 24, this.projCol || (this.type === 'ork' ? 0x777777 : 0x8a6a3a), 'tower', this.dmg, 0.28, 0);
        }
      }
    }
  }

  steal() {
    const amt = Math.min(G.gold, 30 + G.wave * 5);
    this.stolen = amt; G.gold -= amt; this.hasStolen = true;
    this.sack.visible = true; this.state = 'flee';
    showMsg(t('stolen', amt)); say('stolen', { g: amt }, { prio: 2, cool: 0 });
    if (this.P.armR) this.P.armR.rotation.x = 0;
  }

  cast() { (SPELLS[this.spell || 'dark'] || SPELLS.dark)(this); }

  updateDragon(dt, sp) { dragonUpdate(this, dt, sp); }
}

function state_dir(e, tx, tz) { return { x: tx, z: tz }; }
