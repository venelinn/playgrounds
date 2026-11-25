# Clamp Playground

An interactive playground for fluid typography with CSS `clamp()`. Set a minimum size, a preferred `vw` value and a maximum size, then see how the font scales across viewport widths.

No build step and no dependencies: plain HTML, CSS and JavaScript.

## Features

- **Exact values:** every slider (Min, Preferred, Max, Viewport) has a number box next to it. Typed values can go beyond the slider's range, and the slider stretches to fit.
- **Live preview:** type your own text and see it at the computed size. A badge shows the size and turns green or red when it's clamped to the min or max.
- **Font family:** pick a preset (System UI, Inter, Space Grotesk, DM Sans, Playfair Display, Fraunces, JetBrains Mono, Georgia, UI Monospace) or choose **Custom…** and enter:
  - the name of a font installed on your computer, e.g. `Avenir Next`
  - a Google Fonts link, e.g. `https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap`
  - a pasted `<link>` tag or `@import url(...)` line
  - a Google Fonts specimen page, e.g. `https://fonts.google.com/specimen/Lora`

  If a name isn't installed, the playground tries to load it from Google Fonts. A status line says whether it used the installed font, loaded it, or couldn't find it.
- **Font weight:** 300 to 900.
- **Graph:** the font size from 320px to 1920px wide, with the clamped zones shaded and a dot at the current viewport.
- **CSS output:** `font-family`, `font-weight` and the `clamp()` value, plus a rem version, with a Copy button.
- **Values:** viewport, preferred size, result, state (clamped to min, fluid, clamped to max) and the viewport range where the size is fluid.
- **Warning** when min is larger than max (`clamp()` then always returns the min).
- **Light and dark themes:** follows your system setting until you pick one with the toggle; your choice is remembered.

## Run it

Open `index.html` in a browser. Or serve the folder:

```sh
npx serve .
```

## Files

| File | What it does |
| --- | --- |
| `index.html` | Markup, plus a small script that sets the theme before the page draws |
| `style.css` | Styles and the light/dark color tokens |
| `script.js` | Slider and number syncing, font loading, graph, CSS output, theme toggle |
