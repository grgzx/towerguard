// Easter eggs, part 2: E.T. on a flying bicycle, a Starlink train, a T. rex running in the distance. Engine in easter.js.

// ---- E.T. pedals a bicycle through the sky past a big moon, basket and glowing finger included ----
eggReg('et', () => {
  const g = new THREE.Group(), b = new THREE.Group(), ch = eggChord(105, 170), DUR = 15, H = 42;
  const brown = eggMat(0x7a5a3a), iron = eggMat(0x2a2e34), red = eggMat(0xb02a2a);
  const add = (geo, m, x, y, z, p) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); (p || b).add(o); return o; };
  const wheels = [-1.4, 1.4].map(z => { const w = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.07, 6, 16), iron); w.rotation.y = Math.PI / 2; w.position.set(0, 0.8, z); b.add(w); return w; });
  add(new THREE.BoxGeometry(0.1, 0.1, 2.0), red, 0, 1.5, 0);
  add(new THREE.BoxGeometry(0.1, 0.8, 0.1), red, 0, 1.2, -0.7);
  add(new THREE.BoxGeometry(0.7, 0.07, 0.07), iron, 0, 1.9, 1.35);
  add(new THREE.BoxGeometry(0.4, 0.3, 0.4), eggMat(0xd8c8a0), 0, 2.1, 1.55);
  add(new THREE.SphereGeometry(0.28, 8, 8), brown, 0, 1.85, -0.9);
  // E.T.: stubby body, big head with a long neck, long arm with a glowing fingertip
  const et = new THREE.Group(); et.position.set(0, 2.0, -0.7); b.add(et);
  add(new THREE.SphereGeometry(0.42, 8, 8), brown, 0, 0.3, 0, et);
  add(new THREE.CylinderGeometry(0.1, 0.14, 0.7, 6), brown, 0, 0.85, 0.1, et);
  add(new THREE.SphereGeometry(0.4, 8, 8), brown, 0, 1.35, 0.25, et);
  [-1, 1].forEach(s => add(new THREE.SphereGeometry(0.07, 6, 6), eggMat(0xfff4d0), s * 0.17, 1.42, 0.6, et));
  const arm = add(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 6), brown, 0.55, 0.9, 0.5, et); arm.rotation.z = -0.5; arm.rotation.x = -0.9;
  const tip = eggGlow(0xff6a5a, 1.6, 0.95); tip.position.set(0.78, 1.38, 0.95); et.add(tip);
  const moon = new THREE.Mesh(new THREE.CircleGeometry(30, 28), new THREE.MeshBasicMaterial({ color: 0xfff6d8, transparent: true, opacity: 0.9, fog: false, depthWrite: false }));
  const mx = (ch.x0 + ch.x1) / 2, mz = (ch.z0 + ch.z1) / 2, md = Math.hypot(mx, mz) + 55;
  moon.position.set(mx / Math.hypot(mx, mz) * md, H + 8, mz / Math.hypot(mx, mz) * md); moon.lookAt(0, H + 8, 0); g.add(moon);
  const halo = eggGlow(0xfff2c0, 90, 0.35); halo.position.copy(moon.position); halo.position.multiplyScalar(0.98); g.add(halo);
  b.scale.setScalar(3.4); g.add(b);
  const theme = [392, 440, 523, 659, 784, 988]; let tn = 0;
  return { group: g, update(dt, age) {
    const u = age / DUR;
    b.position.set(ch.x0 + (ch.x1 - ch.x0) * u, H + Math.sin(age * 1.6) * 1.8, ch.z0 + (ch.z1 - ch.z0) * u);
    b.rotation.set(0, ch.yaw, Math.sin(age * 1.3) * 0.08, 'YXZ');
    wheels.forEach(w => w.rotation.x = age * 4);
    tip.material.opacity = 0.6 + 0.35 * Math.sin(age * 6);
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
