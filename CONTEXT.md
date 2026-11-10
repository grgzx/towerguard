# Wieżostraż (Towerguard) – kontekst dla kolejnych sesji

Gra 3D tower defense w przeglądarce (Three.js r128, bez bundlera). Obrońca stoi na wieży, wrogowie idą z 4 stron.
Uruchomienie: otwórz `index.html` w przeglądarce. Brak git, brak buildu.

## Preferencje użytkownika (obowiązują zawsze)
- Rozmowa po polsku. Gra jest po polsku, od niedawna z wersją angielską.
- **Na końcu każdej odpowiedzi zaznaczaj na czerwono (🔴) błędy ortograficzne i interpunkcyjne w promptach użytkownika.**
- Klimat średniowieczny, humor w stylu Monty Python i Święty Graal. Dowcipy także z Księżniczki Narzeczonej, Władcy Pierścieni, Pratchetta, Wiedźmina i innych fantasy.
- Poprawna nazwa: **Święty Granat Ręczny** (rodzaj męski). Nigdy „Święta Granata".
- Gadanie ma być rzadkie. Kwestie przy zmianie broni tylko czasem (obecnie szansa 30%, minimum 35 s przerwy).
- Moździerz nie może ranić wieży ani gracza.
- Nie dodawać PointLight do pocisków ani staffów (prześwietlały scenę). Zostają 4 pochodnie.

## Struktura plików
| Plik | Zawartość |
|---|---|
| `index.html` | HUD, menu (z przyciskami języka), pauza, minimapa, kolejność skryptów |
| `style.css` | style HUD, minimapa, `#lowhp` (czerwona obwódka), `#sub` (napisy), `.langbtn` |
| `js/i18n.js` | `LANG`, `STR` (teksty UI pl/en), `t(key, ...)`, `applyLang()`, `setLang()`, `weaponName(i)`, `dirName(k)` |
| `js/crew_lines.js` | `CREW` (postacie: name, nameEn, pitch, rate, g), `LINES = {pl:{}, en:{}}`, `addLines(lang, obj)`, `WAVE_TITLES(_EN)`, `waveTitle`, `waveCtx`, `ordFem` |
| `js/lines_pl_a/b/c/d.js`, `js/lines_en_a/b/c/d.js` | kwestie PL i EN (a: zdarzenia Monty Python, b: broń + `chat`/`battle`, c: dodatkowi bohaterowie, d: nowi wrogowie i statusy). EN to osobne żarty, nie tłumaczenia |
| `js/voice.js` | silnik: `say(key, ctx, {prio, cool, chance})`, kolejka, napisy, `pickVoices`, `CHANCE` (szanse per klucz), `toggleVoice` |
| `js/world.js` | scena, wieża, las, drogi, `TOWER_Y=14`, `PLAT=5`, gruz (`rubble`, `towerHit`), pomocniki `mesh/BOX/CYL/mat/M/rnd` |
| `js/enemies.js` | `BUILDERS`, `TYPES`, klasa `Enemy` (ork, goblin, thief, mage; hooki `SPELLS`/`TICK`, flagi `isDragon`/`isMage`) |
| `js/enemy_dragons.js` | 3 smoki (ognisty/lodowy/jadowity), skrzydła kość+błona, `dragonUpdate` (obrót ku celowi, zionięcie) |
| `js/enemy_mages.js` | piromanta, mag lodu, burzomag (ostrzegawczy krąg), nekromanta (przywołuje gobliny), `SPELLS`, `TICK` |
| `js/enemy_units.js` | ork na wargu, szaman orków (wzmacnia), mroczny elf łucznik i czarownica |
| `js/helpers.js` | pomocnicy na wieży: Shift+1–9 kupuje strzelca z daną bronią (`buyHelper`, `HD` = koszt/cooldown/zasięg, `HFIRE` = strzał każdą z 9 broni, `updateHelpers`). Staje przy ścianie najbliższej graczowi, 4 miejsca na ścianę, max 16. Koszt rośnie o 40 za każdego |
| `js/lines_helpers.js` | kwestie `helperHire` PL/EN |
| `js/status.js` | statusy gracza: podpalenie, spowolnienie, trucizna, klątwa (`applyStatus`, `updateStatus`, `playerSpeedMul`) |
| `js/weapons.js` | `fx`, pociski, `enemyProjectile`, `WEAPONS` (9 sztuk), celowanie, `leadTarget` |
| `js/main.js` | pętla gry, sterowanie, fale (`planWave`, `spawnEnemy`), HUD, minimapa, dźwięk WebAudio |

Kolejność skryptów w `index.html`: three → i18n → crew_lines → lines_* → voice → world → enemies → enemy_dragons → enemy_mages → enemy_units → weapons → helpers → status → main.

Bodycount: `G.bodies[typ]` zwiększany w `Enemy.die()`; panel `#bodies` (lewy górny róg, `bodyHTML`/`updateBodies` w main.js) i lista `#overBodies` na ekranie końca gry; nazwy wrogów PL/EN w `ENEMY_NAMES` (i18n.js).

## Sterowanie
WASD chodzenie, mysz celowanie, LPM strzał, 1–9 broń/czar, R/T/Y naprawa/obrażenia/mana, P pauza, **M** głosy wł./wył., **L** zmiana języka (też w pauzie i w menu).

## Mechanika w skrócie
- Fale: `planWave(n)`, przerwa 9 s, premia `40 + 10n` złota. Smoki od fali 3 (nieparzyste).
- Czerwona obwódka przy życiu gracza < 40; cegły i dym, gdy wieża < 35% HP.
- Język: `LANG` zapisywany w `localStorage` (`td_lang`). `say()` bierze kwestie z `LINES[LANG]`. Głosy TTS wybiera `pickVoices()` zależnie od języka.

## STAN PRACY
Zrobione: angielskie kwestie, 3 smoki, mroczne elfy, 4 magów, orkowie na wargach, szaman, statusy gracza, fale, minimapa, naprawa R przy pełnym HP. Headless: 15 typów działa 90 s symulacji bez błędów JS, modele wszystkich typów widoczne na zrzutach, każdy typ ma `…Call` w PL i EN.
Do zrobienia / nieweryfikowane:
1. Zionięcie smoków i burzomag (krąg) tylko przetestowane logicznie, bez zrzutu w akcji. Warto zerknąć w grze.
2. Balans fal (nowe typy od fali 2–5) i fps przy dużej liczbie wrogów.
3. Paski cooldownu slotów 1–9, brzmienie prawdziwych głosów TTS, przełączanie języka w przeglądarce.
4. `ordFem` obsługuje fale 1–20; dalej głos czyta cyfry.

## Jak testować (bez prawdziwej przeglądarki)
Headless Chrome: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --enable-logging=stderr --virtual-time-budget=… --screenshot=PLIK.png --window-size=1280,720 file://…/test.html`.
- `test.html` = kopia `index.html` z dopisanym `<script src="test.js">` przed `</body>` (dodaj `window.addEventListener('load', …)`, wywołaj `startGame()`, steruj `loop(clock)` ręcznie, bo `requestAnimationFrame` prawie nie działa).
- `--screenshot=/dev/null` ucina logi; zawsze podawaj prawdziwy plik. Błędy JS wypisuj przez `console.log('JSERR …')`.
- Podmień `speechSynthesis` na atrapę, żeby sprawdzić, co by było powiedziane. Wynik wypisz do `<pre>` i użyj `--dump-dom`.
- Po testach usuń `test.js`, `test.html`, zrzuty. Narzędzie `read` czasem nie widzi PNG z /tmp — skopiuj do katalogu projektu.
