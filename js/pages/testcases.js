import { PROMPT_TESTCASES } from "../prompts/promptTestCases.js";
import { formatElements } from "../modules/formatElements.js";
import { sendToAI } from "../api/ai.js";

async function generateTestCases(structuredText) {
  const elementsFormatted = formatElements(structuredText);
  return PROMPT_TESTCASES.replace("{{ELEMENTS}}", elementsFormatted);
}

export async function runTestCasesFlow(structuredText) {
  const prompt = await generateTestCases(structuredText);

  showLoader();
  const result = await sendToAI(prompt);
  hideLoader();

  showOutput(result);
}
