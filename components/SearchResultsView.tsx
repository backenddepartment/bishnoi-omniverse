'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { searchSite } from '@/lib/siteSearch';

const PER_GROUP = 12;

/** Wraps each matched term in <mark>. Terms are normalized to [a-z0-9], so they are regex-safe. */
function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (!text || terms.length === 0) return <>{text}</>;
  const pattern = new RegExp(`(${[...terms].sort((a, b) => b.length - a.length).join('|')})`, 'gi');
  // split() with a capture group puts the matches at the odd indexes.
  return (
    <>
      {text.split(pattern).map((part, idx) =>
        idx % 2 === 1 ? (
          <mark key={idx} className="search-mark">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

/**
 * The full results page the navbar's Enter goes to: every source, 12 per group, matches
 * highlighted. There is no search field here; the navbar's field keeps the query for refining.
 */
export function SearchResultsView() {
  const params = useSearchParams();
  const query = (params.get('q') ?? '').trim().slice(0, 100);
  const results = useMemo(() => (query ? searchSite(query, PER_GROUP) : null), [query]);

  return (
    <div className="w-full search-page">
      <section className="section section-tight">
        <div className="wrap">
          <h1 className="search-page-title">{query ? <>Results for &ldquo;{query}&rdquo;</> : 'Search'}</h1>
          <p className="search-page-count">
            {results
              ? `${results.total} result${results.total === 1 ? '' : 's'} across products, categories and pages.`
              : 'Search products, categories and pages.'}
          </p>

          {results && results.groups.length === 0 && (
            <div className="search-page-empty">
              <p>
                No results for &ldquo;{query}&rdquo;. Try fewer or different words, or browse the{' '}
                <Link href="/catalog">medical equipment catalog</Link>.
              </p>
            </div>
          )}

          {results?.groups.map((group) => (
            <section key={group.key} className="search-page-group" aria-label={group.label}>
              <h2 className="nav-search-group">
                {group.label} ({group.total})
              </h2>
              <ul className="search-page-list">
                {group.items.map((item) => (
                  <li key={item.href} className="search-page-item">
                    <Link href={item.href}>
                      <Highlight text={item.title} terms={results.terms} />
                    </Link>
                    {item.summary && (
                      <p>
                        <Highlight text={item.summary} terms={results.terms} />
                      </p>
                    )}
                    {item.meta && <span className="search-page-meta">{item.meta}</span>}
                  </li>
                ))}
              </ul>
              {group.total > group.items.length && (
                <p className="search-page-more">
                  Showing {group.items.length} of {group.total}.
                  {group.key === 'products' && (
                    <>
                      {' '}
                      <Link href={`/catalog?search=${encodeURIComponent(query)}`}>
                        See all matching products in the catalog →
                      </Link>
                    </>
                  )}
                </p>
              )}
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
