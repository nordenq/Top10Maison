/* empty css                         */
import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from './astro/server_W2JWWxAV.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from './seo_jMrGLJxf.mjs';
import { b as buildBreadcrumbSchema } from './schema_BGDs2hqD.mjs';
import { g as getPageMeta } from './meta_CZwI4wq9.mjs';

const $$Astro = createAstro("https://www.top10maison.com");
const $$Terms = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Terms;
  const { site, title, description, canonical } = getPageMeta(Astro2.site, {
    title: "Terms of Service",
    description: "Terms of service for Top10Maison.",
    path: "/terms/"
  });
  const schema = [
    buildBreadcrumbSchema(site, [
      { name: "Home", path: "/" },
      { name: "Terms of Service", path: "/terms/" }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Terms of Service",
      url: canonical
    }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description, "canonical": canonical, "schema": schema }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section"> <div class="page-container space-y-6"> <h1 class="text-3xl font-semibold">Terms of Service</h1> <p class="text-sm text-ink/70">
By using Top10Maison.com, you agree to the following terms.
</p> <div class="card p-6"> <h2 class="text-xl font-semibold">Use of content</h2> <p class="mt-2 text-sm text-ink/70">
All content is provided for informational purposes only and may change at any time.
</p> </div> <div class="card p-6"> <h2 class="text-xl font-semibold">No warranties</h2> <p class="mt-2 text-sm text-ink/70">
We make no warranties regarding accuracy, completeness, or suitability of the information provided.
</p> </div> <div class="card p-6"> <h2 class="text-xl font-semibold">Third-party links</h2> <p class="mt-2 text-sm text-ink/70">
We are not responsible for third-party sites linked from this site.
</p> </div> <div class="card p-6"> <h2 class="text-xl font-semibold">Limitation of liability</h2> <p class="mt-2 text-sm text-ink/70">
Top10Maison is not liable for any direct or indirect damages resulting from site usage.
</p> </div> <div class="card p-6"> <h2 class="text-xl font-semibold">Contact</h2> <p class="mt-2 text-sm text-ink/70">
For legal questions, email <a href="mailto:contact@top10maison.com">contact@top10maison.com</a>.
</p> </div> </div> </section> ` })}`;
}, "/workspaces/Top11Maison/src/pages/terms.astro", void 0);

const $$file = "/workspaces/Top11Maison/src/pages/terms.astro";
const $$url = "/terms/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Terms,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _ };
