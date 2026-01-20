import type { APIRoute } from "astro";
import { Buffer } from "node:buffer";
import { getCachedProduct, sanitizeProduct, setCachedProduct, type AmazonProduct } from "../../utils/amazon-cache";

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const DEFAULT_OXY_URL = "https://realtime.oxylabs.io/v1/queries";
const DEFAULT_GEO = "10001"; // Oxylabs expects postal/ZIP for amazon.com

function pickPrice(result: any): string | null {
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

function pickRating(result: any): number | null {
  const rating = result?.rating ?? result?.rating_value ?? result?.rating?.value;
  const parsed = typeof rating === "number" ? rating : Number(rating);
  return Number.isFinite(parsed) ? parsed : null;
}

function pickRatingCount(result: any): number | null {
  const count =
    result?.reviews_count ??
    result?.reviews_total ??
    result?.reviews ??
    result?.total_reviews ??
    result?.rating_count;
  const parsed = typeof count === "number" ? count : Number(count);
  return Number.isFinite(parsed) ? parsed : null;
}

function pickSpecs(result: any): Record<string, string> | null {
  const candidates = [result?.product_details, result?.tech_spec, result?.specifications, result?.details];
  for (const cand of candidates) {
    if (cand && typeof cand === "object" && !Array.isArray(cand) && Object.keys(cand).length > 0) {
      const entries = Object.entries(cand)
        .map(([key, value]) => [String(key).trim(), typeof value === "string" ? value : value?.toString?.() || ""])
        .filter(([, v]) => v && v.trim());
      if (entries.length) {
        return Object.fromEntries(entries);
      }
    }
  }
  return null;
}

async function fetchOxylabsProduct(asin: string): Promise<AmazonProduct> {
  const user = import.meta.env.OXYLABS_USER;
  const password = import.meta.env.OXYLABS_PASS;
  const endpoint = import.meta.env.OXYLABS_BASE_URL || DEFAULT_OXY_URL;
  const geoLocation = import.meta.env.OXYLABS_GEO || DEFAULT_GEO;

  if (!user || !password) {
    throw new Error("Missing Oxylabs credentials.");
  }

  const auth = Buffer.from(`${user}:${password}`).toString("base64");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        source: "amazon_product",
        query: asin,
        domain: "com",
        geo_location: geoLocation,
        parse: true
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "<no body>");
      throw new Error(`Oxylabs request failed: ${response.status} ${response.statusText}: ${body.slice(0, 500)}`);
    }

    const payload = (await response.json()) as any;
    const result = payload?.results?.[0];
    const content = result?.content ?? {};

    return sanitizeProduct({
      asin,
      title: content.title ?? content.product?.title ?? null,
      image: content.main_image ?? content.image ?? content.image_url ?? null,
      price: pickPrice(content),
      rating: pickRating(content),
      ratingCount: pickRatingCount(content),
      brand: content.brand ?? content.product?.brand ?? null,
      specs: pickSpecs(content),
      url: result?.url ?? `https://www.amazon.com/dp/${asin}`
    });
  } finally {
    clearTimeout(timeout);
  }
}

export const GET: APIRoute = async ({ request }) => {
  const asin = new URL(request.url).searchParams.get("asin");
  if (!asin) {
    return new Response(JSON.stringify({ error: "Missing ASIN" }), { status: 400 });
  }

  try {
    const cached = await getCachedProduct(asin, { ttlMs: DEFAULT_TTL_MS });
    if (cached) {
      return new Response(JSON.stringify(cached), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    const product = sanitizeProduct(await fetchOxylabsProduct(asin));
    await setCachedProduct(asin, product);

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("amazon-products error", error);
    const fallback = sanitizeProduct({
      asin,
      url: `https://www.amazon.com/dp/${asin}`
    });
    return new Response(JSON.stringify(fallback), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};
