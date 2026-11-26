# 001 Size controls

## Goal

Let people set the three `clamp()` values and a pretend screen width, either by dragging or by typing an exact number.

## Controls

| Control   | Unit | Slider range | Step | Default |
| --------- | ---- | ------------ | ---- | ------- |
| Min       | px   | 8 to 80      | 1    | 20      |
| Preferred | vw   | 0.5 to 15    | 0.1  | 5       |
| Max       | px   | 24 to 200    | 1    | 80      |
| Viewport  | px   | 320 to 1920  | 1    | 900     |

Each control is a card with the label and a number box (with its unit) on top and the slider below.

## Behavior

- Dragging a slider updates its number box, and typing in the box moves the slider. Everything else on the page updates live.
- A typed value outside the slider's range is allowed. The slider stretches its min or max to include it, so the two stay in sync.
- Negative values and non-numbers are ignored while typing. Leaving the box (blur or Enter) with an invalid or empty value puts back the last good value.
- If **Min is larger than Max**, a warning appears under the controls: "Min (Xpx) is larger than max (Ypx). clamp() will always return the min." This matches how browsers handle `clamp()`.

## Math

```
preferredPx = viewport × preferred / 100
result      = max(min, min(preferredPx, max))   // same as CSS clamp()
state       = min > max          → "min"
              preferredPx ≤ min  → "min"
              preferredPx ≥ max  → "max"
              otherwise          → "fluid"
fluid range = min × 100 / preferred  …  max × 100 / preferred   (viewport px)
```

## Done when

- [x] All four sliders have a number box with the right unit
- [x] Slider and box stay in sync both ways
- [x] Typed values beyond the slider range work and stretch the slider
- [x] Invalid input restores the last good value on blur
- [x] Min > Max shows the warning

## Code

- Markup: `.controls` in `index.ejs`
- Sync: `setFromNumber()` and the `KEYS.forEach` listeners in `script.js`
- Math: `update()` in `script.js`
