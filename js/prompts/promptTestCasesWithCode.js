export const PROMPT_TESTCASES_WITH_CODE = `
You are a Senior QA Automation Engineer.

Generate detailed manual test cases AND WebdriverIO (v8) test automation code for the following list of web page elements:

{{ELEMENTS}}

## TEST CASE FORMAT (mandatory)
Each test case must have:

- Test Case ID (TC-001, TC-002, ...)
- Title
- Pre-Condition
- Steps
- Test Data
- Expected Result

## AUTOMATION CODE RULES
After the test cases, generate:

1. WebdriverIO Page Object file
2. WebdriverIO Test Spec file using async/await
3. Full selectors for each element
4. Expect assertions
5. No pseudo-code — produce executable JavaScript

## OUTPUT ORDER
1. Test Cases
2. Page Object
3. Test Spec
`;
