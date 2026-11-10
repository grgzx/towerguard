window.addEventListener('error', e => console.log('JSERR ' + e.message));
window.addEventListener('load', () => {
  const res = [];
  startGame(); G.gold = 99999; G.breakT = 999; G.player.hp = 1e6; G.towerHp = G.maxTowerHp = 1e7;
  renderer.render = () => {}; window.requestAnimationFrame = () => 0;
  try {
    G.player.pos.set(4, TOWER_Y + 2, 0); G.player.hp=1e6; buyHelper(0); buyHelper(0);
    const [a, b] = helpers;
    res.push('hp0=' + a.hp + ' barVisible=' + a.bar.visible);
    hurtHelper(a, 30);
    let clock = performance.now() + 100;
    for (let i = 0; i < 5; i++) { clock += 50; loop(clock); }
    res.push('after hit hp=' + a.hp + ' barVisible=' + a.bar.visible + ' fgScale=' + a.bar.userData.fg.scale.x.toFixed(2));
    hurtHelpersIn(new THREE.Vector3(a.pos.x, 0, a.pos.z), 2, 20);
    res.push('after storm hp=' + a.hp + ' b=' + b.hp);
    healHelpers(50); res.push('after heal hp=' + a.hp);
    const sh = a.pos.clone().add(new THREE.Vector3(12, 6, 0));
    enemyProjectile(sh, a.pos.clone().add(new THREE.Vector3(0, 0.5, 0)), 10, 0xff0000, 'tower', 40, 0.3);
    res.push('shots before='+enemyShots.length+' a.pos='+a.pos.toArray().map(v=>v.toFixed(1))+' sh='+sh.toArray().map(v=>v.toFixed(1))); for (let i = 0; i < 30; i++) { clock += 50; loop(clock); if (i<6) res.push(i+': shots='+enemyShots.length+(enemyShots[0]?' p='+enemyShots[0].pos.toArray().map(v=>v.toFixed(1)):'')+' hp='+a.hp); }
    res.push('after shot hp=' + a.hp);
    hurtHelper(a, 1e4);
    res.push('dead: count=' + helpers.length + ' inScene=' + scene.children.includes(a.bar));
    for (let i = 0; i < 10; i++) { clock += 50; loop(clock); }
    res.push('hp b after loop=' + b.hp);
  } catch (e) { res.push('ERR ' + e.stack.split('\n').slice(0, 4).join('|')); }
  const out = document.createElement('pre'); out.id = 'out'; out.textContent = res.join('\n'); document.body.appendChild(out);
});
