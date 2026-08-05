// Contact form enhancement.
//
// The form is a working HTML form on its own: it POSTs to /api/contact and the
// server answers 303 to /contact/thanks/. This only upgrades that to an inline
// response so the visitor keeps their place on the page. With JS off, or if
// this throws, the native submit still works.

export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const button = form.querySelector("button[type='submit']");
  const buttonLabel = button ? button.innerHTML : "";

  const status = document.createElement("p");
  status.className = "meta mt-2";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  form.append(status);

  const setStatus = (message, tone) => {
    status.textContent = message;
    status.style.color = tone === "error" ? "var(--color-pixel-magenta)" : "";
  };

  const succeed = () => {
    const panel = document.createElement("div");
    panel.className = "flex flex-col gap-4 py-8 border-t border-b border-ink-primary";
    panel.setAttribute("role", "status");
    panel.innerHTML = `
      <span class="meta section-number" style="--accent: var(--color-pixel-green)">Received</span>
      <p class="font-display font-medium text-2xl md:text-3xl leading-tight tracking-[-0.02em] max-w-xl balance">
        Thanks. We have your note and will reply within one business day.
      </p>
      <p class="text-ink-secondary pretty max-w-xl">
        If it is urgent, mail us directly and mention that you used the form.
      </p>`;
    form.replaceWith(panel);
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  form.addEventListener("submit", async (event) => {
    // Let the browser handle its own validation messages first.
    if (!form.reportValidity()) return;

    event.preventDefault();

    if (button) {
      button.disabled = true;
      button.textContent = "Sending…";
    }
    setStatus("");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });

      if (response.ok) {
        succeed();
        return;
      }

      const payload = await response.json().catch(() => ({}));
      if (response.status === 429) {
        setStatus("That is a few too many notes in a short window. Try again shortly, or mail us directly.", "error");
      } else if (payload.error === "invalid") {
        const fields = (payload.fields || []).join(", ");
        setStatus(fields ? `Please check: ${fields}.` : "Please check the highlighted fields.", "error");
      } else {
        setStatus("Something went wrong on our side. Mail us directly and we will pick it up.", "error");
      }
    } catch {
      setStatus("Could not reach the server. Check your connection, or mail us directly.", "error");
    } finally {
      if (button) {
        button.disabled = false;
        button.innerHTML = buttonLabel;
      }
    }
  });
}
