#!/usr/bin/env node
/**
 * Pulls the medical equipment catalog from a Google Sheet and writes lib/data/catalogData.json.
 *
 * The site is a static export, so there is no server to query the sheet at request time. Instead
 * the sheet is read once per build: edit the sheet, rebuild, and the catalog page, the header's
 * mega-menu and every /catalog/<id>/ detail page follow.
 *
 * Configure the sheet with one environment variable:
 *   CATALOG_SHEET_CSV   CSV URL of the "Medical Equipment Catalog" tab
 *
 * With it unset the script is a no-op, so local builds and anyone cloning the repo keep working
 * from the committed JSON. See docs/catalog-sheet.md for the column reference.
 *
 * Safety: the existing JSON is only overwritten once the whole sheet has parsed and validated.
 * Any failure exits non-zero without writing, which fails the build and leaves the last good
 * deploy live rather than publishing an empty catalog.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { parseCsvRecords } from './csv.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_FILE = resolve(ROOT, 'lib/data/catalogData.json');

const SHEET_CSV = process.env.CATALOG_SHEET_CSV;

const errors = [];
const warnings = [];

/**
 * Sheet column -> product field. Header names are matched lower-cased and trimmed, so the
 * asterisks the sheet uses to mark type-level reference columns are part of the key.
 */
const COLUMNS = {
  category: 'category',
  subcategory: 'subcategory',
  product: 'product',
  description: 'description',
  specifications: 'specifications',
  sterility: 'sterile / non-sterile',
  reuse: 'disposable / reusable',
  sizes: 'common sizes / capacity',
  regulatoryClass: 'typical regulatory class*',
  precautions: 'key precautions / warnings*',
  useSetting: 'typical use setting*',
  endUser: 'primary end user*',
  // Optional, not in the sheet today: a filename in public/products lets a product carry a real
  // photo once one has been licensed and committed. Without it the page falls back to the
  // category icon. The sheet's "Reference Image URL" column is deliberately NOT used — those
  // are research links to Pexels/Wikimedia article pages, not licensed image files, and the
  // sheet's own Notes tab says not to publish them without verifying each licence first.
  imageFile: 'image file',
  imageAlt: 'image alt',
  imageCredit: 'image credit',
  imageSource: 'image source',
};

/** "Fluid & IV Therapy" -> "fluid-and-iv-therapy" */
function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Returns a slug that is unique within `taken`: the preferred slug, else each fallback in turn,
 * else a numeric suffix — so a product name that appears under two categories gets a stable,
 * readable URL rather than an arbitrary one.
 */
function uniqueSlug(preferred, fallbacks, taken) {
  for (const candidate of [preferred, ...fallbacks]) {
    if (candidate && !taken.has(candidate)) return candidate;
  }
  let n = 2;
  while (taken.has(`${preferred}-${n}`)) n++;
  return `${preferred}-${n}`;
}

async function fetchCsv(url, label) {
  const response = await fetch(url, { redirect: 'follow' });

  if (!response.ok) {
    throw new Error(`${label}: sheet request failed with HTTP ${response.status} ${response.statusText}`);
  }

  const body = await response.text();

  // A sheet that is not shared (or a wrong URL) answers with an HTML sign-in page rather than
  // an HTTP error, so check the shape of the body too.
  if (/^\s*</.test(body)) {
    throw new Error(
      `${label}: got an HTML page instead of CSV. Check the spreadsheet is shared as ` +
        `"anyone with the link can view" and that the URL ends in format=csv or output=csv.`
    );
  }

  const records = parseCsvRecords(body);
  if (records.length === 0) {
    throw new Error(`${label}: the sheet has a header row but no data rows.`);
  }

  return records;
}

function build(records) {
  const categories = [];
  const categoryById = new Map();
  const subcategories = [];
  const subcategoryIds = new Set();
  const products = [];
  const productIds = new Set();

  // Check the sheet still has the columns we depend on, rather than reporting 306 identical
  // errors when someone renames a header.
  const present = new Set(Object.keys(records[0]));
  for (const key of ['category', 'subcategory', 'product', 'description']) {
    if (!present.has(COLUMNS[key])) {
      errors.push(
        `The sheet has no "${COLUMNS[key]}" column. Found: ` +
          `${[...present].filter((c) => c !== '__row').join(', ')}`
      );
    }
  }
  if (errors.length > 0) return { categories, subcategories, products };

  for (const record of records) {
    const categoryName = record[COLUMNS.category];
    const subcategoryName = record[COLUMNS.subcategory];
    const productName = record[COLUMNS.product];

    if (!categoryName || !subcategoryName || !productName) {
      errors.push(
        `Row ${record.__row}: Category, Subcategory and Product are all required ` +
          `(got "${categoryName}" / "${subcategoryName}" / "${productName}").`
      );
      continue;
    }

    const categoryId = slugify(categoryName);
    let category = categoryById.get(categoryId);
    if (!category) {
      category = { id: categoryId, name: categoryName, description: '', subcategoryNames: [] };
      categoryById.set(categoryId, category);
      categories.push(category);
    }

    // Namespaced under its category, so the same subcategory name can appear in two categories.
    const subcategoryId = `${categoryId}--${slugify(subcategoryName)}`;
    if (!subcategoryIds.has(subcategoryId)) {
      subcategoryIds.add(subcategoryId);
      subcategories.push({ id: subcategoryId, categoryId, name: subcategoryName });
      category.subcategoryNames.push(subcategoryName);
    }

    // 12 product names appear under more than one category, so the category is the first
    // tie-breaker: "ventilators" and "ventilators-emergency-and-critical-care".
    const baseSlug = slugify(productName);
    const productId = uniqueSlug(baseSlug, [`${baseSlug}-${categoryId}`], productIds);
    productIds.add(productId);

    const product = {
      id: productId,
      categoryId,
      subcategoryId,
      name: productName,
      description: record[COLUMNS.description] ?? '',
      specifications: record[COLUMNS.specifications] ?? '',
      sterility: record[COLUMNS.sterility] ?? '',
      reuse: record[COLUMNS.reuse] ?? '',
      sizes: record[COLUMNS.sizes] ?? '',
      regulatoryClass: record[COLUMNS.regulatoryClass] ?? '',
      precautions: record[COLUMNS.precautions] ?? '',
      useSetting: record[COLUMNS.useSetting] ?? '',
      endUser: record[COLUMNS.endUser] ?? '',
    };

    const imageFile = record[COLUMNS.imageFile] ?? '';
    if (imageFile) {
      const rooted = /^(https?:)?\/\//.test(imageFile) || imageFile.startsWith('/');
      product.image = {
        src: rooted ? imageFile : `/products/${imageFile}`,
        alt: record[COLUMNS.imageAlt] || productName,
        credit: record[COLUMNS.imageCredit] ?? '',
        source: record[COLUMNS.imageSource] ?? '',
      };
    }

    if (!product.description) {
      warnings.push(`Row ${record.__row} ("${productName}"): no description.`);
    }

    products.push(product);
  }

  // The sheet has no category blurb, so describe each category by what is actually in it.
  // This feeds the header's mega-menu.
  for (const category of categories) {
    const names = category.subcategoryNames;
    category.description = names.length > 0 ? `${names.join(', ')}.` : '';
    delete category.subcategoryNames;
  }

  return { categories, subcategories, products };
}

async function main() {
  if (!SHEET_CSV) {
    console.log('[catalog] CATALOG_SHEET_CSV not set — keeping the committed lib/data/catalogData.json.');
    return;
  }

  console.log('[catalog] Fetching the sheet…');
  const records = await fetchCsv(SHEET_CSV, 'Medical Equipment Catalog');

  const { categories, subcategories, products } = build(records);

  if (errors.length === 0) {
    if (categories.length === 0) errors.push('No usable categories in the sheet.');
    if (products.length === 0) errors.push('No usable products in the sheet.');
  }

  const shown = warnings.slice(0, 15);
  for (const warning of shown) console.warn(`[catalog] warning — ${warning}`);
  if (warnings.length > shown.length) {
    console.warn(`[catalog] …and ${warnings.length - shown.length} more warning(s).`);
  }

  if (errors.length > 0) {
    console.error(`\n[catalog] ${errors.length} problem(s) in the sheet — nothing was written:`);
    for (const error of errors.slice(0, 25)) console.error(`  • ${error}`);
    if (errors.length > 25) console.error(`  …and ${errors.length - 25} more.`);
    console.error('\nFix the rows above and re-run. The previous catalog is untouched.\n');
    process.exitCode = 1;
    return;
  }

  // Everything else in the file (hero copy, trustBanner, rfqCheckout) stays hand-edited in the
  // repo; only the three sheet-owned keys are replaced.
  const existing = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
  const next = { ...existing, categories, subcategories, products };

  writeFileSync(DATA_FILE, JSON.stringify(next, null, 2) + '\n', 'utf8');

  console.log(
    `[catalog] Wrote ${products.length} products across ${categories.length} categories ` +
      `and ${subcategories.length} subcategories to lib/data/catalogData.json`
  );
}

main().catch((error) => {
  console.error(`\n[catalog] Sync failed — nothing was written.\n  ${error.message}\n`);
  process.exitCode = 1;
});
