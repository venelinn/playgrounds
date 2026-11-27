const $ = (id) => document.getElementById(id);

const grid = $("grid");
const frame = $("frame");
const stage = document.querySelector(".stage");
const summary = $("summary");
const warning = $("warning");
const values = $("values");
const cssCode = $("css-code");
const reactCode = $("react-code");
const containers = $("containers");

const fields = Object.fromEntries(
  ["cols", "min", "gap", "items", "width"].map((k) => [k, { range: $(k), number: $(`${k}-number`) }]),
);
const read = (k) => Number(fields[k].range.value);
const px = (n) => `${Math.round(n)}px`;

/* ---------- Cells ---------- */

const cellObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const meta = entry.target.querySelector(".item__meta");
    if (meta) meta.textContent = `${px(entry.contentRect.width)} wide`;
  }
});

function setItems(n) {
  while (grid.children.length > n) {
    cellObserver.unobserve(grid.lastElementChild);
    grid.lastElementChild.remove();
  }
  while (grid.children.length < n) {
    const i = grid.children.length + 1;
    grid.insertAdjacentHTML(
      "beforeend",
      `<div class="demo-grid__cell">
  <article class="item">
    <div class="item__thumb" aria-hidden="true"></div>
    <div class="item__body">
      <span class="item__title">Item ${i}</span>
      <span class="item__meta"></span>
      <span class="item__layout item__layout--stacked">Stacked (cell under 300px)</span>
      <span class="item__layout item__layout--side">Side by side (cell 300px+)</span>
    </div>
  </article>
</div>`,
    );
    cellObserver.observe(grid.lastElementChild);
  }
}

/* ---------- Grid settings ---------- */

function applyGrid() {
  grid.style.setProperty("--_grid-cols", String(read("cols")));
  grid.style.setProperty("--_col-min-width", `${read("min")}px`);
  grid.style.setProperty("--_gap", `${read("gap")}px`);
  grid.dataset.containers = String(containers.checked);
}

/* ---------- Readouts ---------- */

function update() {
  const cols = read("cols");
  const min = read("min");
  const gap = read("gap");
  const width = grid.getBoundingClientRect().width;

  // Same math as the CSS: each column is at least max(min, even share), auto-fill packs as many as fit.
  const share = (width - (cols - 1) * gap) / cols;
  const columnMin = Math.max(min, share);
  const overflow = columnMin > width;

  // What the browser actually did
  const tracks = getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean);
  const count = tracks.length;
  const trackWidth = Number.parseFloat(tracks[0]) || 0;

  summary.innerHTML = `<strong>${count} ${count === 1 ? "column" : "columns"}</strong> · ${px(trackWidth)} each · container ${px(width)}`;

  let reason;
  if (overflow) reason = `Min width ${px(min)} is wider than the container, so 1 column that overflows.`;
  else if (count >= cols) reason = `All ${cols} fit, so each gets the even share.`;
  else reason = `Only ${count} fit: the ${px(min)} min width is bigger than the even share (${px(share)}).`;

  values.innerHTML = [
    ["Container width", px(width)],
    [`Even share for ${cols}`, `(${px(width)} − ${cols - 1} × ${gap}px) / ${cols} = ${px(share)}`],
    ["Column min", `max(${px(min)}, ${px(share)}) = <strong class="stats__em">${px(columnMin)}</strong>`],
    ["Columns", `<strong class="stats__em">${count}</strong> of max ${cols}. ${reason}`],
    ["Cells", containers.checked ? "Containers (inline-size): content adapts" : "Normal: content can't adapt"],
  ]
    .map(
      ([k, v]) => `<div class="stats__row"><dt class="stats__label">${k}</dt><dd class="stats__value">${v}</dd></div>`,
    )
    .join("");

  warning.hidden = !overflow;
  warning.textContent = overflow
    ? `Min width (${px(min)}) is wider than the container (${px(width)}), so cells overflow. Lower the min width, or use min(100%, ${px(min)}) so cells can shrink.`
    : "";

  updateCode();
}

function updateCode() {
  const cols = read("cols");
  const min = read("min");
  const gap = read("gap");
  const cellCss = containers.checked
    ? `.grid > * {
  max-width: 100%;
  container: grid-item / inline-size;
}

/* Content reacts to the cell, not the page */
@container grid-item (min-width: 300px) {
  .card { grid-template-columns: 88px 1fr; }
}`
    : `.grid > * {
  max-width: 100%;
}`;

  cssCode.textContent = `.grid {
  display: grid;
  gap: ${gap}px;
  grid-template-columns: repeat(
    auto-fill,
    minmax(max(${min}px, calc((100% - ${cols - 1} * ${gap}px) / ${cols})), 1fr)
  );
}

${cellCss}`;

  const props = [`cols={${cols}}`];
  if (min !== 260) props.push(`minWidth="${min}px"`);
  if (gap === 0) props.push("gap={false}");
  const custom = gap !== 0 && gap !== 16;
  if (custom) props.push(`className="gap-${gap}"`);
  const cell = containers.checked ? "<Cell>" : "<Cell cellNormal>";

  reactCode.textContent = `<Row ${props.join(" ")}>
  ${cell}…</Cell>
  ${cell}…</Cell>
</Row>${custom ? `\n\n/* gap other than 16px: set --_gap */\n.gap-${gap} { --_gap: ${gap}px; }` : ""}`;
}

/* ---------- Controls ---------- */

for (const [key, { range, number }] of Object.entries(fields)) {
  const apply = () => {
    if (key === "items") setItems(read("items"));
    else if (key === "width") frameWidth.set(read("width"));
    else applyGrid();
    requestAnimationFrame(update);
  };

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

containers.addEventListener("change", () => {
  applyGrid();
  requestAnimationFrame(update);
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

/* ---------- Width: slider ↔ drag ↔ window (shared/frame.js) ---------- */

const frameWidth = window.bindFrameWidth({
  stage,
  frame,
  target: grid,
  range: fields.width.range,
  number: fields.width.number,
  onChange: update,
});

/* ---------- Start ---------- */

applyGrid();
setItems(read("items"));
update();

/* ---------- Walkthrough (shared/tour.js) ---------- */

const TOUR_STEPS = [
  {
    popover: {
      title: "Welcome to the Grid Playground",
      description: "A quick tour of how this grid decides how many columns to show. It takes about a minute.",
    },
  },
  {
    element: ".app__intro",
    popover: {
      title: "How this grid works",
      description:
        "It shows <strong>up to</strong> a number of columns, and drops columns on its own when they'd get too narrow. No breakpoints: it reacts to the space it's in.",
    },
  },
  {
    element: ".control:has(#cols)",
    info: { target: 'label[for="cols-number"]' },
    popover: {
      title: "Max columns",
      description:
        "The <strong>most</strong> columns the grid will show, not always what you get. With less space you'll see fewer.",
    },
  },
  {
    element: ".control:has(#min)",
    info: { target: 'label[for="min-number"]' },
    popover: {
      title: "Min width",
      description:
        "The narrowest a column may get. When there isn't room for every column at this width, the grid drops a column.",
    },
  },
  {
    element: ".control:has(#gap)",
    info: { target: 'label[for="gap-number"]' },
    popover: {
      title: "Gap and Items",
      description: "The space between cells, and next to it how many cells to show.",
    },
  },
  {
    element: ".control:has(#width)",
    info: { target: 'label[for="width-number"]' },
    popover: {
      title: "Container",
      description:
        "Pretend the grid sits in a narrower space, like a sidebar or a modal. You can also drag the corner of the grid.",
    },
  },
  {
    element: "#frame",
    info: { target: ".stage__hint" },
    popover: {
      title: "The grid",
      description:
        "The dashed frame is the space the grid has. The line above it says how many columns fit right now and how wide they are.",
    },
  },
  {
    element: "#grid .demo-grid__cell:first-child",
    popover: {
      title: "A cell",
      description:
        "Each cell shows its own width. At 300px or wider it switches to side by side. That depends on the <strong>cell's</strong> width, not the page's.",
    },
  },
  {
    element: ".control--switch",
    info: { target: ".control--switch .switch" },
    popover: {
      title: "Cells are containers",
      description:
        "On, each cell is a container, so its content can adapt to the cell. Off is <code>cellNormal</code>: the content can't adapt. Subgrid cards need it off; see the Subgrid playground.",
    },
  },
  {
    element: ".card:has(#values)",
    info: { target: ".card:has(#values) .card__head" },
    popover: {
      title: "How many columns?",
      description: "The math behind what you see: the even share, the column minimum, and why this many columns fit.",
    },
  },
  {
    element: ".card:has(#css-code)",
    info: { target: ".card:has(#css-code) .card__title" },
    popover: {
      title: "CSS and React",
      description:
        "The code for your current settings: plain CSS here, and the <code>Row</code> / <code>Cell</code> component next to it. Copy either one.",
    },
  },
  {
    element: ".compat",
    info: { target: "#compat-title" },
    popover: {
      title: "Browser support",
      description:
        "Which browsers support grid, max() and container queries, since which version, and whether yours does.",
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

window.setupTour({ key: "grid-tour-done", steps: TOUR_STEPS });

// Info icons: tour steps that say where their icon goes, plus a few controls the tour doesn't cover.
const INFO_ONLY = [
  {
    info: { target: 'label[for="items-number"]' },
    popover: { title: "Items", description: "How many cells to show in the grid." },
  },
];
window.setupInfoTips([...TOUR_STEPS.filter((step) => step.info), ...INFO_ONLY]);
