'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Page buttons to render: always the first and last page plus the current page's neighbours,
// with an ellipsis standing in for each skipped run (e.g. 1 … 4 5 6 … 26).
const getPageNumbers = (current: number, total: number): (number | 'ellipsis')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | 'ellipsis')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('ellipsis');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('ellipsis');
  pages.push(total);
  return pages;
};

interface Props {
  current: number;
  total: number;
  onChange: (page: number) => void;
  /** The nav's accessible name, e.g. "Product pages". */
  label: string;
}

/** Previous / page numbers / next, as under the catalog's product listing. Hidden for one page. */
export function Pagination({ current, total, onChange, label }: Props) {
  if (total <= 1) return null;
  return (
    <nav className="catalog-pagination" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        aria-label="Previous page"
        className="catalog-page-btn is-arrow"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {getPageNumbers(current, total).map((page, idx) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="catalog-page-ellipsis" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === current ? 'page' : undefined}
            className={`catalog-page-btn${page === current ? ' is-active' : ''}`}
          >
            {page}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        aria-label="Next page"
        className="catalog-page-btn is-arrow"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
