# Version history

Versioning follows [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`.
The game is still pre-1.0, so every `0.MINOR` bump is a feature release and `PATCH` is for fixes only.
The current version is the `VERSION` constant in `js/i18n.js` (shown in the main menu); it must match the top entry here
and the git tag `vX.Y.Z`.

## 0.8.1 – 2026-11-11
- Fixed the end-of-wave lines saying "wave undefined".

## 0.8.0 – 2026-11-11
- Upgrade "+damage" replaced by "+life" (key `T`, ❤️ on phones): +20 maximum life per level. The life bar, low-life warning and healing follow the new maximum.
- Version number shown in the menu; this changelog added.
- README rewritten with separate desktop and phone controls.

## 0.7.0 – 2026-11-11
- Lines about killing and death replaced with euphemisms (Polish and English); kill counter renamed "Enemy tally" / "Licznik wrogów".

## 0.6.0 – 2026-11-11
- Varied mountain landmarks around the arena: Matterhorn, Rysy, Everest, El Capitan, Half Dome and Giewont (the Sleeping Knight, with the summit cross on the nose).

## 0.5.0 – 2026-11-11
- Ambient events from wave 2, at most one per wave: DeLorean, witch, E.T., Starlink train, T. rex, Flying Dutchman, Riders of Rohan, Coconut Knights.
- Ambient scenes live in `js/ambient.js`.
- Torches rebuilt: standing pole, layered flame, glow, sparks.

## 0.4.0 – 2026-11-10
- Parody lines in the crew's voices: action movies, Beverly Hills Cop, Police Academy, Monkey Island, prop-swap fusions.
- Pausing stops speech.

## 0.3.0 – 2026-11-10
- Mobile controls: movement stick, look drag, big fire button (hold for auto fire), hotbar tap/long-press to select or hire, aim assist, landscape-only overlay with Android and iPhone instructions, PWA manifest.

## 0.2.0 – 2026-11-10
- Helpers with 100 HP, health bars; they can be hurt and healed.
- Enemies target the nearest defender.
- Polish is the default language; 34 dialogues restored with the existing crew; lines proofread.

## 0.1.0 – 2026-11-10
- First release: 3D medieval tower defense, 9 weapons and spells, waves from four sides, helpers, shop (repair, upgrades), voices (Web Speech API), Polish and English.
