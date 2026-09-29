/**
 * Where the medical equipment catalog lives. Each level is its own page, and each page's URL is
 * its parent's with one more segment, so the address reads the same as the breadcrumb:
 *
 *   /catalog/                                        Home / Catalog
 *   /medical-equipment/                              … / Medical Equipment
 *   /medical-equipment/<category>/                   … / <Category>
 *   /medical-equipment/<category>/<product>/         … / <Product>
 *
 * Subcategories filter their category's page (?subcategory=<slug>) rather than getting a page of
 * their own. Every link to the catalog is built here, so the structure changes in one place.
 */

export const CATALOG_PATH = '/catalog';
export const EQUIPMENT_PATH = '/medical-equipment';

export const CATALOG_LABEL = 'Catalog';
export const EQUIPMENT_LABEL = 'Medical Equipment';

export function categoryPath(categoryId: string) {
  return `${EQUIPMENT_PATH}/${categoryId}`;
}

export function productPath(product: { id: string; categoryId: string }) {
  return `${categoryPath(product.categoryId)}/${product.id}`;
}

// Subcategory ids are "<category>--<subcategory>" (see scripts/sync-catalog.mjs). The category is
// already in the path, so the query string carries only the part after the separator.
const SUBCATEGORY_SEPARATOR = '--';

export function subcategorySlug(subcategoryId: string) {
  const at = subcategoryId.indexOf(SUBCATEGORY_SEPARATOR);
  return at === -1 ? subcategoryId : subcategoryId.slice(at + SUBCATEGORY_SEPARATOR.length);
}

export function subcategoryIdFromSlug(categoryId: string, slug: string) {
  return `${categoryId}${SUBCATEGORY_SEPARATOR}${slug}`;
}

export function subcategoryPath(subcategory: { id: string; categoryId: string }) {
  return `${categoryPath(subcategory.categoryId)}?subcategory=${subcategorySlug(subcategory.id)}`;
}

export interface Crumb {
  label: string;
  /** Left off the last crumb: the page the visitor is already on. */
  href?: string;
}

/** The trail down to a catalog page. Pass nothing for the Medical Equipment page itself. */
export function equipmentCrumbs(
  category?: { id: string; name: string },
  productName?: string
): Crumb[] {
  const crumbs: Crumb[] = [
    { label: 'Home', href: '/' },
    { label: CATALOG_LABEL, href: CATALOG_PATH },
    { label: EQUIPMENT_LABEL, href: EQUIPMENT_PATH },
  ];
  if (category) crumbs.push({ label: category.name, href: categoryPath(category.id) });
  if (productName) crumbs.push({ label: productName });
  // The last crumb is the current page, so it is text rather than a link to itself.
  delete crumbs[crumbs.length - 1].href;
  return crumbs;
}
