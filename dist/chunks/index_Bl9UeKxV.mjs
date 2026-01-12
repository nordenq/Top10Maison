/* empty css                         */
import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, e as addAttribute } from './astro/server_W2JWWxAV.mjs';
import 'kleur/colors';
import { r as requireSite, b as buildCanonical, $ as $$BaseLayout } from './seo_jMrGLJxf.mjs';
import { $ as $$Breadcrumbs, a as $$FAQAccordion } from './FAQAccordion_De33NIdW.mjs';
import { $ as $$CategoryCard } from './CategoryCard_DAhL6H1i.mjs';
import { $ as $$ProductGridSection, a as $$BulletListSection } from './BulletListSection_CM41IYvO.mjs';
import { d as getCategoryData, c as categoryUrl, s as subcategoryUrl, a as childSubcategoryUrl, e as getBestToplistForChild, g as getDataIndex, b as subcategoryToplistUrl, p as productUrl } from './routes_BEIx0N0R.mjs';
import { b as buildBreadcrumbSchema, a as buildItemListSchema, c as buildFaqSchema } from './schema_BGDs2hqD.mjs';

const $$Astro = createAstro("https://www.top10maison.com");
function getStaticPaths() {
  const { categories } = dataIndex;
  const paths = [];
  for (const category of categories) {
    paths.push({ params: { slugs: category.slug } });
    for (const subcategory of category.subcategories) {
      paths.push({ params: { slugs: `${category.slug}/${subcategory.slug}` } });
      for (const child of subcategory.subcategories) {
        paths.push({ params: { slugs: `${category.slug}/${subcategory.slug}/${child.slug}` } });
      }
    }
  }
  return paths;
}
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const dataIndex2 = getDataIndex();
  const { slugs } = Astro2.params;
  const categorySlug = Array.isArray(slugs) ? slugs.join("/") : slugs;
  const data = getCategoryData(slugs);
  const site = requireSite(Astro2.site);
  const basePath = `/category/${categorySlug}/`;
  const canonical = buildCanonical(site, basePath);
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: data.category.name, path: categoryUrl(data.category.slug) }
  ];
  if (data.subcategory) {
    breadcrumbItems.push({
      name: data.subcategory.name,
      path: subcategoryUrl(data.category.slug, data.subcategory.slug)
    });
  }
  if (data.childsubcategory) {
    breadcrumbItems.push({
      name: data.childsubcategory.name,
      path: childSubcategoryUrl(data.category.slug, data.subcategory.slug, data.childsubcategory.slug)
    });
  }
  const bestToplist = data.childsubcategory ? getBestToplistForChild(data.category.slug, data.subcategory.slug, data.childsubcategory.slug) : null;
  const schema = [buildBreadcrumbSchema(site, breadcrumbItems)];
  const breadcrumbLinks = breadcrumbItems.map((item) => ({ name: item.name, href: item.path }));
  const bestToplistTitle = bestToplist?.metaTitle ?? bestToplist?.title;
  const bestToplistDescription = bestToplist?.metaDescription;
  const bestToplistIntro = data.childsubcategory?.intentCopy ?? bestToplistDescription;
  const title = data.childsubcategory && bestToplistTitle ? bestToplistTitle : data.childsubcategory?.name ?? data.subcategory?.name ?? data.category.name;
  const description = data.childsubcategory && bestToplistDescription ? bestToplistDescription : data.childsubcategory?.description ?? data.subcategory?.description ?? data.category.description;
  const showSubcategories = !data.subcategory;
  const showChildSubcategories = Boolean(data.subcategory && !data.childsubcategory);
  const bestToplistProducts = bestToplist ? bestToplist.products.map((productSlug) => dataIndex2.productMap.get(productSlug)).filter((item) => Boolean(item)) : [];
  const toplists = data.toplists.map((list) => ({
    title: list.title,
    description: list.metaDescription,
    url: subcategoryToplistUrl(list.category, list.subcategory, list.count, list.keywordSlug)
  }));
  const otherToplists = bestToplist ? toplists.filter((list) => list.title !== bestToplist.title) : toplists;
  const absoluteUrl = new URL(basePath, site).toString();
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, site).toString()
    }))
  };
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: absoluteUrl,
    breadcrumb: breadcrumbSchema
  };
  if (bestToplistProducts.length) {
    schema.push(
      buildItemListSchema(
        bestToplistProducts.map((product) => ({
          name: product.name,
          url: new URL(productUrl(product.slug), site).toString()
        }))
      )
    );
  }
  if (bestToplist?.faq?.length) {
    schema.push(buildFaqSchema(bestToplist.faq));
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$BaseLayout, { "title": title, "description": description, "canonical": canonical, "schema": [...schema, collectionSchema] }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section"> <div class="page-container"> ${renderComponent($$result2, "Breadcrumbs", $$Breadcrumbs, { "items": breadcrumbLinks })} <h1 class="mt-4 text-3xl font-semibold"> ${data.childsubcategory && bestToplist?.h1 ? bestToplist.h1 : title} </h1> <p class="mt-3 text-lg text-ink/70">${description}</p> </div> </section> ${showChildSubcategories ? renderTemplate`<section class="section"> <div class="page-container"> <h2 class="text-2xl font-semibold">How to choose</h2> <p class="mt-3 text-sm text-ink/70">
A quick checklist before you dive into the subcategories below.
</p> <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"> <div class="card p-5"> <h3 class="text-lg font-semibold">Fit and capacity</h3> <p class="mt-2 text-sm text-ink/70">
Match size to your kitchen space and your household. Bigger is not always better.
</p> </div> <div class="card p-5"> <h3 class="text-lg font-semibold">Ease of use</h3> <p class="mt-2 text-sm text-ink/70">
Look for controls and cleanup that feel simple day to day.
</p> </div> <div class="card p-5"> <h3 class="text-lg font-semibold">Performance basics</h3> <p class="mt-2 text-sm text-ink/70">
Focus on consistent results, not just extra modes.
</p> </div> <div class="card p-5"> <h3 class="text-lg font-semibold">Budget vs value</h3> <p class="mt-2 text-sm text-ink/70">
Decide what matters most, then spend where it counts.
</p> </div> </div> </div> </section>` : null}${showSubcategories ? renderTemplate`<section class="section"> <div class="page-container"> <h2 class="text-2xl font-semibold">Subcategories</h2> <div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"> ${data.category.subcategories.map((subcategory) => renderTemplate`${renderComponent($$result2, "CategoryCard", $$CategoryCard, { "category": data.category, "subcategory": subcategory })}`)} </div> </div> </section>` : null}${showChildSubcategories ? renderTemplate`<section class="section"> <div class="page-container"> <h2 class="text-2xl font-semibold">Subcategories</h2> <div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"> ${data.subcategory.subcategories.map((childsubcategory) => renderTemplate`${renderComponent($$result2, "CategoryCard", $$CategoryCard, { "category": data.category, "parentSubcategory": data.subcategory, "childsubcategory": childsubcategory })}`)} </div> </div> </section>` : null}${bestToplist ? renderTemplate`${renderComponent($$result2, "ProductGridSection", $$ProductGridSection, { "title": `Best overall ${data.childsubcategory.name}`, "intro": bestToplistIntro, "products": bestToplistProducts, "schema": true })}` : null}${bestToplist?.howWePicked?.length ? renderTemplate`${renderComponent($$result2, "BulletListSection", $$BulletListSection, { "title": "How We Picked", "items": bestToplist.howWePicked })}` : null}${bestToplist?.faq?.length ? renderTemplate`${renderComponent($$result2, "FAQAccordion", $$FAQAccordion, { "items": bestToplist.faq })}` : null}${otherToplists.length ? renderTemplate`<section class="section"> <div class="page-container"> <h2 class="text-2xl font-semibold">Top Lists in ${title}</h2> <div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"> ${otherToplists.map((list) => renderTemplate`<a${addAttribute(list.url, "href")} class="card card-hover p-5"> <h3 class="text-xl font-semibold">${list.title}</h3> <p class="mt-2 text-sm text-ink/70">${list.description}</p> </a>`)} </div> </div> </section>` : null}` })}`;
}, "/workspaces/Top11Maison/src/pages/category/[...slugs]/index.astro", void 0);

const $$file = "/workspaces/Top11Maison/src/pages/category/[...slugs]/index.astro";
const $$url = "/category/[...slugs]/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _ };
