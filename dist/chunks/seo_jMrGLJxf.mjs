import { c as createAstro, a as createComponent, m as maybeRenderHead, e as addAttribute, b as renderTemplate, r as renderComponent, u as unescapeHTML, f as renderSlot, g as renderHead } from './astro/server_W2JWWxAV.mjs';
import 'kleur/colors';
/* empty css                         */
import { g as getDataIndex, i as homeUrl } from './routes_BEIx0N0R.mjs';
import 'clsx';

const $$Astro$2 = createAstro("https://www.top10maison.com");
const $$CategoryNav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$CategoryNav;
  const {
    categories,
    className = "",
    itemClassName = ""
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<nav${addAttribute(`flex gap-3 overflow-x-auto ${className}`, "class")} aria-label="Categories"> ${categories.map((category) => renderTemplate`<a${addAttribute(`whitespace-nowrap rounded-full border border-border px-4 py-1 text-ink/70 transition-colors hover:border-accent hover:text-accent hover:bg-accent-soft ${itemClassName}`, "class")}${addAttribute(`/category/${category.slug}/`, "href")}> ${category.name} </a>`)} </nav>`;
}, "/workspaces/Top11Maison/src/components/CategoryNav.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  const { categories } = getDataIndex();
  return renderTemplate`${maybeRenderHead()}<header id="site-header" class="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur"> <div class="page-container flex w-full items-center justify-between py-4"> <a class="rounded-md px-2 py-2 text-xl font-semibold tracking-tight font-serif text-ink"${addAttribute(homeUrl(), "href")}>Top10Maison</a> <nav class="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Primary"> <a class="nav-link"${addAttribute(homeUrl(), "href")}>Home</a> <a class="nav-link" href="/#top-categories">Categories</a> <a class="nav-link" href="/about/">About</a> <a class="nav-link" href="/contact/">Contact</a> </nav> <button id="mobile-menu-button" class="md:hidden rounded-xl border border-border px-3 py-2 text-sm font-medium" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Toggle menu">
Menu
</button> </div> <div class="hidden border-t border-border bg-surface md:block"> <div class="page-container py-3"> ${renderComponent($$result, "CategoryNav", $$CategoryNav, { "categories": categories })} </div> </div> <div id="mobile-menu" class="hidden border-t border-border bg-surface md:hidden"> <nav class="space-y-4 px-6 py-4 text-sm" aria-label="Mobile"> <a class="block font-medium text-ink/80 hover:text-accent"${addAttribute(homeUrl(), "href")}>Home</a> <a class="block font-medium text-ink/80 hover:text-accent" href="/about/">About</a> <a class="block font-medium text-ink/80 hover:text-accent" href="/contact/">Contact</a> <details class="rounded-xl border border-border p-3"> <summary class="cursor-pointer font-semibold">Categories</summary> <div class="mt-3 grid gap-2"> ${categories.map((category) => renderTemplate`<a class="rounded-lg bg-background px-3 py-2"${addAttribute(`/category/${category.slug}/`, "href")}> ${category.name} </a>`)} </div> </details> </nav> </div> </header>`;
}, "/workspaces/Top11Maison/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="border-t border-border bg-surface"> <div class="page-container grid gap-8 py-10 md:grid-cols-3"> <div> <p class="text-lg font-semibold font-serif">Top10Maison</p> <p class="mt-2 text-sm text-ink/80">
Curated rankings and clear buying guides for the home.
</p> </div> <div> <p class="text-sm font-semibold text-ink">Sitemap</p> <div class="mt-3 grid gap-2 text-sm text-ink/80"> <a href="/">Home</a> <a href="/#top-categories">Categories</a> <a href="/about/">About</a> <a href="/contact/">Contact</a> <a href="/privacy-policy/">Privacy Policy</a> <a href="/terms/">Terms of Service</a> <a href="/sitemap.xml">Sitemap.xml</a> </div> </div> <div> <p class="text-sm font-semibold text-ink">Contact</p> <a class="mt-3 text-sm text-ink/80" href="mailto:contact@top10maison.com">contact@top10maison.com</a> <p class="mt-4 text-xs text-ink/70">
Affiliate disclosure: We may earn commissions from qualifying purchases.
</p> <div class="mt-4 flex gap-3 text-xs text-ink/50"> <span aria-hidden="true">●</span> <span aria-hidden="true">●</span> <span aria-hidden="true">●</span> </div> </div> </div> <div class="border-t border-border py-4 text-center text-xs text-ink/70">
© ${(/* @__PURE__ */ new Date()).getFullYear()} Top10Maison. All rights reserved.
</div> </footer>`;
}, "/workspaces/Top11Maison/src/components/Footer.astro", void 0);

const CSP_NONCE = "c3RhdGljLW5vbmNlLXYx";

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Astro$1 = createAstro("https://www.top10maison.com");
const $$SEO = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SEO;
  const {
    title,
    description,
    canonical,
    schema = [],
    ogImage
  } = Astro2.props;
  const resolvedOgImage = ogImage ? new URL(ogImage, canonical).toString() : null;
  const siteUrl = new URL("/", canonical).toString();
  const logoUrl = new URL("/logo.svg", canonical).toString();
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Top10Maison",
    url: siteUrl,
    logo: logoUrl,
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@top10maison.com",
      contactType: "Customer Support"
    }
  };
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Top10Maison",
    url: siteUrl
  };
  const mergedSchema = [organizationSchema, websiteSchema, ...schema];
  return renderTemplate`<title>${title}</title><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonical, "href")}><meta name="robots" content="index,follow"><meta property="og:type" content="website"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonical, "content")}>${resolvedOgImage ? renderTemplate`<meta property="og:image"${addAttribute(resolvedOgImage, "content")}>` : null}<meta name="twitter:card"${addAttribute(resolvedOgImage ? "summary_large_image" : "summary", "content")}><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}>${resolvedOgImage ? renderTemplate`<meta name="twitter:image"${addAttribute(resolvedOgImage, "content")}>` : null}${mergedSchema.map((entry) => renderTemplate(_a$1 || (_a$1 = __template$1(['<script type="application/ld+json"', ">", "<\/script>"])), addAttribute(CSP_NONCE, "nonce"), unescapeHTML(JSON.stringify(entry))))}`;
}, "/workspaces/Top11Maison/src/components/SEO.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.top10maison.com");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title,
    description,
    canonical,
    schema = [],
    ogImage,
    metaRefresh
  } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">', '<meta name="theme-color" content="#F8FBF9"><link rel="preconnect" href="https://pub-d2291ee7d44d475387fd51f65cd369f0.r2.dev" crossorigin><link rel="dns-prefetch" href="https://pub-d2291ee7d44d475387fd51f65cd369f0.r2.dev"><link rel="preload" as="font" type="font/woff2" href="/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2" crossorigin>', '<meta name="google-adsense-account" content="ca-pub-3680083929895808"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="sitemap" type="application/xml" href="/sitemap.xml"><link rel="robots" href="/robots.txt">', '</head> <body class="min-h-screen flex flex-col"> <a class="skip-link" href="#site-header">Skip to navigation</a> <a class="skip-link" href="#main-content">Skip to content</a> ', ' <main id="main-content" class="flex-1"> ', " </main> ", ' <script src="/scripts/site.js" defer><\/script> </body> </html>'])), metaRefresh ? renderTemplate`<meta http-equiv="refresh"${addAttribute(metaRefresh, "content")}>` : null, renderComponent($$result, "SEO", $$SEO, { "title": title, "description": description, "canonical": canonical, "schema": schema, "ogImage": ogImage }), renderHead(), renderComponent($$result, "Header", $$Header, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "/workspaces/Top11Maison/src/layouts/BaseLayout.astro", void 0);

function requireSite(site) {
  if (!site) {
    throw new Error("Astro site is required for canonical URLs. Set `site` in astro.config.mjs.");
  }
  return site;
}
function buildCanonical(site, pathname) {
  return new URL(pathname, site).toString();
}
function buildTitle(pageTitle, brand) {
  if (pageTitle.includes(brand)) {
    return pageTitle;
  }
  return `${pageTitle} | ${brand}`;
}

export { $$BaseLayout as $, CSP_NONCE as C, buildTitle as a, buildCanonical as b, requireSite as r };
