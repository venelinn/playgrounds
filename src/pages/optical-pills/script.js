// Optical Pills playground. The script writes the balanced pill's CSS from the controls into
// <style id="live-css"> and the CSS card (same text), moves the icon, and measures both pills
// for the checks, the numbers and the guides. The spacing itself is all CSS.

const $ = (id) => document.getElementById(id);

const pills = $("pills");
const liveCss = $("live-css");
const cssCode = $("css-code");
const copyButton = $("copy");
const fixes = { icon: $("fix-icon"), curve: $("fix-curve"), gap: $("fix-gap") };
const guides = $("guides");
const demos = [...pills.querySelectorAll(".pill-demo")];

const fields = Object.fromEntries(
  ["size", "py", "px", "round"].map((k) => [k, { range: $(k), number: $(`${k}-number`) }]),
);
const read = (k) => Number(fields[k].range.value);
const iconPlace = () => document.querySelector('input[name="icon"]:checked').value;

/* ---------- The CSS ---------- */

const num = (v) => String(Number(v.toFixed(2)));

function buildCss() {
  const round = read("round") / 100;
  const moves = fixes.icon.checked || fixes.curve.checked;
  const parts = [
    `/* 1. The button: everything comes from these */
.button {
  --py: ${num(read("py"))}em; /* top and bottom */
  --px: ${num(read("px"))}em; /* sides */
  --pill: calc(var(--py) + 0.5lh); /* half the height */
  --round: ${num(round)}; /* 1 pill, 0 square */
  --r: calc(var(--pill) * var(--round));

  display: inline-flex;
  align-items: center;
  gap: ${fixes.gap.checked ? "var(--_gap, var(--py));" : "var(--py);"}
  padding: var(--py) var(--px);
  border-radius: var(--r);
}${
      fixes.gap.checked
        ? `

/* Gap to the capitals (no cap unit: --py) */
@supports (width: 1cap) {
  .button {
    --_gap: max(var(--py), var(--px) - (1lh - 1cap) / 2);
  }
}`
        : ""
    }`,
    `/* 2. The icon: one line tall${fixes.icon.checked ? ", --py on every side" : ""} */
.button__icon {${fixes.icon.checked ? "\n  --edge: calc(var(--py) - var(--px));\n" : ""}
  inline-size: 1lh;
  block-size: 1lh;
}`,
  ];
  if (fixes.curve.checked) {
    parts.push(`/* 3. The label: gets back what the curve takes */
.button__label {
  --edge: calc(var(--pill) * var(--round) * var(--round) * (1 - pi / 4));
}`);
  }
  if (moves) {
    parts.push(`/* ${parts.length + 1}. First and last child move by their --edge */
.button > :first-child {
  margin-inline-start: var(--edge, 0px);
}

.button > :last-child {
  margin-inline-end: var(--edge, 0px);
}`);
  }
  return parts.join("\n\n");
}

/* ---------- Measuring ---------- */

const px = (v) => Math.round(v);

function check(ok, text) {
  const li = document.createElement("li");
  li.className = "check";
  li.dataset.ok = String(ok);
  li.textContent = `${ok ? "✓" : "✗"} ${text}`;
  return li;
}

// One side of a pill: the icon should have the same space at the side as above it;
// the label should look like --px once the curve's share is taken off.
function side(name, el, space, m) {
  if (el.classList.contains("pill__icon")) {
    const top = (m.height - el.getBoundingClientRect().height) / 2;
    const ok = Math.abs(space - top) < 0.75;
    const text = ok
      ? `${name}: ${m.r >= m.half - 0.5 ? "concentric, " : ""}${px(top)} all around`
      : `${name}: off-centre, ${px(space)} beside, ${px(top)} above`;
    return { chip: check(ok, text), guide: 0, cut: null };
  }
  const looks = space - m.cut;
  const ok = Math.abs(looks - m.px) < 0.75;
  const text = ok ? `${name}: looks like ${px(m.px)}` : `${name}: looks like ${px(looks)}, not ${px(m.px)}`;
  return { chip: check(ok, text), guide: space, cut: m.cut };
}

function measure() {
  for (const demo of demos) {
    const pill = demo.querySelector(".pill");
    const box = pill.getBoundingClientRect();
    const cs = getComputedStyle(pill);
    const half = box.height / 2;
    const r = Math.min(parseFloat(cs.borderTopLeftRadius) || 0, half);
    const m = {
      height: box.height,
      half,
      r,
      px: parseFloat(cs.paddingLeft),
      cut: (r * r * (1 - Math.PI / 4)) / half,
    };

    const kids = [...pill.children];
    const first = kids[0].getBoundingClientRect();
    const last = kids.at(-1).getBoundingClientRect();
    const start = side("Start", kids[0], first.left - box.left, m);
    const end = side("End", kids.at(-1), box.right - last.right, m);

    demo.querySelector(".pill-demo__checks").replaceChildren(start.chip, end.chip);
    pill.style.setProperty("--guide-start", `${start.guide}px`);
    pill.style.setProperty("--guide-end", `${end.guide}px`);
    pill.style.setProperty("--cut-start", start.cut === null ? "-9px" : `${start.cut}px`);
    pill.style.setProperty("--cut-end", end.cut === null ? "-9px" : `${end.cut}px`);

    const numbers = [["start", first.left - box.left]];
    if (kids.length > 1) numbers.push(["gap", kids[1].getBoundingClientRect().left - first.right]);
    numbers.push(["end", box.right - last.right]);
    demo.querySelector(".pill-demo__measures").innerHTML = numbers
      .map(([label, v]) => `${label} <strong class="pill-demo__number">${px(v)}</strong>`)
      .join(" · ");
  }
}

/* ---------- Apply ---------- */

// The icon and the label stay in the markup order the CSS expects: icon before the label, after it,
// or one of them left out. An icon-only button takes its name from aria-label.
const parts = demos.map((demo) => ({
  pill: demo.querySelector(".pill"),
  icon: demo.querySelector(".pill__icon"),
  label: demo.querySelector(".pill__label"),
}));

function placeIcons() {
  const place = iconPlace();
  for (const { pill, icon, label } of parts) {
    if (place === "only") pill.replaceChildren(icon);
    else if (place === "none") pill.replaceChildren(label);
    else if (place === "end") pill.replaceChildren(label, icon);
    else pill.replaceChildren(icon, label);
    if (place === "only") pill.setAttribute("aria-label", label.textContent);
    else pill.removeAttribute("aria-label");
  }
}

function apply() {
  const css = buildCss();
  liveCss.textContent = css;
  cssCode.textContent = css;
  pills.style.setProperty("--pill-size", `${read("size")}px`);
  pills.style.setProperty("--py", `${read("py")}em`);
  pills.style.setProperty("--px", `${read("px")}em`);
  pills.style.setProperty("--round", String(read("round") / 100));
  for (const pill of pills.querySelectorAll(".pill")) pill.dataset.guides = String(guides.checked);
  placeIcons();
  requestAnimationFrame(measure);
}

for (const { range, number } of Object.values(fields)) {
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

for (const input of document.querySelectorAll('input[name="icon"]')) input.addEventListener("change", apply);
for (const input of [...Object.values(fixes), guides]) input.addEventListener("change", apply);
new ResizeObserver(() => measure()).observe(pills);
document.fonts?.ready.then(measure);

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
      title: "Welcome to the Optical Pills Playground",
      description:
        "Why equal padding doesn't look equal on a pill button, and three small CSS fixes. About 30 seconds.",
    },
  },
  {
    element: ".group--button",
    info: { target: "#button-title" },
    popover: {
      title: "Button",
      description:
        "Text size, the space above and below the text, the space at the sides and how round the ends are. Both pills use the same values.",
    },
  },
  {
    element: ".group--icon",
    info: { target: "#icon-title" },
    popover: {
      title: "Icon",
      description:
        "Put the icon before or after the text, leave it out, or show only the icon. The same CSS handles all four: with only the icon, it gets the same space on every side and the button turns into a circle.",
    },
  },
  {
    element: ".group--fixes",
    info: { target: "#fixes-title" },
    popover: {
      title: "Corrections",
      description:
        "Turn each fix on or off on the balanced pill and watch its checks. <strong>Show guides</strong> draws the stripes, the dashed line and the ring.",
    },
  },
  {
    element: ".pill-demo:first-child",
    info: { target: "#stage-title" },
    popover: {
      title: "Plain padding",
      description:
        "The icon sits too far in, so it isn't centred in the round end. On the text side the curve takes some space away, so it looks tighter than the padding says.",
    },
  },
  {
    element: ".pill-demo--balanced",
    popover: {
      title: "Optically balanced",
      description:
        "The icon has the same space on every side, and the text side gets back what the curve took. The striped area looks as wide as the padding.",
    },
  },
  {
    element: ".compare .card:first-child",
    info: { target: ".compare .card:first-child .card__title" },
    popover: {
      title: "CSS",
      description: "The balanced pill runs on exactly this CSS. Copy it as a starting point.",
    },
  },
  {
    element: ".compare .card:nth-child(2)",
    info: { target: ".compare .card:nth-child(2) .card__title" },
    popover: {
      title: "The math",
      description: "Where each number comes from, including the π.",
    },
  },
  {
    element: ".compat",
    info: { target: "#compat-title" },
    popover: {
      title: "Browser support",
      description: "pi in calc(), and the lh and cap units. Older browsers just show a plain pill.",
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

window.setupTour({ key: "optical-pills-tour-done", steps: TOUR_STEPS });
window.setupInfoTips(TOUR_STEPS.filter((step) => step.info));
