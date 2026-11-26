const $ = (id) => document.getElementById(id);

const KEYS = ["min", "pref", "max", "vw"];
const fields = Object.fromEntries(KEYS.map((key) => [key, { range: $(key), number: $(`${key}-number`) }]));

const fontSelect = $("font");
const customFont = $("custom-font");
const weightSelect = $("weight");

const preview = document.querySelector(".preview");
const sizeBadge = $("size-badge");
const warning = $("warning");
const cssCode = $("css-code");
const values = $("values");
const copyButton = $("copy");

const graph = document.querySelector(".graph");
const curve = $("curve");
const zoneMin = $("zone-min");
const zoneMax = $("zone-max");
const lineMin = $("line-min");
const lineMax = $("line-max");
const lineVw = $("line-vw");
const axisStart = $("axis-start");
const axisEnd = $("axis-end");

const W = 1000;
const H = 300;
const ROOT_PX = 16;

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const round = (n, d = 2) => Number(n.toFixed(d));
const fmt = (n) => String(round(n));

/* ---------- Slider ↔ number sync ---------- */

function read(key) {
  return parseFloat(fields[key].range.value);
}

// Typed values may go beyond the slider's range: grow the slider to fit.
function setFromNumber(key) {
  const { range, number } = fields[key];
  const v = parseFloat(number.value);
  if (!Number.isFinite(v) || v < 0) return false;

  if (v < parseFloat(range.min)) range.min = String(v);
  if (v > parseFloat(range.max)) range.max = String(v);
  range.value = String(v);
  return true;
}

KEYS.forEach((key) => {
  const { range, number } = fields[key];

  range.addEventListener("input", () => {
    number.value = range.value;
    update();
  });

  number.addEventListener("input", () => {
    if (setFromNumber(key)) update();
  });

  // Leaving the box with an empty/invalid value restores the last good one.
  number.addEventListener("change", () => {
    if (!setFromNumber(key)) number.value = range.value;
  });
});

/* ---------- Fonts ---------- */

const fontStatus = $("font-status");
const injected = new Set();
let customFamily = ""; // resolved font-family stack for "Custom…"
let resolveToken = 0;

function injectStylesheet(href) {
  if (injected.has(href)) return Promise.resolve(true);
  injected.add(href);
  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.addEventListener("load", () => resolve(true), { once: true });
    link.addEventListener(
      "error",
      () => {
        link.remove();
        injected.delete(href);
        resolve(false);
      },
      { once: true },
    );
    document.head.append(link);
  });
}

// Google rejects a weight range for static fonts, so try the variable range first, then the plain family.
async function loadGoogleFamily(name) {
  const family = encodeURIComponent(name).replace(/%20/g, "+");
  const base = `https://fonts.googleapis.com/css2?family=${family}`;
  return (
    (await injectStylesheet(`${base}:wght@100..900&display=swap`)) || (await injectStylesheet(`${base}&display=swap`))
  );
}

// A font is "available" if text in it measures differently from the bare fallbacks.
const probe = document.createElement("canvas").getContext("2d");
function isFontAvailable(name) {
  const sample = "mmmmmmmmmmlli WQ@#1";
  return ["monospace", "serif", "sans-serif"].some((fallback) => {
    probe.font = `72px ${fallback}`;
    const base = probe.measureText(sample).width;
    probe.font = `72px "${name}", ${fallback}`;
    return probe.measureText(sample).width !== base;
  });
}

const quote = (name) => (/^[\w-]+$/.test(name) ? name : `"${name}"`);
const stackFor = (name) => `${quote(name)}, sans-serif`;

// Pull the first URL out of a pasted link, <link> tag or @import line.
function extractUrl(raw) {
  const m = raw.match(/https?:\/\/[^\s"'<>)]+/);
  return m ? m[0].replace(/&amp;/g, "&") : null;
}

// Family names a stylesheet URL will provide.
async function familiesFromCssUrl(url) {
  const u = new URL(url);
  if (u.hostname === "fonts.googleapis.com") {
    // css2: family=A:wght@..&family=B   |   css (v1): family=A:400|B
    return u.searchParams
      .getAll("family")
      .flatMap((f) => f.split("|"))
      .map((f) => f.split(":")[0].trim())
      .filter(Boolean);
  }
  try {
    const css = await (await fetch(url)).text();
    return [...new Set([...css.matchAll(/font-family:\s*["']?([^;"'}]+)/g)].map((m) => m[1].trim()))];
  } catch {
    return [];
  }
}

function setStatus(text, tone = "info") {
  fontStatus.textContent = text;
  fontStatus.dataset.tone = tone;
  fontStatus.hidden = !text;
}

async function resolveCustomFont() {
  const token = ++resolveToken;
  const raw = customFont.value.trim();
  const stale = () => token !== resolveToken;

  if (!raw) {
    customFamily = "";
    setStatus("");
    return update();
  }

  const url = extractUrl(raw);

  // 1) Google Fonts specimen page: fonts.google.com/specimen/Roboto+Slab
  const specimen = url?.match(/fonts\.google\.com\/specimen\/([^/?#]+)/);
  if (specimen) {
    const name = decodeURIComponent(specimen[1].replace(/\+/g, " "));
    setStatus(`Loading ${name}…`);
    const ok = await loadGoogleFamily(name);
    if (stale()) return;
    customFamily = stackFor(name);
    setStatus(ok ? `Loaded ${name} from Google Fonts` : `Couldn't load ${name}`, ok ? "ok" : "error");
    return update();
  }

  // 2) Any stylesheet link (Google Fonts embed, Bunny, Adobe…)
  if (url) {
    setStatus("Loading stylesheet…");
    const [ok, families] = await Promise.all([injectStylesheet(url), familiesFromCssUrl(url)]);
    if (stale()) return;
    if (!ok) {
      setStatus("Couldn't load that link", "error");
      return;
    }
    if (!families.length) {
      setStatus("Loaded, but no font-family found. Type the family name instead.", "error");
      return;
    }
    customFamily = stackFor(families[0]);
    const extra = families.length > 1 ? ` (+${families.length - 1} more in the link)` : "";
    setStatus(`Loaded ${families[0]}${extra}`, "ok");
    return update();
  }

  // 3) Plain name or full stack: local font first, then Google Fonts.
  const name = raw.split(",")[0].replace(/["']/g, "").trim();
  customFamily = raw.includes(",") ? raw : stackFor(name);
  update();

  if (isFontAvailable(name)) {
    setStatus(`Using installed font ${name}`, "ok");
    return;
  }
  setStatus(`Not installed, trying Google Fonts…`);
  await loadGoogleFamily(name);
  await document.fonts.load(`16px "${name}"`).catch(() => {});
  if (stale()) return;
  if (isFontAvailable(name)) setStatus(`Loaded ${name} from Google Fonts`, "ok");
  else setStatus(`"${name}" not found. Showing the fallback font.`, "error");
  update();
}

function currentFontFamily() {
  if (fontSelect.value !== "custom") return fontSelect.value;
  return customFamily || "system-ui, sans-serif";
}

fontSelect.addEventListener("change", () => {
  const isCustom = fontSelect.value === "custom";
  customFont.hidden = !isCustom;
  fontStatus.hidden = !isCustom || !fontStatus.textContent;
  if (isCustom) {
    customFont.focus();
  } else {
    const google = fontSelect.selectedOptions[0].dataset.google;
    if (google) loadGoogleFamily(google);
  }
  update();
});

let customTimer;
customFont.addEventListener("input", () => {
  clearTimeout(customTimer);
  customTimer = setTimeout(resolveCustomFont, 500);
});
customFont.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    clearTimeout(customTimer);
    resolveCustomFont();
  }
});
weightSelect.addEventListener("change", update);

/* ---------- Free text ---------- */

const sample = $("sample");
const previewText = $("text");
const PLACEHOLDER = "Fluid Typography";

sample.addEventListener("input", () => {
  previewText.textContent = sample.value || PLACEHOLDER;
});

/* ---------- Copy ---------- */

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(cssCode.textContent);
    copyButton.textContent = "Copied";
  } catch {
    copyButton.textContent = "Copy failed";
  }
  setTimeout(() => {
    copyButton.textContent = "Copy";
  }, 1400);
});

/* ---------- Render ---------- */

function update() {
  const min = read("min");
  const pref = read("pref");
  const max = read("max");
  const vw = read("vw");

  const prefPx = vw * (pref / 100);
  // CSS clamp(): when min > max, min wins.
  const size = Math.max(min, Math.min(prefPx, max));
  const state = min > max ? "min" : prefPx <= min ? "min" : prefPx >= max ? "max" : "fluid";

  const fontFamily = currentFontFamily();
  const weight = weightSelect.value;

  preview.style.setProperty("--preview-size", `${size}px`);
  preview.style.setProperty("--preview-font", fontFamily);
  preview.style.setProperty("--preview-weight", weight);
  sizeBadge.textContent = `${fmt(size)}px`;
  preview.dataset.state = state;

  warning.hidden = min <= max;
  warning.textContent =
    min > max ? `Min (${fmt(min)}px) is larger than max (${fmt(max)}px). clamp() will always return the min.` : "";

  cssCode.textContent = `font-family: ${fontFamily};
font-weight: ${weight};
font-size: clamp(${fmt(min)}px, ${fmt(pref)}vw, ${fmt(max)}px);
/* rem: clamp(${round(min / ROOT_PX, 4)}rem, ${fmt(pref)}vw, ${round(max / ROOT_PX, 4)}rem) */`;

  const fluidStart = pref > 0 ? (min * 100) / pref : Infinity;
  const fluidEnd = pref > 0 ? (max * 100) / pref : Infinity;
  const stateLabel = { min: "Clamped to min", fluid: "Fluid", max: "Clamped to max" }[state];

  values.innerHTML = [
    ["Viewport", `${fmt(vw)}px`],
    ["Preferred", `${fmt(prefPx)}px`],
    ["Result", `<strong>${fmt(size)}px</strong>`],
    ["State", stateLabel],
    ["Fluid between", min <= max && pref > 0 ? `${Math.round(fluidStart)}px – ${Math.round(fluidEnd)}px` : "n/a"],
  ]
    .map(([k, v]) => `<div class="stats__row"><dt>${k}</dt><dd>${v}</dd></div>`)
    .join("");

  drawGraph({ min, pref, max, vw, size, fluidStart, fluidEnd });
}

function drawGraph({ min, pref, max, vw, size, fluidStart, fluidEnd }) {
  const vwMin = parseFloat(fields.vw.range.min);
  const vwMax = parseFloat(fields.vw.range.max);
  const yTop = Math.max(min, max) * 1.15 || 1;

  const toX = (v) => ((clamp(v, vwMin, vwMax) - vwMin) / (vwMax - vwMin)) * W;
  const toY = (px) => H - (px / yTop) * H;

  const points = [];
  for (let i = 0; i <= 200; i++) {
    const v = vwMin + (i / 200) * (vwMax - vwMin);
    const px = Math.max(min, Math.min(v * (pref / 100), max));
    points.push(`${round((i / 200) * W)},${round(toY(px))}`);
  }
  curve.setAttribute("d", `M${points.join(" L")}`);

  // min > max: clamp() is pinned to min everywhere.
  const xStart = min > max ? W : toX(fluidStart);
  const xEnd = min > max ? W : toX(fluidEnd);
  zoneMin.setAttribute("x", "0");
  zoneMin.setAttribute("width", String(round(xStart)));
  zoneMax.setAttribute("x", String(round(xEnd)));
  zoneMax.setAttribute("width", String(round(W - xEnd)));

  [
    [lineMin, min],
    [lineMax, max],
  ].forEach(([line, px]) => {
    line.setAttribute("y1", String(round(toY(px))));
    line.setAttribute("y2", String(round(toY(px))));
  });
  lineVw.setAttribute("x1", String(round(toX(vw))));
  lineVw.setAttribute("x2", String(round(toX(vw))));

  graph.style.setProperty("--dot-x", String(toX(vw) / W));
  graph.style.setProperty("--dot-y", String(toY(size) / H));

  axisStart.textContent = `${fmt(vwMin)}px`;
  axisEnd.textContent = `${fmt(vwMax)}px`;
}

update();

/* ---------- Walkthrough (driver.js) ---------- */

const TOUR_STEPS = [
  {
    popover: {
      title: "Welcome to the Clamp Playground",
      description: "A quick tour of what each part does. It takes about 30 seconds.",
    },
  },
  {
    element: ".app__intro",
    popover: {
      title: "What clamp() does",
      description:
        "Text scales with the screen, but never below a <strong>min</strong> size or above a <strong>max</strong> size.",
    },
  },
  {
    element: ".control:has(#min)",
    popover: {
      title: "Min",
      description:
        "The smallest the text can get, on small screens. Drag the slider or type an exact value in the box.",
    },
  },
  {
    element: ".control:has(#pref)",
    popover: {
      title: "Preferred",
      description:
        "How much the text grows with the screen, as a % of its width. <strong>5vw</strong> on a 900px screen = 45px.",
    },
  },
  {
    element: ".control:has(#max)",
    popover: {
      title: "Max",
      description: "The biggest the text can get, on large screens.",
    },
  },
  {
    element: ".control:has(#vw)",
    popover: {
      title: "Viewport",
      description: "A pretend screen width. Change it to see your text at phone, tablet or desktop size.",
    },
  },
  {
    element: ".control:has(#font)",
    popover: {
      title: "Font family",
      description:
        "Pick a font, or choose <strong>Custom…</strong> and type the name of a font on your computer or paste a Google Fonts link.",
    },
  },
  {
    element: ".control:has(#weight)",
    popover: {
      title: "Weight",
      description: "How bold the text is, from 300 (light) to 900 (black).",
    },
  },
  {
    element: "#sample",
    popover: {
      title: "Your text",
      description: "Type your own text here, for example a real headline from your design.",
    },
  },
  {
    element: ".preview",
    popover: {
      title: "Preview",
      description:
        "Your text at the size clamp() gives for this screen. The badge shows the size: green when it's at min, red when it's at max.",
    },
  },
  {
    element: ".card:has(.graph)",
    popover: {
      title: "Size across screens",
      description:
        "Text size from 320px to 1920px screens. Shaded areas are where it's stuck at min (green) or max (red). The dot is your current viewport.",
    },
  },
  {
    element: ".card:has(#css-code)",
    popover: {
      title: "CSS for developers",
      description: "The code that gives this result. Copy it into a ticket or your design spec.",
    },
  },
  {
    element: ".card:has(#values)",
    popover: {
      title: "The numbers",
      description: "Exact sizes for the current viewport, and the screen widths where the text is still growing.",
    },
  },
  {
    element: ".compat",
    popover: {
      title: "Browser support",
      description:
        "Which browsers support clamp(), since which version, and whether yours does. Links go to Can I use and MDN.",
    },
  },
  {
    element: ".app__actions",
    popover: {
      title: "Replay or switch theme",
      description:
        "Use <strong>?</strong> to see this tour again, and the other button to switch between light and dark.",
    },
  },
];

window.setupTour({ key: "clamp-tour-done", steps: TOUR_STEPS });
