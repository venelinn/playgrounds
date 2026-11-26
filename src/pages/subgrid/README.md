# Subgrid Playground

Part of [CSS Playgrounds](../../../README.md).

Cards in a row rarely have the same amount of content, so their titles, text and prices end up at different heights. **Subgrid** lets each card use its parent grid's rows (or columns) instead of making its own, so the parts line up across the row.

## Features

- **Cards (rows subgrid):** six travel cards with uneven titles and text, on the same grid as the [Grid playground](../grid/README.md). Click any title or text to edit it and watch the row adjust.
- **Controls:** Max columns, Min width, Gap and Container width (slider or drag the corner).
- **Switches:** **Use subgrid**, **Show rows** (outlines the shared rows) and **Cells are containers** (shows the catch below).
- **Live check:** says whether text and prices in the first row line up, and why not.
- **How it works**, plus **CSS** and **React** output with Copy.
- **Form (columns subgrid):** four fields whose inputs line up when the fields share the form's columns; its own switch and live check.
- **Info icons:** a small "i" next to each control and section; hover for a short explanation, click or tap to pin it (`../../shared/info.js`, same wording as the walkthrough).
- **Walkthrough** (11 steps, `../../shared/tour.js`) and **Browser support** for subgrid and grid.

## The catch with our grid component

`container-type` (which `Cell` sets by default) applies layout containment, and an element with layout containment can't be a subgrid: browsers treat `grid-template-rows: subgrid` as `none`. So **subgrid cards need `<Cell cellNormal>`**, and their content can't use container queries. Verified in Chrome, Safari (WebKit) and Firefox.

## Files

| File                                             | What it does                                                          |
| ------------------------------------------------ | --------------------------------------------------------------------- |
| `index.ejs`                                      | Controls, card demo, explanation and code, form demo, browser support |
| `style.css`                                      | Subgrid cards, editable text, form                                    |
| `script.js`                                      | Cards, controls, live checks, CSS/React output, tour                  |
| `../../shared/grid.css`, `../../shared/frame.js` | The component's grid CSS and the resizable frame, shared with Grid    |

Specs: [docs/specs](docs/specs/README.md).
