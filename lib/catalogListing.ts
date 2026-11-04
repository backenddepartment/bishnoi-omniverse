import catalogData from '@/lib/data/catalogData.json';

/**
 * Helpers for the merged catalog (scripts/catalog-merge.mjs). A product the sheet lists under
 * several categories has one page, under its owning category; the other categories are in
 * `alsoListedIn`, so their pages still list it, linking to that one page. Ids that no longer have
 * a page of their own map to the id that replaced them in `productAliases`.
 */

export type Listing = { categoryId: string; subcategoryId: string };

type CatalogProduct = (typeof catalogData.products)[number];

/** The other categories (and their subcategory) a product is shown in. */
export function alsoListedIn(product: CatalogProduct | object): Listing[] {
  return (product as { alsoListedIn?: Listing[] }).alsoListedIn ?? [];
}

/** Other names the product is sold under, for search. */
export function alsoKnownAs(product: CatalogProduct | object): string[] {
  return (product as { alsoKnownAs?: string[] }).alsoKnownAs ?? [];
}

const ALIASES: Record<string, string> = catalogData.productAliases ?? {};

/** The current id for an id that may have been merged into another product. */
export function resolveProductId(id: string): string {
  return ALIASES[id] ?? id;
}

/** The product for an id, following merges, so quote lists saved before a merge still resolve. */
export function findProductById(id: string): CatalogProduct | undefined {
  const current = resolveProductId(id);
  return catalogData.products.find((p) => p.id === current);
}
