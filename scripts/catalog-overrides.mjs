/**
 * Corrections applied to the catalog on every sync, on top of the Google Sheet, so they hold
 * however the sheet is edited (scripts/sync-catalog.mjs). Each should eventually be made in the
 * sheet itself; once it is, its entry here can be deleted (it then has no effect).
 *
 *   CATEGORY_MOVES    products the sheet files under the wrong category. Their old URLs are
 *                     redirected automatically (scripts/write-redirects.mjs).
 *   lib/data/productCopy.json   unique descriptions (and specifications) for products whose sheet
 *                     text is a shared template or copied from another product. Duplicate copy is
 *                     the main reason Google leaves product pages "Crawled – currently not indexed".
 *                     scripts/export-product-copy.mjs writes it out as a CSV to paste into the sheet.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { slugify } from './catalog-merge.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const COPY_FILE = resolve(ROOT, 'lib/data/productCopy.json');

/** Product (slug of its name) -> [category id, subcategory id] it belongs in. */
export const CATEGORY_MOVES = {
  'antimicrobial-wound-dressings-silver-phmb': ['wound-care', 'wound-care--wound-dressings'],
  'chemotherapy-administration-sets-non-dehp-tubing': ['infusion-and-injection', 'infusion-and-injection--infusion-equipment'],
  'peripherally-inserted-central-catheters-picc': ['infusion-and-injection', 'infusion-and-injection--infusion-equipment'],
  'central-venous-catheters-cvc': ['infusion-and-injection', 'infusion-and-injection--infusion-equipment'],
  'needleless-iv-connectors': ['infusion-and-injection', 'infusion-and-injection--infusion-equipment'],
  'iv-cannulas-iv-catheters': ['infusion-and-injection', 'infusion-and-injection--infusion-equipment'],
  'surgical-sutures-absorbable-and-non-absorbable': ['surgical-equipment', 'surgical-equipment--surgical-instruments'],
  'surgical-staplers-skin-and-internal': ['surgical-equipment', 'surgical-equipment--surgical-instruments'],
  'surgical-meshes-hernia-repair': ['surgical-equipment', 'surgical-equipment--operating-room-equipment'],
  'laparoscopic-disposables-trocar-sets': ['surgical-equipment', 'surgical-equipment--operating-room-equipment'],
  'hemostatic-products-and-devices': ['surgical-equipment', 'surgical-equipment--operating-room-equipment'],
  'foley-catheters-indwelling-urinary-catheters': ['urology', 'urology--urinary-catheters'],
  'leukoreduction-blood-filters': ['laboratory-equipment', 'laboratory-equipment--blood-bank'],
  'blood-bags-collection-sets': ['laboratory-equipment', 'laboratory-equipment--blood-bank'],
  'closed-system-transfer-devices-cstd': ['pharmacy-and-medication-storage', 'pharmacy-and-medication-storage--pharmacy-equipment'],
};

/** Moves mis-filed products (before merging, so moved rows merge with rows already there). */
export function applyCategoryMoves(products, subcategories) {
  const subIds = new Set(subcategories.map((s) => s.id));
  return products.map((p) => {
    const move = CATEGORY_MOVES[slugify(p.name)];
    if (!move) return p;
    const [categoryId, subcategoryId] = move;
    if (!subIds.has(subcategoryId)) {
      console.warn(`[catalog] move skipped for "${p.name}": no subcategory ${subcategoryId}`);
      return p;
    }
    return { ...p, categoryId, subcategoryId };
  });
}

/** Replaces shared or template copy with the product's own (lib/data/productCopy.json). */
export function applyProductCopy(products) {
  if (!existsSync(COPY_FILE)) return products;
  const copy = JSON.parse(readFileSync(COPY_FILE, 'utf8'));
  return products.map((p) => {
    const c = copy[p.id];
    if (!c) return p;
    return {
      ...p,
      ...(c.description ? { description: c.description } : {}),
      ...(c.specifications ? { specifications: c.specifications } : {}),
    };
  });
}

/**
 * Drops subcategories no product is listed in any more (after moves and merges), and rebuilds
 * each category's description from its remaining subcategories, as the sync does.
 */
export function pruneSubcategories(categories, subcategories, products) {
  const used = new Set();
  for (const p of products) {
    used.add(p.subcategoryId);
    for (const l of p.alsoListedIn ?? []) used.add(l.subcategoryId);
  }
  const kept = subcategories.filter((s) => used.has(s.id));
  const nextCategories = categories.map((c) => {
    const names = kept.filter((s) => s.categoryId === c.id).map((s) => s.name);
    return { ...c, description: names.length ? `${names.join(', ')}.` : c.description };
  });
  return { categories: nextCategories, subcategories: kept };
}
