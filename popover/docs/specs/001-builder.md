# 001 Builder and placement

## Controls

| Control               | Values                                  | Default      | Sets                                                       |
| --------------------- | --------------------------------------- | ------------ | ---------------------------------------------------------- |
| Placement             | 12 spots around a button (radio picker) | bottom-start | `data-placement` on the builder popover                    |
| Type                  | manual, auto, hint                      | manual       | the `popover` attribute (closed and reopened when changed) |
| Offset                | 0–32px                                  | 6px          | `--offset` on the page (all popovers)                      |
| Animation             | 0–600ms, step 20                        | 180ms        | `--animation` on the page (all popovers)                   |
| Flip when out of room | on/off                                  | on           | `data-flip="false"` sets `--_fallbacks: none`              |

Each type has a one-line explanation under the select. If `popover="hint"` isn't supported, the option says so (browsers treat it as `manual`).

## Builder

- A dashed playfield with one draggable button (`popover-root` with `anchor-name: --builder`). Dragging doesn't toggle the popover; a plain click does.
- The button is placed with `left`/`top` only, never a transform (Firefox anchors to the pre-transform box).
- The popover opens on load, unless the first-visit tour is about to start (the top layer would cover the tour).
- **Readout:** compares the popover's box with the button's to work out the real side and alignment: "Asked for X · showing Y", plus "not enough room, so it flipped" when they differ. "Closed" when closed; a warning if it isn't next to the button at all.

## Placement engine (`placement.js`)

Same rules as `Popover.module.scss`:

- inline alignment for top/bottom: start = `left: anchor(left)`, end = `right: anchor(right)`, center = `justify-self: anchor-center`
- block alignment for left/right: start = `top: anchor(top)`, end = `bottom: anchor(bottom)`, center = `align-self: anchor-center`
- the side adds `calc(anchor(<edge>) + var(--popover-offset))`
- fallback chain: opposite side, then mirrored alignment, then both (centered: opposite side only)

The page CSS is injected from this file inside `@supports (anchor-name: --a)`, with `position-try-fallbacks: var(--_fallbacks, <chain>)` so flipping can be switched off. The CSS output prints only the chosen placement, its fallbacks' `@position-try` rules, and the animation.

## Animation

`opacity` + `translate` (6px from the button's side) with `@starting-style` for the open state and `transition-behavior: allow-discrete` on `display` and `overlay` for the close. 0ms = none.

## Other demos (from the CodePen)

- **All twelve placements**, `manual`, generated from the same list.
- **Escapes `overflow: hidden`:** an `auto` popover inside a clipped box renders in the top layer and isn't cut off.

## Done when

- [x] All 12 placements land where asked (Chrome, WebKit, Firefox)
- [x] Dragging to the edge flips (`left` → `right`); flip off stops it
- [x] Offset is exact (20px → 20px)
- [x] `auto` closes on an outside click; `manual` stays
- [x] Matrix opens several at once; the clipped popover isn't cut off
- [x] No errors; fits a 390px phone; light and dark themes
