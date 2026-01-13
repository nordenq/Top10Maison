import fs from "node:fs/promises";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
const apiKey = process.env.SCRAPINGBEE_API_KEY;

if (!apiKey) {
  console.error("Missing SCRAPINGBEE_API_KEY.");
  process.exit(1);
}

const mode = args._[0] || "search";
const domain = pickArg(args, ["domain"], "com");
const lightRequest = !pickArg(args, ["full"], false);
const renderJs = pickArg(args, ["render-js", "render_js"], false);
const premiumProxy = pickArg(args, ["premium-proxy", "premium_proxy"], false);

if (mode === "air-fryers") {
  const filePath = pickArg(
    args,
    ["file"],
    path.join(process.cwd(), "src", "data", "products", "air-fryers.json")
  );
  const limit = Number(pickArg(args, ["limit"], "0"));
  const resolveMissing = !pickArg(args, ["no-resolve"], false);
  const fetchDetails = pickArg(args, ["details"], false);
  const products = await loadProducts(filePath);
  const selected = limit > 0 ? products.slice(0, limit) : products;
  const results = [];

  for (const product of selected) {
    const resolved = await resolveAsin(product, { resolveMissing, renderJs });
    results.push(resolved);
  }

  if (!fetchDetails) {
    results.forEach((item) => {
      const status = item.asin ? "OK" : "MISSING";
      console.log(`${item.slug}\t${status}\t${item.asin ?? "-"}`);
    });
    process.exit(0);
  }

  for (const item of results) {
    if (!item.asin) {
      console.log(`${item.slug}\tMISSING_ASIN`);
      continue;
    }
    const html = await fetchAmazonProductHtml(item.asin, { lightRequest, domain, renderJs, premiumProxy });
    const title = extractTitle(html) || "";
    const price = extractPrice(html) || "";
    console.log(`${item.slug}\t${item.asin}\t${title}\t${price}`);
  }

  process.exit(0);
}

const endpoint =
  mode === "product"
    ? "https://app.scrapingbee.com/api/v1/amazon/product"
    : "https://app.scrapingbee.com/api/v1/amazon/search";

const params = new URLSearchParams();
params.set("api_key", apiKey);
params.set("domain", domain);
params.set("light_request", lightRequest ? "true" : "false");
if (renderJs) params.set("render_js", "true");
if (premiumProxy) params.set("premium_proxy", "true");

if (mode === "product") {
  const asin = pickArg(args, ["asin"], args._[1]);
  if (!asin) {
    printUsage();
    process.exit(1);
  }
  params.set("asin", asin);
} else if (mode === "search") {
  const query = pickArg(args, ["query", "q"], args._[1] || "air fryers");
  params.set("query", query);
  params.set("sort_by", pickArg(args, ["sort-by", "sort_by"], "bestsellers"));
  params.set("start_page", pickArg(args, ["start-page", "start_page"], "1"));
  params.set("pages", pickArg(args, ["pages"], "1"));
} else {
  printUsage();
  process.exit(1);
}

const url = `${endpoint}?${params.toString()}`;
const response = await fetch(url);
const body = await response.text();

if (!response.ok) {
  console.error(`ScrapingBee error (${response.status}): ${body}`);
  process.exit(1);
}

console.log(body);

function parseArgs(list) {
  const out = { _: [] };
  for (let i = 0; i < list.length; i += 1) {
    const item = list[i];
    if (item.startsWith("--")) {
      const key = item.slice(2);
      const next = list[i + 1];
      if (!next || next.startsWith("--")) {
        out[key] = true;
      } else {
        out[key] = next;
        i += 1;
      }
    } else {
      out._.push(item);
    }
  }
  return out;
}

function pickArg(source, keys, fallback) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value !== "undefined") return value;
  }
  return fallback;
}

async function loadProducts(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    throw new Error(`Expected array in ${filePath}`);
  }
  return data;
}

function extractAsinFromText(value) {
  if (!value) return "";
  const patterns = [/\/dp\/([A-Z0-9]{10})/, /\/gp\/product\/([A-Z0-9]{10})/, /data-asin="([A-Z0-9]{10})"/];
  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match) return match[1];
  }
  return "";
}

async function resolveAsin(product, { resolveMissing, renderJs }) {
  const slug = product?.slug || "";
  const fromData = typeof product?.asin === "string" ? product.asin.trim() : "";
  if (fromData) return { slug, asin: fromData, source: "data" };
  const affiliateUrl = typeof product?.affiliateUrl === "string" ? product.affiliateUrl : "";
  const fromUrl = extractAsinFromText(affiliateUrl);
  if (fromUrl) return { slug, asin: fromUrl, source: "affiliate_url" };
  if (!resolveMissing || !affiliateUrl) return { slug, asin: "", source: "missing" };
  const html = await fetchScrapingBeeHtml(affiliateUrl, { renderJs });
  const fromHtml = extractAsinFromText(html);
  return { slug, asin: fromHtml, source: fromHtml ? "html" : "missing" };
}

async function fetchScrapingBeeHtml(url, { renderJs } = {}) {
  const apiUrl = new URL("https://app.scrapingbee.com/api/v1/");
  apiUrl.searchParams.set("api_key", apiKey);
  apiUrl.searchParams.set("url", url);
  apiUrl.searchParams.set("country_code", "us");
  if (renderJs) {
    apiUrl.searchParams.set("render_js", "true");
  }
  const response = await fetch(apiUrl.toString());
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ScrapingBee failed (${response.status}) for ${url}: ${errorText}`);
  }
  return response.text();
}

async function fetchAmazonProductHtml(asin, { lightRequest, domain, renderJs, premiumProxy }) {
  const apiUrl = new URL("https://app.scrapingbee.com/api/v1/amazon/product");
  apiUrl.searchParams.set("api_key", apiKey);
  apiUrl.searchParams.set("asin", asin);
  apiUrl.searchParams.set("domain", domain);
  apiUrl.searchParams.set("light_request", lightRequest ? "true" : "false");
  if (renderJs) apiUrl.searchParams.set("render_js", "true");
  if (premiumProxy) apiUrl.searchParams.set("premium_proxy", "true");
  const response = await fetch(apiUrl.toString());
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ScrapingBee failed (${response.status}) for ASIN ${asin}: ${errorText}`);
  }
  return response.text();
}

function extractTitle(html) {
  const match = html.match(/id="productTitle"[^>]*>\s*([\s\S]*?)<\/span>/i);
  return match ? stripTags(match[1]) : "";
}

function extractPrice(html) {
  const match = html.match(/id="priceblock_(?:dealprice|ourprice)"[^>]*>\s*([^<]+)<\/span>/i);
  return match ? stripTags(match[1]) : "";
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function printUsage() {
  console.log("Usage:");
  console.log("  node scripts/test-scrapingbee.mjs search --query \"air fryers\"");
  console.log("  node scripts/test-scrapingbee.mjs product --asin <AIR_FRYER_ASIN>");
  console.log("  node scripts/test-scrapingbee.mjs air-fryers --limit 5");
  console.log("  node scripts/test-scrapingbee.mjs air-fryers --details");
  console.log("");
  console.log("Options:");
  console.log("  --domain com");
  console.log("  --full (disable light_request)");
  console.log("  --render-js");
  console.log("  --premium-proxy");
  console.log("  --sort-by bestsellers");
  console.log("  --start-page 1");
  console.log("  --pages 1");
  console.log("  --file <path>");
  console.log("  --limit <n>");
  console.log("  --no-resolve (skip resolving short links)");
  console.log("  --details (fetch product pages; costs credits)");
}
