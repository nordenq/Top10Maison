# Top10Maison

Top10Maison is an Astro site that publishes product rankings and buying guides using Oxylabs product data and internal generation scripts.

## Quick start

```bash
npm install
cp .env.sample .env
npm run dev
```

## Environment variables

Set the following variables in `.env` (never commit real secrets). The `.env.sample` and `.env.example` files mirror the expected names.

### Public (browser-safe)
- `PUBLIC_GA_ID` — Google Analytics measurement ID.
- `PUBLIC_GSC_VERIFICATION` — Google Search Console verification token.

### Server-side
- `OPENAI_API_KEY` — Used for AI copy and image generation during content builds.
- `AMAZON_ASSOCIATE_TAG` — Optional affiliate tag for Amazon links.
- `AMAZON_CACHE_PATH` — Optional override for `.cache/amazon-products.json`.
- `AMAZON_PRODUCT_API_URL` — Optional override for the local API endpoint (default `http://localhost:4321/api/amazon-products`).
- `OXYLABS_USER`, `OXYLABS_PASS` — Oxylabs Realtime API credentials.
- `OXYLABS_BASE_URL` — Defaults to `https://realtime.oxylabs.io/v1/queries`.
- `OXYLABS_GEO` — Oxylabs geo/ZIP setting (default `US`).

## Data + generation workflow

- The site fetches Amazon product data through Oxylabs via `src/pages/api/amazon-products.ts`.
- Product data is cached in `.cache/amazon-products.json` (see `AMAZON_CACHE_PATH`).
- Content generation uses `scripts/generate-toplists.mjs` and the local API route.

Common commands:

```bash
npm run generate        # generate toplists + product data
npm run build           # generate and build the static site
npm run preview         # preview the built site
```

To hydrate existing product lists with Oxylabs data:

```bash
node scripts/hydrate-air-fryers.mjs
```

## SEO checklist

See `docs/seo-checklist.md` for the publishing checklist.

## Design system: backgrounds

- Page background uses `--bg-page` via `bg-page`.
- Section tint uses `--bg-soft` via `bg-soft` for major blocks only.
- Cards and UI surfaces stay white with `bg-surface`.
- Backgrounds are applied at the section level, not inside components.
