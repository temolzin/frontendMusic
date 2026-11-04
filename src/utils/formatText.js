export function formatGenreName(value) {
  if (!value) return "";
  const cleaned = String(value)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}
