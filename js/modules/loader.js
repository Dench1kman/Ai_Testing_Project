// console.log("Loader JS loaded", params.get("userURL"), params.get("next"));

// import { PROMPT_TESTCASES } from "../prompts/promptTestCases.js";
// import { PROMPT_TESTCASES_WITH_CODE } from "../prompts/promptTestCasesWithCode.js";
// import { formatElements } from "./formatElements.js";
// //import { downloadTxt } from "./downloadTxt.js";

// async function runGeneration() {
//   const params = new URLSearchParams(window.location.search);
//   const nextPage = params.get("next");
//   const userURL = params.get("userURL");
//   const type = nextPage.includes("tc-code") ? "withCode" : "casesOnly";

//   if (!userURL) {
//     window.location.href = "../index.html";
//     return;
//   }

//   try {
//     // 1. Сканируем страницу
//     const scanResponse = await fetch("http://localhost:3000/scan", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ url: userURL }),
//     });

//     const scanData = await scanResponse.json();
//     console.log("Scan data:", scanData);
//     const structuredText = scanData.structuredText || "";

//     //downloadTxt("scanned_page_structure.txt", scanData.structuredText);

//     // 2. Формируем промпт
//     const elementsFormatted = formatElements(structuredText);
//     const prompt =
//       type === "withCode"
//         ? PROMPT_TESTCASES_WITH_CODE.replace("{{ELEMENTS}}", elementsFormatted)
//         : PROMPT_TESTCASES.replace("{{ELEMENTS}}", elementsFormatted);

//     // 3. Отправляем в AI
//     console.log("Sending prompt to AI...");
//     const aiResponse = await fetch("http://localhost:3000/generate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ prompt }),
//     });

//     console.log("Fetch status:", aiResponse.status, aiResponse.statusText);

//     if (!aiResponse.ok) {
//       const text = await aiResponse.text();
//       console.error("AI generate failed:", aiResponse.status, text);
//       window.location.href = nextPage || "../index.html";
//       return;
//     }

//     const aiData = await aiResponse.json();
//     const aiResult = aiData.aiResult || aiData.result || aiData.text || "";
//     console.log("AI Result (received):", aiResult?.slice?.(0, 300));

//     localStorage.setItem("ai_result", aiResult);
//     localStorage.setItem("ai_result_type", type);

//     // 4) Перенаправляем на целевую страницу
//     window.location.href = nextPage;
//   } catch (err) {
//     console.error("Generation error:", err);
//     window.location.href = "../index.html";
//   }
// }

// runGeneration();
import { PROMPT_TESTCASES } from "../prompts/promptTestCases.js";
import { PROMPT_TESTCASES_WITH_CODE } from "../prompts/promptTestCasesWithCode.js";
import { formatElements } from "./formatElements.js";

async function runGeneration() {
  const params = new URLSearchParams(window.location.search);
  const nextPage = params.get("next");
  const userURL = params.get("userURL");
  const type = nextPage?.includes("tc-code") ? "withCode" : "casesOnly";

  // if (!userURL) {
  //   window.location.href = "../index.html";
  //   return;
  // }

  // if (userURL) {
  //   localStorage.setItem("userURL", userURL); // сохраняем сразу
  // } else {
  //   window.location.href = "../index.html"; // если нет URL, возвращаемся
  //   return;
  // }
  if (!userURL) {
    window.location.href = "../index.html";
  } else {
    localStorage.setItem("userURL", userURL);
  }

  try {
    console.log("Scanning page...");
    const scanResp = await fetch("/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: userURL }),
    });

    const scanData = await scanResp.json();
    const structuredText = scanData.structuredText || "";
    console.log("Scan data:", structuredText.slice(0, 200));

    const elementsFormatted = formatElements(structuredText);
    const prompt =
      type === "withCode"
        ? PROMPT_TESTCASES_WITH_CODE.replace("{{ELEMENTS}}", elementsFormatted)
        : PROMPT_TESTCASES.replace("{{ELEMENTS}}", elementsFormatted);

    console.log("Sending prompt to AI...");
    const aiResp = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!aiResp.ok) {
      const txt = await aiResp.text();
      console.error("AI generation failed:", aiResp.status, txt);
      window.location.href = nextPage || "../index.html";
      return;
    }

    const aiData = await aiResp.json();
    const aiResult = aiData.aiResult || "";
    console.log("AI Result received:", aiResult.slice(0, 300));

    localStorage.setItem("ai_result", aiResult);
    localStorage.setItem("ai_result_type", type);

    // Перенаправление на целевую страницу
    window.location.href = nextPage;
  } catch (err) {
    console.error("Generation error:", err);
    window.location.href = "../index.html";
  }
}

runGeneration();
