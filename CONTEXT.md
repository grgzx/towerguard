# Wieżostraż (Towerguard) – context for later sessions

A 3D tower defense game in the browser (Three.js r128, no bundler, no build). The defender stands on a tower, enemies come from 4 sides.
Run: open `index.html` in a browser. Live: https://grgzx.github.io/towerguard/ (GitHub Pages from `main`).

## User preferences (always apply)
- Talk to the user in Polish. **At the end of every reply, mark in red (🔴) spelling and punctuation errors in the user's prompts** (say "no errors" if there are none).
- The code, comments and docs are in English. Only in-game text is localized (PL default, EN), via `js/i18n.js` and the `js/lines_*.js` files.
- Medieval climate, Monty Python and the Holy Grail humour, plus Princess Bride, Lord of the Rings, Pratchett and other fantasy. EN lines are original jokes, not translations. Do not use ALL-CAPS in spoken lines (TTS spells them out). Geralt and Death were removed on purpose (not funny / read badly).
- The Polish name is **Święty Granat Ręczny** (masculine).
- Defender chatter must be rare (weapon-switch lines 30% chance, at least 35 s gap).
- The mortar must not hurt the tower or the player.
- No PointLights on projectiles or staffs (they overexpose the scene). Only the 4 torches.
- Torches (`buildTorch` in `world.js`): standing on the platform floor against the wall, offset from the middle of each side (pinwheel layout, 3 units from centre). Pole with iron bands, cup, wrapped head, three layered flame cones, additive glow sprite, rising sparks and a flickering PointLight. Animated through `world.fires` in `updateWorld`.
- Difficulty stays at the original level (a 10% reduction was reverted).

## Files
| File | Contents |
|---|---|
| `index.html` | HUD, menu (with language buttons), pause, minimap, script order |
| `style.css` | HUD styles, minimap, `#lowhp`, `#sub` (subtitles), `.langbtn`, `#bodies` |
| `js/i18n.js` | `LANG` (default `pl`, saved in `localStorage` as `td_lang`), `STR` (UI texts pl/en), `t(key, ...)`, `applyLang()`, `setLang()`, `weaponName(i)`, `ENEMY_NAMES`/`enemyName()`, `dirName(k)` |
| `js/crew_lines.js` | `CREW` (characters: name, nameEn, pitch, rate, g, optional `voiceEn` regex), `LINES = {pl:{}, en:{}}`, `addLines(lang, obj)`, `WAVE_TITLES(_EN)`, `waveTitle`, `waveCtx`, `ordFem` |
| `js/lines_pl_a-d.js`, `js/lines_en_a-d.js` | voice lines PL and EN (a: Monty Python events, b: weapons + `chat`/`battle`, c: extra heroes, d: new enemies and statuses) |
| `js/lines_helpers.js` | `helperHire` and `helperDead` lines (PL/EN) |
| `js/lines_action.js` | action-movie parodies (Die Hard, Terminator, Matrix, Predator, Top Gun, 300, Mission: Impossible, Bond...) spoken by the existing crew, added to the existing pools |
| `js/lines_comedy.js` | Beverly Hills Cop, Police Academy, Monkey Island parodies and "swap the prop" fusions (ale instead of martini, coconut badge, rubber chicken with a pulley), spoken by the existing crew |
| `js/lines_dialogues.js` | restored dialogues (start, lowTower, gameOver*, necroSummon, chat) that once featured Geralt/Death, rewritten for other characters |
| `js/voice.js` | engine: `say(key, ctx, {prio, cool, chance})`, queue, subtitles, `pickVoices` (`NOVELTY` excludes macOS effect voices, `GOOD_EN` preferred), `CHANCE`, `toggleVoice` |
| `js/world.js` | scene, tower, forest, roads, `TOWER_Y=14`, `PLAT=5`, rubble, helpers `mesh/BOX/CYL/mat/M/rnd` |
| `js/enemies.js` | `BUILDERS`, `TYPES`, the `Enemy` class (orc, goblin, thief, mage; hooks `SPELLS`/`TICK`, flags `isDragon`/`isMage`); `die()` increments `G.bodies` |
| `js/enemy_dragons.js` | 3 dragons (fire/ice/venom), `dragonUpdate` (turning, breath at the nearest defender) |
| `js/enemy_mages.js` | pyromancer, frost mage, storm mage (warning ring), necromancer (summons goblins), `SPELLS`, `TICK` |
| `js/enemy_units.js` | warg rider, orc shaman (buffs), dark elf archer and witch |
| `js/helpers.js` | helpers: Shift+1–9 hires a shooter firing that weapon (`buyHelper`, `HD` = cost/cooldown/range, `HFIRE` = a shot with each of the 9 weapons, `updateHelpers`). Placed at the wall nearest to the player, 4 slots per wall, max 16, cost +40 per helper. Each has 100 HP (`HELPER_HP`, bar above the head when hurt), can be hurt (`hurtHelper`), healed (key 9, healer helper) and killed (`killHelper`) |
| `js/status.js` | player statuses: burn, slow, poison, curse (`applyStatus`, `updateStatus`, `playerSpeedMul`) |
| `js/weapons.js` | `fx`, projectiles, `enemyProjectile`, `pickDefender` (enemies target the nearest of player/helpers), `WEAPONS` (9), aiming, `leadAt`/`leadTarget` |
| `js/touch.js` | phone/tablet controls, active only when `IS_TOUCH` (`matchMedia('(pointer: coarse)')`, defined in `i18n.js`): floating joystick (left 45%), look-drag (right), fire button (hold = auto fire), tappable hotbar (tap = select, hold 650 ms = hire helper with a filling indicator), pause/voice/language and R/T/Y buttons, bodycount panel tap-to-expand, touchmove/gesture blocking, pause on background or portrait, Wake Lock, fullscreen + landscape lock in `touchEnter()` (called from `startGame`) |
| `manifest.webmanifest`, `icon.svg`, `icon-192.png`, `icon-512.png` | PWA manifest (fullscreen, landscape) and icons (PNGs rendered from the SVG) |
| `js/main.js` | game loop, controls, waves (`planWave`, `spawnEnemy`), HUD, minimap, WebAudio sound, kill counter |

Script order in `index.html`: three → i18n → crew_lines → lines_pl_a-d → lines_en_a-d → lines_helpers → lines_dialogues → lines_action → lines_comedy → voice → world → enemies → enemy_dragons → enemy_mages → enemy_units → weapons → helpers → status → main → touch.

Kill counter: `G.bodies[type]` is incremented in `Enemy.die()` (also counts kills by helpers and summons). Panel `#bodies` (top left; title "Licznik wrogów" in PL, "Bodycount" in EN) and the full list `#overBodies` on the game-over screen; enemy names are in `ENEMY_NAMES`.

## Controls
WASD move, mouse aim, LMB fire, 1–9 weapon/spell, Shift+1–9 hire a helper, R/T/Y repair/damage/mana, P pause, **M** voices on/off, **L** language (also in pause and the menu).

## Mobile (touch)
- `touch.js` writes into `touchIn` (`mx`, `my`, `fire`, `hold`) which `main.js` reads in `loop`; no pointer lock on touch (`setPause`/`startGame` skip it).
- `t(key)` first looks for `touch_<key>` when `IS_TOUCH` (menu hints, start text, wave/warn messages). Portrait shows `#rotate` with Android and iPhone instructions (`rotAndroid`, `rotIos`).
- Aim assist (`AIM_ASSIST` in `weapons.js`, default ON on touch, toggle `#assistBtn` in the menu, saved as `td_assist`): when no enemy is under the crosshair, `computeAim` snaps to the enemy nearest to it within `ASSIST_CONE`.
- Graphics are deliberately NOT reduced on phones yet (antialias, shadows, pixelRatio ≤ 2). Measure fps on a real device first.
- iPhone Safari has no Fullscreen API: the user must use Share → Add to Home Screen (manifest + apple meta tags are present).
- Testing: headless Chrome does not report `pointer: coarse`; override `window.matchMedia` before the scripts load and dispatch `PointerEvent`s on `#tzMove`, `#tzLook`, `#tFire`, `#slotN`.

## Mechanics in short
- Waves: `planWave(n)`, 9 s break, bonus `40 + 10n` gold. From wave 2 wargs and mages, from 3 elf archers and elemental mages, from 4 witches and shamans, dragons on odd waves from 3 (venom from 7).
- Enemies shoot at whichever defender (player or helper) is nearest to them. Enemy shots hit a helper that they fly into.
- Red vignette at player HP < 40; bricks and smoke when the tower is < 35% HP.
- Language: `say()` reads from `LINES[LANG]`; TTS voices are chosen by `pickVoices()`.
- Pause: `setPause(true)` calls `stopSpeech(true)`, and `say()` returns false while `G.paused` (except `voiceOn`), so no line is heard during a pause.
- Known issue: Firefox on desktop (macOS) makes a click after every spoken line, in every voice and with every utterance setting (tested with a standalone page). It is outside the game's control. An inaudible keep-alive `AudioContext` was tried and did not help, so it was removed.

## Open items (unverified)
1. Dragon breath and the storm ring were only tested logically, not watched in play.
2. Wave balance, helper balance (costs, strength, limit of 16), fps with many enemies.
3. Cooldown bars of slots 1–9, how the real TTS voices sound (especially English), language switching in a real browser.
4. `ordFem` handles waves 1–20; beyond that the voice reads digits.

## How to test (without a real browser)
Headless Chrome: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --virtual-time-budget=… --screenshot=FILE.png --window-size=1280,720 file://…/test.html`.
- `test.html` = a copy of `index.html` with `<script src="test.js">` before `</body>`. In `test.js` use `window.addEventListener('load', …)`, call `startGame()`, drive `loop(clock)` manually (`requestAnimationFrame` hardly works), write results to a `<pre id="out">` and read them with `--dump-dom`. Log JS errors with `console.log('JSERR …')`.
- A WebGL screenshot comes out black unless the canvas is copied to an `<img>` (`renderer.domElement.toDataURL()`) from a `setTimeout`/`setInterval`. The PNG appears with a delay, so retry the first read. Set the camera right before rendering (the loop overwrites it).
- Replace `speechSynthesis` with a stub to check what would be said.
- Delete `test.js`, `test.html` and screenshots afterwards.
