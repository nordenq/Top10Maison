import { c as createAstro, a as createComponent, m as maybeRenderHead, e as addAttribute, b as renderTemplate } from './astro/server_W2JWWxAV.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro$1 = createAstro("https://www.top10maison.com");
const $$Breadcrumbs = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Breadcrumbs;
  const { items } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<nav class="text-sm text-ink/60" aria-label="Breadcrumb"> <ol class="flex flex-wrap items-center gap-2"> ${items.map((item, index) => renderTemplate`<li class="flex items-center gap-2"> <a class="hover:text-accent"${addAttribute(item.href, "href")}>${item.name}</a> ${index < items.length - 1 ? renderTemplate`<span aria-hidden="true">/</span>` : null} </li>`)} </ol> </nav>`;
}, "/workspaces/Top11Maison/src/components/Breadcrumbs.astro", void 0);

const $$Astro = createAstro("https://www.top10maison.com");
const $$FAQAccordion = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FAQAccordion;
  const { items, title = "FAQ", id } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="section"${addAttribute(id, "id")}> <div class="page-container"> <h2 class="text-2xl font-semibold">${title}</h2> <div class="mt-4 space-y-3"> ${items.map((item) => renderTemplate`<details class="card card-hover p-4"> <summary class="cursor-pointer text-sm font-semibold">${item.question}</summary> <p class="mt-2 text-sm text-ink/70">${item.answer}</p> </details>`)} </div> </div> </section>`;
}, "/workspaces/Top11Maison/src/components/FAQAccordion.astro", void 0);

export { $$Breadcrumbs as $, $$FAQAccordion as a };
