# Optical Pills Playground

Part of [CSS Playgrounds](../../../README.md).

**Pills that look evenly spaced.** The same padding on both sides doesn't _look_ the same on a pill button: the round end cuts into the space next to the text, and an icon only looks right when it sits in the middle of the round end. A plain pill and a balanced pill side by side, with live checks, measurements and guides. Based on a video by Ariakit ("Claude has been styling your pills wrong").

## Features

- **Button:** text size, top and bottom (`--py`), sides (`--px`), roundness (`--round`, 0–100%). Both pills use the same values.
- **Icon:** start, end, none or icon only (the icon is first and last child, so the button becomes a circle). The same CSS handles all four (`:first-child` / `:last-child` + `--edge`).
- **Corrections** (balanced pill only, each one on/off): icon centred in the round end, make up for the curve (π), gap measured to the letters. **Show guides** draws the striped space beside the text, a dashed line where it looks like it starts, and the ring of the round end around the icon.
- Checks per side (`✓ concentric, 8 all around`, `✗ looks like 12, not 16`) and the measured start · gap · end.
- **CSS:** the balanced pill runs on exactly this CSS (generated from the controls). **The math** and **Good to know**, browser support (pi, lh, cap) with the WestJet row, walkthrough, info icons, on-page nav.

## The three corrections

| Fix                   | CSS                                                                                         | At 16px (py 0.5em, px 1em) |
| --------------------- | ------------------------------------------------------------------------------------------- | -------------------------- |
| Icon in the round end | `.button__icon { --edge: calc(var(--py) - var(--px)) }`                                     | icon side 16 → 8           |
| The curve's share     | `.button__label { --edge: calc(var(--pill) * var(--round) * var(--round) * (1 - pi / 4)) }` | text side 16 → 20          |
| Gap to the letters    | `gap: max(var(--py), var(--px) - (1lh - 1cap) / 2)` in `@supports (width: 1cap)`            | gap 8 → 10                 |

`--pill` is half the button's height (`--py + 0.5lh`). The original writes `r × (1 − π/4) × r / pill`; multiplying two lengths in `calc()` isn't in every browser yet, so roundness is a number and `r² / pill` becomes `pill × round²`.

## Files

| File        | What it does                                                                                                            |
| ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| `index.ejs` | Controls, the two pills, CSS / math / tips cards, browser support                                                       |
| `style.css` | The look both pills share, the plain pill's layout, the guides (background layers + icon ring)                          |
| `script.js` | Writes the balanced pill's CSS into `<style id="live-css">` and the CSS card, moves the icon, measures both pills, tour |

Specs: [docs/specs](docs/specs/README.md).
