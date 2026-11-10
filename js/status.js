// Statusy gracza: podpalenie, spowolnienie, trucizna, klątwa (kradzież many)
const STATUS = { burn: 0, slow: 0, poison: 0, curse: 0, dps: 0, tick: 0 };
const STATUS_INFO = {
  burn: { icon: '🔥', color: '#ff6a2a' }, slow: { icon: '❄️', color: '#7fdcff' },
  poison: { icon: '☠️', color: '#9be03a' }, curse: { icon: '🌀', color: '#c070ff' },
};
const _stEl = document.createElement('div'); _stEl.id = 'status'; document.body.appendChild(_stEl);
const _tintEl = document.createElement('div'); _tintEl.id = 'tint'; document.body.appendChild(_tintEl);
const _said = {};

function applyStatus(kind, dur, dps) {
  if (!G.running || G.over) return;
  const fresh = STATUS[kind] <= 0;
  STATUS[kind] = Math.max(STATUS[kind], dur);
  if (dps) STATUS.dps = Math.max(STATUS.dps, dps);
  if (fresh) {
    const key = { burn: 'burning', slow: 'slowed', poison: 'poisoned', curse: 'cursed' }[kind];
    say(key, {}, { prio: 1, cool: 12000 });
  }
}
function clearStatus() { STATUS.burn = STATUS.slow = STATUS.poison = STATUS.curse = STATUS.dps = 0; }

function updateStatus(dt) {
  const P = G.player;
  for (const k of ['burn', 'slow', 'poison', 'curse']) if (STATUS[k] > 0) STATUS[k] = Math.max(0, STATUS[k] - dt);
  if (STATUS.burn <= 0 && STATUS.poison <= 0) STATUS.dps = 0;
  STATUS.tick -= dt;
  if (STATUS.tick <= 0) {
    STATUS.tick = 0.5;
    if (STATUS.burn > 0 || STATUS.poison > 0) {
      const d = (STATUS.burn > 0 ? 3 : 0) + (STATUS.poison > 0 ? 2 : 0);
      P.hp -= d * 0.5; flashEl.style.opacity = 0.5; setTimeout(() => flashEl.style.opacity = 0, 90);
      if (P.hp <= 0) endGame(false, true);
    }
    if (STATUS.curse > 0) G.mana = Math.max(0, G.mana - 3);
  }
  if (STATUS.burn > 0 && Math.random() < dt * 10) fx.burst(G.player.pos.clone().add(new THREE.Vector3(rnd(-0.4, 0.4), -0.5, rnd(-0.4, 0.4))), 0xff7a20, 1, 1.5, 0.4, 0.12, -2);
  let html = '', tint = '';
  for (const k in STATUS_INFO) if (STATUS[k] > 0) html += `<span style="border-color:${STATUS_INFO[k].color}">${STATUS_INFO[k].icon}<i>${STATUS[k].toFixed(0)}</i></span>`;
  if (_stEl._h !== html) { _stEl.innerHTML = html; _stEl._h = html; }
  if (STATUS.burn > 0) tint = 'rgba(255,90,20,.22)'; else if (STATUS.slow > 0) tint = 'rgba(110,200,255,.24)';
  else if (STATUS.poison > 0) tint = 'rgba(120,220,40,.2)'; else if (STATUS.curse > 0) tint = 'rgba(170,80,255,.2)';
  _tintEl.style.background = tint ? `radial-gradient(transparent 35%, ${tint})` : 'none';
  _tintEl.style.opacity = tint ? 1 : 0;
}
function playerSpeedMul() { return STATUS.slow > 0 ? 0.45 : 1; }
