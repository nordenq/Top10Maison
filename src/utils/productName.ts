/**
 * Return a concise product name for display by stripping marketing copy.
 * Keeps the brand/model before common separators and trims length.
 */
export function shortProductName(name: string, maxLength = 80): string {
  const raw = (name ?? "").trim();
  if (!raw) return "";

  const separators = ["|", "·", " - ", " – ", "—", ":"];
  let candidate = raw;

  for (const sep of separators) {
    if (raw.includes(sep)) {
      const before = raw.split(sep)[0].trim();
      if (before && before.length < candidate.length) {
        candidate = before;
      }
    }
  }

  const cleaned = candidate.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 3).trim()}...`;
}
