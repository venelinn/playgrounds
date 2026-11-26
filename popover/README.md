# Popover Playground

Part of [CSS Playgrounds](../README.md).

Native popovers (`popover` + `popovertarget`) placed next to their button with CSS anchor positioning. No JavaScript is needed for the popovers themselves: the browser opens and closes them, puts them in the top layer (above everything, no z-index or portal), and flips them when there isn't room.

Based on the component library's `Popover` primitive (`Popover.module.scss`) and its CodePen demo.

## Features

- **Builder:** pick a **placement** (12 spots around the button), the **type** (`manual`, `auto`, `hint`), the **offset**, the **animation** duration and **flip when out of room**. **Drag the button** toward the window's edge: a live readout says which placement you asked for and which one the browser shows ("asked for left · showing right: flipped").
- **HTML and CSS output** with Copy: just the rules for the chosen placement, its `@position-try` fallbacks and the animation.
- **All twelve placements** side by side (`manual`, open several to compare).
- **Escapes `overflow: hidden`:** a popover inside a clipped box isn't cut off.
- **Walkthrough** (13 steps) and **Browser support** for popover, anchor positioning, `popover="hint"` and `@starting-style`.

## How placement works

`placement.js` holds the placement engine, written once and used twice: it injects the page's real CSS and prints the CSS output, so they can't disagree. It's the same logic as the SCSS:

- 12 placements = 4 sides × 3 alignments; centered ones drop `-center` (`top`, `left`…).
- Each placement sets `top/bottom/left/right` with `anchor()` (plus `--popover-offset` on the side), or `anchor-center` for centered alignment (`translate` isn't allowed in `@position-try`).
- Fallback chain: the opposite side first, then the mirrored alignment on the same side, then both.
- Everything sits in `@supports (anchor-name: --a)`. Without it, popovers open centered instead (the browser default), never stuck in a corner.

## Gotcha: don't transform the anchor

Firefox anchors to the button's box **before** transforms, Chrome and Safari after. A button moved with `translate` (or inside a translated wrapper) puts the popover off by that amount in Firefox. The builder positions its draggable button with `left`/`top` for this reason.

## Files

| File           | What it does                                                  |
| -------------- | ------------------------------------------------------------- |
| `index.html`   | Controls, builder, code, matrix, clipped box, browser support |
| `placement.js` | The placement engine (injected CSS + code output)             |
| `style.css`    | Popover primitive, animation, picker, demos                   |
| `script.js`    | Controls, drag, live readout, code output, tour               |

Specs: [docs/specs](docs/specs/README.md).
