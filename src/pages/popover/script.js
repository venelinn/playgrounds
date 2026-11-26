const $ = (id) => document.getElementById(id);
const { ALL, parse, snippet } = window.PopoverPlacement;

const app = $("app");
const picker = $("picker");
const placementName = $("placement-name");
const typeSelect = $("type");
const typeHint = $("type-hint");
const flip = $("flip");
const playfield = $("playfield");
const root = $("builder-root");
const trigger = $("builder-trigger");
const builder = $("builder");
const builderTitle = $("builder-title-text");
const builderText = $("builder-text");
const readout = $("readout");
const htmlCode = $("html-code");
const cssCode = $("css-code");

const fields = Object.fromEntries(["offset", "duration"].map((k) => [k, { range: $(k), number: $(`${k}-number`) }]));
const read = (k) => Number(fields[k].range.value);

/* ---------- Support ---------- */

const hasPopover = "popover" in HTMLElement.prototype;
const hasAnchor = CSS.supports("anchor-name: --a");
const hasHint = (() => {
  const el = document.createElement("div");
  el.popover = "hint";
  return el.popover === "hint";
})();

const supportNote = $("support-note");
if (!hasPopover || !hasAnchor) {
  supportNote.hidden = false;
  supportNote.textContent = !hasPopover
    ? "Your browser doesn't support popovers yet, so the buttons won't open anything."
    : "Your browser doesn't support anchor positioning yet, so popovers open centered on the page instead of next to their button.";
}
if (!hasHint) typeSelect.querySelector('[value="hint"]').textContent = "hint (not in your browser)";

/* ---------- Anchors: each popover root gets its own anchor name ---------- */

root.style.setProperty("--anchor", "--builder");
$("clip-root").style.setProperty("--anchor", "--clip");

/* ---------- Placement picker ---------- */

// Grid spots around the 3×3 "button" in a 5×5 picker
const SPOTS = {
  "top-start": [1, 2],
  top: [1, 3],
  "top-end": [1, 4],
  "bottom-start": [5, 2],
  bottom: [5, 3],
  "bottom-end": [5, 4],
  "left-start": [2, 1],
  left: [3, 1],
  "left-end": [4, 1],
  "right-start": [2, 5],
  right: [3, 5],
  "right-end": [4, 5],
};

for (const name of ALL) {
  const [row, col] = SPOTS[name];
  const label = document.createElement("label");
  label.className = "picker__spot";
  label.title = name;
  label.style.setProperty("--row", String(row));
  label.style.setProperty("--col", String(col));
  label.innerHTML = `<input type="radio" name="placement" value="${name}"${name === "bottom-start" ? " checked" : ""}><span class="sr-only">${name}</span>`;
  picker.append(label);
}

const placement = () => picker.querySelector("input:checked").value;

/* ---------- Matrix (all twelve, manual) ---------- */

$("matrix").innerHTML = ALL.map(
  (name) => `<div class="popover-root" data-anchor="--pm-${name}">
  <button class="trigger" type="button" popovertarget="pm-${name}">${name}</button>
  <div id="pm-${name}" class="popover-content" popover="manual" data-placement="${name}">
    <div class="surface"><strong>${name}</strong><span>Anchored content</span></div>
  </div>
</div>`,
).join("");
for (const el of document.querySelectorAll("[data-anchor]")) el.style.setProperty("--anchor", el.dataset.anchor);

/* ---------- Types ---------- */

const TYPE_HINTS = {
  manual:
    "Stays open until its button is clicked again. Good for comparing, or for content the user closes on purpose.",
  auto: "Closes on Esc or a click anywhere else, and closes other auto popovers. Best for menus and dropdowns.",
  hint: "Like auto, but doesn't close open auto popovers. Made for tooltips.",
};

/* ---------- What did the browser actually do? ---------- */

function actualPlacement() {
  const t = trigger.getBoundingClientRect();
  const p = builder.getBoundingClientRect();
  const near = (a, b) => Math.abs(a - b) < 2;
  let side;
  if (p.bottom <= t.top + 1) side = "top";
  else if (p.top >= t.bottom - 1) side = "bottom";
  else if (p.right <= t.left + 1) side = "left";
  else if (p.left >= t.right - 1) side = "right";
  else return null;

  let align;
  if (side === "top" || side === "bottom") {
    align = near(p.left, t.left) ? "start" : near(p.right, t.right) ? "end" : "center";
  } else {
    align = near(p.top, t.top) ? "start" : near(p.bottom, t.bottom) ? "end" : "center";
  }
  return align === "center" ? side : `${side}-${align}`;
}

function updateReadout() {
  const asked = placement();
  if (!builder.matches(":popover-open")) {
    readout.dataset.ok = "true";
    readout.textContent = `Closed. Asked for ${asked}: click the button to open it.`;
    return;
  }
  const actual = actualPlacement();
  if (!actual) {
    readout.dataset.ok = "false";
    readout.textContent = `Asked for ${asked}, but it isn't next to the button (anchor positioning not supported?).`;
    return;
  }
  const flipped = actual !== asked;
  readout.dataset.ok = "true";
  readout.textContent = flipped
    ? `Asked for ${asked} · showing ${actual}: not enough room, so it flipped.`
    : `Asked for ${asked} · showing ${actual}.`;
  builderTitle.textContent = actual;
  builderText.textContent = flipped ? `Asked for ${asked}, flipped` : "Anchored to the button";
}

// Two frames: the browser re-places (and may un-flip) the popover after layout, then we measure.
const watch = () => requestAnimationFrame(() => requestAnimationFrame(updateReadout));

/* ---------- Apply settings ---------- */

function apply() {
  const name = placement();
  const type = typeSelect.value;
  placementName.textContent = name;
  typeHint.textContent = TYPE_HINTS[type];

  app.style.setProperty("--offset", `${read("offset")}px`);
  app.style.setProperty("--animation", `${read("duration")}ms`);
  app.dataset.flip = String(flip.checked);

  builder.dataset.placement = name;
  builderTitle.textContent = name;

  // Changing the type needs the popover closed first; reopen it afterwards.
  if (builder.popover !== type && hasPopover) {
    const wasOpen = builder.matches(":popover-open");
    if (wasOpen) builder.hidePopover();
    builder.popover = type;
    if (wasOpen) builder.showPopover();
  }

  updateCode(name, type);
  watch();
}

function updateCode(name, type) {
  const offset = read("offset");
  const duration = read("duration");
  htmlCode.textContent = `<div class="popover-root">
  <button popovertarget="menu">Open</button>
  <div id="menu" class="popover-content" popover="${type}">
    …
  </div>
</div>`;

  const animation = duration
    ? `

/* Open and close animation */
.popover-content {
  opacity: 0;
  translate: ${parse(name).side === "top" ? "0 6px" : parse(name).side === "bottom" ? "0 -6px" : parse(name).side === "left" ? "6px 0" : "-6px 0"};
  transition: opacity ${duration}ms, translate ${duration}ms,
    display ${duration}ms allow-discrete, overlay ${duration}ms allow-discrete;
}

.popover-content:popover-open {
  opacity: 1;
  translate: 0 0;
}

@starting-style {
  .popover-content:popover-open {
    opacity: 0;
  }
}`
    : "";

  cssCode.textContent = snippet(name, { offset, flip: flip.checked }) + animation;
}

/* ---------- Controls ---------- */

for (const [, { range, number }] of Object.entries(fields)) {
  range.addEventListener("input", () => {
    number.value = range.value;
    apply();
  });
  number.addEventListener("input", () => {
    const v = Number(number.value);
    if (number.value === "" || !Number.isFinite(v)) return;
    range.value = String(Math.min(Math.max(v, Number(range.min)), Number(range.max)));
    apply();
  });
  number.addEventListener("change", () => {
    number.value = range.value;
  });
}

picker.addEventListener("change", apply);
typeSelect.addEventListener("change", apply);
flip.addEventListener("change", apply);
builder.addEventListener("toggle", watch);
window.addEventListener("scroll", watch, { passive: true });
window.addEventListener("scrollend", watch);
window.addEventListener("resize", watch);

/* ---------- Drag the button around the playfield ---------- */

let drag = null;

// Top-left position of the root inside the playfield (no transforms: see style.css).
function placeRoot(x, y) {
  const box = playfield.getBoundingClientRect();
  const r = root.getBoundingClientRect();
  const left = Math.min(Math.max(x, 0), box.width - r.width);
  const top = Math.min(Math.max(y, 0), box.height - r.height);
  root.style.setProperty("--x", `${left}px`);
  root.style.setProperty("--y", `${top}px`);
}

function centerRoot() {
  const box = playfield.getBoundingClientRect();
  const r = root.getBoundingClientRect();
  placeRoot((box.width - r.width) / 2, (box.height - r.height) / 2);
}

trigger.addEventListener("pointerdown", (e) => {
  const r = root.getBoundingClientRect();
  drag = { id: e.pointerId, dx: e.clientX - r.left, dy: e.clientY - r.top, moved: false };
});

trigger.addEventListener("pointermove", (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  if (!drag.moved && Math.hypot(e.movementX, e.movementY) > 0) {
    drag.moved = true;
    trigger.setPointerCapture(e.pointerId);
  }
  const box = playfield.getBoundingClientRect();
  placeRoot(e.clientX - drag.dx - box.left, e.clientY - drag.dy - box.top);
  watch();
});

const endDrag = () => {
  setTimeout(() => {
    drag = null;
  });
};
trigger.addEventListener("pointerup", endDrag);
trigger.addEventListener("pointercancel", endDrag);

// A drag shouldn't also toggle the popover.
trigger.addEventListener(
  "click",
  (e) => {
    if (drag?.moved) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  },
  true,
);

/* ---------- Copy ---------- */

for (const button of document.querySelectorAll("[data-copy]")) {
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($(button.dataset.copy).textContent);
      button.textContent = "Copied";
    } catch {
      button.textContent = "Copy failed";
    }
    setTimeout(() => {
      button.textContent = "Copy";
    }, 1400);
  });
}

/* ---------- Start: show the builder popover right away ---------- */

apply();
centerRoot();
// Open it right away, unless the first-visit tour is about to start (the top layer would sit above it).
let tourSeen = null;
try {
  tourSeen = localStorage.getItem("popover-tour-done");
} catch {}
if (hasPopover && (tourSeen || !window.driver?.js)) builder.showPopover();
watch();

/* ---------- Walkthrough (shared/tour.js) ---------- */

const TOUR_STEPS = [
  {
    popover: {
      title: "Welcome to the Popover Playground",
      description: "A quick tour of native popovers and anchor positioning. It takes about a minute.",
    },
  },
  {
    element: ".app__intro",
    popover: {
      title: "No JavaScript needed",
      description:
        "A button with <code>popovertarget</code> opens the popover. The browser puts it on top of everything, and anchor positioning places it next to the button.",
    },
  },
  {
    element: ".control--placement",
    info: { target: ".control--placement .control__label" },
    popover: {
      title: "Placement",
      description: "Pick one of 12 spots around the button: a side (top, bottom, left, right) and an alignment.",
    },
  },
  {
    element: ".control:has(#type)",
    info: { target: 'label[for="type"]' },
    popover: {
      title: "Type",
      description:
        "<strong>manual</strong> stays open, <strong>auto</strong> closes on Esc or a click elsewhere, <strong>hint</strong> is for tooltips.",
    },
  },
  {
    element: ".control:has(#offset)",
    info: { target: 'label[for="offset-number"]' },
    popover: { title: "Offset", description: "The space between the button and the popover." },
  },
  {
    element: ".control:has(#duration)",
    info: { target: 'label[for="duration-number"]' },
    popover: {
      title: "Animation",
      description: "How long the fade and slide take when it opens and closes. 0 turns it off.",
    },
  },
  {
    element: ".control:has(#flip)",
    info: { target: ".control:has(#flip) .switch" },
    popover: {
      title: "Flip when out of room",
      description: "On, the popover tries the other side when it doesn't fit in the window. Off, it just overflows.",
    },
  },
  {
    element: "#playfield",
    info: { target: "#builder-title" },
    popover: {
      title: "Drag the button",
      description:
        "Drag it toward an edge of the window (or scroll so it sits near the top or bottom) and watch the popover flip.",
    },
  },
  {
    element: "#readout",
    popover: {
      title: "What happened",
      description: "Which placement you asked for, and which one the browser is showing.",
    },
  },
  {
    element: ".compare",
    info: { target: ".compare .card:first-child .card__title" },
    popover: {
      title: "HTML and CSS",
      description: "The code for your current settings. Copy it into a ticket or your spec.",
    },
  },
  {
    element: "#matrix",
    info: { target: "#matrix-title" },
    popover: { title: "All twelve", description: "Every placement side by side. Open several to compare." },
  },
  {
    element: ".compat",
    info: { target: "#compat-title" },
    popover: {
      title: "Browser support",
      description:
        "Popovers work everywhere modern. Anchor positioning is newer: older browsers show the popover centered.",
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

window.setupTour({ key: "popover-tour-done", steps: TOUR_STEPS });

// Info icons: tour steps that say where their icon goes, plus a few controls the tour doesn't cover.
const INFO_ONLY = [
  {
    info: { target: "#clip-title" },
    popover: {
      title: "Escapes overflow: hidden",
      description:
        "The popover renders in the browser's top layer, above the page, so a parent with <code>overflow: hidden</code> can't cut it off.",
    },
  },
];
window.setupInfoTips([...TOUR_STEPS.filter((step) => step.info), ...INFO_ONLY]);
