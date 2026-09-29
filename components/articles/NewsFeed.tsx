'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Newspaper, Search } from 'lucide-react';
import { NoArticlesArt } from './NoArticlesArt';

/**
 * The Articles page's news feed: a headline and an introduction side by side, a search box, and
 * the articles as cards in three columns. Each card is a photo carrying the category and the
 * date, then the title, a short excerpt, the source and a link to the full article.
 *
 * The cards come from lib/data/newsData.json (synced from a news API at build time) and
 * lib/data/articlesData.json; the page resolves their photos and dates and
 * hands them over ready to draw. The styles are in globals.css under `news-`.
 */

export type NewsItem = {
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  /** Already formatted for display, e.g. "Sep 2, 2026". */
  date?: string;
  /** ISO date, for the <time> element. */
  dateTime?: string;
  /** The article's own photo. Without one, or if it fails to load, the card shows a plain panel. */
  image?: string;
  imageAlt?: string;
  /** Where the article was published, e.g. "TIME". */
  source?: string;
  /** Address of the source's icon. Without one, the source's initial is shown on `sourceColor`. */
  sourceIcon?: string;
  sourceColor?: string;
  href: string;
};

const isExternal = (href: string) => /^https?:\/\//i.test(href);

/**
 * An image from another site, which may have been moved or may refuse to be shown elsewhere.
 * When it fails, `onFail` is called so the card can put something of its own in its place. The
 * page arrives already drawn, so an image can fail before this code is running to hear about
 * it: hence the check on arrival as well as the error handler.
 *
 * Not to be given loading="lazy": an image still waiting to load reports itself the same way as
 * one that has failed, and would be taken for broken. A page holds nine cards, so there is
 * little to save by waiting.
 */
function RemoteImage({ onFail, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { onFail: () => void }) {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) onFail();
    // Once for each address: the parent swaps `src` when it falls back.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.src]);
  return <img ref={ref} alt="" {...props} referrerPolicy="no-referrer" onError={onFail} />;
}

function SourceMark({ item, onIconError }: { item: NewsItem; onIconError: () => void }) {
  if (!item.source) return null;
  return (
    <span className="news-card-source">
      {item.sourceIcon ? (
        <RemoteImage src={item.sourceIcon} onFail={onIconError} className="news-card-source-icon" />
      ) : (
        <span
          className="news-card-source-icon is-letter"
          style={item.sourceColor ? { background: item.sourceColor } : undefined}
          aria-hidden="true"
        >
          {item.source.trim().charAt(0).toUpperCase()}
        </span>
      )}
      {item.source}
    </span>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  // The photo is the article's own, shown from the outlet's site, where it can be moved or
  // refused. The card then shows a plain panel rather than a broken image.
  const [photoFailed, setPhotoFailed] = useState(false);
  const [iconFailed, setIconFailed] = useState(false);
  const photo = photoFailed ? undefined : item.image;
  const external = isExternal(item.href);
  const linkProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  const title = (
    <>
      {item.title}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );

  return (
    <article className="news-card">
      <div className="news-card-media">
        {photo ? (
          <RemoteImage
            src={photo}
            alt={item.imageAlt ?? ''}
            draggable={false}
            onFail={() => setPhotoFailed(true)}
          />
        ) : (
          <span className="news-card-blank" aria-hidden="true">
            <Newspaper strokeWidth={1.25} />
            {item.source}
          </span>
        )}
        {item.category && <span className="news-card-category">{item.category}</span>}
        {item.date && (
          <time className="news-card-date" dateTime={item.dateTime}>
            {item.date}
          </time>
        )}
      </div>

      <div className="news-card-body">
        <h3 className="news-card-title">
          {/* The title's link is stretched over the whole card, so the card is one target. */}
          {external ? (
            <a href={item.href} className="news-card-link" {...linkProps}>
              {title}
            </a>
          ) : (
            <Link href={item.href} className="news-card-link">
              {title}
            </Link>
          )}
        </h3>
        {item.excerpt && <p className="news-card-excerpt">{item.excerpt}</p>}

        <div className="news-card-foot">
          <SourceMark item={iconFailed ? { ...item, sourceIcon: undefined } : item} onIconError={() => setIconFailed(true)} />
          <span className="news-card-more" aria-hidden="true">
            Read Full Article
            <ArrowRight strokeWidth={2} />
          </span>
        </div>
      </div>
    </article>
  );
}

/**
 * The page numbers to show: all of them up to seven pages, otherwise the first, the last and the
 * ones around the current page, with a gap (0) where some are left out.
 */
function pageList(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const near = [1, total, current - 1, current, current + 1].filter((n) => n >= 1 && n <= total);
  const pages = [...new Set(near)].sort((a, b) => a - b);
  return pages.flatMap((n, i) => (i > 0 && n - pages[i - 1] > 1 ? [0, n] : [n]));
}

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (page: number) => void }) {
  if (total <= 1) return null;
  return (
    <nav className="news-pages" aria-label="Pages of articles">
      <button
        type="button"
        className="news-page is-step"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft strokeWidth={2} aria-hidden="true" />
      </button>
      {pageList(page, total).map((n, i) =>
        n === 0 ? (
          <span key={`gap-${i}`} className="news-page-gap" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            className={`news-page${n === page ? ' is-current' : ''}`}
            onClick={() => onChange(n)}
            aria-label={`Page ${n}`}
            aria-current={n === page ? 'page' : undefined}
          >
            {n}
          </button>
        ),
      )}
      <button
        type="button"
        className="news-page is-step"
        onClick={() => onChange(page + 1)}
        disabled={page === total}
        aria-label="Next page"
      >
        <ChevronRight strokeWidth={2} aria-hidden="true" />
      </button>
    </nav>
  );
}

export function NewsFeed({
  title,
  lede,
  searchPlaceholder = 'Search news…',
  items,
  pageSize = 9,
}: {
  title: string;
  lede: string;
  searchPlaceholder?: string;
  items: NewsItem[];
  /** Cards to a page. */
  pageSize?: number;
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const top = useRef<HTMLDivElement>(null);

  const shown = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return items;
    return items.filter((item) => {
      const text = [item.title, item.excerpt, item.category, item.source].filter(Boolean).join(' ').toLowerCase();
      return words.every((word) => text.includes(word));
    });
  }, [items, query]);

  // A search can leave fewer pages than the one being shown.
  const pages = Math.max(1, Math.ceil(shown.length / pageSize));
  const current = Math.min(page, pages);
  const onPage = shown.slice((current - 1) * pageSize, current * pageSize);

  const goTo = (next: number) => {
    setPage(Math.min(Math.max(next, 1), pages));
    // Back to the top of the feed, so the new page is read from its first card.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    top.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div className="news-feed scroll-target" ref={top}>
      <div className="news-head">
        <h2 className="news-title">{title}</h2>
        <div className="news-head-side">
          <p className="news-lede">{lede}</p>
          <label className="news-search">
            <span className="sr-only">Search the articles</span>
            <Search strokeWidth={2} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              autoComplete="off"
            />
          </label>
        </div>
      </div>

      {shown.length > 0 ? (
        <>
          <div className="news-grid">
            {onPage.map((item) => (
              <NewsCard key={item.slug} item={item} />
            ))}
          </div>
          <Pagination page={current} total={pages} onChange={goTo} />
        </>
      ) : (
        <div className="news-empty" role="status">
          <NoArticlesArt className="news-empty-art" />
          <h3>No articles found</h3>
          <p>
            Nothing matches “{query.trim()}”. Try a different word, or clear the search to see every
            article.
          </p>
          <button
            type="button"
            className="btn btn-outline on-light"
            onClick={() => {
              setQuery('');
              setPage(1);
            }}
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
