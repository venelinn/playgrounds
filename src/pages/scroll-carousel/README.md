# Scroll Carousel Playground

Part of [CSS Playgrounds](../../../README.md).

A carousel where the browser does the swiping: a row of slides with CSS scroll snap, plus arrows, dots and a counter. Every size and colour comes from `--scroll-carousel-*` variables, with system-color fallbacks so it fits any site.

**This is a playground.** CSS does the layout and the snapping; a small script runs the arrows, dots and counter. The page lists what a real site would add with JavaScript: keyboard controls, screen-reader announcements, dynamic dots, focus handoff, right-to-left, a starting slide and a `scrollend` fallback.

## Features

- **Layout:** width (slider or drag the corner), slides per view (fractions let the next slide peek in), gap, padding, corner radius, one slide per swipe (`scroll-snap-stop`), align start / center.
- **Arrows:** hover, always, none; position on the slides or **above** (side by side on the right, outlined); arrow size. **Dots:** overlay, below, none; dot size. **Counter** on or off.
- One dot per place the carousel can stop, not one per slide; the stop count shows in the stage bar.
- **CSS:** your settings as variables (only what differs from the defaults), or with the whole carousel CSS ("Copy with carousel CSS"). **HTML:** the markup for your settings.
- Browser support (scroll snap, `scrollend` with its fallback), walkthrough and info icons.

## Files

| File           | What it does                                                              |
| -------------- | ------------------------------------------------------------------------- |
| `index.ejs`    | Note, controls, the carousel markup, output, "what to add" list           |
| `carousel.css` | The carousel's CSS (what "Copy with carousel CSS" copies, via `?raw`)     |
| `style.css`    | The page around it and the demo slides                                    |
| `script.js`    | Arrows / dots / counter, controls, CSS and HTML output, tour + info icons |

Specs: [docs/specs](docs/specs/README.md).
