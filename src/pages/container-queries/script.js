// Container Queries playground. The script writes the card's CSS from the controls into
// <style id="live-css"> and the CSS card (same text), shows each card's width and counts the layouts.
// The cards choose their layout in CSS; nothing here decides it.

const $ = (id) => document.getElementById(id);

const site = $("site");
const frame = $("frame");
const stage = document.querySelector(".stage");
const liveCss = $("live-css");
const cssCode = $("css-code");
const summary = $("summary");
const warning = $("points-warning");
const outlines = $("outlines");
const copyButton = $("copy");
const trips = [...site.querySelectorAll(".trip")];
const areas = [...site.querySelectorAll(".site__area")];

const fields = Object.fromEntries(["inter", "exp", "width"].map((k) => [k, { range: $(k), number: $(`${k}-number`) }]));
const read = (k) => Number(fields[k].range.value);
const mode = () => document.querySelector('input[name="mode"]:checked').value;

/* ---------- The CSS ---------- */

// Spacing uses the design tokens, with the rem value as a fallback so the code also works elsewhere.
function buildCss() {
  const inter = read("inter");
  const exp = read("exp");
  const byScreen = mode() === "screen";
  // The demo's "screen" is the resizable page, so screen mode runs on the page's container.
  const query = (px) => (byScreen ? `@media (width >= ${px}px)` : `@container card (width >= ${px}px)`);

  const css = `${
    byScreen
      ? `/* The old way: the screen decides. Every card gets the same layout,
   whatever space it actually has. */`
      : `/* 1. Each card's box is a container: what's inside can ask how wide it is */
.trip {
  container: card / inline-size;
}`
  }

/* ${byScreen ? "1" : "2"}. The layout reads these variables. Compact is the default (mobile first) */
.trip__inner {
  display: grid;
  grid-template-columns: var(--_columns, minmax(0, 1fr));
  grid-template-areas: var(--_areas, "img" "place" "title" "price" "actions");
  gap: var(--_gap, var(--spacing-2, 0.5rem));
  padding: var(--_padding, var(--spacing-3, 0.75rem));
}

.trip__img { grid-area: img; aspect-ratio: var(--_img-ratio, 16 / 9); }
.trip__place { grid-area: place; }
.trip__title { grid-area: title; font-size: var(--_title-size, 1rem); }
.trip__text { grid-area: text; display: var(--_text-display, none); }
.trip__details { grid-area: details; display: var(--_details-display, none); }
.trip__price { grid-area: price; }
.trip__actions { grid-area: actions; }
.trip__button { flex: var(--_button-flex, 1 1 100%); }

/* ${byScreen ? "2" : "3"}. Intermediate: picture beside the text, details, inline buttons */
${query(inter)} {
  .trip__inner {
    --_state: "intermediate";
    --_columns: 40% minmax(0, 1fr);
    --_areas: "img place" "img title" "img details" "img price" "img actions";
    --_gap: var(--spacing-2, 0.5rem) var(--spacing-4, 1rem);
    --_img-ratio: auto;
    --_details-display: flex;
    --_button-flex: 0 0 auto;
  }
}

/* ${byScreen ? "3" : "4"}. Expanded: roomier, a bigger title and the description */
${query(exp)} {
  .trip__inner {
    --_state: "expanded";
    --_columns: 45% minmax(0, 1fr);
    --_areas: "img place" "img title" "img text" "img details" "img price" "img actions";
    --_gap: var(--spacing-3, 0.75rem) var(--spacing-6, 1.5rem);
    --_padding: var(--spacing-5, 1.25rem);
    --_title-size: 1.5rem;
    --_text-display: block;
  }
}`;
  return {
    shown: css,
    live: byScreen ? css.replaceAll("@media (width >=", "@container site (width >=") : css,
  };
}

/* ---------- Readouts ---------- */

const stateOf = (trip) =>
  getComputedStyle(trip.querySelector(".trip__inner")).getPropertyValue("--_state").replace(/"/g, "").trim() ||
  "compact";

function updateReadouts() {
  for (const trip of trips) {
    trip.querySelector(".trip__width").textContent = `${Math.round(trip.getBoundingClientRect().width)}px`;
  }
  for (const area of areas) {
    area.querySelector(".site__width").textContent = `${Math.round(area.getBoundingClientRect().width)}px`;
  }
  const states = new Set(trips.map(stateOf));
  const width = Math.round(site.getBoundingClientRect().width);
  summary.innerHTML =
    mode() === "screen"
      ? `page <strong>${width}px</strong> · every card: ${[...states].join(", ")}`
      : `page <strong>${width}px</strong> · <strong>${states.size}</strong> different layout${states.size === 1 ? "" : "s"} on one page`;
}

/* ---------- Apply ---------- */

function apply() {
  const css = buildCss();
  liveCss.textContent = css.live;
  cssCode.textContent = css.shown;
  warning.hidden = read("exp") > read("inter");
  site.dataset.outlines = String(outlines.checked);
  requestAnimationFrame(updateReadouts);
}

const frameWidth = window.bindFrameWidth({
  stage,
  frame,
  target: site,
  range: fields.width.range,
  number: fields.width.number,
  onChange: updateReadouts,
});

for (const [key, { range, number }] of Object.entries(fields)) {
  const onChange = () => {
    if (key === "width") frameWidth.set(read("width"));
    else apply();
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

for (const input of document.querySelectorAll('input[name="mode"]')) input.addEventListener("change", apply);
outlines.addEventListener("change", apply);
new ResizeObserver(() => updateReadouts()).observe(site);

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
      title: "Welcome to the Container Queries Playground",
      description: "One card, many places: how a component can pick its layout from its own space. About 30 seconds.",
    },
  },
  {
    element: ".app__intro",
    popover: {
      title: "Space, not screens",
      description:
        "A screen breakpoint only knows the screen. A container query knows the space the component actually has.",
    },
  },
  {
    element: ".group--mode",
    info: { target: "#mode-title" },
    popover: {
      title: "Switch by",
      description:
        "<strong>Its own width</strong>: each card decides. <strong>The screen</strong>: the old way, every card gets the same layout, and the sidebar card gets squeezed.",
    },
  },
  {
    element: ".group--points",
    info: { target: "#points-title" },
    popover: {
      title: "Switch points",
      description:
        "The card's width where it changes layout. These are the numbers a designer writes next to each state: Compact, then Intermediate from 300px, Expanded from 560px.",
    },
  },
  {
    element: ".group--page",
    info: { target: "#page-title" },
    popover: {
      title: "Page",
      description:
        "Make the whole page narrower (or drag its corner) and watch each card change on its own. The outlines show each card's box: its container.",
    },
  },
  {
    element: ".frame",
    info: { target: "#stage-title" },
    popover: {
      title: "One card, many places",
      description:
        "The same card in a full-width section, a two-column grid, a three-column grid and a sidebar. Each badge shows the card's layout and width.",
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
    element: ".compare .card:nth-child(2)",
    info: { target: ".compare .card:nth-child(2) .card__title" },
    popover: {
      title: "For designers",
      description: "How to design and hand over states instead of device sizes.",
    },
  },
  {
    element: ".compat",
    info: { target: "#compat-title" },
    popover: {
      title: "Browser support",
      description: "Size container queries work in every current browser, including all the ones WestJet supports.",
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

window.setupTour({ key: "container-queries-tour-done", steps: TOUR_STEPS });
window.setupInfoTips(TOUR_STEPS.filter((step) => step.info));
