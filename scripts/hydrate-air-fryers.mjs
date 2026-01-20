import fs from "fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PRODUCTS_PATH = path.join(ROOT, "src", "data", "products", "air-fryers.json");
const API_ENDPOINT = process.env.AMAZON_PRODUCT_API_URL || "http://localhost:4321/api/amazon-products";

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
  const url = new URL(API_ENDPOINT);
  url.searchParams.set("asin", asin);
  const res = await fetch(url.toString(), { timeout: 15000 });
  if (!res.ok) {
    throw new Error(`API responded with ${res.status} ${res.statusText}`);
  }
  return res.json();
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
