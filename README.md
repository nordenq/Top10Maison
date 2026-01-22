# Top11Maison

## Design system: backgrounds

- Page background uses `--bg-page` via `bg-page`.
- Section tint uses `--bg-soft` via `bg-soft` for major blocks only.
- Cards and UI surfaces stay white with `bg-surface`.
- Backgrounds are applied at the section level, not inside components.

## Setup & Environment
- Copy `.env.sample` → `.env` (see `.env.example` for descriptions).
- Required server-only vars for Oxylabs: `OXYLABS_USER`, `OXYLABS_PASS`, `OXYLABS_BASE_URL`, `OXYLABS_GEO`.
- Public analytics: `PUBLIC_GA_ID`, `PUBLIC_GSC_VERIFICATION`.
- AI helpers (optional): `OPENAI_API_KEY` for copy/image generation.
- Affiliate: `AMAZON_ASSOCIATE_TAG`; optional `AMAZON_CACHE_PATH`, `AMAZON_PRODUCT_API_URL` for cache/API overrides.

## Data & Product Flow
- Product enrichment comes from Oxylabs via `/api/amazon-products`; results are cached (`.cache/amazon-products.json`). On Oxylabs failure the API returns `502` with an error payload so callers can retry.
- `scripts/generate-toplists.mjs` builds toplists and articles; it calls the local `/api/amazon-products` endpoint for each ASIN and writes JSON under `src/data/toplists/` and `src/data/products/`.
- `scripts/hydrate-air-fryers.mjs` is a targeted hydrator for air fryers; adapt it for other categories if needed (uses the same API endpoint).
- Amazon PA-API is **not** used; all Amazon data comes through Oxylabs.

## Commands
- `npm install --legacy-peer-deps` — install deps (npm ci can be flaky here).
- `npm run generate` — regenerate toplists/products (uses Oxylabs API).
- `npm run build` — generate data then build the Astro site.
- `npm run test:title` — unit test for title-generation helper.

## SEO & Schema Notes
- Layouts render meta tags via `src/components/SEO.astro`; Organization and WebSite schema are injected globally.
- Page templates are responsible for providing page-specific titles, descriptions, `canonical`, and `ogImage`; category/toplist pages also pass schema objects via helpers in `src/utils/schema.ts`.
- Keep OG images under 1 MB and set meaningful alt text on images; decorative icons use `aria-hidden`.

## Future Improvements (documented only)
- Add a `validate-content.mjs` check for missing OG images.
- Migrate from `astro-critters` to the official Astro integration when available.
- Move fully to Astro’s built-in image pipeline and drop legacy image handling baggage.
