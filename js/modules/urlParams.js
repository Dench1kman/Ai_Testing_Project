import { input } from "./constants.js";

export function applyURLFromQuery() {
  if (!input) return;

  const params = new URLSearchParams(window.location.search);
  const link = params.get("next");

  if (link) input.value = link;
}
