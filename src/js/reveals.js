// Scroll reveal: IntersectionObserver adds .is-in once.
// No per-frame JS, no ScrollTrigger runtime: just a one-shot class toggle.

export function initReveals() {
  const targets = document.querySelectorAll(".reveal, .reveal-mask");
  if (!targets.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
  );

  targets.forEach((el) => io.observe(el));
}
