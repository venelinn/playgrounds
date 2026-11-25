# 002 Fonts

## Goal

Let designers preview their own typeface: a preset, a font installed on their computer, or any Google Fonts family.

## Font family

A dropdown with presets:

| Preset | Source |
| --- | --- |
| System UI | Built in |
| Inter, Space Grotesk, DM Sans, Playfair Display, Fraunces, JetBrains Mono | Google Fonts, loaded when picked |
| Georgia, UI Monospace | Built in |
| Custom… | Shows a text box (see below) |

## Custom font

Choosing **Custom…** shows a text box: "Font name or Google Fonts link". It loads 500 ms after typing stops, or right away on Enter. A status line under the box reports the result: muted while loading, green on success, red on failure.

| Input | What happens | Status |
| --- | --- | --- |
| Installed font name, e.g. `Avenir Next` | Used directly | "Using installed font Avenir Next" |
| Name that isn't installed, e.g. `Lora` | Tries Google Fonts | "Loaded Lora from Google Fonts", or "not found. Showing the fallback font." |
| Full stack, e.g. `Lora, serif` | Used as written; the first name is checked/loaded | As above |
| Google Fonts CSS link `fonts.googleapis.com/css2?family=…` | Stylesheet loaded; family names read from the URL | "Loaded Roboto Slab (+1 more in the link)" |
| Pasted `<link href="…">` or `@import url(…)` | The URL is pulled out, then as above | Same |
| Specimen page `fonts.google.com/specimen/Name` | That family is loaded from Google Fonts | "Loaded Name from Google Fonts" |
| Other stylesheet link (Bunny, Adobe…) | Loaded; the CSS is fetched to find `font-family` names | "Loaded X", or "no font-family found" |

Details:

- **Is it installed?** Text is measured on a canvas in the font and in three generic fallbacks. If any width differs, the font is there. (`document.fonts.check()` can't be used: it returns true for fonts that don't exist.)
- **Google loading:** first ask for the variable weight range (`:wght@100..900`). Static fonts reject that, so on error retry with the plain family.
- A link with several families uses the first one. The status line says how many more there are.
- Names are quoted in the output CSS when needed (`"Roboto Slab", sans-serif`); `sans-serif` is the fallback.
- If you type quickly, only the latest request's result is applied; earlier ones are ignored.

## Weight

Dropdown: 300, 400, 500, 600, 700, 800 (default), 900.

## Done when

- [x] Presets load their Google font on selection
- [x] Installed fonts work without a network request
- [x] Google CSS links, `<link>`/`@import` snippets and specimen URLs all load
- [x] Missing fonts show a red status and fall back
- [x] Weight changes the preview and the CSS output

## Possible next steps

- When a link holds several families, let the user pick which one to use.

## Code

`resolveCustomFont()`, `loadGoogleFamily()`, `isFontAvailable()`, `familiesFromCssUrl()` in `script.js`.
