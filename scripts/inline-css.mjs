// Post-build step for the static export: inlines each page's critical CSS into its HTML so the
// first paint does not wait on the stylesheet requests (PageSpeed "Render-blocking requests" and
// "Network dependency tree"), and keeps that inline block small ("Reduce unused CSS").
//
// Next 14's own option for this (experimental.optimizeCss, which runs critters) only works for the
// Pages Router, so it does nothing for this App Router site. This script runs beasties — the
// maintained successor of critters — over the exported files instead.
//
// For every page, beasties:
//   1. inlines only the rules that match that page's HTML (plus the @font-face rules it uses),
//   2. turns each <link rel="stylesheet"> into media="print" with an onload swap back to "all", so
//      the full file still loads without blocking — it carries the rules for menus, hover states
//      and anything client code adds later — and React still finds the link by href, and
//   3. adds a <noscript> copy of the link for visitors without JavaScript.
//
// Usage: node scripts/inline-css.mjs [outDir]   (defaults to ./out)

import fs from 'node:fs';
import path from 'node:path';
import Beasties from 'beasties';

const outDir = path.resolve(process.argv[2] ?? 'out');

if (!fs.existsSync(outDir)) {
  console.error(`inline-css: ${outDir} does not exist — run next build first.`);
  process.exit(1);
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '_next') walk(full, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const pages = walk(outDir);

// Stylesheet hrefs carry the deploy's basePath (/bishnoi-omniverse/_next/...) while the files sit at
// out/_next/...; read the prefix off the first stylesheet link rather than from an env variable.
let publicPath = '/';
for (const file of pages) {
  const match = fs.readFileSync(file, 'utf8').match(/<link rel="stylesheet" href="([^"]*?)_next\//);
  if (match) {
    publicPath = match[1];
    break;
  }
}

const beasties = new Beasties({
  path: outDir,
  publicPath,
  preload: 'media',
  noscriptFallback: true,
  // The whole file still loads; only the inline copy is trimmed.
  pruneSource: false,
  inlineFonts: true,
  preloadFonts: false, // next/font already preloads the fonts the page needs.
  keyframes: 'critical',
  compress: true,
  logLevel: 'warn',
});

// next/font pairs each web font with a size-matched local fallback (`__Inter_Fallback_…`, src:
// local("Arial") plus ascent/size overrides), so text keeps its place when the real font swaps in.
// beasties only keeps @font-face rules that point at font files, so those come back here —
// without them the hero text shifts when the fonts load (Cumulative Layout Shift).
const fallbackFaces = new Map();
function fallbackFacesFor(html) {
  let css = '';
  for (const [, href] of html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)) {
    if (!fallbackFaces.has(href)) {
      const at = href.indexOf('/_next/');
      const file = at === -1 ? '' : path.join(outDir, href.split(/[?#]/)[0].slice(at));
      const source = file && fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
      fallbackFaces.set(href, (source.match(/@font-face\{font-family:[\w-]+_Fallback_[\w-]+;[^}]*\}/g) ?? []).join(''));
    }
    css += fallbackFaces.get(href);
  }
  return css;
}

let done = 0;
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('rel="stylesheet"') || html.includes('media="print" onload=')) continue;
  const fallbacks = fallbackFacesFor(html);
  let result = await beasties.process(html);
  if (fallbacks) result = result.replace('<style>', `<style>${fallbacks}`);
  fs.writeFileSync(file, result);
  done += 1;
}

console.log(`inline-css: inlined critical CSS into ${done} page(s) in ${path.relative(process.cwd(), outDir) || '.'}`);
