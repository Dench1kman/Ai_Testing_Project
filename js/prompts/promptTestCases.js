export const PROMPT_TESTCASES = `
You are a Senior QA Engineer.

Generate detailed test cases for the following list of web page elements:

{{ELEMENTS}}

STRICT FORMAT FOR EACH TEST CASE:

- Test Case ID (TC-001, TC-002, ...)
- Title
- Pre-Condition
- Steps (numbered)
- Test Data
- Expected Result

REQUIREMENTS:
- Test cases must be realistic and tied directly to provided elements.
- If the elements resemble a login or registration form — infer logical test flows.
- Include both positive and negative scenarios.
- Do not generate automation code.
Output ONLY the list of test cases.
`;
