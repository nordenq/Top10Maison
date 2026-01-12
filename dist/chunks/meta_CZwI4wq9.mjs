import { r as requireSite, b as buildCanonical, a as buildTitle } from './seo_jMrGLJxf.mjs';

function getPageMeta(site, {
  title,
  description,
  path,
  brand = "Top10Maison"
}) {
  const resolvedSite = requireSite(site);
  return {
    site: resolvedSite,
    title: buildTitle(title, brand),
    description,
    canonical: buildCanonical(resolvedSite, path)
  };
}

export { getPageMeta as g };
