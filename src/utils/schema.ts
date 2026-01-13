import type { Product, Toplist } from "./data";
import { productUrl, toplistUrl } from "./routes";

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
  const offerUrl = /\.(?:jpe?g|png|webp)(?:\?.*)?$/i.test(product.affiliateUrl)
    ? new URL(productUrl(product.slug), site).toString()
    : product.affiliateUrl;
  const positiveNotes = product.pros?.length
    ? {
        "@type": "ItemList",
        itemListElement: product.pros.map((value, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: value
        }))
      }
    : undefined;
  const negativeNotes = product.cons?.length
    ? {
        "@type": "ItemList",
        itemListElement: product.cons.map((value, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: value
        }))
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: new URL(product.image, site).toString(),
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    offers: {
      "@type": "Offer",
      url: offerUrl
    },
    ...(positiveNotes ? { positiveNotes } : {}),
    ...(negativeNotes ? { negativeNotes } : {}),
    ...(typeof product.rating === "number"
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.ratingCount ?? 1
          }
        }
      : {})
  };
}

export function buildReviewSchema(site: URL, product: Product): SchemaGraph {
  const positiveNotes = product.pros?.length
    ? {
        "@type": "ItemList",
        itemListElement: product.pros.map((value, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: value
        }))
      }
    : undefined;
  const negativeNotes = product.cons?.length
    ? {
        "@type": "ItemList",
        itemListElement: product.cons.map((value, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: value
        }))
      }
    : undefined;

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
    ...(positiveNotes ? { positiveNotes } : {}),
    ...(negativeNotes ? { negativeNotes } : {}),
    ...(typeof product.rating === "number"
      ? {
          reviewRating: {
            "@type": "Rating",
            ratingValue: product.rating,
            bestRating: 5,
            worstRating: 1
          }
        }
      : {}),
    reviewBody: product.reviewSnippet ?? product.description
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

export function buildItemListSchema(
  items: Array<{ name: string; url: string }>,
  options: { ordered?: boolean } = {}
): SchemaGraph {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    ...(options.ordered ? { itemListOrder: "https://schema.org/ItemListOrderAscending" } : {}),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url
    }))
  };
}
