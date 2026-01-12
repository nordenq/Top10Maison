/* empty css                         */
import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from './astro/server_W2JWWxAV.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from './seo_jMrGLJxf.mjs';
import { b as buildBreadcrumbSchema } from './schema_BGDs2hqD.mjs';
import { g as getPageMeta } from './meta_CZwI4wq9.mjs';

const $$Astro = createAstro("https://www.top10maison.com");
const $$PrivacyPolicy = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PrivacyPolicy;
  const { site, title, description, canonical } = getPageMeta(Astro2.site, {
    title: "Privacy Policy",
    description: "Privacy policy for Top10Maison.",
    path: "/privacy-policy/"
  });
  const schema = [
    buildBreadcrumbSchema(site, [
      { name: "Home", path: "/" },
      { name: "Privacy Policy", path: "/privacy-policy/" }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Privacy Policy",
      url: canonical
    }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description, "canonical": canonical, "schema": schema }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section"> <div class="page-container space-y-6"> <h1 class="text-3xl font-semibold">Privacy Policy</h1> <p class="text-sm text-ink/70">
This policy explains what information is collected, how it is used, and your choices for managing data.
</p> <div class="card p-6"> <h2 class="text-xl font-semibold">Information we collect</h2> <ul class="mt-3 list-disc space-y-2 pl-6 text-sm text-ink/70"> <li>Device and browser data (e.g., IP address, browser type, pages visited).</li> <li>Usage data such as time on page, referring URLs, and click behavior.</li> </ul> </div> <div class="card p-6"> <h2 class="text-xl font-semibold">Cookies</h2> <p class="mt-2 text-sm text-ink/70">
Cookies and similar technologies are used to measure site traffic, improve performance, and personalize
          content and ads. You can disable cookies in your browser settings.
</p> </div> <div class="card p-6"> <h2 class="text-xl font-semibold">Advertising partners</h2> <p class="mt-2 text-sm text-ink/70">
Ads may be served by third-party networks, including Google AdSense. These partners may use cookies or
          web beacons to deliver personalized ads and measure effectiveness.
</p> </div> <div class="card p-6"> <h2 class="text-xl font-semibold">Contact</h2> <p class="mt-2 text-sm text-ink/70">
For privacy questions, email <a href="mailto:contact@top10maison.com">contact@top10maison.com</a>.
</p> </div> </div> </section> ` })}`;
}, "/workspaces/Top11Maison/src/pages/privacy-policy.astro", void 0);

const $$file = "/workspaces/Top11Maison/src/pages/privacy-policy.astro";
const $$url = "/privacy-policy/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PrivacyPolicy,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _ };
