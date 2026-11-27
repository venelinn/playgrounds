# 001 Carousel

Let anyone try a scroll-snap carousel's settings live and copy the CSS and HTML.

## Note

Under the intro: "This is a playground": CSS does the layout and snapping, a small script runs the arrows and dots, and a link to **What to add with JavaScript**.

## Controls

| Group           | Control             | Default (page)    | Carousel default | Output                                         |
| --------------- | ------------------- | ----------------- | ---------------- | ---------------------------------------------- |
| Layout          | Width               | full              |                  | (frame only)                                   |
|                 | Slides per view     | 2.5 (1.2 < 640px) | 1                | `--scroll-carousel-slides-per-view`            |
|                 | Gap                 | 16px              | 0px              | `--scroll-carousel-gap`                        |
|                 | Padding             | 0px               | 0px              | `--scroll-carousel-padding`                    |
|                 | Corner radius       | 12px              | 0                | `--scroll-carousel-radius`                     |
|                 | One slide per swipe | on                | `always`         | `--scroll-carousel-snap-stop: normal` when off |
|                 | Align               | Start             | `start`          | `data-align` on the scroller                   |
| Arrows and dots | Arrows              | Always            | `hover`          | `data-arrows`; arrow buttons in the HTML       |
|                 | Arrow position      | On the slides     | on the slides    | `data-arrows-position="top"` for Above         |
|                 | Dots                | Below             | `overlay`        | `data-dots`; dots container in the HTML        |
|                 | Arrow size          | 40px              | 2.5rem           | `--scroll-carousel-arrow-size`                 |
|                 | Dot size            | 8px               | 0.5rem           | `--scroll-carousel-dot-size`                   |
|                 | Counter             | off               | hidden           | counter `<span>` in the HTML                   |

Only values that differ from the defaults go into the CSS. Options are one per row below 600px.

## Arrows above

`data-arrows-position="top"`: the carousel adds room on top (arrow height + `--scroll-carousel-arrows-spacing`, 0.75rem) and puts the arrows there, side by side at the right (`--scroll-carousel-arrows-gap` between them, 0.75rem). Outlined by default: transparent background, `1px solid currentColor` border (`--scroll-carousel-arrow-border`), no shadow. Everything is a variable swap in `carousel.css`.

## Carousel

- Root region → viewport (arrows, scroller with 8 slides, counter) → dots.
- `script.js`: finds the closest snap position on scroll (rAF), counts the stops (slides whose snap position is reachable, plus the end), builds one dot per stop, disables the arrows at the ends, writes the counter. Arrows go to the previous / next stop; dots go to theirs. Left-to-right only.
- Stage bar: `slide N of 8 · S stops`.

## Output

- **CSS** card: the settings block; **Copy with carousel CSS** copies `carousel.css` (imported with `?raw`) plus the settings.
- **HTML** card: the markup for the current settings, with a comment that the arrows, dots and counter need a little JavaScript (or none for swipe only).

## What to add with JavaScript (card)

Keyboard controls, screen-reader announcements, dynamic dots, focus handoff, quick clicks adding up, right-to-left, a starting slide / go to slide N, a `scrollend` fallback. Best left out: looping, autoplay; also not here: mouse drag, pinch zoom.

## Browser support

Scroll snap and `scrollend` (`dom:scrollend`), with a note that a 150ms fallback works without it.
