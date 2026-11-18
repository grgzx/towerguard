# Towerguard (Wieżostraż) – project specification

Version described: **0.9.0**. This document is detailed enough to re-create the game from scratch. Numbers are exact values taken from the code. If this document and the code ever disagree, the code wins (and this file should be fixed).

## 1. Overview

A first-person 3D tower defense game that runs in a desktop or mobile browser. The player stands on top of a medieval stone tower and shoots, casts spells and summons defenders against endless waves of enemies that approach from four sides. The tone is comic-medieval: Monty Python and the Holy Grail first, with guests from The Princess Bride, The Lord of the Rings, Pratchett, action films, Beverly Hills Cop, Police Academy and Monkey Island. A crew of spoken (text-to-speech) characters comments on everything with subtitles.

Goals:
- Fully client side: static files, no build step, no server, no network after load.
- Playable with mouse and keyboard, and on a phone in landscape (touch controls).
- Bilingual in-game text: Polish (default) and English. English lines are original jokes, not translations.
- Everything else (code, comments, docs) is in English.

Non-goals: accounts, saving progress, multiplayer, graphics-quality settings.

## 2. Tech stack and repository layout

- Three.js **r128**, vendored as `lib/three.min.js`. Plain `<script>` tags, global scope, no modules, no bundler.
- Web Speech API for voices, WebAudio oscillators for sound effects, `localStorage` for two settings.
- Hosting: GitHub Pages from `main` (https://grgzx.github.io/towerguard/). PWA manifest for "add to home screen".

```
index.html            DOM skeleton (HUD, menu, pause, game over, rotate screen) and script tags
style.css             all styling, including body.touch / body.ios / body.android variants
manifest.webmanifest  fullscreen, landscape, background #1a120a, icons icon-192.png / icon-512.png / icon.svg
lib/three.min.js
js/i18n.js            VERSION, IS_TOUCH, LANG, STR (UI strings PL/EN), t(), applyLang(), toggleLang()
js/crew_lines.js      CREW, ordinals, WAVE_TITLES(_EN), waveTitle(), waveCtx(), LINES, addLines(), crewName()
js/lines_pl_a-d.js, lines_en_a-d.js   event lines by key (a = game events, b-d = chatter, enemies, statuses ...)
js/lines_defenders.js  helperHire, helperDead
js/lines_dialogues.js, lines_action.js, lines_comedy.js   cross-franchise dialogues, weaponN lines, battle/chat, amb_* lines
js/lines_tips.js      tutorial tips for waves 1-2
js/voice.js           voice engine: say(), queue, voice assignment, subtitles
js/world.js           renderer, scene, lights, tower, walls, roads, river, forest, mountains, clouds, torches, rubble
js/ambient.js         ambient scenes (one file)
js/enemies.js         TYPES, Enemy class, humanoid builders (ork, goblin, thief, mage base)
js/enemy_dragons.js   three dragons, flight and breath
js/enemy_mages.js     pyromancer, frost, storm, necromancer, spells (SPELLS, TICK)
js/enemy_units.js     warg rider, orc shaman, dark elf archer and witch
js/weapons.js         particles (fx), projectiles, the 9 weapons, aim assist, enemy projectiles, pickDefender
js/helpers.js         defenders (code name "helpers")
js/status.js          player statuses (burn/slow/poison/curse)
js/main.js            state G, sound, input, shop, waves, HUD, minimap, game loop, tips
js/touch.js           touch controls (only runs when IS_TOUCH)
```

**Script order** (matters, everything is global): three → i18n → crew_lines → lines_pl_a-d → lines_en_a-d → lines_defenders → lines_dialogues → lines_action → lines_comedy → lines_tips → voice → world → ambient → enemies → enemy_dragons → enemy_mages → enemy_units → weapons → helpers → status → main → touch.

Naming rule: player-facing text says "defenders" (PL "obrońcy", "przywołać obrońcę"); the code keeps the old names `helpers`, `buyHelper`, `helperHire`, `helperDead`.

Helper globals defined in `world.js`: `mesh(geo, mat, x, y, z, parent, shadow=true)`, `BOX`, `CYL`, `mat(color)`, `M` (shared material set), `rnd(a, b)`, `seeded(seed)` (deterministic PRNG), `world` (`trees`, `torches`, `fires`, `glowTex`). `$ = document.getElementById`.

## 3. Game state and flow

`G` (in `main.js`): `running, paused, over, wave, gold (80), score, kills, bodies {type:count}, towerHp 1000, maxTowerHp 1000, maxHp 100, mana 100, maxMana 100, manaRegen 7, dmgMul 1, timers [], spawnQ [], spawnT, breakT 3, waveActive, sel (selected weapon), cds [], shake, lvl {hp, mana}, player {pos, yaw, pitch, hp}, called {type: wave}`, plus `chatT` (idle-chatter timer, starts at 40).

States: **menu** (overlay `#menu`) → **running** → **paused** (P key, pointer lock loss, or pause button) → **over** (tower HP ≤ 0 or player HP ≤ 0, overlay `#over` with kill counts per enemy type, "try again" restarts everything).

Game timers: `G.timers` is a list of `{t, fn}` ticked down in the loop (not while paused); `setTimeout` is used only for short non-gameplay delays.

### Main loop (`loop(ts)` on `requestAnimationFrame`)
`dt = clamp((now − last)/1000, 0, 0.05)`. Rendering, world animation and rubble run every frame; gameplay updates run only while `G.running && !G.paused`. Per frame while running: movement, mana regen (`manaRegen·dt`, capped), weapon cooldowns, auto-fire when mouse/fire button held (`tryFire`), `G.timers`, `updateWaves`, enemies, projectiles, defenders, fx particles, statuses, ambient scenes, world animation (clouds drift +2 u/s and wrap at 280, torch flags, flames), rubble, camera shake, HUD, minimap, idle chatter (`chatT` counts down from 40 s; at 0 it resets to 50–100 s and says `chat` (55%) or `battle` (45%) at priority 0, i.e. only if nobody is speaking). On the menu (not running) the camera orbits the tower at radius 12, height `TOWER_Y + 8`, angle `0.1·t`, looking at the tower top. While running, camera shake `G.shake` decays at 1.5/s and offsets the camera by `shake·0.25`; the first-person weapon model `vm` bobs and kicks back on each shot. The loop must stay drivable from tests (see §14).

### Waves
- Pre-wave break `breakT = 3` s, then wave 1 starts.
- When a wave's spawn queue is empty and no enemy is alive: bonus gold `40 + 10·wave`, score `+100·wave`, tower `+60` HP (capped), `waveClear` line, break of **9 s**, next wave.
- On wave start: `G.wave++`, `ambOnWave`, `planWave`, banner `Wave N: <title>` (`WAVE_TITLES[(n-1) % 10]`, Monty Python titles), `waveStart` line, `waveTips(n)`.
- `planWave(n)` builds a queue then shuffles it:
  - goblin `4 + 2n`; ork `1 + floor(1.2n)`
  - n ≥ 2: thief `floor(n/2) + 1`, mage `max(1, floor(n/3))`, warg `floor(n/2)`
  - n ≥ 3: `floor(n/2)` elemental mages picked from [pyro, frost, storm, necro] (first 2 kinds when n < 4, 3 kinds at n = 4, all 4 from n ≥ 5), elfarcher `floor(n/2)`
  - n ≥ 4: elfwitch `floor((n-2)/2)`, shaman `floor((n-2)/3)`
  - odd n ≥ 3: `ceil((n-2)/3)` dragons; the first is fire while n < 5; from n ≥ 7 the kinds ice and poison also appear
- Spawn interval: `max(0.5, 2.2 − 0.1n) · (0.6 + rand·0.8)` seconds.
- Scaling: enemy HP × `(1 + 0.12(wave−1))`; `speedMul = 1 + min(0.025·wave, 0.5)`.
- Spawn position: random side of the 4 (axis-aligned, along the road), distance 120–140 (ranged units from 110), lateral offset ±3. Dragons spawn at angle on a circle of radius 150, height `TOWER_Y + 20`.
- First time a type spawns in a wave, its `<type>Call` line is spoken (`{d}` = compass direction N/E/S/W; dragons are priority 2 and interrupt). Orks and goblins sometimes taunt 2.5 s later (30%).

### Kill rewards
`+gold`, `+score` from the type table; every 40 kills a `killMilestone` line; `firstKill` once; dead bodies lie 1.6 s. Per-type kill counts are shown on the game-over screen. A thief that escapes (distance > 150 after stealing) speaks `escaped`.

### Shop (`buy`, keys R / T / Y or the touch buttons)
| Item | Key | Cost | Effect |
|---|---|---|---|
| Repair | R | 60 | tower +35% of max HP; refused with `towerFull` message when undamaged |
| +life | T | `100 + lvl.hp·80` | `+20` max and current player life; `lvl.hp++` |
| +mana | Y | `80 + lvl.mana·60` | `+25` max mana, `+2` regen; `lvl.mana++` |
Max-stat upgrades have no cap (intended). Not enough gold → message `noGold` and a `noGold` line (cool-down 6 s). Costs are displayed live in the help bar.

## 4. World and rendering

Constants: `TOWER_Y = 14` (platform height), `PLAT = 5` (platform half-side), `EYE = 1.7`.

- Renderer: antialias, pixel ratio `min(devicePixelRatio, 2)`, PCF soft shadows, canvas `#game`.
- Scene: sky colour `0x9ec3e6` as background and fog colour, fog 70–260. Camera FOV 72, near 0.1, far 700, rotation order `YXZ`.
- Lights: `HemisphereLight(0xcfe3ff, 0x5a4a30, 0.6)`, `DirectionalLight(0xfff0d0, 0.75)` at (60, 90, 40) casting shadows with a 2048 map. **No PointLights on projectiles or staffs.** Only the four torches have a PointLight each (intensity ≈ 0.32 flickering).
- Ground: 900 × 900 plane. Four roads (9 wide × 190 long) along the axes from the tower. A river at z = 120 with a bridge across the south road. Forest: 320 seeded trees (55% double-cone pines, 45% oaks) at radius 40–210, skipping the river band (z 108–132) and ±10 around the axes. 16 houses in the courtyard (box + 4-sided roof).
- Tower: stone body of side `2·PLAT + 2` from the ground to `TOWER_Y`, crenellated platform at `TOWER_Y`, corner turrets, a mortar prop at `MORTAR_POS = (-3.4, TOWER_Y + 1.4, -3.2)`.
- Torches: 4 on the platform in a pinwheel arrangement at `(TQ = 3, TD = S − 0.65)` with flag pennants that sway; flames are animated meshes with a glow sprite and rising sparks.
- Outer wall: square ring at radius 26, height 7, gate 6 wide on each road, corner towers.
- Mountains (`buildHills`): six landmarks as vertex-coloured, flat-shaded heightfields (shapes `elcap` 285 @ angle 0.35, `halfdome` 290 @ 1.35, `everest` 330 @ 2.45, `matterhorn` 300 @ 3.6, `rysy` 300 @ 4.55, `giewont` 285 @ 5.5 with a summit cross, a "sleeping knight" ridge profile) plus up to 18 filler hills (`hill`) at distance 275–345 that skip angles within 0.42 rad of a landmark. Colour by height/slope: forest green, rock (`o.rock`), snow above `o.snow`; blended toward the sky colour (`haze`); material `fog:false`. `mtnPlace` positions at y = −1 facing the tower.
- Clouds: 16 groups of 5 flattened spheres, height 85–130, drift in +x.
- Rubble: when tower HP < 35% bricks fall onto the platform and ground around it (progressively, one brick every 0.07 s up to a count proportional to damage, 7×8 on the platform + 8×7 outside), with dust bursts, grey smoke while level > 0.15, and extra dust puffs on every tower hit (`towerHit`). Repairing hides bricks again.

## 5. Player, camera and input

- Turning summary: desktop = mouse (and pointer lock); phone = left joystick (left/right) and right-hand look drag. Keyboard has no turn keys.
- Player starts at `(0, TOWER_Y + 0.4 + EYE, 3)`, HP 100. Walk speed 6 (×0.45 when slowed), clamped to `PLAT + 1`.
- Desktop: pointer lock on the canvas. Mouse look sensitivity `0.0022` rad/px, pitch clamped ±1.45. **Mouse** turns and aims (yaw and pitch), **WASD** walk (W/S forward and back, A/D strafe, relative to the view direction, diagonal normalised, tiny head-bob `sin(10t)·0.04` while moving), **LMB** shoot (hold = auto fire), **1–9** weapon, **Shift+1–9** summon a defender, **R/T/Y** shop, **M** voices, **L** language, **P** pause, **Esc** releases the pointer (pointer-lock loss pauses). Right click is blocked.
- Touch (`touch.js`, active only if `matchMedia('(pointer: coarse)')`):
  - Left zone: floating joystick (radius 48 px, dead zone 0.18). **Up/down walks forward/back; left/right turns the character** (yaw rate `turn · TURN_SPEED · dt` with `TURN_SPEED = 2.4` rad/s, `turn = sign(x)·|x|^1.4`); there is no strafing on touch. Right zone: look drag for yaw and pitch, sensitivity `0.0042` rad/px.
  - Big fire button (hold = continuous fire); tappable hotbar (tap = select weapon, **long press 650 ms** = summon defender, with a progress ring; moving > 14 px cancels it); top-right buttons for pause, voice, language; buy buttons (repair, +life, +mana) with price labels (`#tBuy`).
  - Landscape only: `#rotate` overlay with separate Android and iPhone instructions (iOS: Add to Home Screen / unlock rotation; Android: auto-rotate / fullscreen). Requests fullscreen, orientation lock and a wake lock when possible; body gets `touch`, `ios` or `android` classes.
  - **Aim assist** (setting `td_assist`, default ON on touch only, toggled by `#assistBtn` in the menu): when firing, if an enemy lies within a cone `ASSIST_CONE = 0.11` rad of the aim ray (range 2–160) the shot is steered to the best target.
- Settings persistence: `localStorage` keys `td_lang` (`pl`/`en`, wins over default), `td_assist` (`0`/`1`).

## 6. HUD (`#hud`)

- Top bar: tower HP bar, player life bar, mana bar, wave, gold, score. Low-HP red vignette under 40% player life, stronger warning under 30%; a tower warning under 30% tower HP.
- Crosshair, banner (wave titles), message line `#msg` (e.g. "Not enough gold"), subtitles `#sub` (speaker name in the crew colour + text), help bar (keys and live prices), hotbar of 9 slots (number, name, cooldown shading, greyed when not enough mana).
- Over-head life bars for defenders (`#labels` / 3D bars `h.bar`).
- Minimap (`#minimap`, 440×440 canvas, circular, world radius 160, **rotates with the player's yaw** so the view direction is always up): green ground, range rings at 50/100/150, river band, four roads (a road pulses red when enemies are on that side), the outer wall square, the tower disc, a FOV wedge (±0.85 rad), enemy dots (radius goblin 5, thief/elfarcher 6, warg 8, others 7; dragons are 11 px triangles; enemies beyond 160 are clamped to the edge; colours from `MM_COL`), and compass letters N/E/S/W around the rim that turn orange and show a count (`N 4`) when enemies are on that side. Legend in `#legend`.
- Status icons (🔥 ❄️ ☠️ 🌀) in `#status` and a coloured screen tint `#tint`.
- Menu panel: language buttons (🇵🇱 / 🇬🇧), title, intro text, control grid g1–g7, weapon list w1–w9, aim-assist button (touch only), version line `v0.9.0`, start button. All strings come from `STR[LANG]` and are re-applied by `applyLang()` without reloading; the language can also be switched in the pause menu and with **L**.


Hotbar slot DOM: `.slot#slotN` containing key number, mana cost (if any), emoji icon, name, a cooldown fill (`.cd`, height = remaining/total) and a defender badge (`.hc`) showing `👤N` (defenders hired with that weapon), or while Shift is held / a touch long press is active the price `👤+<cost>💰` (or `—` at the cap). A slot is dimmed (`.no`) when mana is too low. The selected slot has `.sel`.

Feedback: damage flash overlay on player hits (150 ms), hitmarker on the crosshair (90 ms, red tint on kill, plays `hit`), screen shake (`shake(n)`: tower hit 0.25, player hit 0.3).

## 7. Weapons (`WEAPONS` in `weapons.js`)

Common: projectile gravity `GRAV = 20`. Cooldown per weapon in `G.cds`. Mana is spent on cast; if mana is too low: message + `noMana` line. Splash damage falls off as `1 − 0.6·d/R`. `G.dmgMul` is 1 (reserved). Each weapon has a first-person model (`buildViewmodel(i)`) that kicks back on firing; staffs and bows are different meshes.

| # | Weapon | Icon | Cooldown | Mana | Behaviour |
|---|---|---|---|---|---|
| 1 | Longbow | 🏹 | 0.6 s | 0 | arrow, dmg 28, speed 70, gravity 9 |
| 2 | Crossbow | 🎯 | 1.15 s | 0 | bolt, dmg 60, speed 115, gravity 2 |
| 3 | Mortar | 💣 | 2.8 s | 0 | fired from `MORTAR_POS` onto the ground point under the crosshair; flight time clamped 1.6–3.8 s; splash 110 dmg, radius 7.5; **minimum range `MORTAR_MIN = 10`** (closer → `mortarClose` line and message); the shell does not collide with enemies in flight (`noEnemyHit`) and **never hurts the tower or the player** |
| 4 | Fireball | 🔥 | 0.75 s | 14 | splash 48, radius 4.2, applies burn (4 s, 10 dps) to enemies |
| 5 | Chain lightning | ⚡ | 0.9 s | 18 | hits the aimed enemy then jumps up to 5 times (range 14 per jump), damage `60 − 8i`; drawn as jagged bolts (`updateBolts`) |
| 6 | Frost bolt | ❄️ | 0.5 s | 10 | splash 24, radius 3.2, slows for 4.5 s (speed × 0.4) |
| 7 | Ballista | 🗡️ | 2.0 s | 0 | heavy bolt, dmg 95, speed 135, **pierces** every enemy on its path |
| 8 | Meteor shower | ☄️ | 9 s | 55 | 8 rocks fall around the target point (spread ±9, minimum distance 12), each 90 dmg, radius 5.5 |
| 9 | Holy healing | ✨ | 10 s | 40 | tower +30% of max, player +50, all defenders +50, clears all player statuses, `heal` line, `heal` sound |

Aiming: the ray from the camera through the crosshair; projectile spawns at the muzzle (right-hand side of the view) and is steered to the ray's hit point (ground plane or enemy). Ground-targeting weapons (3, 8) require a ground hit. Aim assist (touch, see §5) adjusts the target before launch.

Enemy hit test for projectiles: sphere check against each enemy's `r` (radius in the table below) with a height window; head shots are not special. Kill → `Enemy.damage()` returns true → rewards and hitmarker.

Weapon-switch chatter: `weapon<key>` lines with 30% chance and at least 35 s between them.

## 8. Defenders (`helpers.js`)

- Summoned with **Shift + 1–9** (desktop) or **long press** on a hotbar slot (touch). Each defender is a small humanoid figure (cloak, hat for casters, staff with an emissive tip but **no PointLight**) holding the weapon of the slot it was summoned with.
- Price: base cost per weapon `120 / 200 / 260 / 240 / 280 / 220 / 300 / 450 / 300` (index 0–8) **+ 40 for every defender already summoned**. Maximum `HELPER_MAX = 16`; beyond that: message `helperFull`.
- Placement: slots on the four platform walls (`WALLS = [[1,0],[-1,0],[0,1],[0,-1]]`) at `HELPER_R = 5.2` with lateral offsets `[1.3, −1.3, 2.5, −2.5]` (4 per wall). The wall nearest to the player (by yaw) is filled first, then the others.
- HP 100 (`HELPER_HP`), a floating life bar above the head, a name label is not shown. Dead defenders are removed (`killHelper`), a `helperDead` line is said, message `helperDied`; the slot frees up.
- Firing: each defender has its own cooldown (`HD.cd`: 0.9 / 1.7 / 3.6 / 1.2 / 1.5 / 0.9 / 3.0 / 12 / 14 s) and range (100 / 120 / 90 / 100 / 70 / 95 / 125 / 100 / 0). They choose the nearest valid enemy in range; the mortar (3) and meteors (8) target **ground enemies only** (`ground: true`). Same projectile types as the player's weapons, with these differences: lightning defender uses 4 jumps, damage `55 − 8i`; meteor defender drops 6 rocks and only fires if ≥ 2 enemies are within 9 units of the target; healer (9) heals the tower +12%, the player +20 and defenders +20, and skips casting when everything is healthy. Defenders never cost mana.
- Defender chatter must be rare. `helperHire` is spoken when one is summoned (cool-down applies).
- Enemies pick the **nearest** of {player, defenders} as their target (`pickDefender(pos)`, `defenderPoint`, `defenderTag`); projectiles and breath use that tag to decide who is hit.

## 9. Enemies

### 9.1 Shared behaviour (`Enemy` class)
- Built from primitives (no external models) with animated limbs (walk cycle, attack swing, death fall); no floating labels. `mesh` is a `THREE.Group`; `Enemy.center` = mesh position + `cy · scale.y` is the aim point.
- Fields: `type, hp, maxHp, speed, r (hit radius), dmg, cd, gold, score, stop (distance at which it halts), speedMul, dead, remove, status (burn/slow/...)`.
- Ground units walk toward the tower along their road (axis), **stopping at Chebyshev distance `stop`** (13) from the tower centre. Melee units there do not hit the tower directly: they **throw a projectile** (speed 24, colour grey for orcs, brown for others) at the nearest defender/player/tower, every `cd` seconds, dealing `dmg`.
- Statuses on enemies: burn (`burnT`, `burnDps`) and slow (`slowT`, speed × 0.4). Shamans buff nearby orcs/wargs/shamans (see below).
- Death: body falls and lies for 1.6 s, `G.bodies[type]++`, kill rewards (see §3), `mageDead` / `dragonDead` / `thiefDead` / `elfDead` lines.
- A hard cap: the necromancer's summons are suppressed when ≥ 70 enemies are alive.

### 9.2 Stats table (`TYPES`, before wave scaling)
`cy` = aim height above the feet. `stop` = distance at which the unit halts (Chebyshev distance to the tower for melee units, Euclidean for ranged/mages; ranged units re-roll `stop = (stopMin || 34) + rand·8`).

| Type | HP | Speed | r | cy | Dmg | Cd | Gold | Score | stop | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| ork | 160 | 2.4 | 1.15 | 1.7 | 14 | 1.4 | 14 | 30 | 13 | melee/thrower |
| goblin | 40 | 4.0 | 0.65 | 0.9 | 4 | 0.7 | 5 | 10 | 13 | |
| thief | 60 | 6.2 | 0.7 | 1.2 | 0 | 1.0 | 20 | 25 | 13 | steals `min(gold, 30 + 5·wave)` at the tower, then runs away; gone beyond distance 150 (`stolen`, `escaped`) |
| mage (dark) | 90 | 2.6 | 0.9 | 1.5 | 12 | 3.2 | 25 | 50 | 34–42 | ranged, spell `dark` |
| pyromancer | 100 | 2.5 | 0.9 | 1.5 | 14 | 3.0 | 30 | 60 | 40 | spell `fire` |
| frost mage | 95 | 2.5 | 0.9 | 1.5 | 12 | 2.8 | 30 | 60 | 42 | spell `frost` |
| storm mage | 110 | 2.4 | 0.9 | 1.5 | 18 | 4.2 | 35 | 70 | 36 | spell `storm` |
| necromancer | 120 | 2.2 | 0.9 | 1.5 | 10 | 3.4 | 40 | 80 | 44 | spell `necro` |
| warg rider | 200 | 5.4 | 1.5 | 1.8 | 16 | 1.3 | 24 | 55 | 13 | fast melee |
| orc shaman | 130 | 2.2 | 1.1 | 1.8 | 10 | 5.0 | 35 | 70 | 30 (min 26) | spell `shaman`, `noHover` |
| elf archer | 70 | 3.4 | 0.8 | 1.6 | 7 | 1.5 | 22 | 45 | 38 (min 34) | spell `arrow`, `noHover` |
| elf witch | 85 | 3.0 | 0.8 | 1.6 | 9 | 3.6 | 30 | 55 | 40 (min 36) | spell `curse`, `noHover` |
| dragon (fire) | 520 | 0.35 | 3.2 | 0 | 22 | 4.5 | 120 | 300 | 0 | flying, `breathKind: fire` |
| ice dragon | 560 | 0.35 | 3.6 | 0 | 20 | 5.0 | 140 | 330 | 0 | flying, `ice` |
| poison dragon | 500 | 0.35 | 3.0 | 0 | 18 | 4.2 | 140 | 330 | 0 | flying, `poison` |

Per-instance: HP × `(1 + 0.12(wave − 1))`, `speedMul = 1 + min(0.025·wave, 0.5)`, `attackT` starts at a random point of the cooldown.

### 9.3 Mages (`enemy_mages.js`)
Mages walk from spawn (distance 110+) until they reach their `stop` distance (36–44 from the tower), then stop and cast every `cd` seconds at the nearest target (`pickDefender`). `SPELLS[type]` fire a projectile of speed 22 (default) via `enemyProjectile(from, to, speed, color, tag, damage, size, splash, opts)`; `TICK[type]` runs per-frame effects (necromancer's summon timer, storm warning ring). Hit effects: pyro → `applyStatus('burn')` (3 s, 4 dps), frost → slow, necro → poison, witch → curse (−3 mana per tick). Mage models: robe cone, hat or hood, beard, glowing eyes, staff. Distinct colours per type, also used on the minimap.

### 9.4 Dragons (`enemy_dragons.js`)
Three kinds (fire, ice, poison): body, neck, head with horns, tail, two wings built from bone cylinders and a triangle membrane mesh, flapping. State machine: `walk` (spiral inward from distance 150 at 22 units/s until the orbit radius) → `orbit` (circle the tower at radius `orbitR = 32`, altitude `TOWER_Y + 9`, bobbing ±3, angular speed `0.22·speedMul`, banked 0.25). Every `cd` seconds a dragon starts **breathing**: 1.1 s wind-up (turns its head to the chosen target, mouth glow), then 1.3 s of breath, one small particle bolt (speed 34, size 0.4) every 0.07 s dealing `dmg·0.1` each. Fire breath applies burn [3 s, 4 dps] to the player, ice applies slow [4 s], poison applies poison [5 s, 3 dps]. During breath the dragon slows its orbit to 35%. Dragon calls are priority 2 (interrupt other speech) and `dragonBreath` lines occur. Dragons cannot be hit by the mortar or by meteors (ground-only), but can by every other weapon.

### 9.5 Units (`enemy_units.js`)
- **Warg rider**: wolf body with an orc rider, fast gallop animation.
- **Orc shaman**: robed orc with a totem staff; periodic buff aura (green ring), `shamanBuff` line.
- **Dark elf archer / witch**: slim humanoids with a hooded cloak; archer's bow, witch's staff.

## 10. Player statuses (`status.js`)
State `STATUS = { burn, slow, poison, curse, dps, tick }` (remaining seconds). `applyStatus(kind, dur, dps)` keeps the longer duration and the larger dps; the first application triggers `burning / slowed / poisoned / cursed` lines (cool-down 12 s). Per-frame: every 0.5 s deal damage `dps·0.5` for burn/poison, or reduce mana by 3 for curse. Burn dps default 3/s, poison 2/s. Slow: player speed × 0.45 (`playerSpeedMul`). HUD icons per active status (`#status`) and a screen tint colour (`#tint`). `clearStatus()` on healing, game start and restart.

Hit tests for enemy projectiles (`updateEnemyShots`): player when within 1.3 of its position; a defender via `helperAt` (±0.8 horizontally with a vertical window); the tower when `|x|, |z| < PLAT + 2` and below the platform top. Splash damage (e.g. storm strike) also hurts the player, defenders in radius and the tower at × 0.5.

## 11. Voice, crew and text system

### 11.1 Crew (`CREW` in `crew_lines.js`)
Seventeen speakers + 2 enemy voices, each `{ name, nameEn, color, pitch, rate, g ('m'|'f'), [coco], [voiceEn regexp], [enemy] }`:
`artur` (King Arthur), `lancelot`, `robin`, `galahad`, `patsy`, `czarny` (Black Knight), `tim`, `maynard`, `dennis`, `inigo`, `vizzini`, `gandalf`, `sam`, `gimli`, `rincewind`, `legolas`, plus enemies `ork` and `goblin`. **No new characters are to be added**; new lines are written for these. Geralt and Death were removed deliberately, and Inigo has no lines about his father, revenge or the six-fingered man.

### 11.2 Lines
`LINES[lang][key]` is a pool of entries. An entry is `['who', text]` or a dialogue `[['who', text], ['who', text], ...]`. `text` is a string or a function `ctx => string` (ctx: `n` wave, `o` ordinal feminine nominative, `og` genitive ("pierwszej"), `d` direction, `g` gold, `p` bonus, `k` kill count; `IS_TOUCH` may be read directly). `addLines(lang, obj)` appends. Rules for the writing:
- Original jokes in both languages; no ALL-CAPS words (TTS spells them out); write numbers as words in Polish lines; ≤ 200 characters per line.
- **Euphemisms instead of killing/death** ("poległ", "pokonany", "fell", "defeated").
- Correct term: **Święty Granat Ręczny**.
- Easter eggs stay inconspicuous.
Key families (see files for contents): `start`, `waveStart`, `waveClear` (uses `og`), `<type>Call`, `orkTaunt/goblinTaunt`, `firstKill`, `killMilestone`, `<type>Dead`, `stolen`, `escaped`, `noGold`, `noMana`, `repair`, `hpUp`, `manaUp`, `heal`, `mortarClose`, `voiceOn`, `lowHp`, `critHp`, `lowTower`, `gameOverTower/Player`, `weapon1..9`, `meteor`, `battle`, `chat`, status lines, `shamanBuff`, `necroSummon`, `dragonBreath`, `helperHire`, `helperDead`, `amb_<scene>`, `tipAim/tipDefender/tipDefenderB/tipShop/tipMana`. A line validator must pass (no `undefined`, every speaker exists in `CREW`, ≤ 200 chars, no ALL-CAPS; evaluate function texts with a dummy ctx `{o, og, d, g, p, k, n}` and with `IS_TOUCH` both false and true). Current count ≈ 2710 lines.

Wave titles: `WAVE_TITLES` / `WAVE_TITLES_EN`, ten entries cycling (Tylko draśnięcie / Just a Flesh Wound, Rycerze, którzy mówią Ni! / The Knights Who Say Ni!, Uciekać! Uciekać! / Run Away! Run Away!, Królik z jaskini Caerbannog / The Rabbit of Caerbannog, Wyprowadźcie swoich zmarłych / Bring Out Your Dead, Zamek Anthrax / Castle Anthrax, Jaskółka bez ładunku / Unladen Swallow, Święty Granat Ręczny z Antiochii / The Holy Hand Grenade of Antioch, Most Śmierci / The Bridge of Death, Twoja matka była chomikiem / Your Mother Was a Hamster).

### 11.3 Engine (`voice.js`)
`say(key, ctx, { prio, cool, chance })`:
1. Returns false while paused (except `voiceOn`).
2. Unknown/empty pool → false. Per-key cool-down `cool` (default 4000 ms, `VOICE.lastAt`).
3. Chance: `o.chance`, else `CHANCE[key]` (e.g. `orkCall 0.55, goblinCall 0.5, thiefCall 0.6, mageCall 0.6, repair 0.5, hpUp 0.45, manaUp 0.45, heal 0.5, noGold 0.5, noMana 0.5, mortarClose 0.5, killMilestone 0.8, mageDead 0.5, firstKill 0.8`), else 1. Skipped when `prio < 2`.
4. `prio 0` = chatter, dropped if anyone is speaking or queued; `prio 1` = normal, dropped if more than 2 entries are queued; `prio 2` = urgent: `stopSpeech(true)` clears everything and speaks immediately.
5. Picks a random entry, never the same index twice in a row for that key; resolves function texts; pushes lines to `VOICE.queue`; starts `nextLine()` if idle.
`nextLine()`: shows a subtitle (`#sub`, speaker name in colour + text) and, if voices are on and TTS exists, speaks via `SpeechSynthesisUtterance` (`lang` en-GB / pl-PL; Polish uses the crew `pitch`/`rate` directly, English compresses them: `pitch = 0.92 + (clamp(pitch, 0.3, 1.7) − 0.3)·0.14`, `rate = clamp(rate, 0.92, 1.05)`); text is cleaned of everything but letters, numbers and `. , ! ? : ' -`. Next line starts 220 ms after the previous one ends; a fallback timer (`max(1600, 62 ms·chars + 700) · 2.2 + 3000`) guards against TTS that never fires `onend`. Without voices the subtitle is shown for the fallback time.
`pickVoices()`: Polish → `pl*` voices, else sk/cs/ru/uk, else the first voice; English → `en*` non-novelty voices (excludes names such as Albert, Bells, Zarvox ...), preferring en-GB when ≥ 3 exist plus a whitelist of good en-US/other voices. Splits male/female by a name regexp; each crew member gets the next voice of their gender (round robin); `czarny` prefers a voice matching `/daniel|reed|eddy/i` in English. Re-run on `voiceschanged` and on language change.
`M` toggles voices (`toggleVoice`; message + `voiceOn` line). `stopSpeech(clear)` cancels TTS and gives 150 ms hold before the next utterance. Pausing calls `stopSpeech(true)`. Firefox plays a system click after every utterance; this cannot be controlled and is documented (README suggests pressing M).

### 11.4 Tutorial tips (`lines_tips.js`, `waveTips` in `main.js`)
`TIP_PLAN = { 1: [['tipAim', 12], ['tipDefender', 32]], 2: [['tipDefenderB', 12], ['tipShop', 30], ['tipMana', 50]] }` — seconds after the wave starts. Each tip waits for a quiet moment (`!VOICE.cur && !VOICE.queue.length`), retrying every 2 s up to 30 times, and is skipped when the wave has changed or the game is over. Text differs between desktop (keys) and phone (icons, long press).

### 11.5 Localisation (`i18n.js`)
`STR = { pl: {...}, en: {...} }` holds every UI string (HUD labels, menu, help bar with `<span id="cRepair">` price slots, messages such as `noGold`, `towerFull`, `repaired`, `helperFull`, `helperDied(w)`, `helperBought(w)`, `waveBanner(n, title)`, `overText(wave, kills, score)`, touch help, rotate-screen instructions). `t(key, ...args)` returns the string (calling it if it is a function). `applyLang()` rewrites all DOM texts, rebuilds the hotbar, re-picks voices and sets `document.title`; `toggleLang()` flips and stores `td_lang`. Default Polish.

## 12. Sound effects (`sfx(kind)` in `main.js`, WebAudio, created on the first user gesture)
Single oscillator + gain envelope each: `bow` triangle 500→120 Hz 0.15 s vol 0.12; `boom` sawtooth 90→25 Hz 0.5 s vol 0.3; `magic` sine 300→900 Hz 0.25 s; `zap` sawtooth 1200→100 Hz 0.2 s; `heal` sine 500→1000 Hz 0.6 s; `hurt` square 200→60 Hz 0.2 s; `hit` square 150→50 Hz 0.12 s. Ambient scenes use `ambBeep(type, f0, f1, dur, vol, steps)`.

## 13. Ambient events (`ambient.js`)
From wave 2, at most **one** event per wave: on wave start `AMB.pending` is picked from a shuffled "bag" of all registered scenes (so none repeats until all were used) with a delay of 6–22 s; when it fires the crew says `amb_<name>` (3 variants each) and the scene runs until its `update(dt, age)` returns false, then it is disposed (geometry and materials). `clearAmbient()` on restart. Scenes are registered with `ambReg(name, builderFn)` where the builder returns `{ group, update }`; all in this one file:
`delorean` (a time machine speeding along a far road leaving two lines of fire, vanishing in a flash), `witch` (a witch on a broom cackling), `et` (E.T. in a bicycle basket across the moon), `starlink` (a train of tiny lights), `trex` (a T. rex sprinting across the far plain with ground shake), `dutchman` (ghostly galleon in the sky), `rohan` (riders of Rohan with a green banner and a horn), `coconut` (two figures skipping and clapping coconut halves, no horse). Scenes stay far away, do not interact with gameplay and must not add PointLights.

## 14. Testing recipe (no test framework)
- Syntax: `for f in js/*.js; do node --check $f; done`.
- Line validator: a Node script that evaluates `crew_lines.js` and all `lines_*.js` with stubs for `LINES/addLines/IS_TOUCH` and checks the rules in §11.2 (expected: 0 bad).
- Headless gameplay run (Chrome with SwiftShader): `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --virtual-time-budget=<ms> --dump-dom file://…/drive.html`. `drive.html` is a copy of `index.html` with `<script src="drive.js"></script>` before `</body>`. The driver stubs `window.requestAnimationFrame = cb => cb === loop ? 0 : _raf(cb)` and `renderer.render = () => {}`, calls `startGame()`, steps `loop(clock += 16)` itself in chunks with `setTimeout` (so virtual time does not run out), may keep the tower/player alive and kill enemies directly, and writes results into `<pre id="out">`. Delete `drive*` files before committing.
- Things to assert: no errors, buying defenders works (price rises by 40 each), tips fire in waves 1–2, `td_lang` switch re-renders text.

## 15. Versioning and release
SemVer `0.MINOR.PATCH`. `VERSION` lives in `js/i18n.js` and is shown in the menu. Release steps: bump `VERSION`, add an entry to `CHANGELOG.md`, commit, `git tag vX.Y.Z`, `git push && git push --tags`. Docs: `README.md` (users), `CONTEXT.md` (notes for later work sessions, preferences), `CHANGELOG.md`, this `SPEC.md`.

## 16. Known limitations
- Real frame rate and touch feel on phones are unverified; there is no graphics-quality setting.
- Firefox emits a click sound after each spoken line.
- Defender balance is untuned.
