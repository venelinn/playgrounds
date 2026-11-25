# 006 Layout and look

## Structure (top to bottom)

1. **Header:** gradient title "Clamp Playground", the intro text, and the **?** and theme buttons in the top-right corner.
2. **Controls:** one row with Min, Preferred, Max, Viewport, Font family and Weight. Wraps on smaller screens (cards are at least 140px wide).
3. **Warning** (only when Min > Max).
4. **Preview** card.
5. **Bottom row:** graph, CSS, values (each at least 240px wide; stacks on phones).

The main panel is up to 1400px wide, translucent with a blur, and fits a 390px phone with no sideways scrolling.

## Intro copy (for designers)

> `clamp(min, preferred, max)` lets text grow and shrink with the screen, within limits. It never gets smaller than **min** or bigger than **max**. In between, it follows **preferred**, a share of the screen width: `5vw` means 5% of the width, so 45px on a 900px screen. Move the sliders to see where your text stops growing.

Keep it plain language; bold words match the control labels.

## Visual rules

- **Main panel:** muted gradient border (accent → accent2 at 35%). Drawn with a masked `::before` so the translucent panel stays see-through.
- **Preview:** full-strength gradient border, faint dot grid, a top glow and an outer shadow in the state color (accent / green / red). It should be the most prominent card.
- **Other cards:** flat `--card` background, no border.
- The title has side padding so it never sits under the corner buttons.

## CSS conventions

- Plain CSS, no build step. BEM class names (`.block__element--modifier`), written out in full (native CSS nesting can't join `&__element` like Sass can).
- Colors only via the tokens in [004](004-themes.md).
- States (`:hover`, `:focus`, `[data-state]`, `[hidden]`) change a private `--_` variable instead of redeclaring the property.
- Values set from JS go through custom properties (`--preview-size`, `--preview-font`, `--preview-weight`, `--dot-x`, `--dot-y`), not inline style properties.
