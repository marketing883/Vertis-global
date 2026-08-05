// Toggle .is-scrolled on the sticky site-nav after the user
// has scrolled past the hero threshold. Cheap scroll handler,
// rAF-batched so we only touch the class during idle frames.

export function initNavScroll() {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  const threshold = 24;
  let ticking = false;
  let lastScrolled = null;

  const sync = () => {
    const scrolled = window.scrollY > threshold;
    if (scrolled !== lastScrolled) {
      nav.classList.toggle("is-scrolled", scrolled);
      lastScrolled = scrolled;
    }
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(sync);
      ticking = true;
    }
  };

  // Set initial state without waiting for first scroll event.
  sync();

  window.addEventListener("scroll", onScroll, { passive: true });
}
