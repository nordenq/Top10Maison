import type { Product, Toplist } from "./data";
import { categoryUrl, productUrl, subcategoryUrl, toplistUrl } from "./routes";

export type SchemaGraph = Record<string, unknown>;

export function buildBreadcrumbSchema(
  site: URL,
  items: Array<{ name: string; path: string }>
): SchemaGraph {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, site).toString()
    }))
  };
}

export function buildProductSchema(site: URL, product: Product): SchemaGraph {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: new URL(product.image, site).toString(),
    offers: {
      "@type": "Offer",
      url: new URL(productUrl(product.slug), site).toString(),
      priceCurrency: "USD",
      price: product.price.replace(/[^0-9.]/g, ""),
      availability: "https://schema.org/InStock"
    }
  };
}

export function buildArticleSchema(site: URL, toplist: Toplist): SchemaGraph {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: toplist.title,
    description: toplist.metaDescription,
    mainEntityOfPage: new URL(
      toplistUrl(toplist.category, toplist.subcategory, toplist.count, toplist.keywordSlug),
      site
    ).toString(),
    author: {
      "@type": "Organization",
      name: "Top10Maison"
    }
  };
}

export function buildFaqSchema(items: Array<{ question: string; answer: string }>): SchemaGraph {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function buildToplistBreadcrumb(
  site: URL,
  categoryName: string,
  subcategoryName: string,
  toplist: Toplist
): SchemaGraph {
  return buildBreadcrumbSchema(site, [
    { name: "Home", path: "/" },
    { name: categoryName, path: categoryUrl(toplist.category) },
    { name: subcategoryName, path: subcategoryUrl(toplist.category, toplist.subcategory) },
    {
      name: toplist.title,
      path: toplistUrl(toplist.category, toplist.subcategory, toplist.count, toplist.keywordSlug)
    }
  ]);
}
