// Interface and message language: PL / EN
let LANG = (function () {
  try { const s = localStorage.getItem('td_lang'); if (s === 'pl' || s === 'en') return s; } catch (e) {}
  return 'pl';
})();

const STR = {
  pl: {
    docTitle: 'Wieżostraż - Towerguard',
    wTower: 'Wieża', wLife: 'Życie', wMana: 'Mana', wWave: 'Fala:', wGold: 'Złoto:', wScore: 'Wynik:',
    help: '<b>M</b> głosy wł./wył. &nbsp; <b>L</b> język &nbsp; <b>R</b> napraw wieżę (<span id="cRepair"></span>) &nbsp; <b>T</b> +obrażenia (<span id="cDmg"></span>) &nbsp; <b>Y</b> +mana (<span id="cMana"></span>) &nbsp; <b>Shift+1–9</b> pomocnik',
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
    repaired: 'Wieża naprawiona', towerFull: 'Wieża jest cała – naprawa niepotrzebna', helperFull: 'Na murach nie ma już miejsca dla pomocników', helperDied: w => `Pomocnik poległ: ${w}`, helperBought: w => `Pomocnik zatrudniony: ${w}`, dmgUp: 'Obrażenia +15%', manaUp: 'Więcej many',
    bannerStart: 'Bronisz wieży!',
    overPlayer: 'Obrońca poległ', overTower: 'Wieża padła',
    overText: (w, k, s) => `Dotarłeś do fali ${w}. Pokonani wrogowie: ${k}. Wynik: ${s}.`,
    waveBanner: (n, t) => `Fala ${n}: ${t}`,
    waveClear: (n, p) => `Fala ${n} odparta! Premia ${p} złota. Użyj R/T/Y.`,
    warnHp: 'Jesteś ciężko ranny! Użyj uzdrowienia (9)', warnTower: 'Wieża chwieje się w posadach! Naprawiaj mury (R)!',
    escaped: g => `Złodziej uciekł z ${g} złota!`, stolen: g => `Złodziej ukradł ${g} złota! Zastrzel go!`,
    mortarClose: 'Moździerz: cel za blisko wieży – pocisk poleciał dalej', healed: 'Wieża i obrońca uleczeni',
    dirs: { N: 'północy', E: 'wschodu', S: 'południa', W: 'zachodu' },
  },
  en: {
    docTitle: 'Wieżostraż - Towerguard',
    wTower: 'Tower', wLife: 'Health', wMana: 'Mana', wWave: 'Wave:', wGold: 'Gold:', wScore: 'Score:',
    help: '<b>M</b> voices on/off &nbsp; <b>L</b> language &nbsp; <b>R</b> repair tower (<span id="cRepair"></span>) &nbsp; <b>T</b> +damage (<span id="cDmg"></span>) &nbsp; <b>Y</b> +mana (<span id="cMana"></span>) &nbsp; <b>Shift+1–9</b> hire helper',
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
    bodyTitle: 'Bodycount', bodyNone: 'nobody yet',
    repaired: 'Tower repaired', towerFull: 'The tower is undamaged – no repair needed', helperFull: 'No more room on the walls for helpers', helperDied: w => `Helper fell: ${w}`, helperBought: w => `Helper hired: ${w}`, dmgUp: 'Damage +15%', manaUp: 'More mana',
    bannerStart: 'Defend the tower!',
    overPlayer: 'The defender has fallen', overTower: 'The tower has fallen',
    overText: (w, k, s) => `You reached wave ${w}. Enemies slain: ${k}. Score: ${s}.`,
    waveBanner: (n, t) => `Wave ${n}: ${t}`,
    waveClear: (n, p) => `Wave ${n} repelled! Bonus ${p} gold. Use R/T/Y.`,
    warnHp: 'You are badly wounded! Cast healing (9)', warnTower: 'The tower is crumbling! Repair the walls (R)!',
    escaped: g => `The thief escaped with ${g} gold!`, stolen: g => `A thief stole ${g} gold! Shoot him!`,
    mortarClose: 'Mortar: target too close to the tower – the shell flew past', healed: 'Tower and defender healed',
    dirs: { N: 'north', E: 'east', S: 'south', W: 'west' },
  },
};

function t(key, ...a) {
  let v = (STR[LANG] && STR[LANG][key]); if (v === undefined) v = STR.pl[key];
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
];
for (let i = 1; i <= 7; i++) I18N_MAP.push(['#g' + i, 'g' + i]);
for (let i = 1; i <= 9; i++) I18N_MAP.push(['#w' + i, 'w' + i]);

function applyLang() {
  document.documentElement.lang = LANG; document.title = t('docTitle');
  for (const [sel, key] of I18N_MAP) { const el = document.querySelector(sel); if (el) el.innerHTML = t(key); }
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
