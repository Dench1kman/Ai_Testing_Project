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

  // --- COPY AUTOTEST CODE ---
  document.querySelector(".copy-btn")?.addEventListener("click", async () => {
    const code = document.querySelector(".code-area").innerText;

    try {
      await navigator.clipboard.writeText(code);
      showToast("Code copied!", "success-download"); // чтобы использовать Success_Ic
    } catch (err) {
      console.error("Failed to copy:", err);
      showToast("Failed to copy code.", "error");
    }
  });

  // --- DOWNLOAD AUTOTEST FILE ---
  document.body.addEventListener("click", (e) => {
    if (e.target.closest(".code-download")) {
      const code = document.querySelector(".code-area").innerText;
      const blob = new Blob([code], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "autotest.js";
      document.body.appendChild(a);
      a.click();
      a.remove();

      showToast("Downloading autotest.js...", "success-download");
    }
  });

  // --- EXPORT TEST CASES USING EXCELJS ---
  document
    .querySelector(".cases-download")
    ?.addEventListener("click", async () => {
      try {
        const tcItems = document.querySelectorAll(".tc-item");
        if (!tcItems.length) {
          showToast("No test cases to export!", "error");
          return;
        }

        // Заголовки
        const headers = [
          "Test Case ID",
          "Title",
          "Pre-Condition",
          "Steps",
          "Test Data",
          "Expected Result",
          "Actual Result",
          "Status",
        ];

        // Создаём workbook и worksheet
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet("Test Cases", {
          views: [{ state: "normal" }],
        });

        // Формируем header row
        const headerRow = ws.addRow(headers);
        headerRow.font = { bold: true, size: 16 };
        headerRow.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: false,
        };
        headerRow.height = 24;
        // Fill header background (light blue)
        headerRow.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD7E9FF" }, // ARGB
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });

        // Собираем данные строками
        const rows = [];
        tcItems.forEach((item, i) => {
          const id = `TC-${i + 1}`;

          // Title: берем .tc-title или .tc-name, очищаем префикс TC N -
          let rawTitle = (
            item.querySelector(".tc-title")?.innerText ||
            item.querySelector(".tc-name")?.innerText ||
            ""
          ).trim();
          rawTitle =
            rawTitle.replace(/^\s*TC[\s-]*\d+\s*[-–—]\s*/i, "").trim() || "-";

          // Steps -> "1. text\n2. text"
          let steps = "-";
          const stepsUl = item.querySelector(".tc-content ul");
          if (stepsUl) {
            const lis = Array.from(stepsUl.querySelectorAll("li")).map((li) =>
              li.innerText.trim()
            );
            if (lis.length)
              steps = lis.map((t, idx) => `${idx + 1}. ${t}`).join("\n");
          }

          // Expected Result: ищем блок с expected, если нет — делаем генерацию-обобщение
          let expected = "-";
          const expectedNode = Array.from(
            item.querySelectorAll(".tc-content p, .tc-content div")
          ).find((p) => /expected\s*result/i.test(p.innerText || ""));
          if (expectedNode) {
            expected =
              expectedNode.innerText
                .replace(/Expected\s*Result[:\s]*/i, "")
                .trim() || "-";
          } else {
            // fallback — простая генерация
            expected = `The system behaves as expected for: ${rawTitle}`;
          }

          // Pre-Condition: генерируем простую логичную подсказку
          let pre = "-";
          if (/login|sign in|log in/i.test(rawTitle))
            pre = "User is on the login page.";
          else if (/signup|register|create account/i.test(rawTitle))
            pre = "User is on the registration page.";
          else pre = "Application is opened and user is on the relevant page.";

          // Test Data: попытаемся догадаться по ключевым словам в steps/title
          let testData = "-";
          const combined = (rawTitle + " " + (steps || "")).toLowerCase();
          if (/email/.test(combined)) testData = "user@example.com";
          else if (/password/.test(combined)) testData = "Password123";
          else if (/phone|tel/i.test(combined)) testData = "+380501234567";
          else testData = "-";

          rows.push([id, rawTitle, pre, steps, testData, expected, "", ""]); // Status пустой
        });

        // Добавляем все строки в worksheet
        rows.forEach((r) => ws.addRow(r));

        // Настройки выравнивания и переносов для всех ячеек (начиная со 2-й строки)
        ws.eachRow({ includeEmpty: false }, function (row, rowNumber) {
          if (rowNumber === 1) return; // header уже настроен
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            cell.alignment = { vertical: "top", wrapText: true };
            cell.font = { size: 14 };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });
        });

        // Авто-ширина колонок (ориентировочно по количеству символов)
        const colCount = headers.length;
        for (let c = 1; c <= colCount; c++) {
          let maxLen = headers[c - 1].length;
          ws.eachRow((row, rowNumber) => {
            const cell = row.getCell(c);
            const v = cell.value;
            if (!v) return;
            // value может быть объект (например, RichText), приводим к строке
            const s =
              typeof v === "string"
                ? v
                : v.richText
                ? v.richText.map((t) => t.text).join("")
                : String(v);
            const lines = s.split("\n");
            lines.forEach((l) => {
              if (l.length > maxLen) maxLen = l.length;
            });
          });
          // Ограничение ширины, немного добавляем запас
          const width = Math.min(80, Math.max(12, Math.ceil(maxLen * 1.1)));
          ws.getColumn(c).width = width;
          ws.getColumn(1).width = Math.max(ws.getColumn(1).width, 18); // Test Case ID
          ws.getColumn(6).width = Math.max(ws.getColumn(6).width, 22); // Expected Result
          ws.getColumn(7).width = Math.max(ws.getColumn(7).width, 18); // Actual Result
        }

        // Добавляем Data Validation (dropdown) для колонки Status (последняя колонка)
        const statusCol = headers.length; // 8
        const lastRow = ws.rowCount;
        for (let r = 2; r <= lastRow; r++) {
          const cell = ws.getCell(r, statusCol);
          cell.value = "";
          cell.dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: ['"PASS,FAIL"'],
            showErrorMessage: true,
          };
        }

        // Генерируем файл (ExcelJS -> buffer -> blob -> скачиваем)
        const buffer = await wb.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "testcases.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        showToast("Test cases exported!", "success-download");
      } catch (err) {
        console.error("Export error:", err);
        showToast("Failed to export test cases.", "error");
      }
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
          const currentPageName = window.location.pathname.split("/").pop();
          window.location.href = `../pages/loader.html?next=${currentPageName}`;
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
      content.style.maxHeight = "0px";
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

// document.querySelector(".copy-btn")?.addEventListener("click", () => {
//   const code = document.querySelector(".code-area").innerText;
//   navigator.clipboard.writeText(code);
//   showToast("Code copied!", "success");
// });
