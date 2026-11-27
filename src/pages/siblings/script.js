const $ = (id) => document.getElementById(id);

/* ---------- Data ---------- */

// Icons: Lucide (ISC), inline so there are no requests.
const PRODUCTS = [
  {
    title: "Smart Watch",
    text: "Track your workouts and stay connected with instant wrist notifications.",
    icon: '<circle cx="12" cy="12" r="6"/><path d="M12 10v2l1 1"/><path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05"/><path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05"/>',
  },
  {
    title: "Headphones",
    text: "Immersive studio audio paired with adaptive noise cancellation.",
    icon: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
  },
  {
    title: "Camera",
    text: "Capture every single moment with ultra-sharp detail and speed.",
    icon: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  },
  {
    title: "Laptop",
    text: "Uncompromising powerhouse performance in a lightweight body.",
    icon: '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',
  },
  {
    title: "Gaming",
    text: "Level up your gaming performance with precision and speed.",
    icon: '<path d="M6 12h4M8 10v4M15 13h.01M18 11h.01"/><rect width="20" height="12" x="2" y="6" rx="2"/>',
  },
  {
    title: "Smartphone",
    text: "Everything you need, beautifully packaged for your pocket.",
    icon: '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
  },
  {
    title: "Keyboard",
    text: "Fast, tactile switches built specifically for power creators.",
    icon: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/>',
  },
  {
    title: "Monitor",
    text: "Sharp, color-accurate visuals with a smooth refresh rate.",
    icon: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
  },
  {
    title: "Speaker",
    text: "Room-filling sound with deep, clear bass.",
    icon: '<rect width="16" height="20" x="4" y="2" rx="2"/><circle cx="12" cy="14" r="4"/><path d="M12 6h.01"/>',
  },
  {
    title: "Tablet",
    text: "A big, bright screen that goes anywhere you do.",
    icon: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M12 18h.01"/>',
  },
  {
    title: "Mouse",
    text: "Precise tracking that keeps up with every move.",
    icon: '<rect x="5" y="2" width="14" height="20" rx="7"/><path d="M12 6v4"/>',
  },
  {
    title: "Printer",
    text: "Sharp prints at home, ready in seconds.",
    icon: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
  },
];

/* ---------- Elements & state ---------- */

const products = $("products");
const cssCode = $("css-code");
const inspect = $("inspect");
const inspectTitle = $("inspect-title");
const copyButton = $("copy");

const SUPPORTED = CSS.supports("z-index", "sibling-index()") && CSS.supports("z-index", "sibling-count()");
$("support").hidden = SUPPORTED;

const fields = Object.fromEntries(
  ["count", "stagger", "hue", "sat"].map((k) => [k, { range: $(k), number: $(`${k}-number`) }]),
);
const read = (k) => Number(fields[k].range.value);

let inspected = 1;

/* ---------- Render ---------- */

function cardMarkup({ title, text, icon }) {
  return `<article class="product" tabindex="0">
  <span class="product__icon" aria-hidden="true"><svg viewBox="0 0 24 24">${icon}</svg></span>
  <h3 class="product__title">${title}</h3>
  <p class="product__text">${text}</p>
  <span class="product__arrow" aria-hidden="true">→</span>
  <span class="product__badge" aria-hidden="true"></span>
</article>`;
}

// Fallback for browsers without sibling-index()/sibling-count(): same numbers, set inline.
function applyFallback() {
  if (SUPPORTED) return;
  const cards = products.children;
  [...cards].forEach((card, i) => {
    card.style.setProperty("--i", String(i + 1));
    card.style.setProperty("--n", String(cards.length));
  });
}

// Add/remove cards at the end so existing cards keep their place (and don't re-animate).
function setCount(n) {
  while (products.children.length > n) products.lastElementChild.remove();
  while (products.children.length < n) {
    products.insertAdjacentHTML("beforeend", cardMarkup(PRODUCTS[products.children.length]));
  }
  applyFallback();
  inspected = Math.min(inspected, n);
}

function replay() {
  const n = products.children.length;
  products.replaceChildren();
  setCount(n);
}

/* ---------- Output ---------- */

function updateVars() {
  products.style.setProperty("--stagger", `${read("stagger")}ms`);
  products.style.setProperty("--hue-start", `${read("hue")}deg`);
  products.style.setProperty("--sat", `${read("sat")}%`);
}

function updateCode() {
  const start = read("hue");
  const sat = read("sat");
  const hue = start
    ? `calc(360deg / sibling-count() * (sibling-index() - 1) + ${start}deg)`
    : "calc(360deg / sibling-count() * (sibling-index() - 1))";

  cssCode.textContent = `.card {
  --hue: ${hue};
  animation: cardReveal 0.8s both;
  animation-delay: calc((sibling-index() - 1) * ${read("stagger")}ms);
  counter-reset: num sibling-index();
}

.card::before {          /* corner circle */
  background: hsl(var(--hue) ${sat}% 60%);
  opacity: 0.12;
}

.card::after {           /* 01, 02, 03… */
  content: counter(num, decimal-leading-zero);
}

.card:hover {
  border-color: hsl(var(--hue) ${sat}% 60% / 0.55);
  box-shadow: 0 20px 40px -15px hsl(var(--hue) ${sat}% 60% / 0.2);
}

@keyframes cardReveal {
  from { opacity: 0; transform: translateY(30px) scale(0.94); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}`;
}

// Read the numbers back from the card's computed style, so the panel shows what CSS worked out.
function updateInspect() {
  const card = products.children[inspected - 1];
  if (!card) return;
  const cs = getComputedStyle(card);
  const i = parseInt(cs.getPropertyValue("--i"), 10) || inspected;
  const n = parseInt(cs.getPropertyValue("--n"), 10) || products.children.length;
  const start = read("hue");
  const hue = ((360 / n) * (i - 1) + start) % 360;
  const delay = (i - 1) * read("stagger");
  const swatch = `hsl(${hue.toFixed(1)}deg ${read("sat")}% 60%)`;

  inspectTitle.textContent = `Card ${i}: ${PRODUCTS[i - 1].title}`;
  inspect.innerHTML = [
    ["sibling-index()", i],
    ["sibling-count()", n],
    [
      "Hue",
      `<span class="stats__swatch" style="--swatch: ${swatch}"></span>360° / ${n} × ${i - 1}${start ? ` + ${start}°` : ""} = ${Number(hue.toFixed(1))}°`,
    ],
    ["Delay", `(${i} − 1) × ${read("stagger")}ms = ${delay}ms`],
    ["Number", String(i).padStart(2, "0")],
  ]
    .map(
      ([k, v]) => `<div class="stats__row"><dt class="stats__label">${k}</dt><dd class="stats__value">${v}</dd></div>`,
    )
    .join("");
}

function update() {
  updateVars();
  updateCode();
  updateInspect();
}

/* ---------- Controls ---------- */

Object.entries(fields).forEach(([key, { range, number }]) => {
  const apply = () => {
    if (key === "count") setCount(read("count"));
    update();
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

  // On blur, snap the box to what the slider actually accepted.
  number.addEventListener("change", () => {
    number.value = range.value;
  });
});

$("show-values").addEventListener("change", (e) => {
  products.dataset.showValues = String(e.target.checked);
});

$("replay").addEventListener("click", replay);

const pickCard = (e) => {
  const card = e.target.closest(".product");
  if (!card) return;
  inspected = [...products.children].indexOf(card) + 1;
  updateInspect();
};
products.addEventListener("pointerover", pickCard);
products.addEventListener("focusin", pickCard);

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

/* ---------- Start ---------- */

setCount(read("count"));
update();

/* ---------- Walkthrough (shared/tour.js) ---------- */

const TOUR_STEPS = [
  {
    popover: {
      title: "Welcome to the Siblings Playground",
      description: "A quick tour of what each part does. It takes about 30 seconds.",
    },
  },
  {
    element: ".app__intro",
    popover: {
      title: "Two new CSS functions",
      description:
        "<strong>sibling-index()</strong> is an element's position: 1, 2, 3… <strong>sibling-count()</strong> is how many siblings it has.",
    },
  },
  {
    element: ".control:has(#count)",
    info: { target: 'label[for="count-number"]' },
    popover: {
      title: "Cards",
      description: "Add or remove cards. Every card recolors and renumbers itself, because the count changed.",
    },
  },
  {
    element: ".control:has(#stagger)",
    info: { target: 'label[for="stagger-number"]' },
    popover: {
      title: "Stagger",
      description: "The pause between cards as they appear. Card 3 waits (3 − 1) × 100ms = 200ms.",
    },
  },
  {
    element: ".control:has(#hue)",
    info: { target: 'label[for="hue-number"]' },
    popover: {
      title: "Start hue",
      description: "Where on the color wheel the first card starts. The others are spread evenly around the wheel.",
    },
  },
  {
    element: ".control:has(#sat)",
    info: { target: 'label[for="sat-number"]' },
    popover: {
      title: "Saturation",
      description: "How strong the card colors are, from gray (0%) to vivid (100%).",
    },
  },
  {
    element: ".control--actions",
    info: { target: ".control--actions", corner: true },
    popover: {
      title: "Show values and Replay",
      description:
        "<strong>Show values</strong> puts each card's position and total on it, like 3 / 8. <strong>Replay</strong> runs the entrance animation again.",
    },
  },
  {
    element: ".products .product:first-child",
    info: { target: "#stage-title" },
    popover: {
      title: "A card",
      description:
        "Each card works out its own color, big number and animation delay from its position. No extra classes, nothing set by hand.",
    },
  },
  {
    element: ".card:has(#css-code)",
    info: { target: ".card:has(#css-code) .card__title" },
    popover: {
      title: "CSS for developers",
      description: "The code behind the cards, with your current settings. Copy it into a ticket or your spec.",
    },
  },
  {
    element: ".card:has(#inspect)",
    info: { target: ".card:has(#inspect)", corner: true },
    popover: {
      title: "Card inspector",
      description: "Hover or focus a card to see its numbers and the math behind its color and delay.",
    },
  },
  {
    element: ".compat",
    info: { target: "#compat-title" },
    popover: {
      title: "Browser support",
      description: "Which browsers support these functions, since which version, and whether yours does.",
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

window.setupTour({ key: "siblings-tour-done", steps: TOUR_STEPS });

// Info icons: tour steps that say where their icon goes, plus a few controls the tour doesn't cover.
const INFO_ONLY = [];
window.setupInfoTips([...TOUR_STEPS.filter((step) => step.info), ...INFO_ONLY]);
