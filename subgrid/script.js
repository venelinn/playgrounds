const $ = (id) => document.getElementById(id);

const cards = $("cards");
const frame = $("frame");
const stage = document.querySelector(".stage--cards");
const cardsCheck = $("cards-check");
const cardsCode = $("cards-code");
const reactCode = $("react-code");
const subgrid = $("subgrid");
const showRows = $("show-rows");
const containers = $("containers");
const form = $("form");
const formSubgrid = $("form-subgrid");
const formCheck = $("form-check");

const fields = Object.fromEntries(
  ["cols", "min", "gap", "width"].map((k) => [k, { range: $(k), number: $(`${k}-number`) }]),
);
const read = (k) => Number(fields[k].range.value);

/* ---------- Cards ---------- */

const OFFERS = [
  ["Weekend in Lisbon", "Three nights near the old town, with breakfast and a sunset river cruise.", "$489"],
  ["Cancún all-inclusive resort with ocean-view suites", "Seven nights, all meals and drinks.", "$1,249"],
  ["Paris", "A short city break.", "$399"],
  [
    "Reykjavík and the Golden Circle",
    "Four nights with a guided tour of geysers, waterfalls and the national park, plus a Blue Lagoon visit.",
    "$1,099",
  ],
  ["Tokyo food tour", "Five nights in Shinjuku with two guided food walks and a sushi class.", "$1,580"],
  ["Rome", "Colosseum skip-the-line tickets included.", "$529"],
];

cards.innerHTML = OFFERS.map(
  ([title, text, price]) => `<div class="demo-grid__cell">
  <article class="offer">
    <div class="offer__thumb" aria-hidden="true"></div>
    <h3 class="offer__title" contenteditable="plaintext-only" spellcheck="false">${title}</h3>
    <p class="offer__text" contenteditable="plaintext-only" spellcheck="false">${text}</p>
    <div class="offer__footer"><span class="offer__price">${price}</span><span class="offer__cta">View deal →</span></div>
  </article>
</div>`,
).join("");

/* ---------- Checks: do the parts line up? ---------- */

const topOf = (el) => Math.round(el.getBoundingClientRect().top);
const leftOf = (el) => Math.round(el.getBoundingClientRect().left);

function checkCards() {
  const cells = [...cards.children];
  const firstTop = topOf(cells[0]);
  const row = cells.filter((c) => Math.abs(topOf(c) - firstTop) < 2);

  if (row.length < 2) {
    cardsCheck.dataset.ok = "true";
    cardsCheck.textContent = "One card per row: nothing to line up. Make the container wider to compare.";
    return;
  }

  const texts = new Set(row.map((c) => topOf(c.querySelector(".offer__text"))));
  const prices = new Set(row.map((c) => topOf(c.querySelector(".offer__footer"))));
  const aligned = texts.size === 1 && prices.size === 1;

  let why = "";
  if (!aligned && subgrid.checked && containers.checked) {
    why = " Cells are containers, and a container can't be a subgrid: use <Cell cellNormal>.";
  } else if (!aligned && !subgrid.checked) {
    why = " Each card is sizing its own parts.";
  }
  cardsCheck.dataset.ok = String(aligned);
  cardsCheck.textContent = aligned
    ? `✓ Text and prices line up across the ${row.length} cards in the first row.`
    : `✗ Text and prices sit at different heights across the ${row.length} cards in the first row.${why}`;
}

function checkForm() {
  const inputs = [...form.querySelectorAll(".form-demo__input")];
  const starts = new Set(inputs.map(leftOf));
  const aligned = starts.size === 1;
  formCheck.dataset.ok = String(aligned);
  formCheck.textContent = aligned
    ? "✓ All inputs start at the same place."
    : `✗ The inputs start at ${starts.size} different places: each field sized its own label.`;
}

/* ---------- Apply settings ---------- */

function apply() {
  cards.style.setProperty("--_grid-cols", String(read("cols")));
  cards.style.setProperty("--_col-min-width", `${read("min")}px`);
  cards.style.setProperty("--_gap", `${read("gap")}px`);
  cards.dataset.subgrid = String(subgrid.checked);
  cards.dataset.showRows = String(showRows.checked);
  cards.dataset.containers = String(containers.checked);
  form.dataset.subgrid = String(formSubgrid.checked);
  updateCode();
  requestAnimationFrame(() => {
    checkCards();
    checkForm();
  });
}

function updateCode() {
  const cols = read("cols");
  const min = read("min");
  const gap = read("gap");

  cardsCode.textContent = `.grid {
  display: grid;
  gap: ${gap}px;
  grid-template-columns: repeat(
    auto-fill,
    minmax(max(${min}px, calc((100% - ${cols - 1} * ${gap}px) / ${cols})), 1fr)
  );
}

/* each Cell (cellNormal) */
.grid > * {
  display: grid;
  grid-row: span 4; /* image, title, text, price */
  grid-template-rows: subgrid;
}

/* the card shares the grid's rows */
.card {
  display: grid;
  grid-row: span 4;
  grid-template-rows: subgrid;
  row-gap: 10px;
}`;

  const props = [`cols={${cols}}`];
  if (min !== 260) props.push(`minWidth="${min}px"`);
  if (gap === 0) props.push("gap={false}");

  reactCode.textContent = `{/* cellNormal: a container can't be a subgrid */}
<Row ${props.join(" ")}>
  <Cell cellNormal className="offer-cell">
    <article className="offer">…</article>
  </Cell>
  …
</Row>

/* CSS */
.offer-cell {
  display: grid;
  grid-row: span 4;
  grid-template-rows: subgrid;
}`;
}

/* ---------- Controls ---------- */

const frameWidth = window.bindFrameWidth({
  stage,
  frame,
  target: cards,
  range: fields.width.range,
  number: fields.width.number,
  onChange: () => {
    checkCards();
    checkForm();
  },
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

for (const toggle of [subgrid, showRows, containers, formSubgrid]) toggle.addEventListener("change", apply);

// Editing a title or text changes row heights: re-check.
cards.addEventListener("input", () => requestAnimationFrame(checkCards));
// Keep line breaks out of the editable text.
cards.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.isContentEditable) {
    e.preventDefault();
    e.target.blur();
  }
});
form.addEventListener("submit", (e) => e.preventDefault());

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

/* ---------- Start ---------- */

apply();

/* ---------- Walkthrough (shared/tour.js) ---------- */

window.setupTour({
  key: "subgrid-tour-done",
  steps: [
    {
      popover: {
        title: "Welcome to the Subgrid Playground",
        description: "A quick tour of how subgrid lines things up. It takes about a minute.",
      },
    },
    {
      element: ".app__intro",
      popover: {
        title: "What subgrid does",
        description:
          "A card can use its parent grid's rows instead of making its own. Then the cards in a row share the same rows, so their parts line up.",
      },
    },
    {
      element: ".controls .control:first-child",
      popover: {
        title: "The grid",
        description:
          "The same grid as the Grid playground: max columns, min width, gap and container width. Drag the corner of the cards to resize too.",
      },
    },
    {
      element: ".control--switches",
      popover: {
        title: "Switches",
        description:
          "<strong>Use subgrid</strong> turns it on and off. <strong>Show rows</strong> outlines the shared rows. <strong>Cells are containers</strong> shows the catch.",
      },
    },
    {
      element: "#cards .demo-grid__cell:nth-child(2)",
      popover: {
        title: "Edit a card",
        description:
          "Click a title or text and type. With subgrid on, the whole row grows with the longest one, and the other cards stay lined up.",
      },
    },
    {
      element: "#cards-check",
      popover: {
        title: "Live check",
        description: "Says whether the text and prices in the first row line up, and why not when they don't.",
      },
    },
    {
      element: ".subgrid-info .card:first-child",
      popover: {
        title: "How it works",
        description:
          "Five short steps, including the catch for our grid component: subgrid cards need <code>&lt;Cell cellNormal&gt;</code>.",
      },
    },
    {
      element: ".subgrid-info .card:nth-child(2)",
      popover: {
        title: "CSS and React",
        description:
          "The code for your current settings, as plain CSS and with the Row / Cell component. Copy either one.",
      },
    },
    {
      element: ".stage--form",
      popover: {
        title: "Columns too",
        description:
          "Subgrid also lines up columns. Here every field shares the form's columns, so the inputs start in the same place.",
      },
    },
    {
      element: ".compat",
      popover: {
        title: "Browser support",
        description: "Which browsers support subgrid, since which version, and whether yours does.",
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
  ],
});
