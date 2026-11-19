(function () {
  "use strict";

  var root = document.documentElement;
  var split = document.getElementById("split");
  var curtain = document.getElementById("curtain");
  var panels = document.querySelectorAll(".panel");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var leaving = false;

  // Intro animation
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      root.classList.add("is-ready");
      document.body.classList.add("is-ready");
    });
  });

  function setHover(side) {
    if (leaving) return;
    split.classList.remove("hover-left", "hover-right");
    if (side) split.classList.add("hover-" + side);
  }

  panels.forEach(function (panel) {
    var side = panel.getAttribute("data-side");
    var spotlight = panel.querySelector(".spotlight");

    panel.addEventListener("mouseenter", function () { setHover(side); });
    panel.addEventListener("mouseleave", function () { setHover(null); });
    panel.addEventListener("focus", function () { setHover(side); });
    panel.addEventListener("blur", function () { setHover(null); });

    // Spotlight follows cursor
    panel.addEventListener("mousemove", function (e) {
      var rect = panel.getBoundingClientRect();
      spotlight.style.setProperty("--mx", e.clientX - rect.left + "px");
      spotlight.style.setProperty("--my", e.clientY - rect.top + "px");
    });

    // Expand-then-navigate transition
    panel.addEventListener("click", function (e) {
      // Let ctrl/cmd/shift/middle click open in new tab normally
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (leaving) { e.preventDefault(); return; }

      e.preventDefault();
      var href = panel.href;

      if (reduceMotion) {
        window.location.href = href;
        return;
      }

      leaving = true;
      split.classList.remove("hover-left", "hover-right");
      split.classList.add("leaving-" + side);

      setTimeout(function () { curtain.classList.add("is-on"); }, 650);
      setTimeout(function () { window.location.href = href; }, 1050);
    });
  });

  // Reset state when returning via the back button (bfcache)
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      leaving = false;
      split.classList.remove("leaving-left", "leaving-right", "hover-left", "hover-right");
      curtain.classList.remove("is-on");
    }
  });
})();
