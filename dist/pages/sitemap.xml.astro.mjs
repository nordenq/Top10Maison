import { g as getDataIndex, c as categoryUrl, s as subcategoryUrl, a as childSubcategoryUrl, b as subcategoryToplistUrl, p as productUrl } from '../chunks/routes_BEIx0N0R.mjs';
export { renderers } from '../renderers.mjs';

const prerender = true;
const GET = ({ site }) => {
  if (!site) {
    return new Response("Missing site URL", { status: 500 });
  }
  const defaultLastmod = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const { categories, toplists, products } = getDataIndex();
  const urls = /* @__PURE__ */ new Map();
  const bestByChild = /* @__PURE__ */ new Map();
  for (const list of toplists) {
    if (!list.childsubcategory) continue;
    const key = `${list.category}/${list.subcategory}/${list.childsubcategory}`;
    const existing = bestByChild.get(key);
    if (!existing) {
      bestByChild.set(key, list);
      continue;
    }
    if (list.performanceScore > existing.performanceScore || list.performanceScore === existing.performanceScore && list.count > existing.count) {
      bestByChild.set(key, list);
    }
  }
  const toDateString = (value, fallback) => {
    if (!value) return fallback;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return fallback;
    return parsed.toISOString().split("T")[0];
  };
  const setUrl = (loc, priority, lastmod = defaultLastmod) => {
    urls.set(loc, { priority, lastmod });
  };
  setUrl(new URL("/", site).toString(), 1);
  const staticPages = Object.keys(/* #__PURE__ */ Object.assign({"./about.astro": () => import('../chunks/about_Bp2JncdR.mjs').then(n => n._),"./category/[...slugs]/index.astro": () => import('../chunks/index_Bl9UeKxV.mjs').then(n => n._),"./category/[category]/[subcategory]/[childsubcategory]/top-[n]-[keyword].astro": () => import('../chunks/top-_n_-_keyword__DAu6IUlm.mjs').then(n => n._),"./category/[category]/[subcategory]/top-[n]-[slug].astro": () => import('../chunks/top-_n_-_slug__B5m3G1tk.mjs').then(n => n._),"./contact.astro": () => import('../chunks/contact_C-0hcxXw.mjs').then(n => n._),"./index.astro": () => import('../chunks/index_YeQZgvz4.mjs').then(n => n._),"./legal.astro": () => import('../chunks/legal_Cxk7aEKk.mjs').then(n => n._),"./privacy-policy.astro": () => import('../chunks/privacy-policy_CDfYNwH3.mjs').then(n => n._),"./product/[slug].astro": () => import('../chunks/_slug__0oVE67Rb.mjs').then(n => n._),"./terms.astro": () => import('../chunks/terms_CnWS8ijs.mjs').then(n => n._)})).filter(
    (path) => !path.includes("[") && !path.endsWith("404.astro")
  );
  for (const page of staticPages) {
    const route = page.replace("../pages", "").replace(/\.astro$/, "").replace(/\/index$/, "/");
    const normalized = route === "" ? "/" : route;
    if (normalized !== "/") {
      setUrl(new URL(normalized, site).toString(), 0.5);
    }
  }
  for (const category of categories) {
    setUrl(new URL(categoryUrl(category.slug), site).toString(), 0.8);
    for (const subcategory of category.subcategories) {
      setUrl(new URL(subcategoryUrl(category.slug, subcategory.slug), site).toString(), 0.7);
      for (const childsubcategory of subcategory.subcategories) {
        setUrl(
          new URL(
            childSubcategoryUrl(category.slug, subcategory.slug, childsubcategory.slug),
            site
          ).toString(),
          0.6
        );
      }
    }
  }
  for (const list of toplists) {
    const listLastmod = toDateString(list.schemaDatePublished, defaultLastmod);
    const bestKey = list.childsubcategory ? `${list.category}/${list.subcategory}/${list.childsubcategory}` : null;
    if (bestKey) {
      const bestList = bestByChild.get(bestKey);
      if (bestList && bestList.slug === list.slug) {
        continue;
      }
    }
    setUrl(
      new URL(
        subcategoryToplistUrl(list.category, list.subcategory, list.count, list.keywordSlug),
        site
      ).toString(),
      0.6,
      listLastmod
    );
  }
  for (const product of products) {
    setUrl(new URL(productUrl(product.slug), site).toString(), 0.4);
  }
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
` + [...urls.entries()].map(
    ([loc, meta]) => `  <url><loc>${loc}</loc><lastmod>${meta.lastmod}</lastmod>${meta.priority ? `<priority>${meta.priority.toFixed(1)}</priority>` : ""}</url>`
  ).join("\n") + `
</urlset>`;
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
