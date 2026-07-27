const wordmarkDuration = 12_000;

const startAnimatedWordmarks = () => {
  const phase = Date.now() % wordmarkDuration;

  document.querySelectorAll("[data-animated-wordmark]").forEach((wordmark) => {
    if (wordmark.classList.contains("wordmark-frame--ready")) return;

    wordmark.style.setProperty("--wordmark-clock-delay", `-${phase}ms`);
    wordmark.classList.add("wordmark-frame--ready");
  });
};

startAnimatedWordmarks();
