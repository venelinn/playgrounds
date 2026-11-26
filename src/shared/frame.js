// Resizable demo frame (shared/grid.css .frame), shared by the Grid and Subgrid playgrounds.
//
// const frameWidth = window.bindFrameWidth({ stage, frame, target, range, number, onChange });
// frameWidth.set(px)  // call from the width slider
//
// Keeps three things in sync: the width slider, the frame's drag corner and the window size.
// The width is the target's own width (the grid inside the frame, without the frame's padding and border).
window.bindFrameWidth = ({ stage, frame, target, range, number, onChange }) => {
  const FRAME_CHROME = 2 * (12 + 1); // frame padding + border, both sides
  const STAGE_PADDING = 2 * 16;

  const set = (width) => {
    frame.style.removeProperty("width"); // drop any width left by dragging the corner
    frame.style.setProperty("--frame-width", `${width + FRAME_CHROME}px`);
  };

  // Slider max follows the space available; dragging the corner moves the slider.
  const observer = new ResizeObserver(() => {
    const max = Math.max(240, Math.floor(stage.clientWidth - STAGE_PADDING - FRAME_CHROME));
    const wasFull = Number(range.value) >= Number(range.max);
    range.max = String(max);
    number.max = String(max);

    if (wasFull && !frame.style.width) {
      range.value = String(max);
      set(max);
    } else {
      range.value = String(Math.min(Math.round(target.getBoundingClientRect().width), max));
    }
    number.value = range.value;
    onChange();
  });
  observer.observe(stage);
  observer.observe(frame);

  return { set };
};
