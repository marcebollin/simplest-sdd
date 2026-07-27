const landing = document.querySelector("[data-landing]");

if (new URLSearchParams(window.location.search).get("capture") === "final") {
  landing?.classList.add("landing--capture");
}

const actionButtons = document.querySelectorAll("[data-action]");
const actionLabel = document.querySelector("[data-command-action]");
const copyButton = document.querySelector("[data-copy-button]");

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action ?? "init";
    actionButtons.forEach((option) => {
      option.setAttribute("aria-pressed", String(option === button));
    });

    if (actionLabel) {
      actionLabel.textContent = action;
      actionLabel.classList.remove("command-action--changing");
      void actionLabel.offsetWidth;
      actionLabel.classList.add("command-action--changing");
    }

    if (copyButton) {
      copyButton.dataset.copyText = `Run npx simplest-sdd@latest ${action} and follow the instructions`;
      copyButton.classList.remove("command-button--confirmed");
    }
  });
});
