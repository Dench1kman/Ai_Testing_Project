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

    // Выбираем иконку
    let iconSrc;
    if (type === "success") iconSrc = "../css/img/Link2_Ic.svg";
    else if (type === "success-download") iconSrc = "../css/img/Success_Ic.svg";
    else iconSrc = "../css/img/Warning_Ic.svg";

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

  // --- Кнопка Download ---
  const downloadBtn = document.querySelector(".download-btn");
  downloadBtn?.addEventListener("click", () => {
    setTimeout(() => (downloadBtn.style.filter = ""), 200);

    // Показываем toast уведомление
    showToast("Download started!", "success-download");
  });

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
      showCustomPopup(
        "Are you sure you want to go back to the main page?<br>All your data will be lost.",
        () => {
          window.location.replace("../index.html"); // Действие при "Yes"
        },
        () => {
          history.pushState({ fake: true }, "", location.href); // Действие при "No"
        }
      );
    });
  }

  // --- Кнопка Home ---
  const homeBtn = document.querySelector(".home-btn");

  homeBtn?.addEventListener("click", () => {
    // Генерируем попап точно так же, как при возврате назад
    showCustomPopup(
      "Are you sure you want to go back to the main page?<br>All your data will be lost.",
      () => {
        window.location.href = `../index.html`;
      },
      () => {
        // Back on the current page
      }
    );
  });

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
      // Используем кастомный попап для подтверждения перехода
      showCustomPopup(
        "Are you sure you want to generate new test cases?<br>All your data will be lost.",
        () => {
          // Действие при подтверждении
          window.location.href = `../pages/loader.html?next=testcases.html`;
        },
        () => {
          // Back to the current page
        }
      );
    });
  }
});

// --- Разворачивание и сворачивание кейсов ---
document.querySelectorAll(".tc-item").forEach((item) => {
  const arrow = item.querySelector(".tc-arrow");
  const content = item.querySelector(".tc-content"); // блок с steps/expected result

  if (!arrow || !content) return;

  // Изначально скрываем контент
  content.style.maxHeight = "0px";
  content.style.overflow = "hidden";
  content.style.transition = "max-height 0.3s ease";

  arrow.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    if (isOpen) {
      item.classList.remove("open");
      content.style.maxHeight = "0px"; // Мне кажется нужно что то тут поменять чтобы плавно закрывалось
    } else {
      item.classList.add("open");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

// --- Универсальная функция для кастомного попапа ---
function showCustomPopup(message, onConfirm, onCancel) {
  // Если попап уже есть, не создаём новый
  if (document.getElementById("back-popup")) return;

  const popup = document.createElement("div");
  popup.id = "back-popup";
  popup.innerHTML = `
    <div class="popup-overlay"></div>
    <div class="popup-box">
      <p>${message}</p>
      <div class="popup-buttons">
        <button id="popup-yes">Yes</button>
        <button id="popup-no">No</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  // Подтвердить
  document.getElementById("popup-yes").onclick = () => {
    popup.remove();
    if (onConfirm) onConfirm();
  };

  // Отмена
  document.getElementById("popup-no").onclick = () => {
    popup.remove();
    if (onCancel) onCancel();
  };
}
