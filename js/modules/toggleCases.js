export function enableToggleCases() {
  document.querySelectorAll(".tc-item").forEach((item) => {
    const arrow = item.querySelector(".tc-arrow");
    const content = item.querySelector(".tc-content");

    if (!arrow || !content) return;

    content.style.maxHeight = "0px";
    content.style.overflow = "hidden";

    arrow.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      if (isOpen) {
        item.classList.remove("open");
        content.style.maxHeight = "0px";
      } else {
        item.classList.add("open");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}
