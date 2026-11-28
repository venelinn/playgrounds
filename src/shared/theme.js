// Light/dark theme toggle shared by every playground.
// The page's <head> sets data-theme before first paint (see THEME_KEY there too).
(() => {
  const THEME_KEY = "playground-theme";
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  const read = () => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  };

  function syncLabel() {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    toggle.setAttribute("aria-label", `Switch to ${next} theme`); // also the CSS tooltip's text
  }

  toggle.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, root.dataset.theme);
    } catch {}
    syncLabel();
  });

  // Follow system changes until the user picks a theme explicitly.
  matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    if (read()) return;
    root.dataset.theme = e.matches ? "light" : "dark";
    syncLabel();
  });

  syncLabel();
})();
