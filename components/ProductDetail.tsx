'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  Building2,
  ImageIcon,
  Info,
  Package,
  RecycleIcon,
  RotateCcw,
  SendHorizontal,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Users,
  X,
  ZoomIn,
} from 'lucide-react';
import type { ProductImage } from '@/lib/catalogImages';
import { parseSizes } from '@/lib/catalogSizes';

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
  /** Extra photos for the gallery rail, main image first. Falls back to `image` alone. */
  gallery?: ProductImage[];
}

export interface PdpRelated {
  id: string;
  name: string;
  categoryId: string;
  subcategoryName?: string;
  sterility?: string;
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

/** Slots on the gallery rail: the product photo first, placeholders for the shots still to come. */
const GALLERY_SLOTS = 4;

// No "Details" tab: the description and product facts already sit in the quote box beside it.
const TABS = ['Use & Setting', 'At a Glance', 'Specifications', 'Safety & Handling'] as const;
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

  const [activeView, setActiveView] = useState(0);
  const [activeSize, setActiveSize] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('Use & Setting');
  const [isZoomed, setIsZoomed] = useState(false);

  // Photos fill the rail's slots in order; any slot past the last photo shows the placeholder.
  const gallery = product.gallery?.length ? product.gallery : image ? [image] : [];
  const stageImage = gallery[activeView];
  const requestHref = `/contact?type=hospital-supply&product=${encodeURIComponent(product.name)}`;

  return (
    <div className="w-full catalog-page pdp">
      {/* ── Gallery + quote box ───────────────────────────────────────── */}
      <section className="pdp-top">
        <div className="wrap pdp-top-grid">
          <div className="pdp-gallery">
            {/* The product photo (when there is one) in the first slot; category-icon
                placeholders hold the remaining slots until more photos are cleared. */}
            <div className="pdp-thumbs">
              {Array.from({ length: GALLERY_SLOTS }, (_, idx) => {
                const slotImage = gallery[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveView(idx)}
                    aria-label={slotImage ? `Photo ${idx + 1} of ${product.name}` : `No image (slot ${idx + 1})`}
                    aria-pressed={activeView === idx}
                    className={`pdp-thumb${slotImage ? ' has-photo' : ' is-placeholder'}${activeView === idx ? ' is-active' : ''}`}
                  >
                    {slotImage ? (
                      <img src={slotImage.src} alt="" loading="lazy" />
                    ) : (
                      <>
                        <ImageIcon strokeWidth={1.5} aria-hidden="true" />
                        <span>No image</span>
                      </>
                    )}
                  </button>
                );
              })}
              <button
                type="button"
                aria-label="Next image"
                onClick={() => setActiveView((i) => (i + 1) % GALLERY_SLOTS)}
                className="pdp-thumb-next"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            <div className={`pdp-stage${stageImage ? ' has-photo' : ' is-icon'}`}>
              {stageImage ? (
                <>
                  <img src={stageImage.src} alt={stageImage.alt || product.name} loading="eager" />
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
                  <ImageIcon strokeWidth={1.25} aria-hidden="true" />
                  <span>No image</span>
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
                    <span className="pdp-attr">{product.sterility}</span>
                  )}
                  {product.reuse && (
                    <span className="pdp-attr">{product.reuse}</span>
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

          {/* Tabs sit directly under the gallery; the quote box runs alongside both. */}
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
                </>
              )}

              {activeTab === 'At a Glance' && (
                <>
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
                </>
              )}
            </div>

            {/* Always visible, not tucked inside a tab: these values describe a product type, and
                a buyer should see that before they act on them. */}
            <p className="pdp-disclaimer">
              <Info className="w-3.5 h-3.5" />
              <span>{REFERENCE_NOTE}</span>
            </p>
          </div>
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
              {/* Same card as the catalog grid; Send Inquiry opens the quote request for that product. */}
              {related.map((item) => (
                <article key={item.id} className="product-card">
                  <Link
                    href={`/catalog/${item.id}`}
                    aria-label={item.name}
                    className={`product-card-media${item.image ? ' has-photo' : ' is-empty'}`}
                  >
                    {item.image ? (
                      <img src={item.image.src} alt={item.image.alt || item.name} loading="lazy" />
                    ) : (
                      <span className="product-card-empty">
                        <ImageIcon strokeWidth={1.5} aria-hidden="true" />
                        <span>No image</span>
                      </span>
                    )}
                  </Link>
                  <div className="product-card-body">
                    <div>
                      <Link href={`/catalog/${item.id}`}>
                        <h3>{item.name}</h3>
                      </Link>
                      {item.sterility && (
                        <span className="product-card-sterility">{item.sterility}</span>
                      )}
                    </div>
                    <div className="product-card-foot">
                      <Link
                        href={`/contact?type=hospital-supply&product=${encodeURIComponent(item.name)}`}
                        aria-label={`Send an inquiry for ${item.name}`}
                        className="inquiry-btn"
                      >
                        <SendHorizontal className="inquiry-btn-send" aria-hidden="true" />
                        <span>Send Inquiry</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Zoom overlay */}
      {isZoomed && stageImage && (
        <div className="pdp-lightbox" role="dialog" aria-modal="true" onClick={() => setIsZoomed(false)}>
          <button type="button" aria-label="Close zoom" className="pdp-lightbox-close">
            <X className="w-5 h-5" />
          </button>
          <img
            src={stageImage.src}
            alt={stageImage.alt || product.name}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
