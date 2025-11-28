document.addEventListener("DOMContentLoaded", () => {
  const aiResult = localStorage.getItem("ai_result");
  const type = localStorage.getItem("ai_result_type");

  if (!aiResult) return;

  const tcList = document.querySelector(".tc-list");
  if (!tcList) return;

  const cases = aiResult.split(/(?:\n|\r)+(?=### Test Case)/);

  tcList.innerHTML = "";

  cases.forEach((c, index) => {
    const lines = c.trim().split("\n");
    if (lines.length === 0) return;

    const titleLine =
      lines.find((l) => l.includes("Title")) || `TC ${index + 1}`;
    const title = titleLine.replace(/- \*\*Title\*\*: /, "");

    const stepsStart = lines.findIndex((l) => l.includes("Steps")) + 1;
    const expectedStart = lines.findIndex((l) => l.includes("Expected Result"));

    const steps = lines
      .slice(stepsStart, expectedStart)
      .map((l) => `<li>${l.replace(/^\d+\.\s*/, "")}</li>`)
      .join("");
    const expected = lines.slice(expectedStart + 1).join(" ");

    const tcItem = document.createElement("div");
    tcItem.classList.add("tc-item");
    tcItem.innerHTML = `
      <div class="tc-header">
        <div class="tc-name">
          <img src="../css/img/PositiveTC_Ic.svg" />
          <strong>TC ${index + 1}</strong>
          <span>- ${title}</span>
        </div>
        <img class="tc-arrow" src="../css/img/DropdownArrow_Ic.svg" />
      </div>
      <div class="tc-content">
        <p><strong>Steps:</strong></p>
        <ul>${steps}</ul>
        <p><strong>Expected Result:</strong></p>
        <p>${expected}</p>
      </div>
    `;

    tcList.appendChild(tcItem);
  });

  localStorage.removeItem("ai_result");
  localStorage.removeItem("ai_result_type");
});
