import type { APIRoute } from "astro";
import { buildDataIndex } from "../utils/data";
import {
  categoryUrl,
  childSubcategoryUrl,
  productUrl,
  subcategoryUrl,
  subcategoryToplistUrl
} from "../utils/routes";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response("Missing site URL", { status: 500 });
  }

  const defaultLastmod = new Date().toISOString().split("T")[0];
  const { categories, toplists, products } = buildDataIndex();
  const urls = new Map<string, { priority?: number; lastmod: string }>();
  const bestByChild = new Map<string, (typeof toplists)[number]>();

  for (const list of toplists) {
    if (!list.childsubcategory) continue;
    const key = `${list.category}/${list.subcategory}/${list.childsubcategory}`;
    const existing = bestByChild.get(key);
    if (!existing) {
      bestByChild.set(key, list);
      continue;
    }
    if (
      list.performanceScore > existing.performanceScore ||
      (list.performanceScore === existing.performanceScore && list.count > existing.count)
    ) {
      bestByChild.set(key, list);
    }
  }

  const toDateString = (value: string | undefined, fallback: string) => {
    if (!value) return fallback;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return fallback;
    return parsed.toISOString().split("T")[0];
  };

  const setUrl = (loc: string, priority?: number, lastmod = defaultLastmod) => {
    urls.set(loc, { priority, lastmod });
  };

  setUrl(new URL("/", site).toString(), 1.0);

  const staticPages = Object.keys(import.meta.glob("../pages/**/*.astro")).filter(
    (path) => !path.includes("[") && !path.endsWith("404.astro")
  );

  for (const page of staticPages) {
    const route = page
      .replace("../pages", "")
      .replace(/\.astro$/, "")
      .replace(/\/index$/, "/");
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
    const bestKey = list.childsubcategory
      ? `${list.category}/${list.subcategory}/${list.childsubcategory}`
      : null;
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

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    [...urls.entries()]
      .map(([loc, meta]) =>
        `  <url><loc>${loc}</loc><lastmod>${meta.lastmod}</lastmod>${
          meta.priority ? `<priority>${meta.priority.toFixed(1)}</priority>` : ""
        }</url>`
      )
      .join("\n") +
    `\n</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
