import "./modules/constants.js";

import { enablePaste } from "./modules/pasteLink.js";
import { enableValidation } from "./modules/validation.js";
import { loadSavedURL } from "./modules/loadSavedURL.js";
//import { applyURLFromLocalStorage } from "./modules/urlParams.js";
import { enableCopy } from "./modules/copy.js";
import { enableDownload } from "./modules/download.js";
import { enableExcelExport } from "./modules/exportExcel.js";
import { applyURLFromQuery } from "./modules/urlParams.js";
import { enableBackNavigation } from "./modules/backNavigation.js";
import { enableHomeButton } from "./modules/homeButton.js";
import { setupIndexPage } from "./modules/indexPage.js";
import { enableGenerateButton } from "./modules/generateButton.js";
import { enableToggleCases } from "./modules/toggleCases.js";
import { renderAIResultsOnPage } from "./modules/renderTestCases.js";

document.addEventListener("DOMContentLoaded", () => {
  enablePaste();
  enableValidation();
  loadSavedURL();
  //applyURLFromLocalStorage();
  enableCopy();
  enableDownload();
  enableExcelExport();
  applyURLFromQuery();
  enableBackNavigation();
  enableHomeButton();
  setupIndexPage();
  enableGenerateButton();
  enableToggleCases();
  renderAIResultsOnPage();
});
