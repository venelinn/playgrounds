# CSS Playgrounds

Small interactive playgrounds for modern CSS: move a slider, see what changes, copy the code. Made for designers and developers.

Plain HTML, CSS and JavaScript. The pages are written as [EJS](https://ejs.co/) templates so the repeated parts (page head, header buttons, sliders, browser support panel) live in one place; [Vite](https://vitejs.dev/) turns them into static HTML. Nothing extra is shipped to the browser.

## Playgrounds

| Playground                                             | What it shows                                                                                                                   | Docs                                                                                                    |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [Clamp](src/pages/clamp/index.ejs)                     | Fluid type with `clamp(min, preferred, max)`: sizes, fonts, graph, CSS output                                                   | [README](src/pages/clamp/README.md) · [specs](src/pages/clamp/docs/specs/README.md)                     |
| [Siblings](src/pages/siblings/index.ejs)               | `sibling-index()` and `sibling-count()`: cards that pick their own color, number and animation delay                            | [README](src/pages/siblings/README.md) · [specs](src/pages/siblings/docs/specs/README.md)               |
| [Grid](src/pages/grid/index.ejs)                       | Up to N columns that drop when too narrow, no breakpoints; cells as containers. Based on our component library's `Row` / `Cell` | [README](src/pages/grid/README.md) · [specs](src/pages/grid/docs/specs/README.md)                       |
| [Subgrid](src/pages/subgrid/index.ejs)                 | Cards and form fields that share their parent grid's rows or columns so their parts line up; the container catch                | [README](src/pages/subgrid/README.md) · [specs](src/pages/subgrid/docs/specs/README.md)                 |
| [Popover](src/pages/popover/index.ejs)                 | Native popovers placed with anchor positioning: 12 placements, flipping, types, animation, no JavaScript needed                 | [README](src/pages/popover/README.md) · [specs](src/pages/popover/docs/specs/README.md)                 |
| [Container Units](src/pages/cq-units/index.ejs)        | Titles sized with `cqi`: each follows its own card (or section), not the screen                                                 | [README](src/pages/cq-units/README.md) · [specs](src/pages/cq-units/docs/specs/README.md)               |
| [Style Queries](src/pages/style-queries/index.ejs)     | Cards that take their look from the area they're in with `@container style()`, no modifier classes                              | [README](src/pages/style-queries/README.md) · [specs](src/pages/style-queries/docs/specs/README.md)     |
| [Scroll Carousel](src/pages/scroll-carousel/index.ejs) | A carousel where the browser does the swiping: scroll snap, arrows and dots, `--scroll-carousel-*` variables, CSS + HTML output | [README](src/pages/scroll-carousel/README.md) · [specs](src/pages/scroll-carousel/docs/specs/README.md) |

**Brands** (their own section on the index page): one page per design system, its type scale as `clamp()`.

| Brand                                                   | What it shows                                                                          | Docs                                 |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------ |
| [WestJet Vacations](src/pages/brands/westjet/index.ejs) | Every WestJet text style as `clamp()`, a resizable preview, the scale as CSS variables | [README](src/pages/brands/README.md) |

The [index page](src/pages/index.ejs) links to all of them.

## Run it

Node version is in `.nvmrc` (run `nvm use`).

```sh
pnpm install    # once
pnpm dev        # dev server on http://localhost:3010, reloads on every change
pnpm build      # static site in dist/
pnpm preview    # serve dist/ to check the build
```

`dist/` is plain HTML, CSS and JS with relative links, so it can go on any static host (GitHub Pages, Netlify) or in a sub-folder. It needs to be served over http(s): browsers don't run its scripts when the file is opened straight from disk.

## Deploy (Netlify)

`netlify.toml` has the settings: build command `pnpm build`, publish folder `dist`, plus cache headers for the hashed files in `dist/assets/`. Netlify picks up Node from `.nvmrc` and pnpm from `packageManager` in `package.json`, so it builds with the same versions as your machine.

## Linting and formatting

[Biome](https://biomejs.dev/) lints and formats the JavaScript, CSS, Markdown and JSON. It doesn't read `.ejs` templates.

```sh
pnpm lint          # check everything (run before committing)
pnpm lint:fix      # apply formatting and safe fixes
pnpm format        # formatting only
```

Settings are in `biome.json`: 2-space indents, double quotes, 120-character lines, the recommended rules.

## Structure

```
vite.config.js      Finds the pages, renders the EJS, builds to dist/
package.json        Scripts: dev, build, preview, lint
biome.json          Biome lint + format settings
src/
  partials/
    head.ejs        Page start: <head>, fonts, theme script, back link, tour + theme buttons, <h1>
    footer.ejs      "Browser support" panel + closing tags
  components/
    control/        Slider + number box (control.ejs)
  shared/
    base.css        Color tokens (dark + light), page base, panel, title, intro, corner buttons
    controls.css    Slider + number cards, warning, code card with Copy
    compat.css
    compat.js       "Browser support" panel: live Baseline data from webstatus.dev, saved copy as fallback
    theme.js        Light/dark toggle, one saved choice for every page
    tour.css
    tour.js         First-visit walkthrough (driver.js): window.setupTour({ key, steps })
    info.css
    groups.css      Bordered control groups (fieldset + legend) and radio cards (Container Units, Style Queries)
    toc.css         "On this page" nav right of the panel (head option `nav`); highlights the current section in Chrome 140+
    preview.css     Resizable text preview, card row and values list (Clamp, brands)
    info.js         Discreet "i" info icons with tooltips: window.setupInfoTips(steps), reusing the tour's wording
    grid.css        The component library's Row/Cell grid CSS + resizable demo stage (Grid, Subgrid)
    frame.js        Keeps a width slider, the frame's drag corner and the window in sync
  pages/
    index.ejs       Index page with a tile per playground (+ home.css)
    clamp/          Clamp playground (index.ejs, style.css, script.js, README, docs/specs)
    siblings/       Siblings playground (same layout)
    grid/           Grid playground (same layout)
    subgrid/        Subgrid playground (same layout)
    popover/        Popover playground (same layout)
    cq-units/       Container Units playground (same layout)
    style-queries/  Style Queries playground (same layout)
    scroll-carousel/ Scroll Carousel playground (+ carousel.css: the carousel's own CSS)
    brands/         Brand type scales: shared brand.ejs/.js/.css + one folder per brand (westjet/)
```

Every `src/pages/**/index.ejs` becomes a page at the same path: `src/pages/clamp/index.ejs` → `dist/clamp/index.html`. In templates, paths start at `src/`: `/shared/base.css`, `/pages/clamp/style.css`, `include("/partials/head", …)`.

## Templates

A page is the head partial, its own markup, and the footer partial:

```ejs
<%- include("/partials/head", {
  title: "Clamp Playground",
  description: "…",              // optional meta description
  tour: true,                    // driver.js + the "?" button
  styles: ["/shared/controls.css", "/pages/clamp/style.css"],
  scripts: ["/shared/tour.js", "/pages/clamp/script.js"],
}) %>
      <p class="app__intro">…</p>

      <div class="controls">
        <%- include("/components/control/control", {
          id: "min", label: "Min", min: 8, max: 80, step: 1, value: 20, unit: "px",
        }) %>
      </div>

<%- include("/partials/footer", {
  features: [{ feature: "min-max-clamp", test: "width: clamp(1px, 1vw, 2px)", caniuse: "clamp", mdn: "https://…" }],
  // optional: articles the playground is based on, shown under Browser support
  references: [{ title: "Article title", url: "https://…", source: "Author · Site" }],
}) %>
```

Each partial lists its options in a comment at the top. Scripts load as modules (`type="module"`), so they run after the page is parsed, in order, and share things only through `window` (`window.setupTour`, `window.setupInfoTips`, …).

## Adding a playground

1. Create `src/pages/my-thing/` with `index.ejs`, `style.css` and `script.js`.
2. Start `index.ejs` with the head partial (title, styles, scripts; add `/shared/controls.css` if it has sliders) and end it with the footer partial. The head partial adds the back link, theme toggle and the theme script.
3. Use `.app__intro` for the intro (set `--app-width` in the page CSS if needed) and the control component for sliders.
4. Use only the color tokens from `shared/base.css`, so light and dark both work.
5. Add a "Browser support" panel: load `/shared/compat.css` and `/shared/compat.js`, and pass `features` to the footer partial (`feature` is the webstatus.dev feature ID; see the comment at the top of `compat.js`). Add the feature to its saved copy too.
6. Optional walkthrough: pass `tour: true`, load `/shared/tour.css` and `/shared/tour.js`, and call `window.setupTour({ key, steps })` from the page script (see `siblings/script.js`).
7. Add a tile to `src/pages/index.ejs` and a row to the table above.
8. Write its `README.md` and specs in `my-thing/docs/specs/`.
9. Run `pnpm lint` and `pnpm build`, and fix anything they report.

## Browser support data

Each playground shows a "Browser support" panel. It fetches live data from [webstatus.dev](https://webstatus.dev) (Google's Baseline tracker, built on MDN's browser data): the Baseline status and the first version of Chrome, Edge, Firefox, Safari, Chrome Android and Safari iOS with support. It also checks whether the visitor's own browser supports the feature, and links to Can I use, MDN and webstatus.dev.

When webstatus.dev can't be reached, the panel shows a saved copy (dated in `src/shared/compat.js`). To refresh the saved copy: `curl https://api.webstatus.dev/v1/features/<id>`.
