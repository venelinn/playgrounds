// A brand page: one design system's type scale as clamp(), driven by its typography.json.
//
// The tokens have one fixed size per style. Each becomes clamp(phone size, size ÷ desktop width, size):
//   max   = the token size (desktop)
//   min   = the size minus "Smaller on phones" % of the part above `shrink.above` px (body size),
//           or the style's own "mobile" size
//   pref  = size ÷ desktop width × 100 (vw), so it reaches the desktop size at that width
//   lh    = line height ÷ size, unitless, so it scales with the text

const $ = (id) => document.getElementById(id);
const ROOT_PX = 16;
const round = (n, d = 2) => Number(n.toFixed(d));
const fmt = (n) => String(round(n));
const rem = (px) => `${round(px / ROOT_PX, 4)}rem`;

export function setupBrand(brand) {
  const styleSelect = $("style");
  const shrink = { range: $("shrink"), number: $("shrink-number") };
  const vw = { range: $("vw"), number: $("vw-number") };
  const preview = document.querySelector(".preview");
  const previewText = $("text");
  const sample = $("sample");
  const sizeBadge = $("size-badge");
  const previewNote = $("preview-note");
  const cssCode = $("css-code");
  const values = $("values");
  const scaleCode = $("scale-code");

  // The brand font, from Google Fonts.
  const family = encodeURIComponent(brand.font.family).replace(/%20/g, "+");
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@100..900&display=swap`;
  document.head.append(link);
  preview.style.setProperty("--preview-font", brand.font.stack);

  shrink.range.value = shrink.number.value = String(brand.shrink.percent);
  styleSelect.append(...brand.styles.map((style) => new Option(style.label, style.name)));

  const current = () => brand.styles.find((s) => s.name === styleSelect.value);

  function mobileSize(style) {
    if (style.mobile) return style.mobile;
    if (style.size <= brand.shrink.above) return style.size;
    return round(style.size - ((style.size - brand.shrink.above) * Number(shrink.range.value)) / 100, 1);
  }

  function clampFor(style) {
    return {
      min: mobileSize(style),
      max: style.size,
      pref: round((style.size / brand.desktop) * 100, 2),
      lh: round(style.lineHeight / style.size, 3),
    };
  }

  const clampText = ({ min, pref, max }, u) => (min === max ? u(max) : `clamp(${u(min)}, ${fmt(pref)}vw, ${u(max)})`);

  // Every style as CSS custom properties, named like the design tokens.
  function scaleCss() {
    const seen = new Set();
    const lines = brand.styles.flatMap((style) => {
      const c = clampFor(style);
      const size = `--${brand.prefix}-font-size-${style.token ?? style.name}`;
      const lh = `--${brand.prefix}-line-height-${style.lineHeightToken ?? style.name}`;
      const out = [];
      if (!seen.has(size)) out.push(`  ${size}: ${clampText(c, rem)}; /* ${fmt(c.min)}px → ${fmt(c.max)}px */`);
      if (!seen.has(lh)) out.push(`  ${lh}: ${c.lh};`);
      seen.add(size);
      seen.add(lh);
      return out;
    });
    return `/* ${brand.name} type scale. Phones: ${shrink.range.value}% smaller above ${brand.shrink.above}px.
   Desktop size from ${brand.desktop}px. */
:root {
${lines.join("\n")}
}`;
  }

  function update() {
    const style = current();
    const c = clampFor(style);
    const width = Number(vw.range.value);
    const prefPx = (width * c.pref) / 100;
    const size = Math.max(c.min, Math.min(prefPx, c.max));
    const state = c.min === c.max || prefPx <= c.min ? "min" : prefPx >= c.max ? "max" : "fluid";

    preview.style.setProperty("--preview-size", `${size}px`);
    preview.style.setProperty("--preview-weight", String(style.weight));
    preview.style.setProperty("--preview-line-height", String(c.lh));
    preview.style.setProperty("--preview-tracking", style.letterSpacing ?? "normal");
    preview.style.setProperty("--preview-transform", style.uppercase ? "uppercase" : "none");
    preview.dataset.state = c.min === c.max ? "fluid" : state;
    sizeBadge.textContent = `${fmt(size)}px`;
    updatePreviewNote();

    cssCode.textContent = [
      `font-family: ${brand.font.stack};`,
      `font-weight: ${style.weight};`,
      `font-size: ${clampText(c, rem)};`,
      `line-height: ${c.lh};`,
      style.letterSpacing && `letter-spacing: ${style.letterSpacing};`,
      style.uppercase && "text-transform: uppercase;",
      `/* px: ${clampText(c, (px) => `${fmt(px)}px`)} */`,
    ]
      .filter(Boolean)
      .join("\n");

    const fixed = c.min === c.max;
    const stateLabel = fixed
      ? "Same on every screen"
      : { min: "Phone size", fluid: "Growing", max: "Desktop size" }[state];
    values.innerHTML = [
      ["Now", `<strong>${fmt(size)}px</strong> at ${fmt(width)}px`],
      ["State", stateLabel],
      ["Phones", `${fmt(c.min)}px`],
      ["Desktop", `${fmt(c.max)}px`],
      ["Grows between", fixed ? "n/a" : `${Math.round((c.min * 100) / c.pref)}px – ${brand.desktop}px`],
    ]
      .map(([k, v]) => `<div class="stats__row"><dt>${k}</dt><dd>${v}</dd></div>`)
      .join("");

    scaleCode.textContent = scaleCss();
  }

  /* ---------- Sliders ---------- */

  for (const [field, onInput] of [
    [shrink, update],
    [vw, sizePreview],
  ]) {
    field.range.addEventListener("input", () => {
      field.number.value = field.range.value;
      onInput();
    });
    field.number.addEventListener("input", () => {
      if (field.number.value === "" || !Number.isFinite(Number(field.number.value))) return;
      field.range.value = field.number.value; // the slider keeps it inside its range
      onInput();
    });
    field.number.addEventListener("change", () => {
      field.number.value = field.range.value;
    });
  }

  styleSelect.addEventListener("change", update);
  sample.addEventListener("input", () => {
    previewText.textContent = sample.value || " ";
  });

  /* ---------- Resizable preview: its width is the Viewport ---------- */

  function sizePreview() {
    preview.style.removeProperty("width"); // drop any width left by dragging the corner
    preview.style.setProperty("--preview-width", `${vw.range.value}px`);
    update();
  }

  // Corner drag → the Viewport follows the preview's width.
  new ResizeObserver(() => {
    const shown = Math.round(preview.getBoundingClientRect().width);
    if (preview.style.width !== "") {
      vw.range.value = vw.number.value = String(shown);
      update();
    }
    updatePreviewNote(shown);
  }).observe(preview);

  function updatePreviewNote(shown = Math.round(preview.getBoundingClientRect().width)) {
    const width = Number(vw.range.value);
    previewNote.textContent =
      width > shown ? `${fmt(width)}px · too wide, shown at ${shown}px` : `${shown}px wide · drag the corner ↘`;
  }

  /* ---------- Copy ---------- */

  for (const [button, code] of [
    [$("copy"), cssCode],
    [$("scale-copy"), scaleCode],
  ]) {
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = "Copied";
      } catch {
        button.textContent = "Copy failed";
      }
      setTimeout(() => {
        button.textContent = "Copy";
      }, 1400);
    });
  }

  // Start full width: the preview fills the panel and the Viewport follows it (as if dragged),
  // also when the window resizes. Moving the Viewport slider sets an exact width instead.
  preview.style.width = "100%";
  update();

  window.setupInfoTips([
    {
      info: { target: 'label[for="style"]' },
      popover: {
        title: "Style",
        description: `A text style from the ${brand.name} design tokens, with its font, weight and line height.`,
      },
    },
    {
      info: { target: 'label[for="shrink-number"]' },
      popover: {
        title: "Smaller on phones",
        description: `The tokens have one size per style, used as the desktop size. This sets the phone size: a style loses this % of what it has above ${brand.shrink.above}px, so <strong>80px</strong> at 40% becomes <strong>54.4px</strong>. Body sizes stay the same.`,
      },
    },
    {
      info: { target: 'label[for="vw-number"]' },
      popover: {
        title: "Viewport",
        description: `A pretend screen width. Styles reach their desktop size at ${brand.desktop}px. You can also drag the preview's corner.`,
      },
    },
  ]);
}
