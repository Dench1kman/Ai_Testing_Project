import { showToast } from "./toast.js";

export function enableExcelExport() {
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

          let rawTitle = (
            item.querySelector(".tc-title")?.innerText ||
            item.querySelector(".tc-name")?.innerText ||
            ""
          ).trim();
          rawTitle =
            rawTitle.replace(/^\s*TC[\s-]*\d+\s*[-–—]\s*/i, "").trim() || "-";

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
            expected = `The system behaves as expected for: ${rawTitle}`;
          }

          let pre = "-";
          if (/login|sign in|log in/i.test(rawTitle))
            pre = "User is on the login page.";
          else if (/signup|register|create account/i.test(rawTitle))
            pre = "User is on the registration page.";
          else pre = "Application is opened and user is on the relevant page.";

          let testData = "-";
          const combined = (rawTitle + " " + (steps || "")).toLowerCase();
          if (/email/.test(combined)) testData = "user@example.com";
          else if (/password/.test(combined)) testData = "Password123";
          else if (/phone|tel/i.test(combined)) testData = "+380501234567";
          else testData = "-";

          rows.push([id, rawTitle, pre, steps, testData, expected, "", ""]);
        });
        rows.forEach((r) => ws.addRow(r));

        ws.eachRow({ includeEmpty: false }, function (row, rowNumber) {
          if (rowNumber === 1) return;
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
          ws.getColumn(1).width = Math.max(ws.getColumn(1).width, 18);
          ws.getColumn(6).width = Math.max(ws.getColumn(6).width, 22);
          ws.getColumn(7).width = Math.max(ws.getColumn(7).width, 18);
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
}
