import { homeBtn } from "./constants.js";
import { showCustomPopup } from "./popup.js";

export function enableHomeButton() {
  if (!homeBtn) return;

  homeBtn.addEventListener("click", () => {
    showCustomPopup(
      "Are you sure you want to go back to the main page?<br>All your data will be lost.",
      () => (window.location.href = "../index.html")
    );
  });
}
