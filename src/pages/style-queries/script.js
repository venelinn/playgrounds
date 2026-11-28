// The demo runs on the CSS this script writes into <style id="live-css">: the same text as the CSS card.
// The script only builds that CSS from the controls and counts what changed; the cards react in CSS.

const $ = (id) => document.getElementById(id);

const page = $("page");
const frame = $("frame");
const stage = document.querySelector(".stage");
const liveCss = $("live-css");
const cssCode = $("css-code");
const summary = $("summary");
const count = $("count");
const onlyBeside = $("only-beside");
const copyButton = $("copy");

const fields = Object.fromEntries(["width", "beside"].map((k) => [k, { range: $(k), number: $(`${k}-number`) }]));
const read = (k) => Number(fields[k].range.value);
const choice = (name) => document.querySelector(`input[name="${name}"]:checked`).value;

const SIDEBAR_WIDTH = 260;

/* ---------- The CSS ---------- */

function buildCss() {
  const density = choice("density");
  const row = choice("layout") === "row";
  const at = read("beside");
  const sidebarOnlyBeside = density === "sidebar" && onlyBeside.checked;

  const settings = [
    density === "page" && `.page {\n  --deal-density: compact;\n}`,
    density === "sidebar" && !sidebarOnlyBeside && `.sidebar {\n  --deal-density: compact;\n}`,
    row && `.main {\n  --deal-layout: row;\n}`,
  ].filter(Boolean);

  return `/* The page is a size container */
.page {
  container: page / inline-size;
}

/* Room for both: the sidebar moves beside the main area */
@container page (width > ${at}px) {
  .layout {
    grid-template-columns: minmax(0, 1fr) ${SIDEBAR_WIDTH}px;
  }${
    sidebarOnlyBeside
      ? `

  /* …and only then its cards go compact */
  .sidebar {
    --deal-density: compact;
  }`
      : ""
  }
}
${settings.length ? `\n/* The areas hold the settings. The cards have no modifier classes. */\n${settings.join("\n\n")}\n` : ""}
/* The card. Defaults sit in the var() fallbacks */
.deal {
  display: grid;
  grid-template-areas: var(--_areas, "img" "place" "title" "text" "price");
  grid-template-columns: var(--_columns, minmax(0, 1fr));
  gap: var(--_gap, 6px 14px);
  padding: var(--_padding, 14px);
}

.deal__img { grid-area: img; height: var(--_img-height, 110px); }
.deal__place { grid-area: place; }
.deal__title { grid-area: title; font-size: var(--_title-size, 1.1rem); }
.deal__text { grid-area: text; display: var(--_text, block); }
.deal__price { grid-area: price; }

/* Side by side: picture on the left, text on the right */
@container style(--deal-layout: row) {
  .deal {
    --_areas: "img place" "img title" "img text" "img price";
    --_columns: 40% minmax(0, 1fr);
    --_img-height: auto;
    --_title-size: 1.25rem;
  }
}

/* Compact: a small picture and no description */
@container style(--deal-density: compact) {
  .deal {
    --_areas: "img place" "img title" "img price";
    --_columns: 56px minmax(0, 1fr);
    --_gap: 2px 12px;
    --_padding: 10px;
    --_img-height: 56px;
    --_title-size: 0.95rem;
    --_text: none;
  }
}`;
}

/* ---------- Readouts ---------- */

// What the cards ended up with, read from the browser (not worked out here).
function updateReadouts() {
  const cards = [...page.querySelectorAll(".deal")];
  const value = (card, prop) => getComputedStyle(card).getPropertyValue(prop).trim();
  const compact = cards.filter((card) => value(card, "--deal-density") === "compact").length;
  const row = cards.filter((card) => value(card, "--deal-layout") === "row").length;

  const width = Math.round(page.getBoundingClientRect().width);
  const beside = width > read("beside");
  summary.innerHTML = `page <strong>${width}px</strong> · sidebar ${beside ? "beside" : "underneath"}`;

  const classes = [
    compact && `<code>.deal--compact</code> ×${compact}`,
    row && `<code>.deal--row</code> ×${row}`,
  ].filter(Boolean);
  count.innerHTML = classes.length
    ? `With modifier classes you'd add ${classes.join(" and ")} to the HTML, and change them again when the sidebar moves. Here: <strong>none</strong>, the areas decide.`
    : "Every card is at its default. Pick where cards go compact, or switch the main area to side by side.";
}

/* ---------- Apply ---------- */

function apply() {
  const css = buildCss();
  liveCss.textContent = css;
  cssCode.textContent = css;
  onlyBeside.disabled = choice("density") !== "sidebar";
  requestAnimationFrame(updateReadouts);
}

const frameWidth = window.bindFrameWidth({
  stage,
  frame,
  target: page,
  range: fields.width.range,
  number: fields.width.number,
  onChange: updateReadouts,
});

for (const [key, { range, number }] of Object.entries(fields)) {
  const onChange = () => {
    if (key === "width") frameWidth.set(read("width"));
    apply();
  };
  range.addEventListener("input", () => {
    number.value = range.value;
    onChange();
  });
  number.addEventListener("input", () => {
    const v = Number(number.value);
    if (number.value === "" || !Number.isFinite(v)) return;
    range.value = String(Math.min(Math.max(v, Number(range.min)), Number(range.max)));
    onChange();
  });
  number.addEventListener("change", () => {
    number.value = range.value;
  });
}

for (const input of document.querySelectorAll('input[name="density"], input[name="layout"]')) {
  input.addEventListener("change", apply);
}
onlyBeside.addEventListener("change", apply);
new ResizeObserver(() => updateReadouts()).observe(page);

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

apply();

/* ---------- Walkthrough + info icons ---------- */

const TOUR_STEPS = [
  {
    popover: {
      title: "Welcome to the Style Queries Playground",
      description: "A quick tour of cards that take their look from the area they're in. About 30 seconds.",
    },
  },
  {
    element: ".app__intro",
    popover: {
      title: "The idea",
      description:
        "The area holds a setting (a custom property). The cards check it with <code>@container style()</code> and restyle themselves. No classes on the cards.",
    },
  },
  {
    element: ".group--page",
    info: { target: "#page-title" },
    popover: {
      title: "Page",
      description:
        "How wide the page is, and from what width the sidebar sits beside the main area instead of under it.",
    },
  },
  {
    element: ".control:has(#beside)",
    info: { target: 'label[for="beside-number"]' },
    popover: {
      title: "Sidebar beside from",
      description:
        "A size query on the page. Above this width the sidebar moves to the right, and (with the switch on) its cards go compact.",
    },
  },
  {
    element: ".group--page .group__switch",
    info: { target: ".group--page .switch__label" },
    popover: {
      title: "Compact only when beside",
      description:
        "The setting itself sits inside the size query, so the sidebar's cards are compact only when it's narrow, next to the main area. Under it, they get full size back.",
    },
  },
  {
    element: ".group--density",
    info: { target: "#density-title" },
    popover: {
      title: "Compact cards in",
      description:
        "Which area sets <code>--deal-density: compact</code>. Set on <code>.page</code>, every card inside picks it up.",
    },
  },
  {
    element: ".group--layout",
    info: { target: "#layout-title" },
    popover: {
      title: "Main area cards",
      description:
        "<code>--deal-layout: row</code> on the main area: one setting changes the card's grid, picture, gap and title size.",
    },
  },
  {
    element: ".frame",
    info: { target: "#stage-title" },
    popover: {
      title: "The page",
      description:
        "The same card HTML in both areas. Each card's badge says which look it has. Drag the corner to resize the page.",
    },
  },
  {
    element: "#count",
    popover: {
      title: "Modifier classes vs style queries",
      description: "How many classes you'd add by hand to get the same result with BEM modifiers.",
    },
  },
  {
    element: ".compare .card:first-child",
    info: { target: ".compare .card:first-child .card__title" },
    popover: {
      title: "CSS",
      description: "The demo runs on exactly this CSS. Copy it as a starting point.",
    },
  },
  {
    element: ".compare .card:last-child",
    info: { target: ".compare .card:last-child .card__title" },
    popover: { title: "Good to know", description: "The rules and the catches, in short." },
  },
  {
    element: ".compat",
    info: { target: "#compat-title" },
    popover: {
      title: "Browser support",
      description: "Style queries on custom properties work in every current browser (Baseline since May 2026).",
    },
  },
  {
    element: ".app__actions",
    popover: {
      title: "Reset, replay or switch theme",
      description:
        "<strong>Reset</strong> (the round arrow) puts every control back where it started, <strong>?</strong> shows this tour again, and the last button switches between light and dark.",
    },
  },
];

window.setupTour({ key: "style-queries-tour-done", steps: TOUR_STEPS });
window.setupInfoTips(TOUR_STEPS.filter((step) => step.info));
