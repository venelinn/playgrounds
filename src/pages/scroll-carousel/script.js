// Scroll Carousel playground. The carousel's CSS is carousel.css; this script runs the arrows, dots and
// counter (kept small on purpose: the page lists what a real site would add), the controls and the output.
import carouselCss from "./carousel.css?raw";

const $ = (id) => document.getElementById(id);

const carousel = $("carousel");
const scroller = $("scroller");
const slides = [...scroller.querySelectorAll(".scroll-carousel__slide")];
const prev = $("prev");
const next = $("next");
const dotsEl = $("dots");
const counterText = $("counter-text");
const frame = $("frame");
const stage = document.querySelector(".stage");
const summary = $("summary");
const cssCode = $("css-code");
const htmlCode = $("html-code");
const snapOne = $("snap-one");
const counter = $("counter");

const SLIDERS = ["width", "perview", "gap", "padding", "radius", "arrow-size", "dot-size"];
const fields = Object.fromEntries(SLIDERS.map((k) => [k, { range: $(k), number: $(`${k}-number`) }]));
const read = (k) => Number(fields[k].range.value);
const choice = (name) => document.querySelector(`input[name="${name}"]:checked`).value;

// Each slide gets its own hue (a custom property, not an inline style rule).
for (const [i, slide] of slides.entries()) slide.style.setProperty("--i", String(i));

/* ---------- Settings → CSS variables ---------- */

// The carousel's defaults (carousel.css fallbacks): only values that differ go into the output.
const DEFAULTS = {
  perview: 1,
  gap: 0,
  padding: 0,
  radius: 0,
  "arrow-size": 40,
  "dot-size": 8,
  align: "start",
  arrows: "hover",
  arrowPos: "inside",
  dots: "overlay",
};

function settings() {
  return {
    perview: read("perview"),
    gap: read("gap"),
    padding: read("padding"),
    radius: read("radius"),
    "arrow-size": read("arrow-size"),
    "dot-size": read("dot-size"),
    snapOne: snapOne.checked,
    align: choice("align"),
    arrows: choice("arrows"),
    arrowPos: choice("arrow-pos"),
    dots: choice("dots"),
    counter: counter.checked,
  };
}

// [variable, value] pairs that differ from the defaults.
function changedVars(s) {
  const vars = [];
  if (s.perview !== DEFAULTS.perview) vars.push(["--scroll-carousel-slides-per-view", String(s.perview)]);
  if (s.gap !== DEFAULTS.gap) vars.push(["--scroll-carousel-gap", `${s.gap}px`]);
  if (s.padding !== DEFAULTS.padding) vars.push(["--scroll-carousel-padding", `${s.padding}px`]);
  if (s.radius !== DEFAULTS.radius) vars.push(["--scroll-carousel-radius", `${s.radius}px`]);
  if (!s.snapOne) vars.push(["--scroll-carousel-snap-stop", "normal"]);
  if (s["arrow-size"] !== DEFAULTS["arrow-size"]) {
    vars.push(["--scroll-carousel-arrow-size", `${s["arrow-size"]}px`]);
  }
  if (s["dot-size"] !== DEFAULTS["dot-size"]) vars.push(["--scroll-carousel-dot-size", `${s["dot-size"]}px`]);
  return vars;
}

const ALL_VARS = [
  "--scroll-carousel-slides-per-view",
  "--scroll-carousel-gap",
  "--scroll-carousel-padding",
  "--scroll-carousel-radius",
  "--scroll-carousel-snap-stop",
  "--scroll-carousel-arrow-size",
  "--scroll-carousel-dot-size",
];

function apply() {
  const s = settings();
  const vars = changedVars(s);

  for (const name of ALL_VARS) carousel.style.removeProperty(name);
  for (const [name, value] of vars) carousel.style.setProperty(name, value);

  carousel.dataset.arrows = s.arrows;
  if (s.arrowPos === "top") carousel.dataset.arrowsPosition = "top";
  else delete carousel.dataset.arrowsPosition;
  carousel.dataset.dots = s.dots;
  scroller.dataset.align = s.align;
  counterText.hidden = !s.counter;

  writeCode(s, vars);
  requestAnimationFrame(update);
}

function writeCode(s, vars) {
  const block = (list) => list.map(([name, value]) => `  ${name}: ${value};`).join("\n");
  cssCode.textContent = `/* Your settings: only what differs from the defaults */
.scroll-carousel {
${vars.length ? block(vars) : "  /* nothing: all defaults */"}
}`;

  const arrows =
    s.arrows === "none"
      ? ""
      : `
    <button class="scroll-carousel__arrow scroll-carousel__arrow--prev" type="button" aria-label="Previous slide">‹</button>
    <button class="scroll-carousel__arrow scroll-carousel__arrow--next" type="button" aria-label="Next slide">›</button>`;
  htmlCode.textContent = `<div class="scroll-carousel" role="region" aria-roledescription="carousel"
     aria-label="Destinations" data-arrows="${s.arrows}"${s.arrows !== "none" && s.arrowPos === "top" ? ' data-arrows-position="top"' : ""} data-dots="${s.dots}">
  <div class="scroll-carousel__viewport">${arrows}
    <div class="scroll-carousel__scroller" data-align="${s.align}" tabindex="0">
      <div class="scroll-carousel__slide">…</div>
      <div class="scroll-carousel__slide">…</div>
      <div class="scroll-carousel__slide">…</div>
    </div>${s.counter ? `\n    <span class="scroll-carousel__counter">1/3</span>` : ""}
  </div>${
    s.dots === "none"
      ? ""
      : `
  <div class="scroll-carousel__dots">
    <!-- one <button class="scroll-carousel__dot"> per stop -->
  </div>`
  }
</div>
${s.arrows === "none" && s.dots === "none" && !s.counter ? "<!-- Swipe only: no JavaScript needed. -->" : "<!-- The arrows, dots and counter need a little JavaScript. -->"}`;
}

/* ---------- Light carousel behaviour: arrows, dots, counter ---------- */

let active = 0;
let snaps = slides.length;

// How far the scroller must move for this slide to sit at its snap position (left-to-right).
function snapDelta(slide) {
  const box = scroller.getBoundingClientRect();
  const rect = slide.getBoundingClientRect();
  if (scroller.dataset.align === "center") return rect.left + rect.width / 2 - (box.left + box.width / 2);
  return rect.left - box.left - (Number.parseFloat(getComputedStyle(scroller).scrollPaddingInlineStart) || 0);
}

function update() {
  const max = scroller.scrollWidth - scroller.clientWidth;
  // One dot per position the carousel can stop at: with 2.5 per view the last slides share the end.
  let reachable = 0;
  let closest = 0;
  let best = Number.POSITIVE_INFINITY;
  slides.forEach((slide, i) => {
    const delta = snapDelta(slide);
    if (Math.abs(delta) < best) {
      best = Math.abs(delta);
      closest = i;
    }
    if (scroller.scrollLeft + delta < max - 1) reachable += 1;
  });
  const count = Math.min(reachable + 1, slides.length);
  active = Math.min(closest, count - 1);
  if (count !== snaps || dotsEl.children.length !== count) buildDots(count);

  prev.disabled = scroller.scrollLeft <= 1;
  next.disabled = scroller.scrollLeft >= max - 1;
  for (const [i, dot] of [...dotsEl.children].entries()) dot.setAttribute("aria-current", String(i === active));
  counterText.textContent = `${active + 1}/${slides.length}`;
  dotsEl.hidden = count < 2;
  summary.innerHTML = `slide <strong>${active + 1}</strong> of ${slides.length} · ${count} stop${count === 1 ? "" : "s"}`;
}

function buildDots(count) {
  snaps = count;
  dotsEl.replaceChildren(
    ...Array.from({ length: count }, (_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "scroll-carousel__dot";
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      return dot;
    }),
  );
}

function goTo(index) {
  const slide = slides[Math.max(0, Math.min(index, slides.length - 1))];
  scroller.scrollTo({ left: scroller.scrollLeft + snapDelta(slide) });
}

prev.addEventListener("click", () => goTo(active - 1));
next.addEventListener("click", () => goTo(active + 1));

let frameId = 0;
scroller.addEventListener(
  "scroll",
  () => {
    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(update);
  },
  { passive: true },
);
new ResizeObserver(() => update()).observe(scroller);

/* ---------- Controls ---------- */

const frameWidth = window.bindFrameWidth({
  stage,
  frame,
  target: carousel,
  range: fields.width.range,
  number: fields.width.number,
  onChange: update,
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

for (const input of document.querySelectorAll('input[type="radio"], input[type="checkbox"]')) {
  input.addEventListener("change", apply);
}

// The settings plus the whole carousel CSS, ready to paste into a project.
const copyAll = $("copy-all");
copyAll.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(`${carouselCss.trim()}\n\n${cssCode.textContent}\n`);
    copyAll.textContent = "Copied";
  } catch {
    copyAll.textContent = "Copy failed";
  }
  setTimeout(() => {
    copyAll.textContent = "Copy with carousel CSS";
  }, 1400);
});

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

// Narrow screens start with fewer slides per view.
if (carousel.getBoundingClientRect().width < 640) {
  fields.perview.range.value = fields.perview.number.value = "1.2";
}

apply();

/* ---------- Walkthrough + info icons ---------- */

const TOUR_STEPS = [
  {
    popover: {
      title: "Welcome to the Scroll Carousel Playground",
      description: "A quick tour of a carousel where the browser does the swiping. About 30 seconds.",
    },
  },
  {
    element: ".app__intro",
    popover: {
      title: "Native scrolling",
      description: "The browser does the swiping with CSS scroll snap. Arrows and dots sit on top.",
    },
  },
  {
    element: ".sc-note",
    popover: {
      title: "A playground",
      description:
        "CSS does the layout and snapping; a small script runs the arrows and dots. What a real site would add is listed at the bottom.",
    },
  },
  {
    element: ".group--layout",
    info: { target: "#layout-title" },
    popover: {
      title: "Layout",
      description: "How the slides sit: how many fit, the space between them, their corners and where each one stops.",
    },
  },
  {
    element: ".control:has(#perview)",
    info: { target: 'label[for="perview-number"]' },
    popover: {
      title: "Slides per view",
      description: "How many slides fit at once. A fraction, like <strong>2.5</strong>, lets the next one peek in.",
    },
  },
  {
    element: ".control:has(#padding)",
    info: { target: 'label[for="padding-number"]' },
    popover: {
      title: "Padding",
      description: "Room around the slides, so card shadows and focus rings aren't cut off.",
    },
  },
  {
    element: ".group--layout .group__switch",
    info: { target: ".group--layout .switch__label" },
    popover: {
      title: "One slide per swipe",
      description: "On: a swipe stops at the next slide. Off: a fast swipe can travel past several.",
    },
  },
  {
    element: ".group--layout .choices",
    popover: {
      title: "Align",
      description:
        "Where the current slide stops: at the left edge, or in the middle with the neighbours peeking on both sides.",
    },
  },
  {
    element: ".group--nav",
    info: { target: "#nav-title" },
    popover: {
      title: "Arrows and dots",
      description:
        "<strong>Hover</strong> arrows hide on touch screens, where people swipe. There's one dot per place the carousel can stop, not one per slide.",
    },
  },
  {
    element: ".frame",
    info: { target: "#stage-title" },
    popover: {
      title: "The carousel",
      description: "Swipe, scroll sideways or use the arrows and dots. Drag the corner to try other widths.",
    },
  },
  {
    element: ".compare",
    info: { target: ".compare .card:first-child .card__title" },
    popover: {
      title: "CSS and HTML",
      description: "Your settings as variables (or with the whole carousel CSS), and the markup to go with them.",
    },
  },
  {
    element: "#extras",
    info: { target: "#extras .card__title" },
    popover: {
      title: "What to add with JavaScript",
      description:
        "Keyboard controls, announcements, dynamic dots and more: what a real site needs beyond this page's small script.",
    },
  },
  {
    element: ".compat",
    info: { target: "#compat-title" },
    popover: {
      title: "Browser support",
      description: "Scroll snap works everywhere. scrollend is newer, with a simple fallback.",
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

window.setupTour({ key: "scroll-carousel-tour-done", steps: TOUR_STEPS });
window.setupInfoTips(TOUR_STEPS.filter((step) => step.info));
