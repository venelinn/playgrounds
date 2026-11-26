// "Browser support" panel shared by every playground.
// Live data: webstatus.dev (Baseline + first supported version per browser, sourced from MDN).
// If that can't be reached, a saved copy below is shown instead.
//
// Markup:
//   <section class="compat" aria-labelledby="compat-title">
//     <h2 class="compat__title" id="compat-title">Browser support</h2>
//     <div class="compat__list">
//       <div class="compat__feature" data-feature="min-max-clamp"
//            data-test="width: clamp(1px, 1vw, 2px)"
//            data-caniuse="clamp"
//            data-label="Optional display name"
//            data-note="Optional note shown under the links"
//            data-mdn="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp"></div>
//     </div>
//     <p class="compat__source"></p>
//   </section>
(() => {
  const API = "https://api.webstatus.dev/v1/features/";

  // Saved 2026-11-26 from api.webstatus.dev. Refresh with:
  //   curl https://api.webstatus.dev/v1/features/<id>
  const SNAPSHOT_DATE = "2026-11-26";
  const SNAPSHOT = {
    "min-max-clamp": {
      name: "min(), max(), and clamp()",
      baseline: { status: "widely", low_date: "2020-07-28", high_date: "2023-01-28" },
      browser_implementations: {
        chrome: { version: "79" },
        edge: { version: "79" },
        firefox: { version: "75" },
        safari: { version: "13.1" },
        chrome_android: { version: "79" },
        firefox_android: { version: "79" },
        safari_ios: { version: "13.4" },
      },
    },
    "sibling-count": {
      name: "sibling-count() and sibling-index()",
      baseline: { status: "newly", low_date: "2026-08-18" },
      browser_implementations: {
        chrome: { version: "138" },
        edge: { version: "138" },
        firefox: { version: "154" },
        safari: { version: "26.2" },
        chrome_android: { version: "138" },
        firefox_android: { version: "154" },
        safari_ios: { version: "26.2" },
      },
    },
    grid: {
      name: "Grid",
      baseline: { status: "widely", low_date: "2017-10-17", high_date: "2020-04-17" },
      browser_implementations: {
        chrome: { version: "57" },
        edge: { version: "16" },
        firefox: { version: "52" },
        safari: { version: "10.1" },
        chrome_android: { version: "57" },
        firefox_android: { version: "52" },
        safari_ios: { version: "10.3" },
      },
    },
    "container-queries": {
      name: "Container queries (size)",
      baseline: { status: "widely", low_date: "2023-02-14", high_date: "2025-08-14" },
      browser_implementations: {
        chrome: { version: "105" },
        edge: { version: "105" },
        firefox: { version: "110" },
        safari: { version: "16" },
        chrome_android: { version: "105" },
        firefox_android: { version: "110" },
        safari_ios: { version: "16" },
      },
    },
    subgrid: {
      name: "Subgrid",
      baseline: { status: "widely", low_date: "2023-09-15", high_date: "2026-03-15" },
      browser_implementations: {
        chrome: { version: "117" },
        edge: { version: "117" },
        firefox: { version: "71" },
        safari: { version: "16" },
        chrome_android: { version: "117" },
        firefox_android: { version: "79" },
        safari_ios: { version: "16" },
      },
    },
    popover: {
      name: "Popover",
      baseline: { status: "newly", low_date: "2025-01-27" },
      browser_implementations: {
        chrome: { version: "116" },
        edge: { version: "116" },
        firefox: { version: "125" },
        safari: { version: "17" },
        chrome_android: { version: "116" },
        firefox_android: { version: "125" },
        safari_ios: { version: "18.3" },
      },
    },
    "anchor-positioning": {
      name: "Anchor positioning",
      baseline: { status: "limited" },
      browser_implementations: {
        chrome: { version: "157" },
        edge: { version: "157" },
        safari: { version: "27" },
        chrome_android: { version: "157" },
        safari_ios: { version: "27" },
      },
    },
    "popover-hint": {
      name: 'popover="hint"',
      baseline: { status: "limited" },
      browser_implementations: {
        chrome: { version: "151" },
        edge: { version: "151" },
        firefox: { version: "153" },
        chrome_android: { version: "151" },
        firefox_android: { version: "153" },
      },
    },
    "starting-style": {
      name: "@starting-style",
      baseline: { status: "newly", low_date: "2024-08-06" },
      browser_implementations: {
        chrome: { version: "117" },
        edge: { version: "117" },
        firefox: { version: "129" },
        safari: { version: "17.5" },
        chrome_android: { version: "117" },
        firefox_android: { version: "129" },
        safari_ios: { version: "17.5" },
      },
    },
    "registered-custom-properties": {
      name: "Registered custom properties (@property)",
      baseline: { status: "newly", low_date: "2024-07-09" },
      browser_implementations: {
        chrome: { version: "85" },
        edge: { version: "85" },
        firefox: { version: "128" },
        safari: { version: "16.4" },
        chrome_android: { version: "85" },
        firefox_android: { version: "128" },
        safari_ios: { version: "16.4" },
      },
    },
  };

  const BROWSERS = [
    ["chrome", "Chrome"],
    ["edge", "Edge"],
    ["firefox", "Firefox"],
    ["safari", "Safari"],
    ["chrome_android", "Chrome Android"],
    ["safari_ios", "Safari iOS"],
  ];

  const monthYear = new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" });
  const fmtDate = (iso) => (iso ? monthYear.format(new Date(`${iso}T00:00:00`)) : "");
  const escapeHtml = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function baselineBadge(b = {}) {
    if (b.status === "widely") {
      return { tone: "widely", label: "Widely available", note: `Baseline since ${fmtDate(b.high_date)}` };
    }
    if (b.status === "newly") {
      return { tone: "newly", label: `Newly available`, note: `Baseline since ${fmtDate(b.low_date)}` };
    }
    return { tone: "limited", label: "Limited availability", note: "Not in all major browsers yet" };
  }

  // data-test is "property: value" for CSS.supports, "js:name" to check for a CSS.<name> function,
  // or "dom:name" for one of the DOM checks below.
  const DOM_TESTS = {
    popover: () => "popover" in HTMLElement.prototype,
    "popover-hint": () => {
      const el = document.createElement("div");
      el.popover = "hint";
      return el.popover === "hint";
    },
  };

  function yourBrowser(test) {
    if (!test) return "";
    const i = test.indexOf(":");
    let ok;
    if (test.startsWith("js:")) ok = typeof CSS[test.slice(3)] === "function";
    else if (test.startsWith("dom:")) ok = Boolean(DOM_TESTS[test.slice(4)]?.());
    else ok = CSS.supports(test.slice(0, i).trim(), test.slice(i + 1).trim());
    return `<span class="compat__you" data-ok="${ok}">${ok ? "✓ Works in your browser" : "✗ Not in your browser"}</span>`;
  }

  function render(el, data) {
    const badge = baselineBadge(data.baseline);
    const impl = data.browser_implementations || {};
    const links = [
      el.dataset.caniuse &&
        `<a href="https://caniuse.com/?search=${encodeURIComponent(el.dataset.caniuse)}" target="_blank" rel="noopener">Can I use</a>`,
      el.dataset.mdn && `<a href="${escapeHtml(el.dataset.mdn)}" target="_blank" rel="noopener">MDN</a>`,
      `<a href="https://webstatus.dev/features/${encodeURIComponent(el.dataset.feature)}" target="_blank" rel="noopener">webstatus.dev</a>`,
    ]
      .filter(Boolean)
      .join("");

    el.innerHTML = `
      <div class="compat__head">
        <span class="compat__name">${escapeHtml(el.dataset.label || data.name || el.dataset.feature)}</span>
        <span class="compat__badge" data-tone="${badge.tone}" title="${escapeHtml(badge.note)}">${badge.label}</span>
      </div>
      <p class="compat__note">${escapeHtml(badge.note)} ${yourBrowser(el.dataset.test)}</p>
      <ul class="compat__browsers">
        ${BROWSERS.map(([key, label]) => {
          const v = impl[key]?.version;
          return `<li class="compat__browser" data-ok="${Boolean(v)}">
            <span class="compat__browser-name">${label}</span>
            <span class="compat__version">${v ? `${escapeHtml(v)}+` : "No"}</span>
          </li>`;
        }).join("")}
      </ul>
      <p class="compat__links">${links}</p>
      ${el.dataset.note ? `<p class="compat__extra">${escapeHtml(el.dataset.note)}</p>` : ""}`;
  }

  async function load(el) {
    const id = el.dataset.feature;
    try {
      const res = await fetch(API + encodeURIComponent(id), { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(res.status);
      render(el, await res.json());
      return "live";
    } catch {
      if (SNAPSHOT[id]) render(el, SNAPSHOT[id]);
      else el.innerHTML = `<p class="compat__note">Couldn't load support data for ${escapeHtml(id)}.</p>`;
      return "saved";
    }
  }

  document.querySelectorAll(".compat").forEach(async (section) => {
    const features = [...section.querySelectorAll(".compat__feature")];
    // Show the saved copy right away, then swap in live data.
    for (const el of features) {
      if (SNAPSHOT[el.dataset.feature]) render(el, SNAPSHOT[el.dataset.feature]);
    }
    const results = await Promise.all(features.map(load));
    const source = section.querySelector(".compat__source");
    if (source) {
      source.textContent = results.every((r) => r === "live")
        ? "Live data from webstatus.dev (MDN browser data). Versions are the first release with support."
        : location.protocol === "file:"
          ? `Saved data from ${fmtDate(SNAPSHOT_DATE)}. Live data loads when the page is served from a web server.`
          : `Saved data from ${fmtDate(SNAPSHOT_DATE)} (webstatus.dev couldn't be reached).`;
    }
  });
})();
