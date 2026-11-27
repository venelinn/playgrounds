# Style Queries Playground

Part of [CSS Playgrounds](../../../README.md). Based on Kevin Powell's [CSS Style Queries as Conditional Modifiers](https://css-tricks.com/css-style-queries-as-conditional-modifiers/) (CSS-Tricks).

Usually a card's variant is a class on the card (`.deal--compact`), added to every card by hand. With container style queries the **area** holds a setting (`--deal-density: compact`) and every card inside reacts with `@container style(--deal-density: compact)`. The HTML stays the same everywhere: the area decides.

## Features

- **Page width** (slider or drag the corner) and **Sidebar beside the main area from**: a size query on the page moves the sidebar next to the main area when there's room.
- **Compact sidebar only when it's beside:** the setting sits inside that size query, so the sidebar's cards go compact only when the sidebar is narrow.
- **Compact cards in:** Nowhere, Sidebar (`.sidebar`) or Everywhere (`.page`).
- **Main area cards:** Stacked or Side by side (`--deal-layout: row`): one setting changes the grid, picture, gap and title size.
- **Badges** on every card say which look it has, set by the same style queries.
- **Modifier-class count:** how many `.deal--compact` / `.deal--row` classes you'd add by hand for the same result.
- **CSS:** the demo runs on exactly this CSS (the script writes it into a `<style>` and the CSS card). Copy it.
- **Good to know**, browser support, walkthrough and info icons.

## Good to know

- A style query reads a **parent**, never the element itself. A card can't query a property it sets on itself.
- Every element is a style container: no `container-type` needed. Name one to query a specific ancestor.
- Only custom properties can be queried so far (`style(display: flex)` is in the spec, not in browsers).
- Anything that sets a property can switch it on: a class, `:has()`, a media or size query.
- One query can restyle many properties; `if()` works one property at a time.
- Modifier classes are still right for one-off variants (`.button--accent`).

## Files

| File        | What it does                                                                             |
| ----------- | ---------------------------------------------------------------------------------------- |
| `index.ejs` | Controls, the resizable page (main area + sidebar, same card HTML), CSS, tips, support   |
| `style.css` | The look only: colors, borders, badges. How the cards change is in the generated CSS     |
| `script.js` | Builds the CSS from the controls into `<style id="live-css">` and the CSS card, readouts |

Specs: [docs/specs](docs/specs/README.md).
