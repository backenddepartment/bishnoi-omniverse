#!/usr/bin/env node
/**
 * Writes lib/data/pageDates.json: for each page in the sitemap, the date its content last changed,
 * read from git history. sitemap.xml uses it for <lastmod>, so Google sees real edit dates rather
 * than the time of the build (which changes every hour and teaches Google to ignore the field).
 *
 *   Company pages      the newest commit touching the page's own files (see STATIC_SOURCES)
 *   Category pages     the newest change to the category or any of its products, or its template
 *   Product pages      the newest change to the product's row in the catalog, or its template
 *
 * Catalog rows are compared commit by commit in lib/data/catalogData.json, so editing one product
 * moves only that product's date. A row the build has just synced from the Google Sheet that differs
 * from the committed file has no known edit date; it gets today's date, as the content really did
 * change. Commit the synced catalog now and then so those dates settle.
 *
 * Needs the full git history (`fetch-depth: 0` in the deploy workflow). Without git, or on a shallow
 * clone, the committed pageDates.json is left as it is.
 *
 * Run: node scripts/page-dates.mjs  (also part of `npm run build` and the deploy workflow)
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG_FILE = 'lib/data/catalogData.json';
const OUT_FILE = 'lib/data/pageDates.json';

// The files whose edits change what each company page shows. Paths are relative to the repo root;
// a directory covers everything in it.
const STATIC_SOURCES = {
  '/': ['app/page.tsx', 'lib/data/homepageData.json', 'components/HeroSlider.tsx', 'components/WhatWeDoBand.tsx'],
  '/medical-equipment/': ['app/medical-equipment/page.tsx', 'components/catalog/CatalogBrowser.tsx'],
  '/catalog/': ['app/catalog/page.tsx'],
  '/articles/': ['app/articles', 'lib/data/articlesData.json', 'components/articles'],
  '/specialty-medicines/': ['app/specialty-medicines'],
  '/llp/': ['app/llp', 'lib/data/sectionDetailData.json'],
  '/corp/': ['app/corp', 'lib/data/sectionDetailData.json'],
  '/quality/': ['app/quality', 'components/about/quality'],
  '/global-network/': ['app/global-network', 'components/about/global-network'],
  '/global/': ['app/global', 'components/about/group-structure'],
  '/trade-partners/': ['app/trade-partners', 'components/about/trade-partners'],
  '/about/': ['app/about/page.tsx', 'components/AboutSections.tsx', 'lib/data/businessesData.json'],
  '/about/leadership/': ['app/about/leadership', 'components/about/leadership'],
  '/about/vision-values/': ['app/about/vision-values', 'components/about/vision-values'],
  '/about/governance/': ['app/about/governance', 'components/about/governance'],
  '/contact/': ['app/contact', 'components/about/contact', 'lib/data/contactData.json'],
  '/faq/': ['app/faq', 'lib/data/homepageData.json', 'lib/data/partnerFaqData.json'],
};

const CATEGORY_TEMPLATE = [
  'app/medical-equipment/[category]/page.tsx',
  'components/catalog/CatalogBrowser.tsx',
  'lib/categoryOverviews.ts',
  'lib/categorySeo.ts',
];
const PRODUCT_TEMPLATE = ['app/medical-equipment/[category]/[product]/page.tsx', 'components/ProductDetail.tsx'];

const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();

function canUseGit() {
  try {
    return git('rev-parse', '--is-shallow-repository') === 'false';
  } catch {
    return false;
  }
}

/** YYYY-MM-DD of the newest commit touching any of the paths, or undefined if none has. */
function lastCommitDate(paths) {
  return git('log', '-1', '--format=%cs', '--', ...paths) || undefined;
}

const newest = (...dates) => dates.filter(Boolean).sort().at(-1);
const today = new Date().toISOString().slice(0, 10);

function main() {
  if (!canUseGit()) {
    console.log(`[page-dates] No full git history here; keeping the committed ${OUT_FILE}.`);
    return;
  }

  const dates = {};
  for (const [page, sources] of Object.entries(STATIC_SOURCES)) {
    const date = lastCommitDate(sources);
    if (date) dates[page] = date;
  }

  // Walk the catalog's history oldest first, noting when each category and product row changed.
  const rowDate = new Map();
  const previous = new Map();
  const commits = git('log', '--reverse', '--format=%H %cs', '--', CATALOG_FILE).split('\n').filter(Boolean);
  const record = (catalog, date) => {
    for (const [kind, rows] of [['category', catalog.categories ?? []], ['product', catalog.products ?? []]]) {
      for (const row of rows) {
        const key = `${kind}:${row.id}`;
        const json = JSON.stringify(row);
        if (previous.get(key) !== json) {
          previous.set(key, json);
          rowDate.set(key, date);
        }
      }
    }
  };
  for (const line of commits) {
    const [hash, date] = line.split(' ');
    try {
      record(JSON.parse(git('show', `${hash}:${CATALOG_FILE}`)), date);
    } catch {
      // A commit where the file did not parse or was removed: nothing to learn from it.
    }
  }
  // The catalog as this build will publish it (possibly just synced from the sheet).
  const live = JSON.parse(readFileSync(path.join(root, CATALOG_FILE), 'utf8'));
  record(live, today);

  const categoryTemplate = lastCommitDate(CATEGORY_TEMPLATE);
  const productTemplate = lastCommitDate(PRODUCT_TEMPLATE);
  const productDates = {};
  for (const product of live.products) {
    const date = newest(rowDate.get(`product:${product.id}`), productTemplate);
    dates[`/medical-equipment/${product.categoryId}/${product.id}/`] = date;
    productDates[product.categoryId] = newest(productDates[product.categoryId], date);
  }
  for (const category of live.categories) {
    dates[`/medical-equipment/${category.id}/`] = newest(
      rowDate.get(`category:${category.id}`),
      productDates[category.id],
      categoryTemplate
    );
  }

  const sorted = Object.fromEntries(Object.entries(dates).filter(([, d]) => d).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(path.join(root, OUT_FILE), `${JSON.stringify(sorted, null, 2)}\n`);
  console.log(`[page-dates] Wrote ${Object.keys(sorted).length} page dates to ${OUT_FILE}.`);
}

main();
