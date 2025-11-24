import { showToast } from "./toast.js";

export function enableCopy() {
  document.querySelector(".copy-btn")?.addEventListener("click", async () => {
    const code = document.querySelector(".code-area")?.innerText;
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      showToast("Code copied!", "success-download");
    } catch {
      showToast("Failed to copy code.", "error");
    }
  });
}
