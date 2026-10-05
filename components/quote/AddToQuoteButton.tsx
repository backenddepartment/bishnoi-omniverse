'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Plus, X } from 'lucide-react';
import { QUOTE_PATH, addToQuote, removeFromQuote, useQuoteList } from '@/lib/quoteList';

interface Props {
  productId: string;
  productName: string;
  /** Size picked on the product page, stored with the line (editable on the Quote page). */
  size?: string;
  /** The small catalog pill, a round + beside Send Inquiry (grid cards), or the product page's
   *  full-width button. */
  variant?: 'pill' | 'icon' | 'block';
}

/**
 * Add to Quote: text only in the catalog, with an icon on the product page. Once the product is
 * on the list, the catalog's button reads "Added ×" and takes it off again; the product page's
 * links to the Quote page instead (the floating View Quote does that everywhere else).
 */
export function AddToQuoteButton({ productId, productName, size, variant = 'pill' }: Props) {
  const added = useQuoteList().some((line) => line.id === productId);
  const block = variant === 'block';

  // The round one: + to add; once added a tick, which turns to × on hover and takes it off.
  if (variant === 'icon') {
    return (
      <button
        type="button"
        aria-label={added ? `Remove ${productName} from quote` : `Add ${productName} to quote`}
        aria-pressed={added}
        title={added ? 'Remove from quote' : 'Add to quote'}
        onClick={() => (added ? removeFromQuote(productId) : addToQuote(productId, size))}
        className={`quote-add-icon${added ? ' is-added' : ''}`}
      >
        {added ? (
          <>
            <Check className="quote-add-icon-check" aria-hidden="true" />
            <X className="quote-add-icon-x" aria-hidden="true" />
          </>
        ) : (
          <Plus aria-hidden="true" />
        )}
      </button>
    );
  }

  const base = block ? 'quote-add-block' : 'inquiry-btn quote-add-pill';
  // The product's name, for screen readers, after the visible words: an accessible name has to
  // start with what is on screen so voice control ("click Add to Quote") still finds the button.
  const forProduct = <span className="sr-only">: {productName}</span>;

  if (added && !block) {
    return (
      <button
        type="button"
        title="Remove from quote"
        onClick={() => removeFromQuote(productId)}
        className={`${base} is-added`}
      >
        <span>
          Added<span className="sr-only">, remove from quote</span>
          {forProduct}
        </span>
        <X className="quote-add-remove" aria-hidden="true" />
      </button>
    );
  }

  if (added) {
    return (
      <Link href={QUOTE_PATH} className={`${base} is-added`}>
        <Check aria-hidden="true" />
        <span>
          Added <span className="quote-add-sep" aria-hidden="true">·</span> View Quote
          {forProduct}
        </span>
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => addToQuote(productId, size)} className={base}>
      {block && <Plus aria-hidden="true" />}
      <span>
        Add to Quote
        {forProduct}
      </span>
    </button>
  );
}
