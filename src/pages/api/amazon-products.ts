import type { APIRoute } from "astro";
import { getCachedProduct, sanitizeProduct, setCachedProduct, type AmazonProduct } from "../../utils/amazon-cache";

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

async function fetchAmazonProduct(asin: string): Promise<AmazonProduct> {
  const accessKey = import.meta.env.AMAZON_PA_ACCESS_KEY;
  const secretKey = import.meta.env.AMAZON_PA_SECRET_KEY;
  const associateTag = import.meta.env.AMAZON_ASSOCIATE_TAG;

  if (!accessKey || !secretKey || !associateTag) {
    throw new Error("Missing Amazon Product Advertising API credentials.");
  }

  // TODO: Implement PA-API signed request. This stub returns a minimal shape to keep builds static.
  // Replace with a real PA-API fetch and map the response fields into the AmazonProduct shape.
  return {
    asin,
    title: null,
    image: null,
    price: null,
    rating: null,
    url: `https://www.amazon.com/dp/${asin}`
  };
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

    const product = sanitizeProduct(await fetchAmazonProduct(asin));
    await setCachedProduct(asin, product);

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("amazon-products error", error);
    return new Response(JSON.stringify({ error: "Failed to fetch product" }), { status: 500 });
  }
};
