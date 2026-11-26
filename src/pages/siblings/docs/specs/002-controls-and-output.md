# 002 Controls and output

## Controls

Uses the shared slider + number cards (`shared/controls.css`). Typed values are kept within the slider range; leaving the box snaps it to the accepted value.

| Control     | Range            | Default | Sets                                                            |
| ----------- | ---------------- | ------- | --------------------------------------------------------------- |
| Cards       | 1–12             | 8       | Number of cards                                                 |
| Stagger     | 0–400ms, step 10 | 100ms   | `--stagger` on `.products`                                      |
| Start hue   | 0–359°           | 0°      | `--hue-start` on `.products`; the slider thumb shows that color |
| Saturation  | 0–100%           | 85%     | `--sat` on `.products`                                          |
| Show values | checkbox         | off     | `data-show-values` on `.products` (shows the badges)            |
| Replay      | button           | —       | Rebuilds the cards to replay the animation                      |

## CSS output

A "CSS" card with Copy shows the demo's CSS using the real functions (not the `--i` / `--n` helpers), with the current stagger, start hue and saturation filled in. The start hue is only added to the formula when it isn't 0.

## Card inspector

Hovering or focusing a card shows, for that card:

| Row             | Example                 |
| --------------- | ----------------------- |
| sibling-index() | 3                       |
| sibling-count() | 8                       |
| Hue             | ● 360° / 8 × 2 = 90°    |
| Delay           | (3 − 1) × 100ms = 200ms |
| Number          | 03                      |

Index and count are read back from the card's computed `--i` / `--n`, so the panel shows what the browser worked out. Cards are focusable (`tabindex="0"`) so keyboard users can inspect them too.

## Code

Controls, `updateCode()`, `updateInspect()` in `script.js`.
