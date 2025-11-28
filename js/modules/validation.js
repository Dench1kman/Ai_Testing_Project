// import { input } from "./constants.js";
// import { showToast } from "./toast.js";

// export function enableValidation() {
//   if (!input) return;

//   const testCasesBtn = document.querySelector(
//     '.buttons a[href*="testcases.html"]'
//   );
//   const tcCodeBtn = document.querySelector('.buttons a[href*="tc-code.html"]');

//   const urlPattern =
//     /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;

//   const testCasesLink = document.querySelector(
//     '.buttons a[href*="testcases.html"]'
//   );
//   const tcCodeLink = document.querySelector('.buttons a[href*="tc-code.html"]');

//   async function handleClick(e, href) {
//     e.preventDefault();
//     const url = input.value.trim();

//     if (!url || !urlPattern.test(url)) {
//       showToast("Please enter a valid URL!", "error");
//       return;
//     }

//     localStorage.setItem("userURL", url);

//     try {
//       // 1. Сканируем страницу
//       const scanResponse = await fetch("http://localhost:3000/scan", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ url }),
//       });
//       const scanData = await scanResponse.json();

//       // TODO: здесь можно вызвать AI и получить результат

//       // 2. После завершения всех действий — переход на loader.html
//       window.location.href = href;
//     } catch (err) {
//       console.error(err);
//       showToast("Failed to fetch HTML", "error");
//     }
//   }

//   if (testCasesLink) {
//     testCasesLink.addEventListener("click", (e) =>
//       handleClick(e, testCasesLink.getAttribute("href"))
//     );
//   }

//   if (tcCodeLink) {
//     tcCodeLink.addEventListener("click", (e) =>
//       handleClick(e, tcCodeLink.getAttribute("href"))
//     );
//   }
// }
import { input } from "./constants.js";
import { showToast } from "./toast.js";

export function enableValidation() {
  if (!input) return;

  const testCasesBtn = document.querySelector(
    '.buttons a[href*="testcases.html"]'
  );
  const tcCodeBtn = document.querySelector('.buttons a[href*="tc-code.html"]');

  const urlPattern =
    /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;

  function handleClick(e, href) {
    e.preventDefault();
    const url = input.value.trim();

    if (!url || !urlPattern.test(url)) {
      showToast("Please enter a valid URL!", "error");
      return;
    }

    localStorage.setItem("userURL", url);

    // Переход на loader.html с параметром userURL
    window.location.href = `${href}&userURL=${encodeURIComponent(url)}`;
  }

  if (testCasesBtn) {
    testCasesBtn.addEventListener("click", (e) =>
      handleClick(e, testCasesBtn.getAttribute("href"))
    );
  }

  if (tcCodeBtn) {
    tcCodeBtn.addEventListener("click", (e) =>
      handleClick(e, tcCodeBtn.getAttribute("href"))
    );
  }
}
