# 005 Walkthrough

## Goal

Explain the playground to first-time visitors, especially designers, without them having to read docs.

## Library

[driver.js](https://driverjs.com/) **1.3.1** (MIT, no dependencies, about 5 KB gzipped), loaded from jsDelivr:

- `https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.css`
- `https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.js.iife.js` (exposes `window.driver.js.driver`)

Keep the version pinned. If you upgrade, re-check the popover styles; they override driver.js classes.

## Behavior

- **First visit:** the tour starts about 400 ms after load.
- Finishing it, or closing it (×, Escape, click outside), saves `clamp-tour-done = 1`, so it doesn't start again.
- The **?** button next to the theme toggle replays it any time.
- If driver.js fails to load (offline, blocked CDN), the **?** button is hidden and nothing else is affected.
- Shows progress ("3 of 15") and Back / Next / Done buttons. Scrolls to each highlighted element.

## Steps

| #   | Highlights            | Title                           | Says                                                 |
| --- | --------------------- | ------------------------------- | ---------------------------------------------------- |
| 1   | —                     | Welcome to the Clamp Playground | Quick tour, about 30 seconds                         |
| 2   | Intro text            | What clamp() does               | Scales with the screen, between min and max          |
| 3   | Min card              | Min                             | Smallest size; drag or type                          |
| 4   | Preferred card        | Preferred                       | Growth as % of width; 5vw on 900px = 45px            |
| 5   | Max card              | Max                             | Biggest size                                         |
| 6   | Viewport card         | Viewport                        | Pretend screen width                                 |
| 7   | Font family card      | Font family                     | Presets, or Custom… with a name or Google Fonts link |
| 8   | Weight card           | Weight                          | 300 light to 900 black                               |
| 9   | Preview text box      | Your text                       | Type a real headline                                 |
| 10  | Preview card          | Preview                         | Size badge: green at min, red at max                 |
| 11  | Graph card            | Size across screens             | Shaded areas, dot = current viewport                 |
| 12  | CSS card              | CSS for developers              | Copy into a ticket or spec                           |
| 13  | Values card           | The numbers                     | Exact sizes and fluid range                          |
| 14  | Browser support panel | Browser support                 | Which browsers, since which version, and yours       |
| 15  | ? and theme buttons   | Replay or switch theme          | How to replay; light/dark                            |

Copy rule: plain language, no jargon beyond the terms on screen. Keep each step to one or two short sentences.

## Look

Popovers use the `tour` class and the theme tokens (`--field` background, `--line` border, accent Next button), so they follow light/dark. The arrow is hidden. On small screens the popover width is capped at `100vw - 48px` to keep a margin.

## Code

`TOUR_STEPS` in `script.js`. The tour itself is shared: `shared/tour.js` (`window.setupTour({ key, steps })`) and `shared/tour.css` (popover styles), also used by Siblings.

## Done when

- [x] Starts on first visit only
- [x] ? replays it
- [x] All 15 steps highlight the right element on desktop and mobile
- [x] Readable in both themes
- [x] Page works normally when the CDN is unavailable
