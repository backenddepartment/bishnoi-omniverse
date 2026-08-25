'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, CheckCircle, FileText, X } from 'lucide-react';
import catalogData from '@/lib/data/catalogData.json';

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

  // Filter products by selected category and search query
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
    <div className="w-full">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 border-b border-black">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
          {hero.title}
        </span>
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-black leading-tight max-w-4xl">
          {hero.headline}
        </h1>
        <p className="text-base md:text-lg text-slate-800 mt-6 max-w-3xl leading-relaxed font-normal">
          {hero.subheadline}
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8">
          <a
            href="#catalog-browser"
            className="px-6 py-3.5 bg-black text-white text-sm uppercase font-bold text-center border border-black hover:bg-slate-900 transition"
          >
            {hero.ctaSearch}
          </a>
          <button
            type="button"
            onClick={() => setIsRfqModalOpen(true)}
            className="px-6 py-3.5 bg-white text-black text-sm uppercase font-bold text-center border border-black hover:bg-slate-100 transition"
          >
            {hero.ctaUpload}
          </button>
        </div>
      </section>

      {/* Quote Bar Sticky Banner if items exist */}
      {quoteItems.length > 0 && (
        <div className="sticky top-0 z-40 bg-black text-white px-6 py-3 border-b border-white shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs uppercase font-bold tracking-wider">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Quote List: {quoteItems.length} item(s) selected</span>
            </div>
            <button
              onClick={() => setIsRfqModalOpen(true)}
              className="px-4 py-1.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-slate-200"
            >
              [ SUBMIT REQUISITION LIST ({quoteItems.length}) ]
            </button>
          </div>
        </div>
      )}

      {/* Catalog Browser Section */}
      <section id="catalog-browser" className="max-w-6xl mx-auto px-6 py-16 border-b border-black">
        {/* Search Bar */}
        <div className="mb-10">
          <label htmlFor="search-input" className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
            No-Login Fast Search
          </label>
          <div className="relative max-w-3xl">
            <input
              id="search-input"
              type="text"
              placeholder="Search by product, gauge (e.g. G18, G22), clinical need, or certification (CE, CMDR)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-12 text-sm md:text-base border-2 border-black bg-slate-50 focus:outline-none focus:bg-white text-black font-medium"
            />
            <Search className="w-5 h-5 absolute left-4 top-4 text-slate-500" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-4 text-xs uppercase font-bold text-slate-500 hover:text-black"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <div className="mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-3">
            1. Browse by Clinical Need
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border transition ${
                selectedCategory === 'all'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-slate-300 hover:border-black'
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
                  className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border transition ${
                    selected
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-slate-300 hover:border-black'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-black pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Showing {filteredProducts.length} Verified Product(s)
            </span>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold uppercase text-slate-600 hover:underline"
              >
                Reset Filter
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-12 border border-black bg-slate-50 text-center space-y-3">
              <h3 className="text-lg font-bold uppercase text-black">No Products Found</h3>
              <p className="text-sm text-slate-600">
                No items match your search term &quot;{searchQuery}&quot;. Our sourcing team can fulfill any custom hospital requisition list.
              </p>
              <button
                type="button"
                onClick={() => setIsRfqModalOpen(true)}
                className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider"
              >
                Request Custom Sourcing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {filteredProducts.map((product: ProductItem) => {
                const isAdded = quoteItems.some((item) => item.id === product.id);
                return (
                  <div key={product.id} className="p-6 md:p-8 border-2 border-black bg-white space-y-6 shadow-sm hover:shadow-md transition">
                    {/* Visual Compliance Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {product.visualTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-100 text-slate-900 border border-slate-300 text-xs font-bold uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Product Name & Brand */}
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold uppercase text-black leading-snug">
                        {product.name}
                      </h3>
                      <div className="text-xs font-bold text-slate-600 uppercase tracking-wide mt-1">
                        Brand: <span className="text-black font-semibold">{product.brand}</span> | Origin: <span className="text-black font-semibold">{product.origin}</span>
                      </div>
                    </div>

                    {/* What it does & Why it's safe */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 border border-slate-300 text-sm">
                      <div>
                        <strong className="text-xs uppercase tracking-widest text-slate-500 block mb-1">
                          What It Does
                        </strong>
                        <p className="text-slate-800 leading-relaxed font-medium">
                          {product.whatItDoes}
                        </p>
                      </div>

                      <div>
                        <strong className="text-xs uppercase tracking-widest text-slate-500 block mb-1">
                          Why It&apos;s Safe & Compliant
                        </strong>
                        <ul className="space-y-1.5 text-xs text-slate-800">
                          {product.whyItsSafe.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-slate-900 shrink-0 mt-0.5" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Specs / Gauges */}
                    <div className="text-xs text-slate-700 font-mono bg-white p-3 border border-slate-200">
                      <strong>{product.specs}</strong>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => (isAdded ? removeFromQuote(product.id) : addToQuote(product))}
                        className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border transition ${
                          isAdded
                            ? 'bg-slate-900 text-white border-black'
                            : 'bg-black text-white border-black hover:bg-slate-800'
                        }`}
                      >
                        {isAdded ? '[ REMOVE FROM QUOTE ]' : '[ ADD TO QUOTE ]'}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveCert({
                            title: product.name,
                            content: `Official Compliance Dossier for ${product.name} (${product.brand}). Sourced from audited facilities in ${product.origin}. Verified under international standards: ${product.visualTags.join(', ')}.`,
                          })
                        }
                        className="px-5 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider border border-black hover:bg-slate-100 transition flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>[ VIEW COMPLIANCE CERTIFICATE ]</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Trust & Transparency Banner (Mid-Page) */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-black">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
          Safety First
        </span>
        <h2 className="text-2xl md:text-3xl font-bold uppercase text-black mb-4">
          {trustBanner.title}
        </h2>
        <p className="text-sm md:text-base text-slate-800 max-w-3xl mb-10 leading-relaxed">
          {trustBanner.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustBanner.points.map((pt) => (
            <div key={pt.step} className="p-6 border border-black bg-white space-y-2">
              <span className="text-xs font-bold uppercase text-slate-500 block">Step 0{pt.step}</span>
              <h3 className="text-lg font-bold uppercase text-black">{pt.title}</h3>
              <p className="text-sm text-slate-800 leading-relaxed">{pt.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Frictionless Checkout / RFQ Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
          Fast Requisition
        </span>
        <h2 className="text-2xl md:text-3xl font-bold uppercase text-black mb-3">
          {rfqCheckout.title}
        </h2>
        <p className="text-sm md:text-base text-slate-800 max-w-3xl mb-10 leading-relaxed italic">
          {rfqCheckout.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-sm">
          {rfqCheckout.steps.map((st) => (
            <div key={st.step} className="p-6 border border-black bg-slate-50 space-y-2">
              <h4 className="text-base font-bold uppercase text-black">{st.title}</h4>
              <p className="text-slate-800 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            type="button"
            onClick={() => setIsRfqModalOpen(true)}
            className="px-8 py-4 bg-black text-white text-sm font-bold uppercase tracking-wider border border-black hover:bg-slate-900 transition text-center"
          >
            {rfqCheckout.ctaSubmit}
          </button>
          <Link
            href="/contact?type=hospital-supplies"
            className="px-8 py-4 bg-white text-black text-sm font-bold uppercase tracking-wider border border-black hover:bg-slate-100 transition text-center"
          >
            {rfqCheckout.ctaTalk}
          </Link>
        </div>
      </section>

      {/* Compliance Certificate Modal */}
      {activeCert && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-black pb-3">
              <h4 className="text-base font-bold uppercase text-black">Compliance Certificate</h4>
              <button onClick={() => setActiveCert(null)} className="p-1 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs font-bold uppercase text-slate-500">{activeCert.title}</p>
            <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 border border-slate-300">
              {activeCert.content}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveCert(null)}
                className="px-4 py-2 bg-black text-white text-xs font-bold uppercase"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RFQ / Requisition Upload Modal */}
      {isRfqModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-black max-w-2xl w-full p-6 md:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-black pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block">
                  No-Login Frictionless RFQ
                </span>
                <h3 className="text-xl font-bold uppercase text-black">
                  Submit Hospital Requisition List
                </h3>
              </div>
              <button onClick={() => setIsRfqModalOpen(false)} className="p-1 hover:bg-slate-100">
                <X className="w-6 h-6" />
              </button>
            </div>

            {rfqSubmitted ? (
              <div className="p-6 bg-slate-900 text-white space-y-3">
                <h4 className="text-lg font-bold uppercase text-white">Requisition Received</h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  Thank you! Your hospital requisition has been sent to our global sourcing desk. A dedicated Bishnoi supply manager will return a fully costed quote within <strong>24 hours</strong>.
                </p>
                <button
                  onClick={() => {
                    setRfqSubmitted(false);
                    setIsRfqModalOpen(false);
                    setQuoteItems([]);
                  }}
                  className="mt-4 px-4 py-2 bg-white text-black text-xs font-bold uppercase"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleRfqSubmit} className="space-y-4">
                {quoteItems.length > 0 && (
                  <div className="p-4 bg-slate-50 border border-slate-300 space-y-2">
                    <span className="text-xs font-bold uppercase text-slate-700 block">
                      Selected Items from Catalog ({quoteItems.length}):
                    </span>
                    <ul className="space-y-1 text-xs text-slate-900">
                      {quoteItems.map((item) => (
                        <li key={item.id} className="flex justify-between items-center">
                          <span>• {item.name} ({item.brand})</span>
                          <button
                            type="button"
                            onClick={() => removeFromQuote(item.id)}
                            className="text-red-600 hover:underline font-bold"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                      Hospital / Facility Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. St. Jude Hospital"
                      value={hospitalInfo.name}
                      onChange={(e) => setHospitalInfo({ ...hospitalInfo, name: e.target.value })}
                      className="w-full p-2.5 text-sm bg-slate-50 border border-black focus:outline-none focus:bg-white text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="procurement@hospital.org"
                      value={hospitalInfo.email}
                      onChange={(e) => setHospitalInfo({ ...hospitalInfo, email: e.target.value })}
                      className="w-full p-2.5 text-sm bg-slate-50 border border-black focus:outline-none focus:bg-white text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 555-0199 or +91..."
                    value={hospitalInfo.phone}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, phone: e.target.value })}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-black focus:outline-none focus:bg-white text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Paste Requisition List / Additional Items *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="List required items, quantities, gauge sizes, or paste your internal requisition text..."
                    value={hospitalInfo.notes}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, notes: e.target.value })}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-black focus:outline-none focus:bg-white text-black"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRfqModalOpen(false)}
                    className="px-4 py-2.5 bg-white text-black text-xs font-bold uppercase border border-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase border border-black hover:bg-slate-900"
                  >
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
