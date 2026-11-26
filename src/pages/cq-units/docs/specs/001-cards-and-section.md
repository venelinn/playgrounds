# 001 Cards and section

## Layout

A resizable section (`shared/grid.css` frame + `shared/frame.js`) holding an eyebrow, a **big title** and a grid of **3 cards**. The section and every card have `container-type: inline-size`.

- Big title: `clamp(28px, 6<unit>, 72px)`, follows the **section**.
- Card title: `clamp(<min>px, <size><unit>, <max>px)`, follows **its card**.
- Grid: `repeat(<columns>, minmax(0, 1fr))`; optionally the first card spans 2 columns.

## Controls

| Control                    | Range                   | Default    |
| -------------------------- | ----------------------- | ---------- |
| Columns                    | 1–4                     | 3          |
| Min                        | 10–32px                 | 18px       |
| Size                       | 1–15, step 0.5          | 7 (cqi)    |
| Max                        | 24–96px                 | 48px       |
| Unit                       | cqi / cqw / vw          | cqi        |
| Container                  | 240px – available width | full width |
| First card spans 2 columns | on/off                  | off        |

## Readouts

Each card and the section show `<content width> · title <computed font-size> · at min / fluid / at max`. The width is the container's **content box**, which is what `cqi` measures. The state compares `size% × width` (or of the viewport for `vw`) with min and max. Card badges are green at min, red at max.

## Output

- **CSS:** `container-type: inline-size` on section and card plus both `clamp()` rules (with `vw`: no containers, and a comment that every title will match).
- **React:** `<Row cols>` with `<Cell>` (already a container) and the title rule.
- **Good to know:** the gotchas listed in the README.

## Done when

- [x] Fewer columns → bigger card titles; big title unchanged
- [x] `vw` → all card titles equal whatever the columns
- [x] Narrower container → big title and card titles shrink
- [x] Wide first card → two title sizes at once
- [x] Readouts match the computed font size
