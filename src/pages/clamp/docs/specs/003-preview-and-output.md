# 003 Preview and output

## Preview

- A **text box** at the top of the preview card sets the sample text (default "Fluid Typography"). Clearing it shows the default again.
- The sample is drawn at the computed size, font and weight, with a short size transition.
- A **size badge** (e.g. `45px`) sits on the right. Its color shows the state: accent while fluid, green at min, red at max.
- **Resizable:** the card's width is the Viewport. Dragging its bottom-right corner sets the Viewport to the card's width, like resizing a browser window; moving the Viewport slider or typing a value resizes the card. A Viewport wider than the panel keeps its value: the card stays full width and a note says `1920px · too wide, shown at 1160px`. Otherwise the note shows the width (`900px wide · drag the corner ↘`). The card never gets narrower than 320px (or the panel, on a phone).
- The card is the visual focus of the page: gradient border, faint dot grid, and a soft glow that takes the state color (see [006](006-layout-and-look.md)).

## Graph

- X axis: viewport width across the Viewport slider's range (320px to 1920px by default; it follows the slider if typing stretched it). Y axis: 0 to 115% of the larger of min and max.
- Draws the clamped curve, dashed lines for min (green) and max (red), and a dashed amber line at the current viewport.
- Shades the areas where the size is stuck at min (green) or max (red). If min > max, the whole graph is shaded as min.
- A dot marks the current size at the current viewport.
- The SVG stretches to fit (`preserveAspectRatio="none"`) with `vector-effect: non-scaling-stroke` so lines keep their width. The dot is an HTML element placed with `--dot-x` / `--dot-y` so it stays round.

## CSS output

```css
font-family: "Roboto Slab", sans-serif;
font-weight: 800;
font-size: clamp(20px, 5vw, 80px);
/* rem: clamp(1.25rem, 5vw, 5rem) */
```

The rem line assumes a 16px root size. **Copy** puts the block on the clipboard and briefly shows "Copied" (or "Copy failed").

## Values

Viewport, Preferred (in px), Result, State (Clamped to min / Fluid / Clamped to max), and Fluid between (the viewport range where the text is still scaling, or "n/a").

## Layout

The graph, the CSS block and the values sit side by side in one row on wide screens and stack on narrow ones.

## Code

`update()` and `drawGraph()` in `script.js`; `.preview`, `.graph`, `.card`, `.stats` in `style.css`.
