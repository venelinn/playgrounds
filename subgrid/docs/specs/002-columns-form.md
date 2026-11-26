# 002 Columns: a form whose labels line up

## Goal

Show that subgrid works for columns too, with an everyday example: a form whose inputs should start in the same place.

## Demo

- A form with 4 fields (Name, Email address, Departure city, Number of travellers). Each field is a row of label, input and hint.
- The form is `display: grid; grid-template-columns: max-content minmax(0, 1fr) max-content`.
- Each field spans every column (`grid-column: 1 / -1`) and, with **Use subgrid** on (its own switch), uses `grid-template-columns: subgrid`. The longest label sets the label column for all fields.
- With subgrid off, each field uses its own `max-content minmax(0, 1fr) max-content`, so labels size themselves and inputs start at different places.
- **Live check:** compares the left edge of every input: "✓ All inputs start at the same place." or "✗ The inputs start at N different places: each field sized its own label."
- A CSS card with Copy shows the form and field rules.

## Done when

- [x] Subgrid on: every input starts at the same x
- [x] Subgrid off: 4 different starting points, with the reason
- [x] Same in Chrome, WebKit and Firefox
