# 001 Product cards

## Goal

Recreate the CSSnippets "Featured Products" demo and show how `sibling-index()` / `sibling-count()` let each card style itself.

## Stage

A bordered panel with:

- a pill "CSS · sibling-index() & sibling-count()"
- the heading "Featured Products"
- the line "Each card automatically knows its position and total count, rendering completely self-contained color gradients and numbering."
- a responsive grid of cards (columns at least 280px wide; three columns on desktop)

## Card

| Part                | Detail                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Icon                | 52px rounded square, Lucide line icon in the card's color                                   |
| Title / text        | Product name and one line, 8 from the video plus 4 extras (Speaker, Tablet, Mouse, Printer) |
| Arrow               | `→`, moves 4px right on hover                                                               |
| Corner circle       | `::before`, 160px, in the card's color at `opacity: 0.12` (0.2 on hover)                    |
| Number              | `::after`, `counter(product, decimal-leading-zero)` → 01, 02…, very faint, bottom right     |
| Badge (Show values) | "3 / 8" from `counter(product) " / " counter(total)`                                        |

## How each card gets its values

```css
@property --i {
  syntax: "<integer>";
  inherits: true;
  initial-value: 1;
}
@property --n {
  syntax: "<integer>";
  inherits: true;
  initial-value: 1;
}

.product {
  --i: sibling-index();
  --n: sibling-count();
  --hue: calc(360deg / var(--n) * (var(--i) - 1) + var(--hue-start));
  counter-reset: product var(--i) total var(--n);
  animation: cardReveal 0.8s both;
  animation-delay: calc((var(--i) - 1) * var(--stagger));
}
```

`--i` and `--n` are registered as integers so they are worked out **on the card** and inherited as numbers. Unregistered, `sibling-index()` would be re-evaluated on each child (the icon would get its own index inside the card).

- Color: `hsl(var(--hue) var(--sat) var(--swatch-l))`. Lightness is a theme token (60% dark / 55% light; icons 66% / 42%) so colors stay readable in both themes.
- Hover: border `hsl(… / 0.55)`, shadow `0 20px 40px -15px hsl(… / 0.2)`, lift 4px (as in the video).
- Animation `cardReveal`: from `opacity 0; translateY(30px) scale(0.94)` to normal, 0.8s. Turned off with `prefers-reduced-motion`.

## Adding and removing cards

Cards are added and removed at the end, so existing cards keep their elements and don't replay the animation. Their color and count update because `sibling-count()` changes. **Replay** rebuilds all cards to run the animation again.

## Fallback

If `CSS.supports("z-index", "sibling-index()")` is false, the script sets `--i` and `--n` inline on each card after every change and shows the notice "Your browser doesn't support these functions yet…". Everything else is the same CSS.

## Done when

- [x] 8 cards on load, matching the video's layout and copy
- [x] Each card's color, number and delay come from the two functions
- [x] Adding/removing cards recolors and renumbers all cards
- [x] Works in Chrome, Safari (WebKit) and Firefox; fallback verified by forcing it off
- [x] Readable in light and dark themes

## Code

`.product*` and `@keyframes cardReveal` in `style.css`; `PRODUCTS`, `setCount()`, `applyFallback()` in `script.js`.
