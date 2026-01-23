import { getCategories } from "./data";
import { categoryUrl, childSubcategoryUrl, subcategoryUrl } from "./routes";

export type BrowseByLeaf = {
  id: string;
  label: string;
  href: string;
};

export type BrowseByCategory = {
  id: string;
  label: string;
  href: string;
  items: BrowseByLeaf[];
};

export type BrowseByGroup = {
  id: string;
  label: string;
  href?: string;
  categories: BrowseByCategory[];
};

export type BrowseByMode = {
  id: string;
  label: string;
  items: BrowseByGroup[];
};

export type BrowseByConfig = Record<string, BrowseByMode>;

function buildRoomMode(): BrowseByMode {
  const categories = getCategories();

  const items = categories.map((category) => ({
    id: category.slug,
    label: category.name,
    categories: category.subcategories.map((subcategory) => ({
      id: subcategory.slug,
      label: subcategory.name,
      href: subcategoryUrl(category.slug, subcategory.slug),
      items: subcategory.subcategories.map((child) => ({
        id: child.slug,
        label: child.name,
        href: childSubcategoryUrl(category.slug, subcategory.slug, child.slug)
      }))
    })),
    href: categoryUrl(category.slug)
  }));

  return {
    id: "room",
    label: "Room",
    items
  };
}

export const browseByModes: BrowseByConfig = {
  room: buildRoomMode()
};

export const defaultBrowseModeId = "room";
