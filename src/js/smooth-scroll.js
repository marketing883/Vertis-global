// Lenis smooth scroll: loaded lazily after first paint.
// Keeps the critical-path script tiny; motion enhances only when idle.

export function initSmoothScroll() {
  const kick = () =>
    import("https://cdn.jsdelivr.net/npm/lenis@1.1.17/dist/lenis.mjs")
      .then(({ default: Lenis }) => {
        const lenis = new Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          wheelMultiplier: 1,
          touchMultiplier: 1.4,
        });
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      })
      .catch(() => {
        /* Lenis CDN unreachable: native scroll is fine */
      });

  // Defer until after LCP: don't contend with critical resources
  if ("requestIdleCallback" in window) {
    requestIdleCallback(kick, { timeout: 2000 });
  } else {
    setTimeout(kick, 600);
  }
}
