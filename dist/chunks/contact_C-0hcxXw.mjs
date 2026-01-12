/* empty css                         */
import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from './astro/server_W2JWWxAV.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from './seo_jMrGLJxf.mjs';
import { g as getPageMeta } from './meta_CZwI4wq9.mjs';

const $$Astro = createAstro("https://www.top10maison.com");
const $$Contact = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Contact;
  const { title, description, canonical } = getPageMeta(Astro2.site, {
    title: "Contact",
    description: "Contact Top10Maison for questions, feedback, or privacy requests.",
    path: "/contact/"
  });
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description, "canonical": canonical }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section"> <div class="mx-auto w-full max-w-3xl space-y-6"> <div> <h1 class="text-3xl font-semibold">Contact</h1> <p class="mt-3 text-sm text-ink/70">
Have a question or a correction? Send a message using the form below or reach out by email.
</p> </div> <div class="card p-6"> <form class="grid gap-4" action="#" method="post"> <label class="grid gap-2 text-sm font-semibold">
Name
<input class="rounded-xl border border-border px-3 py-2" type="text" name="name" placeholder="Your name"> </label> <label class="grid gap-2 text-sm font-semibold">
Email
<input class="rounded-xl border border-border px-3 py-2" type="email" name="email" placeholder="you@example.com"> </label> <label class="grid gap-2 text-sm font-semibold">
Message
<textarea class="rounded-xl border border-border px-3 py-2" name="message" rows="6" placeholder="How can we help?"></textarea> </label> <button type="submit" class="btn w-fit">Send message</button> </form> <p class="mt-4 text-sm text-ink/70">
Prefer email? <a href="mailto:contact@top10maison.com">contact@top10maison.com</a> </p> </div> </div> </section> ` })}`;
}, "/workspaces/Top11Maison/src/pages/contact.astro", void 0);

const $$file = "/workspaces/Top11Maison/src/pages/contact.astro";
const $$url = "/contact/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _ };
