# 001 Areas and cards

Show that a card can take its look from the area it's in, with `@container style()`, instead of a modifier class on every card.

## Demo page

- A resizable frame holding `.page` (a size container named `page`) → `.layout` → `.main` (3 cards) and `.sidebar` ("More deals", 3 cards). All six cards have the same HTML: `.deal` with picture, place, title, text, price and a badge.
- The frame is at least 560px tall (`--frame-min-height`).
- Below the "beside" width the sidebar sits under the main area; above it, `.layout` gets two columns (`minmax(0, 1fr) 260px`).

## Controls

| Control                               | Default | What it changes in the CSS                                                                               |
| ------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| Page width                            | full    | The frame's width (shared `frame.js`); dragging the corner moves the slider                              |
| Sidebar beside the main area from     | 700px   | `@container page (width > Npx)`                                                                          |
| Compact sidebar only when it's beside | on      | `.sidebar { --deal-density: compact }` inside that size query, or on its own                             |
| Compact cards in                      | Sidebar | Where `--deal-density: compact` is set: nowhere, `.sidebar`, or `.page` (switch disabled unless Sidebar) |
| Main area cards                       | Stacked | `.main { --deal-layout: row }` when Side by side                                                         |

Phone widths: the option cards are one per row.

## The live CSS

- `script.js` builds one CSS text from the controls and puts it in `<style id="live-css">` (after the page's stylesheet) and in the CSS card, so the demo runs on exactly what's shown.
- The card's layout uses private variables with defaults in the `var()` fallbacks (`--_areas`, `--_columns`, `--_gap`, `--_padding`, `--_img-height`, `--_title-size`, `--_text`). The two style queries only swap those variables. Compact comes last, so it wins over row.
- `style.css` holds only the look. The badges (`default` / `row` / `compact`) are set there by the same two style queries.

## Readouts

- Stage bar: `page 1100px · sidebar beside|underneath`.
- Count line: reads each card's computed `--deal-density` / `--deal-layout` and says how many `.deal--compact` / `.deal--row` classes BEM would need. All defaults → a hint to change something.

## Browser support

Two features: container style queries (`dom:style-queries`, a probe in `shared/compat.js`, since `CSS.supports` can't test an `@container` condition) and size container queries.

## Reference

Under Browser support: a **Reference** link to the CSS-Tricks article (shared footer `references` option).

## Code

`buildCss()`, `updateReadouts()` in `script.js`; `.deal*`, `.layout`, `.main`, `.sidebar` in `style.css`. Shared: `groups.css` (groups, radio cards), `grid.css` (stage, frame), `frame.js`.
