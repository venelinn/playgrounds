# 007 Info icons

## Goal

Let people check what one control does at any time, without replaying the whole walkthrough.

## Behavior

- A small, muted "i" (14px, outlined, 70% opacity) next to: Min, Preferred, Max, Viewport, Font family, Weight, the preview (after the size badge), CSS, Browser support; and in the top-right corner of the graph and Values cards.
- **Hover** (mouse) shows the tooltip; moving away hides it after 150ms (moving onto the tooltip keeps it open).
- **Click or tap** pins it open, without moving focus into the field (the icon sits inside its `<label>`). Clicking the label text still focuses the field.
- **Esc**, a click elsewhere, or clicking the icon again closes it. Only one tooltip is open at a time.
- The tooltip is a `popover="manual"` placed with anchor positioning: above the icon (`position-area: top`, 6px), flipping below or sideways when there's no room. Without anchor positioning it opens centered.
- Cards with a corner icon get extra right padding (`--_card-padding-end`) so content stays clear of it.

## Screen readers

The icon is `aria-hidden`: inside a label it would otherwise become part of the field's name ("Min, i"). Instead, the field the label points to gets the tooltip through `aria-describedby`, e.g. Max is announced with "Max. The biggest the text can get, on large screens."

## Wording

No separate copy: tour steps in `script.js` have an optional `info: { target, corner? }`, and `window.setupInfoTips(TOUR_STEPS.filter((s) => s.info))` turns those steps into icons. Change a step's text and both the tour and the tooltip change.

## Code

`shared/info.js`, `shared/info.css` (usable by every playground).

## Done when

- [x] 11 icons; hover, pin, Esc and outside click work in Chrome, WebKit and Firefox
- [x] Tooltip sits 6px above its icon and flips near edges
- [x] Label clicks still focus their fields; fields have the description
- [x] The walkthrough still works
