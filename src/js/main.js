// Vertis Global: main JS entry.
// Tiny on purpose: Lenis smooth scroll + IntersectionObserver reveal.
// Everything is progressive: site works fully without this script.

import { initSmoothScroll } from "./smooth-scroll.js";
import { initReveals } from "./reveals.js";
import { initMenu } from "./menu.js";
import { initNavScroll } from "./nav-scroll.js";
import { initContactForm } from "./contact-form.js";

const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (motionOk) {
  initSmoothScroll();
  initReveals();
} else {
  // Still reveal content: just skip the animation
  document.querySelectorAll(".reveal, .reveal-mask").forEach((el) => el.classList.add("is-in"));
}

initMenu();
initNavScroll();
initContactForm();
