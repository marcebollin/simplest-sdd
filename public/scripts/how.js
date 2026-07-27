const annotationControls = [...document.querySelectorAll("[data-annotation-control]")];
const promptTabs = [...document.querySelectorAll("[data-prompt-tab]")];
const promptPanels = [...document.querySelectorAll("[data-prompt-panel]")];
const promptSummaries = [...document.querySelectorAll("[data-prompt-summary]")];
const promptMapLinks = [...document.querySelectorAll(".prompt-map a[href^='#']")];
const backToTopButtons = [...document.querySelectorAll("[data-back-to-top]")];

function syncPromptMap() {
  const activePanel = promptPanels.find((panel) => !panel.hidden);
  if (!activePanel) return;

  const sections = [...activePanel.querySelectorAll(".prompt-section")];
  if (sections.length === 0) return;

  const viewportAnchor = Math.min(window.innerHeight * 0.28, 220);
  let activeSection = sections[0];

  for (const section of sections) {
    if (section.getBoundingClientRect().top <= viewportAnchor) activeSection = section;
    else break;
  }

  const pageBottom = window.scrollY + window.innerHeight;
  const isAtPageEnd = pageBottom >= document.documentElement.scrollHeight - 2;
  if (isAtPageEnd) activeSection = sections.at(-1);

  const activeLink = activePanel.querySelector(`.prompt-map a[href="#${CSS.escape(activeSection.id)}"]`);
  promptMapLinks.forEach((link) => {
    if (link === activeLink) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });

  const promptMap = activePanel.querySelector(".prompt-map");
  if (!promptMap || !activeLink) return;

  if (isAtPageEnd) {
    promptMap.scrollTop = promptMap.scrollHeight;
    return;
  }

  const mapRect = promptMap.getBoundingClientRect();
  const linkRect = activeLink.getBoundingClientRect();
  const mapHeading = promptMap.querySelector(":scope > p");
  const topBoundary = mapRect.top + (mapHeading?.offsetHeight ?? 0) + 12;
  const bottomBoundary = mapRect.bottom - 12;

  if (linkRect.top < topBoundary) {
    promptMap.scrollTop += linkRect.top - topBoundary;
  } else if (linkRect.bottom > bottomBoundary) {
    promptMap.scrollTop += linkRect.bottom - bottomBoundary;
  }
}

let promptMapFrame = 0;

function schedulePromptMapSync() {
  if (promptMapFrame) return;
  promptMapFrame = window.requestAnimationFrame(() => {
    promptMapFrame = 0;
    syncPromptMap();
  });
}

function closeAnnotation(control) {
  control.classList.remove("annotation-control--open");
  control.querySelector("button")?.setAttribute("aria-expanded", "false");
}

function activatePrompt(promptId, { updateUrl = true } = {}) {
  const nextTab = promptTabs.find((tab) => tab.dataset.promptTab === promptId);
  const nextPanel = promptPanels.find((panel) => panel.dataset.promptPanel === promptId);
  if (!nextTab || !nextPanel) return;

  annotationControls.forEach(closeAnnotation);
  promptTabs.forEach((tab) => {
    const active = tab === nextTab;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  promptPanels.forEach((panel) => {
    panel.hidden = panel !== nextPanel;
  });
  promptSummaries.forEach((summary) => {
    summary.hidden = summary.dataset.promptSummary !== promptId;
  });
  schedulePromptMapSync();

  if (updateUrl) {
    const url = new URL(window.location.href);
    if (promptId === "init") url.searchParams.delete("prompt");
    else url.searchParams.set("prompt", promptId);
    url.hash = "";
    window.history.replaceState({}, "", url);
  }
}

promptTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activatePrompt(tab.dataset.promptTab));

  tab.addEventListener("keydown", (event) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % promptTabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + promptTabs.length) % promptTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = promptTabs.length - 1;
    else return;

    event.preventDefault();
    const nextTab = promptTabs[nextIndex];
    activatePrompt(nextTab.dataset.promptTab);
    nextTab.focus();
  });
});

annotationControls.forEach((control) => {
  const button = control.querySelector("button");
  if (!button) return;

  button.addEventListener("click", () => {
    const willOpen = !control.classList.contains("annotation-control--open");
    annotationControls.forEach(closeAnnotation);
    control.classList.toggle("annotation-control--open", willOpen);
    button.setAttribute("aria-expanded", String(willOpen));
  });
});

document.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("[data-annotation-control]")) return;
  annotationControls.forEach(closeAnnotation);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  annotationControls.forEach(closeAnnotation);
});

const hashTarget = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
const hashPanel = hashTarget?.closest("[data-prompt-panel]")?.dataset.promptPanel;
const queryPrompt = new URLSearchParams(window.location.search).get("prompt");
const initialPrompt = hashPanel || queryPrompt || "init";
activatePrompt(initialPrompt, { updateUrl: false });

backToTopButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    window.scrollTo({ top: 0, behavior });
  });
});

window.addEventListener("scroll", schedulePromptMapSync, { passive: true });
window.addEventListener("resize", schedulePromptMapSync);
