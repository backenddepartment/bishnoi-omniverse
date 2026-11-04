#!/usr/bin/env node
/**
 * Post-build step for the static export: writes a redirect page at every address that used to be
 * a product page and no longer is, so old links, bookmarks and Google's index all land on the
 * product's current page.
 *
 * GitHub Pages cannot send an HTTP 301, so each stub is a tiny HTML page whose <head> carries:
 *   - <meta http-equiv="refresh" content="0; url=…">  an instant meta refresh, which Google
 *     treats as a permanent redirect (developers.google.com/search/docs/crawling-indexing/
 *     301-redirects#metarefresh);
 *   - <link rel="canonical"> to the same target, so the signals agree;
 *   - a script that forwards at once, keeping any query string and #hash.
 * Stubs are deliberately NOT marked noindex: that would tell Google to drop the old address
 * rather than pass what it had earned on to the new one. They are never in the sitemap.
 *
 * Addresses covered:
 *   1. every product URL ever published (lib/data/publishedUrls.json, which this script keeps up
 *      to date) that is no longer a page: products merged into one page (scripts/catalog-merge.mjs)
 *      and products moved or renamed in the sheet;
 *   2. with --live-sitemap, any product URL in the currently deployed sitemap that this build no
 *      longer has (catches products published since the snapshot was last committed);
 *   3. the old /catalog/<product>/ address of every product, current and merged.
 *
 * Usage: node scripts/write-redirects.mjs [outDir] [--live-sitemap]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const OUT = path.resolve(ROOT, args.find((a) => !a.startsWith('--')) ?? 'out');
const LIVE = args.includes('--live-sitemap');

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bishnoiomniverse.com').replace(/\/+$/, '');
const CATALOG_FILE = path.join(ROOT, 'lib/data/catalogData.json');
const PUBLISHED_FILE = path.join(ROOT, 'lib/data/publishedUrls.json');
const EQUIPMENT_PATH = '/medical-equipment';
const STUB_MARKER = 'data-redirect-stub';

const catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));
const aliases = catalog.productAliases ?? {};
const productById = new Map(catalog.products.map((p) => [p.id, p]));
const productPath = (p) => `${EQUIPMENT_PATH}/${p.categoryId}/${p.id}/`;
const currentPaths = new Set(catalog.products.map(productPath));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Where an old product address should go: the product (following merges), else its category. */
function targetFor(oldPath, id) {
  const product = productById.get(aliases[id] ?? id);
  if (product) return { path: productPath(product), label: product.name };
  const categoryId = oldPath.split('/')[2];
  const category = catalog.categories.find((c) => c.id === categoryId);
  if (category) return { path: `${EQUIPMENT_PATH}/${category.id}/`, label: category.name };
  return { path: `${EQUIPMENT_PATH}/`, label: 'Medical Equipment' };
}

function stubHtml(target) {
  const url = `${SITE_URL}${target.path}`;
  return `<!doctype html>
<html lang="en" ${STUB_MARKER}>
<head>
<meta charset="utf-8">
<title>${esc(target.label)} | Bishnoi Omniverse</title>
<link rel="canonical" href="${esc(url)}">
<meta http-equiv="refresh" content="0; url=${esc(url)}">
<script>location.replace(${JSON.stringify(url)} + location.search + location.hash);</script>
</head>
<body>
<p>This page has moved to <a href="${esc(url)}">${esc(target.label)}</a>.</p>
</body>
</html>
`;
}

/** Writes a stub at `sitePath` unless a real page already lives there. */
function writeStub(sitePath, target, written) {
  if (sitePath === target.path) return false;
  const file = path.join(OUT, ...sitePath.split('/').filter(Boolean), 'index.html');
  if (fs.existsSync(file) && !fs.readFileSync(file, 'utf8').includes(STUB_MARKER)) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, stubHtml(target));
  written.set(sitePath, target.path);
  return true;
}

async function liveSitemapProductPaths() {
  try {
    const res = await fetch(`${SITE_URL}/sitemap.xml`, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => m[1].trim().replace(SITE_URL, ''))
      .filter((p) => /^\/medical-equipment\/[^/]+\/[^/]+\/$/.test(p));
    console.log(`[redirects] Live sitemap: ${paths.length} product URLs.`);
    return paths;
  } catch (error) {
    console.warn(`[redirects] Could not read the live sitemap (${error.message}); using the committed snapshot only.`);
    return [];
  }
}

async function main() {
  if (!fs.existsSync(OUT)) {
    console.error(`[redirects] ${OUT} does not exist. Run the build first.`);
    process.exitCode = 1;
    return;
  }

  const published = fs.existsSync(PUBLISHED_FILE) ? JSON.parse(fs.readFileSync(PUBLISHED_FILE, 'utf8')) : {};
  if (LIVE) {
    for (const p of await liveSitemapProductPaths()) published[p] ??= p.split('/')[3];
  }

  const written = new Map();

  // 1 + 2. Product addresses that are no longer pages.
  for (const [oldPath, id] of Object.entries(published)) {
    if (currentPaths.has(oldPath)) continue;
    writeStub(oldPath, targetFor(oldPath, id), written);
  }

  // 3. /catalog/<id>/ for every product id, and every id merged into another.
  for (const id of [...productById.keys(), ...Object.keys(aliases)]) {
    const oldPath = `/catalog/${id}/`;
    writeStub(oldPath, targetFor(oldPath, id), written);
  }

  // Keep the snapshot current: every product page this build publishes is a URL that must keep
  // working after it moves. Commit the file when it changes.
  for (const product of catalog.products) published[productPath(product)] ??= product.id;
  const sorted = Object.fromEntries(Object.entries(published).sort(([a], [b]) => a.localeCompare(b)));
  const next = `${JSON.stringify(sorted, null, 2)}\n`;
  if (!fs.existsSync(PUBLISHED_FILE) || fs.readFileSync(PUBLISHED_FILE, 'utf8') !== next) {
    fs.writeFileSync(PUBLISHED_FILE, next);
  }

  const moved = [...written].filter(([from]) => !from.startsWith('/catalog/'));
  console.log(
    `[redirects] Wrote ${written.size} redirect stubs (${moved.length} moved product pages, ` +
      `${written.size - moved.length} old /catalog/ addresses).`
  );
  for (const [from, to] of moved) console.log(`  ${from} -> ${to}`);

  // Sanity: a stub must never point at a page that does not exist.
  const missing = [...new Set(written.values())].filter(
    (p) => !fs.existsSync(path.join(OUT, ...p.split('/').filter(Boolean), 'index.html'))
  );
  if (missing.length) {
    console.error(`[redirects] Stubs point at pages missing from the build: ${missing.join(', ')}`);
    process.exitCode = 1;
  }
}

main();
