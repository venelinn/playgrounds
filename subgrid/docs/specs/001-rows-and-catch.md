# 001 Rows: cards that line up, and the container catch

## Goal

Show what subgrid solves: cards in a row with uneven content, whose parts (image, title, text, price) should line up with each other.

## Demo

- Six travel-offer cards with titles of 1–2 lines and texts of 1–4 lines, on purpose. **Titles and texts are editable** (click and type; Enter finishes), so you can make one longer and watch the row grow.
- The grid is the component library's `Row` CSS (`shared/grid.css`) with its own **Max columns** (4), **Min width** (220px), **Gap** (16px) and **Container** width. The frame's corner can be dragged; slider and frame stay in sync (`shared/frame.js`).
- Switches (one control card):
  - **Use subgrid** (on): each cell and card spans 4 rows and uses `grid-template-rows: subgrid`.
  - **Show rows** (off): dashed outlines around each part, so the shared rows are visible.
  - **Cells are containers** (off): turns on `container-type` on the cells to show the catch.
- **Live check** above the cards compares the top of the text and of the price in every card of the first row:
  - ✓ "Text and prices line up across the N cards in the first row."
  - ✗ "… sit at different heights …", plus why: "Each card is sizing its own parts" (subgrid off) or "Cells are containers, and a container can't be a subgrid: use <Cell cellNormal>".
  - With one card per row: nothing to compare.
- Below: **How it works** (5 steps), **CSS** (grid + subgrid with current values) and **React** (`<Row>` with `<Cell cellNormal className="offer-cell">` and the cell's subgrid CSS), each with Copy.

## The catch: containers can't be subgrids

`container-type: inline-size` applies layout containment, and an element with layout containment can't be a subgrid: the browser treats `grid-template-rows: subgrid` as `none`. The component's `Cell` is a container by default, so **subgrid cards need `<Cell cellNormal>`**, and their content can't use `@container grid-item` queries. Verified in Chrome, Safari (WebKit) and Firefox.

When subgrid can't apply, the cell keeps `grid-template-columns: minmax(0, 1fr)` and the card `min-width: 0`, so cards stay inside their columns instead of overflowing.

## CSS

```css
.grid > * {
  /* each Cell (cellNormal) */
  display: grid;
  grid-row: span 4; /* image, title, text, price */
  grid-template-rows: subgrid;
}

.card {
  display: grid;
  grid-row: span 4;
  grid-template-rows: subgrid; /* share the grid's rows */
  row-gap: 10px;
}
```

In the page, the switches change `--_sub-span`, `--_sub-rows` and `--_sub-display` on the grid (variable swap); without subgrid the card falls back to `grid-template-rows: auto auto 1fr auto`.

## Done when

- [x] Subgrid on: text and prices line up across every row
- [x] Subgrid off: visibly uneven, with the reason in the check
- [x] Containers on: subgrid breaks, with the reason, and cards stay in their columns
- [x] Same result in Chrome, WebKit and Firefox
