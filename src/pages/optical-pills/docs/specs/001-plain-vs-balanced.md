# 001 Plain vs balanced

## Goal

Show why a pill button with equal padding looks unbalanced, and the three CSS corrections that fix it, with numbers anyone can check.

## Behaviour

- Two pills with the same settings: **Plain padding** (`padding: var(--py) var(--px); gap: var(--py)`) and **Optically balanced** (the generated CSS, classes `.button`, `.button__icon`, `.button__label`).
- The script sets `--pill-size`, `--py`, `--px`, `--round` on `.pills`; the generated CSS repeats them on `.button` so it can be copied as is.
- Icon start / end / none / only: the script reorders the icon and label nodes (before, after, one removed); icon only gets `aria-label` from the label text because the CSS relies on `:first-child` / `:last-child`.
- Each correction switch adds or removes its part of the generated CSS. With neither the icon nor the curve fix, the `:first-child` / `:last-child` rules are left out.

## Checks (per side, measured from the page)

- **Icon side:** OK when the space beside the icon equals the space above it (within 0.75px). "Concentric" when the corner radius is the full half-height.
- **Text side:** what it looks like = measured space − `r² × (1 − π/4) / (height / 2)` (r capped at half the height). OK when that equals the side padding.
- Measures: start · gap · end, rounded.

## Guides

- Striped background layers on the text side(s), as wide as the measured space; the round end clips them.
- A dashed line where the space looks like it starts (the curve's share in from the edge).
- A ring as tall as the pill, centred on the icon (`inset: -var(--py)`): it fills the round end when the icon is centred.

## Browser support

`pi` in `calc()`, `lh`, `cap`. Without `cap` the gap falls back to `--py` (`@supports` swap); without `pi` the margins are dropped (plain pill).
