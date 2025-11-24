import { currentPage } from "./constants.js";
import { showCustomPopup } from "./popup.js";

export function enableBackNavigation() {
  if (
    !currentPage.endsWith("tc-code.html") &&
    !currentPage.endsWith("testcases.html")
  )
    return;

  history.pushState({ fake: true }, "", location.href);

  window.addEventListener("popstate", () => {
    showCustomPopup(
      "Are you sure you want to go back to the main page?<br>All your data will be lost.",
      () => window.location.replace("../index.html"),
      () => history.pushState({ fake: true }, "", location.href)
    );
  });
}
