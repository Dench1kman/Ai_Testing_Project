import { currentPage, input, inputWrapper, pasteBtn } from "./constants.js";
import { showToast } from "./toast.js";
import { showCustomPopup } from "./popup.js";

export function enableGenerateButton() {
  // Показываем кнопку только на нужных страницах
  if (
    !currentPage.endsWith("testcases.html") &&
    !currentPage.endsWith("tc-code.html")
  ) {
    return;
  }

  if (!input || !inputWrapper) return;

  const generateBtn = document.createElement("button");
  generateBtn.textContent = "Generate";
  generateBtn.className = "generate-btn";

  const urlPattern =
    /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;

  // --- Показать/скрыть кнопку при изменении URL ---
  function toggleGenerateBtn() {
    const value = input.value.trim();
    if (urlPattern.test(value)) {
      if (!inputWrapper.contains(generateBtn)) {
        inputWrapper.appendChild(generateBtn);
      }
    } else {
      if (inputWrapper.contains(generateBtn)) {
        generateBtn.remove();
      }
    }
  }

  // Слушаем ввод
  input.addEventListener("input", toggleGenerateBtn);

  // Слушаем вставку через Paste
  if (pasteBtn) {
    pasteBtn.addEventListener("click", async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text?.trim()) {
          input.value = text.trim();
          toggleGenerateBtn();
        } else {
          showToast("Clipboard is empty!", "error");
        }
      } catch (err) {
        console.error("Clipboard error:", err);
        showToast("Failed to access clipboard.", "error");
      }
    });
  }

  // Действие Generate
  generateBtn.addEventListener("click", () => {
    showCustomPopup(
      "Are you sure you want to generate new test cases?<br>All your data will be lost.",
      () => {
        const currentPageName = window.location.pathname.split("/").pop();
        window.location.href = `../pages/loader.html?next=${currentPageName}`;
      },
      () => {}
    );
  });
}
