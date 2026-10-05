'use client';

import React, { useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowLeft, ClipboardList, Minus, Plus, Trash2 } from 'lucide-react';
import catalogData from '@/lib/data/catalogData.json';
import { PRODUCT_GALLERIES } from '@/lib/productImageOverrides';
import { parseSizes } from '@/lib/catalogSizes';
import { EQUIPMENT_PATH, productPath } from '@/lib/catalogRoutes';
import { absoluteUrl } from '@/lib/siteUrl';
import { MAX_QTY, clampQty, clearQuote, removeFromQuote, updateQuoteLine, useQuoteList } from '@/lib/quoteList';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CategoryArt } from '@/components/catalog/CategoryArt';
import { Pagination } from '@/components/catalog/Pagination';
import { InquiryPanel } from '@/components/quote/InquiryPanel';

const noop = () => () => {};

/**
 * The quantity box. It keeps its own text while it is being typed in, so it can be cleared and a
 * new number typed (500, not 1 → 1500); every whole number typed is saved straight away. Left
 * empty, it goes back to 1 when the visitor moves on. The − and + buttons update it from outside.
 */
function QtyInput({ id, qty, label }: { id: string; qty: number; label: string }) {
  const [draft, setDraft] = useState(String(qty));
  const [prevQty, setPrevQty] = useState(qty);
  if (qty !== prevQty) {
    setPrevQty(qty);
    setDraft(String(qty));
  }

  const commit = () => {
    const value = clampQty(Number(draft) || 1);
    setDraft(String(value));
    if (value !== qty) updateQuoteLine(id, { qty: value });
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={String(MAX_QTY).length}
      value={draft}
      aria-label={label}
      onFocus={(e) => e.target.select()}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, '');
        setDraft(digits);
        const value = Number(digits);
        if (digits && value >= 1) {
          const clamped = clampQty(value);
          setPrevQty(clamped);
          updateQuoteLine(id, { qty: clamped });
        }
      }}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
      }}
    />
  );
}
const LINES_PER_PAGE = 3;

/**
 * The Quote page: everything picked with Add to Quote, each line with its size and quantity, and
 * beside it the Send Inquiry panel, which sends the whole list as one inquiry.
 */
export default function QuotePage() {
  const lines = useQuoteList();
  // The list lives in the browser, so the server renders nothing for it; this holds the empty
  // state back until the browser's copy has been read, rather than flashing it on every visit.
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  const categoryName = useMemo(() => new Map(catalogData.categories.map((c) => [c.id, c.name])), []);
  const subcategoryName = useMemo(() => new Map(catalogData.subcategories.map((s) => [s.id, s.name])), []);

  // Lines whose product has since left the catalog are dropped from view (and from the inquiry).
  const rows = lines.flatMap((line) => {
    const product = catalogData.products.find((p) => p.id === line.id);
    return product ? [{ line, product, sizes: parseSizes(product.sizes) }] : [];
  });
  const units = rows.reduce((sum, row) => sum + row.line.qty, 0);

  // A long list is shown three lines at a time. Removing lines can leave the page past the end,
  // so the page in view is clamped to the pages there are.
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / LINES_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = rows.slice((currentPage - 1) * LINES_PER_PAGE, currentPage * LINES_PER_PAGE);
  const listRef = useRef<HTMLUListElement>(null);
  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(next, 1), totalPages));
    // Bring the top of the list back into view if it has scrolled away.
    const list = listRef.current;
    if (list && list.getBoundingClientRect().top < 0) {
      window.scrollTo({ top: list.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' });
    }
  };

  const items = rows.map(({ line, product }) => ({
    name: `${product.name} — Qty: ${line.qty}${line.size ? `, Size: ${line.size}` : ''}`,
    url: absoluteUrl(`${productPath(product)}/`),
  }));

  return (
    <div className="w-full catalog-page pdp quote-page">
      <div className="wrap">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Medical Equipment', href: EQUIPMENT_PATH },
            { label: 'Your Quote' },
          ]}
        />
      </div>

      <section className="pdp-top">
        <div className="wrap pdp-top-grid">
          <div className="quote-main">
            <header className="quote-head">
              <span className="ct-form-eyebrow">Your Quote List</span>
              <h1 className="pdp-title">Review your quote</h1>
              <p className="pdp-lede">
                {mounted && rows.length > 0
                  ? `${rows.length} ${rows.length === 1 ? 'product' : 'products'}, ${units.toLocaleString()} ${
                      units === 1 ? 'unit' : 'units'
                    }. Set the size and quantity for each, then send the list for a formal, line-by-line quotation.`
                  : 'Products you add with Add to Quote are kept here until you send them.'}
              </p>
            </header>

            {/* Holds the list's place until the browser's copy has been read, so the form beside
                (or, on phones, under) it does not jump when the list appears. */}
            {!mounted && <div className="quote-placeholder" aria-hidden="true" />}

            {mounted && rows.length === 0 && (
              <div className="quote-empty">
                <span className="quote-empty-icon" aria-hidden="true">
                  <ClipboardList />
                </span>
                <h2>Your quote list is empty</h2>
                <p>
                  Browse the equipment catalog and press <strong>Add to Quote</strong> on anything you
                  need. You can also send an inquiry describing what you need using the form.
                </p>
                <Link href={EQUIPMENT_PATH} className="btn btn-primary">
                  Browse Medical Equipment
                </Link>
              </div>
            )}

            {mounted && rows.length > 0 && (
              <>
                <ul ref={listRef} className="quote-lines">
                  {pageRows.map(({ line, product, sizes }) => {
                    const photo = PRODUCT_GALLERIES[product.id]?.[0];
                    const href = productPath(product);
                    return (
                      <li key={line.id} className="quote-line">
                        <Link
                          href={href}
                          aria-hidden="true"
                          tabIndex={-1}
                          className={`quote-line-thumb${photo ? ' has-photo' : ''}`}
                        >
                          {photo ? <img src={photo.src} alt="" loading="lazy" /> : <CategoryArt categoryId={product.categoryId} />}
                        </Link>

                        <div className="quote-line-info">
                          <Link href={href} className="quote-line-name">
                            {product.name}
                          </Link>
                          <span className="quote-line-meta">
                            {[categoryName.get(product.categoryId), subcategoryName.get(product.subcategoryId)]
                              .filter(Boolean)
                              .join(' · ')}
                          </span>
                        </div>

                        <div className="quote-line-controls">
                          {sizes.length > 0 && (
                            <label className="quote-line-field">
                              <span>Size</span>
                              <select
                                value={line.size ?? ''}
                                onChange={(e) => updateQuoteLine(line.id, { size: e.target.value || undefined })}
                              >
                                <option value="">Any / not sure</option>
                                {sizes.map((size) => (
                                  <option key={size} value={size}>
                                    {size}
                                  </option>
                                ))}
                              </select>
                            </label>
                          )}

                          <div className="quote-line-field">
                            <span id={`qty-${line.id}`}>Quantity</span>
                            <div className="quote-qty" role="group" aria-labelledby={`qty-${line.id}`}>
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                disabled={line.qty <= 1}
                                onClick={() => updateQuoteLine(line.id, { qty: line.qty - 1 })}
                              >
                                <Minus aria-hidden="true" />
                              </button>
                              <QtyInput id={line.id} qty={line.qty} label={`Quantity of ${product.name}`} />
                              <button
                                type="button"
                                aria-label="Increase quantity"
                                disabled={line.qty >= MAX_QTY}
                                onClick={() => updateQuoteLine(line.id, { qty: line.qty + 1 })}
                              >
                                <Plus aria-hidden="true" />
                              </button>
                            </div>
                          </div>

                          <button
                            type="button"
                            aria-label={`Remove ${product.name} from quote`}
                            onClick={() => removeFromQuote(line.id)}
                            className="quote-line-remove"
                          >
                            <Trash2 aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <Pagination current={currentPage} total={totalPages} onChange={goToPage} label="Quote list pages" />

                <div className="quote-foot">
                  <Link href={EQUIPMENT_PATH} className="quote-foot-link">
                    <ArrowLeft aria-hidden="true" /> Continue browsing
                  </Link>
                  <button type="button" onClick={clearQuote} className="quote-foot-clear">
                    Clear list
                  </button>
                </div>
              </>
            )}
          </div>

          <aside className="pdp-form-col" aria-label="Send inquiry">
            <InquiryPanel
              subtitle={
                rows.length > 0
                  ? 'Send your whole list in one inquiry for a formal, line-by-line quote.'
                  : 'Tell us what you need and we will come back with a formal quote.'
              }
              items={items}
              note={
                rows.length > 0 && (
                  <p className="quote-panel-note">
                    <ClipboardList aria-hidden="true" />
                    Your {rows.length} {rows.length === 1 ? 'product' : 'products'} ({units.toLocaleString()}{' '}
                    {units === 1 ? 'unit' : 'units'}) will be sent with this inquiry.
                  </p>
                )
              }
              onSent={clearQuote}
            />
          </aside>
        </div>
      </section>
    </div>
  );
}
