document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname;
  const input = document.getElementById("url-input");
  const pasteBtn = document.getElementById("paste-link");
  const buttonsLinks = document.querySelectorAll(".buttons a");
  const inputWrapper = document.querySelector(".input-wrapper");

  // --- Функция для показа toast ---
  function showToast(message, type = "error") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }

    const existingToasts = container.querySelectorAll(".toast");
    if (existingToasts.length >= 3) existingToasts[0].remove();

    const iconSrc =
      type === "success"
        ? "../css/img/Link2_Ic.svg"
        : "../css/img/Warning_Ic.svg";

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <div class="toast-bar"></div>
      <img src="${iconSrc}" alt="icon" class="toast-icon" />
      <span class="toast-text">${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => (toast.style.opacity = "1"), 10);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  // --- Обработчик кнопки вставки ссылки ---
  if (pasteBtn && input) {
    pasteBtn.addEventListener("click", async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text?.trim()) {
          input.value = text.trim();
          showToast("Link pasted successfully!", "success");
        } else {
          showToast("Clipboard is empty!", "error");
        }
      } catch (err) {
        console.error("Clipboard error:", err);
        showToast("Failed to access clipboard.", "error");
      }
    });
  }

  // --- Вставка ссылки из query-параметра (для testcases.html и tc-code.html) ---
  if (input) {
    const params = new URLSearchParams(window.location.search);
    const nextLink = params.get("next");
    if (nextLink) input.value = nextLink;
  }

  // --- Валидация и переход по кнопкам ---
  if (input && buttonsLinks.length > 0) {
    const urlPattern =
      /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;

    function validateAndGo(href) {
      const value = input.value.trim();
      if (!value || !urlPattern.test(value)) {
        showToast("Please enter a valid URL!");
        return;
      }
      localStorage.setItem("userURL", value);

      window.location.href = href;
    }

    buttonsLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        validateAndGo(link.getAttribute("href"));
      });
    });
  }

  // Вывод ссылки в поле инпут на страницах "testcases" и "tc-code"
  if (
    currentPage.endsWith("tc-code.html") ||
    currentPage.endsWith("testcases.html")
  ) {
    const input = document.querySelector(".url-input");
    if (input) {
      const savedURL = localStorage.getItem("userURL");
      if (savedURL) {
        input.value = savedURL;
      }
    }
  }

  // --- Попап при возврате на страницы tc-code и testcases ---
  if (
    currentPage.endsWith("tc-code.html") ||
    currentPage.endsWith("testcases.html")
  ) {
    history.pushState({ fake: true }, "", location.href);

    window.addEventListener("popstate", (event) => {
      event.preventDefault();
      if (document.getElementById("back-popup")) return;

      const popup = document.createElement("div");
      popup.id = "back-popup";
      popup.innerHTML = `
        <div class="popup-overlay"></div>
        <div class="popup-box">
          <p>Are you sure you want to go back to the main page?<br>All your data will be lost.</p>
          <div class="popup-buttons">
            <button id="popup-yes">Yes</button>
            <button id="popup-no">No</button>
          </div>
        </div>
      `;
      document.body.appendChild(popup);

      document.getElementById("popup-yes").onclick = () => {
        popup.remove();
        window.location.replace("../index.html");
      };
      document.getElementById("popup-no").onclick = () => {
        popup.remove();
        history.pushState({ fake: true }, "", location.href);
      };
    });
  }

  // --- Главная страница: блокировка возврата и очистка поля ---
  if (currentPage.endsWith("index.html")) {
    history.pushState({ main: true }, "", location.href);
    window.addEventListener("popstate", () => {
      history.pushState({ main: true }, "", location.href);
    });

    if (input) input.value = "";
  }

  // --- Показываем кнопку "Generate" на testcases.html и tc-code.html ---
  if (
    currentPage.endsWith("testcases.html") ||
    currentPage.endsWith("tc-code.html")
  ) {
    if (!inputWrapper || !input) return;

    // Создаём кнопку
    const generateBtn = document.createElement("button");
    generateBtn.textContent = "Generate";
    generateBtn.className = "generate-btn";

    const urlPattern =
      /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;

    // Функция показа/скрытия кнопки
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

    // --- Слушаем изменения в поле ---
    input.addEventListener("input", toggleGenerateBtn);

    // --- Слушаем вставку через кнопку paste ---
    if (pasteBtn) {
      pasteBtn.addEventListener("click", async () => {
        try {
          const text = await navigator.clipboard.readText();
          if (text?.trim()) {
            input.value = text.trim();
            toggleGenerateBtn(); // показываем кнопку после вставки
            //showToast("Link pasted successfully!", "success");
          } else {
            showToast("Clipboard is empty!", "error");
          }
        } catch (err) {
          console.error("Clipboard error:", err);
          showToast("Failed to access clipboard.", "error");
        }
      });
    }

    // --- Действие кнопки Generate ---
    generateBtn.addEventListener("click", () => {
      showToast("Generate button clicked!", "success");
    });
  }
});
