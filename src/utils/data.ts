import categoriesData from "../data/categories.json";

export type ChildSubcategory = {
  slug: string;
  name: string;
  description: string;
  intentCopy: string;
  intentTable: Array<{
    label: string;
    audience: string;
    priority: string;
    priceBand: string;
  }>;
  faq: FaqItem[];
  image?: string;
  published: boolean;
};

export type Subcategory = ChildSubcategory & {
  subcategories: ChildSubcategory[];
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  intro: string;
  image: string;
  selectionFactors: string[];
  howToChoose: string[];
  faq: FaqItem[];
  subcategories: Subcategory[];
  published: boolean;
};

export type Product = {
  slug: string;
  asin?: string;
  name: string;
  description: string;
  image: string;
  price: string;
  brand?: string;
  rating?: number;
  ratingCount?: number;
  reviewSnippet?: string;
  affiliateUrl: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  uniqueValue: string;
  notIdealFor: string;
  specs: Record<string, string>;
  faq: FaqItem[];
  alternatives: string[];
  published: boolean;
};

export type Toplist = {
  slug: string;
  category: string;
  subcategory: string;
  childsubcategory: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  image?: string;
  schemaHeadline?: string;
  schemaDatePublished?: string;
  schemaImage?: string;
  articleHtml?: string;
  count: number;
  keywordSlug: string;
  products: string[];
  affiliate: boolean;
  performanceScore: number;
  quickCompareCriteria: string[];
  howWePicked: string[];
  whoShouldBuy: string[];
  faq: FaqItem[];
  published: boolean;
};

export type FaqItem = {
  question: string;
  answer: string;
};

const productModules = import.meta.glob("../data/products/*.json", { eager: true }) as Record<
  string,
  { default: Product[] }
>;
const toplistModules = import.meta.glob("../data/toplists/*.json", { eager: true }) as Record<
  string,
  { default: Toplist }
>;

function getProductsData(): Product[] {
  return Object.values(productModules).flatMap((module) => module.default ?? []);
}

function getToplistsData(): Toplist[] {
  return Object.values(toplistModules)
    .map((module) => module.default)
    .filter(Boolean);
}
function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertNonEmpty(value: string, label: string): void {
  assert(value.trim().length > 0, `${label} must not be empty.`);
}

function assertMaxLength(value: string, max: number, label: string): void {
  assert(value.length <= max, `${label} must be ${max} characters or fewer.`);
}

function assertNonEmptyArray(values: string[], label: string): void {
  assert(Array.isArray(values) && values.length > 0, `${label} must not be empty.`);
  for (const value of values) {
    assertNonEmpty(value, `${label} item`);
  }
}

function assertAllowedValues(values: string[], allowed: string[], label: string): void {
  for (const value of values) {
    assert(allowed.includes(value), `${label} contains unsupported value: ${value}`);
  }
}

function assertFaq(items: FaqItem[], label: string): void {
  assert(Array.isArray(items) && items.length > 0, `${label} FAQ must not be empty.`);
  for (const item of items) {
    assertNonEmpty(item.question, `${label} FAQ question`);
    assertNonEmpty(item.answer, `${label} FAQ answer`);
  }
}

export function getCategories(): Category[] {
  const categories = (categoriesData as Category[]).filter((category) => category.published);
  assert(Array.isArray(categories) && categories.length > 0, "categories.json must contain at least one published category.");

  const slugs = new Set<string>();
  for (const category of categories) {
    assertNonEmpty(category.slug, "Category slug");
    assert(typeof category.published === "boolean", `Category ${category.slug} published must be boolean.`);
    assertNonEmpty(category.name, `Category ${category.slug} name`);
    assertNonEmpty(category.description, `Category ${category.slug} description`);
    assertNonEmpty(category.intro, `Category ${category.slug} intro`);
    assertNonEmpty(category.image, `Category ${category.slug} image`);
  assertNonEmptyArray(category.selectionFactors, `Category ${category.slug} selectionFactors`);
  assertNonEmptyArray(category.howToChoose, `Category ${category.slug} howToChoose`);
  assertFaq(category.faq, `Category ${category.slug}`);
  assert(Array.isArray(category.subcategories) && category.subcategories.length > 0, `Category ${category.slug} must have subcategories.`);
    assert(!slugs.has(category.slug), `Duplicate category slug: ${category.slug}`);
    slugs.add(category.slug);

    const subSlugs = new Set<string>();
    const publishedSubcategories = category.subcategories.filter((subcategory) => subcategory.published);
    assert(publishedSubcategories.length > 0, `Category ${category.slug} must have published subcategories.`);
    category.subcategories = publishedSubcategories;
    for (const subcategory of category.subcategories) {
      assertNonEmpty(subcategory.slug, `Subcategory slug in ${category.slug}`);
      assert(typeof subcategory.published === "boolean", `Subcategory ${subcategory.slug} published must be boolean.`);
      assertNonEmpty(subcategory.name, `Subcategory ${subcategory.slug} name`);
      assertNonEmpty(subcategory.description, `Subcategory ${subcategory.slug} description`);
      assertNonEmpty(subcategory.intentCopy, `Subcategory ${subcategory.slug} intentCopy`);
      if (subcategory.image) {
        assertNonEmpty(subcategory.image, `Subcategory ${subcategory.slug} image`);
      }
      assert(Array.isArray(subcategory.intentTable) && subcategory.intentTable.length > 0, `Subcategory ${subcategory.slug} intentTable must not be empty.`);
      for (const row of subcategory.intentTable) {
        assertNonEmpty(row.label, `Subcategory ${subcategory.slug} intentTable label`);
        assertNonEmpty(row.audience, `Subcategory ${subcategory.slug} intentTable audience`);
        assertNonEmpty(row.priority, `Subcategory ${subcategory.slug} intentTable priority`);
        assertNonEmpty(row.priceBand, `Subcategory ${subcategory.slug} intentTable priceBand`);
      }
      assertFaq(subcategory.faq, `Subcategory ${subcategory.slug}`);
      assert(Array.isArray(subcategory.subcategories) && subcategory.subcategories.length > 0, `Subcategory ${subcategory.slug} must have subcategories.`);
      assert(!subSlugs.has(subcategory.slug), `Duplicate subcategory slug in ${category.slug}: ${subcategory.slug}`);
      subSlugs.add(subcategory.slug);

      const childSlugs = new Set<string>();
      const publishedChildren = subcategory.subcategories.filter((child) => child.published);
      assert(publishedChildren.length > 0, `Subcategory ${subcategory.slug} must have published subcategories.`);
      subcategory.subcategories = publishedChildren;
      for (const childsubcategory of subcategory.subcategories) {
        assertNonEmpty(childsubcategory.slug, `Child subcategory slug in ${subcategory.slug}`);
        assert(typeof childsubcategory.published === "boolean", `Child subcategory ${childsubcategory.slug} published must be boolean.`);
        assertNonEmpty(childsubcategory.name, `Child subcategory ${childsubcategory.slug} name`);
        assertNonEmpty(childsubcategory.description, `Child subcategory ${childsubcategory.slug} description`);
        assertNonEmpty(childsubcategory.intentCopy, `Child subcategory ${childsubcategory.slug} intentCopy`);
        if (childsubcategory.image) {
          assertNonEmpty(childsubcategory.image, `Child subcategory ${childsubcategory.slug} image`);
        }
        assert(Array.isArray(childsubcategory.intentTable) && childsubcategory.intentTable.length > 0, `Child subcategory ${childsubcategory.slug} intentTable must not be empty.`);
        for (const row of childsubcategory.intentTable) {
          assertNonEmpty(row.label, `Child subcategory ${childsubcategory.slug} intentTable label`);
          assertNonEmpty(row.audience, `Child subcategory ${childsubcategory.slug} intentTable audience`);
          assertNonEmpty(row.priority, `Child subcategory ${childsubcategory.slug} intentTable priority`);
          assertNonEmpty(row.priceBand, `Child subcategory ${childsubcategory.slug} intentTable priceBand`);
        }
        assertFaq(childsubcategory.faq, `Child subcategory ${childsubcategory.slug}`);
        assert(!childSlugs.has(childsubcategory.slug), `Duplicate child subcategory slug in ${subcategory.slug}: ${childsubcategory.slug}`);
        childSlugs.add(childsubcategory.slug);
      }
    }
  }

  return categories;
}

export function getProducts(): Product[] {
  const products = getProductsData().filter((product) => product.published);
  assert(
    Array.isArray(products) && products.length > 0,
    "products data must contain at least one published product."
  );

  const slugs = new Set<string>();
  for (const product of products) {
    assertNonEmpty(product.slug, "Product slug");
    assert(typeof product.published === "boolean", `Product ${product.slug} published must be boolean.`);
    assertNonEmpty(product.name, `Product ${product.slug} name`);
    assertNonEmpty(product.description, `Product ${product.slug} description`);
    assertNonEmpty(product.image, `Product ${product.slug} image`);
    assertNonEmpty(product.price, `Product ${product.slug} price`);
    assertNonEmpty(product.affiliateUrl, `Product ${product.slug} affiliateUrl`);
    if (product.brand) {
      assertNonEmpty(product.brand, `Product ${product.slug} brand`);
    }
    if (typeof product.rating !== "undefined") {
      assert(typeof product.rating === "number", `Product ${product.slug} rating must be a number.`);
    }
    if (typeof product.ratingCount !== "undefined") {
      assert(Number.isInteger(product.ratingCount), `Product ${product.slug} ratingCount must be an integer.`);
    }
    if (product.reviewSnippet) {
      assertNonEmpty(product.reviewSnippet, `Product ${product.slug} reviewSnippet`);
    }
    assertNonEmptyArray(product.pros, `Product ${product.slug} pros`);
    assertNonEmptyArray(product.cons, `Product ${product.slug} cons`);
    assertNonEmpty(product.bestFor, `Product ${product.slug} bestFor`);
    assertNonEmpty(product.uniqueValue, `Product ${product.slug} uniqueValue`);
    assertNonEmpty(product.notIdealFor, `Product ${product.slug} notIdealFor`);
    assert(Object.keys(product.specs).length > 0, `Product ${product.slug} specs must not be empty.`);
    assertFaq(product.faq, `Product ${product.slug}`);
    assert(Array.isArray(product.alternatives) && product.alternatives.length > 0, `Product ${product.slug} alternatives must not be empty.`);
    assert(!slugs.has(product.slug), `Duplicate product slug: ${product.slug}`);
    slugs.add(product.slug);
  }

  return products;
}

export function getToplists(): Toplist[] {
  const toplists = getToplistsData().filter((toplist) => toplist.published);
  assert(Array.isArray(toplists) && toplists.length > 0, "toplists data must contain at least one published toplist.");

  const slugs = new Set<string>();
  for (const toplist of toplists) {
    assertNonEmpty(toplist.slug, "Toplist slug");
    assert(typeof toplist.published === "boolean", `Toplist ${toplist.slug} published must be boolean.`);
    assertNonEmpty(toplist.category, `Toplist ${toplist.slug} category`);
    assertNonEmpty(toplist.subcategory, `Toplist ${toplist.slug} subcategory`);
    assertNonEmpty(toplist.childsubcategory, `Toplist ${toplist.slug} childsubcategory`);
    assertNonEmpty(toplist.title, `Toplist ${toplist.slug} title`);
    assertNonEmpty(toplist.h1, `Toplist ${toplist.slug} h1`);
    assertNonEmpty(toplist.metaTitle, `Toplist ${toplist.slug} metaTitle`);
    assertNonEmpty(toplist.metaDescription, `Toplist ${toplist.slug} metaDescription`);
    if (toplist.schemaHeadline) {
      assertNonEmpty(toplist.schemaHeadline, `Toplist ${toplist.slug} schemaHeadline`);
    }
    if (toplist.schemaDatePublished) {
      assertNonEmpty(toplist.schemaDatePublished, `Toplist ${toplist.slug} schemaDatePublished`);
    }
    if (toplist.schemaImage) {
      assertNonEmpty(toplist.schemaImage, `Toplist ${toplist.slug} schemaImage`);
    }
    if (toplist.articleHtml) {
      assertNonEmpty(toplist.articleHtml, `Toplist ${toplist.slug} articleHtml`);
    }
    assertMaxLength(toplist.metaTitle, 60, `Toplist ${toplist.slug} metaTitle`);
    assertMaxLength(toplist.metaDescription, 155, `Toplist ${toplist.slug} metaDescription`);
    assertNonEmpty(toplist.keywordSlug, `Toplist ${toplist.slug} keywordSlug`);
    assert(Number.isInteger(toplist.count) && toplist.count > 0, `Toplist ${toplist.slug} count must be a positive integer.`);
    assert(Array.isArray(toplist.products) && toplist.products.length > 0, `Toplist ${toplist.slug} must have products.`);
    assert(Number.isFinite(toplist.performanceScore), `Toplist ${toplist.slug} performanceScore must be a number.`);
    assertNonEmptyArray(toplist.quickCompareCriteria, `Toplist ${toplist.slug} quickCompareCriteria`);
    assertAllowedValues(toplist.quickCompareCriteria, ["Best for", "Key win", "Price range"], `Toplist ${toplist.slug} quickCompareCriteria`);
    assertNonEmptyArray(toplist.howWePicked, `Toplist ${toplist.slug} howWePicked`);
    assertNonEmptyArray(toplist.whoShouldBuy, `Toplist ${toplist.slug} whoShouldBuy`);
    assertFaq(toplist.faq, `Toplist ${toplist.slug}`);
    assert(!slugs.has(toplist.slug), `Duplicate toplist slug: ${toplist.slug}`);
    slugs.add(toplist.slug);
  }

  return toplists;
}

export function buildDataIndex() {
  const categories = getCategories();
  const products = getProducts();
  const toplists = getToplists();

  const categoryMap = new Map<string, Category>();
  const subcategoryMap = new Map<string, Subcategory>();
  const childSubcategoryMap = new Map<string, ChildSubcategory>();
  for (const category of categories) {
    categoryMap.set(category.slug, category);
    for (const subcategory of category.subcategories) {
      subcategoryMap.set(`${category.slug}:${subcategory.slug}`, subcategory);
      for (const childsubcategory of subcategory.subcategories) {
        childSubcategoryMap.set(`${category.slug}:${subcategory.slug}:${childsubcategory.slug}`, childsubcategory);
      }
    }
  }

  const productMap = new Map<string, Product>();
  for (const product of products) {
    productMap.set(product.slug, product);
  }

  for (const toplist of toplists) {
    const categoryKey = toplist.category;
    const subcategoryKey = `${toplist.category}:${toplist.subcategory}`;
    const childSubcategoryKey = `${toplist.category}:${toplist.subcategory}:${toplist.childsubcategory}`;
    assert(categoryMap.has(categoryKey), `Toplist ${toplist.slug} references missing category: ${categoryKey}`);
    assert(subcategoryMap.has(subcategoryKey), `Toplist ${toplist.slug} references missing subcategory: ${subcategoryKey}`);
    assert(childSubcategoryMap.has(childSubcategoryKey), `Toplist ${toplist.slug} references missing child subcategory: ${childSubcategoryKey}`);

    for (const productSlug of toplist.products) {
      assert(productMap.has(productSlug), `Toplist ${toplist.slug} references missing product: ${productSlug}`);
    }
  }

  for (const product of products) {
    for (const alternativeSlug of product.alternatives) {
      assert(productMap.has(alternativeSlug), `Product ${product.slug} references missing alternative: ${alternativeSlug}`);
      assert(alternativeSlug !== product.slug, `Product ${product.slug} cannot list itself as an alternative.`);
    }
  }

  return {
    categories,
    products,
    toplists,
    categoryMap,
    subcategoryMap,
    childSubcategoryMap,
    productMap
  };
}

export function getTopListData(
  categorySlug: string,
  subcategorySlug: string,
  count: string,
  slug: string,
  childSlug?: string
) {
  const { categories, toplists, productMap } = buildDataIndex();
  const list = toplists.find(
    (item) =>
      item.category === categorySlug &&
      item.subcategory === subcategorySlug &&
      String(item.count) === String(count) &&
      item.keywordSlug === slug &&
      (childSlug ? item.childsubcategory === childSlug : true)
  );

  if (!list) {
    throw new Error(`Missing toplist for ${categorySlug}/${subcategorySlug}/top-${count}-${slug}`);
  }

  const category = categories.find((item) => item.slug === categorySlug);
  if (!category) {
    throw new Error(`Missing category data for slug: ${categorySlug}`);
  }

  const subcategory = category.subcategories.find((item) => item.slug === subcategorySlug);
  if (!subcategory) {
    throw new Error(`Missing subcategory data for slug: ${categorySlug}:${subcategorySlug}`);
  }

  const childsubcategory = subcategory.subcategories.find((item) => item.slug === list.childsubcategory);
  if (!childsubcategory) {
    throw new Error(`Missing child subcategory data for toplist: ${list.slug}`);
  }

  const products = list.products.map((productSlug) => {
    const product = productMap.get(productSlug);
    if (!product) {
      throw new Error(`Missing product data for slug: ${productSlug}`);
    }
    return product;
  });

  return {
    category,
    subcategory,
    childsubcategory,
    list,
    products,
    title: list.title,
    description: list.metaDescription,
    intro: childsubcategory.intentCopy,
    selectionCriteria: list.howWePicked,
    faq: list.faq
  };
}

export function getBestToplistForChild(
  categorySlug: string,
  subcategorySlug: string,
  childSlug: string
) {
  const { toplists } = buildDataIndex();
  const candidates = toplists.filter(
    (list) =>
      list.category === categorySlug &&
      list.subcategory === subcategorySlug &&
      list.childsubcategory === childSlug
  );
  if (candidates.length === 0) {
    return null;
  }
  return candidates
    .slice()
    .sort((a, b) => {
      if (b.performanceScore !== a.performanceScore) {
        return b.performanceScore - a.performanceScore;
      }
      return b.count - a.count;
    })[0];
}

export function getCategoryData(slugPath: string | string[]) {
  const { categories, toplists } = buildDataIndex();
  const segments = Array.isArray(slugPath) ? slugPath : slugPath.split("/").filter(Boolean);
  const [categorySlug, subcategorySlug, childSlug] = segments;

  const category = categories.find((item) => item.slug === categorySlug);
  if (!category) {
    throw new Error(`Missing category data for slug: ${categorySlug}`);
  }

  const subcategory = subcategorySlug
    ? category.subcategories.find((item) => item.slug === subcategorySlug)
    : undefined;
  if (subcategorySlug && !subcategory) {
    throw new Error(`Missing subcategory data for slug: ${categorySlug}:${subcategorySlug}`);
  }

  const childsubcategory = childSlug
    ? subcategory?.subcategories.find((item) => item.slug === childSlug)
    : undefined;
  if (childSlug && !childsubcategory) {
    throw new Error(`Missing child subcategory data for slug: ${categorySlug}:${subcategorySlug}:${childSlug}`);
  }

  const filteredToplists = toplists.filter((list) => {
    if (list.category !== category.slug) {
      return false;
    }
    if (subcategory && list.subcategory !== subcategory.slug) {
      return false;
    }
    if (childsubcategory && list.childsubcategory !== childsubcategory.slug) {
      return false;
    }
    return true;
  });

  return {
    category,
    subcategory,
    childsubcategory,
    toplists: filteredToplists
  };
}

export function getProductData(slug: string) {
  const { products } = buildDataIndex();
  const product = products.find((item) => item.slug === slug);
  if (!product) {
    throw new Error(`Missing product data for slug: ${slug}`);
  }
  return product;
}
