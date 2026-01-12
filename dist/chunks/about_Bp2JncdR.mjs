/* empty css                         */
import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from './astro/server_W2JWWxAV.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from './seo_jMrGLJxf.mjs';
import { g as getPageMeta } from './meta_CZwI4wq9.mjs';

const $$Astro = createAstro("https://www.top10maison.com");
const $$About = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$About;
  const { title, description, canonical } = getPageMeta(Astro2.site, {
    title: "About",
    description: "Curated home buying guides reviewed for clarity and real-world fit.",
    path: "/about/"
  });
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description, "canonical": canonical }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section"> <div class="mx-auto w-full max-w-6xl space-y-6"> <div> <h1 class="text-3xl font-semibold">About Top10Maison</h1> <p class="mt-3 text-sm text-ink/70">
Top10Maison publishes curated buying guides for home categories. Each list is reviewed for clarity,
          consistency, and practical fit for real households.
</p> </div> <div class="card p-6"> <h2 class="text-xl font-semibold">How rankings are chosen</h2> <p class="mt-2 text-sm text-ink/70">
Rankings follow a consistent rubric based on specs, review volume, availability, and value. We do not
          perform hands-on testing; we use consistent criteria to keep comparisons fair and repeatable.
</p> </div> <div class="card p-6"> <h2 class="text-xl font-semibold">Affiliate disclosure</h2> <p class="mt-2 text-sm text-ink/70">
Some links may be affiliate links, which can result in a commission. This does not affect editorial
          judgment, scoring, or placement.
</p> </div> </div> </section> ` })}`;
}, "/workspaces/Top11Maison/src/pages/about.astro", void 0);

const $$file = "/workspaces/Top11Maison/src/pages/about.astro";
const $$url = "/about/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _ };
