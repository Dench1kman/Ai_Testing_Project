import { input } from "./constants.js";

export function loadSavedURL() {
  const params = new URLSearchParams(window.location.search);
  if (!params.get("userURL")) {
    localStorage.removeItem("userURL");
  }

  if (window.location.pathname.includes("index.html")) return;

  const savedURL = localStorage.getItem("userURL");
  if (savedURL && input) {
    input.value = savedURL;
  }
}
// export function loadSavedURL() {
//   const input = getInput();
//   if (!input) return;

//   const params = new URLSearchParams(window.location.search);
//   if (!params.get("userURL")) {
//     localStorage.removeItem("userURL");
//   }

//   if (window.location.pathname.includes("index.html")) return;

//   const savedURL = localStorage.getItem("userURL");
//   if (savedURL) {
//     input.value = savedURL;
//   }
// }
