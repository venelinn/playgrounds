# 001 Grid demo

## Goal

Let designers and developers see how the component library's `Row` / `Cell` grid decides how many columns to show, and how cell content adapts to the cell's width.

## Source

Mirrors `Grid.tsx` and `Grid.module.scss` from the component library:

| Component                  | Playground                                                |
| -------------------------- | --------------------------------------------------------- |
| `cols` (1–6)               | Max columns                                               |
| `minWidth` (260px)         | Min width                                                 |
| `gap` (on = 16px)          | Gap slider (0 = `gap={false}`; other values via `--_gap`) |
| `cellNormal`               | "Cells are containers" switch (off = `cellNormal`)        |
| `--_grid-template-columns` | Not exposed (custom column templates)                     |

The grid CSS in `style.css` is the component's CSS, unchanged apart from class names. The script sets `--_grid-cols`, `--_col-min-width` and `--_gap` on the grid as custom properties, the same way `Row` sets them inline.

## Controls

| Control              | Range                   | Default    |
| -------------------- | ----------------------- | ---------- |
| Max columns          | 1–6                     | 4          |
| Min width            | 80–480px, step 10       | 260px      |
| Gap                  | 0–48px, step 2          | 16px       |
| Items                | 1–24                    | 8          |
| Container            | 240px – available width | full width |
| Cells are containers | on/off                  | on         |

## Container width

- The grid sits in a dashed, resizable frame (`resize: horizontal`). The **Container** value is the grid's own width (frame minus its padding and border).
- Moving the slider sets the frame width; dragging the corner moves the slider. The slider's max follows the space available and updates when the window resizes.
- On touch devices the corner can't be dragged; the slider still works.

## Cells

Each cell is `container-type: inline-size; container-name: grid-item` (or `normal` when the switch is off). The item inside uses `@container grid-item (min-width: 300px)` to switch from stacked (image on top) to side by side (88px image on the left). Labels in each cell say which layout is active, and a ResizeObserver writes the cell's width.

## Readouts

- Above the grid: "N columns · Wpx each · container Cpx", read from the browser's computed `grid-template-columns` (what actually happened).
- **How many columns?** shows the same result as math: even share `(C − (cols − 1) × gap) / cols`, column min `max(min, share)`, then why N columns fit (all fit / min width wins / overflow).
- **Overflow:** when the min width is wider than the container, a warning explains that cells overflow and suggests `min(100%, Xpx)`.

## Output

- **CSS:** the grid with the current values, the cell rule, and the `@container` example (left out when cells aren't containers).
- **React:** `<Row …>` with only the props that differ from the defaults; `<Cell cellNormal>` when the switch is off; for a gap other than 0 or 16px, a class that sets `--_gap`.

## Done when

- [x] Column counts match the component for every combination tried (e.g. 700px, 4 cols, 260px, 16px → 2 × 342px)
- [x] Slider and drag stay in sync
- [x] Cell content switches layout at a 300px cell width, and never when the switch is off
- [x] Overflow warning appears when min width > container
- [x] Fits a 390px phone screen; light and dark themes
