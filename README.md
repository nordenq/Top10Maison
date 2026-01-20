# Top11Maison

## Design system: backgrounds

- Page background uses `--bg-page` via `bg-page`.
- Section tint uses `--bg-soft` via `bg-soft` for major blocks only.
- Cards and UI surfaces stay white with `bg-surface`.
- Backgrounds are applied at the section level, not inside components.

## Environment
- Copy `.env.sample` to `.env`; `.env.example` documents the same keys with notes.
- Product data (server-only): `OXYLABS_USER`, `OXYLABS_PASS`, `OXYLABS_BASE_URL`, `OXYLABS_GEO`.
- Public analytics: `PUBLIC_GA_ID`, `PUBLIC_GSC_VERIFICATION`.
- AI helpers: `OPENAI_API_KEY` for copy and image generation.
- Affiliate links: `AMAZON_ASSOCIATE_TAG`; optional `AMAZON_CACHE_PATH` and `AMAZON_PRODUCT_API_URL` for cache location or local API routing.
