export function homeUrl(): string {
  return "/";
}

export function categoryUrl(categorySlug: string): string {
  return `/category/${categorySlug}/`;
}

export function subcategoryUrl(categorySlug: string, subcategorySlug: string): string {
  return `/category/${categorySlug}/${subcategorySlug}/`;
}

export function childSubcategoryUrl(categorySlug: string, subcategorySlug: string, childSlug: string): string {
  return `/category/${categorySlug}/${subcategorySlug}/${childSlug}/`;
}

export function toplistUrl(
  categorySlug: string,
  subcategorySlug: string,
  childSlug: string,
  count: number,
  keywordSlug: string
): string {
  return `/category/${categorySlug}/${subcategorySlug}/${childSlug}/top-${count}-${keywordSlug}/`;
}

export function productUrl(productSlug: string): string {
  return `/product/${productSlug}/`;
}

export function blogUrl(postSlug: string): string {
  return `/blog/${postSlug}/`;
}
