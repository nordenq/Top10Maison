import { t as toplistUrl, p as productUrl } from './routes_BEIx0N0R.mjs';

function buildBreadcrumbSchema(site, items) {
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
function buildProductSchema(site, product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: new URL(product.image, site).toString(),
    ...product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {},
    ...typeof product.rating === "number" ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.ratingCount ?? 1
      }
    } : {},
    offers: {
      "@type": "Offer",
      url: new URL(productUrl(product.slug), site).toString(),
      priceCurrency: "USD",
      price: product.price.replace(/[^0-9.]/g, ""),
      availability: "https://schema.org/InStock"
    }
  };
}
function buildReviewSchema(site, product) {
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
    ...typeof product.rating === "number" ? {
      reviewRating: {
        "@type": "Rating",
        ratingValue: product.rating,
        bestRating: 5,
        worstRating: 1
      }
    } : {},
    reviewBody: product.reviewSnippet ?? product.description
  };
}
function buildArticleSchema(site, toplist, canonicalUrl) {
  const pageUrl = canonicalUrl ?? new URL(
    toplistUrl(
      toplist.category,
      toplist.subcategory,
      toplist.childsubcategory,
      toplist.count,
      toplist.keywordSlug
    ),
    site
  ).toString();
  const schema = {
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
function buildFaqSchema(items) {
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
function buildItemListSchema(items) {
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

export { buildItemListSchema as a, buildBreadcrumbSchema as b, buildFaqSchema as c, buildArticleSchema as d, buildProductSchema as e, buildReviewSchema as f };
