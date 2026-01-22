export type SeoMeta = {
  title: string;
  description: string;
  canonical: string;
};

export function requireSite(site: URL | undefined): URL {
  if (!site) {
    throw new Error("Astro site is required for canonical URLs. Set `site` in astro.config.mjs.");
  }
  return site;
}

export function buildCanonical(site: URL, pathname: string): string {
  return new URL(pathname, site).toString();
}

export function buildTitle(pageTitle: string, brand: string): string {
  if (pageTitle.includes(brand)) {
    return pageTitle;
  }
  return `${pageTitle} | ${brand}`;
}

export function titleHasYear(title: string | undefined, year: string | number): boolean {
  if (!title) return false;
  const y = String(year);
  return new RegExp(`\\b${y}\\b`).test(title);
}

export function buildPageTitle(options: {
  bestToplistTitle?: string;
  baseTitle: string;
  year: string | number;
  brand?: string;
  qualifier?: string;
  useQualifier?: boolean;
  maxLength?: number;
}): string {
  const {
    bestToplistTitle,
    baseTitle,
    year,
    brand = "Top10Maison",
    qualifier = "Sizes & Cleanup Tips",
    useQualifier = false,
    maxLength = 60
  } = options;

  const basePageTitle = bestToplistTitle
    ? titleHasYear(bestToplistTitle, year)
      ? bestToplistTitle
      : `${bestToplistTitle} (${year})`
    : `${baseTitle} Rankings ${year} | ${brand}`;

  if (!useQualifier) {
    return basePageTitle;
  }

  const trimmedQualifier = qualifier.trim();
  const separator = " - ";
  const candidate = trimmedQualifier ? `${basePageTitle}${separator}${trimmedQualifier}` : basePageTitle;

  if (!trimmedQualifier || candidate.length > maxLength) {
    return basePageTitle;
  }

  return candidate;
}
