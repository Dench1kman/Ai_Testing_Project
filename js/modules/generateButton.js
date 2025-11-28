import { currentPage, input, inputWrapper, pasteBtn } from "./constants.js";
import { showToast } from "./toast.js";

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
    fetch("http://localhost:3000/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: input.value }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("HTML страницы:", data.html);
        // Тут передать html в AI для генерации тестов
      })
      .catch((err) => console.error(err));
  });

  generateBtn.addEventListener("click", () => {
    const url = input.value.trim();
    if (!url) {
      showToast("Please enter a valid URL!", "error");
      return;
    }

    fetch("http://localhost:3000/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("HTML страницы:", data.html);
        // TODO: Здесь можно передавать data.html в AI для генерации тестов

        // После успешного сканирования — переходим на loader
        const currentPageName = window.location.pathname.split("/").pop();
        window.location.href = `../pages/loader.html?next=${currentPageName}`;
      })
      .catch((err) => {
        console.error(err);
        showToast("Failed to scan the page!", "error");
      });
  });
}
