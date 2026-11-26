# Siblings Playground

Part of [CSS Playgrounds](../../../README.md).

An interactive version of the "Featured Products" demo for the CSS functions `sibling-index()` and `sibling-count()`.

- `sibling-index()` gives an element its position among its siblings: 1, 2, 3…
- `sibling-count()` gives the number of siblings.

Each product card uses them to work out its own color, its big "01, 02…" number and its animation delay. There are no `nth-child` rules, extra classes or inline styles (except the fallback below).

Based on the CSSnippets video "New CSS Functions Explained: sibling-index() & sibling-count()".

## Features

- **Cards (1–12):** add or remove cards and every card recolors and renumbers itself.
- **Stagger (0–400ms):** the delay between cards in the reveal animation: `(sibling-index() − 1) × stagger`.
- **Start hue (0–359°) and Saturation:** where the color wheel starts and how strong the colors are. Colors are spread evenly: `360° / sibling-count() × (sibling-index() − 1)`.
- **Show values:** a "3 / 8" badge on each card, written by CSS counters straight from the two functions.
- **Replay:** runs the reveal animation again.
- **CSS output** with Copy, updated live.
- **Card inspector:** hover or focus a card to see its index, count, hue, delay and number, with the math.
- **Browser support:** live Baseline status and first supported versions for `sibling-index()` / `sibling-count()` and `@property`, plus a check of your own browser (`../../shared/compat.js`).
- **Info icons:** a small "i" next to each control and section; hover for a short explanation, click or tap to pin it (`../../shared/info.js`, same wording as the walkthrough).
- **Walkthrough:** a 12-step guided tour on the first visit; replay it with the **?** button (`../../shared/tour.js`, driver.js). If driver.js can't load, the button is hidden.
- Light and dark themes, plus a back button to the index.

## Browser support

Modern Chrome, Edge, Safari and Firefox support both functions. In older browsers, `script.js` fills in the same numbers as inline `--i` / `--n` custom properties and shows a short notice, so the demo still works.

## Files

| File            | What it does                                                       |
| --------------- | ------------------------------------------------------------------ |
| `index.ejs`     | Markup: controls, the demo, CSS output and inspector               |
| `style.css`     | The demo styles (`@property --i/--n`, card, animation)             |
| `script.js`     | Card data, controls, fallback, CSS output, inspector               |
| `../../shared/` | Tokens, panel, controls and theme toggle shared by all playgrounds |

Specs: [docs/specs](docs/specs/README.md).
