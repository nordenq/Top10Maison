import type { APIRoute } from "astro";
import { buildDataIndex } from "../utils/data";
import {
  categoryUrl,
  childSubcategoryUrl,
  productUrl,
  subcategoryUrl,
  toplistUrl
} from "../utils/routes";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response("Missing site URL", { status: 500 });
  }

  const { categories, toplists, products } = buildDataIndex();
  const urls = new Set<string>();

  urls.add(new URL("/", site).toString());

  for (const category of categories) {
    urls.add(new URL(categoryUrl(category.slug), site).toString());
    for (const subcategory of category.subcategories) {
      urls.add(new URL(subcategoryUrl(category.slug, subcategory.slug), site).toString());
      for (const childsubcategory of subcategory.subcategories) {
        urls.add(
          new URL(
            childSubcategoryUrl(category.slug, subcategory.slug, childsubcategory.slug),
            site
          ).toString()
        );
      }
    }
  }

  for (const list of toplists) {
    urls.add(
      new URL(
        toplistUrl(list.category, list.subcategory, list.childsubcategory, list.count, list.keywordSlug),
        site
      ).toString()
    );
  }

  for (const product of products) {
    urls.add(new URL(productUrl(product.slug), site).toString());
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    [...urls].map((loc) => `  <url><loc>${loc}</loc></url>`).join("\n") +
    `\n</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
