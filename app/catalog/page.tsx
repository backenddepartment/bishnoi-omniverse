'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, CheckCircle, FileText, X, ArrowRight } from 'lucide-react';
import catalogData from '@/lib/data/catalogData.json';

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

  // Pre-select a category when arriving from the nav's Catalog mega-menu (?category=slug).
  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get('category');
    if (category && categories.some((c) => c.id === category)) {
      setSelectedCategory(category);
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
          {/* Search Bar */}
          <div className="mb-10">
            <label htmlFor="search-input" className="field-label">
              No-Login Fast Search
            </label>
            <div className="relative max-w-3xl">
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

          {/* Category Tabs */}
          <div className="mb-12">
            <span className="field-label !mb-3">1. Browse by Clinical Need</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-full border transition ${
                  selectedCategory === 'all' ? 'bg-ink text-white border-ink' : 'bg-surface text-ink border-line hover:border-accent'
                }`}
              >
                All Clinical Categories ({products.length})
              </button>

              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                const selected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-full border transition ${
                      selected ? 'bg-ink text-white border-ink' : 'bg-surface text-ink border-line hover:border-accent'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Cards */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                Showing {filteredProducts.length} Verified Product(s)
              </span>
              {selectedCategory !== 'all' && (
                <button onClick={() => setSelectedCategory('all')} className="text-xs font-semibold text-accent-dark hover:underline">
                  Reset Filter
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="info-card text-center space-y-3 !py-12">
                <h3 className="font-sans text-lg font-bold text-ink">No Products Found</h3>
                <p className="text-sm text-ink-soft">
                  No items match your search term &quot;{searchQuery}&quot;. Our sourcing team can fulfill any custom hospital
                  requisition list.
                </p>
                <button type="button" onClick={() => setIsRfqModalOpen(true)} className="btn btn-primary !text-xs mt-2">
                  Request Custom Sourcing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredProducts.map((product: ProductItem) => {
                  const isAdded = quoteItems.some((item) => item.id === product.id);
                  return (
                    <div key={product.id} className="info-card !p-6 md:!p-8 space-y-6">
                      <div className="flex flex-wrap items-center gap-2">
                        {product.visualTags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 bg-paper-2 text-ink-soft border border-line rounded-full text-xs font-semibold">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div>
                        <Link
                          href={`/catalog/${product.id}`}
                          className="no-underline text-ink hover:text-accent-dark transition-colors"
                        >
                          <h3 className="font-sans text-xl md:text-2xl font-bold leading-snug">{product.name}</h3>
                        </Link>
                        <div className="text-xs font-semibold text-muted mt-1">
                          Brand: <span className="text-ink font-semibold">{product.brand}</span> | Origin:{' '}
                          <span className="text-ink font-semibold">{product.origin}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-paper-2 rounded p-5 border border-line text-sm">
                        <div>
                          <strong className="text-xs uppercase tracking-wide text-muted block mb-1">What It Does</strong>
                          <p className="text-ink-soft leading-relaxed font-medium m-0">{product.whatItDoes}</p>
                        </div>

                        <div>
                          <strong className="text-xs uppercase tracking-wide text-muted block mb-1">Why It&apos;s Safe &amp; Compliant</strong>
                          <ul className="space-y-1.5 text-xs text-ink-soft m-0 p-0 list-none">
                            {product.whyItsSafe.map((bullet, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="text-xs text-ink-soft font-mono bg-paper p-3 rounded border border-line">
                        <strong>{product.specs}</strong>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-line">
                        <Link href={`/catalog/${product.id}`} className="btn btn-outline on-light">
                          View Details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => (isAdded ? removeFromQuote(product.id) : addToQuote(product))}
                          className={isAdded ? 'btn !bg-ink-2 !text-white' : 'btn btn-primary'}
                        >
                          {isAdded ? 'Remove From Quote' : 'Add To Quote'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveCert({
                              title: product.name,
                              content: `Official Compliance Dossier for ${product.name} (${product.brand}). Sourced from audited facilities in ${product.origin}. Verified under international standards: ${product.visualTags.join(', ')}.`,
                            })
                          }
                          className="btn btn-outline on-light"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Compliance Certificate</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
