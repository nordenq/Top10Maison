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
