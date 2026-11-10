// Ekipa obrońców i wspólne dane do kwestii (parodie "Monty Python i Święty Graal")
// Wpis w puli = jedna kwestia ['kto', 'tekst'] albo dialog [['kto','tekst'], ['kto','tekst']].
// Tekst może być funkcją (c) => string; c: n (fala), d (strona świata), g (złoto), p (premia), k (liczba zabitych)

const CREW = {
  artur:    { name: 'Król Artur', nameEn: 'King Arthur',          color: '#ffd76a', pitch: 0.55, rate: 0.92, g: 'm', coco: true },
  lancelot: { name: 'Sir Lancelot', nameEn: 'Sir Lancelot',        color: '#ff8a6a', pitch: 0.85, rate: 1.30, g: 'm' },
  robin:    { name: 'Sir Robin Mężny-Inaczej', nameEn: 'Sir Robin the Brave-ish', color: '#9fd0ff', pitch: 1.50, rate: 1.20, g: 'm' },
  galahad:  { name: 'Sir Galahad Czysty', nameEn: 'Sir Galahad the Pure',  color: '#e8e8ff', pitch: 1.15, rate: 1.00, g: 'm' },
  patsy:    { name: 'Giermek Patsy', nameEn: 'Patsy the Squire',       color: '#d9b982', pitch: 1.70, rate: 1.15, g: 'f', coco: true },
  czarny:   { name: 'Czarny Rycerz', nameEn: 'The Black Knight',       color: '#b8b8c0', pitch: 0.20, rate: 0.80, g: 'm' },
  tim:      { name: 'Tim Zaklinacz', nameEn: 'Tim the Enchanter',       color: '#c58aff', pitch: 0.95, rate: 1.15, g: 'm' },
  maynard:  { name: 'Brat Maynard', nameEn: 'Brother Maynard',        color: '#a8e08a', pitch: 0.65, rate: 0.78, g: 'm' },
  dennis:   { name: 'Wieśniak Dennis', nameEn: 'Dennis the Peasant',     color: '#e8a8a8', pitch: 1.30, rate: 1.20, g: 'f' },
  inigo:    { name: 'Inigo Montoya', nameEn: 'Inigo Montoya', color: '#ff9f5a', pitch: 0.80, rate: 1.10, g: 'm' },
  vizzini:  { name: 'Vizzini', nameEn: 'Vizzini', color: '#f2e27a', pitch: 1.65, rate: 1.30, g: 'm' },
  gandalf:  { name: 'Gandalf Szary', nameEn: 'Gandalf the Grey', color: '#cfd8e8', pitch: 0.50, rate: 0.85, g: 'm' },
  sam:      { name: 'Sam Gamgee', nameEn: 'Samwise', color: '#b5e07a', pitch: 1.05, rate: 1.00, g: 'm' },
  gimli:    { name: 'Gimli', nameEn: 'Gimli', color: '#e0a060', pitch: 0.35, rate: 1.05, g: 'm' },
  rincewind:{ name: 'Rincewind', nameEn: 'Rincewind', color: '#ffb0d0', pitch: 1.40, rate: 1.35, g: 'm' },
  smierc:   { name: 'ŚMIERĆ', nameEn: 'DEATH', color: '#e8e8e8', pitch: 0.10, rate: 0.70, g: 'm' },
  geralt:   { name: 'Geralt', nameEn: 'Geralt', color: '#d8d0b0', pitch: 0.40, rate: 0.80, g: 'm' },
  legolas:  { name: 'Legolas', nameEn: 'Legolas', color: '#a0e8d0', pitch: 1.25, rate: 1.05, g: 'm' },
  ork:      { name: 'Ork', nameEn: 'Orc',                 color: '#7bd13a', pitch: 0.10, rate: 0.85, g: 'm', enemy: true },
  goblin:   { name: 'Goblin', nameEn: 'Goblin',              color: '#c6f06a', pitch: 2.00, rate: 1.40, g: 'f', enemy: true },
};

const ORD = ['', 'pierwsza', 'druga', 'trzecia', 'czwarta', 'piąta', 'szósta', 'siódma', 'ósma', 'dziewiąta', 'dziesiąta',
  'jedenasta', 'dwunasta', 'trzynasta', 'czternasta', 'piętnasta', 'szesnasta', 'siedemnasta', 'osiemnasta', 'dziewiętnasta', 'dwudziesta'];
function ordFem(n, gen) {
  const w = ORD[n]; if (!w) return String(n);
  return gen ? w.replace(/ia$/, 'iej').replace(/a$/, 'ej') : w;
}

const WAVE_TITLES = [
  'Tylko draśnięcie', 'Rycerze, którzy mówią Ni!', 'Uciekać! Uciekać!', 'Królik z jaskini Caerbannog',
  'Wyprowadźcie swoich zmarłych', 'Zamek Anthrax', 'Jaskółka bez ładunku', 'Święty Granat Ręczny z Antiochii',
  'Most Śmierci', 'Twoja matka była chomikiem',
];


const WAVE_TITLES_EN = [
  'Just a Flesh Wound', 'The Knights Who Say Ni!', 'Run Away! Run Away!', 'The Rabbit of Caerbannog',
  'Bring Out Your Dead', 'Castle Anthrax', 'Unladen Swallow', 'The Holy Hand Grenade of Antioch',
  'The Bridge of Death', 'Your Mother Was a Hamster',
];
const NUM_EN = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
  'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

function waveTitle(n) { const a = LANG === 'en' ? WAVE_TITLES_EN : WAVE_TITLES; return a[(n - 1) % a.length]; }
function waveCtx(n) {
  if (LANG === 'en') { const w = NUM_EN[n] || String(n); return { n, o: w, og: w }; }
  return { n, o: ordFem(n), og: ordFem(n, true) };
}

const LINES = { pl: {}, en: {} };
function addLines(lang, obj) {
  for (const k in obj) LINES[lang][k] = (LINES[lang][k] || []).concat(obj[k]);
}

function crewName(k) { const c = CREW[k]; return LANG === 'en' ? c.nameEn : c.name; }
