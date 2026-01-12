import type { APIRoute } from "astro";
import { getDataIndex } from "../utils/dataIndex";
import {
  categoryUrl,
  childSubcategoryUrl,
  productUrl,
  subcategoryUrl
} from "../utils/routes";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response("Missing site URL", { status: 500 });
  }

  const defaultLastmod = new Date().toISOString().split("T")[0];
  const { categories, products } = getDataIndex();
  const urls = new Map<string, { priority?: number; lastmod: string }>();

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
