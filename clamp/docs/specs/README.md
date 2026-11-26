# Specs

What the Clamp Playground does and how each part should behave. One file per feature area. Update the matching spec when you change a feature, and add a new numbered file for a new one.

| Spec                                                | Covers                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------ |
| [001 Size controls](001-size-controls.md)           | Min, Preferred, Max, Viewport: sliders with exact-value inputs           |
| [002 Fonts](002-fonts.md)                           | Font presets, custom fonts (installed name or Google Fonts link), weight |
| [003 Preview and output](003-preview-and-output.md) | Preview text, size badge, graph, CSS output, values                      |
| [004 Themes](004-themes.md)                         | Light and dark themes and the toggle                                     |
| [005 Walkthrough](005-walkthrough.md)               | First-visit guided tour (driver.js)                                      |
| [006 Layout and look](006-layout-and-look.md)       | Page structure, intro copy, visual rules                                 |

## Status

All specs below are implemented on `main`.

## Saved in the browser

| Key (`localStorage`) | Values           | Set by                                                           |
| -------------------- | ---------------- | ---------------------------------------------------------------- |
| `playground-theme`   | `light` / `dark` | Theme toggle, shared by all playgrounds ([004](004-themes.md))   |
| `clamp-tour-done`    | `1`              | Finishing or closing the walkthrough ([005](005-walkthrough.md)) |

Every read and write is wrapped in `try/catch`. If storage is blocked, the page still works; it just doesn't remember.
