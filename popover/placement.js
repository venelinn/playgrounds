// Popover placement engine: the same rules as the component library's Popover.module.scss,
// written once here and used twice: injected as the page's real CSS, and printed as the CSS output.
//
//   12 placements = 4 sides × 3 alignments; centred ones drop "-center" (e.g. "top").
//   Each placement gets an @position-try rule of the same name, and a fallback chain:
//   opposite side first, then the mirrored alignment on the same side, then both.
window.PopoverPlacement = (() => {
  const SIDES = ["top", "bottom", "left", "right"];
  const ALIGNS = ["start", "center", "end"];
  const OPPOSITE_SIDE = { top: "bottom", bottom: "top", left: "right", right: "left" };
  const OPPOSITE_ALIGN = { start: "end", center: "center", end: "start" };

  const nameOf = (side, align) => (align === "center" ? side : `${side}-${align}`);
  const parse = (name) => {
    const [side, align = "center"] = name.split("-");
    return { side, align };
  };

  function inlineAlign(align) {
    if (align === "start")
      return [
        ["left", "anchor(left)"],
        ["right", "auto"],
        ["justify-self", "auto"],
      ];
    if (align === "end")
      return [
        ["left", "auto"],
        ["right", "anchor(right)"],
        ["justify-self", "auto"],
      ];
    // `translate` isn't allowed inside @position-try; `anchor-center` is.
    return [
      ["left", "auto"],
      ["right", "auto"],
      ["justify-self", "anchor-center"],
    ];
  }

  function blockAlign(align) {
    if (align === "start")
      return [
        ["top", "anchor(top)"],
        ["bottom", "auto"],
        ["align-self", "auto"],
      ];
    if (align === "end")
      return [
        ["top", "auto"],
        ["bottom", "anchor(bottom)"],
        ["align-self", "auto"],
      ];
    return [
      ["top", "auto"],
      ["bottom", "auto"],
      ["align-self", "anchor-center"],
    ];
  }

  function declarations(side, align, offset = "var(--popover-offset)") {
    if (side === "bottom")
      return [["top", `calc(anchor(bottom) + ${offset})`], ["bottom", "auto"], ...inlineAlign(align)];
    if (side === "top") return [["top", "auto"], ["bottom", `calc(anchor(top) + ${offset})`], ...inlineAlign(align)];
    if (side === "right") return [["left", `calc(anchor(right) + ${offset})`], ["right", "auto"], ...blockAlign(align)];
    return [["left", "auto"], ["right", `calc(anchor(left) + ${offset})`], ...blockAlign(align)];
  }

  function fallbacks(side, align) {
    const flippedSide = OPPOSITE_SIDE[side];
    const flippedAlign = OPPOSITE_ALIGN[align];
    const chain = [nameOf(flippedSide, align)];
    if (align !== "center") chain.push(nameOf(side, flippedAlign), nameOf(flippedSide, flippedAlign));
    return chain;
  }

  const block = (selector, decls, indent = "") =>
    `${indent}${selector} {\n${decls.map(([p, v]) => `${indent}  ${p}: ${v};`).join("\n")}\n${indent}}`;

  const ALL = SIDES.flatMap((side) => ALIGNS.map((align) => nameOf(side, align)));

  // The full engine, as installed on this page. Fallbacks can be switched off with --_fallbacks: none.
  function engineCss() {
    const rules = ALL.flatMap((name) => {
      const { side, align } = parse(name);
      const decls = declarations(side, align);
      const chain = fallbacks(side, align)
        .map((n) => `--popover-${n}`)
        .join(", ");
      return [
        block(`@position-try --popover-${name}`, decls, "  "),
        block(
          `.popover-content[data-placement="${name}"]`,
          [...decls, ["position-try-fallbacks", `var(--_fallbacks, ${chain})`]],
          "  ",
        ),
      ];
    });
    return `@supports (anchor-name: --a) {
  .popover-content {
    position-anchor: var(--anchor);
    inset: auto;
  }

${rules.join("\n\n")}
}`;
  }

  // Just what one placement needs, for the CSS output.
  function snippet(name, { offset, flip, anchor = "--menu" }) {
    const { side, align } = parse(name);
    const chain = fallbacks(side, align);
    const decls = [
      ["position-anchor", anchor],
      ["inset", "auto"],
      ["margin", "0"],
      ["--popover-offset", `${offset}px`],
      ...declarations(side, align),
      ["position-try-fallbacks", flip ? chain.map((n) => `--popover-${n}`).join(", ") : "none"],
    ];
    const tries = flip
      ? chain.map((n) => {
          const p = parse(n);
          return block(`@position-try --popover-${n}`, declarations(p.side, p.align));
        })
      : [];
    return [block(".popover-root", [["anchor-name", anchor]]), block(".popover-content", decls), ...tries].join("\n\n");
  }

  const style = document.createElement("style");
  style.id = "popover-placement-engine";
  style.textContent = engineCss();
  document.head.append(style);

  return { ALL, parse, nameOf, fallbacks, snippet };
})();
