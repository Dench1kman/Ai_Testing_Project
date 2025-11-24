export function showCustomPopup(message, onConfirm, onCancel) {
  if (document.getElementById("back-popup")) return;

  const popup = document.createElement("div");
  popup.id = "back-popup";
  popup.innerHTML = `
    <div class="popup-overlay"></div>
    <div class="popup-box">
      <p>${message}</p>
      <div class="popup-buttons">
        <button id="popup-yes">Yes</button>
        <button id="popup-no">No</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById("popup-yes").onclick = () => {
    popup.remove();
    onConfirm?.();
  };

  document.getElementById("popup-no").onclick = () => {
    popup.remove();
    onCancel?.();
  };
}
