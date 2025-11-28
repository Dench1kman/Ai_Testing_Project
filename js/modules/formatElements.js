export function formatElements(structuredText) {
  return structuredText
    .split("\n")
    .map((line) => "- " + line)
    .join("\n");
}
