# 008 Type scale

Start from a design system's text style: it fills the controls, and the resizable preview shows how it behaves.

## Presets

- Saved as JSON in `presets/` and imported by `script.js`. The first one is `presets/wvi.json`, **WestJet Vacations**, copied from the Sunwing component library (sizes, line heights and font from `design-tokens/tokens/wvi/typography.json`; each style's weight from `wvi-components/src/mixins/typography.scss`).
- The WestJet tokens have **one fixed size per style**, the same on every screen. The playground turns each into a `clamp()`:
  - **max** = the token size (desktop)
  - **min** = the mobile size: the token size minus **Smaller on phones** (default 40%) of the part above 16px (body size). Styles at 16px or less keep one size. A style can set its own `"mobile"` size in the JSON instead.
  - **preferred** = size ÷ desktop width (1200px) × 100, in `vw`, so the text reaches its desktop size at 1200px.
  - **line height** = token line height ÷ size, unitless (e.g. 52 / 40 = 1.3), so it scales with the text.
- Example: Headline LG = `clamp(54.4px, 6.67vw, 80px)`, line height 1.125.

## Start from a style

- A slim bar above the controls with two selects: **Start from** (None, WestJet Vacations, …) and **Style** (that system's styles, Headline LG … Nano). Style shows once a design system is picked; nothing changes until a style is picked. **None** stops the link to a style and keeps the current values.
- Picking a style fills Min, Preferred, Max, Line height, Font family (the design system's font, loaded from Google Fonts) and Weight. Eyebrow also brings its letter spacing (3.12px) and capitals to the preview and the CSS output.
- Test it in the main preview: drag its corner to change the screen width (see [003](003-preview-and-output.md)).
- **Smaller on phones** (%), shown once a style is loaded: recalculates the style's Min. Its "i" explains the rule.
- A **from WestJet** tag shows under Font family and Weight while they still match the style. **Reset style** loads the style again after you change things.
- **Copy WestJet scale** in the CSS card: every style as CSS custom properties, named like the tokens (`--wvi-font-size-xl`, `--wvi-line-height-xl`), in rem, with the px range in a comment.

## Adding a design system

1. Add `presets/<id>.json` in the same shape as `wvi.json` (`name`, `tag`, `prefix`, `font`, `desktop`, `shrink`, `styles`).
2. Import it at the top of `script.js` and add it to `PRESETS`: `const PRESETS = { wvi, swg };`.

It then shows in **Start from**, with its own styles in **Style**.

## Code

- Markup: `.style-bar` in `index.ejs`; options are added by the script from `presets/`
- Styles: `.style-bar*`, `.control__tag`, `.control__link` in `style.css`
- Logic: "Style" section in `script.js` (`mobileSize`, `clampFor`, `applyStyle`, `scaleCss`, `updateTags`)
