import { c as createAstro, a as createComponent, m as maybeRenderHead, e as addAttribute, b as renderTemplate, u as unescapeHTML, r as renderComponent } from './astro/server_W2JWWxAV.mjs';
import 'kleur/colors';
import 'clsx';
import { C as CSP_NONCE } from './seo_jMrGLJxf.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$2 = createAstro("https://www.top10maison.com");
const $$ProductCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ProductCard;
  const { product, rank, schema = false } = Astro2.props;
  const productLink = product.slug ? `/product/${product.slug}/` : null;
  const priceValue = product.price ? product.price.replace(/[^0-9.]/g, "") : "";
  const productSchema = schema && product.name && product.image ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    url: product.affiliateUrl,
    image: product.image,
    ...product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {},
    ...product.rating ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: 1
      }
    } : {},
    ...priceValue || product.affiliateUrl ? {
      offers: {
        "@type": "Offer",
        ...priceValue ? { price: priceValue, priceCurrency: "USD" } : {},
        ...product.affiliateUrl ? { url: product.affiliateUrl } : {}
      }
    } : {}
  } : null;
  return renderTemplate`${maybeRenderHead()}<article class="card card-hover group flex h-full flex-col overflow-hidden"> <div class="relative aspect-[4/3] w-full bg-gradient-to-br from-accent-soft to-surface"> <img${addAttribute(product.image, "src")}${addAttribute(product.name, "alt")} class="h-full w-full object-contain p-5" loading="lazy" decoding="async" width="400" height="300" onerror="this.onerror=null;this.src='/images/products/placeholder.svg';"> ${product.badge ? renderTemplate`<span class="absolute left-3 top-3 rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-white"> ${product.badge} </span>` : null} <span class="absolute right-3 top-3 rounded-full bg-surface/90 px-2.5 py-0.5 text-xs font-semibold text-ink">
#${rank} </span> </div> <div class="flex flex-1 flex-col p-5"> <h3 class="text-base font-semibold leading-snug"> ${productLink ? renderTemplate`<a class="card-link"${addAttribute(productLink, "href")}>${product.name}</a>` : product.name} </h3> ${product.brand ? renderTemplate`<p class="mt-1 text-sm text-ink/60">By ${product.brand}</p>` : null} <div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-ink/70"> <span class="rounded-full bg-accent-soft px-3 py-1 text-ink">${product.price}</span> ${product.rating ? renderTemplate`<span class="text-warning">Rating: ${product.rating} ★</span>` : null} </div> ${product.reviewSnippet || product.description ? renderTemplate`<p class="mt-4 text-sm text-ink/70">${product.reviewSnippet ?? product.description}</p>` : null} ${product.pros?.length || product.cons?.length ? renderTemplate`<div class="mt-4 grid gap-4 text-sm text-ink/70 sm:grid-cols-2"> ${product.pros?.length ? renderTemplate`<div> <p class="text-xs font-semibold uppercase tracking-wide text-ink">Pros</p> <ul class="mt-2 list-disc list-inside space-y-1"> ${product.pros.slice(0, 3).map((item) => renderTemplate`<li>${item}</li>`)} </ul> </div>` : null} ${product.cons?.length ? renderTemplate`<div> <p class="text-xs font-semibold uppercase tracking-wide text-ink">Cons</p> <ul class="mt-2 list-disc list-inside space-y-1"> ${product.cons.slice(0, 2).map((item) => renderTemplate`<li>${item}</li>`)} </ul> </div>` : null} </div>` : null} <div class="mt-auto pt-4"> <div class="flex flex-wrap items-center gap-3"> <a${addAttribute(product.affiliateUrl, "href")} target="_blank" rel="nofollow sponsored noopener" class="btn text-sm">
View on Amazon
</a> ${productLink ? renderTemplate`<a class="btn-ghost text-sm"${addAttribute(productLink, "href")}>Read review</a>` : null} </div> </div> </div> ${productSchema ? renderTemplate(_a || (_a = __template(['<script type="application/ld+json"', ">", "<\/script>"])), addAttribute(CSP_NONCE, "nonce"), unescapeHTML(JSON.stringify(productSchema))) : null} </article>`;
}, "/workspaces/Top11Maison/src/components/ProductCard.astro", void 0);

const $$Astro$1 = createAstro("https://www.top10maison.com");
const $$ProductGridSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ProductGridSection;
  const {
    title,
    intro,
    products,
    schema = false,
    startRank = 1,
    id
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="section"${addAttribute(id, "id")}> <div class="page-container"> <h2 class="text-2xl font-semibold">${title}</h2> ${intro ? renderTemplate`<p class="mt-3 text-sm text-ink/70">${intro}</p>` : null} <div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> ${products.map((product, index) => renderTemplate`${renderComponent($$result, "ProductCard", $$ProductCard, { "product": product, "rank": startRank + index, "schema": schema })}`)} </div> </div> </section>`;
}, "/workspaces/Top11Maison/src/components/ProductGridSection.astro", void 0);

const $$Astro = createAstro("https://www.top10maison.com");
const $$BulletListSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BulletListSection;
  const { title, items, intro, id } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="section"${addAttribute(id, "id")}> <div class="page-container"> <h2 class="text-2xl font-semibold">${title}</h2> ${intro ? renderTemplate`<p class="mt-3 text-sm text-ink/70">${intro}</p>` : null} <ul class="mt-4 list-disc list-inside space-y-2 text-sm text-ink/70"> ${items.map((item) => renderTemplate`<li>${item}</li>`)} </ul> </div> </section>`;
}, "/workspaces/Top11Maison/src/components/BulletListSection.astro", void 0);

export { $$ProductGridSection as $, $$BulletListSection as a };
