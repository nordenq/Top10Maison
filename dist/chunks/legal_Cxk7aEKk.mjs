/* empty css                         */
import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from './astro/server_W2JWWxAV.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from './seo_jMrGLJxf.mjs';
import { g as getPageMeta } from './meta_CZwI4wq9.mjs';

const $$Astro = createAstro("https://www.top10maison.com");
const $$Legal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Legal;
  const { title, description, canonical } = getPageMeta(Astro2.site, {
    title: "Legal & Privacy",
    description: "Privacy policy and terms of service for Top10Maison.",
    path: "/legal/"
  });
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description, "canonical": canonical }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section"> <div class="mx-auto w-full max-w-6xl space-y-6"> <div> <h1 class="text-3xl font-semibold">Legal & Privacy</h1> <p class="mt-2 text-sm text-ink/70">Effective Date: 2026-01-09</p> <p class="mt-3 text-sm text-ink/70">
This page combines our privacy policy and terms of service. It explains what information is collected,
          how it is used, and the terms that apply when using Top10Maison.
</p> </div> <div class="card p-6"> <h2 class="text-xl font-semibold">Privacy Policy</h2> <p class="mt-2 text-sm text-ink/70">We may collect certain non-personal data when you visit our site, including:</p> <ul class="mt-3 list-disc space-y-2 pl-6 text-sm text-ink/70"> <li>Device and browser information (e.g., IP address, browser type, pages visited).</li> <li>Usage data such as time on page, referring URLs, and click behavior.</li> </ul> <p class="mt-3 text-sm text-ink/70">
Cookies and similar technologies are used to measure site traffic and performance, and to personalize
          content and ads. You can control or disable cookies through your browser settings.
</p> <p class="mt-3 text-sm text-ink/70">
Ads may be served by third-party networks, including Google AdSense. These networks may use cookies or
          web beacons to deliver personalized ads and measure effectiveness.
</p> <p class="mt-3 text-sm text-ink/70">
Learn more about how Google uses data at
<a href="https://policies.google.com/technologies/partner-sites">policies.google.com</a>.
</p> </div> <div class="card p-6"> <h2 class="text-xl font-semibold">Affiliate Disclosure</h2> <p class="mt-2 text-sm text-ink/70">
Some links are affiliate links. If a purchase is made, Top10Maison may earn a commission at no
          additional cost. This does not affect rankings or editorial opinions.
</p> </div> <div class="card p-6"> <h2 class="text-xl font-semibold">Terms of Service</h2> <p class="mt-2 text-sm text-ink/70">By using Top10Maison.com, you agree to the following terms:</p> <ul class="mt-3 list-disc space-y-2 pl-6 text-sm text-ink/70"> <li>All content is for informational purposes only and may change at any time.</li> <li>We make no warranties regarding accuracy or completeness.</li> <li>We are not responsible for third-party sites linked from this site.</li> <li>Top10Maison is not liable for any direct or indirect damages resulting from site usage.</li> </ul> </div> <div class="card p-6"> <h2 class="text-xl font-semibold">Contact</h2> <p class="mt-2 text-sm text-ink/70">
For privacy or legal requests, contact
<a href="mailto:contact@top10maison.com">contact@top10maison.com</a>.
</p> </div> </div> </section> ` })}`;
}, "/workspaces/Top11Maison/src/pages/legal.astro", void 0);

const $$file = "/workspaces/Top11Maison/src/pages/legal.astro";
const $$url = "/legal/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Legal,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _ };
