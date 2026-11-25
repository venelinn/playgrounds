# 004 Themes

## Behavior

- Two themes: dark (the original look) and light.
- **First visit:** follows the system setting (`prefers-color-scheme`).
- **Toggle:** the round button in the top-right corner switches theme and saves the choice to `localStorage` (`clamp-theme`). A saved choice wins over the system setting.
- If the system setting changes and the user has never picked a theme, the page follows the change.
- **No flash:** a small inline script in `<head>` sets `data-theme` on `<html>` before the page draws.
- The button shows the theme you'd switch **to** (sun in dark mode, moon in light) and its `aria-label` / `title` say "Switch to light theme" or "Switch to dark theme".

## Tokens

All colors are custom properties on `:root` (dark) and `:root[data-theme="light"]`. Components only use these tokens; there are no color literals outside the two token blocks.

| Token | Use |
| --- | --- |
| `--bg`, `--bg-glow-1`, `--bg-glow-2` | Page background and its two glows |
| `--panel` | Main panel (translucent) |
| `--card`, `--field` | Cards; inputs and popovers |
| `--line` | Borders, dividers |
| `--text`, `--text-muted` | Text |
| `--accent`, `--accent2`, `--on-accent` | Brand gradient, highlights; text on an accent fill |
| `--min`, `--max`, `--pref` | Green / red / amber for clamped-to-min, clamped-to-max, current viewport |
| `--warning-bg`, `--warning-text` | Min > Max warning |
| `--shadow` | Shadows |

Each theme also sets `color-scheme` so native controls (selects, scrollbars) match.

## Done when

- [x] Follows the system on first visit
- [x] Toggle switches and remembers the choice across reloads
- [x] No flash of the wrong theme on load
- [x] Every part, including the walkthrough popovers, is readable in both themes
