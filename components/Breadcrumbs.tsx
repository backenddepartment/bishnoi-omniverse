import React from 'react';
import Link from 'next/link';
import { absoluteUrl } from '@/lib/siteUrl';
import type { Crumb } from '@/lib/catalogRoutes';

/** Site paths are served with a trailing slash (next.config `trailingSlash`). */
const withTrailingSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`);

/**
 * The trail from Home down to the current page. Every crumb but the last is a link, so a visitor
 * (or a crawler) can step back up one level at a time. The same trail is published as
 * schema.org BreadcrumbList data, which is what search engines read to show it in results.
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(withTrailingSlash(item.href)) } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={`breadcrumbs${className ? ` ${className}` : ''}`}>
      <ol>
        {items.map((item, idx) => (
          <li key={`${idx}-${item.label}`}>
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        // "<" is escaped so a product name can never close the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
    </nav>
  );
}
