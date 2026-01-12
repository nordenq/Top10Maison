const airFryers = [
	{
		slug: "cosori-air-fryer",
		name: "Cosori Air Fryer",
		description: "Compact air fryer with fast heat-up and easy presets.",
		image: "/images/products/cosori-air-fryer.svg",
		price: "$129",
		affiliateUrl: "https://amzn.to/4qoMFkP",
		published: true,
		pros: [
			"Fast preheat",
			"Simple controls",
			"Even cooking"
		],
		cons: [
			"Limited basket size",
			"Noisy fan"
		],
		bestFor: "Small households who want quick weeknight meals",
		uniqueValue: "Strong performance in a compact footprint",
		notIdealFor: "Large families",
		specs: {
			Capacity: "5.8 qt",
			Power: "1700 W",
			"Temperature range": "170–400°F",
			"Basket type": "Nonstick, square",
			Controls: "Digital presets",
			"Dishwasher safe parts": "Yes",
			Dimensions: "11.8 x 14.7 x 12.0 in",
			Warranty: "1 year",
			"Noise level": "Moderate"
		},
		faq: [
			{
				question: "Is the Cosori Air Fryer easy to clean?",
				answer: "Yes, the basket is nonstick and the removable parts are dishwasher safe."
			}
		],
		alternatives: [
			"ninja-af101",
			"instant-vortex-plus",
			"chefman-turbofry-xl"
		],
		brand: "Cosori",
		rating: 4.6,
		ratingCount: 1280,
		reviewSnippet: "Fast, even results in a compact basket."
	},
	{
		slug: "ninja-af101",
		name: "Ninja AF101",
		description: "Reliable air fryer with crisp results and dishwasher-safe basket.",
		image: "/images/products/ninja-af101.svg",
		price: "$119",
		affiliateUrl: "https://amzn.to/4jywnDb",
		published: true,
		pros: [
			"Crisp finish",
			"Solid build",
			"Easy cleaning"
		],
		cons: [
			"Small capacity",
			"Basic presets"
		],
		bestFor: "Budget-conscious shoppers who still want strong performance",
		uniqueValue: "Great crisping at a lower price point",
		notIdealFor: "Cooking for more than two people",
		specs: {
			Capacity: "4 qt",
			Power: "1550 W",
			"Temperature range": "105–400°F",
			"Basket type": "Nonstick, round",
			Controls: "Digital",
			"Dishwasher safe parts": "Yes",
			Dimensions: "8.5 x 12.1 x 11.0 in",
			Warranty: "1 year",
			"Noise level": "Moderate"
		},
		faq: [
			{
				question: "Does the Ninja AF101 cook evenly?",
				answer: "Yes, it delivers consistent crisping when food is placed in a single layer."
			}
		],
		alternatives: [
			"cosori-air-fryer",
			"instant-vortex-plus",
			"chefman-turbofry-xl"
		],
		brand: "Ninja",
		rating: 4.5,
		ratingCount: 980,
		reviewSnippet: "Crisp performance with simple controls and easy cleanup."
	},
	{
		slug: "instant-vortex-plus",
		name: "Instant Vortex Plus Air Fryer",
		description: "Versatile air fryer with a large basket and multiple cooking modes for everyday family meals.",
		image: "/images/products/instant-vortex-plus.svg",
		price: "$149",
		affiliateUrl: "https://amzn.to/3LBLEqs",
		published: true,
		pros: [
			"Large capacity",
			"Multiple cooking functions",
			"Fast preheating",
			"Easy-to-clean basket"
		],
		cons: [
			"Takes up more counter space",
			"Slightly louder than compact models"
		],
		bestFor: "Families and batch cooking",
		uniqueValue: "Combines large capacity with versatile cooking modes",
		notIdealFor: "Very small kitchens",
		specs: {
			Capacity: "6 qt",
			Power: "1700 W",
			"Temperature range": "120–400°F",
			"Basket type": "Nonstick, square",
			Controls: "Digital touch panel",
			"Dishwasher safe parts": "Yes",
			Warranty: "1 year",
			"Noise level": "Moderate"
		},
		faq: [
			{
				question: "Can the Instant Vortex Plus replace a full oven?",
				answer: "It works well for small meals and reheating but is best used alongside a traditional oven."
			}
		],
		alternatives: [
			"cosori-air-fryer",
			"ninja-af101",
			"chefman-turbofry-xl"
		],
		brand: "Instant",
		rating: 4.7,
		ratingCount: 860,
		reviewSnippet: "Large capacity with versatile cooking modes for families."
	},
	{
		slug: "chefman-turbofry-xl",
		name: "Chefman TurboFry XL Air Fryer",
		description: "Extra-large air fryer designed for cooking bigger portions with simple, no-fuss controls.",
		image: "/images/products/chefman-turbofry-xl.svg",
		price: "$129",
		affiliateUrl: "https://amzn.to/456flXj",
		published: true,
		pros: [
			"Very large basket",
			"Good airflow for crisp results",
			"Simple temperature controls",
			"Great value for size"
		],
		cons: [
			"Bulky footprint",
			"Basic interface"
		],
		bestFor: "Large households and batch cooking",
		uniqueValue: "One of the largest baskets available under $200",
		notIdealFor: "Minimalist or compact kitchens",
		specs: {
			Capacity: "8 qt",
			Power: "1700 W",
			"Temperature range": "200–400°F",
			"Basket type": "Nonstick, rectangular",
			Controls: "Manual dial",
			"Dishwasher safe parts": "Yes",
			Warranty: "1 year",
			"Noise level": "Moderate"
		},
		faq: [
			{
				question: "Is the Chefman TurboFry XL easy to use?",
				answer: "Yes, its manual controls make it very straightforward, especially for beginners."
			}
		],
		alternatives: [
			"cosori-air-fryer",
			"ninja-af101",
			"instant-vortex-plus"
		],
		brand: "Chefman",
		rating: 4.4,
		ratingCount: 740,
		reviewSnippet: "Big basket and straightforward controls for batch cooking."
	},
	{
		slug: "dash-tasti-crisp",
		name: "Dash Tasti-Crisp Air Fryer",
		description: "Compact and lightweight air fryer ideal for small portions and limited counter space.",
		image: "/images/products/dash-tasti-crisp.svg",
		price: "$69",
		affiliateUrl: "https://amzn.to/4aROpOB",
		published: true,
		pros: [
			"Very compact design",
			"Quick heat-up",
			"Simple controls",
			"Affordable price"
		],
		cons: [
			"Small capacity",
			"Not suitable for full meals"
		],
		bestFor: "Apartments, dorms, and solo cooking",
		uniqueValue: "Ultra-compact air fryer for tight spaces",
		notIdealFor: "Families or batch cooking",
		specs: {
			Capacity: "2.6 qt",
			Power: "1000 W",
			"Temperature range": "200–400°F",
			"Basket type": "Nonstick, round",
			Controls: "Manual dial",
			"Dishwasher safe parts": "Yes",
			Warranty: "1 year",
			"Noise level": "Low"
		},
		faq: [
			{
				question: "Is the Dash Tasti-Crisp powerful enough?",
				answer: "Yes, it is powerful enough for small portions like fries, nuggets, and vegetables."
			}
		],
		alternatives: [
			"cosori-air-fryer",
			"ninja-af101",
			"instant-vortex-plus"
		],
		brand: "Dash",
		rating: 4.3,
		ratingCount: 560,
		reviewSnippet: "Compact, quick, and ideal for small servings."
	}
];

const __vite_glob_0_0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: airFryers
}, Symbol.toStringTag, { value: 'Module' }));

const slug = "best-air-fryers-2026";
const category = "kitchen";
const subcategory = "small-appliances";
const childsubcategory = "air-fryers";
const title = "Best Air Fryers 2026";
const h1 = "Best Air Fryers 2026 — Curated picks for everyday cooking";
const metaTitle = "Best Air Fryers 2026 | Top10Maison";
const metaDescription = "Curated picks for the best air fryers of 2026, ranked by value, ease of use, and everyday fit.";
const schemaHeadline = "Best Air Fryers 2026";
const schemaDatePublished = "2026-01-05";
const schemaImage = "https://www.top10maison.com/images/airfryer-header.jpg";
const count = 5;
const keywordSlug = "air-fryers-2026";
const products = [
	"cosori-air-fryer",
	"ninja-af101",
	"instant-vortex-plus",
	"chefman-turbofry-xl",
	"dash-tasti-crisp"
];
const affiliate = true;
const published = true;
const performanceScore = 92;
const quickCompareCriteria = [
	"Best for",
	"Key win",
	"Price range"
];
const howWePicked = [
	"Performance consistency across common foods",
	"Ease of cleaning and daily maintenance",
	"Value per use based on price and durability"
];
const whoShouldBuy = [
	"You want faster weeknight meals with less oil",
	"You care about easy cleanup",
	"You need dependable results without a long learning curve"
];
const faq = [
	{
		question: "What size air fryer is best for a small kitchen?",
		answer: "A 4-6 quart model balances capacity with counter space and works for most small households."
	},
	{
		question: "Are air fryers cheaper to run than ovens?",
		answer: "Yes, they typically use less energy because they heat quickly and cook in smaller chambers."
	}
];
const articleHtml = "<h2>Best Air Fryers 2026</h2>\n<p>Curated picks for the best air fryers of 2026, ranked by value, ease of use, and everyday fit. Air fryers have revolutionized the way we cook, offering a healthier alternative to traditional frying methods while still delivering deliciously crispy results. Whether you're a small household looking for quick weeknight meals or a family needing to prepare larger batches, there's an air fryer that fits your needs perfectly.</p>\n\n<h3>Overview</h3>\n<p>As we step into 2026, the market for air fryers continues to expand, with various models catering to different cooking styles and household sizes. This guide will help you navigate through the top options available, focusing on performance, ease of use, and overall value. We've evaluated numerous models to bring you the best air fryers that stand out in terms of quality and functionality.</p>\n\n<h3>How We Evaluated</h3>\n<p>To curate our list of the best air fryers for 2026, we considered several key factors:</p>\n<ul>\n    <li><strong>Performance:</strong> How well does the air fryer cook food? We looked for models that deliver even cooking and crispy results.</li>\n    <li><strong>Ease of Use:</strong> User-friendly controls and straightforward operation were essential in our evaluation.</li>\n    <li><strong>Capacity:</strong> We considered the size of the cooking basket and how it fits different household needs.</li>\n    <li><strong>Cleaning:</strong> Models that are easy to clean and maintain scored higher in our assessments.</li>\n    <li><strong>Value for Money:</strong> We analyzed the price point in relation to the features and performance offered.</li>\n</ul>\n\n<h3>Top Picks Breakdown</h3>\n<p>Here are our top five air fryer picks for 2026:</p>\n\n<h4>1. Cosori Air Fryer</h4>\n<p><strong>Rating:</strong> 4.6 (1280 reviews)</p>\n<ul>\n    <li><strong>Pros:</strong> Fast preheat, simple controls, even cooking</li>\n    <li><strong>Cons:</strong> Limited basket size, noisy fan</li>\n    <li><strong>Best For:</strong> Small households who want quick weeknight meals</li>\n    <li><strong>Unique Value:</strong> Strong performance in a compact footprint</li>\n</ul>\n\n<h4>2. Ninja AF101</h4>\n<p><strong>Rating:</strong> 4.5 (980 reviews)</p>\n<ul>\n    <li><strong>Pros:</strong> Crisp finish, solid build, easy cleaning</li>\n    <li><strong>Cons:</strong> Small capacity, basic presets</li>\n    <li><strong>Best For:</strong> Budget-conscious shoppers who still want strong performance</li>\n    <li><strong>Unique Value:</strong> Great crisping at a lower price point</li>\n</ul>\n\n<h4>3. Instant Vortex Plus Air Fryer</h4>\n<p><strong>Rating:</strong> 4.7 (860 reviews)</p>\n<ul>\n    <li><strong>Pros:</strong> Large capacity, multiple cooking functions, fast preheating, easy-to-clean basket</li>\n    <li><strong>Cons:</strong> Takes up more counter space, slightly louder than compact models</li>\n    <li><strong>Best For:</strong> Families and batch cooking</li>\n    <li><strong>Unique Value:</strong> Combines large capacity with versatile cooking modes</li>\n</ul>\n\n<h4>4. Chefman TurboFry XL Air Fryer</h4>\n<p><strong>Rating:</strong> 4.4 (740 reviews)</p>\n<ul>\n    <li><strong>Pros:</strong> Very large basket, good airflow for crisp results, simple temperature controls, great value for size</li>\n    <li><strong>Cons:</strong> Bulky footprint, basic interface</li>\n    <li><strong>Best For:</strong> Large households and batch cooking</li>\n    <li><strong>Unique Value:</strong> One of the largest baskets available under $200</li>\n</ul>\n\n<h4>5. Dash Tasti-Crisp Air Fryer</h4>\n<p><strong>Rating:</strong> 4.3 (560 reviews)</p>\n<ul>\n    <li><strong>Pros:</strong> Very compact design, quick heat-up, simple controls, affordable price</li>\n    <li><strong>Cons:</strong> Small capacity, not suitable for full meals</li>\n    <li><strong>Best For:</strong> Apartments, dorms, and solo cooking</li>\n    <li><strong>Unique Value:</strong> Ultra-compact air fryer for tight spaces</li>\n</ul>\n\n<h3>How to Choose</h3>\n<p>When selecting the right air fryer for your kitchen, consider the following factors:</p>\n<ul>\n    <li><strong>Size and Capacity:</strong> Determine how much food you typically cook at once. Larger families may benefit from models with bigger baskets.</li>\n    <li><strong>Cooking Functions:</strong> Some air fryers offer multiple cooking functions such as baking, roasting, and dehydrating. Choose one that fits your cooking style.</li>\n    <li><strong>Ease of Cleaning:</strong> Look for models with dishwasher-safe parts or non-stick surfaces to simplify the cleaning process.</li>\n    <li><strong>Price:</strong> Set a budget and compare features within that range. Remember, a higher price doesn't always guarantee better performance.</li>\n    <li><strong>Brand Reputation:</strong> Consider brands known for quality and customer service to ensure a positive buying experience.</li>\n</ul>\n\n<h3>FAQ</h3>\n<p><strong>Q: Are air fryers healthy?</strong></p>\n<p>A: Yes, air fryers use significantly less oil than traditional frying methods, making them a healthier option for cooking crispy foods.</p>\n\n<p><strong>Q: Can I cook frozen food in an air fryer?</strong></p>\n<p>A: Absolutely! Air fryers are great for cooking frozen foods quickly and evenly without the need for thawing.</p>\n\n<p><strong>Q: How do I clean my air fryer?</strong></p>\n<p>A: Most air fryers have removable, dishwasher-safe parts. For best results, clean the basket and tray after each use to prevent buildup.</p>\n\n<p><strong>Q: What can I cook in an air fryer?</strong></p>\n<p>A: You can cook a variety of foods, including vegetables, meats, and even baked goods. The versatility of air fryers makes them suitable for many recipes.</p>\n\n<p><strong>Q: Do air fryers take up a lot of counter space?</strong></p>\n<p>A: Air fryers come in various sizes. While some larger models may take up more space, there are compact options available for smaller kitchens.</p>\n\n<p>In conclusion, the right air fryer can enhance your cooking experience, making it easier to prepare healthy and delicious meals. Consider your specific needs and preferences when choosing from our top picks for 2026, and enjoy the benefits of this innovative kitchen appliance.</p>";
const image = "https://pub-d2291ee7d44d475387fd51f65cd369f0.r2.dev/openai/toplists/best-air-fryers-2026-640w.webp";
const imageSrcset = "https://pub-d2291ee7d44d475387fd51f65cd369f0.r2.dev/openai/toplists/best-air-fryers-2026-320w.webp 320w, https://pub-d2291ee7d44d475387fd51f65cd369f0.r2.dev/openai/toplists/best-air-fryers-2026-640w.webp 640w";
const bestAirFryers2026 = {
	slug: slug,
	category: category,
	subcategory: subcategory,
	childsubcategory: childsubcategory,
	title: title,
	h1: h1,
	metaTitle: metaTitle,
	metaDescription: metaDescription,
	schemaHeadline: schemaHeadline,
	schemaDatePublished: schemaDatePublished,
	schemaImage: schemaImage,
	count: count,
	keywordSlug: keywordSlug,
	products: products,
	affiliate: affiliate,
	published: published,
	performanceScore: performanceScore,
	quickCompareCriteria: quickCompareCriteria,
	howWePicked: howWePicked,
	whoShouldBuy: whoShouldBuy,
	faq: faq,
	articleHtml: articleHtml,
	image: image,
	imageSrcset: imageSrcset
};

const __vite_glob_1_0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  affiliate,
  articleHtml,
  category,
  childsubcategory,
  count,
  default: bestAirFryers2026,
  faq,
  h1,
  howWePicked,
  image,
  imageSrcset,
  keywordSlug,
  metaDescription,
  metaTitle,
  performanceScore,
  products,
  published,
  quickCompareCriteria,
  schemaDatePublished,
  schemaHeadline,
  schemaImage,
  slug,
  subcategory,
  title,
  whoShouldBuy
}, Symbol.toStringTag, { value: 'Module' }));

const categoriesData = [
	{
		slug: "kitchen",
		name: "Kitchen",
		description: "Curated air fryer picks for everyday cooking.",
		intro: "Curated air fryer picks that make daily cooking easier. Compare size, capacity, and value, then choose what fits your space and budget.",
		published: true,
		selectionFactors: [
			"capacity",
			"ease of cleaning",
			"counter space"
		],
		howToChoose: [
			"Match size and capacity to how often you cook at home.",
			"Look for durable finishes that handle heat and daily use.",
			"Prioritize features that save time, like quick presets or easy cleanup."
		],
		faq: [
			{
				question: "What matters most when buying kitchen products?",
				answer: "Start with durability and daily ease of use, then compare features that save time."
			},
			{
				question: "How do I avoid overspending on small appliances?",
				answer: "Focus on the few features you will use weekly and skip add-ons that inflate price."
			}
		],
		subcategories: [
			{
				slug: "small-appliances",
				name: "Small Appliances",
				description: "Small appliance picks for faster, easier meals.",
				intentCopy: "Compare small appliances by real-world performance, not just wattage. We highlight options built for everyday cooking and reliable results.",
				published: true,
				intentTable: [
					{
						label: "Budget-first",
						audience: "First-time buyers",
						priority: "Low upfront cost",
						priceBand: "$50-$120"
					},
					{
						label: "Best overall value",
						audience: "Most homes",
						priority: "Balanced performance",
						priceBand: "$120-$220"
					},
					{
						label: "Premium build",
						audience: "Frequent cooks",
						priority: "Durability and features",
						priceBand: "$220-$400"
					},
					{
						label: "Small-space friendly",
						audience: "Apartments",
						priority: "Compact footprint",
						priceBand: "$80-$180"
					}
				],
				faq: [
					{
						question: "What is the best small appliance for most homes?",
						answer: "Pick a model that balances performance, size, and easy cleanup over extra features."
					}
				],
				subcategories: [
					{
						slug: "air-fryers",
						name: "Air Fryers",
						description: "Fast, low-oil cooking with everyday value.",
						intentCopy: "Air fryers should deliver crisp results quickly without taking over your counter. We prioritize even cooking, easy cleanup, and value at common price points.",
						published: true,
						intentTable: [
							{
								label: "Budget-first",
								audience: "Small households",
								priority: "Low cost",
								priceBand: "$60-$120"
							},
							{
								label: "Best overall value",
								audience: "Most homes",
								priority: "Balanced performance",
								priceBand: "$120-$200"
							},
							{
								label: "Premium build",
								audience: "Frequent cooks",
								priority: "Durability and capacity",
								priceBand: "$200-$300"
							},
							{
								label: "Small-space friendly",
								audience: "Apartments",
								priority: "Compact footprint",
								priceBand: "$70-$150"
							}
						],
						faq: [
							{
								question: "What size air fryer is best for two people?",
								answer: "A 3-5 quart air fryer is usually enough for two people while staying compact."
							}
						],
						image: "https://pub-d2291ee7d44d475387fd51f65cd369f0.r2.dev/openai/childsubcategories/kitchen/appliances/air-fryers-640w.webp",
						imageSrcset: "https://pub-d2291ee7d44d475387fd51f65cd369f0.r2.dev/openai/childsubcategories/kitchen/appliances/air-fryers-320w.webp 320w, https://pub-d2291ee7d44d475387fd51f65cd369f0.r2.dev/openai/childsubcategories/kitchen/appliances/air-fryers-640w.webp 640w"
					}
				],
				image: "https://pub-d2291ee7d44d475387fd51f65cd369f0.r2.dev/openai/subcategories/kitchen/appliances-640w.webp",
				imageSrcset: "https://pub-d2291ee7d44d475387fd51f65cd369f0.r2.dev/openai/subcategories/kitchen/appliances-320w.webp 320w, https://pub-d2291ee7d44d475387fd51f65cd369f0.r2.dev/openai/subcategories/kitchen/appliances-640w.webp 640w"
			}
		],
		image: "https://pub-d2291ee7d44d475387fd51f65cd369f0.r2.dev/openai/categories/kitchen-640w.webp",
		imageSrcset: "https://pub-d2291ee7d44d475387fd51f65cd369f0.r2.dev/openai/categories/kitchen-320w.webp 320w, https://pub-d2291ee7d44d475387fd51f65cd369f0.r2.dev/openai/categories/kitchen-640w.webp 640w"
	}
];

const productModules = /* #__PURE__ */ Object.assign({"../data/products/air-fryers.json": __vite_glob_0_0});
const toplistModules = /* #__PURE__ */ Object.assign({"../data/toplists/best-air-fryers-2026.json": __vite_glob_1_0});
function getProductsData() {
  return Object.values(productModules).flatMap((module) => module.default ?? []);
}
function getToplistsData() {
  return Object.values(toplistModules).map((module) => module.default).filter(Boolean);
}
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
function assertNonEmpty(value, label) {
  assert(value.trim().length > 0, `${label} must not be empty.`);
}
function assertMaxLength(value, max, label) {
  assert(value.length <= max, `${label} must be ${max} characters or fewer.`);
}
function assertNonEmptyArray(values, label) {
  assert(Array.isArray(values) && values.length > 0, `${label} must not be empty.`);
  for (const value of values) {
    assertNonEmpty(value, `${label} item`);
  }
}
function assertAllowedValues(values, allowed, label) {
  for (const value of values) {
    assert(allowed.includes(value), `${label} contains unsupported value: ${value}`);
  }
}
function assertFaq(items, label) {
  assert(Array.isArray(items) && items.length > 0, `${label} FAQ must not be empty.`);
  for (const item of items) {
    assertNonEmpty(item.question, `${label} FAQ question`);
    assertNonEmpty(item.answer, `${label} FAQ answer`);
  }
}
function getCategories() {
  const categories = categoriesData.filter((category) => category.published);
  assert(Array.isArray(categories) && categories.length > 0, "categories.json must contain at least one published category.");
  const slugs = /* @__PURE__ */ new Set();
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
    const subSlugs = /* @__PURE__ */ new Set();
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
      if (subcategory.imageSrcset) {
        assertNonEmpty(subcategory.imageSrcset, `Subcategory ${subcategory.slug} imageSrcset`);
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
      const childSlugs = /* @__PURE__ */ new Set();
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
        if (childsubcategory.imageSrcset) {
          assertNonEmpty(childsubcategory.imageSrcset, `Child subcategory ${childsubcategory.slug} imageSrcset`);
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
function getProducts() {
  const products = getProductsData().filter((product) => product.published);
  assert(
    Array.isArray(products) && products.length > 0,
    "products data must contain at least one published product."
  );
  const slugs = /* @__PURE__ */ new Set();
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
function getToplists() {
  const toplists = getToplistsData().filter((toplist) => toplist.published);
  assert(Array.isArray(toplists) && toplists.length > 0, "toplists data must contain at least one published toplist.");
  const slugs = /* @__PURE__ */ new Set();
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
    if (toplist.imageSrcset) {
      assertNonEmpty(toplist.imageSrcset, `Toplist ${toplist.slug} imageSrcset`);
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
let cachedIndex = null;
function buildDataIndexInternal() {
  const categories = getCategories();
  const products = getProducts();
  const toplists = getToplists();
  const categoryMap = /* @__PURE__ */ new Map();
  const subcategoryMap = /* @__PURE__ */ new Map();
  const childSubcategoryMap = /* @__PURE__ */ new Map();
  for (const category of categories) {
    categoryMap.set(category.slug, category);
    for (const subcategory of category.subcategories) {
      subcategoryMap.set(`${category.slug}:${subcategory.slug}`, subcategory);
      for (const childsubcategory of subcategory.subcategories) {
        childSubcategoryMap.set(`${category.slug}:${subcategory.slug}:${childsubcategory.slug}`, childsubcategory);
      }
    }
  }
  const productMap = /* @__PURE__ */ new Map();
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
function buildDataIndex() {
  if (!cachedIndex) {
    cachedIndex = buildDataIndexInternal();
  }
  return cachedIndex;
}
function getTopListData(categorySlug, subcategorySlug, count, slug, childSlug) {
  const { categories, toplists, productMap } = buildDataIndex();
  const list = toplists.find(
    (item) => item.category === categorySlug && item.subcategory === subcategorySlug && String(item.count) === String(count) && item.keywordSlug === slug && (true)
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
function getBestToplistForChild(categorySlug, subcategorySlug, childSlug) {
  const { toplists } = buildDataIndex();
  const candidates = toplists.filter(
    (list) => list.category === categorySlug && list.subcategory === subcategorySlug && list.childsubcategory === childSlug
  );
  if (candidates.length === 0) {
    return null;
  }
  return candidates.slice().sort((a, b) => {
    if (b.performanceScore !== a.performanceScore) {
      return b.performanceScore - a.performanceScore;
    }
    return b.count - a.count;
  })[0];
}
function getCategoryData(slugPath) {
  const { categories, toplists } = buildDataIndex();
  const segments = Array.isArray(slugPath) ? slugPath : slugPath.split("/").filter(Boolean);
  const [categorySlug, subcategorySlug, childSlug] = segments;
  const category = categories.find((item) => item.slug === categorySlug);
  if (!category) {
    throw new Error(`Missing category data for slug: ${categorySlug}`);
  }
  const subcategory = subcategorySlug ? category.subcategories.find((item) => item.slug === subcategorySlug) : void 0;
  if (subcategorySlug && !subcategory) {
    throw new Error(`Missing subcategory data for slug: ${categorySlug}:${subcategorySlug}`);
  }
  const childsubcategory = childSlug ? subcategory?.subcategories.find((item) => item.slug === childSlug) : void 0;
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
function getProductData(slug) {
  const { products } = buildDataIndex();
  const product = products.find((item) => item.slug === slug);
  if (!product) {
    throw new Error(`Missing product data for slug: ${slug}`);
  }
  return product;
}

const dataIndex = buildDataIndex();
function getDataIndex() {
  return dataIndex;
}

function homeUrl() {
  return "/";
}
function categoryUrl(categorySlug) {
  return `/category/${categorySlug}/`;
}
function subcategoryUrl(categorySlug, subcategorySlug) {
  return `/category/${categorySlug}/${subcategorySlug}/`;
}
function childSubcategoryUrl(categorySlug, subcategorySlug, childSlug) {
  return `/category/${categorySlug}/${subcategorySlug}/${childSlug}/`;
}
function toplistUrl(categorySlug, subcategorySlug, childSlug, count, keywordSlug) {
  return `/category/${categorySlug}/${subcategorySlug}/${childSlug}/top-${count}-${keywordSlug}/`;
}
function subcategoryToplistUrl(categorySlug, subcategorySlug, count, keywordSlug) {
  return `/category/${categorySlug}/${subcategorySlug}/top-${count}-${keywordSlug}/`;
}
function productUrl(productSlug) {
  return `/product/${productSlug}/`;
}

export { childSubcategoryUrl as a, subcategoryToplistUrl as b, categoryUrl as c, getCategoryData as d, getBestToplistForChild as e, getTopListData as f, getDataIndex as g, getProductData as h, homeUrl as i, productUrl as p, subcategoryUrl as s, toplistUrl as t };
