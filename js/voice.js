// Voice engine: line queue, a separate voice per character, subtitles
function dirOf(p) { return Math.abs(p.x) > Math.abs(p.z) ? (p.x > 0 ? 'E' : 'W') : (p.z > 0 ? 'S' : 'N'); }

const VOICE = { on: true, pool: [], assigned: {}, queue: [], cur: null, token: 0, lastAt: {}, lastIdx: {}, holdUntil: 0, u: null, timer: null, subEl: null };
const hasTTS = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

const NOVELTY = /albert|bad news|bahh|bells|boing|bubbles|cellos|wobble|good news|jester|organ|superstar|trinoids|whisper|zarvox|fred|ralph|junior|kathy|hysterical|pipe|deranged|princess|bruce|agnes|vicki/i;
const GOOD_EN = /daniel|moira|karen|tessa|samantha|rishi|tara|aman|google uk|google us/i;
function pickVoices() {
  if (!hasTTS) return;
  const all = speechSynthesis.getVoices();
  let pl;
  if (LANG === 'en') {
    pl = all.filter(v => /^en/i.test(v.lang) && !NOVELTY.test(v.name));
    const gb = pl.filter(v => /^en[-_]GB/i.test(v.lang));
    if (gb.length >= 3) pl = gb.concat(pl.filter(v => !/^en[-_]GB/i.test(v.lang) && GOOD_EN.test(v.name)));
    if (!pl.length) pl = all.filter(v => /^en/i.test(v.lang));
    if (!pl.length) pl = all.slice(0, 1);
  } else {
    pl = all.filter(v => /^pl/i.test(v.lang));
    if (!pl.length) pl = all.filter(v => /^(sk|cs|ru|uk)/i.test(v.lang));
    if (!pl.length) pl = all.slice(0, 1);
  }
  const female = /zosia|ewa|agnieszka|maja|paulina|female|kobiet|google|samantha|victoria|karen|moira|tessa|fiona|kate|serena|susan|zira|hazel|flo|sandy|shelley|grandma|tara|libby|sonia|jenny|aria/i;
  const male = pl.filter(v => !female.test(v.name)), fem = pl.filter(v => female.test(v.name));
  VOICE.pool = pl; VOICE.assigned = {};
  let mi = 0, fi = 0;
  Object.keys(CREW).forEach(k => {
    const c = CREW[k], list = c.g === 'f' ? (fem.length ? fem : pl) : (male.length ? male : pl);
    if (!list.length) return;
    VOICE.assigned[k] = list[(c.g === 'f' ? fi++ : mi++) % list.length];
    if (LANG === 'en' && c.voiceEn) { const v = list.find(x => c.voiceEn.test(x.name)); if (v) VOICE.assigned[k] = v; }
  });
}
if (hasTTS) { pickVoices(); speechSynthesis.onvoiceschanged = pickVoices; }

function subtitle(who, text) {
  let el = VOICE.subEl;
  if (!el) { el = VOICE.subEl = document.createElement('div'); el.id = 'sub'; document.body.appendChild(el); }
  if (!who) { el.style.opacity = 0; return; }
  const c = CREW[who];
  el.innerHTML = '';
  const n = document.createElement('b'); n.textContent = crewName(who) + ': '; n.style.color = c.color;
  const t = document.createElement('span'); t.textContent = text;
  el.appendChild(n); el.appendChild(t); el.style.opacity = 1;
}

function resolveText(t, ctx) { return typeof t === 'function' ? t(ctx || {}) : t; }
function cleanText(t) { return t.replace(/[^\p{L}\p{N}\s.,!?:'-]/gu, ' ').replace(/\s+/g, ' ').trim(); }

function nextLine() {
  clearTimeout(VOICE.timer);
  if (!VOICE.queue.length) { VOICE.cur = null; subtitle(null); return; }
  const line = VOICE.queue.shift(), tok = ++VOICE.token;
  VOICE.cur = line;
  subtitle(line.who, line.text);
  const done = () => { if (VOICE.token === tok) { VOICE.timer = setTimeout(nextLine, 220); } };
  const fallbackMs = Math.max(1600, line.text.length * 62 + 700);
  if (VOICE.on && hasTTS) {
    const c = CREW[line.who], u = new SpeechSynthesisUtterance(cleanText(line.text));
    u.lang = LANG === 'en' ? 'en-GB' : 'pl-PL'; const v = VOICE.assigned[line.who]; if (v) { u.voice = v; u.lang = v.lang || u.lang; }
    if (LANG === 'en') { u.pitch = 0.92 + (Math.min(1.7, Math.max(0.3, c.pitch)) - 0.3) * 0.14; u.rate = Math.min(1.05, Math.max(0.92, c.rate)); }
    else { u.pitch = c.pitch; u.rate = c.rate; }
    u.volume = 1; VOICE.u = u;
    u.onend = done; u.onerror = done;
    VOICE.timer = setTimeout(done, fallbackMs * 2.2 + 3000);
    const go = () => { if (VOICE.token !== tok) return; try { speechSynthesis.resume(); } catch (e) {} speechSynthesis.speak(u); };
    const wait = VOICE.holdUntil - performance.now();
    if (wait > 0) setTimeout(go, wait); else go();
  } else {
    VOICE.timer = setTimeout(done, fallbackMs);
  }
}

function stopSpeech(clear) {
  VOICE.token++; clearTimeout(VOICE.timer);
  if (hasTTS) { speechSynthesis.cancel(); VOICE.holdUntil = performance.now() + 150; }
  if (clear) VOICE.queue.length = 0;
  VOICE.cur = null; subtitle(null);
}

// chance that the line is spoken at all (urgent warnings always are)
const CHANCE = { orkCall: 0.55, goblinCall: 0.5, thiefCall: 0.6, mageCall: 0.6, repair: 0.5, dmgUp: 0.45, manaUp: 0.45, heal: 0.5, noGold: 0.5, noMana: 0.5,
  mortarClose: 0.5, killMilestone: 0.8, mageDead: 0.5, firstKill: 0.8, voiceOn: 1 };

// prio: 0 = chatter (dropped while someone speaks), 1 = normal, 2 = urgent (interrupts)
function say(key, ctx, o) {
  o = o || {};
  const pool = LINES[LANG] && LINES[LANG][key]; if (!pool || !pool.length) return false;
  const prio = o.prio === undefined ? 1 : o.prio, cool = o.cool === undefined ? 4000 : o.cool, now = performance.now();
  if (VOICE.lastAt[key] && now - VOICE.lastAt[key] < cool) return false;
  const ch = o.chance !== undefined ? o.chance : (CHANCE[key] !== undefined ? CHANCE[key] : 1);
  if (prio < 2 && Math.random() > ch) return false;
  const busy = !!VOICE.cur || VOICE.queue.length > 0;
  if (prio === 0 && busy) return false;
  if (prio === 1 && VOICE.queue.length > 2) return false;
  let i = (Math.random() * pool.length) | 0;
  if (pool.length > 1 && i === VOICE.lastIdx[key]) i = (i + 1) % pool.length;
  VOICE.lastIdx[key] = i; VOICE.lastAt[key] = now;
  let entry = pool[i];
  if (typeof entry[0] === 'string') entry = [entry];
  const lines = entry.map(([who, text]) => ({ who, text: resolveText(text, ctx) }));
  if (prio === 2) stopSpeech(true);
  VOICE.queue.push(...lines);
  if (!VOICE.cur) nextLine();
  return true;
}

function toggleVoice() {
  VOICE.on = !VOICE.on;
  if (!VOICE.on) stopSpeech(true);
  return VOICE.on;
}
