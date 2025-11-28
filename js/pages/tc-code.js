import { PROMPT_TESTCASES_WITH_CODE } from "../prompts/promptTestCasesWithCode.js";
import { formatElements } from "../modules/formatElements.js";
import { sendToAI } from "../api/ai.js";

async function generateTestCasesWithCode(structuredText) {
  const elementsFormatted = formatElements(structuredText);
  return PROMPT_TESTCASES_WITH_CODE.replace("{{ELEMENTS}}", elementsFormatted);
}

export async function runTestCasesWithCodeFlow(structuredText) {
  const prompt = await generateTestCasesWithCode(structuredText);

  showLoader();
  const result = await sendToAI(prompt);
  hideLoader();

  showOutput(result);
}
