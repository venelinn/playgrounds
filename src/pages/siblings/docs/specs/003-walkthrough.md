# 003 Walkthrough

Same behavior as [Clamp 005](../../../clamp/docs/specs/005-walkthrough.md), using the shared helper `shared/tour.js` (`window.setupTour({ key, steps })`) and `shared/tour.css`.

- Starts on the first visit; finishing or closing it saves `siblings-tour-done = 1` in `localStorage`.
- The **?** button replays it. If driver.js didn't load, the button is hidden and the page works normally.

## Steps

| #   | Highlights                 | Title                              | Says                                                   |
| --- | -------------------------- | ---------------------------------- | ------------------------------------------------------ |
| 1   | —                          | Welcome to the Siblings Playground | Quick tour, about 30 seconds                           |
| 2   | Intro text                 | Two new CSS functions              | sibling-index() = position, sibling-count() = how many |
| 3   | Cards control              | Cards                              | Add/remove: every card recolors and renumbers          |
| 4   | Stagger control            | Stagger                            | Card 3 waits (3 − 1) × 100ms = 200ms                   |
| 5   | Start hue control          | Start hue                          | Where the color wheel starts                           |
| 6   | Saturation control         | Saturation                         | Gray (0%) to vivid (100%)                              |
| 7   | Show values + Replay       | Show values and Replay             | "3 / 8" badges; replay the animation                   |
| 8   | First card                 | A card                             | Color, number and delay come from its position         |
| 9   | CSS card                   | CSS for developers                 | Copy into a ticket or spec                             |
| 10  | Inspector card             | Card inspector                     | Hover or focus a card to see its math                  |
| 11  | Browser support panel      | Browser support                    | Which browsers, since which version, and yours         |
| 12  | Reset, ? and theme buttons | Reset, replay or switch theme      | Reset all controls; how to replay; light/dark          |

## Done when

- [x] Starts on first visit only; ? replays it
- [x] All 12 steps highlight the right element on desktop and a 390px phone
- [x] Readable in both themes
- [x] Page works normally when the CDN is unavailable
