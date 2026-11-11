// Interface and message language: PL / EN
const VERSION = '0.8.0'; // keep in sync with CHANGELOG.md
const IS_TOUCH = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
let LANG = (function () {
  try { const s = localStorage.getItem('td_lang'); if (s === 'pl' || s === 'en') return s; } catch (e) {}
  return 'pl';
})();

const STR = {
  pl: {
    docTitle: 'Wieżostraż - Towerguard',
    wTower: 'Wieża', wLife: 'Życie', wMana: 'Mana', wWave: 'Fala:', wGold: 'Złoto:', wScore: 'Wynik:',
    help: '<b>M</b> głosy wł./wył. &nbsp; <b>L</b> język &nbsp; <b>R</b> napraw wieżę (<span id="cRepair"></span>) &nbsp; <b>T</b> +życie (<span id="cHp"></span>) &nbsp; <b>Y</b> +mana (<span id="cMana"></span>) &nbsp; <b>Shift+1–9</b> pomocnik',
    legend: '<span style="color:#7bd13a">● Ork</span> <span style="color:#c6f06a">● Goblin</span> <span style="color:#ffd24a">● Złodziej</span> <span style="color:#c070ff">● Mag</span> <span style="color:#ff4a2a">▲ Smok</span> <span style="color:#7fe8ff">▲ Lodowy</span> <span style="color:#b6ff2a">▲ Jadowity</span> <span style="color:#a07a40">● Warg</span> <span style="color:#6a8aff">● Elf</span>',
    menuTitle: '⚔ Wieżostraż ⚔',
    menuSub: 'Ostatnia twierdza królestwa. Orkowie, gobliny, złodzieje, smoki i mroczni magowie idą na twoją wieżę.',
    lang: 'Język', langSet: 'Język: polski',
    g1: '<b>W A S D</b><br>chodzenie po wieży', g2: '<b>Mysz</b><br>celowanie', g3: '<b>LPM</b><br>strzał / czar',
    g4: '<b>1 – 9</b><br>wybór broni i czarów', g5: '<b>R / T / Y</b><br>naprawa / ulepszenia<br><b>Shift + 1–9</b> pomocnik z bronią', g6: '<b>P / Esc</b><br>pauza',
    g7: '<b>M</b><br>głosy obrońców wł./wył.',
    w1: 'Łuk długi', w2: 'Kusza', w3: 'Moździerz (obszarowy, nie trafia w cele blisko wieży)', w4: 'Kula ognia', w5: 'Błyskawica łańcuchowa',
    w6: 'Lodowy pocisk (spowalnia)', w7: 'Balista (przebija wrogów)', w8: 'Deszcz meteorów', w9: 'Święte uzdrowienie',
    n1: 'Łuk', n2: 'Kusza', n3: 'Moździerz', n4: 'Kula ognia', n5: 'Błyskawica', n6: 'Lód', n7: 'Balista', n8: 'Meteory', n9: 'Uzdrowienie',
    start: 'Kliknij, aby zacząć obronę', pauseTitle: 'Pauza', resume: 'Wznów', restart: 'Spróbuj ponownie',
    voiceOn: 'Głosy włączone', voiceOff: 'Głosy wyłączone', noGold: 'Za mało złota', noMana: 'Za mało many',
    bodyTitle: 'Licznik wrogów', bodyNone: 'jeszcze nikogo',
    repaired: 'Wieża naprawiona', towerFull: 'Wieża jest cała – naprawa niepotrzebna', helperFull: 'Na murach nie ma już miejsca dla pomocników', helperDied: w => `Pomocnik poległ: ${w}`, helperBought: w => `Pomocnik zatrudniony: ${w}`, hpUp: 'Więcej życia', manaUp: 'Więcej many',
    bannerStart: 'Bronisz wieży!',
    overPlayer: 'Obrońca poległ', overTower: 'Wieża padła',
    overText: (w, k, s) => `Dotarłeś do fali ${w}. Pokonani wrogowie: ${k}. Wynik: ${s}.`,
    waveBanner: (n, t) => `Fala ${n}: ${t}`,
    waveClear: (n, p) => `Fala ${n} odparta! Premia ${p} złota. Użyj R/T/Y.`,
    warnHp: 'Jesteś ciężko ranny! Użyj uzdrowienia (9)', warnTower: 'Wieża chwieje się w posadach! Naprawiaj mury (R)!',
    escaped: g => `Złodziej uciekł z ${g} złota!`, stolen: g => `Złodziej ukradł ${g} złota! Zastrzel go!`,
    mortarClose: 'Moździerz: cel za blisko wieży – pocisk poleciał dalej', healed: 'Wieża i obrońca uleczeni',
    dirs: { N: 'północy', E: 'wschodu', S: 'południa', W: 'zachodu' },
    assistOn: 'Pomoc w celowaniu: WŁ.', assistOff: 'Pomoc w celowaniu: WYŁ.',
    touch_start: 'Dotknij, aby zacząć obronę',
    touch_g1: '<b>Lewy kciuk</b><br>góra/dół: chód, lewo/prawo: obrót', touch_g2: '<b>Prawy kciuk</b><br>przeciągnij, by się rozglądać (pomoc w celowaniu włączona)',
    touch_g3: '<b>Duży przycisk</b><br>strzał / czar (przytrzymaj = ogień ciągły)', touch_g4: '<b>Ikony na dole</b><br>dotknij: wybór broni<br><b>przytrzymaj</b>: kup pomocnika',
    touch_g5: '<b>🔧 ⚔ 🔮</b><br>naprawa / ulepszenia', touch_g6: '<b>⏸</b><br>pauza', touch_g7: '<b>🔊 🌐</b><br>głosy wł./wył. i język',
    touch_waveClear: (n, p) => `Fala ${n} odparta! Premia ${p} złota. Czas na 🔧 ⚔ 🔮.`,
    touch_warnHp: 'Jesteś ciężko ranny! Użyj uzdrowienia (✨)', touch_warnTower: 'Wieża chwieje się w posadach! Naprawiaj mury (🔧)!',
    rotTitle: 'Obróć telefon poziomo', rotLead: 'Wieżostraż gra się tylko w poziomie. Gra zostanie wstrzymana, dopóki nie obrócisz telefonu.',
    rotAndroid: '<b>Android</b><ol><li>Przesuń palcem w dół od góry ekranu i włącz „Autoobracanie” (Auto-rotate).</li><li>Obróć telefon bokiem.</li><li>Po dotknięciu „Dotknij, aby zacząć” gra spróbuje przejść na pełny ekran i zablokować widok poziomy.</li></ol>',
    rotIos: '<b>iPhone</b><ol><li>Otwórz Centrum sterowania: przesuń palcem w dół od prawego górnego rogu ekranu (w iPhone’ach z przyciskiem Home: w górę od dołu).</li><li>Wyłącz „Blokadę orientacji pionowej” (ikona kłódki ze strzałką).</li><li>Obróć telefon bokiem.</li></ol><small>Pełny ekran bez paska Safari: Udostępnij → „Dodaj do ekranu początkowego”, potem uruchom grę z ikony.</small>',
  },
  en: {
    docTitle: 'Wieżostraż - Towerguard',
    wTower: 'Tower', wLife: 'Health', wMana: 'Mana', wWave: 'Wave:', wGold: 'Gold:', wScore: 'Score:',
    help: '<b>M</b> voices on/off &nbsp; <b>L</b> language &nbsp; <b>R</b> repair tower (<span id="cRepair"></span>) &nbsp; <b>T</b> +life (<span id="cHp"></span>) &nbsp; <b>Y</b> +mana (<span id="cMana"></span>) &nbsp; <b>Shift+1–9</b> hire helper',
    legend: '<span style="color:#7bd13a">● Orc</span> <span style="color:#c6f06a">● Goblin</span> <span style="color:#ffd24a">● Thief</span> <span style="color:#c070ff">● Mage</span> <span style="color:#ff4a2a">▲ Dragon</span> <span style="color:#7fe8ff">▲ Frost</span> <span style="color:#b6ff2a">▲ Venom</span> <span style="color:#a07a40">● Warg</span> <span style="color:#6a8aff">● Elf</span>',
    menuTitle: '⚔ Towerguard ⚔',
    menuSub: 'The last fortress of the realm. Orcs, goblins, thieves, dragons and dark mages march on your tower.',
    lang: 'Language', langSet: 'Language: English',
    g1: '<b>W A S D</b><br>walk on the tower', g2: '<b>Mouse</b><br>aim', g3: '<b>LMB</b><br>shoot / cast',
    g4: '<b>1 – 9</b><br>pick weapon or spell', g5: '<b>R / T / Y</b><br>repair / upgrades<br><b>Shift + 1–9</b> hire a helper', g6: '<b>P / Esc</b><br>pause',
    g7: '<b>M</b><br>defender voices on/off',
    w1: 'Longbow', w2: 'Crossbow', w3: 'Mortar (area damage, cannot hit targets close to the tower)', w4: 'Fireball', w5: 'Chain lightning',
    w6: 'Frost bolt (slows)', w7: 'Ballista (pierces enemies)', w8: 'Meteor shower', w9: 'Holy healing',
    n1: 'Bow', n2: 'Crossbow', n3: 'Mortar', n4: 'Fireball', n5: 'Lightning', n6: 'Frost', n7: 'Ballista', n8: 'Meteors', n9: 'Healing',
    start: 'Click to begin the defence', pauseTitle: 'Paused', resume: 'Resume', restart: 'Try again',
    voiceOn: 'Voices on', voiceOff: 'Voices off', noGold: 'Not enough gold', noMana: 'Not enough mana',
    bodyTitle: 'Enemy tally', bodyNone: 'nobody yet',
    repaired: 'Tower repaired', towerFull: 'The tower is undamaged – no repair needed', helperFull: 'No more room on the walls for helpers', helperDied: w => `Helper fell: ${w}`, helperBought: w => `Helper hired: ${w}`, hpUp: 'More life', manaUp: 'More mana',
    bannerStart: 'Defend the tower!',
    overPlayer: 'The defender has fallen', overTower: 'The tower has fallen',
    overText: (w, k, s) => `You reached wave ${w}. Enemies defeated: ${k}. Score: ${s}.`,
    waveBanner: (n, t) => `Wave ${n}: ${t}`,
    waveClear: (n, p) => `Wave ${n} repelled! Bonus ${p} gold. Use R/T/Y.`,
    warnHp: 'You are badly wounded! Cast healing (9)', warnTower: 'The tower is crumbling! Repair the walls (R)!',
    escaped: g => `The thief escaped with ${g} gold!`, stolen: g => `A thief stole ${g} gold! Shoot him!`,
    mortarClose: 'Mortar: target too close to the tower – the shell flew past', healed: 'Tower and defender healed',
    dirs: { N: 'north', E: 'east', S: 'south', W: 'west' },
    assistOn: 'Aim assist: ON', assistOff: 'Aim assist: OFF',
    touch_start: 'Tap to begin the defence',
    touch_g1: '<b>Left thumb</b><br>up/down: walk, left/right: turn', touch_g2: '<b>Right thumb</b><br>drag to look around (aim assist is on)',
    touch_g3: '<b>Big button</b><br>shoot / cast (hold = keep firing)', touch_g4: '<b>Icons at the bottom</b><br>tap: pick weapon<br><b>hold</b>: hire a helper',
    touch_g5: '<b>🔧 ⚔ 🔮</b><br>repair / upgrades', touch_g6: '<b>⏸</b><br>pause', touch_g7: '<b>🔊 🌐</b><br>voices on/off and language',
    touch_waveClear: (n, p) => `Wave ${n} repelled! Bonus ${p} gold. Time for 🔧 ⚔ 🔮.`,
    touch_warnHp: 'You are badly wounded! Cast healing (✨)', touch_warnTower: 'The tower is crumbling! Repair the walls (🔧)!',
    rotTitle: 'Turn your phone sideways', rotLead: 'Towerguard is played in landscape only. The game stays paused until you rotate your phone.',
    rotAndroid: '<b>Android</b><ol><li>Swipe down from the top of the screen and turn on “Auto-rotate”.</li><li>Turn the phone on its side.</li><li>After you tap “Tap to begin”, the game will try to go fullscreen and lock landscape.</li></ol>',
    rotIos: '<b>iPhone</b><ol><li>Open Control Center: swipe down from the top-right corner (on iPhones with a Home button: swipe up from the bottom).</li><li>Turn off “Portrait Orientation Lock” (the padlock with an arrow).</li><li>Turn the phone on its side.</li></ol><small>Fullscreen without the Safari bar: Share → “Add to Home Screen”, then launch the game from the icon.</small>',
  },
};

function t(key, ...a) {
  let v;
  if (IS_TOUCH) { v = STR[LANG] && STR[LANG]['touch_' + key]; if (v === undefined) v = STR.pl['touch_' + key]; }
  if (v === undefined) v = (STR[LANG] && STR[LANG][key]);
  if (v === undefined) v = STR.pl[key];
  return typeof v === 'function' ? v(...a) : v;
}
const ENEMY_NAMES = {
  pl: { ork: 'Ork', goblin: 'Goblin', thief: 'Złodziej', mage: 'Zły mag', dragon: 'Smok ognisty', icedragon: 'Smok lodowy', poisondragon: 'Smok jadowity',
    warg: 'Ork na wargu', shaman: 'Szaman orków', elfarcher: 'Mroczny elf', elfwitch: 'Mroczna elfka', pyro: 'Piromanta', frost: 'Mag lodu', storm: 'Burzomag', necro: 'Nekromanta' },
  en: { ork: 'Orc', goblin: 'Goblin', thief: 'Thief', mage: 'Dark Mage', dragon: 'Fire Dragon', icedragon: 'Ice Dragon', poisondragon: 'Venom Dragon',
    warg: 'Warg Rider', shaman: 'Orc Shaman', elfarcher: 'Dark Elf Archer', elfwitch: 'Dark Elf Witch', pyro: 'Pyromancer', frost: 'Frost Mage', storm: 'Storm Mage', necro: 'Necromancer' },
};
function enemyName(type) { return (ENEMY_NAMES[LANG] && ENEMY_NAMES[LANG][type]) || type; }
function dirName(k) { return STR[LANG].dirs[k]; }
function weaponName(i) { return t('n' + (i + 1)); }

const I18N_MAP = [
  ['#lblTower', 'wTower'], ['#lblLife', 'wLife'], ['#lblMana', 'wMana'], ['#lblWave', 'wWave'], ['#lblGold', 'wGold'], ['#lblScore', 'wScore'],
  ['#help', 'help'], ['#legend', 'legend'], ['#menuTitle', 'menuTitle'], ['#menuSub', 'menuSub'],
  ['#start', 'start'], ['#pauseTitle', 'pauseTitle'], ['#resume', 'resume'], ['#restart', 'restart'],
  ['#rotTitle', 'rotTitle'], ['#rotLead', 'rotLead'], ['#rotAndroid', 'rotAndroid'], ['#rotIos', 'rotIos'],
];
for (let i = 1; i <= 7; i++) I18N_MAP.push(['#g' + i, 'g' + i]);
for (let i = 1; i <= 9; i++) I18N_MAP.push(['#w' + i, 'w' + i]);

function applyLang() {
  document.documentElement.lang = LANG; document.title = t('docTitle');
  for (const [sel, key] of I18N_MAP) { const el = document.querySelector(sel); if (el) el.innerHTML = t(key); }
  if (window.updAssist) updAssist();
  const ver = document.getElementById('ver'); if (ver) ver.textContent = 'v' + VERSION;
  document.querySelectorAll('.langLbl').forEach(e => e.textContent = t('lang'));
  document.querySelectorAll('.langbtn').forEach(b => b.classList.toggle('on', b.dataset.lang === LANG));
  document.querySelectorAll('#hotbar .nm').forEach((e, i) => e.textContent = weaponName(i));
  if (typeof pickVoices === 'function') pickVoices();
}
function setLang(l) {
  LANG = l; try { localStorage.setItem('td_lang', l); } catch (e) {}
  if (typeof stopSpeech === 'function') stopSpeech(true);
  applyLang();
}
