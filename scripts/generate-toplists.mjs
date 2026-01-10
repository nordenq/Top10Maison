import fs from "fs/promises";
import path from "path";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "src", "data");
const PRODUCTS_DIR = path.join(DATA_DIR, "products");
const TOPLISTS_PATH = path.join(DATA_DIR, "toplists.json");
const CATEGORIES_PATH = path.join(DATA_DIR, "categories.json");

const TARGET_CHILD_SUBCATEGORIES = ["air-fryers"];
const SEARCH_RESULTS_LIMIT = 50;
const MAX_PRODUCTS = 10;
const ARTICLE_WORD_TARGET = { min: 1500, max: 1800 };

async function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  try {
    const envFile = await fs.readFile(envPath, "utf8");
    for (const line of envFile.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (!key) continue;
      const value = rest.join("=").trim().replace(/^"|"$/g, "");
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

function assertEnv(name) {
  if (!process.env[name]) {
    throw new Error(`Missing required env var: ${name}`);
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, " "));
}

function scoreProduct(rating, reviewCount) {
  if (!rating || !reviewCount) return 0;
  return rating * Math.log(reviewCount + 1);
}

function extractPriceLimit(text) {
  const match = text.match(/under-(\d+)/i) || text.match(/under \$?(\d+)/i);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

async function fetchScraperApi(url, { autoparse = false } = {}) {
  const apiKey = process.env.SCRAPERAPI_KEY;
  const apiUrl = new URL("https://api.scraperapi.com/");
  apiUrl.searchParams.set("api_key", apiKey);
  apiUrl.searchParams.set("url", url);
  apiUrl.searchParams.set("country_code", "us");
  if (autoparse) {
    apiUrl.searchParams.set("autoparse", "true");
  }
  const response = await fetch(apiUrl.toString());
  if (!response.ok) {
    throw new Error(`ScraperAPI failed (${response.status}) for ${url}`);
  }
  return response.text();
}

function parseJsonLd(html) {
  const matches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const objects = [];
  for (const match of matches) {
    const raw = match[1].trim();
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        objects.push(...parsed);
      } else {
        objects.push(parsed);
      }
    } catch (error) {
      continue;
    }
  }
  return objects;
}

function findProductJsonLd(objects) {
  return objects.find((item) => {
    const type = item?.["@type"];
    if (Array.isArray(type)) {
      return type.includes("Product");
    }
    return type === "Product";
  });
}

function extractFeatureBullets(html) {
  const match = html.match(/<div id="feature-bullets"[\s\S]*?<\/div>/i);
  if (!match) return [];
  const segment = match[0];
  const items = [...segment.matchAll(/<li[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>\s*<\/li>/g)];
  return items
    .map((item) => stripTags(item[1]))
    .filter(Boolean)
    .slice(0, 8);
}

function extractTitle(html) {
  const match = html.match(/id="productTitle"[^>]*>\s*([\s\S]*?)<\/span>/i);
  return match ? stripTags(match[1]) : null;
}

function extractPrice(html) {
  const match = html.match(/id="priceblock_(?:dealprice|ourprice)"[^>]*>\s*([^<]+)<\/span>/i);
  return match ? stripTags(match[1]) : null;
}

function extractRating(html) {
  const match = html.match(/data-hook="rating-out-of-text"[^>]*>\s*([\d.]+) out of 5/i);
  if (match) return Number(match[1]);
  const alt = html.match(/class="a-icon-alt">\s*([\d.]+) out of 5/i);
  return alt ? Number(alt[1]) : null;
}

function extractReviewCount(html) {
  const match = html.match(/id="acrCustomerReviewText"[^>]*>\s*([\d,]+)/i);
  return match ? Number(match[1].replace(/,/g, "")) : null;
}

function extractImage(html) {
  const match = html.match(/"hiRes"\s*:\s*"([^"]+)"/i);
  return match ? match[1] : null;
}

function normalizePrice(value) {
  if (!value) return null;
  const cleaned = value.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  return `$${cleaned}`;
}

async function fetchAmazonSearchAsins(query) {
  const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
  const html = await fetchScraperApi(searchUrl);
  const asins = [...html.matchAll(/data-asin="([A-Z0-9]{10})"/g)]
    .map((match) => match[1])
    .filter((asin) => asin && asin !== "")
    .filter((asin, index, array) => array.indexOf(asin) === index)
    .slice(0, SEARCH_RESULTS_LIMIT);
  if (asins.length === 0) {
    throw new Error(`No ASINs found for query: ${query}`);
  }
  return asins;
}

async function fetchAmazonProduct(asin) {
  const url = `https://www.amazon.com/dp/${asin}`;
  const raw = await fetchScraperApi(url, { autoparse: true });
  try {
    const parsed = JSON.parse(raw);
    const data = {
      asin,
      title: parsed.title || parsed.product_title || null,
      brand: parsed.brand || null,
      price: parsed.price || parsed.current_price || null,
      image: parsed.main_image || (parsed.images ? parsed.images[0] : null),
      rating: parsed.average_rating || null,
      reviewCount: parsed.total_reviews || null,
      bullets: parsed.feature_bullets || [],
      url: parsed.url || url
    };
    if (!data.title || !data.rating || !data.reviewCount) {
      throw new Error("Missing fields from autoparse.");
    }
    return data;
  } catch (error) {
    const html =
      error?.message === "Missing fields from autoparse."
        ? await fetchScraperApi(url, { autoparse: false })
        : raw;
    const jsonLd = findProductJsonLd(parseJsonLd(html));
    const aggregate = jsonLd?.aggregateRating;
    const offers = Array.isArray(jsonLd?.offers) ? jsonLd.offers[0] : jsonLd?.offers;
    return {
      asin,
      title: jsonLd?.name || extractTitle(html),
      brand: jsonLd?.brand?.name || null,
      price: offers?.price || extractPrice(html),
      image: Array.isArray(jsonLd?.image) ? jsonLd.image[0] : jsonLd?.image || extractImage(html),
      rating: aggregate?.ratingValue || extractRating(html),
      reviewCount: aggregate?.reviewCount || extractReviewCount(html),
      bullets: extractFeatureBullets(html),
      url
    };
  }
}

async function callOpenAI(messages, { temperature = 0.3, responseFormat } = {}) {
  const body = {
    model: "gpt-4o-mini",
    temperature,
    messages
  };
  if (responseFormat) {
    body.response_format = responseFormat;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function generateProductCopy(product, categoryName) {
  const prompt = {
    role: "user",
    content: JSON.stringify({
      instructions: {
        style: "Concise, SEO-friendly, neutral, no fluff.",
        requirements: {
          pros: 3,
          cons: 2,
          faq: 2,
          specs: 4
        }
      },
      input: {
        category: categoryName,
        title: product.title,
        brand: product.brand,
        bullets: product.bullets,
        rating: product.rating,
        reviewCount: product.reviewCount
      }
    })
  };

  const content = await callOpenAI(
    [
    {
      role: "system",
      content:
        "Return JSON with keys: description, reviewSnippet, pros, cons, bestFor, uniqueValue, notIdealFor, specs, faq. Use strings for text, arrays for lists, and an object for specs. Keep values short and specific."
    },
    prompt
    ],
    { responseFormat: { type: "json_object" } }
  );

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse OpenAI product JSON for ${product.title}`);
  }
}

function sanitizeAiProduct(ai, productName) {
  const safeText = (value, fallback) => (typeof value === "string" && value.trim() ? value.trim() : fallback);
  const safeArray = (value, fallback) => {
    if (!Array.isArray(value) || value.length === 0) return fallback;
    const filtered = value.filter((item) => typeof item === "string" && item.trim());
    return filtered.length ? filtered : fallback;
  };
  const safeFaq = (value, fallback) =>
    Array.isArray(value) && value.length
      ? value.filter(
          (item) =>
            item &&
            typeof item.question === "string" &&
            item.question.trim() &&
            typeof item.answer === "string" &&
            item.answer.trim()
        )
      : fallback;
  const safeSpecs =
    ai.specs && typeof ai.specs === "object" && Object.keys(ai.specs).length > 0
      ? ai.specs
      : { Highlights: "Specification details vary by model." };

  return {
    description: safeText(ai.description, `${productName} offers solid everyday performance for most kitchens.`),
    reviewSnippet: safeText(ai.reviewSnippet, `A reliable pick with strong real-world reviews.`),
    pros: safeArray(ai.pros, ["Consistent results", "Easy to use", "Good value"]),
    cons: safeArray(ai.cons, ["Limited advanced features", "Takes up counter space"]),
    bestFor: safeText(ai.bestFor, "Shoppers who want dependable performance"),
    uniqueValue: safeText(ai.uniqueValue, "Balanced performance for the price"),
    notIdealFor: safeText(ai.notIdealFor, "Buyers who need premium features"),
    specs: safeSpecs,
    faq: safeFaq(ai.faq, [
      {
        question: `Is the ${productName} easy to clean?`,
        answer: "Most parts are simple to wipe down after daily use."
      },
      {
        question: `Who is the ${productName} best for?`,
        answer: "It suits everyday cooks who want reliable results without a steep learning curve."
      }
    ])
  };
}

async function generateToplistArticle({ title, intro, products, keywords }) {
  const prompt = {
    role: "user",
    content: JSON.stringify({
      instructions: {
        style: "SEO-friendly, expert buying guide tone, helpful and specific.",
        format: "HTML",
        wordTarget: ARTICLE_WORD_TARGET,
        includeSections: [
          "Overview",
          "How we evaluated",
          "Top picks breakdown",
          "How to choose",
          "FAQ"
        ]
      },
      title,
      intro,
      keywords,
      products: products.map((product, index) => ({
        rank: index + 1,
        name: product.name,
        rating: product.rating,
        reviewCount: product.ratingCount,
        pros: product.pros,
        cons: product.cons,
        bestFor: product.bestFor,
        uniqueValue: product.uniqueValue
      }))
    })
  };

  const content = await callOpenAI([
    {
      role: "system",
      content:
        "Write an HTML blog article. Use <h2>, <h3>, <p>, and <ul>. Do not use markdown. Only return valid HTML body content, no code fences."
    },
    prompt
  ]);

  return content.replace(/<\/?body[^>]*>/gi, "").trim();
}

function toProductEntry({ base, ai, slug, affiliateUrl }) {
  const normalizedAi = sanitizeAiProduct(ai, base.title);
  return {
    slug,
    asin: base.asin,
    name: base.title,
    description: normalizedAi.description,
    image: base.image || "/images/og/toplist-default.jpg",
    price: normalizePrice(base.price) || "$0",
    affiliateUrl,
    published: true,
    pros: normalizedAi.pros,
    cons: normalizedAi.cons,
    bestFor: normalizedAi.bestFor,
    uniqueValue: normalizedAi.uniqueValue,
    notIdealFor: normalizedAi.notIdealFor,
    specs: normalizedAi.specs,
    faq: normalizedAi.faq,
    alternatives: [],
    brand: base.brand || undefined,
    rating: base.rating || undefined,
    ratingCount: base.reviewCount || undefined,
    reviewSnippet: normalizedAi.reviewSnippet
  };
}

async function main() {
  await loadEnv();
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const hasScraper = Boolean(process.env.SCRAPERAPI_KEY);

  if (!hasOpenAI || !hasScraper) {
    console.log("Skipping AI/product generation: missing OPENAI_API_KEY or SCRAPERAPI_KEY.");
    return;
  }

  const [categoriesRaw, toplistsRaw] = await Promise.all([
    fs.readFile(CATEGORIES_PATH, "utf8"),
    fs.readFile(TOPLISTS_PATH, "utf8")
  ]);
  const categories = JSON.parse(categoriesRaw);
  const toplists = JSON.parse(toplistsRaw);

  const productsByType = new Map();

  for (const list of toplists) {
    if (!list.published || !TARGET_CHILD_SUBCATEGORIES.includes(list.childsubcategory)) {
      continue;
    }

    const productsFile = path.join(PRODUCTS_DIR, `${list.childsubcategory}.json`);
    const existingProducts = await fs
      .readFile(productsFile, "utf8")
      .then((data) => JSON.parse(data))
      .catch(() => []);

    const category = categories.find((item) => item.slug === list.category);
    const subcategory = category?.subcategories?.find((item) => item.slug === list.subcategory);
    const child = subcategory?.subcategories?.find((item) => item.slug === list.childsubcategory);

    const childName = child?.name ?? list.childsubcategory.replace(/-/g, " ");
    const keywords = [childName, list.title];
    let scored = [];

    try {
      const query = `best ${childName}`;
      const asins = await fetchAmazonSearchAsins(query);

      const rawProducts = [];
      for (const asin of asins) {
        try {
          const item = await fetchAmazonProduct(asin);
          rawProducts.push(item);
        } catch (error) {
          continue;
        }
      }

      const priceLimit = extractPriceLimit(list.keywordSlug) || extractPriceLimit(list.title);

      scored = rawProducts
        .filter((product) => product.title && product.rating && product.reviewCount)
        .filter((product) => {
          if (!priceLimit) return true;
          const priceValue = Number(String(product.price || "").replace(/[^0-9.]/g, ""));
          return Number.isFinite(priceValue) && priceValue <= priceLimit;
        })
        .map((product) => ({
          ...product,
          score: scoreProduct(product.rating, product.reviewCount)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.min(list.count || MAX_PRODUCTS, MAX_PRODUCTS));
    } catch (error) {
      scored = [];
    }

    const existingByAsin = new Map(
      existingProducts.filter((product) => product.asin).map((product) => [product.asin, product])
    );
    const usedSlugs = new Set(existingProducts.map((product) => product.slug));

    const finalProducts = [];

    if (scored.length > 0) {
      for (const product of scored) {
        const existing = existingByAsin.get(product.asin);
        if (existing) {
          existing.name = product.title;
          existing.image = product.image || existing.image;
          existing.price = normalizePrice(product.price) || existing.price;
          existing.rating = product.rating || existing.rating;
          existing.ratingCount = product.reviewCount || existing.ratingCount;
          existing.brand = product.brand || existing.brand;
          finalProducts.push(existing);
          continue;
        }

        const ai = await generateProductCopy(product, childName);
        const baseSlug = slugify(product.title || `${childName}-${product.asin}`);
        let slug = baseSlug || product.asin.toLowerCase();
        let counter = 2;
        while (usedSlugs.has(slug)) {
          slug = `${baseSlug}-${counter}`;
          counter += 1;
        }
        usedSlugs.add(slug);

        const affiliateUrl = `https://www.amazon.com/dp/${product.asin}`;
        const entry = toProductEntry({ base: product, ai, slug, affiliateUrl });
        finalProducts.push(entry);
      }
    } else if (existingProducts.length > 0) {
      finalProducts.push(...existingProducts.slice(0, Math.min(list.count || MAX_PRODUCTS, MAX_PRODUCTS)));
    } else {
      throw new Error(`No products available for ${list.title}.`);
    }

    const withAlternatives = finalProducts.map((product) => {
      const alternatives = finalProducts
        .filter((item) => item.slug !== product.slug)
        .slice(0, 3)
        .map((item) => item.slug);
      return { ...product, alternatives };
    });

    const articleHtml = await generateToplistArticle({
      title: list.title,
      intro: list.metaDescription,
      products: withAlternatives,
      keywords
    });

    list.products = withAlternatives.map((product) => product.slug);
    list.articleHtml = articleHtml;
    list.count = Math.min(list.count || MAX_PRODUCTS, MAX_PRODUCTS, withAlternatives.length);

    const existingTypeProducts = productsByType.get(list.childsubcategory) ?? [];
    const mergedBySlug = new Map(existingTypeProducts.map((item) => [item.slug, item]));
    for (const product of withAlternatives) {
      mergedBySlug.set(product.slug, product);
    }
    productsByType.set(list.childsubcategory, Array.from(mergedBySlug.values()));
  }

  await fs.mkdir(PRODUCTS_DIR, { recursive: true });
  for (const [type, products] of productsByType.entries()) {
    const outputPath = path.join(PRODUCTS_DIR, `${type}.json`);
    await fs.writeFile(outputPath, `${JSON.stringify(products, null, 2)}\n`);
  }

  await fs.writeFile(TOPLISTS_PATH, `${JSON.stringify(toplists, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
