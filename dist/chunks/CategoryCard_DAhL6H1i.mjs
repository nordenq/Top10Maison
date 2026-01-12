import { c as createAstro, a as createComponent, m as maybeRenderHead, e as addAttribute, b as renderTemplate } from './astro/server_W2JWWxAV.mjs';
import 'kleur/colors';
import 'clsx';
import { a as childSubcategoryUrl, s as subcategoryUrl, c as categoryUrl } from './routes_BEIx0N0R.mjs';

const $$Astro = createAstro("https://www.top10maison.com");
const $$CategoryCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CategoryCard;
  const { category, subcategory, childsubcategory, parentSubcategory, loading = "lazy", fetchpriority } = Astro2.props;
  const href = childsubcategory && parentSubcategory ? childSubcategoryUrl(category.slug, parentSubcategory.slug, childsubcategory.slug) : subcategory ? subcategoryUrl(category.slug, subcategory.slug) : categoryUrl(category.slug);
  const title = childsubcategory?.name ?? subcategory?.name ?? category.name;
  const description = childsubcategory?.description ?? subcategory?.description ?? category.description;
  const image = childsubcategory?.image ?? subcategory?.image ?? category.image ?? "/logo.svg";
  const imageSrcset = childsubcategory?.imageSrcset ?? subcategory?.imageSrcset ?? category.imageSrcset;
  return renderTemplate`${maybeRenderHead()}<a class="card card-hover group flex h-full flex-col overflow-hidden"${addAttribute(href, "href")}> <div class="relative"> <img class="h-44 w-full object-cover"${addAttribute(image, "src")}${addAttribute(title, "alt")}${addAttribute(loading, "loading")}${addAttribute(fetchpriority, "fetchpriority")}${addAttribute(imageSrcset, "srcset")} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 350px" width="640" height="360"> </div> <div class="flex flex-1 flex-col gap-2 p-4"> <div class="flex items-center justify-between"> <h3 class="text-lg font-semibold">${title}</h3> <span class="text-lg text-accent transition group-hover:text-ink">→</span> </div> <p class="text-sm text-ink/70">${description}</p> </div> </a>`;
}, "/workspaces/Top11Maison/src/components/CategoryCard.astro", void 0);

export { $$CategoryCard as $ };
