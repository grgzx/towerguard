# Wieżostraż / Towerguard

3D medieval tower defense in the browser (Three.js r128, no bundler, no build).
You are the defender on top of the last tower. Enemies come from all four sides; Monty Python and friends
(plus a few guests from Middle-earth, Discworld, Florin and Monkey Island) comment on the chaos out loud.

**Play online: https://grgzx.github.io/towerguard/** – or open `index.html` locally in a browser.

Current version: see [CHANGELOG.md](CHANGELOG.md) (also shown in the main menu).

## Goal

Keep both the **tower** (1000 HP) and **yourself** (100 HP at the start) alive for as long as possible.
If either falls, the game is over. Score and the enemy tally are shown at the end.

Between waves (about 9 seconds) you get a gold bonus (40 + 10 per wave). Spend gold on repairs, upgrades and helpers.

## Controls – desktop

| Input | Action |
|---|---|
| `W` `A` `S` `D` | Walk around the tower top |
| Mouse | Aim (the pointer is locked while playing) |
| Left mouse button | Fire the selected weapon (hold for continuous fire) |
| `1` – `9` | Select weapon or spell |
| `Shift` + `1` – `9` | Hire a helper armed with that weapon |
| `R` | Repair the tower (60 gold) |
| `T` | Upgrade: more maximum life (+20 per level) |
| `Y` | Upgrade: more maximum mana (+25) and faster regeneration |
| `M` | Voices on / off |
| `L` | Language PL / EN |
| `P` or `Esc` | Pause (releasing the mouse pointer also pauses) |

Tip: Firefox plays a system click after every spoken line; this is outside the game's control. Press `M` to silence the voices there.

## Controls – phone / tablet

The game needs **landscape** orientation. If the phone is held upright, an overlay explains how to rotate it
(including how to unlock rotation on Android and iPhone).

| Input | Action |
|---|---|
| Left stick | Up / down walks forward / back, left / right turns |
| Right thumb (drag) | Look around and aim |
| Big fire button | Fire (hold for automatic fire) |
| Tap a hotbar slot | Select that weapon |
| **Long press** a hotbar slot (about 0.65 s, with a progress indicator) | Hire a helper with that weapon |
| 🔧 / ❤️ / 🔮 | Repair tower / more life / more mana (price shown on the button) |
| ⏸ / 🔊 / 🌐 | Pause / voices / language |
| Aim assist toggle (menu) | Nudges your aim towards the nearest enemy; on by default |
| Enemy tally panel | Tap to expand the list of defeated enemy types |

**iPhone:** for a full-screen game open the page in Safari, tap *Share* → *Add to Home Screen*.
**Android:** Chrome offers *Install app* / *Add to Home screen*.

## Weapons and spells

| Key | Name | Notes |
|---|---|---|
| 1 | Longbow | Fast, free |
| 2 | Crossbow | Slower, harder hitting, free |
| 3 | Mortar | Area damage, free; cannot hit targets close to the tower (and never hurts the tower or you) |
| 4 | Fireball | Mana 14, sets enemies on fire |
| 5 | Chain lightning | Mana 18, jumps between enemies |
| 6 | Frost bolt | Mana 10, slows |
| 7 | Ballista | Free, long cooldown, pierces several enemies |
| 8 | Meteor shower | Mana 55, long cooldown |
| 9 | Holy healing | Mana 40, heals the tower (30%), you (+50) and helpers |

Mana regenerates over time. Cooldowns are per weapon and shown on the hotbar.

## Helpers

Hire up to 16 helpers, 4 per wall. Each is armed with the weapon you hired them with and fires on its own.
They have 100 HP and a health bar, can be wounded and healed (spell `9`), and fall if the enemy gets them.
The price is 120–450 depending on the weapon, plus 40 for every helper already on the walls. Enemies attack whichever defender is nearest.

## Shop

| Item | Price |
|---|---|
| Tower repair (restores 35%; refused when the tower is undamaged) | 60 |
| More life (+20 max and current life) | 100 + 80 per level bought |
| More mana (+25 max, +2 regeneration) | 80 + 60 per level bought |
| Helper | 120–450 depending on the weapon, +40 for every helper already hired |

## Enemies

Orcs, goblins, thieves (they steal gold and run – shoot them before they escape), wargs with orc riders,
orc shamans, dark elf archers and witches, dark mages, pyromancers, frost mages, storm mages, necromancers
(they raise goblins) and three kinds of dragons (fire, ice, venom). Waves are generated procedurally and get harder.

## World and atmosphere

- Four torches light the tower; the surroundings include mountain landmarks (Matterhorn, Rysy, Everest, El Capitan, Half Dome, Giewont).
- From wave 2, at most one ambient event per wave passes by (some are best left unexplained).
- Crew voices use the browser's speech synthesis, so the voices depend on your system. Polish is the default; `L` or the language buttons switch to English
  (the English lines are original jokes, not translations). The choice is remembered.

## For developers

See `CONTEXT.md` for the code structure, test recipe and conventions.
Releases: bump `VERSION` in `js/i18n.js`, add an entry to `CHANGELOG.md`, commit, then tag (`git tag vX.Y.Z && git push --tags`).
