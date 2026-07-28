async function sendToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall back when the browser exposes the API but denies clipboard access.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.className = "clipboard-fallback";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Copy was not available");
}

document.querySelectorAll("[data-copy-button]").forEach((button) => {
  if (button.dataset.copyReady === "true") return;
  button.dataset.copyReady = "true";

  button.addEventListener("click", async () => {
    const originalLabel = button.getAttribute("aria-label") ?? "Copy to clipboard";

    try {
      let text = button.dataset.copyText ?? "";
      if (button.dataset.copyUrl) {
        const response = await fetch(button.dataset.copyUrl);
        if (!response.ok) throw new Error("Copy source could not be loaded");
        text = await response.text();
      }
      if (button.dataset.copySection) {
        const url = new URL(window.location.href);
        url.hash = button.dataset.copySection;
        text = url.href;
      }

      await sendToClipboard(text);
      window.clearTimeout(Number(button.dataset.copyTimer));
      button.classList.add("command-button--confirmed");
      button.setAttribute("aria-label", "Copied");
      const timer = window.setTimeout(() => {
        button.classList.remove("command-button--confirmed");
        button.setAttribute("aria-label", originalLabel);
      }, 1600);
      button.dataset.copyTimer = String(timer);
    } catch {
      button.classList.remove("command-button--confirmed");
    }
  });
});
