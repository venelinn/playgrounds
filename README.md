# CSS Playgrounds

Small interactive playgrounds for modern CSS: move a slider, see what changes, copy the code. Made for designers and developers.

No build step and no dependencies: plain HTML, CSS and JavaScript.

## Playgrounds

| Playground                      | What it shows                                                                                                                   | Docs                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [Clamp](clamp/index.html)       | Fluid type with `clamp(min, preferred, max)`: sizes, fonts, graph, CSS output                                                   | [README](clamp/README.md) · [specs](clamp/docs/specs/README.md)       |
| [Siblings](siblings/index.html) | `sibling-index()` and `sibling-count()`: cards that pick their own color, number and animation delay                            | [README](siblings/README.md) · [specs](siblings/docs/specs/README.md) |
| [Grid](grid/index.html)         | Up to N columns that drop when too narrow, no breakpoints; cells as containers. Based on our component library's `Row` / `Cell` | [README](grid/README.md) · [specs](grid/docs/specs/README.md)         |
| [Subgrid](subgrid/index.html)   | Cards and form fields that share their parent grid's rows or columns so their parts line up; the container catch                | [README](subgrid/README.md) · [specs](subgrid/docs/specs/README.md)   |
| [Popover](popover/index.html)   | Native popovers placed with anchor positioning: 12 placements, flipping, types, animation, no JavaScript needed                 | [README](popover/README.md) · [specs](popover/docs/specs/README.md)   |

The [index page](index.html) links to all of them.

## Run it

Serve the repo root so the shared files load:

```sh
pnpm serve      # or: npx serve .
```

Then open the address it prints. Opening `index.html` straight from the folder also works.

## Linting and formatting

[Biome](https://biomejs.dev/) lints and formats the JavaScript, CSS, Markdown and JSON, and checks the HTML for accessibility issues. It's the only dev dependency; the pages themselves still have no build step.

```sh
pnpm install       # once
pnpm lint          # check everything (run before committing)
pnpm lint:fix      # apply formatting and safe fixes
pnpm format        # formatting only
```

Settings are in `biome.json`: 2-space indents, double quotes, 120-character lines, the recommended rules.

## Structure

```
index.html        Index page with a tile per playground
package.json      Dev scripts (Biome); no runtime dependencies
biome.json        Biome lint + format settings
home.css          Index page styles
shared/
  base.css        Color tokens (dark + light), page base, panel, title, intro, corner buttons
  controls.css    Slider + number cards, warning, code card with Copy
  compat.css
  compat.js       "Browser support" panel: live Baseline data from webstatus.dev, saved copy as fallback
  theme.js        Light/dark toggle, one saved choice for every page
  tour.css
  tour.js         First-visit walkthrough (driver.js): window.setupTour({ key, steps })
  grid.css        The component library's Row/Cell grid CSS + resizable demo stage (Grid, Subgrid)
  frame.js        Keeps a width slider, the frame's drag corner and the window in sync
clamp/            Clamp playground (index.html, style.css, script.js, README, docs/specs)
siblings/         Siblings playground (same layout)
grid/             Grid playground (same layout)
subgrid/          Subgrid playground (same layout)
popover/          Popover playground (same layout)
```

## Adding a playground

1. Create a folder, e.g. `my-thing/`, with `index.html`, `style.css` and `script.js`.
2. In its `<head>`, load `../shared/base.css` (and `../shared/controls.css` if it has sliders) before its own CSS, copy the small theme script from `clamp/index.html` (it sets the theme before the page draws), and load `../shared/theme.js`.
3. Use `<main class="app">` with `.app__title` and `.app__intro` (set `--app-width` if needed). Add the back button (`.app__nav`, linking to `../index.html`) and the theme toggle (`#theme-toggle` inside `.app__actions`), the same markup as in `clamp/index.html`.
4. Use only the color tokens from `shared/base.css`, so light and dark both work.
5. Add a "Browser support" panel: load `../shared/compat.css` and `../shared/compat.js`, then add a `.compat` section with one `.compat__feature` per CSS feature (`data-feature` is the webstatus.dev feature ID; see the comment at the top of `compat.js`). Add the feature to its saved copy too.
6. Optional walkthrough: load the driver.js CSS/script and `../shared/tour.css` / `../shared/tour.js`, add the `#tour-start` button to `.app__actions`, and call `window.setupTour({ key, steps })` from the page script (see `siblings/script.js`).
7. Add a tile to `index.html` and a row to the table above.
8. Write its `README.md` and specs in `my-thing/docs/specs/`.
9. Run `pnpm lint` and fix anything it reports.

## Browser support data

Each playground shows a "Browser support" panel. It fetches live data from [webstatus.dev](https://webstatus.dev) (Google's Baseline tracker, built on MDN's browser data): the Baseline status and the first version of Chrome, Edge, Firefox, Safari, Chrome Android and Safari iOS with support. It also checks whether the visitor's own browser supports the feature, and links to Can I use, MDN and webstatus.dev.

Live data needs the page served over http(s), for example with `npx serve .` or GitHub Pages. When the page is opened straight from disk, or webstatus.dev can't be reached, the panel shows a saved copy (dated in `shared/compat.js`). To refresh the saved copy: `curl https://api.webstatus.dev/v1/features/<id>`.
