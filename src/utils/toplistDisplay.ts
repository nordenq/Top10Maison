import type { DataIndex, Toplist } from "./data";
import { buildToplistFraming, inferToplistUseCase, inferToplistYear } from "./toplistNaming";

export type ToplistDisplay = {
  metaTitle: string;
  cardTitle: string;
  h1: string;
  schemaHeadline: string;
  intro: string;
  productName: string;
  year: number;
  useCase: string;
};

export function getToplistDisplay(toplist: Toplist, dataIndex: DataIndex): ToplistDisplay {
  const childKey = `${toplist.category}:${toplist.subcategory}:${toplist.childsubcategory}`;
  const child = dataIndex.childSubcategoryMap.get(childKey);
  const productName = (child?.name ?? "Products").trim();

  const year = inferToplistYear(toplist) ?? new Date().getFullYear();
  const useCase = inferToplistUseCase(toplist) ?? "Everyday Use";

  const framing = buildToplistFraming({
    productName,
    year,
    count: toplist.count,
    useCase
  });

  return {
    metaTitle: framing.title,
    cardTitle: framing.title,
    h1: framing.h1,
    schemaHeadline: framing.schemaHeadline,
    intro: framing.intro,
    productName,
    year,
    useCase
  };
}
