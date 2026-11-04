#!/usr/bin/env node
/**
 * Writes lib/data/productCopy.json (the unique product descriptions and specifications that
 * replace shared or template text from the sheet, see scripts/catalog-overrides.mjs) as a CSV, so
 * the same text can be pasted into the Google Sheet's Description and Specifications columns.
 * Once a row in the sheet has its own text, its entry in productCopy.json can be deleted.
 *
 * Usage: node scripts/export-product-copy.mjs [out.csv]   (default: product-copy-for-sheet.csv)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(process.cwd(), process.argv[2] ?? 'product-copy-for-sheet.csv');
const copy = JSON.parse(readFileSync(resolve(ROOT, 'lib/data/productCopy.json'), 'utf8'));
const catalog = JSON.parse(readFileSync(resolve(ROOT, 'lib/data/catalogData.json'), 'utf8'));
const categoryName = new Map(catalog.categories.map((c) => [c.id, c.name]));

const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
const rows = [['Product', 'Category', 'Description', 'Specifications'].map(q).join(',')];
for (const p of catalog.products) {
  const c = copy[p.id];
  if (!c) continue;
  rows.push([p.name, categoryName.get(p.categoryId), c.description ?? '', c.specifications ?? ''].map(q).join(','));
}
writeFileSync(out, `﻿${rows.join('\r\n')}\r\n`);
console.log(`Wrote ${rows.length - 1} rows to ${out}`);
