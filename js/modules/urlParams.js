import { input } from "./constants.js";

export function applyURLFromQuery() {
  if (!input) return;

  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "index.html" || currentPage === "") return;

  const params = new URLSearchParams(window.location.search);
  const link = params.get("url");

  if (link) {
    input.value = link;
  }
}

// export function applyURLFromQuery() {
//   const input = document.getElementById("url-input"); // теперь ищем элемент здесь
//   if (!input) return;

//   const currentPage = window.location.pathname.split("/").pop();
//   if (currentPage === "index.html" || currentPage === "") return;

//   const params = new URLSearchParams(window.location.search);
//   const link = params.get("userURL") || params.get("url");

//   if (link) {
//     input.value = link;
//     localStorage.setItem("userURL", link);
//   } else {
//     const storedURL = localStorage.getItem("userURL");
//     if (storedURL) input.value = storedURL;
//   }
// }

// export function applyURLFromQuery() {
//   const currentPage = window.location.pathname.split("/").pop();
//   if (currentPage === "index.html" || currentPage === "") return;

//   const params = new URLSearchParams(window.location.search);
//   const link = params.get("userURL") || params.get("url");
//   const storedURL = localStorage.getItem("userURL");

//   // ждем, пока элемент появится
//   const trySetInput = () => {
//     const input = document.getElementById("url-input");
//     if (!input) {
//       requestAnimationFrame(trySetInput); // повторяем на следующем кадре
//       return;
//     }

//     if (link) {
//       input.value = link;
//       localStorage.setItem("userURL", link);
//     } else if (storedURL) {
//       input.value = storedURL;
//     }
//   };

//   trySetInput();
// }

// export function applyURLFromLocalStorage() {
//   const currentPage = window.location.pathname.split("/").pop();
//   if (currentPage === "index.html" || currentPage === "") return;

//   const input = document.getElementById("url-input");
//   if (!input) return;

//   const storedURL = localStorage.getItem("userURL");
//   if (storedURL) {
//     input.value = storedURL;
//   }
// }
// import { getInput } from "./constants.js";

// export function applyURLFromQuery() {
//   const input = getInput();
//   if (!input) return;

//   const params = new URLSearchParams(window.location.search);
//   const link = params.get("userURL") || params.get("url");

//   if (link) {
//     input.value = link;
//     localStorage.setItem("userURL", link);
//   } else {
//     const storedURL = localStorage.getItem("userURL");
//     if (storedURL) input.value = storedURL;
//   }
// }

// import { getInput } from "./constants.js";

// export function applyURLFromQuery() {
//   const input = getInput();
//   if (!input) return;

//   const params = new URLSearchParams(window.location.search);
//   const link = params.get("userURL") || params.get("url");

//   if (link) {
//     input.value = link;
//     localStorage.setItem("userURL", link);
//   } else {
//     const storedURL = localStorage.getItem("userURL");
//     if (storedURL) input.value = storedURL;
//   }
// }
