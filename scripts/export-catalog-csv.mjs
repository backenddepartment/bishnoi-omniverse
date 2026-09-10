#!/usr/bin/env node
/**
 * Dumps the current lib/data/catalogData.json back out as a CSV matching the Google Sheet's
 * column layout:
 *
 *   npm run catalog:export     ->  catalog-export/catalog.csv
 *
 * Useful as a snapshot of what the site is actually serving, and as a round-trip check: the
 * column order here is the schema sync-catalog.mjs reads back.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { toCsv } from './csv.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'catalog-export');

const COLUMNS = [
  'Category',
  'Subcategory',
  'Product',
  'Description',
  'Specifications',
  'Sterile / Non-Sterile',
  'Disposable / Reusable',
  'Common Sizes / Capacity',
  'Typical Regulatory Class*',
  'Key Precautions / Warnings*',
  'Typical Use Setting*',
  'Primary End User*',
  'Image File',
  'Image Alt',
  'Image Credit',
  'Image Source',
];

const catalog = JSON.parse(readFileSync(resolve(ROOT, 'lib/data/catalogData.json'), 'utf8'));

const categoryName = new Map(catalog.categories.map((c) => [c.id, c.name]));
const subcategoryName = new Map((catalog.subcategories ?? []).map((s) => [s.id, s.name]));

const rows = catalog.products.map((product) => ({
  Category: categoryName.get(product.categoryId) ?? product.categoryId,
  Subcategory: subcategoryName.get(product.subcategoryId) ?? product.subcategoryId,
  Product: product.name,
  Description: product.description,
  Specifications: product.specifications,
  'Sterile / Non-Sterile': product.sterility,
  'Disposable / Reusable': product.reuse,
  'Common Sizes / Capacity': product.sizes,
  'Typical Regulatory Class*': product.regulatoryClass,
  'Key Precautions / Warnings*': product.precautions,
  'Typical Use Setting*': product.useSetting,
  'Primary End User*': product.endUser,
  // Strip the /products/ prefix back to a bare filename — that is what the sheet holds.
  'Image File': (product.image?.src ?? '').replace(/^\/products\//, ''),
  'Image Alt': product.image?.alt ?? '',
  'Image Credit': product.image?.credit ?? '',
  'Image Source': product.image?.source ?? '',
}));

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(resolve(OUT_DIR, 'catalog.csv'), toCsv(COLUMNS, rows), 'utf8');

console.log(`Wrote catalog-export/catalog.csv (${rows.length} products)`);
