# Grid Playground

Part of [CSS Playgrounds](../../../README.md).

An interactive version of our component library's `Row` / `Cell` grid. It shows **up to** a number of columns and drops columns on its own when they'd get narrower than a minimum width. There are no breakpoints: it reacts to the space it's in. Each cell is also a container, so its content can adapt to the cell's width.

## How it works

```css
grid-template-columns: repeat(
  auto-fill,
  minmax(max(var(--_min-column-width), calc((100% - (var(--_grid-cols) - 1) * var(--_grid-gap)) / var(--_grid-cols))), 1fr)
);
```

Each column must be at least the bigger of:

- the **min width** (`minWidth`, default 260px), and
- the **even share**: the container width minus the gaps, divided by `cols`.

The even share stops the grid from going over `cols` columns; the min width makes it drop columns when they'd get too narrow; `auto-fill` packs in as many as fit.

## Features

- **Max columns (1–6), Min width, Gap, Items:** the `cols`, `minWidth` and `gap` props, plus how many cells.
- **Container width:** slider, or drag the corner of the dashed frame. The slider and the frame stay in sync.
- **Cells are containers:** on = `<Cell>` (`container-type: inline-size`), off = `<Cell cellNormal>`. With it on, each item switches from stacked to side by side when its **cell** is 300px or wider, whatever the page width.
- **Live readout:** columns, column width and container width above the grid; each cell shows its own width.
- **How many columns?** The math for the current settings: the even share, the column min, and why this many columns fit.
- **Overflow warning** when the min width is wider than the container (cells overflow; tip: `min(100%, …)`).
- **CSS** and **React** output with Copy. A gap other than 16px is shown as `--_gap` on a class, since `Row` only takes `gap` as on/off.
- **Subgrid note:** a short pointer to the [Subgrid playground](../subgrid/README.md), with the catch: subgrid cards need `<Cell cellNormal>`, because a container can't be a subgrid.
- **Info icons:** a small "i" next to each control and section; hover for a short explanation, click or tap to pin it (`../../shared/info.js`, same wording as the walkthrough).
- **Walkthrough:** a 13-step guided tour on the first visit; replay it with **?** (`../../shared/tour.js`).
- **Browser support** for Grid, `max()`/`calc()` and container queries (`../../shared/compat.js`).

## Files

| File            | What it does                                                   |
| --------------- | -------------------------------------------------------------- |
| `index.ejs`     | Markup: controls, the resizable demo, outputs, browser support |
| `style.css`     | The grid (same CSS as the component), cell content, layout     |
| `script.js`     | Controls, resizing, cells, readouts, CSS/React output          |
| `../../shared/` | Tokens, panel, controls, theme toggle and the support panel    |

Specs: [docs/specs](docs/specs/README.md).
