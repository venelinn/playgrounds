const $ = (id) => document.getElementById(id);

const cards = $("cards");
const section = $("section");
const sectionTitle = $("section-title");
const sectionReadout = $("section-readout");
const frame = $("frame");
const stage = document.querySelector(".stage");
const unitInputs = document.querySelectorAll('input[name="unit"]');
const unitOf = () => document.querySelector('input[name="unit"]:checked').value;
const sizeUnit = $("size-unit");
const headingUnit = $("hsize-unit");
const headingFormula = $("heading-formula");
const formula = $("formula");
const wide = $("wide");
const cssCode = $("css-code");
const reactCode = $("react-code");

const fields = Object.fromEntries(
  ["cols", "min", "size", "max", "hmin", "hsize", "hmax", "width"].map((k) => [
    k,
    { range: $(k), number: $(`${k}-number`) },
  ]),
);
const read = (k) => Number(fields[k].range.value);
const px = (n) => `${Math.round(n * 10) / 10}px`;

// The big section title has its own clamp; both titles share the unit.
const heading = () => ({ min: read("hmin"), size: read("hsize"), max: read("hmax") });

/* ---------- Cards ---------- */

const CARDS = [
  ["Portugal", "A long weekend in Lisbon", "Old-town walks, custard tarts and a sunset river cruise."],
  ["Japan", "Kyoto in cherry blossom season", "Temples, tea houses and quiet gardens in early spring."],
  ["Iceland", "Reykjavík and the Golden Circle", "Geysers, waterfalls and a dip in the Blue Lagoon."],
];

cards.innerHTML = CARDS.map(
  ([eyebrow, title, text]) => `<article class="cq-card">
  <div class="cq-card__media" aria-hidden="true"></div>
  <span class="cq-card__eyebrow">${eyebrow}</span>
  <h4 class="cq-card__title">${title}</h4>
  <p class="cq-card__text">${text}</p>
  <span class="cq-card__readout"></span>
</article>`,
).join("");

/* ---------- Readouts ---------- */

// cqi/cqw are a % of the container's content box (inside its padding and border).
function contentWidth(el) {
  const cs = getComputedStyle(el);
  return (
    el.getBoundingClientRect().width -
    Number.parseFloat(cs.paddingLeft) -
    Number.parseFloat(cs.paddingRight) -
    Number.parseFloat(cs.borderLeftWidth) -
    Number.parseFloat(cs.borderRightWidth)
  );
}

function stateOf(preferred, min, max) {
  if (preferred <= min) return "min";
  if (preferred >= max) return "max";
  return "fluid";
}

const LABEL = { min: "at min", max: "at max", fluid: "fluid" };

function updateReadouts() {
  const unit = unitOf();
  const isViewport = unit === "vw";
  const viewport = document.documentElement.clientWidth;

  for (const card of cards.children) {
    const width = contentWidth(card);
    const basis = isViewport ? viewport : width;
    const preferred = (basis * read("size")) / 100;
    const state = stateOf(preferred, read("min"), read("max"));
    const size = Number.parseFloat(getComputedStyle(card.querySelector(".cq-card__title")).fontSize);
    card.dataset.state = state;
    card.querySelector(".cq-card__readout").textContent = `card ${px(width)} · title ${px(size)} · ${LABEL[state]}`;
  }

  const width = contentWidth(section);
  const basis = isViewport ? viewport : width;
  const h = heading();
  const state = stateOf((basis * h.size) / 100, h.min, h.max);
  const size = Number.parseFloat(getComputedStyle(sectionTitle).fontSize);
  sectionReadout.textContent = `section ${px(width)} · title ${px(size)} · ${LABEL[state]}`;
}

/* ---------- Apply settings ---------- */

function apply() {
  const unit = unitOf();
  sizeUnit.textContent = unit;
  const h = heading();
  headingUnit.textContent = unit;
  formula.textContent = `font-size: clamp(${read("min")}px, ${read("size")}${unit}, ${read("max")}px)`;
  headingFormula.textContent = `font-size: clamp(${h.min}px, ${h.size}${unit}, ${h.max}px)`;

  cards.style.setProperty("--cols", String(read("cols")));
  cards.style.setProperty("--min-size", `${read("min")}px`);
  cards.style.setProperty("--size", `${read("size")}${unit}`);
  cards.style.setProperty("--max-size", `${read("max")}px`);
  cards.dataset.wide = String(wide.checked);
  section.style.setProperty("--heading-min", `${h.min}px`);
  section.style.setProperty("--heading-size", `${h.size}${unit}`);
  section.style.setProperty("--heading-max", `${h.max}px`);

  updateCode();
  requestAnimationFrame(updateReadouts);
}

function updateCode() {
  const unit = unitOf();
  const min = read("min");
  const size = read("size");
  const max = read("max");
  const containers = unit !== "vw";
  const h = heading();

  cssCode.textContent = containers
    ? `/* Each container: titles inside use its width */
.section,
.card {
  container-type: inline-size;
}

/* ${h.size}${unit} = ${h.size}% of the section's width */
.section__title {
  font-size: clamp(${h.min}px, ${h.size}${unit}, ${h.max}px);
}

/* ${size}${unit} = ${size}% of the card's width */
.card__title {
  font-size: clamp(${min}px, ${size}${unit}, ${max}px);
}`
    : `/* vw follows the screen, not the card:
   every title is the same size, whatever the columns */
.section__title {
  font-size: clamp(${h.min}px, ${h.size}vw, ${h.max}px);
}

.card__title {
  font-size: clamp(${min}px, ${size}vw, ${max}px);
}`;

  reactCode.textContent = `{/* Cell is a container (inline-size) by default,
    so cqi inside it follows the cell's width */}
<Row cols={${read("cols")}}>
  <Cell>
    <article className="card">
      <h3 className="card__title">…</h3>
    </article>
  </Cell>
  …
</Row>

/* CSS */
.card__title {
  font-size: clamp(${min}px, ${size}${unit}, ${max}px);
}`;
}

/* ---------- Controls ---------- */

const frameWidth = window.bindFrameWidth({
  stage,
  frame,
  target: section,
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

for (const input of unitInputs) input.addEventListener("change", apply);
wide.addEventListener("change", apply);
new ResizeObserver(() => updateReadouts()).observe(cards);

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

// Narrow screens start with 1 column (3 columns of ~70px cards break words mid-way).
if (section.getBoundingClientRect().width < 640) {
  fields.cols.range.value = "1";
  fields.cols.number.value = "1";
}

apply();

/* ---------- Walkthrough + info icons ---------- */

const TOUR_STEPS = [
  {
    popover: {
      title: "Welcome to the Container Units Playground",
      description: "A quick tour of text that sizes itself to its card. It takes about 30 seconds.",
    },
  },
  {
    element: ".app__intro",
    popover: {
      title: "vw vs cqi",
      description:
        "<code>vw</code> is a % of the screen. <code>cqi</code> is a % of the container the text is in, like a card.",
    },
  },
  {
    element: ".cq-group--layout",
    popover: {
      title: "Layout",
      description: "These change how much room the titles get. They don't touch the title settings.",
    },
  },
  {
    element: ".control:has(#cols)",
    info: { target: 'label[for="cols-number"]' },
    popover: {
      title: "Columns",
      description:
        "More columns make each card narrower, so the card titles get smaller. The big title doesn't change.",
    },
  },
  {
    element: ".control:has(#width)",
    info: { target: 'label[for="width-number"]' },
    popover: {
      title: "Section width",
      description:
        "Make the whole section narrower (or drag its corner). Now the big title shrinks too, because it follows the section.",
    },
  },
  {
    element: ".cq-group__switch",
    info: { target: ".cq-group__switch .switch__label" },
    popover: {
      title: "A wide card",
      description: "The first card spans 2 columns, so you can see two title sizes at once.",
    },
  },
  {
    element: ".cq-group--unit",
    info: { target: "#unit-title" },
    popover: {
      title: "Measured by",
      description:
        "What the % is of, for both titles. <strong>cqi</strong> and <strong>cqw</strong> follow the container; switch to <strong>vw</strong> and every card title is the same size whatever the columns, because it follows the screen.",
    },
  },
  {
    element: ".cq-group--heading",
    info: { target: "#heading-title" },
    popover: {
      title: "Section title",
      description:
        "The <code>clamp()</code> for <strong>Featured destinations</strong>. Its container is the section, so it reacts to the section width, not the columns.",
    },
  },
  {
    element: ".cq-group--title",
    popover: {
      title: "Card title",
      description:
        "The card title's <code>clamp()</code>, written out live next to the heading. Min, Preferred and Max are its three values.",
    },
  },
  {
    element: ".control:has(#min)",
    info: { target: 'label[for="min-number"]' },
    popover: { title: "Min", description: "The smallest a card title can get, however narrow the card." },
  },
  {
    element: ".control:has(#size)",
    info: { target: 'label[for="size-number"]' },
    popover: {
      title: "Preferred",
      description: "How big the card title is compared to the card: <strong>7cqi</strong> = 7% of the card's width.",
    },
  },
  {
    element: ".control:has(#max)",
    info: { target: 'label[for="max-number"]' },
    popover: { title: "Max", description: "The biggest a card title can get, however wide the card." },
  },

  {
    element: "#section-title",
    info: { target: "#stage-title" },
    popover: {
      title: "Big title",
      description:
        "Uses the section as its container. The badge under it shows the section's width and the title size.",
    },
  },
  {
    element: "#cards .cq-card:first-child",
    popover: {
      title: "A card",
      description:
        "Each card is a container. The badge shows its width, its title size, and whether it's at min, max or in between.",
    },
  },
  {
    element: ".compare",
    info: { target: ".compare .card:first-child .card__title" },
    popover: {
      title: "CSS and React",
      description: "The code for your settings. With our Row / Cell, each Cell is already a container.",
    },
  },
  {
    element: ".compare .card:last-child",
    info: { target: ".compare .card:last-child .card__title" },
    popover: { title: "Good to know", description: "The few things that trip people up with container units." },
  },
  {
    element: ".compat",
    info: { target: "#compat-title" },
    popover: { title: "Browser support", description: "Container units work in every modern browser." },
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

window.setupTour({ key: "cq-units-tour-done", steps: TOUR_STEPS });
window.setupInfoTips(TOUR_STEPS.filter((step) => step.info));
