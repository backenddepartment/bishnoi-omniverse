'use client';

import { useEffect } from 'react';
import { CATALOG_PATH, EQUIPMENT_PATH, categoryPath } from '@/lib/catalogRoutes';

/**
 * The site is a static export, so there is no server to answer an old address with a redirect.
 * Moved pages (old /catalog/<product>/ addresses, merged products) are plain HTML stubs written
 * after the build by scripts/write-redirects.mjs. This handles the one case a stub cannot: old
 * query-string links to /catalog, which is still a real page. It is a full navigation rather than
 * a router transition: a redirect has to land whatever state the app is in.
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
