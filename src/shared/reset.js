// Reset button in the header (#reset, in partials/head.ejs): puts every control on the page back
// where it was when the page loaded.
//
// After the page's own scripts have run, it saves each control's value (or checked state). Reset
// restores them, then fires the same input / change events a person would, only on the controls
// that changed, so each page's script updates the demo as usual. Number boxes are skipped: their
// slider's input event syncs them. A slider that started at its max (a "full width" slider whose max
// follows the window) goes back to its current max.
// The button stays hidden on pages without controls.

const button = document.getElementById("reset");
const app = document.querySelector(".app");

const controls = () =>
  [...app.querySelectorAll("input, select, textarea")].filter((el) => !el.closest(".app__actions"));

let saved = [];

function save() {
  saved = controls().map((el) => ({
    el,
    value: el.value,
    checked: el.checked,
    atMax: el.type === "range" && Number(el.value) >= Number(el.max),
  }));
  if (button) button.hidden = !saved.length;
}

function reset() {
  const changed = [];
  for (const { el, value, checked, atMax } of saved) {
    if (el.type === "checkbox" || el.type === "radio") {
      if (el.checked === checked) continue;
      el.checked = checked;
      // a radio group reacts to the one that became checked
      if (el.type === "checkbox" || checked) changed.push([el, "change"]);
      continue;
    }
    const next = atMax ? el.max : value;
    if (el.value === next) continue;
    el.value = next;
    if (el.type === "number") continue;
    changed.push([el, el.tagName === "SELECT" ? "change" : "input"]);
  }
  // every value is back before any script reacts, so handlers that read other controls see the start state
  for (const [el, type] of changed) el.dispatchEvent(new Event(type, { bubbles: true }));
}

if (button && app) {
  // after load, and a frame later so width sliders have settled on the window's size
  addEventListener("load", () => requestAnimationFrame(save), { once: true });
  button.addEventListener("click", reset);
}
