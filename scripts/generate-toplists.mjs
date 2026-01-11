import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "src", "data");
const PRODUCTS_DIR = path.join(DATA_DIR, "products");
const TOPLISTS_DIR = path.join(DATA_DIR, "toplists");
const TOPLISTS_PATH = path.join(DATA_DIR, "toplists.json");
const CATEGORIES_PATH = path.join(DATA_DIR, "categories.json");

const TARGET_CHILD_SUBCATEGORIES = ["air-fryers"];
const SEARCH_RESULTS_LIMIT = 50;
const MAX_PRODUCTS = 10;
const ARTICLE_WORD_TARGET = { min: 1500, max: 1800 };
const DEFAULT_SCRAPER_CONCURRENCY = 5;
const DEFAULT_OPENAI_CONCURRENCY = 3;
const DEFAULT_ASIN_FETCH_LIMIT = 30;
const DEFAULT_OPENAI_IMAGE_CONCURRENCY = 2;
const DEFAULT_OPENAI_IMAGE_MODEL = "dall-e-3";

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

async function loadToplists() {
  const entries = await fs.readdir(TOPLISTS_DIR).catch(() => null);
  if (entries && entries.length) {
    const files = entries.filter((entry) => entry.endsWith(".json")).sort();
    const lists = await Promise.all(
      files.map((file) => fs.readFile(path.join(TOPLISTS_DIR, file), "utf8").then((data) => JSON.parse(data)))
    );
    return lists;
  }
  const raw = await fs.readFile(TOPLISTS_PATH, "utf8");
  return JSON.parse(raw);
}

async function saveToplists(toplists) {
  await fs.mkdir(TOPLISTS_DIR, { recursive: true });
  const keep = new Set(toplists.map((list) => `${list.slug}.json`));
  const existing = await fs.readdir(TOPLISTS_DIR).catch(() => []);
  await Promise.all(
    existing
      .filter((entry) => entry.endsWith(".json") && !keep.has(entry))
      .map((entry) => fs.unlink(path.join(TOPLISTS_DIR, entry)))
  );
  await Promise.all(
    toplists.map((list) =>
      fs.writeFile(path.join(TOPLISTS_DIR, `${list.slug}.json`), `${JSON.stringify(list, null, 2)}\n`)
    )
  );
}

async function runWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let index = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = index;
      index += 1;
      try {
        results[current] = await worker(items[current], current);
      } catch (error) {
        results[current] = null;
      }
    }
  });
  await Promise.all(workers);
  return results;
}

function getR2Config() {
  return {
    endpoint: process.env.R2_ENDPOINT,
    bucket: process.env.R2_BUCKET,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    publicBaseUrl: process.env.R2_PUBLIC_BASE_URL
  };
}

function assertR2Config(config) {
  const required = {
    R2_ENDPOINT: config.endpoint,
    R2_BUCKET: config.bucket,
    R2_ACCESS_KEY_ID: config.accessKeyId,
    R2_SECRET_ACCESS_KEY: config.secretAccessKey,
    R2_PUBLIC_BASE_URL: config.publicBaseUrl
  };
  for (const [key, value] of Object.entries(required)) {
    if (!value) {
      throw new Error(`Missing required env var: ${key}`);
    }
  }
}

function getPublicUrl(baseUrl, key) {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  return `${normalizedBase}/${key}`;
}

function createR2Client({ endpoint, accessKeyId, secretAccessKey }) {
  return new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey }
  });
}

async function uploadToR2({ client, bucket, key, body, contentType }) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable"
  });
  await client.send(command);
}

async function optimizeImage(buffer, { width, height }) {
  return sharp(buffer)
    .resize(width, height, { fit: "cover" })
    .webp({ quality: 72 })
    .toBuffer();
}

function buildSrcset(variants, urls) {
  return variants.map((variant, index) => `${urls[index]} ${variant.width}w`).join(", ");
}

async function generateOpenAiImage(prompt, { model }) {
  const wantsB64 = model.startsWith("dall-e");
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      prompt,
      size: "1024x1024",
      ...(wantsB64 ? { response_format: "b64_json" } : {})
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI image request failed: ${errorText}`);
  }

  const data = await response.json();
  const base64 = data?.data?.[0]?.b64_json;
  if (base64) {
    return Buffer.from(base64, "base64");
  }
  const url = data?.data?.[0]?.url;
  if (!url) {
    throw new Error("OpenAI image response missing image data.");
  }
  const imageResponse = await fetch(url);
  if (!imageResponse.ok) {
    throw new Error(`Failed to download OpenAI image: ${imageResponse.status}`);
  }
  const arrayBuffer = await imageResponse.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function buildImagePrompt({ title, context }) {
  return [
    "High-quality, realistic product lifestyle photo.",
    "No text, no logos, no watermarks.",
    "Clean, modern lighting, natural colors.",
    `Subject: ${title}.`,
    context ? `Context: ${context}.` : null
  ]
    .filter(Boolean)
    .join(" ");
}

function shouldReplaceImage(value, { refresh, allowDefault }) {
  if (refresh) return true;
  if (!value) return true;
  if (allowDefault && value.startsWith("/images/")) return true;
  return false;
}

async function updateOpenAiImages({ categories, toplists, refresh, concurrency }) {
  if (!process.env.OPENAI_API_KEY) {
    if (refresh) {
      console.log("Skipping OpenAI image generation: missing OPENAI_API_KEY.");
    }
    return { categoriesUpdated: false, toplistsUpdated: false };
  }

  const imageModel = process.env.OPENAI_IMAGE_MODEL || DEFAULT_OPENAI_IMAGE_MODEL;
  const r2Config = getR2Config();
  assertR2Config(r2Config);
  const client = createR2Client(r2Config);

  const tasks = [];
  for (const category of categories) {
    if (!category.published) continue;
    if (!shouldReplaceImage(category.image, { refresh, allowDefault: true })) continue;
    tasks.push({
      kind: "category",
      baseKey: `openai/categories/${category.slug}`,
      title: category.name,
      context: "Interior room scene",
      target: category,
      variants: [
        { width: 320, height: 180 },
        { width: 640, height: 360 }
      ]
    });

    for (const subcategory of category.subcategories || []) {
      if (!subcategory.published) continue;
      if (!shouldReplaceImage(subcategory.image, { refresh, allowDefault: false })) continue;
      tasks.push({
        kind: "category",
        baseKey: `openai/subcategories/${category.slug}/${subcategory.slug}`,
        title: subcategory.name,
        context: `${category.name} products`,
        target: subcategory,
        variants: [
          { width: 320, height: 180 },
          { width: 640, height: 360 }
        ]
      });

      for (const child of subcategory.subcategories || []) {
        if (!child.published) continue;
        if (!shouldReplaceImage(child.image, { refresh, allowDefault: false })) continue;
        tasks.push({
          kind: "category",
          baseKey: `openai/childsubcategories/${category.slug}/${subcategory.slug}/${child.slug}`,
          title: child.name,
          context: `${category.name} product close-up`,
          target: child,
          variants: [
            { width: 320, height: 180 },
            { width: 640, height: 360 }
          ]
        });
      }
    }
  }

  for (const list of toplists) {
    if (!list.published) continue;
    const isDefault = list.image === "/images/og/toplist-default.jpg";
    if (!refresh && list.image && !isDefault) continue;
    tasks.push({
      kind: "toplist",
      baseKey: `openai/toplists/${list.slug}`,
      title: list.title,
      context: "Product hero shot on clean background",
      target: list,
      variants: [
        { width: 320, height: 240 },
        { width: 640, height: 480 }
      ]
    });
  }

  if (!tasks.length) {
    return { categoriesUpdated: false, toplistsUpdated: false };
  }

  const results = await runWithConcurrency(tasks, concurrency, async (task) => {
    const prompt = buildImagePrompt({ title: task.title, context: task.context });
    const raw = await generateOpenAiImage(prompt, { model: imageModel });
    const urls = [];
    for (const variant of task.variants) {
      const buffer = await optimizeImage(raw, variant);
      const key = `${task.baseKey}-${variant.width}w.webp`;
      await uploadToR2({
        client,
        bucket: r2Config.bucket,
        key,
        body: buffer,
        contentType: "image/webp"
      });
      urls.push(getPublicUrl(r2Config.publicBaseUrl, key));
    }
    return { urls, variants: task.variants };
  });

  let categoriesUpdated = false;
  let toplistsUpdated = false;
  results.forEach((result, index) => {
    if (!result) return;
    const task = tasks[index];
    const { urls, variants } = result;
    task.target.image = urls[urls.length - 1];
    task.target.imageSrcset = buildSrcset(variants, urls);
    if (task.kind === "toplist") {
      toplistsUpdated = true;
    } else {
      categoriesUpdated = true;
    }
  });

  return { categoriesUpdated, toplistsUpdated };
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
        tone: "Curated, clear, value-focused, practical.",
        constraints: "Do not claim hands-on testing, lab testing, or first-hand experience. Avoid mentioning sources or other websites.",
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
        tone: "Curated, clear, value-focused, practical.",
        format: "HTML",
        wordTarget: ARTICLE_WORD_TARGET,
        constraints: "Do not claim hands-on testing, lab testing, or first-hand experience. Avoid mentioning sources or other websites.",
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
  const enableImageGeneration = String(process.env.ENABLE_OPENAI_IMAGES || "").toLowerCase() === "1";
  const refreshImages = String(process.env.REFRESH_OPENAI_IMAGES || "").toLowerCase() === "1";
  const skipGeneration = String(process.env.SKIP_AI_GENERATION || "").toLowerCase() === "1";
  const isCloudflarePages = Boolean(process.env.CF_PAGES);
  const forceGeneration = String(process.env.FORCE_AI_GENERATION || "").toLowerCase() === "1";
  const scraperConcurrency = Number(process.env.SCRAPER_CONCURRENCY || DEFAULT_SCRAPER_CONCURRENCY);
  const openAiConcurrency = Number(process.env.OPENAI_CONCURRENCY || DEFAULT_OPENAI_CONCURRENCY);
  const openAiImageConcurrency = Number(
    process.env.OPENAI_IMAGE_CONCURRENCY || DEFAULT_OPENAI_IMAGE_CONCURRENCY
  );
  const asinFetchLimit = Number(process.env.ASIN_FETCH_LIMIT || DEFAULT_ASIN_FETCH_LIMIT);

  if (skipGeneration || (isCloudflarePages && !forceGeneration) || !hasOpenAI || !hasScraper) {
    if (skipGeneration) {
      console.log("Skipping AI/product generation: SKIP_AI_GENERATION=1.");
    } else if (isCloudflarePages && !forceGeneration) {
      console.log("Skipping AI/product generation: running on Cloudflare Pages.");
    } else {
      console.log("Skipping AI/product generation: missing OPENAI_API_KEY or SCRAPERAPI_KEY.");
    }
    if (enableImageGeneration || refreshImages) {
      const [categoriesRaw, toplists] = await Promise.all([
        fs.readFile(CATEGORIES_PATH, "utf8"),
        loadToplists()
      ]);
      const categories = JSON.parse(categoriesRaw);
      const { categoriesUpdated, toplistsUpdated } = await updateOpenAiImages({
        categories,
        toplists,
        refresh: refreshImages,
        concurrency: openAiImageConcurrency
      });
      if (categoriesUpdated) {
        await fs.writeFile(CATEGORIES_PATH, `${JSON.stringify(categories, null, 2)}\n`);
      }
      if (toplistsUpdated) {
        await saveToplists(toplists);
      }
    }
    return;
  }

  const [categoriesRaw, toplists] = await Promise.all([
    fs.readFile(CATEGORIES_PATH, "utf8"),
    loadToplists()
  ]);
  const categories = JSON.parse(categoriesRaw);

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

      const targetCount = Math.min(list.count || MAX_PRODUCTS, MAX_PRODUCTS);
      const fetchCount = Math.max(targetCount * 3, 15);
      const limitedAsins = asins.slice(0, Math.min(asinFetchLimit, fetchCount));
      const rawProducts = (
        await runWithConcurrency(limitedAsins, scraperConcurrency, (asin) => fetchAmazonProduct(asin))
      ).filter(Boolean);

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
      const newProducts = [];
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
        } else {
          newProducts.push(product);
        }
      }

      const aiPayloads = await runWithConcurrency(
        newProducts,
        openAiConcurrency,
        (product) => generateProductCopy(product, childName)
      );

      for (let i = 0; i < newProducts.length; i += 1) {
        const product = newProducts[i];
        const ai = aiPayloads[i];
        if (!ai) continue;
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

  if (enableImageGeneration || refreshImages) {
    const { categoriesUpdated, toplistsUpdated } = await updateOpenAiImages({
      categories,
      toplists,
      refresh: refreshImages,
      concurrency: openAiImageConcurrency
    });
    if (categoriesUpdated) {
      await fs.writeFile(CATEGORIES_PATH, `${JSON.stringify(categories, null, 2)}\n`);
    }
    if (toplistsUpdated) {
      await saveToplists(toplists);
    }
  }
  await saveToplists(toplists);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
