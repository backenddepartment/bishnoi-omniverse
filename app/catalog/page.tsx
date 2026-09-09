'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, FileText, X, ArrowRight, Plus, Check } from 'lucide-react';
import catalogData from '@/lib/data/catalogData.json';
import { productImages } from '@/lib/catalogImages';
import sectionDetail from '@/lib/data/sectionDetailData.json';

const IMG = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Ethylene_oxide_sterilisation_sticker_on_box_of_medical_supplies.jpg',
};

interface ProductItem {
  id: string;
  categoryId: string;
  name: string;
  brand: string;
  origin: string;
  visualTags: string[];
  whatItDoes: string;
  whyItsSafe: string[];
  specs: string;
  certUrl: string;
}

export default function CatalogPage() {
  const { hero, categories, products, trustBanner, rfqCheckout } = catalogData;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quoteItems, setQuoteItems] = useState<ProductItem[]>([]);
  const [isRfqModalOpen, setIsRfqModalOpen] = useState<boolean>(false);
  const [activeCert, setActiveCert] = useState<{ title: string; content: string } | null>(null);
  const [rfqSubmitted, setRfqSubmitted] = useState<boolean>(false);
  const [hospitalInfo, setHospitalInfo] = useState({ name: '', email: '', phone: '', notes: '' });

  // Pre-select a category (?category=slug) or search term (?search=text) when arriving
  // from the nav's Catalog mega-menu or the navbar search bar.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category && categories.some((c) => c.id === category)) {
      setSelectedCategory(category);
    }
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((item: ProductItem) => {
      const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.whatItDoes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.specs.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.visualTags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, products]);

  const addToQuote = (product: ProductItem) => {
    if (!quoteItems.some((item) => item.id === product.id)) {
      setQuoteItems([...quoteItems, product]);
    }
  };

  const removeFromQuote = (productId: string) => {
    setQuoteItems(quoteItems.filter((item) => item.id !== productId));
  };

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRfqSubmitted(true);
  };

  return (
    <div className="w-full catalog-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="hero-media">
          <img src={IMG.hero} alt="Sterile hospital medical supplies" loading="eager" />
        </div>
        <div className="hero-content">
          <span className="eyebrow on-dark">{hero.title}</span>
          <h1>{hero.headline}</h1>
          <p className="lede">{hero.subheadline}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#catalog-browser">
              {hero.ctaSearch.replace(/[\[\]]/g, '')} <ArrowRight />
            </a>
            <button type="button" onClick={() => setIsRfqModalOpen(true)} className="btn btn-outline">
              {hero.ctaUpload.replace(/[\[\]]/g, '')}
            </button>
          </div>
        </div>
      </section>

      {/* Quote Bar Sticky Banner */}
      {quoteItems.length > 0 && (
        <div className="sticky top-0 z-40 bg-ink text-white px-6 py-3 border-b border-white/10 shadow-lg">
          <div className="wrap !px-0 md:!px-8 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide">
              <ShoppingBag className="w-4 h-4 text-accent" />
              <span>Quote List: {quoteItems.length} item(s) selected</span>
            </div>
            <button onClick={() => setIsRfqModalOpen(true)} className="btn btn-primary !py-1.5 !px-4 !text-xs">
              Submit Requisition ({quoteItems.length})
            </button>
          </div>
        </div>
      )}

      {/* Catalog Browser */}
      <section id="catalog-browser" className="section section-tight">
        <div className="wrap">
          <div className="catalog-shell">
            {/* Category rail */}
            <aside className="catalog-sidebar">
              <h3 className="catalog-side-title">Category</h3>
              <ul className="catalog-cats">
                <li>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`catalog-cat${selectedCategory === 'all' ? ' is-active' : ''}`}
                  >
                    <span>All Clinical Categories</span>
                    <span className="catalog-cat-count">{products.length}</span>
                  </button>
                </li>
                {categories.map((cat) => {
                  const count = products.filter((p) => p.categoryId === cat.id).length;
                  return (
                    <li key={cat.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`catalog-cat${selectedCategory === cat.id ? ' is-active' : ''}`}
                      >
                        <span>{cat.name}</span>
                        <span className="catalog-cat-count">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <hr className="catalog-side-rule" />

              <button
                type="button"
                onClick={() => setIsRfqModalOpen(true)}
                className="btn btn-primary !text-xs w-full justify-center"
              >
                Upload Requisition List
              </button>
            </aside>

            {/* Results */}
            <div className="catalog-main">
              <div className="mb-7">
                <label htmlFor="search-input" className="field-label">
                  No-Login Fast Search
                </label>
                <div className="relative">
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Search by product, gauge (e.g. G18, G22), clinical need, or certification (CE, CMDR)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="field-input !pl-12"
                  />
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted hover:text-ink"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4 mb-8">
                <span className="inline-block rounded-full bg-brand-blue px-3.5 py-1.5 text-sm font-medium text-white">
                  Showing {filteredProducts.length} Verified Product(s)
                </span>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-xs font-semibold text-accent-dark hover:underline"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="info-card text-center space-y-3 !py-12">
                  <h3 className="font-sans text-lg font-bold text-ink">No Products Found</h3>
                  <p className="text-sm text-ink-soft">
                    No items match your search term &quot;{searchQuery}&quot;. Our sourcing team can fulfill any
                    custom hospital requisition list.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsRfqModalOpen(true)}
                    className="btn btn-primary !text-xs mt-2"
                  >
                    Request Custom Sourcing
                  </button>
                </div>
              ) : (
                <div className="product-grid">
                  {filteredProducts.map((product: ProductItem) => {
                    const isAdded = quoteItems.some((item) => item.id === product.id);
                    const img = productImages[product.id];
                    return (
                      <div key={product.id} className="product-card">
                        <div className="product-card-media">
                          {product.visualTags[0] && (
                            <span className="product-badge">{product.visualTags[0]}</span>
                          )}
                          <button
                            type="button"
                            aria-label={`View compliance certificate for ${product.name}`}
                            onClick={() =>
                              setActiveCert({
                                title: product.name,
                                content: `Official Compliance Dossier for ${product.name} (${product.brand}). Sourced from audited facilities in ${product.origin}. Verified under international standards: ${product.visualTags.join(', ')}.`,
                              })
                            }
                            className="product-cert"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <Link href={`/catalog/${product.id}`}>
                            <img src={img?.src} alt={img?.alt || product.name} loading="lazy" />
                          </Link>
                        </div>

                        <div className="product-card-body">
                          <Link href={`/catalog/${product.id}`}>
                            <h3>{product.name}</h3>
                          </Link>

                          <div className="product-card-foot">
                            <div>
                              <span className="product-card-meta">Brand</span>
                              <span className="product-card-brand">{product.brand}</span>
                            </div>
                            <button
                              type="button"
                              aria-label={
                                isAdded
                                  ? `Remove ${product.name} from quote`
                                  : `Add ${product.name} to quote`
                              }
                              onClick={() => (isAdded ? removeFromQuote(product.id) : addToQuote(product))}
                              className={`product-add${isAdded ? ' is-added' : ''}`}
                            >
                              {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* The Bishnoi Omniverse Essential Hospital Line + brand table, relocated from the homepage's
          What We Supply section. All five product lines and all seven brands live here. */}
      <section className="section section-line" id="essential-hospital-line">
        <div className="wrap">
          <div className="grid-2 items-start">
            <div className="heading-lg">
              <span className="eyebrow">What We Supply</span>
              <h2 className="mb-0">{sectionDetail.essentialLine.title}</h2>
            </div>
            <div className="lead-block">
              <p className="text-ink-soft leading-relaxed m-0">{sectionDetail.essentialLine.tagline}</p>
            </div>
          </div>

          <div className="grid-3 mt-14">
            {sectionDetail.essentialLine.categories.map((cat, idx) => (
              <div key={cat.name} className="pillar">
                <span className="num">0{idx + 1}</span>
                <h3>{cat.name}</h3>
                {cat.items.map((item) => (
                  <p key={item.title}>
                    <strong className="text-ink">{item.title}</strong> {item.desc}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-16 mb-4">
            <h3 className="font-sans text-lg font-bold">{sectionDetail.brands.title}</h3>
            <p className="lead-block text-ink-soft leading-relaxed mt-1 m-0">
              {sectionDetail.brands.lead}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 pr-6 text-xs font-semibold uppercase tracking-wide text-muted">Brand</th>
                  <th className="py-3 text-xs font-semibold uppercase tracking-wide text-muted">Product Line</th>
                </tr>
              </thead>
              <tbody>
                {sectionDetail.brands.items.map((item) => (
                  <tr key={item.brand} className="border-b border-line">
                    <td className="py-4 pr-6 align-top whitespace-nowrap font-poppins text-[15px] font-semibold text-ink">
                      {item.brand}
                    </td>
                    <td className="py-4 align-top text-sm text-ink-soft leading-relaxed">{item.line}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Banner */}
      <section className="section section-line section-2col">
        <div className="wrap">
          <span className="eyebrow">Safety First</span>
          <h2 className="mb-4">{trustBanner.title}</h2>
          <p className="lead-block text-ink-soft mb-10">{trustBanner.subtitle}</p>

          <div className="grid-3">
            {trustBanner.points.map((pt) => (
              <div key={pt.step} className="pillar">
                <span className="num">Step 0{pt.step}</span>
                <h3>{pt.title}</h3>
                <p>{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RFQ / Checkout */}
      <section className="section">
        <div className="wrap">
          <span className="eyebrow">Fast Requisition</span>
          <h2 className="mb-3">{rfqCheckout.title}</h2>
          <p className="lead-block text-ink-soft italic mb-10">{rfqCheckout.subtitle}</p>

          <div className="grid-3 mb-10 text-sm">
            {rfqCheckout.steps.map((st) => (
              <div key={st.step} className="pillar">
                <h3>{st.title.replace(/^\d+\.\s*/, '')}</h3>
                <p>{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button type="button" onClick={() => setIsRfqModalOpen(true)} className="btn btn-primary justify-center">
              {rfqCheckout.ctaSubmit.replace(/[\[\]]/g, '')} <ArrowRight />
            </button>
            <Link href="/contact?type=hospital-supplies" className="btn btn-outline on-light justify-center">
              {rfqCheckout.ctaTalk.replace(/[\[\]]/g, '')}
            </Link>
          </div>
        </div>
      </section>

      {/* Compliance Certificate Modal */}
      {activeCert && (
        <div className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-4">
          <div className="bg-surface rounded max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h4 className="font-sans text-base font-bold text-ink m-0">Compliance Certificate</h4>
              <button onClick={() => setActiveCert(null)} className="p-1 hover:bg-paper-2 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs font-semibold text-muted">{activeCert.title}</p>
            <p className="text-sm text-ink-soft leading-relaxed bg-paper-2 p-4 rounded border border-line">{activeCert.content}</p>
            <div className="pt-2 flex justify-end">
              <button onClick={() => setActiveCert(null)} className="btn btn-primary !text-xs">
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RFQ Modal */}
      {isRfqModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface rounded max-w-2xl w-full p-6 md:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted block">No-Login Frictionless RFQ</span>
                <h3 className="font-sans text-xl font-bold text-ink m-0">Submit Hospital Requisition List</h3>
              </div>
              <button onClick={() => setIsRfqModalOpen(false)} className="p-1 hover:bg-paper-2 rounded">
                <X className="w-6 h-6" />
              </button>
            </div>

            {rfqSubmitted ? (
              <div className="p-6 bg-ink text-white rounded space-y-3">
                <h4 className="font-sans text-lg font-bold text-white m-0">Requisition Received</h4>
                <p className="text-sm !text-[#d7d2c1] leading-relaxed">
                  Thank you! Your hospital requisition has been sent to our global sourcing desk. A dedicated Bishnoi supply
                  manager will return a fully costed quote within <strong className="text-white">24 hours</strong>.
                </p>
                <button
                  onClick={() => {
                    setRfqSubmitted(false);
                    setIsRfqModalOpen(false);
                    setQuoteItems([]);
                  }}
                  className="btn btn-outline !py-2 !px-4 !text-xs mt-2"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleRfqSubmit} className="space-y-4">
                {quoteItems.length > 0 && (
                  <div className="p-4 bg-paper-2 rounded border border-line space-y-2">
                    <span className="text-xs font-semibold text-ink-soft block">Selected Items from Catalog ({quoteItems.length}):</span>
                    <ul className="space-y-1 text-xs text-ink m-0 p-0 list-none">
                      {quoteItems.map((item) => (
                        <li key={item.id} className="flex justify-between items-center">
                          <span>
                            • {item.name} ({item.brand})
                          </span>
                          <button type="button" onClick={() => removeFromQuote(item.id)} className="text-accent-dark hover:underline font-semibold">
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">Hospital / Facility Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. St. Jude Hospital"
                      value={hospitalInfo.name}
                      onChange={(e) => setHospitalInfo({ ...hospitalInfo, name: e.target.value })}
                      className="field-input"
                    />
                  </div>

                  <div>
                    <label className="field-label">Official Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="procurement@hospital.org"
                      value={hospitalInfo.email}
                      onChange={(e) => setHospitalInfo({ ...hospitalInfo, email: e.target.value })}
                      className="field-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label">Phone / WhatsApp Number</label>
                  <input
                    type="text"
                    placeholder="+1 555-0199 or +91..."
                    value={hospitalInfo.phone}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, phone: e.target.value })}
                    className="field-input"
                  />
                </div>

                <div>
                  <label className="field-label">Paste Requisition List / Additional Items *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="List required items, quantities, gauge sizes, or paste your internal requisition text..."
                    value={hospitalInfo.notes}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, notes: e.target.value })}
                    className="field-textarea"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsRfqModalOpen(false)} className="btn btn-outline on-light">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Requisition (24hr SLA)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
