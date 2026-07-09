// Eco Nova Hacks — small bits of interactivity, no dependencies.
(function () {
  "use strict";

  // ----- Mobile nav toggle -----
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    // close the menu after tapping a link
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // ----- Schedule day tabs -----
  const tabs = document.querySelectorAll(".stab");
  const panels = document.querySelectorAll(".sched-panel");
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      const day = tab.dataset.day;
      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      panels.forEach((p) => p.classList.toggle("hidden", p.dataset.day !== day));
    })
  );

  // ----- Animated stat counters (run once when scrolled into view) -----
  const nums = document.querySelectorAll(".num[data-count]");
  const animate = (el) => {
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = target >= 1000 ? "+" : "";
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const val = Math.round(target * eased);
      el.textContent = prefix + val.toLocaleString() + (t === 1 ? suffix : "");
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    nums.forEach((n) => io.observe(n));
  } else {
    nums.forEach(animate);
  }
})();
