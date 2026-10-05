'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Info,
  Package,
  RecycleIcon,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  X,
  ZoomIn,
} from 'lucide-react';
import type { ProductImage } from '@/lib/catalogImages';
import { parseSizes } from '@/lib/catalogSizes';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CategoryArt } from '@/components/catalog/CategoryArt';
import type { InquiryType } from '@/components/catalog/InquiryMenu';
import { productPrefill } from '@/components/PersonaInquiryForm';
import { InquiryPanel, type InquiryPanelHandle } from '@/components/quote/InquiryPanel';
import { AddToQuoteButton } from '@/components/quote/AddToQuoteButton';
import { absoluteUrl } from '@/lib/siteUrl';
import { EQUIPMENT_PATH, categoryPath, equipmentCrumbs, productPath, subcategoryPath } from '@/lib/catalogRoutes';

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

/** A sibling subcategory of the product's category, linked from the foot of the page. */
export interface PdpRelated {
  id: string;
  name: string;
  categoryId: string;
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

// Product Form opens first: what the product is made as (sterility, reuse) and the sizes it comes in.
const TABS = ['Product Form', 'Use & Setting', 'At a Glance', 'Specifications', 'Safety & Handling'] as const;
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

  const [activeSize, setActiveSize] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('Product Form');
  const [isZoomed, setIsZoomed] = useState(false);
  // The inquiry panel beside the product; the At a Glance tab's link opens its hospital form.
  const inquiryRef = useRef<HTMLElement>(null);
  const panelRef = useRef<InquiryPanelHandle>(null);
  const activeSizeLabel = sizes.length > 0 ? sizes[activeSize] : undefined;
  const goToInquiry = (type: InquiryType) => {
    panelRef.current?.open(type);
    // Matters where the panel sits under the details. .scroll-target keeps it clear of the header.
    requestAnimationFrame(() => inquiryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  };

  // A single image per product: the first gallery photo, else the main image.
  const stageImage = product.gallery?.[0] ?? image;

  return (
    <div className="w-full catalog-page pdp">
      <div className="wrap">
        <Breadcrumbs
          items={equipmentCrumbs(
            categoryId && categoryName ? { id: categoryId, name: categoryName } : undefined,
            product.name
          )}
        />
      </div>

      {/* ── Product details + inquiry form ───────────────────────────── */}
      <section className="pdp-top">
        <div className="wrap pdp-top-grid">
          {/* Left: the image with the product header beside it, the description and options across
              under both, then the tabs. Right: the inquiry panel. */}
          <div className="pdp-main">
            <div className="pdp-gallery">
              {/* One image per product: its photo, or its category's icon until one is cleared. */}
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
                  <div className="pdp-stage-icon" role="img" aria-label={product.name}>
                    <CategoryArt categoryId={product.categoryId} />
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

            {/* Product header, beside the image. */}
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

            </div>

            {/* Description and options: across the column, under the image and header. */}
            <div className="pdp-body">
              <p className="pdp-lede">{product.description}</p>

                {/* Add to Quote and trust notes, under the description. */}
              <div className="pdp-buy">
                <div className="pdp-quote-row">
                  <AddToQuoteButton
                    variant="block"
                    productId={product.id}
                    productName={product.name}
                    size={activeSizeLabel}
                  />
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

            {/* Tabs sit under the product header. */}
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

                {activeTab === 'Product Form' && (
                  <>
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
                    {!product.sterility && !product.reuse && !product.sizes && (
                      <p>No product form or sizes recorded for this product.</p>
                    )}
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
                    <button type="button" onClick={() => goToInquiry('hospital')} className="pdp-summary-cta">
                      Request this product <ArrowRight className="w-4 h-4" />
                    </button>
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

          {/* The inquiry panel: who is asking first, then that type's form. */}
          <aside ref={inquiryRef} className="pdp-form-col scroll-target" aria-label="Send inquiry">
            <InquiryPanel
              ref={panelRef}
              subtitle="Submit your details to get a formal quote for this product."
              // The form starts with this product, and the size picked when it opens.
              prefillFor={(persona) => productPrefill(persona, product.name, activeSizeLabel)}
              items={[
                {
                  name: activeSizeLabel ? `${product.name} (size: ${activeSizeLabel})` : product.name,
                  url: absoluteUrl(`${productPath(product)}/`),
                },
              ]}
            />
          </aside>
        </div>
      </section>

      {/* ── Other subcategories of this category ──────────────────────── */}
      {related.length > 0 && (
        <section className="pdp-related">
          <div className="wrap">
            <div className="pdp-related-head">
              <h2>{categoryName ? `More in ${categoryName}` : 'You May Also Like'}</h2>
              <Link href={categoryId ? categoryPath(categoryId) : EQUIPMENT_PATH}>
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pdp-subcat-grid">
              {related.map((item) => (
                <Link key={item.id} href={subcategoryPath(item)} className="pdp-subcat-card">
                  <span>{item.name}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
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
