'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Heart,
  Info,
  Layers,
  Package,
  RecycleIcon,
  RotateCcw,
  Ruler,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Users,
  X,
  ZoomIn,
  type LucideIcon,
} from 'lucide-react';
import type { ProductImage } from '@/lib/catalogImages';
import { getCategoryIcon } from '@/lib/catalogIcons';

export interface PdpProduct {
  id: string;
  categoryId: string;
  subcategoryId: string;
  name: string;
  description: string;
  specifications: string;
  sterility: string;
  reuse: string;
  sizes: string;
  regulatoryClass: string;
  precautions: string;
  useSetting: string;
  endUser: string;
  image?: ProductImage;
}

export interface PdpRelated {
  id: string;
  name: string;
  categoryId: string;
  subcategoryName?: string;
  image?: ProductImage;
}

interface Props {
  product: PdpProduct;
  categoryName?: string;
  categoryId?: string;
  subcategoryName?: string;
  related: PdpRelated[];
}

/* ------------------------------------------------------------------ *
 * Data shaping
 * ------------------------------------------------------------------ */

/**
 * "XS, S, M, L, XL" -> selectable buttons. The sheet's Common Sizes / Capacity column is prose
 * as often as it is a list, so anything that does not split into short comma-separated values is
 * left to render as a sentence instead.
 */
function parseSizes(sizes: string): string[] {
  if (!sizes) return [];
  // A semicolon joins statements rather than options — "One size (adult); paediatric available"
  // is a sentence, not two sizes to pick between.
  if (sizes.includes(';')) return [];
  const parts = sizes
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length < 2) return [];
  // Long fragments mean it is a description, not a size list.
  if (parts.some((part) => part.length > 24)) return [];
  return parts.slice(0, 12);
}

/**
 * The Specifications column is a single prose blob, usually semicolon-separated clauses, some of
 * which read as "Label: value". Split it so the tab can present a table where it can and a
 * paragraph where it cannot.
 */
function parseSpecPairs(specifications: string): { label: string; value: string }[] {
  if (!specifications) return [];
  return specifications
    .split(';')
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const idx = chunk.indexOf(':');
      if (idx === -1 || idx > 40) return { label: '', value: chunk };
      return { label: chunk.slice(0, idx).trim(), value: chunk.slice(idx + 1).trim() };
    });
}

/** Four framings of a product photo, when one exists, so the gallery rail reads as a set. */
const VIEWS = [
  { key: 'full', label: 'Full view', objectPosition: 'center 50%', scale: 1 },
  { key: 'top', label: 'Top detail', objectPosition: 'center 18%', scale: 1.35 },
  { key: 'close', label: 'Close-up', objectPosition: 'center 50%', scale: 1.8 },
  { key: 'base', label: 'Base detail', objectPosition: 'center 88%', scale: 1.35 },
];

const TABS = ['Details', 'Specifications', 'Safety & Handling', 'Use & Setting'] as const;
type Tab = (typeof TABS)[number];

/** Shown wherever a sheet column marked * is rendered. */
const REFERENCE_NOTE =
  'General reference for this product type, not a specification for a particular brand or model. ' +
  'Confirm against the manufacturer’s documentation and your local import requirements before ordering.';

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export function ProductDetail({ product, categoryName, categoryId, subcategoryName, related }: Props) {
  const sizes = parseSizes(product.sizes);
  const specPairs = parseSpecPairs(product.specifications);
  const image = product.image;
  const CategoryIcon = getCategoryIcon(product.categoryId);

  const [activeView, setActiveView] = useState(0);
  const [activeSize, setActiveSize] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('Details');
  const [saved, setSaved] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const view = VIEWS[activeView];
  const requestHref = `/contact?type=hospital-supply&product=${encodeURIComponent(product.name)}`;

  return (
    <div className="w-full catalog-page pdp">
      {/* ── Gallery + quote box ───────────────────────────────────────── */}
      <section className="pdp-top">
        <div className="wrap pdp-top-grid">
          <div className="pdp-gallery">
            {/* The thumbnail rail only earns its place when there is a real photo to crop. */}
            {image && (
              <div className="pdp-thumbs">
                {VIEWS.map((v, idx) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => setActiveView(idx)}
                    aria-label={`${v.label} of ${product.name}`}
                    aria-pressed={activeView === idx}
                    className={`pdp-thumb${activeView === idx ? ' is-active' : ''}`}
                  >
                    <img
                      src={image.src}
                      alt=""
                      loading="lazy"
                      style={{ objectPosition: v.objectPosition, transform: `scale(${v.scale})` }}
                    />
                  </button>
                ))}
                <button
                  type="button"
                  aria-label="Next view"
                  onClick={() => setActiveView((i) => (i + 1) % VIEWS.length)}
                  className="pdp-thumb-next"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className={`pdp-stage${image ? '' : ' is-icon'}`}>
              {image ? (
                <>
                  <img
                    src={image.src}
                    alt={image.alt || product.name}
                    loading="eager"
                    style={{ objectPosition: view.objectPosition, transform: `scale(${view.scale})` }}
                  />
                  <button
                    type="button"
                    aria-label="Zoom image"
                    onClick={() => setIsZoomed(true)}
                    className="pdp-zoom"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="pdp-stage-icon">
                  <CategoryIcon strokeWidth={1} aria-hidden="true" />
                  <span>{categoryName}</span>
                </div>
              )}
            </div>

            {image && image.credit && (
              <p className="pdp-credit">
                Photo:{' '}
                {image.source ? (
                  <a href={image.source} target="_blank" rel="noopener noreferrer">
                    {image.credit}
                  </a>
                ) : (
                  image.credit
                )}
              </p>
            )}
          </div>

          {/* Quote box */}
          <div className="pdp-info">
            <div className="pdp-pills">
              {categoryName && <span className="pdp-pill">{categoryName}</span>}
              {subcategoryName && <span className="pdp-pill is-sub">{subcategoryName}</span>}
            </div>

            <h1 className="pdp-title">{product.name}</h1>

            {product.regulatoryClass && (
              <div className="pdp-rating">
                <ShieldCheck className="w-4 h-4" />
                <strong>{product.regulatoryClass}</strong>
                <span>typical class</span>
              </div>
            )}

            <div className="pdp-price-row">
              <span className="pdp-price">Quote on Request</span>
              <span className="pdp-price-was">Bulk tiers</span>
              <span className="pdp-price-badge">24H TURNAROUND</span>
            </div>

            <p className="pdp-lede">{product.description}</p>

            <hr className="pdp-rule" />

            {/* Product attributes — the reference's colour row, carrying facts rather than choices */}
            {(product.sterility || product.reuse) && (
              <div className="pdp-option">
                <div className="pdp-option-head">
                  <span className="pdp-option-label">Product form</span>
                </div>
                <div className="pdp-attrs">
                  {product.sterility && (
                    <span className="pdp-attr">
                      <Sparkles className="w-3.5 h-3.5" />
                      {product.sterility}
                    </span>
                  )}
                  {product.reuse && (
                    <span className="pdp-attr">
                      <RecycleIcon className="w-3.5 h-3.5" />
                      {product.reuse}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Sizes — the reference's size row */}
            {product.sizes && (
              <div className="pdp-option">
                <div className="pdp-option-head">
                  <span className="pdp-option-label">
                    Size / capacity
                    {sizes.length > 0 && (
                      <>
                        : <em>{sizes[activeSize]}</em>
                      </>
                    )}
                  </span>
                  <span className="pdp-guide">
                    <Ruler className="w-3.5 h-3.5" /> Indicative range
                  </span>
                </div>
                {sizes.length > 0 ? (
                  <div className="pdp-variants">
                    {sizes.map((size, idx) => (
                      <button
                        key={size}
                        type="button"
                        aria-pressed={activeSize === idx}
                        onClick={() => setActiveSize(idx)}
                        className={`pdp-variant${activeSize === idx ? ' is-active' : ''}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="pdp-option-prose">{product.sizes}</p>
                )}
              </div>
            )}

            <div className="pdp-actions">
              <Link
                href={
                  sizes.length > 0
                    ? `${requestHref}&size=${encodeURIComponent(sizes[activeSize])}`
                    : requestHref
                }
                className="pdp-cta"
              >
                <ShoppingBag className="w-5 h-5" /> Add to Quote
              </Link>
              <button
                type="button"
                aria-label={saved ? 'Remove from shortlist' : 'Save to shortlist'}
                aria-pressed={saved}
                onClick={() => setSaved((s) => !s)}
                className={`pdp-save${saved ? ' is-active' : ''}`}
              >
                <Heart className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="pdp-trust">
              <div className="pdp-trust-item">
                <Truck className="w-4 h-4" />
                <div>
                  <strong>Global Shipping</strong>
                  <span>Door-to-door logistics</span>
                </div>
              </div>
              <div className="pdp-trust-item">
                <RotateCcw className="w-4 h-4" />
                <div>
                  <strong>Batch Traceability</strong>
                  <span>Factory to facility</span>
                </div>
              </div>
              <div className="pdp-trust-item">
                <ShieldCheck className="w-4 h-4" />
                <div>
                  <strong>Regulatory Clearance</strong>
                  <span>Documentation on request</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabs + summary panel ──────────────────────────────────────── */}
      <section className="pdp-mid">
        <div className="wrap pdp-mid-grid">
          <div className="pdp-tabs-col">
            <div className="pdp-tabs" role="tablist" aria-label="Product information">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pdp-tab${activeTab === tab ? ' is-active' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="pdp-panel" role="tabpanel">
              {activeTab === 'Details' && (
                <>
                  <p>{product.description}</p>
                  <ul className="pdp-features">
                    {categoryName && (
                      <li>
                        <Layers className="w-4 h-4" strokeWidth={1.5} />
                        <span>
                          Category: {categoryName}
                          {subcategoryName ? ` — ${subcategoryName}` : ''}
                        </span>
                      </li>
                    )}
                    {product.sterility && (
                      <li>
                        <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                        <span>{product.sterility}</span>
                      </li>
                    )}
                    {product.reuse && (
                      <li>
                        <RecycleIcon className="w-4 h-4" strokeWidth={1.5} />
                        <span>{product.reuse}</span>
                      </li>
                    )}
                    {product.sizes && (
                      <li>
                        <Ruler className="w-4 h-4" strokeWidth={1.5} />
                        <span>Sizes / capacity: {product.sizes}</span>
                      </li>
                    )}
                    {product.regulatoryClass && (
                      <li>
                        <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
                        <span>Typical regulatory class: {product.regulatoryClass}</span>
                      </li>
                    )}
                  </ul>
                </>
              )}

              {activeTab === 'Specifications' && (
                <>
                  {specPairs.some((pair) => pair.label) ? (
                    <dl className="pdp-specs">
                      {specPairs.map((pair, idx) =>
                        pair.label ? (
                          <div key={idx}>
                            <dt>{pair.label}</dt>
                            <dd>{pair.value}</dd>
                          </div>
                        ) : (
                          <div key={idx} className="pdp-specs-note">
                            <dd>{pair.value}</dd>
                          </div>
                        )
                      )}
                    </dl>
                  ) : (
                    <p>{product.specifications || 'No specifications recorded for this product.'}</p>
                  )}
                  <p className="pdp-disclaimer">
                    <Info className="w-3.5 h-3.5" />
                    {REFERENCE_NOTE}
                  </p>
                </>
              )}

              {activeTab === 'Safety & Handling' && (
                <>
                  {product.precautions ? (
                    <div className="pdp-callout">
                      <ShieldAlert className="w-4 h-4" />
                      <p>{product.precautions}</p>
                    </div>
                  ) : (
                    <p>No specific precautions recorded for this product type.</p>
                  )}
                  <ul className="pdp-features">
                    {product.sterility && (
                      <li>
                        <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                        <span>{product.sterility}</span>
                      </li>
                    )}
                    {product.reuse && (
                      <li>
                        <RecycleIcon className="w-4 h-4" strokeWidth={1.5} />
                        <span>{product.reuse}</span>
                      </li>
                    )}
                    {product.regulatoryClass && (
                      <li>
                        <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
                        <span>Typical regulatory class: {product.regulatoryClass}</span>
                      </li>
                    )}
                  </ul>
                  <p className="pdp-disclaimer">
                    <Info className="w-3.5 h-3.5" />
                    Not a complete list of contraindications. Always follow the manufacturer’s
                    instructions for use, and consult a pharmacist or clinician where relevant.
                  </p>
                </>
              )}

              {activeTab === 'Use & Setting' && (
                <>
                  <ul className="pdp-features">
                    {product.useSetting && (
                      <li>
                        <Building2 className="w-4 h-4" strokeWidth={1.5} />
                        <span>Typical use setting: {product.useSetting}</span>
                      </li>
                    )}
                    {product.endUser && (
                      <li>
                        <Users className="w-4 h-4" strokeWidth={1.5} />
                        <span>Primary end user: {product.endUser}</span>
                      </li>
                    )}
                    <li>
                      <Truck className="w-4 h-4" strokeWidth={1.5} />
                      <span>Air and sea freight, DAP or ExW incoterms</span>
                    </li>
                    <li>
                      <Package className="w-4 h-4" strokeWidth={1.5} />
                      <span>Palletised export packing with batch labelling</span>
                    </li>
                  </ul>
                  <p className="pdp-disclaimer">
                    <Info className="w-3.5 h-3.5" />
                    {REFERENCE_NOTE}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Summary panel, in place of the reference's detail shot */}
          <aside className="pdp-summary">
            <div className="pdp-summary-head">
              <CategoryIcon className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              <h2>At a glance</h2>
            </div>
            <dl className="pdp-summary-list">
              {categoryName && (
                <div>
                  <dt>Category</dt>
                  <dd>{categoryName}</dd>
                </div>
              )}
              {subcategoryName && (
                <div>
                  <dt>Subcategory</dt>
                  <dd>{subcategoryName}</dd>
                </div>
              )}
              {product.sterility && (
                <div>
                  <dt>Sterility</dt>
                  <dd>{product.sterility}</dd>
                </div>
              )}
              {product.reuse && (
                <div>
                  <dt>Use</dt>
                  <dd>{product.reuse}</dd>
                </div>
              )}
              {product.sizes && (
                <div>
                  <dt>Sizes / capacity</dt>
                  <dd>{product.sizes}</dd>
                </div>
              )}
              {product.regulatoryClass && (
                <div>
                  <dt>Typical class</dt>
                  <dd>{product.regulatoryClass}</dd>
                </div>
              )}
              {product.useSetting && (
                <div>
                  <dt>Use setting</dt>
                  <dd>{product.useSetting}</dd>
                </div>
              )}
              {product.endUser && (
                <div>
                  <dt>End user</dt>
                  <dd>{product.endUser}</dd>
                </div>
              )}
            </dl>
            <Link href={requestHref} className="pdp-summary-cta">
              Request this product <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Always visible, not tucked inside a tab: these values describe a product type, and
                a buyer should see that before they act on them. */}
            <p className="pdp-disclaimer">
              <Info className="w-3.5 h-3.5" />
              <span>{REFERENCE_NOTE}</span>
            </p>
          </aside>
        </div>
      </section>

      {/* ── You may also like ─────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="pdp-related">
          <div className="wrap">
            <div className="pdp-related-head">
              <h2>You May Also Like</h2>
              <Link href={categoryId ? `/catalog?category=${categoryId}` : '/catalog'}>
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pdp-related-grid">
              {related.map((item) => {
                const ItemIcon: LucideIcon = getCategoryIcon(item.categoryId);
                return (
                  <article key={item.id} className="pdp-related-card">
                    <Link href={`/catalog/${item.id}`} className="pdp-related-media">
                      {item.image ? (
                        <img src={item.image.src} alt={item.image.alt || item.name} loading="lazy" />
                      ) : (
                        <span className="pdp-related-icon">
                          <ItemIcon strokeWidth={1} aria-hidden="true" />
                        </span>
                      )}
                    </Link>
                    <div className="pdp-related-body">
                      <div>
                        <Link href={`/catalog/${item.id}`}>
                          <h3>{item.name}</h3>
                        </Link>
                        {item.subcategoryName && (
                          <span className="pdp-related-meta">{item.subcategoryName}</span>
                        )}
                      </div>
                      <Link
                        href={`/contact?type=hospital-supply&product=${encodeURIComponent(item.name)}`}
                        aria-label={`Request a quote for ${item.name}`}
                        className="pdp-related-save"
                      >
                        <Heart className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Zoom overlay */}
      {isZoomed && image && (
        <div className="pdp-lightbox" role="dialog" aria-modal="true" onClick={() => setIsZoomed(false)}>
          <button type="button" aria-label="Close zoom" className="pdp-lightbox-close">
            <X className="w-5 h-5" />
          </button>
          <img src={image.src} alt={image.alt || product.name} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
