import type { Toplist } from "./data";

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((word) => {
      const lower = word.toLowerCase();
      if (["and", "or", "the", "a", "an", "for", "to", "of", "in", "on", "with"].includes(lower)) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ")
    .replace(/\bOf\b/g, "of");
}

export function inferToplistYear(toplist: Toplist): number | null {
  const fromDate = toplist.schemaDatePublished ? new Date(toplist.schemaDatePublished).getFullYear() : NaN;
  if (Number.isFinite(fromDate) && fromDate > 2000) {
    return fromDate;
  }

  const match =
    toplist.title.match(/\b(20\d{2})\b/) ??
    toplist.h1.match(/\b(20\d{2})\b/) ??
    toplist.metaTitle.match(/\b(20\d{2})\b/) ??
    toplist.keywordSlug.match(/\b(20\d{2})\b/);
  if (!match) return null;
  const year = Number(match[1]);
  return Number.isFinite(year) ? year : null;
}

export function inferToplistUseCase(toplist: Toplist): string | null {
  const dashSplit = toplist.h1.split("—");
  if (dashSplit.length > 1) {
    const after = dashSplit.slice(1).join("—").trim();
    const cleaned = after.replace(/^curated picks for\s+/i, "").replace(/\.$/, "").trim();
    return cleaned ? titleCase(cleaned) : null;
  }
  return null;
}

export function buildToplistFraming(args: {
  productName: string;
  year: number;
  count: number;
  useCase: string;
}) {
  const productName = args.productName.trim();
  const useCase = args.useCase.trim();
  const year = args.year;
  const count = args.count;

  const title = `Best ${productName} of ${year} (Top ${count} Picks)`;
  const h1 = `Best ${productName} of ${year} — Top ${count} Picks for ${useCase}`;
  const schemaHeadline = `Best ${productName} of ${year}`;
  const intro = `We compared the most popular ${productName.toLowerCase()} of ${year} using reviews, features, and pricing to identify the best options for ${useCase.toLowerCase()}. These ${count} picks stand out for value, ease of use, and practical performance.`;

  return { title, h1, schemaHeadline, intro };
}
