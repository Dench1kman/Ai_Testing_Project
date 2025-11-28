// js/modules/renderTestCases.js
export function getSavedAIResult() {
  // Сначала пробуем localStorage
  const txt = localStorage.getItem("ai_result");
  const type = localStorage.getItem("ai_result_type") || "casesOnly";
  return { text: txt || "", type };
}

function splitToCases(aiText) {
  if (!aiText || !aiText.trim()) return [];

  // 1) Попробуем стандартный разделитель '---'
  if (/\n-{3,}\n/.test(aiText)) {
    return aiText
      .split(/\n-{3,}\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // 2) Попробуем заголовки '### Test Case' (OpenAI часто использует)
  if (/###\s*Test Case/i.test(aiText)) {
    return aiText
      .split(/###\s*Test Case/i)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // 3) Попробуем по "Test Case ID" (или "TC-")
  if (/Test Case ID/i.test(aiText) || /TC-?\d+/i.test(aiText)) {
    // разделяем по вхождению "Test Case ID" или по строкам начинающимся с TC
    const parts = aiText
      .split(/(?:Test Case ID:|TC-?\d+)/i)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length > 0) return parts;
  }

  // fallback: большие блоки по двойному переводу строки
  return aiText
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function makeTCMarkup(block, idx) {
  // Попробуем вытащить заголовок (Title) и ID
  const idMatch =
    block.match(/TC[-\s]?0*?(\d+)/i) ||
    block.match(/Test Case ID[:\s]*([A-Za-z0-9-]+)/i);
  const titleMatch =
    block.match(/Title[:\s-]*([^\n]+)/i) ||
    block.match(/\*\*Title\*\*[:\s-]*([^\n]+)/i);

  const id = idMatch ? idMatch[0].trim() : `TC ${idx + 1}`;
  const title = titleMatch
    ? titleMatch[1].trim()
    : block.split("\n")[0].slice(0, 80);

  // Попытка извлечь Steps и Expected Result
  const stepsMatch = block.match(
    /Steps[:\s]*([\s\S]*?)(?:Expected Result|Expected|Test Data|$)/i
  );
  const expectedMatch = block.match(/Expected Result[:\s]*([\s\S]*?)$/i);

  const stepsRaw = stepsMatch ? stepsMatch[1].trim() : "";
  const expectedRaw = expectedMatch ? expectedMatch[1].trim() : "";

  // Строим список шагов (если есть номера — сохраняем, иначе отделяем по строкам)
  let stepsHtml = "";
  if (stepsRaw) {
    const lines = stepsRaw
      .split(/\n/)
      .map((l) => l.replace(/^\s*[-\d\.\)\s]*/, "").trim())
      .filter(Boolean);
    stepsHtml = `<ul>${lines
      .map((l) => `<li>${escapeHtml(l)}</li>`)
      .join("")}</ul>`;
  } else {
    stepsHtml = "<p>-</p>";
  }

  const expectedHtml = expectedRaw
    ? `<p>${escapeHtml(expectedRaw)}</p>`
    : "<p>-</p>";

  // определяем тип (positive/negative) по ключевым словам
  const isNegative =
    /error|invalid|fail|empty|incorrect|not\s+found|warning/i.test(block);

  const icon = isNegative
    ? "../css/img/NegativeTC_Ic.svg"
    : "../css/img/PositiveTC_Ic.svg";

  return `
    <div class="tc-item">
      <div class="tc-header">
        <div class="tc-name">
          <img src="${icon}" />
          <strong>${escapeHtml(id)}</strong>
          <span class="tc-title"> - ${escapeHtml(title)}</span>
        </div>
        <img class="tc-arrow" src="../css/img/DropdownArrow_Ic.svg" />
      </div>
      <div class="tc-content">
        <p><strong>Steps:</strong></p>
        ${stepsHtml}
        <p><strong>Expected Result:</strong></p>
        ${expectedHtml}
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderAIResultsOnPage() {
  const { text: aiText, type } = getSavedAIResult();
  if (!aiText) return;

  // Очищаем localStorage, чтобы не рендерить снова при перезагрузке
  localStorage.removeItem("ai_result");
  localStorage.removeItem("ai_result_type");

  const tcList = document.querySelector(".tc-list");
  const codeArea = document.querySelector(".code-area");

  // Парсим кейсы
  const rawCases = splitToCases(aiText);
  // Если нет tc-list или нет ни одного кейса — вставляем весь текст в код/area
  if (!tcList) {
    if (codeArea) {
      codeArea.textContent = aiText;
      if (window.Prism) window.Prism.highlightAll();
    }
    return;
  }

  // Очищаем шаблонные примеры
  tcList.innerHTML = "";

  // Создаём блокы по каждому кейсу
  rawCases.forEach((block, i) => {
    const html = makeTCMarkup(block, i);
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    tcList.appendChild(wrapper.firstElementChild);
  });

  // Если есть code-area (tc-code.html) — вставляем туда AI-результат целиком
  if (codeArea) {
    codeArea.textContent = aiText;
    if (window.Prism) window.Prism.highlightAll();
  }

  // Активируем поведение разворота/свёртывания (как у тебя раньше)
  document.querySelectorAll(".tc-item").forEach((item) => {
    const arrow = item.querySelector(".tc-arrow");
    const content = item.querySelector(".tc-content");
    if (!arrow || !content) return;
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
}
