// Post-build step for the static export: inlines each page's stylesheets into its HTML so the first
// paint no longer waits on a round trip for the CSS files (PageSpeed "Render-blocking requests" and
// "Network dependency tree").
//
// Next 14's own option for this (experimental.optimizeCss) only runs for the Pages Router, so it
// does nothing for this App Router site. This script does the same job on the exported files.
//
// Every <link rel="stylesheet"> Next writes into a page gets:
//   1. a <style> with the file's contents placed right before it, so the page renders styled from
//      the HTML alone, and
//   2. media="print" with an onload swap back to "all", so the file still downloads (without
//      blocking) and React still finds the link by href when it hydrates and on client navigation.
// The duplicate rules this leaves once the swap fires are identical and in the same order, so the
// cascade is unchanged.
//
// Usage: node scripts/inline-css.mjs [outDir]   (defaults to ./out)

import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.argv[2] ?? 'out');

if (!fs.existsSync(outDir)) {
  console.error(`inline-css: ${outDir} does not exist — run next build first.`);
  process.exit(1);
}

const cssCache = new Map();

/** Reads a stylesheet from the export by its public href, rebasing any relative url()s. */
function readCss(href) {
  if (cssCache.has(href)) return cssCache.get(href);
  // Hrefs carry the deploy's basePath (/bishnoi-omniverse/_next/...); the files sit at out/_next/...
  const rel = href.split(/[?#]/)[0];
  const at = rel.indexOf('/_next/');
  const file = at === -1 ? null : path.join(outDir, rel.slice(at));
  let css = null;
  if (file && fs.existsSync(file)) {
    const dir = path.posix.dirname(href.split(/[?#]/)[0]);
    css = fs
      .readFileSync(file, 'utf8')
      .replace(/url\((['"]?)(?!data:|https?:|\/|#)([^'")]+)\1\)/g, (_, q, p) =>
        `url(${q}${path.posix.normalize(`${dir}/${p}`)}${q})`,
      )
      // A literal </style> inside the CSS would end the inline block early.
      .replace(/<\/style/gi, '<\\/style');
  }
  cssCache.set(href, css);
  return css;
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

const LINK_RE = /<link rel="stylesheet" href="([^"]+)"([^>]*?)\/?>/g;

let pages = 0;
for (const file of walk(outDir)) {
  const html = fs.readFileSync(file, 'utf8');
  let changed = false;
  const next = html.replace(LINK_RE, (tag, href, rest) => {
    if (/\smedia=/.test(rest)) return tag;
    const css = readCss(href);
    if (css == null) return tag;
    changed = true;
    return `<style>${css}</style><link rel="stylesheet" href="${href}"${rest} media="print" onload="this.media='all'"/>`;
  });
  if (changed) {
    fs.writeFileSync(file, next);
    pages += 1;
  }
}

console.log(`inline-css: inlined stylesheets into ${pages} page(s) in ${path.relative(process.cwd(), outDir) || '.'}`);
