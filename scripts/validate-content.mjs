import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DATA_DIR = join(ROOT, "src", "data");
const PRODUCTS_DIR = join(DATA_DIR, "products");
const TOPLISTS_DIR = join(DATA_DIR, "toplists");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function listJson(dir) {
  return readdirSync(dir)
    .filter((entry) => entry.endsWith(".json"))
    .map((entry) => join(dir, entry));
}

function assert(condition, message, errors) {
  if (!condition) {
    errors.push(message);
  }
}

function assertNonEmpty(value, label, errors) {
  assert(typeof value === "string" && value.trim().length > 0, `${label} must not be empty.`, errors);
}

function assertArray(value, label, errors) {
  assert(Array.isArray(value) && value.length > 0, `${label} must be a non-empty array.`, errors);
}

function assertMaxLength(value, max, label, errors) {
  if (typeof value !== "string") return;
  assert(value.length <= max, `${label} must be ${max} characters or fewer.`, errors);
}

const errors = [];

const categories = readJson(join(DATA_DIR, "categories.json"));
const products = listJson(PRODUCTS_DIR).flatMap((file) => readJson(file));
const toplists = listJson(TOPLISTS_DIR).map((file) => readJson(file));

const categoryMap = new Map();
const subcategoryMap = new Map();
const childMap = new Map();
const productMap = new Map();

const categorySlugs = new Set();
for (const category of categories) {
  if (!category.published) continue;
  assertNonEmpty(category.slug, "Category slug", errors);
  assertNonEmpty(category.name, `Category ${category.slug} name`, errors);
  assertNonEmpty(category.description, `Category ${category.slug} description`, errors);
  assertNonEmpty(category.intro, `Category ${category.slug} intro`, errors);
  assertNonEmpty(category.image, `Category ${category.slug} image`, errors);
  assertArray(category.selectionFactors, `Category ${category.slug} selectionFactors`, errors);
  assertArray(category.howToChoose, `Category ${category.slug} howToChoose`, errors);
  assertArray(category.faq, `Category ${category.slug} faq`, errors);
  assert(Array.isArray(category.subcategories) && category.subcategories.length > 0, `Category ${category.slug} must have subcategories.`, errors);

  assert(!categorySlugs.has(category.slug), `Duplicate category slug: ${category.slug}`, errors);
  categorySlugs.add(category.slug);
  categoryMap.set(category.slug, category);

  const subSlugs = new Set();
  for (const subcategory of category.subcategories || []) {
    if (!subcategory.published) continue;
    const subKey = `${category.slug}:${subcategory.slug}`;
    assertNonEmpty(subcategory.slug, `Subcategory slug in ${category.slug}`, errors);
    assertNonEmpty(subcategory.name, `Subcategory ${subcategory.slug} name`, errors);
    assertNonEmpty(subcategory.description, `Subcategory ${subcategory.slug} description`, errors);
    assertNonEmpty(subcategory.intentCopy, `Subcategory ${subcategory.slug} intentCopy`, errors);
    assertArray(subcategory.intentTable, `Subcategory ${subcategory.slug} intentTable`, errors);
    assertArray(subcategory.faq, `Subcategory ${subcategory.slug} faq`, errors);
    assert(Array.isArray(subcategory.subcategories) && subcategory.subcategories.length > 0, `Subcategory ${subcategory.slug} must have subcategories.`, errors);

    assert(!subSlugs.has(subcategory.slug), `Duplicate subcategory slug in ${category.slug}: ${subcategory.slug}`, errors);
    subSlugs.add(subcategory.slug);
    subcategoryMap.set(subKey, subcategory);

    const childSlugs = new Set();
    for (const child of subcategory.subcategories || []) {
      if (!child.published) continue;
      const childKey = `${category.slug}:${subcategory.slug}:${child.slug}`;
      assertNonEmpty(child.slug, `Child subcategory slug in ${subcategory.slug}`, errors);
      assertNonEmpty(child.name, `Child subcategory ${child.slug} name`, errors);
      assertNonEmpty(child.description, `Child subcategory ${child.slug} description`, errors);
      assertNonEmpty(child.intentCopy, `Child subcategory ${child.slug} intentCopy`, errors);
      assertArray(child.intentTable, `Child subcategory ${child.slug} intentTable`, errors);
      assertArray(child.faq, `Child subcategory ${child.slug} faq`, errors);

      assert(!childSlugs.has(child.slug), `Duplicate child subcategory slug in ${subcategory.slug}: ${child.slug}`, errors);
      childSlugs.add(child.slug);
      childMap.set(childKey, child);
    }
  }
}

const productSlugs = new Set();
for (const product of products) {
  if (!product.published) continue;
  assertNonEmpty(product.slug, "Product slug", errors);
  assertNonEmpty(product.name, `Product ${product.slug} name`, errors);
  assertNonEmpty(product.description, `Product ${product.slug} description`, errors);
  assertNonEmpty(product.image, `Product ${product.slug} image`, errors);
  assertNonEmpty(product.price, `Product ${product.slug} price`, errors);
  assertNonEmpty(product.affiliateUrl, `Product ${product.slug} affiliateUrl`, errors);
  assertArray(product.pros, `Product ${product.slug} pros`, errors);
  assertArray(product.cons, `Product ${product.slug} cons`, errors);
  assertNonEmpty(product.bestFor, `Product ${product.slug} bestFor`, errors);
  assertNonEmpty(product.uniqueValue, `Product ${product.slug} uniqueValue`, errors);
  assertNonEmpty(product.notIdealFor, `Product ${product.slug} notIdealFor`, errors);
  assert(product.specs && Object.keys(product.specs).length > 0, `Product ${product.slug} specs must not be empty.`, errors);
  assertArray(product.faq, `Product ${product.slug} faq`, errors);
  assertArray(product.alternatives, `Product ${product.slug} alternatives`, errors);

  assert(!productSlugs.has(product.slug), `Duplicate product slug: ${product.slug}`, errors);
  productSlugs.add(product.slug);
  productMap.set(product.slug, product);
}

const toplistSlugs = new Set();
for (const toplist of toplists) {
  if (!toplist.published) continue;
  assertNonEmpty(toplist.slug, "Toplist slug", errors);
  assertNonEmpty(toplist.category, `Toplist ${toplist.slug} category`, errors);
  assertNonEmpty(toplist.subcategory, `Toplist ${toplist.slug} subcategory`, errors);
  assertNonEmpty(toplist.childsubcategory, `Toplist ${toplist.slug} childsubcategory`, errors);
  assertNonEmpty(toplist.title, `Toplist ${toplist.slug} title`, errors);
  assertNonEmpty(toplist.h1, `Toplist ${toplist.slug} h1`, errors);
  assertNonEmpty(toplist.metaTitle, `Toplist ${toplist.slug} metaTitle`, errors);
  assertNonEmpty(toplist.metaDescription, `Toplist ${toplist.slug} metaDescription`, errors);
  assertMaxLength(toplist.metaTitle, 60, `Toplist ${toplist.slug} metaTitle`, errors);
  assertMaxLength(toplist.metaDescription, 155, `Toplist ${toplist.slug} metaDescription`, errors);
  assertNonEmpty(toplist.image, `Toplist ${toplist.slug} image (ogImage)`, errors);
  assertArray(toplist.products, `Toplist ${toplist.slug} products`, errors);
  assert(Array.isArray(toplist.howWePicked) && toplist.howWePicked.length > 0, `Toplist ${toplist.slug} howWePicked must not be empty.`, errors);
  assert(Array.isArray(toplist.whoShouldBuy) && toplist.whoShouldBuy.length > 0, `Toplist ${toplist.slug} whoShouldBuy must not be empty.`, errors);
  assertArray(toplist.faq, `Toplist ${toplist.slug} faq`, errors);

  assert(!toplistSlugs.has(toplist.slug), `Duplicate toplist slug: ${toplist.slug}`, errors);
  toplistSlugs.add(toplist.slug);

  assert(categoryMap.has(toplist.category), `Toplist ${toplist.slug} references missing category: ${toplist.category}`, errors);
  assert(
    subcategoryMap.has(`${toplist.category}:${toplist.subcategory}`),
    `Toplist ${toplist.slug} references missing subcategory: ${toplist.category}:${toplist.subcategory}`,
    errors
  );
  assert(
    childMap.has(`${toplist.category}:${toplist.subcategory}:${toplist.childsubcategory}`),
    `Toplist ${toplist.slug} references missing child subcategory: ${toplist.category}:${toplist.subcategory}:${toplist.childsubcategory}`,
    errors
  );

  for (const productSlug of toplist.products || []) {
    assert(productMap.has(productSlug), `Toplist ${toplist.slug} references missing product: ${productSlug}`, errors);
  }
}

for (const product of products) {
  if (!product.published) continue;
  for (const alt of product.alternatives || []) {
    assert(productMap.has(alt), `Product ${product.slug} references missing alternative: ${alt}`, errors);
    assert(alt !== product.slug, `Product ${product.slug} cannot reference itself as an alternative.`, errors);
  }
}

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} issue(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("OK: content validation passed.");
