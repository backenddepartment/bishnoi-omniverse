'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  LayoutGrid,
  List,
  ChevronDown,
  SendHorizontal,
  ImageIcon,
  RotateCcw,
} from 'lucide-react';
import { AnimatePresence, MotionConfig, motion, type Variants } from 'framer-motion';
import catalogData from '@/lib/data/catalogData.json';
import { PRODUCT_GALLERIES } from '@/lib/productImageOverrides';
import heroImg from '@/app/assets/ppe.jpg';

const IMG = {
  hero: heroImg.src,
};

const PRODUCTS_PER_PAGE = 12;

// Sidebar subcategory list: opening stacks the rows in top to bottom; closing fades them out
// bottom to top while the list folds shut, so a category collapses as smoothly as it opens.
const SIDEBAR_EASE = [0.2, 0.8, 0.2, 1] as const;
const SUBCATEGORY_LIST: Variants = {
  open: {
    height: 'auto',
    opacity: 1,
    marginTop: 2,
    marginBottom: 8,
    transition: {
      height: { duration: 0.35, ease: SIDEBAR_EASE },
      opacity: { duration: 0.2 },
      staggerChildren: 0.055,
      delayChildren: 0.05,
    },
  },
  closed: {
    height: 0,
    opacity: 0,
    marginTop: 0,
    marginBottom: 0,
    transition: {
      height: { duration: 0.35, ease: SIDEBAR_EASE, delay: 0.12 },
      opacity: { duration: 0.25, delay: 0.15 },
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};
const SUBCATEGORY_ITEM: Variants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.45, ease: SIDEBAR_EASE } },
  closed: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

type ViewMode = 'grid' | 'table';
const VIEW_MODE_KEY = 'catalog-view-mode';

type SortKey = 'default' | 'name-asc' | 'name-desc' | 'sterile-first' | 'subcategory-asc';
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'name-asc', label: 'Name: A → Z' },
  { value: 'name-desc', label: 'Name: Z → A' },
  { value: 'sterile-first', label: 'Sterile First' },
  { value: 'subcategory-asc', label: 'Subcategory: A → Z' },
];

// Inquiry dropdown footprint, used to keep it on-screen when positioning it.
const INQUIRY_MENU_WIDTH = 220;
const INQUIRY_MENU_HEIGHT = 100;

interface InquiryMenuState {
  productId: string;
  left: number;
  top?: number;
  bottom?: number;
}

// Page buttons to render: always the first and last page plus the current page's neighbours,
// with an ellipsis standing in for each skipped run (e.g. 1 … 4 5 6 … 26).
const getPageNumbers = (current: number, total: number): (number | 'ellipsis')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | 'ellipsis')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('ellipsis');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('ellipsis');
  pages.push(total);
  return pages;
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
  // Whether the selected category's subcategory list is expanded; clicking it again folds it.
  const [subsOpen, setSubsOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortKey, setSortKey] = useState<SortKey>('default');
  const [inquiryMenu, setInquiryMenu] = useState<InquiryMenuState | null>(null);
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

  // Restore the visitor's last Grid/Table choice; storage can be unavailable (private mode).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(VIEW_MODE_KEY);
      if (saved === 'grid' || saved === 'table') setViewMode(saved);
    } catch {}
  }, []);

  // The inquiry menu is fixed-positioned (the table's sideways scroll would clip it), so rather
  // than follow its button it closes on any outside click, scroll, resize or Escape.
  useEffect(() => {
    if (!inquiryMenu) return;
    const close = () => setInquiryMenu(null);
    const onMouseDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.inquiry-menu, .inquiry-btn')) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [inquiryMenu]);

  // Freeze the page behind the requisition modal so only the modal is interactive.
  useEffect(() => {
    if (!isRfqModalOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isRfqModalOpen]);

  const changeViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      window.localStorage.setItem(VIEW_MODE_KEY, mode);
    } catch {}
  };

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

  // "Default" keeps the catalog sheet's own order; the rest sort a copy of the filtered set.
  const sortedProducts = useMemo(() => {
    if (sortKey === 'default') return filteredProducts;
    const byName = (a: ProductItem, b: ProductItem) => a.name.localeCompare(b.name);
    const isSterile = (p: ProductItem) => (/^sterile/i.test(p.sterility) ? 0 : 1);
    const list = [...filteredProducts];
    switch (sortKey) {
      case 'name-asc':
        return list.sort(byName);
      case 'name-desc':
        return list.sort((a, b) => byName(b, a));
      case 'sterile-first':
        return list.sort((a, b) => isSterile(a) - isSterile(b) || byName(a, b));
      case 'subcategory-asc':
        return list.sort(
          (a, b) =>
            subcategoryName(a.subcategoryId).localeCompare(subcategoryName(b.subcategoryId)) ||
            byName(a, b)
        );
    }
  }, [filteredProducts, sortKey, subcategoryName]);

  // A new filter, search or sort gives a new result order, so start it from its first page.
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, searchQuery, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const pageStart = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const pagedProducts = sortedProducts.slice(pageStart, pageStart + PRODUCTS_PER_PAGE);

  // Bring the top of the results back into view, clearing the sticky site header.
  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    if (resultsRef.current) {
      const top = resultsRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('all');
    setSubsOpen(true);
  };

  // A second click on the selected category only folds or unfolds its list; the filter stays.
  const toggleCategory = (categoryId: string) => {
    if (categoryId === selectedCategory) {
      setSubsOpen((open) => !open);
    } else {
      selectCategory(categoryId);
    }
  };

  const addToQuote = (product: ProductItem) => {
    if (!quoteItems.some((item) => item.id === product.id)) {
      setQuoteItems([...quoteItems, product]);
    }
  };

  const removeFromQuote = (productId: string) => {
    setQuoteItems(quoteItems.filter((item) => item.id !== productId));
  };

  // Opens below the button, or above it when there is no room left in the viewport.
  const toggleInquiryMenu = (e: React.MouseEvent<HTMLButtonElement>, productId: string) => {
    if (inquiryMenu?.productId === productId) {
      setInquiryMenu(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - INQUIRY_MENU_WIDTH - 8));
    const opensUp = rect.bottom + INQUIRY_MENU_HEIGHT + 8 > window.innerHeight;
    setInquiryMenu(
      opensUp
        ? { productId, left, bottom: window.innerHeight - rect.top + 6 }
        : { productId, left, top: rect.bottom + 6 }
    );
  };

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRfqSubmitted(true);
  };

  const isFiltered = selectedCategory !== 'all' || selectedSubcategory !== 'all';
  const selectedCategoryName = categories.find((c) => c.id === selectedCategory)?.name;

  const inquiryProduct = inquiryMenu ? products.find((p) => p.id === inquiryMenu.productId) : undefined;
  const inquiryAdded = inquiryProduct ? quoteItems.some((item) => item.id === inquiryProduct.id) : false;

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

      {/* Catalog Browser */}
      <section id="catalog-browser" className="section section-tight">
        <div className="wrap catalog-browser-wrap">
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
                  </button>
                </li>
                <MotionConfig reducedMotion="user">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const isOpen = isSelected && subsOpen;
                  const subs = subcategories.filter((s) => s.categoryId === cat.id);
                  return (
                    <li key={cat.id}>
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        aria-expanded={isOpen}
                        className={`catalog-cat${isSelected ? ' is-active' : ''}`}
                      >
                        <span className="catalog-cat-label">{cat.name}</span>
                        <ChevronRight
                          className={`catalog-cat-chevron${isOpen ? ' is-open' : ''}`}
                          aria-hidden="true"
                        />
                      </button>

                      {/* Kept mounted through its exit, so closing animates instead of vanishing. */}
                      <AnimatePresence>
                        {isOpen && subs.length > 0 && (
                          <motion.ul
                            key="subs"
                            className="catalog-subs"
                            variants={SUBCATEGORY_LIST}
                            initial="closed"
                            animate="open"
                            exit="closed"
                          >
                            <motion.li variants={SUBCATEGORY_ITEM}>
                              <button
                                type="button"
                                onClick={() => setSelectedSubcategory('all')}
                                className={`catalog-sub${selectedSubcategory === 'all' ? ' is-active' : ''}`}
                              >
                                <span>All {cat.name}</span>
                              </button>
                            </motion.li>
                            {subs.map((sub) => (
                              <motion.li key={sub.id} variants={SUBCATEGORY_ITEM}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedSubcategory(sub.id)}
                                  className={`catalog-sub${selectedSubcategory === sub.id ? ' is-active' : ''}`}
                                >
                                  <span>{sub.name}</span>
                                </button>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
                </MotionConfig>
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
              {/* Selected category / subcategory with the result count, then Reset Filter */}
              <div
                ref={resultsRef}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-4"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 min-w-0">
                  <h2 className="catalog-results-title">
                    {selectedSubcategory !== 'all' && selectedCategoryName && (
                      <span className="catalog-results-parent">{selectedCategoryName} /</span>
                    )}
                    {selectedSubcategory !== 'all'
                      ? subcategoryName(selectedSubcategory)
                      : selectedCategoryName ?? 'All Clinical Categories'}
                  </h2>
                  <span className="inline-block rounded-full bg-accent px-3 py-1.5 text-[13px] font-medium text-white">
                    {filteredProducts.length > PRODUCTS_PER_PAGE
                      ? `Showing ${pageStart + 1}–${pageStart + pagedProducts.length} of ${filteredProducts.length} Product(s)`
                      : `Showing ${filteredProducts.length} Product(s)`}
                  </span>
                </div>
                {isFiltered && (
                  <button
                    type="button"
                    onClick={() => selectCategory('all')}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    Reset Filter
                  </button>
                )}
              </div>

              {/* Search bar with Sort by and the Grid / Table switch on its right (they wrap below on phones) */}
              <div className="flex flex-wrap items-center gap-3 border-b border-line pb-6 mb-8">
                <div className="relative flex-1 min-w-[240px]">
                  <input
                    id="search-input"
                    type="text"
                    aria-label="Search products"
                    placeholder="Search by product, clinical need, size, use setting or department…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="field-input catalog-search-input"
                  />
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted hover:text-ink"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="catalog-sort shrink-0">
                  <label htmlFor="catalog-sort" className="catalog-sort-label">
                    Sort by:
                  </label>
                  <div className="catalog-sort-field">
                    <select
                      id="catalog-sort"
                      value={sortKey}
                      onChange={(e) => setSortKey(e.target.value as SortKey)}
                      className="catalog-sort-select"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="catalog-sort-caret" aria-hidden="true" />
                  </div>
                </div>
                <div className="catalog-view-toggle shrink-0" role="group" aria-label="Product layout">
                  <button
                    type="button"
                    onClick={() => changeViewMode('grid')}
                    aria-pressed={viewMode === 'grid'}
                    aria-label="Grid view"
                    title="Grid view"
                    className={`catalog-view-btn${viewMode === 'grid' ? ' is-active' : ''}`}
                  >
                    <LayoutGrid className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => changeViewMode('table')}
                    aria-pressed={viewMode === 'table'}
                    aria-label="Table view"
                    title="Table view"
                    className={`catalog-view-btn${viewMode === 'table' ? ' is-active' : ''}`}
                  >
                    <List className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="info-card !border-0 text-center space-y-3 !py-12">
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
                <>
                {viewMode === 'table' ? (
                <div className="product-table-wrap">
                  <table className="product-table">
                    <thead>
                      <tr>
                        <th scope="col">Product</th>
                        <th scope="col">Subcategory</th>
                        <th scope="col">Sterility</th>
                        <th scope="col">Reuse</th>
                        <th scope="col">Regulatory Class</th>
                        <th scope="col">Inquiry</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedProducts.map((product: ProductItem) => (
                        <tr key={product.id}>
                          <td className="product-table-name">
                            <Link href={`/catalog/${product.id}`}>{product.name}</Link>
                          </td>
                          <td>{subcategoryName(product.subcategoryId)}</td>
                          <td>{product.sterility || '—'}</td>
                          <td>{product.reuse || '—'}</td>
                          <td className="product-table-tag">{product.regulatoryClass || '—'}</td>
                          <td>
                            <button
                              type="button"
                              aria-haspopup="menu"
                              aria-expanded={inquiryMenu?.productId === product.id}
                              onClick={(e) => toggleInquiryMenu(e, product.id)}
                              className="inquiry-btn"
                            >
                              <SendHorizontal className="inquiry-btn-send" aria-hidden="true" />
                              <span>Send Inquiry</span>
                              <ChevronDown className="inquiry-btn-caret" aria-hidden="true" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                ) : (
                <div className="product-grid">
                  {pagedProducts.map((product: ProductItem) => {
                    const photo = PRODUCT_GALLERIES[product.id]?.[0];
                    return (
                      <div key={product.id} className="product-card">
                        <Link
                          href={`/catalog/${product.id}`}
                          aria-label={product.name}
                          className={`product-card-media${photo ? ' has-photo' : ' is-empty'}`}
                        >
                          {photo ? (
                            <img src={photo.src} alt={photo.alt} loading="lazy" />
                          ) : (
                            <span className="product-card-empty">
                              <ImageIcon strokeWidth={1.5} aria-hidden="true" />
                              <span>No image</span>
                            </span>
                          )}
                        </Link>

                        <div className="product-card-body">
                          <div>
                            <Link href={`/catalog/${product.id}`}>
                              <h3>{product.name}</h3>
                            </Link>
                            {product.sterility && (
                              <span className="product-card-sterility">{product.sterility}</span>
                            )}
                          </div>

                          <div className="product-card-foot">
                            {/* Same inquiry dropdown as the table: add to the quote list or send now. */}
                            <button
                              type="button"
                              aria-haspopup="menu"
                              aria-expanded={inquiryMenu?.productId === product.id}
                              onClick={(e) => toggleInquiryMenu(e, product.id)}
                              className="inquiry-btn"
                            >
                              <SendHorizontal className="inquiry-btn-send" aria-hidden="true" />
                              <span>Send Inquiry</span>
                              <ChevronDown className="inquiry-btn-caret" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                )}

                {totalPages > 1 && (
                  <nav className="catalog-pagination" aria-label="Product pages">
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      className="catalog-page-btn is-arrow"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                      page === 'ellipsis' ? (
                        <span key={`ellipsis-${idx}`} className="catalog-page-ellipsis" aria-hidden="true">
                          …
                        </span>
                      ) : (
                        <button
                          key={page}
                          type="button"
                          onClick={() => goToPage(page)}
                          aria-label={`Page ${page}`}
                          aria-current={page === currentPage ? 'page' : undefined}
                          className={`catalog-page-btn${page === currentPage ? ' is-active' : ''}`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      className="catalog-page-btn is-arrow"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </nav>
                )}
                </>
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

      {/* Table-view inquiry dropdown */}
      {inquiryMenu && inquiryProduct && (
        <div
          className="inquiry-menu"
          role="menu"
          style={{ left: inquiryMenu.left, top: inquiryMenu.top, bottom: inquiryMenu.bottom }}
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              if (inquiryAdded) removeFromQuote(inquiryProduct.id);
              else addToQuote(inquiryProduct);
              setInquiryMenu(null);
            }}
          >
            {inquiryAdded ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
            <span>{inquiryAdded ? 'Remove from quote list' : 'Add to quote list'}</span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              addToQuote(inquiryProduct);
              setInquiryMenu(null);
              setIsRfqModalOpen(true);
            }}
          >
            <SendHorizontal aria-hidden="true" />
            <span>Send inquiry now</span>
          </button>
        </div>
      )}

      {/* RFQ Modal */}
      {isRfqModalOpen && (
        // Sits above the sticky site header (z-index 100) and blurs everything behind it.
        <div className="fixed inset-0 z-[200] bg-ink/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[calc(100vh-2rem)] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
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
              <form onSubmit={handleRfqSubmit} className="rfq-form space-y-4">
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
                      placeholder="e.g. City General Hospital"
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
                      placeholder="e.g. procurement@hospital.com"
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
                    placeholder="e.g. +91 98765 43210"
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
                    rows={3}
                    placeholder="e.g. Nitrile examination gloves (M) – 200 boxes; Pulse oximeters – 50 units"
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
