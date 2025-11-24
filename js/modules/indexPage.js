import { input, currentPage } from "./constants.js";

export function setupIndexPage() {
  if (!currentPage.endsWith("index.html")) return;

  history.pushState({ main: true }, "", location.href);
  window.addEventListener("popstate", () => {
    history.pushState({ main: true }, "", location.href);
  });

  if (input) input.value = "";
}
