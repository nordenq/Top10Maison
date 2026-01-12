import { buildCanonical, buildTitle, requireSite } from "./seo";

export function getPageMeta(
  site: URL | undefined,
  {
    title,
    description,
    path,
    brand = "Top10Maison"
  }: {
    title: string;
    description: string;
    path: string;
    brand?: string;
  }
) {
  const resolvedSite = requireSite(site);
  return {
    site: resolvedSite,
    title: buildTitle(title, brand),
    description,
    canonical: buildCanonical(resolvedSite, path)
  };
}
