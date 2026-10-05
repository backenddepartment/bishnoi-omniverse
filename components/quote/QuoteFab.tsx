'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ClipboardList } from 'lucide-react';
import { QUOTE_PATH, useQuoteList } from '@/lib/quoteList';

/**
 * View Quote, floating at the top right just under the navbar once the quote list has something
 * on it: a slim bar with the count on its icon and, beside the label, how many products are on the
 * list. Not shown on the Quote page itself.
 */
export function QuoteFab() {
  const count = useQuoteList().length;
  const pathname = usePathname() ?? '';
  if (count === 0 || pathname.startsWith(QUOTE_PATH)) return null;

  return (
    <Link
      href={QUOTE_PATH}
      aria-label={`View quote, ${count} ${count === 1 ? 'product' : 'products'}`}
      className="quote-fab"
    >
      <span className="quote-fab-icon">
        <ClipboardList aria-hidden="true" />
        {/* Keyed on the count so it pops each time something is added. */}
        <span key={count} className="quote-fab-count" aria-hidden="true">
          {count > 99 ? '99+' : count}
        </span>
      </span>
      <span className="quote-fab-text">
        <span className="quote-fab-label">View Quote</span>
        <span className="quote-fab-sub">
          {count} {count === 1 ? 'product' : 'products'} on your list
        </span>
      </span>
      <ChevronRight className="quote-fab-arrow" aria-hidden="true" />
    </Link>
  );
}
