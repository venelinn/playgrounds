// First-visit walkthrough shared by every playground (driver.js 1.3.1 from jsDelivr).
//
// Page needs: the driver.js CSS + script, shared/tour.css, a #tour-start button, then:
//   setupTour({ key: "my-playground-tour-done", steps: [ { element, popover: { title, description } }, … ] });
//
// The tour starts on the first visit and is remembered once finished or closed.
// If driver.js didn't load (offline, blocked CDN), the ? button is hidden.
window.setupTour = ({ key, steps }) => {
  const button = document.getElementById("tour-start");
  if (!button) return;

  if (!window.driver?.js) {
    button.hidden = true;
    return;
  }

  const markDone = () => {
    try {
      localStorage.setItem(key, "1");
    } catch {}
  };

  const start = () => {
    window.driver.js
      .driver({
        steps,
        showProgress: true,
        progressText: "{{current}} of {{total}}",
        nextBtnText: "Next",
        prevBtnText: "Back",
        doneBtnText: "Done",
        popoverClass: "tour",
        overlayOpacity: 0.6,
        stagePadding: 6,
        stageRadius: 12,
        popoverOffset: 12,
        smoothScroll: true,
        onDestroyed: markDone,
      })
      .drive();
  };

  button.addEventListener("click", start);

  let seen = null;
  try {
    seen = localStorage.getItem(key);
  } catch {}
  if (!seen) setTimeout(start, 400);
};
