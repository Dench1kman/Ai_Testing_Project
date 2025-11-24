import { input } from "./constants.js";

export function loadSavedURL() {
  const savedURL = localStorage.getItem("userURL");
  if (savedURL && input) {
    input.value = savedURL;
  }
}
