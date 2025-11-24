export function showToast(message, type = "error") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const existingToasts = container.querySelectorAll(".toast");
  if (existingToasts.length >= 3) existingToasts[0].remove();

  const icons = {
    success: "../css/img/Link2_Ic.svg",
    "success-download": "../css/img/Success_Ic.svg",
    error: "../css/img/Warning_Ic.svg",
  };

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <div class="toast-bar"></div>
    <img src="${icons[type] || icons.error}" class="toast-icon"/>
    <span class="toast-text">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => (toast.style.opacity = "1"), 10);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}
