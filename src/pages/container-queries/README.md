# Container Queries Playground

Part of [CSS Playgrounds](../../../README.md).

**One card, many places.** The same card (same image, text and buttons) sits in a full-width section, a two-column grid, a three-column grid and a sidebar, on one resizable page. Each card picks **compact**, **intermediate** or **expanded** from its own width, not the screen's. Made to show designers and project managers the shift from screen breakpoints to designing for the space a component gets.

## Features

- **Switch by:** _Its own width_ (container query, each card decides) or _The screen_ (the old way: every card gets the same layout, and the narrow ones get squeezed).
- **Switch points:** the card widths where Intermediate (300px) and Expanded (560px) start. These are the numbers a designer writes next to each state. A warning shows if Expanded starts before Intermediate.
- **Page:** the page width (slider or drag the corner). The page itself stacks its areas below 720px: page layout can still use breakpoints.
- **Show container outlines and widths:** a dashed outline around each card's box (its container), a badge with its state and width, and each area's width.
- Summary: how many different layouts are on the page at once.
- **CSS:** the demo runs on exactly this CSS (generated from the switch points). **For designers** (states, not devices; Figma variants) and **Good to know**, browser support with the WestJet row, walkthrough, info icons, on-page nav.

## States

| State        | From (default) | Layout                                                                |
| ------------ | -------------- | --------------------------------------------------------------------- |
| Compact      | 0              | Picture on top, title and price, full-width buttons                   |
| Intermediate | 300px          | Picture beside the text, details (nights, inclusions), inline buttons |
| Expanded     | 560px          | Roomier, bigger title, the description too                            |

## Files

| File        | What it does                                                                        |
| ----------- | ----------------------------------------------------------------------------------- |
| `index.ejs` | Controls, the demo page (the same card seven times), tips, browser support          |
| `style.css` | The page-level layout of the demo and the card's look; no card layout               |
| `script.js` | Writes the card's CSS into `<style id="live-css">` and the CSS card, readouts, tour |

Specs: [docs/specs](docs/specs/README.md).
