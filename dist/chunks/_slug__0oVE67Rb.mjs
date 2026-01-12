/* empty css                         */
import { c as createAstro, a as createComponent, m as maybeRenderHead, e as addAttribute, b as renderTemplate, r as renderComponent } from './astro/server_W2JWWxAV.mjs';
import 'kleur/colors';
import { r as requireSite, b as buildCanonical, $ as $$BaseLayout } from './seo_jMrGLJxf.mjs';
import { $ as $$Breadcrumbs, a as $$FAQAccordion } from './FAQAccordion_De33NIdW.mjs';
import { h as getProductData, g as getDataIndex, p as productUrl, c as categoryUrl, s as subcategoryUrl, a as childSubcategoryUrl, b as subcategoryToplistUrl } from './routes_BEIx0N0R.mjs';
import { b as buildBreadcrumbSchema, e as buildProductSchema, f as buildReviewSchema, c as buildFaqSchema } from './schema_BGDs2hqD.mjs';
import 'clsx';

const $$Astro$1 = createAstro("https://www.top10maison.com");
const $$AffiliateButton = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AffiliateButton;
  const { url, label, productSlug } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a class="btn"${addAttribute(url, "href")} rel="nofollow sponsored" target="_blank" data-affiliate="amazon"${addAttribute(productSlug, "data-product")}> ${label} </a>`;
}, "/workspaces/Top11Maison/src/components/AffiliateButton.astro", void 0);

const $$Astro = createAstro("https://www.top10maison.com");
function getStaticPaths() {
  const { products } = dataIndex;
  return products.map((product) => ({
    params: { slug: product.slug }
  }));
}
const $$slug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const dataIndex2 = getDataIndex();
  const { slug } = Astro2.params;
  const product = getProductData(slug);
  const { toplists, productMap, categoryMap, subcategoryMap, childSubcategoryMap } = dataIndex2;
  const relatedToplist = toplists.find((list) => list.products.includes(product.slug));
  const relatedCategory = relatedToplist ? categoryMap.get(relatedToplist.category) : null;
  const relatedSubcategory = relatedToplist ? subcategoryMap.get(`${relatedToplist.category}:${relatedToplist.subcategory}`) : null;
  const relatedChildsubcategory = relatedToplist ? childSubcategoryMap.get(
    `${relatedToplist.category}:${relatedToplist.subcategory}:${relatedToplist.childsubcategory}`
  ) : null;
  const relatedProducts = relatedToplist ? relatedToplist.products.filter((productSlug) => productSlug !== product.slug).map((productSlug) => productMap.get(productSlug)).filter((item) => Boolean(item)) : [];
  const site = requireSite(Astro2.site);
  const canonical = buildCanonical(site, productUrl(product.slug));
  const breadcrumbItems = relatedCategory && relatedSubcategory && relatedChildsubcategory ? [
    { name: "Home", href: "/" },
    { name: relatedCategory.name, href: categoryUrl(relatedCategory.slug) },
    {
      name: relatedSubcategory.name,
      href: subcategoryUrl(relatedCategory.slug, relatedSubcategory.slug)
    },
    {
      name: relatedChildsubcategory.name,
      href: childSubcategoryUrl(relatedCategory.slug, relatedSubcategory.slug, relatedChildsubcategory.slug)
    },
    { name: product.name, href: productUrl(product.slug) }
  ] : [
    { name: "Home", href: "/" },
    { name: product.name, href: productUrl(product.slug) }
  ];
  const schema = [
    buildBreadcrumbSchema(
      site,
      breadcrumbItems.map((item) => ({ name: item.name, path: item.href }))
    ),
    buildProductSchema(site, product),
    buildReviewSchema(site, product),
    buildFaqSchema(product.faq)
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$BaseLayout, { "title": product.metaTitle || product.name, "description": product.metaDescription || product.description, "canonical": canonical, "schema": schema, "ogImage": product.image }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section"> <article class="page-container"> <div class="flex flex-wrap items-center justify-between gap-3"> ${renderComponent($$result2, "Breadcrumbs", $$Breadcrumbs, { "items": breadcrumbItems })} <a id="smart-back" class="btn-ghost hidden" href="/">Back</a> </div> <h1 class="text-3xl font-semibold">${product.name}</h1> <img class="mt-6 rounded-xl bg-slate-50 object-contain"${addAttribute(product.image, "src")}${addAttribute(product.name, "alt")} loading="lazy" decoding="async" width="800" height="500" onerror="this.onerror=null;this.src='/images/products/placeholder.svg';"> <p class="mt-4 text-lg text-ink/70">${product.description}</p> <div class="mt-6"> ${renderComponent($$result2, "AffiliateButton", $$AffiliateButton, { "url": product.affiliateUrl, "label": "View on Amazon", "productSlug": product.slug })} </div> <section class="mt-10"> <h2 class="text-xl font-semibold">Specifications</h2> <ul class="mt-3 list-disc list-inside space-y-2 text-ink/70"> ${Object.entries(product.specs).map(([label, value]) => renderTemplate`<li><strong>${label}:</strong> ${value}</li>`)} </ul> </section> ${relatedToplist ? renderTemplate`<section class="mt-10"> <h2 class="text-xl font-semibold">See the full list</h2> <p class="mt-2 text-sm text-ink/70"> <a class="text-accent"${addAttribute(relatedChildsubcategory ? childSubcategoryUrl(
    relatedToplist.category,
    relatedToplist.subcategory,
    relatedToplist.childsubcategory
  ) : subcategoryToplistUrl(
    relatedToplist.category,
    relatedToplist.subcategory,
    relatedToplist.count,
    relatedToplist.keywordSlug
  ), "href")}> ${relatedToplist.title} </a> </p> </section>` : null} ${relatedProducts.length ? renderTemplate`<section class="mt-10"> <h2 class="text-xl font-semibold">Related products</h2> <ul class="mt-3 list-disc list-inside space-y-2 text-ink/70"> ${relatedProducts.map((item) => renderTemplate`<li><a class="text-accent"${addAttribute(productUrl(item.slug), "href")}>${item.name}</a></li>`)} </ul> </section>` : null} ${product.faq?.length ? renderTemplate`${renderComponent($$result2, "FAQAccordion", $$FAQAccordion, { "items": product.faq })}` : null} </article> </section> ` })}`;
}, "/workspaces/Top11Maison/src/pages/product/[slug].astro", void 0);

const $$file = "/workspaces/Top11Maison/src/pages/product/[slug].astro";
const $$url = "/product/[slug]/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _ };
