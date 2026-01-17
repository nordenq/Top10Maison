import fs from "fs/promises";
import path from "node:path";

export type AmazonProduct = {
  asin: string;
  title: string | null;
  image: string | null;
  price: string | null;
  rating: number | null;
  ratingCount?: number | null;
  brand?: string | null;
  specs?: Record<string, string> | null;
  url?: string;
};

const CACHE_PATH = process.env.AMAZON_CACHE_PATH || path.join(process.cwd(), ".cache", "amazon-products.json");
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

type CacheRecord = {
  asin: string;
  data: AmazonProduct;
  cachedAt: string;
};

async function ensureCacheFile() {
  await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });
  try {
    await fs.access(CACHE_PATH);
  } catch (error) {
    if ((error as { code?: string }).code === "ENOENT") {
      await fs.writeFile(CACHE_PATH, "{}", "utf8");
    } else {
      throw error;
    }
  }
}

async function readCache(): Promise<Record<string, CacheRecord>> {
  await ensureCacheFile();
  const raw = await fs.readFile(CACHE_PATH, "utf8");
  try {
    return JSON.parse(raw) as Record<string, CacheRecord>;
  } catch (error) {
    return {};
  }
}

async function writeCache(cache: Record<string, CacheRecord>) {
  await ensureCacheFile();
  await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
}

export async function getCachedProduct(asin: string, { ttlMs = DEFAULT_TTL_MS } = {}): Promise<AmazonProduct | null> {
  const cache = await readCache();
  const entry = cache[asin];
  if (!entry) return null;
  const age = Date.now() - new Date(entry.cachedAt).getTime();
  if (age > ttlMs) return null;
  return entry.data;
}

export async function setCachedProduct(asin: string, data: AmazonProduct): Promise<void> {
  const cache = await readCache();
  cache[asin] = { asin, data, cachedAt: new Date().toISOString() };
  await writeCache(cache);
}

export function sanitizeProduct(input: Partial<AmazonProduct> & { asin: string }): AmazonProduct {
  return {
    asin: input.asin,
    title: input.title ?? null,
    image: input.image ?? null,
    price: input.price ?? null,
    rating: typeof input.rating === "number" ? input.rating : null,
    ratingCount: typeof input.ratingCount === "number" ? input.ratingCount : null,
    brand: input.brand ?? null,
    specs: input.specs && typeof input.specs === "object" ? (input.specs as Record<string, string>) : null,
    url: input.url
  };
}
