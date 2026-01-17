import fs from "fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PRODUCTS_PATH = path.join(ROOT, "src", "data", "products", "air-fryers.json");
const API_ENDPOINT = process.env.AMAZON_PRODUCT_API_URL || "http://localhost:4321/api/amazon-products";
const OXY_URL = process.env.OXYLABS_BASE_URL || "https://realtime.oxylabs.io/v1/queries";
const OXY_GEO = process.env.OXYLABS_GEO || "10001"; // Oxylabs requires postal/ZIP for amazon.com

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
    if (error.code !== "ENOENT") throw error;
  }
}

function extractAsin(url = "") {
  if (!url) return null;
  const match =
    url.match(/\/dp\/([A-Z0-9]{10})/) ||
    url.match(/\/gp\/product\/([A-Z0-9]{10})/) ||
    url.match(/\/ASIN\/([A-Z0-9]{10})/) ||
    url.match(/([A-Z0-9]{10})(?:[/?]|$)/);
  return match ? match[1] : null;
}

function pickPrice(result = {}) {
  const price =
    result?.buybox_winner?.price?.value ??
    result?.price?.value ??
    result?.price ??
    result?.price_str;
  if (price == null) return null;
  if (typeof price === "number") return price.toString();
  if (typeof price === "string") return price;
  return null;
}

function pickRating(result = {}) {
  const rating = result?.rating ?? result?.rating_value ?? result?.rating?.value;
  const parsed = typeof rating === "number" ? rating : Number(rating);
  return Number.isFinite(parsed) ? parsed : null;
}

function pickRatingCount(result = {}) {
  const count =
    result?.reviews_count ??
    result?.reviews_total ??
    result?.reviews ??
    result?.total_reviews ??
    result?.rating_count;
  const parsed = typeof count === "number" ? count : Number(count);
  return Number.isFinite(parsed) ? parsed : null;
}

function pickSpecs(result = {}) {
  const candidates = [result.product_details, result.tech_spec, result.specifications, result.details];
  for (const cand of candidates) {
    if (cand && typeof cand === "object" && !Array.isArray(cand) && Object.keys(cand).length > 0) {
      const entries = Object.entries(cand)
        .map(([key, value]) => [String(key).trim(), typeof value === "string" ? value : value?.toString?.() || ""])
        .filter(([, v]) => v && v.trim());
      if (entries.length) return Object.fromEntries(entries);
    }
  }
  return null;
}

async function resolveAsinFromAffiliate(url) {
  if (!url || !url.includes("amzn.to")) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    // Try without following redirects to read Location
    const head = await fetch(url, { method: "GET", redirect: "manual", signal: controller.signal });
    const location = head.headers.get("location") || head.url;
    const asin = extractAsin(location || "");
    if (asin) return asin;

    // Fallback: follow redirects
    const resp = await fetch(url, { redirect: "follow", signal: controller.signal });
    return extractAsin(resp.url || "");
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchProduct(asin) {
  // Try project API first
  try {
    const url = new URL(API_ENDPOINT);
    url.searchParams.set("asin", asin);
    const res = await fetch(url.toString(), { timeout: 15000 });
    if (res.ok) return res.json();
  } catch (error) {
    // fall through
  }

  // Fallback: call Oxylabs directly
  const user = process.env.OXYLABS_USER;
  const pass = process.env.OXYLABS_PASS;
  if (!user || !pass) {
    throw new Error("Missing OXYLABS_USER/OXYLABS_PASS for direct fetch");
  }

  const auth = Buffer.from(`${user}:${pass}`).toString("base64");
  const resp = await fetch(OXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`
    },
    body: JSON.stringify({
      source: "amazon_product",
      query: asin,
      domain: "com",
      geo_location: OXY_GEO,
      parse: true
    })
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => "<no body>");
    throw new Error(`Oxylabs ${resp.status} ${resp.statusText}: ${body.slice(0, 500)}`);
  }

  const payload = await resp.json();
  const result = payload?.results?.[0];
  const content = result?.content ?? {};

  return {
    asin,
    title: content.title ?? content.product?.title ?? null,
    image: content.main_image ?? content.image ?? content.image_url ?? null,
    price: pickPrice(content),
    rating: pickRating(content),
    ratingCount: pickRatingCount(content),
    brand: content.brand ?? content.product?.brand ?? null,
    specs: pickSpecs(content),
    url: result?.url ?? `https://www.amazon.com/dp/${asin}`
  };
}

async function main() {
  await loadEnv();
  const raw = await fs.readFile(PRODUCTS_PATH, "utf8");
  const products = JSON.parse(raw);

  const updated = [];
  for (const product of products) {
    if (!product.published) {
      updated.push(product);
      continue;
    }

    let asin = product.asin || extractAsin(product.affiliateUrl || "");
    if (!asin && product.affiliateUrl) {
      asin = await resolveAsinFromAffiliate(product.affiliateUrl);
    }
    if (!asin) {
      console.warn(`Skipping ${product.slug}: no ASIN found`);
      updated.push(product);
      continue;
    }

    try {
      const apiProduct = await fetchProduct(asin);
      const merged = {
        ...product,
        asin,
        name: apiProduct.title || product.name,
        image: apiProduct.image || product.image,
        price: apiProduct.price || product.price,
        rating: apiProduct.rating ?? product.rating,
        ratingCount: apiProduct.ratingCount ?? product.ratingCount,
        specs: apiProduct.specs || product.specs,
        affiliateUrl: product.affiliateUrl || apiProduct.url || `https://www.amazon.com/dp/${asin}`
      };
      updated.push(merged);
      console.log(`Updated ${product.slug} with ASIN ${asin}`);
    } catch (error) {
      console.warn(`Failed to update ${product.slug}:`, error.message);
      updated.push(product);
    }
  }

  await fs.writeFile(PRODUCTS_PATH, `${JSON.stringify(updated, null, 2)}\n`, "utf8");
  console.log(`Saved ${updated.length} products to ${PRODUCTS_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
