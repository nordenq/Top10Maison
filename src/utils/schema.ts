import type { Product, Toplist } from "./data";
import { categoryUrl, childSubcategoryUrl, productUrl, subcategoryUrl, toplistUrl } from "./routes";

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

export function buildReviewSchema(site: URL, product: Product): SchemaGraph {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: product.name,
      url: new URL(productUrl(product.slug), site).toString()
    },
    author: {
      "@type": "Organization",
      name: "Top10Maison"
    },
    reviewBody: product.description
  };
}

export function buildArticleSchema(site: URL, toplist: Toplist, canonicalUrl?: string): SchemaGraph {
  const pageUrl =
    canonicalUrl ??
    new URL(
      toplistUrl(
        toplist.category,
        toplist.subcategory,
        toplist.childsubcategory,
        toplist.count,
        toplist.keywordSlug
      ),
      site
    ).toString();

  const schema: SchemaGraph = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: toplist.schemaHeadline ?? toplist.title,
    description: toplist.metaDescription,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl
    },
    author: {
      "@type": "Organization",
      name: "Top10Maison"
    },
    publisher: {
      "@type": "Organization",
      name: "Top10Maison",
      logo: {
        "@type": "ImageObject",
        url: "https://www.top10maison.com/logo.png"
      }
    }
  };

  if (toplist.schemaDatePublished) {
    schema.datePublished = toplist.schemaDatePublished;
  }

  if (toplist.schemaImage) {
    schema.image = toplist.schemaImage;
  }

  return schema;
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

export function buildItemListSchema(items: Array<{ name: string; url: string }>): SchemaGraph {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url
    }))
  };
}

export function buildToplistBreadcrumb(
  site: URL,
  categoryName: string,
  subcategoryName: string,
  childSubcategoryName: string,
  toplist: Toplist
): SchemaGraph {
  return buildBreadcrumbSchema(site, [
    { name: "Home", path: "/" },
    { name: categoryName, path: categoryUrl(toplist.category) },
    { name: subcategoryName, path: subcategoryUrl(toplist.category, toplist.subcategory) },
    {
      name: childSubcategoryName,
      path: childSubcategoryUrl(toplist.category, toplist.subcategory, toplist.childsubcategory)
    },
    {
      name: toplist.title,
      path: toplistUrl(
        toplist.category,
        toplist.subcategory,
        toplist.childsubcategory,
        toplist.count,
        toplist.keywordSlug
      )
    }
  ]);
}
