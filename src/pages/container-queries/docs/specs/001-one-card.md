# 001 One card, many places

Show that a component can pick its layout from the space it gets, and why screen breakpoints can't.

## Demo page

- A resizable frame (shared `frame.js`) holds `.site`, a size container named `site`.
- Areas, each with a label and its width: Full-width section (1 card), Two-column grid (2), and a row with a Three-column grid (3) and a 280px Sidebar (1). Seven copies of the same `.trip` card.
- Page-level layout in `style.css`: below 720px (on `site`) the grids and the sidebar stack. This is the page's job and stays a breakpoint.

## Controls

| Control           | Default       | Effect                                                                  |
| ----------------- | ------------- | ----------------------------------------------------------------------- |
| Switch by         | Its own width | `@container card (width >= N)` or `@media (width >= N)` in the output   |
| Intermediate from | 300px         | Where the intermediate layout starts                                    |
| Expanded from     | 560px         | Where the expanded layout starts; warning if not above Intermediate     |
| Page width        | full          | Frame width                                                             |
| Outlines          | on            | `data-outlines="true"` on `.site`: dashed outline, state + width badges |

In screen mode the demo runs the same rules on the page container (`@container site`) because the page stands in for the screen; the CSS card shows `@media`.

## Live CSS

- `script.js` builds the CSS and writes it to `<style id="live-css">` and the CSS card.
- `.trip` is the container (`container: card / inline-size`). `.trip__inner` lays out with `--_` variables (compact in the fallbacks); the two queries only swap variables, including `--_state` (the name shown on the badge).
- Spacing uses `var(--spacing-*, rem)`, so the copied code also works outside this project.

## Readouts

Each card's badge: state (CSS) and width (script). Each area label: its width. Stage bar: page width and how many different layouts are on the page (screen mode: "every card: …").

## Browser support

Size container queries (`container-type: inline-size`), with the WestJet row. Reference: MDN container queries guide.
