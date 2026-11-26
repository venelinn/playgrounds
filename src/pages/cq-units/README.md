# Container Units Playground

Part of [CSS Playgrounds](../../../README.md).

`vw` sizes text by the screen; `cqi` sizes it by the container it's in. Here, card titles use `clamp(min, Ncqi, max)`, so each title follows its own card's width, and a big section title on top follows the section's width.

## Features

- **Columns (1–4):** narrower cards, smaller card titles. The big title doesn't change: its container is the section, not a card.
- **Min, Size (cqi), Max:** the card title's `clamp()`.
- **Unit:** `cqi`, `cqw` or `vw`. With `vw` every title is the same size whatever the columns.
- **Container:** resize the whole section (slider or drag the corner); now the big title changes too.
- **First card spans 2 columns:** two card title sizes at once.
- **Readouts:** each card and the section show their content width, the title size, and whether it's at min, max or fluid.
- **CSS and React** output (with our `Row` / `Cell`: `Cell` is already a container), **Good to know** (the gotchas), browser support, walkthrough and info icons.

## Good to know

- The card must be a container (`container-type: inline-size`). Without one, `cqi` quietly falls back to the viewport, like `vw`.
- `container: inline-size` is a **name**, not a type: the shorthand is `name / type` (`container: card / inline-size`).
- `cqi`/`cqw` are a % of the container's **content box** (inside padding and border).
- On the container element itself, `cqi` refers to the next container up.
- `cqi` follows the writing direction; prefer it over `cqw`.
- A container inside a shrink-to-fit parent (flex item, `inline-block`) can collapse to 0 width.

## Files

| File        | What it does                                                                          |
| ----------- | ------------------------------------------------------------------------------------- |
| `index.ejs` | Controls, the resizable section with its title and cards, code, tips, browser support |
| `style.css` | Section and cards (both containers), titles with `clamp(… cqi …)`                     |
| `script.js` | Controls, readouts, code output, tour + info icons                                    |

Specs: [docs/specs](docs/specs/README.md).
