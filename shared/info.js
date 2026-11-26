// Discreet "i" info icons with tooltips, shared by every playground.
//
// window.setupInfoTips([{ info: { target, corner? }, popover: { title, description } }, …])
//
// The items are tour steps (shared/tour.js) with an extra `info` field, so the wording is written once.
// Info-only items (not in the tour) use the same shape.
//   info.target  selector of the element the icon goes into (appended at the end)
//   info.corner  true = put the icon in the target's top-right corner instead
//
// Pointer: hover shows, click/tap toggles, Esc or a click elsewhere closes.
// Screen readers: the icon is hidden (inside a <label> it would become part of the control's name);
// instead the control the label points to gets the text through aria-describedby.
window.setupInfoTips = (items) => {
  const tips = [];
  let open = null;
  let hideTimer;

  const close = () => {
    if (open?.tip.matches(":popover-open")) open.tip.hidePopover();
    open?.icon.setAttribute("data-open", "false");
    open = null;
  };

  const show = (entry) => {
    clearTimeout(hideTimer);
    if (open === entry) return;
    close();
    entry.tip.showPopover();
    entry.icon.setAttribute("data-open", "true");
    open = entry;
  };

  const hideSoon = () => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (open && !open.pinned) close();
    }, 150);
  };

  items.forEach(({ info, popover }, i) => {
    const target = document.querySelector(info.target);
    if (!target || !("popover" in HTMLElement.prototype)) return;

    const id = `info-tip-${i}`;
    const icon = document.createElement("span");
    icon.className = info.corner ? "info info--corner" : "info";
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("data-open", "false");
    icon.textContent = "i";
    icon.style.setProperty("--info-anchor", `--info-${i}`);
    if (info.corner) target.classList.add("has-info-corner");
    target.append(icon);

    const tip = document.createElement("div");
    tip.className = "info-tip";
    tip.id = id;
    tip.popover = "manual";
    tip.style.setProperty("--info-anchor", `--info-${i}`);
    tip.innerHTML = `<strong class="info-tip__title">${popover.title}</strong> <span class="info-tip__text">${popover.description}</span>`;
    document.body.append(tip);

    // Screen readers: describe the control this label belongs to.
    const control = target.htmlFor
      ? document.getElementById(target.htmlFor)
      : target.matches("label")
        ? target.querySelector("input, select, textarea")
        : null;
    if (control) {
      const ids = new Set((control.getAttribute("aria-describedby") || "").split(" ").filter(Boolean));
      ids.add(id);
      control.setAttribute("aria-describedby", [...ids].join(" "));
    }

    const entry = { icon, tip, pinned: false };
    tips.push(entry);

    icon.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "mouse") show(entry);
    });
    icon.addEventListener("pointerleave", hideSoon);
    tip.addEventListener("pointerenter", () => clearTimeout(hideTimer));
    tip.addEventListener("pointerleave", hideSoon);

    // Click/tap pins it open (or closes a pinned one). Don't let the label move focus to its control.
    icon.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (open === entry && entry.pinned) {
        entry.pinned = false;
        close();
      } else {
        show(entry);
        entry.pinned = true;
      }
    });
  });

  document.addEventListener("pointerdown", (e) => {
    if (open && !open.icon.contains(e.target) && !open.tip.contains(e.target)) {
      open.pinned = false;
      close();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) {
      open.pinned = false;
      close();
    }
  });
};
