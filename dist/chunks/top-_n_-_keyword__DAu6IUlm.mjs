/* empty css                         */
import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, e as addAttribute } from './astro/server_W2JWWxAV.mjs';
import 'kleur/colors';
import { r as requireSite, b as buildCanonical, $ as $$BaseLayout } from './seo_jMrGLJxf.mjs';
import { b as subcategoryToplistUrl } from './routes_BEIx0N0R.mjs';

const $$Astro = createAstro("https://www.top10maison.com");
function getStaticPaths() {
  const { toplists } = dataIndex;
  return toplists.map((list) => ({
    params: {
      category: list.category,
      subcategory: list.subcategory,
      childsubcategory: list.childsubcategory,
      n: String(list.count),
      keyword: list.keywordSlug
    }
  }));
}
const $$Topnkeyword = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Topnkeyword;
  const { category, subcategory, childsubcategory, n, keyword } = Astro2.params;
  const site = requireSite(Astro2.site);
  const redirectUrl = buildCanonical(site, subcategoryToplistUrl(category, subcategory, Number(n), keyword));
  const description = `This guide now lives at ${redirectUrl}. You are being redirected.`;
  return renderTemplate`${renderComponent($$result, "Layout", $$BaseLayout, { "title": "Guide moved | Top10Maison", "description": description, "canonical": redirectUrl, "metaRefresh": `0; url=${redirectUrl}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section"> <div class="mx-auto w-full max-w-3xl text-center"> <h1 class="text-2xl font-semibold">This guide has moved</h1> <p class="mt-3 text-sm text-ink/70">
We updated our URL structure. You will be redirected automatically.
</p> <a class="btn mt-6"${addAttribute(redirectUrl, "href")}>Continue to the guide</a> <p class="mt-3 text-xs text-ink/60">
Old path: /category/${category}/${subcategory}/${childsubcategory}/top-${n}-${keyword} </p> </div> </section> ` })}`;
}, "/workspaces/Top11Maison/src/pages/category/[category]/[subcategory]/[childsubcategory]/top-[n]-[keyword].astro", void 0);

const $$file = "/workspaces/Top11Maison/src/pages/category/[category]/[subcategory]/[childsubcategory]/top-[n]-[keyword].astro";
const $$url = "/category/[category]/[subcategory]/[childsubcategory]/top-[n]-[keyword]/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Topnkeyword,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _ };
