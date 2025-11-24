import { input, buttonsLinks } from "./constants.js";
import { showToast } from "./toast.js";

export function enableValidation() {
  if (!input || !buttonsLinks.length) return;

  const urlPattern =
    /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;

  buttonsLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const value = input.value.trim();
      if (!value || !urlPattern.test(value)) {
        showToast("Please enter a valid URL!");
        return;
      }

      localStorage.setItem("userURL", value);
      window.location.href = link.getAttribute("href");
    });
  });

  if (window.location.pathname.endsWith("index.html")) {
    localStorage.removeItem("userURL");
  }
}
