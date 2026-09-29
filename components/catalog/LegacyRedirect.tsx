'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CATALOG_PATH, EQUIPMENT_PATH, categoryPath } from '@/lib/catalogRoutes';

/**
 * The site is a static export, so there is no server to answer an old address with a redirect.
 * A page that has moved is kept as a stub instead, which sends the browser on as soon as it
 * loads. These are full navigations rather than router transitions: a redirect has to land
 * whatever state the app is in.
 */

/**
 * Whatever precedes the site's own paths in the address: nothing on the live domain, the
 * repository name on GitHub Pages. Read from the address, since old links arrive on both.
 */
function siteBase() {
  const path = window.location.pathname;
  const at = path.lastIndexOf(CATALOG_PATH);
  return at > 0 ? path.slice(0, at) : '';
}

/** Forwards /catalog/<product>/ to `href`, a site path without its trailing slash. */
export function LegacyRedirect({ href, label }: { href: string; label: string }) {
  useEffect(() => {
    window.location.replace(`${siteBase()}${href}/`);
  }, [href]);

  return (
    <section className="section section-white">
      {/* For a browser without scripting. Relative, so it holds under a GitHub Pages sub-path:
          the stub is always served two levels down, at /catalog/<product>/. */}
      <meta httpEquiv="refresh" content={`0;url=../..${href}/`} />
      <div className="wrap">
        <p className="text-ink-soft m-0">
          This page has moved. Continue to <Link href={href}>{label}</Link>.
        </p>
      </div>
    </section>
  );
}

/**
 * The catalog used to filter one page by query string. Links in that form still arrive at
 * /catalog, so they are passed on to the page that now holds what they asked for:
 *
 *   /catalog?category=gloves      →  /medical-equipment/gloves/
 *   /catalog?subcategory=<id>     →  /medical-equipment/<category>/?subcategory=<slug>
 *   /catalog?search=<text>        →  /medical-equipment/?search=<text>
 */
export function LegacyCatalogQueryRedirect({
  categoryIds,
  subcategories,
}: {
  categoryIds: string[];
  subcategories: { id: string; categoryId: string; slug: string }[];
}) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subcategory = subcategories.find((s) => s.id === params.get('subcategory'));
    const category = params.get('category');
    const search = params.get('search');

    let path: string;
    const query = new URLSearchParams();
    if (subcategory) {
      path = categoryPath(subcategory.categoryId);
      query.set('subcategory', subcategory.slug);
    } else if (category && categoryIds.includes(category)) {
      path = categoryPath(category);
    } else if (search) {
      path = EQUIPMENT_PATH;
    } else {
      return;
    }
    if (search) query.set('search', search);

    const suffix = query.toString();
    window.location.replace(`${siteBase()}${path}/${suffix && `?${suffix}`}`);
  }, [categoryIds, subcategories]);

  return null;
}
