Implementation Plan and Codex Prompts for Top10Maison Improvements

This document provides a comprehensive plan for improving the Top10Maison project before integrating the Amazon Product Advertising API. For each recommendation from the technical and SEO audit, you will find:

Action steps – what needs to be done and why.

Codex prompt – a ready‑to‑copy instruction for GPT‑5.1 Codex within your GitHub Codespace. These prompts reference specific files and use clear verbs (create, update, remove) so Codex knows exactly what to edit.

The plan is divided into thematic sections. Follow the order below to address foundational issues before layering in new features.

1 Create a custom 404 page

Actions:

Add a new src/pages/404.astro file that renders a friendly “page not found” message, offers links back to the home page and popular categories, and includes SEO meta tags. Provide a BaseLayout wrapper, a unique <h1> heading, and relevant content.

Ensure this page is picked up by the build: Astro automatically serves 404.astro for unknown routes, so no routing changes are necessary.

Update the sitemap generation if necessary to include the 404 page with low priority.

Codex prompt:

Create a file `src/pages/404.astro` with the following content:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import SEO from '@/components/SEO.astro';

const title = 'Page Not Found | Top10Maison';
const description = 'Sorry, we couldn’t find the page you were looking for. Browse our categories or return to the home page.';
---

<BaseLayout>
  <SEO title={title} description={description} noindex={true} />
  <section class="section text-center">
    <h1 class="text-3xl font-bold mb-4">Page not found</h1>
    <p class="mb-6">We’re sorry, but the page you requested does not exist. You can return to the <a href="/" class="text-accent underline">home page</a> or explore our <a href="/categories" class="text-accent underline">categories</a>.</p>
    <a href="/" class="btn btn-primary">Back to Home</a>
  </section>
</BaseLayout>


This new page uses the existing layout and SEO component and provides helpful links. Save the file.


## 2 Consolidate legal pages

**Actions:**

1. Decide on a single canonical approach: either keep separate `privacy‑policy` and `terms` pages or keep the combined `legal.astro` page.  To avoid duplicate content, this plan removes the combined page and keeps the two separate pages.
2. Delete `src/pages/legal.astro` entirely to eliminate duplication.
3. Ensure the footer links point to `/privacy-policy` and `/terms` (it currently does:contentReference[oaicite:0]{index=0}, so no change may be needed).
4. If there is any external link to `/legal/`, create a redirect page at that path that renders one of the canonical pages and includes a `<link rel="canonical" href="/privacy-policy" />` in the head.

**Codex prompt:**

```md
Delete the file `src/pages/legal.astro` from the project.  Then create a new file `src/pages/legal/index.astro` that redirects to the privacy policy page and sets a canonical link:

```astro
---
import { Redirect } from 'astro/components';
---

<Redirect href="/privacy-policy"/>
<!-- If older links point to /legal/, this redirect will send users to the privacy policy. -->


Ensure the footer still links to /privacy-policy/ and /terms/. Do not modify Footer.astro if those links already exist.


## 3 Enhance meta tags and OpenGraph images

**Actions:**

1. Update the `getPageMeta` calls on top‑list index pages and category index pages to include descriptive keywords and the current year.  For example, instead of “Top Lists”, set a title like “Top Lists – Home Appliances and Gadgets Rankings 2026”.  Write more informative descriptions that mention the categories covered.
2. Pass a hero image or representative photo through the `SEO` component via an `ogImage` property.  For each category page and top‑list page, choose the hero image used in the hero section.
3. Add `og:type` (e.g., `article` for top lists) if not automatically provided.

**Codex prompt:**

```md
Open `src/pages/toplists/index.astro` and update the meta data.  Replace the existing title and description variables with:

```astro
const title = 'Top Lists – Home Appliances & Gadgets Rankings 2026 | Top10Maison';
const description = 'Explore our curated rankings of the best home appliances and gadgets. Compare top products in each category and find the perfect fit for your home in 2026.';
const ogImage = '/images/toplists/hero.webp';


Then pass ogImage={ogImage} into the <SEO> component. Repeat a similar pattern for category index pages (src/pages/categories/index.astro) and specific top‑list pages by adding a relevant hero image and improved meta titles/descriptions.


## 4 Improve internal linking and navigation

**Actions:**

1. Create dedicated pages listing all top lists per category (e.g., `/toplists/<category>.astro`), making it easier for users and search engines to discover all lists.  Each page should list the top lists, show their titles, thumbnails and descriptions, and link to the full article.
2. Add breadcrumbs to all pages, especially category and top‑list pages, to reinforce hierarchy.  Ensure breadcrumbs always begin with “Home” and follow the path (Home → Category → List → Product) using the existing `buildBreadcrumbSchema` utility.
3. Add cross‑links: from product pages link back to their top list and category pages; from category pages link to related lists and subcategories.

**Codex prompt:**

```md
Create a new file `src/pages/toplists/[category].astro` that accepts a dynamic `[category]` parameter.  Use the existing data functions (`getAllTopLists()` and `getTopListsByCategory(category)`) to fetch all top lists for the given category.  Render them as cards with images and descriptions.  Example skeleton:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import SEO from '@/components/SEO.astro';
import { getTopListsByCategory } from '@/utils/data';

const { category } = Astro.params;
const lists = await getTopListsByCategory(category);

const title = `${category} Top Lists 2026 | Top10Maison`;
const description = `Browse our curated rankings for ${category} products and discover the best choices for your home.`;
---

<BaseLayout>
  <SEO title={title} description={description} />
  <section class="section">
    <h1 class="text-3xl font-bold mb-4">{category} Top Lists</h1>
    <ul class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {lists.map((list) => (
        <li class="card p-4" key={list.slug}>
          <a href={`/toplist/${list.slug}`} class="block">
            <img src={list.heroImage} alt={list.title} class="mb-3 rounded" />
            <h2 class="text-xl font-semibold mb-2">{list.title}</h2>
            <p class="text-sm text-ink">{list.description}</p>
          </a>
        </li>
      ))}
    </ul>
  </section>
</BaseLayout>


Implement breadcrumbs on this page using your existing breadcrumb component. Update category pages to link to these new top‑list pages.


## 5 Optimise images using Astro’s image component

**Actions:**

1. Install the `@astrojs/image` integration and configure it in `astro.config.mjs`.  This plugin allows you to generate responsive images with AVIF/WebP fallbacks and automatically sets `width`/`height` to avoid CLS.
2. Replace `<img>` tags in key templates (hero sections, product cards, top‑list cards) with `<Image src={…} alt={…} widths={…} sizes={…} loading={…} />`.  Use `format="avif,webp"` and appropriate `aspectRatio`.
3. Remove manual `fetchpriority` attributes as the image component optimises loading order automatically.

**Codex prompt:**

```md
Install the `@astrojs/image` integration by adding it to `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import image from '@astrojs/image';

export default defineConfig({
  integrations: [tailwind(), image({ serviceEntryPoint: '@astrojs/image/sharp' })],
  site: 'https://www.top10maison.com',
  trailingSlash: 'always'
});


Then replace the <img> tag in src/components/TopListCard.astro with the Astro image component:

<Image src={list.heroImage} alt={list.title} widths={[480, 768, 1024]} sizes="(max-width: 768px) 100vw, 33vw" format="avif,webp" class="rounded" />


Repeat this replacement wherever hero images or product thumbnails are rendered. Remove manual loading="lazy" attributes when using <Image>, as Astro handles lazy loading automatically.


## 6 Upgrade performance tooling

**Actions:**

1. Replace the custom `scripts/inline-critical.js` postbuild script with the official `@astrojs/critters` integration.  This integration automatically inlines above‑the‑fold CSS without external code and respects dynamic routes.
2. Remove `scripts/inline-critical.js` and its invocation from `package.json`.
3. Add the `critters` integration to `astro.config.mjs`.

**Codex prompt:**

```md
Install the `@astrojs/critters` integration and remove the custom inline critical script:

1. Run `npm install @astrojs/critters` (note for Codex: this is done outside of the code but should be mentioned).  
2. Open `astro.config.mjs` and import the integration:

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import critters from '@astrojs/critters';

export default defineConfig({
  integrations: [tailwind(), critters()],
  site: 'https://www.top10maison.com',
  trailingSlash: 'always'
});


Delete scripts/inline-critical.js and remove the corresponding postbuild step from package.json.


## 7 Accessibility fixes

**Actions:**

1. **Contact form** – Edit `src/pages/contact.astro` so that each `<label>` has a `for` attribute referencing the `id` of its corresponding input.  Mark required fields using `aria-required` and add accessible error messages.
2. **Decorative icons and separators** – Add `aria-hidden="true"` to decorative spans or icons in the footer, header and other components:contentReference[oaicite:1]{index=1}.  Where icons convey meaning (e.g., ranking badges), provide a hidden label or include text in the DOM for screen readers.
3. **Mobile menu toggle** – In `public/scripts/site.js`, ensure that clicking the hamburger button toggles the `aria-expanded` attribute on the mobile nav button and changes its label from “Open menu” to “Close menu”.  This improves keyboard navigation and screen reader feedback.

**Codex prompt:**

```md
1. Open `src/pages/contact.astro` and update the contact form inputs.  For each `<label>`, add a unique `for` attribute (e.g., `for="name"`, `for="email"`, `for="message"`), and assign the corresponding `id` to the `<input>` or `<textarea>`.  Add `required` attributes to mandatory fields and, if possible, display a validation error message below each field.

2. Edit `src/components/Footer.astro` and add `aria-hidden="true"` to decorative bullet separators between links.  For example, change `<span class="mx-2">·</span>` to `<span class="mx-2" aria-hidden="true">·</span>`.

3. Modify `public/scripts/site.js`: locate the function that toggles the mobile menu.  Within the `toggleMobileMenu` function, after toggling the `data-expanded` attribute, also update the `aria-expanded` attribute on the trigger button:

```js
const isOpen = header.dataset.mobileMenu === 'open';
button.setAttribute('aria-expanded', isOpen.toString());
button.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');


## 8 Plan Amazon API integration and caching

**Actions:**

1. Create a new serverless function (e.g., `src/pages/api/amazon-products.ts`) that accepts product identifiers (ASINs) and fetches product details from the Amazon Product Advertising API using environment variables for credentials.  The function should validate input, handle rate limits, cache responses (e.g., using Cloudflare KV or a JSON file), and return sanitized product data (title, image, price, rating).
2. Modify the build or generation scripts to call this API when generating top lists.  Instead of embedding Amazon SDK code in the client, fetch and store product data server‑side during build time, then reference the cached data in Astro pages.  This prevents exposing API keys and ensures pages remain static.
3. Add environment variables (e.g., `AMAZON_PA_API_KEY`, `AMAZON_ASSOCIATE_TAG`) to `.env`.  Never commit secrets to the repository.

**Codex prompt:**

```md
Create a new file `src/pages/api/amazon-products.ts` with an async handler that fetches product data from the Amazon API.  Use environment variables for credentials and implement basic caching.  Example skeleton:

```ts
import { APIRoute } from 'astro';
import { getCachedProduct, setCachedProduct } from '@/utils/amazon-cache';

export const GET: APIRoute = async ({ params, request }) => {
  const asin = new URL(request.url).searchParams.get('asin');
  if (!asin) {
    return new Response(JSON.stringify({ error: 'Missing ASIN' }), { status: 400 });
  }

  // Check cache first
  const cached = await getCachedProduct(asin);
  if (cached) {
    return new Response(JSON.stringify(cached), { status: 200 });
  }

  try {
    const product = await fetchAmazonProduct(asin, {
      accessKey: import.meta.env.AMAZON_PA_ACCESS_KEY,
      secretKey: import.meta.env.AMAZON_PA_SECRET_KEY,
      associateTag: import.meta.env.AMAZON_ASSOCIATE_TAG
    });
    await setCachedProduct(asin, product);
    return new Response(JSON.stringify(product), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch product' }), { status: 500 });
  }
};



You will also need to create src/utils/amazon-cache.ts that provides simple get/set functions (e.g., using a JSON file or an in‑memory Map). After implementing this API route, update the generate-toplists.mjs script to call /api/amazon-products?asin=<ASIN> during the generation process and merge the returned data into your product entries.


## 9 Document SEO and publishing process

**Actions:**

1. Create a `docs/seo-checklist.md` file that summarises the Astro SEO best practices (unique titles/descriptions, OG tags, structured data, internal linking, core web vitals etc.).  Editors should consult this checklist when creating new content.
2. Incorporate this checklist into automated validation by extending `validate-content.mjs` to check for missing fields (e.g., missing `ogImage`) and report them.

**Codex prompt:**

```md
Add a new file `docs/seo-checklist.md` with a bullet‑point checklist for editors.  For example:

```markdown
# SEO publishing checklist

- ✅ **Unique title** (< 60 characters) that includes primary keyword and year
- ✅ **Meta description** (< 155 characters) that summarises the page and encourages clicks
- ✅ **Canonical URL** using `getPageMeta`
- ✅ **OpenGraph & Twitter images** set via `ogImage`
- ✅ **Structured data**: breadcrumbs, product or article schema
- ✅ **Alt text** for all images
- ✅ **Logical headings** (H1–H3) in order
- ✅ **Internal links** to related categories/lists
- ✅ **No thin or AI‑generated content without human review**
- ✅ **Ensure page appears in sitemap**
- ✅ **Test with Lighthouse or PageSpeed Insights** to confirm good Web Vitals (LCP < 2.5 s, CLS < 0.1)


Save the checklist. Optionally, extend validate-content.mjs to warn if ogImage is missing.


## 10 Additional improvements

**Actions:**

1. **Flatten URL structure** – Consider moving top lists under `/toplists/<slug>` rather than deeply nested under `/category/.../top-...`.  This improves readability and can positively affect SEO.  Implement redirects from old URLs if doing this migration.
2. **Testing** – Add end‑to‑end tests using Playwright or another tool to ensure critical paths (navigation, contact form, product page) work after changes.  Place tests under `tests/` and configure them to run in CI.
3. **Environment variables** – Audit `.env` and `.env.sample` files to ensure no secrets are hard‑coded.  Document required variables for Amazon API integration.

**Codex prompt:**

```md
1. Prepare to migrate top lists to `/toplists/:slug`.  Create `src/pages/toplists/[slug].astro` and update routing logic accordingly.  Add redirects from old `/category/.../top-...` pages using `astro:redirect` components.  Ensure the sitemap lists both old and new URLs during the transition and mark the old URLs with `<meta name="robots" content="noindex">`.

2. Set up Playwright tests: add `@playwright/test` as a dev dependency and create a `tests/navigation.spec.ts` that verifies the home page loads, navigation menus work, the 404 page appears for unknown routes and the contact form can be filled.  Configure a GitHub Action to run these tests on each pull request.

3. Add `.env.sample` with placeholders for `AMAZON_PA_ACCESS_KEY`, `AMAZON_PA_SECRET_KEY`, `AMAZON_ASSOCIATE_TAG` and any other sensitive variables.  Ensure `.env` is ignored in `.gitignore`.


By following these action plans and using the Codex prompts provided, you will systematically address SEO, accessibility, performance and code‑quality issues in the Top10Maison project. Implementing these improvements will prepare the site for a seamless integration with the Amazon API and ensure a robust, user‑friendly experience.