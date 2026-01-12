/* empty css                         */
import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, e as addAttribute } from './astro/server_W2JWWxAV.mjs';
import 'kleur/colors';
import { r as requireSite, b as buildCanonical, $ as $$BaseLayout } from './seo_jMrGLJxf.mjs';
import { $ as $$CategoryCard } from './CategoryCard_DAhL6H1i.mjs';
import { g as getDataIndex, b as subcategoryToplistUrl } from './routes_BEIx0N0R.mjs';
import { b as buildBreadcrumbSchema } from './schema_BGDs2hqD.mjs';

const $$Astro = createAstro("https://www.top10maison.com");
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const { categories, toplists } = getDataIndex();
  const latestToplists = [...toplists].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 4);
  const categoryMap = new Map(categories.map((category) => [category.slug, category]));
  const site = requireSite(Astro2.site);
  const title = "Top10Maison \u2014 Trending Product Rankings for Every Room";
  const description = "Compare the best home products, track what\u2019s trending, and shop smarter with curated top lists for kitchens, small appliances, and more.";
  const canonical = buildCanonical(site, "/");
  const schema = [buildBreadcrumbSchema(site, [{ name: "Home", path: "/" }])];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description, "canonical": canonical, "schema": schema, "ogImage": "/og-image.jpg" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section bg-surface"> <div class="page-container grid items-center gap-10 md:grid-cols-2"> <div> <p class="text-xs font-semibold uppercase tracking-[0.3em] text-ink/70">Home essentials hub</p> <h1 class="mt-3 text-4xl font-semibold md:text-5xl">Shop smarter with curated top lists.</h1> <p class="mt-4 text-lg text-ink/70">
Best picks for your home. Trending. Trusted. Wallet-friendly.
</p> <p class="mt-3 text-sm text-ink/70">
Curated guides, reviewed for clarity and real-world fit.
</p> <div class="mt-6 flex flex-wrap gap-3"> <a class="btn" href="#top-categories">Browse categories</a> <a class="btn-ghost" href="#latest-toplists">Latest top lists</a> </div> </div> <div class="card p-6"> <h2 class="text-xl font-semibold">What you will find here</h2> <ul class="mt-4 space-y-3 text-sm text-ink/70"> <li>Best‑of lists for every room, built with consistent criteria.</li> <li>Trending picks and smart comparisons to speed up your decision.</li> <li>Concise buying guidance that keeps the focus on what matters.</li> <li>Regularly refreshed picks based on ratings, review volume, and value.</li> </ul> </div> </div> </section> <section class="section"> <div class="page-container"> <div class="flex flex-wrap items-end justify-between gap-4"> <div> <p class="text-xs font-semibold uppercase tracking-[0.3em] text-ink/70">Brand moments</p> <h2 class="mt-2 text-2xl font-semibold">Small details, clearer picks.</h2> </div> <p class="max-w-xl text-sm text-ink/70">
A friendly, modern guide with just enough warmth to feel human and just enough rigor to trust.
</p> </div> <div class="mt-6 grid gap-6 md:grid-cols-3"> <div class="card card-hover p-5"> <div class="flex items-center gap-3"> <span class="brand-icon"> <svg viewBox="0 0 24 24" class="h-5 w-5" aria-hidden="true"> <path d="M4 7.5C4 5.6 5.6 4 7.5 4h9C18.4 4 20 5.6 20 7.5v9c0 1.9-1.6 3.5-3.5 3.5h-9C5.6 20 4 18.4 4 16.5v-9z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8 9.5h8M8 12.5h5M8 15.5h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path> <circle class="accent-dot" cx="18.2" cy="6" r="1.3" fill="#2BBBAD"></circle> </svg> </span> <h3 class="text-lg font-semibold">Friendly filters</h3> </div> <p class="mt-3 text-sm text-ink/70">
We translate specs into real-life choices so you can decide faster.
</p> </div> <div class="card card-hover p-5"> <div class="flex items-center gap-3"> <span class="brand-icon"> <svg viewBox="0 0 24 24" class="h-5 w-5" aria-hidden="true"> <path d="M6 7.5h12M6 12h7M6 16.5h10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path> <circle class="accent-dot" cx="18" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></circle> <circle class="accent-dot" cx="19.5" cy="8.2" r="1.2" fill="#2BBBAD"></circle> </svg> </span> <h3 class="text-lg font-semibold">Shortlists only</h3> </div> <p class="mt-3 text-sm text-ink/70">
No endless grids. Just the top picks that actually earn their spot.
</p> </div> <div class="card card-hover p-5"> <div class="flex items-center gap-3"> <span class="brand-icon"> <svg viewBox="0 0 24 24" class="h-5 w-5" aria-hidden="true"> <path d="M7.5 4.5h6.5L18 8v11c0 .9-.7 1.5-1.5 1.5h-9C6.7 20.5 6 19.9 6 19V6c0-.8.7-1.5 1.5-1.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path> <circle class="accent-dot" cx="16.8" cy="6.3" r="1.2" fill="#2BBBAD"></circle> </svg> </span> <h3 class="text-lg font-semibold">Clear criteria</h3> </div> <p class="mt-3 text-sm text-ink/70">
Transparent scoring and simple explanations so the rankings feel fair.
</p> </div> </div> </div> </section> <section id="top-categories" class="section bg-surface"> <div class="page-container"> <div class="flex flex-wrap items-end justify-between gap-4"> <div> <h2 class="text-2xl font-semibold">Top categories</h2> <p class="mt-2 text-sm text-ink/70">Start with a room, then drill down to the best lists.</p> </div> <a class="text-sm font-semibold text-accent" href="/#top-categories">View all</a> </div> <div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"> ${categories.map((category, index) => renderTemplate`${renderComponent($$result2, "CategoryCard", $$CategoryCard, { "category": category, "loading": index < 3 ? "eager" : "lazy", "fetchpriority": index === 0 ? "high" : void 0 })}`)} </div> </div> </section> <section id="latest-toplists" class="section"> <div class="page-container"> <div class="flex flex-wrap items-end justify-between gap-4"> <div> <h2 class="text-2xl font-semibold">Latest top lists</h2> <p class="mt-2 text-sm text-ink/70">Freshly updated guides with ranked picks and quick advice.</p> </div> </div> <div class="mt-6 grid gap-6 md:grid-cols-2"> ${latestToplists.map((list, index) => {
    const category = categoryMap.get(list.category);
    const image = list.image ?? category?.image ?? "/logo.svg";
    const imageSrcset = list.imageSrcset ?? category?.imageSrcset;
    const isLcp = index === 0;
    return renderTemplate`<a class="card card-hover grid gap-4 overflow-hidden md:grid-cols-[200px_1fr]"${addAttribute(subcategoryToplistUrl(list.category, list.subcategory, list.count, list.keywordSlug), "href")}> <img class="h-full w-full object-cover"${addAttribute(image, "src")}${addAttribute(list.title, "alt")}${addAttribute(isLcp ? "eager" : "lazy", "loading")}${addAttribute(isLcp ? "high" : void 0, "fetchpriority")} decoding="async"${addAttribute(imageSrcset, "srcset")} sizes="(max-width: 768px) 100vw, 200px" width="400" height="300"> <div class="p-5"> <p class="text-xs font-semibold uppercase tracking-[0.25em] text-ink/70">Top list</p> <h3 class="mt-2 text-lg font-semibold">${list.title}</h3> <p class="mt-2 text-sm text-ink/70">${list.metaDescription}</p> </div> </a>`;
  })} </div> </div> </section> <section class="section bg-surface"> <div class="page-container"> <h2 class="text-2xl font-semibold">What is Top10Maison?</h2> <p class="mt-3 text-sm text-ink/70">
Top10Maison is a home-focused review site that ranks products using consistent criteria, transparent
        scoring, and real-world use cases. Our goal is to help you choose faster with shortlists that reflect
        everyday needs, not marketing hype.
</p> </div> </section> ` })}`;
}, "/workspaces/Top11Maison/src/pages/index.astro", void 0);

const $$file = "/workspaces/Top11Maison/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _ };
