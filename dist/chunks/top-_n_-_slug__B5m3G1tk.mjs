/* empty css                         */
import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, e as addAttribute, u as unescapeHTML } from './astro/server_W2JWWxAV.mjs';
import 'kleur/colors';
import { r as requireSite, b as buildCanonical, $ as $$BaseLayout } from './seo_jMrGLJxf.mjs';
import { $ as $$Breadcrumbs, a as $$FAQAccordion } from './FAQAccordion_De33NIdW.mjs';
import { $ as $$ProductGridSection, a as $$BulletListSection } from './BulletListSection_CM41IYvO.mjs';
import { f as getTopListData, e as getBestToplistForChild, a as childSubcategoryUrl, b as subcategoryToplistUrl, c as categoryUrl, s as subcategoryUrl, p as productUrl } from './routes_BEIx0N0R.mjs';
import { b as buildBreadcrumbSchema, d as buildArticleSchema, a as buildItemListSchema, c as buildFaqSchema, e as buildProductSchema } from './schema_BGDs2hqD.mjs';

const $$Astro = createAstro("https://www.top10maison.com");
function getStaticPaths() {
  const { toplists } = dataIndex;
  return toplists.map((list) => ({
    params: {
      category: list.category,
      subcategory: list.subcategory,
      n: String(list.count),
      slug: list.keywordSlug
    }
  }));
}
const $$Topnslug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Topnslug;
  const { category, subcategory, n, slug } = Astro2.params;
  const toplist = getTopListData(category, subcategory, n, slug);
  const bestToplist = toplist.childsubcategory ? getBestToplistForChild(category, subcategory, toplist.childsubcategory.slug) : null;
  const isBestOverall = Boolean(bestToplist && bestToplist.slug === toplist.list.slug);
  const bestOverallUrl = toplist.childsubcategory ? childSubcategoryUrl(category, subcategory, toplist.childsubcategory.slug) : null;
  const site = requireSite(Astro2.site);
  const canonical = buildCanonical(site, subcategoryToplistUrl(category, subcategory, Number(n), slug));
  const ogImage = toplist.list.image ?? toplist.category.image ?? "/og-image.jpg";
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: toplist.category.name, path: categoryUrl(toplist.category.slug) },
    { name: toplist.subcategory.name, path: subcategoryUrl(toplist.category.slug, toplist.subcategory.slug) },
    { name: toplist.title, path: subcategoryToplistUrl(category, subcategory, Number(n), slug) }
  ];
  const breadcrumbLinks = [
    { name: "Home", href: "/" },
    { name: toplist.category.name, href: categoryUrl(toplist.category.slug) },
    { name: toplist.subcategory.name, href: subcategoryUrl(toplist.category.slug, toplist.subcategory.slug) },
    { name: toplist.title, href: subcategoryToplistUrl(category, subcategory, Number(n), slug) }
  ];
  const verdict = toplist.childsubcategory ? `Best for shoppers comparing ${toplist.childsubcategory.name.toLowerCase()} with a focus on real-world performance.` : `Best for shoppers comparing ${toplist.subcategory.name.toLowerCase()} with a focus on real-world performance.`;
  const schema = [
    buildBreadcrumbSchema(site, breadcrumbItems),
    buildArticleSchema(site, toplist.list, canonical),
    buildItemListSchema(
      toplist.products.map((product) => ({
        name: product.name,
        url: new URL(productUrl(product.slug), site).toString()
      }))
    ),
    buildFaqSchema(toplist.faq),
    ...toplist.products.map((product) => buildProductSchema(site, product))
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$BaseLayout, { "title": toplist.list.metaTitle || toplist.title, "description": toplist.list.metaDescription || toplist.description, "canonical": canonical, "schema": schema, "ogImage": ogImage, "metaRefresh": isBestOverall && bestOverallUrl ? `0; url=${bestOverallUrl}` : void 0 }, { "default": ($$result2) => renderTemplate`${isBestOverall && bestOverallUrl ? renderTemplate`${maybeRenderHead()}<section class="section"> <div class="page-container text-center"> <h1 class="text-2xl font-semibold">This guide is now part of the main category page</h1> <p class="mt-3 text-sm text-ink/70">We moved the best overall list into the category page for faster browsing.</p> <a class="btn mt-6"${addAttribute(bestOverallUrl, "href")}>View the main list</a> </div> </section>` : null}<section class="section"> <div class="page-container"> ${renderComponent($$result2, "Breadcrumbs", $$Breadcrumbs, { "items": breadcrumbLinks })} </div> </section> <section class="section"> <div class="page-container"> <h1 class="text-3xl font-semibold">${toplist.title}</h1> ${toplist.intro ? renderTemplate`<p class="mt-3 text-lg text-ink/70">${toplist.intro}</p>` : null} </div> </section> ${toplist.list.articleHtml ? renderTemplate`<section class="section"> <div class="page-container"> <div class="article-content">${unescapeHTML(toplist.list.articleHtml)}</div> </div> </section>` : null}<section class="section"> <div class="page-container"> <h2 class="text-2xl font-semibold">Verdict</h2> <p class="mt-3 text-sm text-ink/70">${verdict}</p> </div> </section> ${renderComponent($$result2, "ProductGridSection", $$ProductGridSection, { "title": "Top Picks", "products": toplist.products, "schema": true })} ${toplist.selectionCriteria.length ? renderTemplate`${renderComponent($$result2, "BulletListSection", $$BulletListSection, { "title": "How We Picked", "items": toplist.selectionCriteria })}` : null}${toplist.faq?.length ? renderTemplate`${renderComponent($$result2, "FAQAccordion", $$FAQAccordion, { "items": toplist.faq })}` : null}` })}`;
}, "/workspaces/Top11Maison/src/pages/category/[category]/[subcategory]/top-[n]-[slug].astro", void 0);

const $$file = "/workspaces/Top11Maison/src/pages/category/[category]/[subcategory]/top-[n]-[slug].astro";
const $$url = "/category/[category]/[subcategory]/top-[n]-[slug]/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Topnslug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _ };
