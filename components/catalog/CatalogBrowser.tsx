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
import { RequisitionModal, readQuoteIds, writeQuoteIds } from '@/components/catalog/RequisitionModal';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  EQUIPMENT_PATH,
  categoryPath,
  equipmentCrumbs,
  productPath,
  subcategoryIdFromSlug,
  subcategorySlug,
} from '@/lib/catalogRoutes';
import { getCategoryOverview } from '@/lib/categoryOverviews';
import heroImg from '@/app/assets/medicinebgpage.png';
import bannerImg from '@/app/assets/bannermedical.png';

const IMG = {
  hero: heroImg.src,
  banner: bannerImg.src,
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

/**
 * The catalog's category rail and product listing. With no `categoryId` it is the Medical
 * Equipment page, listing every product under the hero; with one it is that category's page.
 * The category comes from the URL, so the rail's categories are links between pages and only the
 * subcategory, search and sort are chosen in place.
 */
export function CatalogBrowser({ categoryId }: { categoryId?: string }) {
  const { hero, categories, subcategories, products } = catalogData;

  const selectedCategory = categoryId ?? 'all';
  const category = categories.find((c) => c.id === categoryId);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  // Whether the selected category's subcategory list is expanded; clicking it again folds it.
  const [subsOpen, setSubsOpen] = useState<boolean>(true);
  // On a phone the category rail sits above the products, so it starts folded behind one button
  // (see .catalog-rail-toggle); from 900px it is a sidebar and always shown.
  const [railOpen, setRailOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortKey, setSortKey] = useState<SortKey>('default');
  const [inquiryMenu, setInquiryMenu] = useState<InquiryMenuState | null>(null);
  const [quoteItems, setQuoteItems] = useState<ProductItem[]>([]);
  const [isRfqModalOpen, setIsRfqModalOpen] = useState<boolean>(false);

  const subcategoryName = useMemo(() => {
    const map = new Map(subcategories.map((s) => [s.id, s.name]));
    return (id: string) => map.get(id) ?? '';
  }, [subcategories]);

  // Pre-select a subcategory (?subcategory=slug, from the All Categories page) or a search term
  // (?search=text, from the site search results).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('subcategory');
    const subcategoryId = categoryId && slug ? subcategoryIdFromSlug(categoryId, slug) : null;
    if (subcategoryId && subcategories.some((s) => s.id === subcategoryId)) {
      setSelectedSubcategory(subcategoryId);
    }
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [categoryId, subcategories]);

  // Pick up the quote list started on another catalog page, then keep the stored copy current.
  const quoteRestored = useRef(false);
  useEffect(() => {
    const saved = readQuoteIds();
    if (saved.length > 0) {
      setQuoteItems(products.filter((p: ProductItem) => saved.includes(p.id)));
    }
    quoteRestored.current = true;
  }, [products]);

  useEffect(() => {
    if (!quoteRestored.current) return;
    writeQuoteIds(quoteItems.map((item) => item.id));
  }, [quoteItems]);

  // Restore the visitor's last Grid/Table choice; storage can be unavailable (private mode).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(VIEW_MODE_KEY);
      if (saved === 'grid' || saved === 'table') setViewMode(saved);
    } catch {}
  }, []);

  // The inquiry menu is fixed-positioned (the table's sideways scroll would clip it), so rather
  // than follow its button it closes on any outside click, resize, Escape, or a real scroll. A page
  // scroll of a few pixels, as a thumb resting on a phone screen causes, leaves it open.
  useEffect(() => {
    if (!inquiryMenu) return;
    const close = () => setInquiryMenu(null);
    const startY = window.scrollY;
    const onScroll = (e: Event) => {
      const pageScrolled = e.target === document || e.target === document.documentElement;
      if (!pageScrolled || Math.abs(window.scrollY - startY) > 24) close();
    };
    const onMouseDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.inquiry-menu, .inquiry-btn')) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', close);
    };
  }, [inquiryMenu]);

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

  // Keeps the address in step with the chosen subcategory, so the filtered view can be shared or
  // bookmarked. The path is left as it is, which also preserves a GitHub Pages sub-path.
  const selectSubcategory = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    setRailOpen(false);
    const url = new URL(window.location.href);
    if (subcategoryId === 'all') url.searchParams.delete('subcategory');
    else url.searchParams.set('subcategory', subcategorySlug(subcategoryId));
    window.history.replaceState(null, '', url);
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

  const isFiltered = selectedSubcategory !== 'all';
  const selectedCategoryName = category?.name;

  const inquiryProduct = inquiryMenu ? products.find((p) => p.id === inquiryMenu.productId) : undefined;
  const inquiryAdded = inquiryProduct ? quoteItems.some((item) => item.id === inquiryProduct.id) : false;

  return (
    <div className="w-full catalog-page">
      {category ? (
        // A category page opens with its heading and a short overview, then the banner
        // photograph, inset from the screen edges.
        <header className="wrap catalog-browser-wrap catalog-page-head">
          <h1>{category.name}</h1>
          <p>{getCategoryOverview(category)}</p>
          <img
            className="catalog-page-banner"
            src={IMG.banner}
            alt="Medical supplies laid out in a row on a pale blue surface: a stethoscope, pulse oximeter, forceps, thermometer, blood pressure monitor, gloves, gauze and face masks"
            loading="eager"
          />
        </header>
      ) : (
        // Hero — stacked, not overlaid: the copy sits on white at the top and the photograph runs
        // full width beneath it, so nothing has to fight the image for legibility.
        <section className="catalog-hero">
          <div className="wrap catalog-hero-copy">
            <h1>{hero.headline}</h1>
            <p className="lede">{hero.subheadline}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#catalog-browser">
                {hero.ctaExplore}
              </a>
            </div>
          </div>
          <div className="catalog-hero-media">
            <img
              src={IMG.hero}
              alt="Medical instruments and supplies laid out on a pale blue surface — a stethoscope, thermometer, blood pressure monitor, gloves, dressings and medication"
              loading="eager"
            />
          </div>
        </section>
      )}

      {/* Catalog Browser */}
      <section id="catalog-browser" className="section section-tight">
        <div className="wrap catalog-browser-wrap">
          {/* Directly above the listing, so the trail sits with the products it leads to. */}
          <Breadcrumbs items={equipmentCrumbs(category)} />

          <div className="catalog-shell">
            {/* Category rail — each category links to its own page; the one being viewed expands
                to its subcategories */}
            <aside className={`catalog-sidebar${railOpen ? ' is-open' : ''}`}>
              <h3 className="catalog-side-title">Category</h3>
              {/* Phones only: the rail folds behind this, so the products are not three screens
                  down the page. It names what is being shown. */}
              <button
                type="button"
                onClick={() => setRailOpen((open) => !open)}
                aria-expanded={railOpen}
                aria-controls="catalog-cats"
                className="catalog-rail-toggle"
              >
                <span>
                  {selectedSubcategory !== 'all'
                    ? subcategoryName(selectedSubcategory)
                    : selectedCategoryName ?? 'All Clinical Categories'}
                </span>
                <ChevronDown className={`catalog-rail-caret${railOpen ? ' is-open' : ''}`} aria-hidden="true" />
              </button>
              <ul id="catalog-cats" className="catalog-cats">
                <li>
                  <Link
                    href={EQUIPMENT_PATH}
                    aria-current={selectedCategory === 'all' ? 'page' : undefined}
                    className={`catalog-cat${selectedCategory === 'all' ? ' is-active' : ''}`}
                  >
                    <span>All Clinical Categories</span>
                  </Link>
                </li>
                <MotionConfig reducedMotion="user">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const isOpen = isSelected && subsOpen;
                  const subs = subcategories.filter((s) => s.categoryId === cat.id);
                  return (
                    <li key={cat.id}>
                      {/* The category being viewed only folds or unfolds its list; the rest are
                          links to their own pages. */}
                      {isSelected ? (
                        <button
                          type="button"
                          onClick={() => setSubsOpen((open) => !open)}
                          aria-expanded={isOpen}
                          className="catalog-cat is-active"
                        >
                          <span className="catalog-cat-label">{cat.name}</span>
                          <ChevronRight
                            className={`catalog-cat-chevron${isOpen ? ' is-open' : ''}`}
                            aria-hidden="true"
                          />
                        </button>
                      ) : (
                        <Link href={categoryPath(cat.id)} className="catalog-cat">
                          <span className="catalog-cat-label">{cat.name}</span>
                          <ChevronRight className="catalog-cat-chevron" aria-hidden="true" />
                        </Link>
                      )}

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
                                onClick={() => selectSubcategory('all')}
                                className={`catalog-sub${selectedSubcategory === 'all' ? ' is-active' : ''}`}
                              >
                                <span>All {cat.name}</span>
                              </button>
                            </motion.li>
                            {subs.map((sub) => (
                              <motion.li key={sub.id} variants={SUBCATEGORY_ITEM}>
                                <button
                                  type="button"
                                  onClick={() => selectSubcategory(sub.id)}
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
                      : selectedCategoryName
                        ? `All ${selectedCategoryName}`
                        : 'All Clinical Categories'}
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
                    onClick={() => selectSubcategory('all')}
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
                            <Link href={productPath(product)}>{product.name}</Link>
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
                          href={productPath(product)}
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
                            <Link href={productPath(product)}>
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

      <RequisitionModal
        open={isRfqModalOpen}
        onClose={() => setIsRfqModalOpen(false)}
        items={quoteItems}
        onRemoveItem={removeFromQuote}
        onSent={() => setQuoteItems([])}
      />
    </div>
  );
}
