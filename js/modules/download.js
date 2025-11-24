import { showToast } from "./toast.js";

export function enableDownload() {
  document.body.addEventListener("click", (e) => {
    if (!e.target.closest(".code-download")) return;

    const code = document.querySelector(".code-area")?.innerText;
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "autotest.js";
    a.click();

    showToast("Downloading autotest.js...", "success-download");
  });
}
