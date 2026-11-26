# Brands

One page per design system: its type scale as fluid `clamp()` sizes. They have their own **Brands** section on the index page, so the [Clamp playground](../clamp/README.md) stays a plain `clamp()` tool.

## What a brand page does

- **Style:** one of the brand's text styles (Headline LG … Nano). Its font, weight, line height and, for Eyebrow, letter spacing and capitals come along.
- **Smaller on phones (%):** the tokens have one fixed size per style. The page turns each into `clamp(phone size, preferred, desktop size)`:
  - **max** = the token size (desktop)
  - **min** = the size minus this % of the part above `shrink.above` (16px, body size). Styles at or below it keep one size. A style can set its own `"mobile"` size in the JSON instead.
  - **preferred** = size ÷ `desktop` (1200px) × 100, in `vw`, so the text reaches its desktop size at 1200px
  - **line height** = token line height ÷ size, unitless, so it scales with the text
  - Example: Headline LG = `clamp(54.4px, 6.67vw, 80px)`, line height 1.125
- **Viewport** and the **preview:** same as Clamp. The preview starts full width; drag its corner or move the slider.
- **CSS** for the style (rem, with px in a comment), the **numbers**, and **All styles as CSS variables**: the whole scale named like the tokens (`--wvi-font-size-xl`, `--wvi-line-height-xl`), with Copy.

## Files

| File                             | What                                                                       |
| -------------------------------- | -------------------------------------------------------------------------- |
| `brand.ejs`                      | Shared markup; each brand's `index.ejs` includes it                        |
| `brand.js`                       | `setupBrand(typography)`: all the logic, driven by the brand's JSON        |
| `brand.css`                      | The little that isn't shared (`shared/preview.css`, `shared/controls.css`) |
| `westjet/typography.json`        | WestJet Vacations tokens, copied from the Sunwing component library        |
| `westjet/index.ejs`, `script.js` | Title, intro, and `setupBrand(typography)`                                 |

`typography.json` shape: `name`, `tag`, `prefix` (CSS variable prefix), `font { family, stack }` (loaded from Google Fonts), `desktop`, `shrink { percent, above }`, `styles [{ name, label, size, lineHeight, weight, token?, lineHeightToken?, letterSpacing?, uppercase?, mobile? }]`.

## Adding a brand (e.g. Sunwing)

1. Copy `westjet/` to `sunwing/` and replace `typography.json` with Sunwing's tokens (same shape).
2. In `sunwing/index.ejs`, change the title, intro and script path.
3. Add a tile to the Brands section in `src/pages/index.ejs`.

The build finds the new page by itself (`src/pages/brands/sunwing/index.ejs` → `/brands/sunwing/`).
