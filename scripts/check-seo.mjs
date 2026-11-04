#!/usr/bin/env node
/**
 * Post-build SEO gate for the static export. Every URL in sitemap.xml and sitemap-images.xml must
 * be a real, indexable page that Google can trust, following Google's guidance for sitemaps
 * (only canonical URLs you want in search, no redirects, no noindex) and for titles, snippets and
 * canonicals:
 *
 *   errors (fail the build, so the previous deploy stays live)
 *     - the URL has no page in the build, or its page is a redirect stub
 *     - the page carries noindex (meta robots / googlebot)
 *     - the canonical tag is missing or points at another URL
 *     - the title, meta description or H1 is missing
 *     - the title, meta description or H1 is the same as another sitemap page's
 *     - the page still has a "[CONFIRM: …]" note (an unchecked claim in lib/productGuides.ts)
 *   warnings
 *     - title over 60 characters, description over 160 characters (Google truncates them)
 *
 * Usage: node scripts/check-seo.mjs [outDir]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(ROOT, process.argv[2] ?? 'out');
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bishnoiomniverse.com').replace(/\/+$/, '');

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'i'));
  return m ? decode(m[1]) : '';
};

function sitemapLocs(file) {
  const full = path.join(OUT, file);
  if (!fs.existsSync(full)) return [];
  return [...fs.readFileSync(full, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => decode(m[1]))
    .filter((u) => !/\.(jpe?g|png|webp|gif|svg|avif)$/i.test(u));
}

function inspect(url) {
  const sitePath = url.startsWith(SITE_URL) ? url.slice(SITE_URL.length) || '/' : null;
  if (sitePath === null) return { error: `not on ${SITE_URL}` };
  const file = path.join(OUT, ...sitePath.split('/').filter(Boolean), 'index.html');
  if (!fs.existsSync(file)) return { error: 'no page in the build' };
  const html = fs.readFileSync(file, 'utf8');
  const head = html.split(/<\/head>/i)[0];
  const metas = head.match(/<meta[^>]+>/gi) ?? [];
  const meta = (n) => metas.filter((m) => attr(m, 'name').toLowerCase() === n).map((m) => attr(m, 'content'));
  const canonicalTag = (head.match(/<link[^>]+rel="canonical"[^>]*>/i) ?? [''])[0];
  const h1 = html.slice(head.length).match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return {
    // Distinct notes: the page data Next embeds repeats the visible text.
    unconfirmed: new Set(html.match(/\[CONFIRM[^\]<"\\]*/g) ?? []).size,
    stub: html.includes('data-redirect-stub') || metas.some((m) => /http-equiv="refresh"/i.test(m)),
    title: decode((head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) ?? [, ''])[1]),
    description: meta('description')[0] ?? '',
    robots: [...meta('robots'), ...meta('googlebot')].join(', '),
    canonical: canonicalTag ? attr(canonicalTag, 'href') : '',
    h1: h1 ? decode(h1[1].replace(/<[^>]+>/g, ' ')) : '',
  };
}

const urls = [...new Set([...sitemapLocs('sitemap.xml'), ...sitemapLocs('sitemap-images.xml')])];
if (urls.length === 0) {
  console.error(`[seo] No sitemap URLs found in ${OUT}. Run the build first.`);
  process.exit(1);
}

const errors = [];
const warnings = [];
const seen = { title: new Map(), description: new Map(), h1: new Map() };

for (const url of urls) {
  const page = inspect(url);
  const fail = (msg) => errors.push(`${url}: ${msg}`);
  if (page.error) {
    fail(page.error);
    continue;
  }
  if (page.stub) fail('is a redirect, so it must not be in the sitemap');
  if (page.unconfirmed) fail(`has ${page.unconfirmed} unchecked [CONFIRM] note(s) (lib/productGuides.ts)`);
  if (/noindex/i.test(page.robots)) fail(`has robots "${page.robots}"`);
  if (!page.canonical) fail('has no canonical tag');
  else if (page.canonical !== url) fail(`canonical points at ${page.canonical}`);
  for (const key of ['title', 'description', 'h1']) {
    if (!page[key]) {
      fail(`has no ${key === 'h1' ? 'H1' : key}`);
      continue;
    }
    const other = seen[key].get(page[key]);
    if (other) fail(`same ${key === 'h1' ? 'H1' : key} as ${other}: "${page[key]}"`);
    else seen[key].set(page[key], url);
  }
  if (page.title.length > 60) warnings.push(`${url}: title is ${page.title.length} characters`);
  if (page.description.length > 160) warnings.push(`${url}: description is ${page.description.length} characters`);
}

for (const w of warnings) console.warn(`[seo] warning — ${w}`);
if (errors.length) {
  console.error(`\n[seo] ${errors.length} problem(s) across ${urls.length} sitemap URLs:`);
  for (const e of errors) console.error(`  • ${e}`);
  process.exit(1);
}
console.log(`[seo] ${urls.length} sitemap URLs checked: all indexable, self-canonical, with unique titles, descriptions and H1s.`);
