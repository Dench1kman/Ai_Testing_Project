import "./modules/constants.js";

import { loadSavedURL } from "./modules/loadSavedURL.js";
import { enableCopy } from "./modules/copy.js";
import { enableDownload } from "./modules/download.js";
import { enableExcelExport } from "./modules/exportExcel.js";
import { enablePaste } from "./modules/pasteLink.js";
import { applyURLFromQuery } from "./modules/urlParams.js";
import { enableValidation } from "./modules/validation.js";
import { enableBackNavigation } from "./modules/backNavigation.js";
import { enableHomeButton } from "./modules/homeButton.js";
import { setupIndexPage } from "./modules/indexPage.js";
import { enableGenerateButton } from "./modules/generateButton.js";
import { enableToggleCases } from "./modules/toggleCases.js";

document.addEventListener("DOMContentLoaded", () => {
  loadSavedURL();
  enableCopy();
  enableDownload();
  enableExcelExport();
  enablePaste();
  applyURLFromQuery();
  enableValidation();
  enableBackNavigation();
  enableHomeButton();
  setupIndexPage();
  enableGenerateButton();
  enableToggleCases();
});
