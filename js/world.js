// World: medieval tower, walls, forest, road, sky
const TOWER_Y = 14;        // platform height
const PLAT = 5;            // half the platform side
const EYE = 1.7;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game'), antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const SKY = 0x9ec3e6;
scene.background = new THREE.Color(SKY);
scene.fog = new THREE.Fog(SKY, 70, 260);

const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.1, 500);
camera.rotation.order = 'YXZ';
addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
});

const hemi = new THREE.HemisphereLight(0xcfe3ff, 0x5a4a30, 0.6);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0d0, 0.75);
sun.position.set(60, 90, 40);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -60, right: 60, top: 60, bottom: -60, near: 10, far: 250 });
scene.add(sun);

const mat = (c, o) => new THREE.MeshLambertMaterial(Object.assign({ color: c }, o || {}));
const M = {
  stone: mat(0x8c8c88), stoneD: mat(0x6b6b68), stoneL: mat(0xa5a49c), wood: mat(0x6b4524), woodD: mat(0x4a2e16),
  roof: mat(0x8a2a22), grass: mat(0x5c8a3a), grassD: mat(0x486e2e), dirt: mat(0x8a6d45), leaf: mat(0x2f6b2c), leaf2: mat(0x3d7d30),
  trunk: mat(0x5a3b1e), iron: mat(0x444a52), gold: mat(0xd4a82a), water: mat(0x3a78b8, { transparent: true, opacity: 0.85 }),
  white: mat(0xeeeeee), red: mat(0xb02a2a), blue: mat(0x2a4aa8),
};

function mesh(geo, m, x, y, z, parent, shadow) {
  const o = new THREE.Mesh(geo, m);
  o.position.set(x || 0, y || 0, z || 0);
  if (shadow !== false) { o.castShadow = true; o.receiveShadow = true; }
  (parent || scene).add(o);
  return o;
}
const BOX = (w, h, d, m, x, y, z, p) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
const CYL = (rt, rb, h, m, x, y, z, p, seg) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 12), m, x, y, z, p);

function rnd(a, b) { return a + Math.random() * (b - a); }
function seeded(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

// Tekstura kamienia (canvas)
function stoneTexture(base, rep) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'); g.fillStyle = base; g.fillRect(0, 0, 128, 128);
  const r = seeded(7);
  for (let row = 0; row < 8; row++) {
    const off = (row % 2) * 16;
    for (let col = -1; col < 5; col++) {
      const x = col * 32 + off, y = row * 16, sh = 120 + r() * 40 | 0;
      g.fillStyle = `rgb(${sh},${sh},${sh - 6})`; g.fillRect(x + 1, y + 1, 30, 14);
      g.strokeStyle = 'rgba(30,30,30,.7)'; g.lineWidth = 2; g.strokeRect(x, y, 32, 16);
    }
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]);
  return t;
}
function grassTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'); g.fillStyle = '#5c8a3a'; g.fillRect(0, 0, 256, 256);
  const r = seeded(3);
  for (let i = 0; i < 2500; i++) {
    const v = r();
    g.fillStyle = v < .5 ? 'rgba(70,110,40,.5)' : v < .8 ? 'rgba(110,150,60,.4)' : 'rgba(80,70,40,.3)';
    g.fillRect(r() * 256, r() * 256, 2 + r() * 3, 2 + r() * 3);
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(60, 60);
  return t;
}

const world = { towerGroup: new THREE.Group(), trees: [], torches: [], fires: [] };
scene.add(world.towerGroup);

function buildWorld() {
  // Teren
  const ground = mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshLambertMaterial({ map: grassTexture() }), 0, 0, 0, scene, false);
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;

  // A road from each side converging on the tower
  [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(a => {
    const road = mesh(new THREE.PlaneGeometry(9, 190), M.dirt, 0, 0.05, 0, scene, false);
    road.rotation.order = 'YXZ'; road.rotation.y = a; road.rotation.x = -Math.PI / 2;
    road.position.set(-Math.sin(a) * 95, 0.05, -Math.cos(a) * 95);
    road.receiveShadow = true;
  });

  // A river with a bridge on the south road
  const river = mesh(new THREE.PlaneGeometry(500, 14), M.water, 0, 0.08, 120, scene, false);
  river.rotation.x = -Math.PI / 2;
  BOX(10, 0.5, 16, M.wood, 0, 0.2, 120);
  BOX(0.4, 1, 16, M.woodD, -4.8, 0.9, 120);
  BOX(0.4, 1, 16, M.woodD, 4.8, 0.9, 120);

  buildTower();
  buildCastleWalls();
  buildForest();
  buildHills();
  buildClouds();
}

function buildTower() {
  const g = world.towerGroup, st = stoneTexture('#888', [4, 6]);
  const stoneM = new THREE.MeshLambertMaterial({ map: st });
  // tower shaft
  const body = BOX(PLAT * 2 + 2, TOWER_Y, PLAT * 2 + 2, stoneM, 0, TOWER_Y / 2, 0, g);
  // podstawa
  BOX(PLAT * 2 + 5, 3, PLAT * 2 + 5, M.stoneD, 0, 1.5, 0, g);
  // machicolation balcony
  BOX(PLAT * 2 + 3, 1.2, PLAT * 2 + 3, M.stoneL, 0, TOWER_Y - 0.6, 0, g);
  // floor
  const floor = BOX(PLAT * 2 + 2.4, 0.4, PLAT * 2 + 2.4, M.woodD, 0, TOWER_Y + 0.2, 0, g);
  // deski
  for (let i = -4; i <= 4; i++) BOX(0.06, 0.02, PLAT * 2 + 2, M.wood, i * 1.2, TOWER_Y + 0.42, 0, g);
  // battlements
  const S = PLAT + 1.1;
  for (let i = -S; i <= S + 0.01; i += 1.4) {
    [[i, -S], [i, S], [-S, i], [S, i]].forEach(([x, z]) => BOX(0.9, 0.4, 0.9, M.stoneL, x, TOWER_Y + 1.3, z, g));
  }
  // low wall between the merlons
  BOX(PLAT * 2 + 2.4, 0.7, 0.5, M.stoneL, 0, TOWER_Y + 0.75, -S, g);
  BOX(PLAT * 2 + 2.4, 0.7, 0.5, M.stoneL, 0, TOWER_Y + 0.75, S, g);
  BOX(0.5, 0.7, PLAT * 2 + 2.4, M.stoneL, -S, TOWER_Y + 0.75, 0, g);
  BOX(0.5, 0.7, PLAT * 2 + 2.4, M.stoneL, S, TOWER_Y + 0.75, 0, g);
  // corner turrets
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    const x = sx * (S + 0.2), z = sz * (S + 0.2);
    CYL(1.5, 1.7, TOWER_Y + 3, stoneM, x, (TOWER_Y + 3) / 2 - 0.5, z, g, 14);
    CYL(1.9, 1.9, 0.8, M.stoneL, x, TOWER_Y + 2.2, z, g, 14);
    mesh(new THREE.ConeGeometry(2.0, 3.2, 14), M.roof, x, TOWER_Y + 4.2, z, g);
    CYL(0.04, 0.04, 2.2, M.iron, x, TOWER_Y + 6.8, z, g, 4);
    const flag = BOX(1.1, 0.6, 0.04, sx * sz > 0 ? M.red : M.blue, x + 0.6, TOWER_Y + 7.3, z, g);
    flag.userData.flag = true; world.torches.push(flag);
  });
  // torches: standing on the floor against the wall, offset from the middle of each side
  const TQ = 3, TD = S - 0.65;
  [[TQ, -TD], [TD, TQ], [-TQ, TD], [-TD, -TQ]].forEach(([x, z], k) => buildTorch(g, x, z, k));
  // beczki i skrzynie dekoracyjne
  CYL(0.45, 0.4, 0.9, M.wood, 3.6, TOWER_Y + 0.85, 3.6, g, 10);
  CYL(0.45, 0.4, 0.9, M.wood, 4.2, TOWER_Y + 0.85, 3.0, g, 10);
  BOX(0.9, 0.7, 0.9, M.woodD, -3.8, TOWER_Y + 0.75, 3.8, g);
  BOX(0.8, 0.6, 0.8, M.wood, -3.6, TOWER_Y + 0.7, -3.9, g);
  // pile of mortar balls
  for (let i = 0; i < 6; i++) mesh(new THREE.SphereGeometry(0.22, 8, 8), M.iron, 3.2 + (i % 3) * 0.42, TOWER_Y + 0.62 + (i > 2 ? 0.33 : 0), -3.8, g);
  buildMortarProp(g);
}

function buildMortarProp(g) {
  const m = new THREE.Group(); m.position.set(-3.4, TOWER_Y + 0.4, -3.2);
  BOX(1.4, 0.3, 1.4, M.woodD, 0, 0.15, 0, m);
  const tube = CYL(0.45, 0.65, 1.1, M.iron, 0, 0.8, 0, m, 14); tube.rotation.z = 0.35;
  CYL(0.1, 0.1, 1.2, M.iron, 0, 0.45, 0, m, 8).rotation.x = Math.PI / 2;
  g.add(m);
}

function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,200,110,0.9)'); gr.addColorStop(0.35, 'rgba(255,140,40,0.35)'); gr.addColorStop(1, 'rgba(255,100,20,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function buildTorch(g, x, z, k) {
  const base = TOWER_Y + 0.4, T = new THREE.Group(); T.position.set(x, base, z); g.add(T);
  const cloth = mat(0x4a2e18), hot = c => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.92, depthWrite: false });
  // stone footing, pole with iron bands, cup and wrapped head
  CYL(0.28, 0.34, 0.25, M.stoneD, 0, 0.12, 0, T, 8);
  CYL(0.06, 0.09, 2.0, M.wood, 0, 1.2, 0, T, 7);
  [0.5, 1.2, 1.9].forEach(h => CYL(0.115, 0.115, 0.07, M.iron, 0, h, 0, T, 8));
  CYL(0.26, 0.13, 0.28, M.iron, 0, 2.2, 0, T, 8);
  CYL(0.2, 0.15, 0.34, cloth, 0, 2.45, 0, T, 8);
  const ember = new THREE.Mesh(new THREE.CircleGeometry(0.19, 8), new THREE.MeshBasicMaterial({ color: 0xff6a14 })); ember.rotation.x = -Math.PI / 2; ember.position.y = 2.63; T.add(ember);
  // layered flame; geometry is shifted so the cone scales from its base
  const cone = (r, h, c, y) => { const geo = new THREE.ConeGeometry(r, h, 8); geo.translate(0, h / 2, 0); const m = new THREE.Mesh(geo, hot(c)); m.position.y = y; T.add(m); return m; };
  const flames = [cone(0.24, 0.85, 0xd8400c, 2.55), cone(0.17, 0.68, 0xff8a1e, 2.58), cone(0.1, 0.46, 0xffd45a, 2.6)];
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: world.glowTex || (world.glowTex = glowTexture()), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.85 }));
  glow.scale.set(2.6, 2.6, 1); glow.position.y = 2.95; T.add(glow);
  // sparks
  const N = 7, pos = new Float32Array(N * 3), seed = [];
  for (let n = 0; n < N; n++) seed.push({ ph: Math.random(), sp: 0.5 + Math.random() * 0.6, dx: (Math.random() - 0.5) * 0.5, dz: (Math.random() - 0.5) * 0.5 });
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const sparks = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffa83a, size: 0.22, map: world.glowTex, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
  sparks.frustumCulled = false; T.add(sparks);
  const pl = new THREE.PointLight(0xff9a40, 0.35, 12); pl.position.set(0, 3.1, 0); T.add(pl);
  world.fires.push({ flames, glow, sparks, pos, seed, pl, ph: k * 1.7 });
}

function buildCastleWalls() {
  // low outer wall around the tower at distance 26, with a gate
  const st = new THREE.MeshLambertMaterial({ map: stoneTexture('#888', [10, 1]) });
  const R = 26, H = 7;
  const sides = [[0, -R, 0], [0, R, 0], [-R, 0, Math.PI / 2], [R, 0, Math.PI / 2]];
  const GATE = 6, SEG = (R - GATE) / 2;
  sides.forEach(([x, z, ry]) => {
    [-1, 1].forEach(sg => {
      const c = sg * (GATE + SEG);
      const w = BOX(SEG * 2, H, 2, st, x, H / 2, z); w.rotation.y = ry;
      w.position.set(x + (ry ? 0 : c), H / 2, z + (ry ? c : 0));
      for (let i = -SEG + 1; i <= SEG - 1; i += 2.4) {
        const b = BOX(1.3, 1.2, 2.2, M.stoneL, 0, 0, 0);
        b.rotation.y = ry;
        b.position.set(x + (ry ? 0 : c + i), H + 0.6, z + (ry ? c + i : 0));
      }
    });
    const arch = BOX(GATE * 2, 1.6, 2.2, M.stoneD, x, H - 0.8, z); arch.rotation.y = ry;
  });
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    CYL(3, 3.3, H + 4, st, sx * R, (H + 4) / 2, sz * R, scene, 16);
    mesh(new THREE.ConeGeometry(3.6, 4.5, 16), M.roof, sx * R, H + 4 + 2.2, sz * R);
  });
  // buildings inside the courtyard
  const rnd2 = seeded(11);
  for (let i = 0; i < 16; i++) {
    const a = rnd2() * Math.PI * 2, d = 12 + rnd2() * 8;
    const x = Math.cos(a) * d, z = Math.sin(a) * d;
    if (Math.abs(x) < 8 || Math.abs(z) < 8) continue;
    const w = 3 + rnd2() * 2, dd = 3 + rnd2() * 2, h = 2.5 + rnd2() * 1.5;
    BOX(w, h, dd, mat(0xd8c9a0), x, h / 2, z);
    const roof = mesh(new THREE.ConeGeometry(Math.max(w, dd) * 0.8, 2.2, 4), M.roof, x, h + 1.1, z);
    roof.rotation.y = Math.PI / 4;
  }
}

function buildForest() {
  const r = seeded(21);
  const pineG = new THREE.ConeGeometry(2, 5, 8), oakG = new THREE.SphereGeometry(2.4, 8, 6), trunkG = new THREE.CylinderGeometry(0.3, 0.4, 3, 6);
  for (let i = 0; i < 320; i++) {
    const a = r() * Math.PI * 2, d = 40 + r() * 170;
    const x = Math.cos(a) * d, z = Math.sin(a) * d;
    if (z > 108 && z < 132) continue;
    if (Math.abs(x) < 10 || Math.abs(z) < 10) continue;
    const s = 0.8 + r() * 1.1, t = new THREE.Group();
    t.position.set(x, 0, z);
    const tr = new THREE.Mesh(trunkG, M.trunk); tr.position.y = 1.5 * s; tr.scale.setScalar(s); tr.castShadow = true; t.add(tr);
    if (r() < 0.55) {
      for (let k = 0; k < 2; k++) { const c = new THREE.Mesh(pineG, M.leaf); c.position.y = (4 + k * 2) * s; c.scale.setScalar(s * (1 - k * .25)); c.castShadow = true; t.add(c); }
    } else {
      const c = new THREE.Mesh(oakG, M.leaf2); c.position.y = 4.6 * s; c.scale.setScalar(s); c.castShadow = true; t.add(c);
    }
    scene.add(t); world.trees.push(t);
  }
}

function buildHills() {
  const r = seeded(5);
  for (let i = 0; i < 22; i++) {
    const a = i / 22 * Math.PI * 2 + r() * .2, d = 280 + r() * 40, s = 40 + r() * 50;
    const h = mesh(new THREE.ConeGeometry(s, s * (0.8 + r() * .6), 6), mat(i % 3 ? 0x5a6a52 : 0x7a7a80), Math.cos(a) * d, s * .3, Math.sin(a) * d, scene, false);
  }
}

const clouds = [];
function buildClouds() {
  const m = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, fog: false });
  for (let i = 0; i < 16; i++) {
    const c = new THREE.Group();
    for (let k = 0; k < 5; k++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(rnd(6, 11), 8, 6), m);
      s.position.set(k * 7 - 14, rnd(-1, 2), rnd(-3, 3)); s.scale.y = .55; c.add(s);
    }
    c.position.set(rnd(-250, 250), rnd(85, 130), rnd(-250, 250));
    scene.add(c); clouds.push(c);
  }
}

function updateWorld(t, dt) {
  clouds.forEach(c => { c.position.x += dt * 2; if (c.position.x > 280) c.position.x = -280; });
  world.torches.forEach(o => { if (o.userData.flag) o.rotation.y = Math.sin(t * 3 + o.position.x) * 0.35; });
  world.fires.forEach(f => {
    const q = t + f.ph;
    f.flames.forEach((m, n) => {
      const w = Math.sin(q * (13 + n * 3)) * 0.5 + Math.sin(q * (7.3 + n * 2.1) + n) * 0.5;
      m.scale.y = 1 + w * 0.22; m.scale.x = m.scale.z = 1 - w * 0.08;
      m.rotation.z = Math.sin(q * (5 + n) + n) * 0.09; m.rotation.x = Math.cos(q * (4.4 + n) + n) * 0.09;
    });
    const fl = 0.5 + 0.5 * Math.sin(q * 17) * Math.sin(q * 5.3);
    f.glow.material.opacity = 0.7 + fl * 0.25; f.glow.scale.setScalar(2.4 + fl * 0.5);
    f.pl.intensity = 0.32 + fl * 0.08;
    for (let n = 0; n < f.seed.length; n++) {
      const s = f.seed[n], u = (q * s.sp * 0.6 + s.ph) % 1;
      f.pos[n * 3] = s.dx * u + Math.sin(q * 3 + n) * 0.06 * u; f.pos[n * 3 + 1] = 2.8 + u * 1.9; f.pos[n * 3 + 2] = s.dz * u;
    }
    f.sparks.geometry.attributes.position.needsUpdate = true;
  });
}

buildWorld();

// ---- rubble: bricks fall when the tower is close to collapse ----
const RUBBLE_FROM = 0.35;
const rubble = { list: [], shown: 0, acc: 0, smokeT: 0 };

function buildRubble() {
  const r = seeded(77), geo = new THREE.BoxGeometry(0.55, 0.26, 0.28);
  const mats = [M.stone, M.stoneD, M.stoneL, mat(0x9a8f80)], all = [];
  const add = (x, z, ground) => {
    const m = new THREE.Mesh(geo, mats[(r() * mats.length) | 0]);
    const s = 0.7 + r() * 0.9; m.scale.set(s, s * (0.8 + r() * 0.4), s);
    m.castShadow = m.receiveShadow = true; m.visible = false; scene.add(m);
    const tilt = r() < 0.25 ? (r() - 0.5) * 0.6 : 0;
    m.userData = { rx: x, rz: z, ry: r() * Math.PI * 2, tilt, ground, state: 0, vel: new THREE.Vector3(), spin: new THREE.Vector3(),
      restY: (ground ? 0 : TOWER_Y + 0.4) + 0.13 * m.scale.y + (tilt ? 0.08 : 0) };
    all.push(m);
  };
  for (let c = 0; c < 7; c++) {
    const cx = (r() - 0.5) * 9, cz = (r() - 0.5) * 9;
    for (let i = 0; i < 8; i++) add(Math.max(-5.6, Math.min(5.6, cx + (r() - 0.5) * 2.8)), Math.max(-5.6, Math.min(5.6, cz + (r() - 0.5) * 2.8)), false);
  }
  for (let c = 0; c < 8; c++) {
    let cx, cz; do { cx = (r() - 0.5) * 34; cz = (r() - 0.5) * 34; } while (Math.max(Math.abs(cx), Math.abs(cz)) < 10);
    for (let i = 0; i < 7; i++) {
      let x, z; do { x = cx + (r() - 0.5) * 3.2; z = cz + (r() - 0.5) * 3.2; } while (Math.max(Math.abs(x), Math.abs(z)) < 8.4);
      add(x, z, true);
    }
  }
  for (let i = all.length - 1; i > 0; i--) { const j = (r() * (i + 1)) | 0; [all[i], all[j]] = [all[j], all[i]]; }
  rubble.list = all;
}

function dropBrick(m) {
  const u = m.userData; u.state = 1; m.visible = true;
  u.spin.set(rnd(-7, 7), rnd(-7, 7), rnd(-7, 7));
  if (u.ground) {
    const k = 6.3 / Math.max(Math.abs(u.rx), Math.abs(u.rz)), T = 0.9 + Math.random() * 0.4;
    m.position.set(u.rx * k, TOWER_Y + 1.2, u.rz * k);
    u.vel.set((u.rx - m.position.x) / T, (u.restY - m.position.y) / T + 0.5 * 20 * T, (u.rz - m.position.z) / T);
  } else {
    m.position.set(u.rx, TOWER_Y + 9 + Math.random() * 5, u.rz); u.vel.set(0, 0, 0);
  }
}

function towerHit() {
  if (G.towerHp / G.maxTowerHp > RUBBLE_FROM) return;
  const a = Math.random() * Math.PI * 2, k = 6.4 / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
  fx.burst(new THREE.Vector3(Math.cos(a) * k, TOWER_Y + rnd(-3, 1), Math.sin(a) * k), 0x8c8c88, 8, 6, 0.8, 0.22, 16);
}

function updateRubble(dt) {
  if (G.paused || !rubble.list.length) return;
  const frac = G.towerHp / G.maxTowerHp, level = Math.max(0, Math.min(1, (RUBBLE_FROM - frac) / RUBBLE_FROM));
  const target = Math.ceil(level * rubble.list.length);
  if (rubble.shown < target) {
    rubble.acc += dt;
    while (rubble.acc > 0.07 && rubble.shown < target) { dropBrick(rubble.list[rubble.shown++]); rubble.acc -= 0.07; }
  } else {
    rubble.acc = 0;
    while (rubble.shown > target) { const m = rubble.list[--rubble.shown]; m.visible = false; m.userData.state = 0; }
  }
  for (let i = 0; i < rubble.shown; i++) {
    const m = rubble.list[i], u = m.userData;
    if (u.state !== 1) continue;
    u.vel.y -= 20 * dt; m.position.addScaledVector(u.vel, dt);
    m.rotation.x += u.spin.x * dt; m.rotation.y += u.spin.y * dt; m.rotation.z += u.spin.z * dt;
    if (m.position.y <= u.restY && u.vel.y < 0) {
      m.position.set(m.position.x, u.restY, m.position.z); m.rotation.set(u.tilt, u.ry, u.tilt * 0.5); u.state = 2;
      fx.burst(m.position.clone(), 0xa8a294, 4, 2.5, 0.6, 0.2, 4);
    }
  }
  if (level > 0.15) {
    rubble.smokeT -= dt;
    if (rubble.smokeT <= 0) {
      rubble.smokeT = 0.5 - level * 0.35;
      const a = Math.random() * Math.PI * 2, k = 6.4 / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
      fx.burst(new THREE.Vector3(Math.cos(a) * k, TOWER_Y - rnd(0, 7), Math.sin(a) * k), 0x4a4a4a, 1, 1.2, 2.4, 0.7, -2);
    }
  }
}
buildRubble();
