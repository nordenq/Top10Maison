import type { Product } from "./data";

export type ProductFaqItem = {
  question: string;
  answer: string;
};

const normalizeCategory = (value?: string): string => {
  const cleaned = value?.trim().toLowerCase() ?? "";
  if (!cleaned) return "product";
  if (cleaned.endsWith("s") && cleaned.length > 3) {
    return cleaned.slice(0, -1);
  }
  return cleaned;
};

const findSpecValue = (specs: Record<string, string>, keys: string[]): string | null => {
  const entries = Object.entries(specs ?? {});
  for (const [label, value] of entries) {
    const normalized = label.toLowerCase();
    if (keys.some((key) => normalized.includes(key))) {
      return value.trim();
    }
  }
  return null;
};

const toSentenceCase = (value: string): string => {
  if (!value) return value;
  return value[0].toLowerCase() + value.slice(1);
};

export const buildProductFaqs = (product: Product, categoryLabel?: string): ProductFaqItem[] => {
  const faqs: ProductFaqItem[] = [];
  const category = normalizeCategory(categoryLabel);
  const specs = product.specs ?? {};
  const usedTags = new Set<string>();

  const addFaq = (question: string, answer: string) => {
    if (!question || !answer) return;
    if (faqs.some((item) => item.question === question)) return;
    faqs.push({ question, answer });
  };

  const capacity = findSpecValue(specs, ["capacity"]);
  if (capacity) {
    addFaq(
      `Is this ${category} big enough for a family?`,
      `It lists a capacity of ${capacity}, which can work for family-size portions depending on what you cook.`
    );
    usedTags.add("capacity");
  }

  const fanSpeeds = findSpecValue(specs, ["fan speed", "fan speeds", "airflow"]);
  const power = fanSpeeds ? null : findSpecValue(specs, ["power", "watt"]);
  const cookingModes = findSpecValue(specs, ["functions", "cooking modes", "temperature range"]);
  const isFryer = category.includes("fryer");
  if (isFryer && (fanSpeeds || power || cookingModes)) {
    const fanLabel = fanSpeeds
      ? fanSpeeds.toLowerCase().includes("fan")
        ? fanSpeeds
        : `${fanSpeeds} fan speeds`
      : null;
    const crispingAnswer = fanLabel
      ? `It offers ${fanLabel}, which helps tune airflow for more even crisping.`
      : power
        ? `It uses ${power}, which supports steady heat for crisping.`
        : `It includes ${cookingModes}, so you can adjust settings to target crisping.`;
    addFaq(`How well does this ${category} crisp food?`, crispingAnswer);
    if (fanSpeeds) usedTags.add("fan");
    if (power) usedTags.add("power");
    if (cookingModes) usedTags.add("functions");
  }

  const basketType = findSpecValue(specs, ["basket type", "basket"]);
  const cleaning = findSpecValue(specs, ["cleaning", "dishwasher"]);
  if (basketType || cleaning) {
    const basketLabel = basketType
      ? basketType.toLowerCase().includes("basket")
        ? basketType
        : `${basketType} basket`
      : null;
    const cleaningAnswer = cleaning
      ? `It lists ${toSentenceCase(cleaning)}, which helps with cleanup.`
      : `It uses a ${basketLabel}, so regular hand washing keeps it in good shape.`;
    addFaq("Is the basket easy to clean?", cleaningAnswer);
    if (basketType) usedTags.add("basket");
    if (cleaning) usedTags.add("cleaning");
  }

  const footprint = findSpecValue(specs, ["footprint", "dimensions", "size"]);
  const style = footprint ? null : findSpecValue(specs, ["style"]);
  if (footprint || style) {
    const normalized = footprint?.toLowerCase() ?? "";
    const footprintAnswer = footprint
      ? normalized.includes("compact")
        ? `It has a compact footprint, which helps it fit on smaller counters.`
        : normalized.includes("large")
          ? `It has a large footprint, so plan for extra counter space.`
          : `It measures ${footprint}, so check your counter clearance.`
      : `It uses a ${toSentenceCase(style ?? "countertop")} style, so check your counter space before buying.`;
    addFaq("Does it take up a lot of counter space?", footprintAnswer);
    if (footprint) usedTags.add("footprint");
    if (style) usedTags.add("style");
  }

  const signatureCandidates = [
    {
      tag: "steam",
      keys: ["steam feature"],
      question: "Does it use steam during cooking?",
      answer: (value: string) => `It includes ${value}, which adds steam during cooking.`
    },
    {
      tag: "visibility",
      keys: ["visibility"],
      question: "Can you see the food while it cooks?",
      answer: (value: string) => `It offers ${value}, so you can monitor food as it cooks.`
    },
    {
      tag: "zones",
      keys: ["zones"],
      question: "Does it have dual zones?",
      answer: (value: string) => `It offers ${value}, letting you cook two foods separately.`
    },
    {
      tag: "lid",
      keys: ["lid system"],
      question: "How does the lid system work?",
      answer: (value: string) => `It uses a ${toSentenceCase(value)} lid system.`
    },
    {
      tag: "controls",
      keys: ["controls"],
      question: "Are the controls easy to use?",
      answer: (value: string) => `Controls are ${toSentenceCase(value)}, keeping operation straightforward.`
    },
    {
      tag: "temperature",
      keys: ["temperature range"],
      question: "Does it offer a wide temperature range?",
      answer: (value: string) => `It lists ${value}, which helps with different recipes.`
    },
    {
      tag: "warranty",
      keys: ["warranty"],
      question: "What warranty does it include?",
      answer: (value: string) => `It comes with ${value} warranty coverage.`
    },
    {
      tag: "functions",
      keys: ["functions", "cooking modes"],
      question: "What cooking functions does it offer?",
      answer: (value: string) => `It offers ${value}.`
    },
    {
      tag: "design",
      keys: ["design"],
      question: "What is the design style?",
      answer: (value: string) => `It uses a ${toSentenceCase(value)} design.`
    },
    {
      tag: "style",
      keys: ["style"],
      question: "What style is it?",
      answer: (value: string) => `It is a ${toSentenceCase(value)} style model.`
    }
  ];

  for (const candidate of signatureCandidates) {
    if (faqs.length >= 5) break;
    if (usedTags.has(candidate.tag)) continue;
    const value = findSpecValue(specs, candidate.keys);
    if (!value) continue;
    addFaq(candidate.question, candidate.answer(value));
    usedTags.add(candidate.tag);
  }

  return faqs.slice(0, 5);
};
