import { pasteBtn, input } from "./constants.js";
import { showToast } from "./toast.js";

export function enablePaste() {
  if (!pasteBtn || !input) return;

  pasteBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text?.trim()) {
        input.value = text.trim();
        localStorage.setItem("userURL", text.trim());
        showToast("Link pasted successfully!", "success");
      } else showToast("Clipboard is empty!", "error");
    } catch {
      showToast("Clipboard error", "error");
    }
  });
}
