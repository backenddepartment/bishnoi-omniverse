'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, X, Plus, Check, ChevronDown, Info } from 'lucide-react';
import catalogData from '@/lib/data/catalogData.json';
import { getCategoryIcon } from '@/lib/catalogIcons';
import heroImg from '@/app/assets/ppe.jpg';

const IMG = {
  hero: heroImg.src,
};

interface ProductItem {
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
}

export default function CatalogPage() {
  const { hero, categories, subcategories, products } = catalogData;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quoteItems, setQuoteItems] = useState<ProductItem[]>([]);
  const [isRfqModalOpen, setIsRfqModalOpen] = useState<boolean>(false);
  const [rfqSubmitted, setRfqSubmitted] = useState<boolean>(false);
  const [hospitalInfo, setHospitalInfo] = useState({ name: '', email: '', phone: '', notes: '' });

  const subcategoryName = useMemo(() => {
    const map = new Map(subcategories.map((s) => [s.id, s.name]));
    return (id: string) => map.get(id) ?? '';
  }, [subcategories]);

  // Pre-select a category (?category=slug), subcategory (?subcategory=slug) or search term
  // (?search=text) when arriving from the nav's Catalog mega-menu or the navbar search bar.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category && categories.some((c) => c.id === category)) {
      setSelectedCategory(category);
    }
    const subcategory = params.get('subcategory');
    const parent = subcategories.find((s) => s.id === subcategory);
    if (parent) {
      setSelectedCategory(parent.categoryId);
      setSelectedSubcategory(parent.id);
    }
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [categories, subcategories]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((item: ProductItem) => {
      const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
      const matchesSubcategory =
        selectedSubcategory === 'all' || item.subcategoryId === selectedSubcategory;
      const matchesSearch =
        query === '' ||
        [
          item.name,
          item.description,
          item.specifications,
          item.sizes,
          item.useSetting,
          item.endUser,
          item.regulatoryClass,
          subcategoryName(item.subcategoryId),
        ]
          .join(' ')
          .toLowerCase()
          .includes(query);
      return matchesCategory && matchesSubcategory && matchesSearch;
    });
  }, [selectedCategory, selectedSubcategory, searchQuery, products, subcategoryName]);

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('all');
  };

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

  const isFiltered = selectedCategory !== 'all' || selectedSubcategory !== 'all';

  return (
    <div className="w-full catalog-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="hero-media">
          <img
            src={IMG.hero}
            alt="Personal protective equipment laid out on a blue surgical gown — safety goggles, a face mask and latex gloves"
            loading="eager"
          />
        </div>
        <div className="hero-content">
          <h1>{hero.headline}</h1>
          <p className="lede">{hero.subheadline}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#catalog-browser">
              {hero.ctaExplore}
            </a>
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
            {/* Category rail — the selected category expands to its subcategories */}
            <aside className="catalog-sidebar">
              <h3 className="catalog-side-title">Category</h3>
              <ul className="catalog-cats">
                <li>
                  <button
                    type="button"
                    onClick={() => selectCategory('all')}
                    className={`catalog-cat${selectedCategory === 'all' ? ' is-active' : ''}`}
                  >
                    <span>All Clinical Categories</span>
                    <span className="catalog-cat-count">{products.length}</span>
                  </button>
                </li>
                {categories.map((cat) => {
                  const count = products.filter((p) => p.categoryId === cat.id).length;
                  const isOpen = selectedCategory === cat.id;
                  const subs = subcategories.filter((s) => s.categoryId === cat.id);
                  return (
                    <li key={cat.id}>
                      <button
                        type="button"
                        onClick={() => selectCategory(cat.id)}
                        aria-expanded={isOpen}
                        className={`catalog-cat${isOpen ? ' is-active' : ''}`}
                      >
                        <span className="catalog-cat-label">
                          <ChevronDown
                            className={`catalog-cat-chevron${isOpen ? ' is-open' : ''}`}
                            aria-hidden="true"
                          />
                          {cat.name}
                        </span>
                        <span className="catalog-cat-count">{count}</span>
                      </button>

                      {isOpen && subs.length > 0 && (
                        <ul className="catalog-subs">
                          <li>
                            <button
                              type="button"
                              onClick={() => setSelectedSubcategory('all')}
                              className={`catalog-sub${selectedSubcategory === 'all' ? ' is-active' : ''}`}
                            >
                              <span>All {cat.name}</span>
                              <span className="catalog-cat-count">{count}</span>
                            </button>
                          </li>
                          {subs.map((sub) => {
                            const subCount = products.filter((p) => p.subcategoryId === sub.id).length;
                            return (
                              <li key={sub.id}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedSubcategory(sub.id)}
                                  className={`catalog-sub${selectedSubcategory === sub.id ? ' is-active' : ''}`}
                                >
                                  <span>{sub.name}</span>
                                  <span className="catalog-cat-count">{subCount}</span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
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
                    placeholder="Search by product, clinical need, size, use setting or department…"
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
                  Showing {filteredProducts.length} Product(s)
                  {selectedSubcategory !== 'all' && ` in ${subcategoryName(selectedSubcategory)}`}
                </span>
                {isFiltered && (
                  <button
                    onClick={() => selectCategory('all')}
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
                    const Icon = getCategoryIcon(product.categoryId);
                    return (
                      <div key={product.id} className="product-card">
                        <div className="product-card-media is-icon">
                          {product.sterility && (
                            <span className="product-badge">{product.sterility}</span>
                          )}
                          <Link
                            href={`/catalog/${product.id}`}
                            aria-label={product.name}
                            className="product-card-iconwrap"
                          >
                            <Icon strokeWidth={1} aria-hidden="true" />
                          </Link>
                        </div>

                        <div className="product-card-body">
                          <Link href={`/catalog/${product.id}`}>
                            <h3>{product.name}</h3>
                          </Link>

                          <div className="product-card-foot">
                            <div>
                              <span className="product-card-meta">Subcategory</span>
                              <span className="product-card-brand">
                                {subcategoryName(product.subcategoryId)}
                              </span>
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

              <p className="catalog-disclaimer">
                <Info className="w-3.5 h-3.5" />
                <span>
                  Catalog entries describe product <em>types</em>. Sterility, sizes, regulatory class
                  and precautions are general reference information — confirm against the
                  manufacturer&apos;s documentation and your local import requirements before ordering.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

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
                            • {item.name} ({subcategoryName(item.subcategoryId)})
                          </span>
                          <button type="button" onClick={() => removeFromQuote(item.id)} className="text-accent-dark hover:underline font-semibold">
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rfq-name" className="field-label">
                      Hospital / Facility Name
                    </label>
                    <input
                      id="rfq-name"
                      type="text"
                      required
                      value={hospitalInfo.name}
                      onChange={(e) => setHospitalInfo({ ...hospitalInfo, name: e.target.value })}
                      className="field-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="rfq-email" className="field-label">
                      Procurement Email
                    </label>
                    <input
                      id="rfq-email"
                      type="email"
                      required
                      value={hospitalInfo.email}
                      onChange={(e) => setHospitalInfo({ ...hospitalInfo, email: e.target.value })}
                      className="field-input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="rfq-phone" className="field-label">
                    Contact Number
                  </label>
                  <input
                    id="rfq-phone"
                    type="tel"
                    value={hospitalInfo.phone}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, phone: e.target.value })}
                    className="field-input"
                  />
                </div>

                <div>
                  <label htmlFor="rfq-notes" className="field-label">
                    Requisition Details / Additional Items
                  </label>
                  <textarea
                    id="rfq-notes"
                    rows={4}
                    placeholder="Paste your requisition list here, or describe the items and quantities you need."
                    value={hospitalInfo.notes}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, notes: e.target.value })}
                    className="field-textarea"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full justify-center">
                  Submit Requisition
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
