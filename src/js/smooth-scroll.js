// Lenis smooth scroll: loaded lazily after first paint.
// Keeps the critical-path script tiny; motion enhances only when idle.
// Self-hosted from node_modules via passthrough (see eleventy.config.mjs)
// so the page has no runtime dependency on a third-party CDN.

export function initSmoothScroll() {
  const kick = () =>
    import("/assets/js/vendor/lenis.mjs")
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
        /* Lenis unavailable: native scroll is fine */
      });

  // Defer until after LCP: don't contend with critical resources
  if ("requestIdleCallback" in window) {
    requestIdleCallback(kick, { timeout: 2000 });
  } else {
    setTimeout(kick, 600);
  }
}
