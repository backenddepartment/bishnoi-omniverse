'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronRight, ArrowRight, ArrowUpRight, Search } from 'lucide-react';
import logo from '@/app/assets/logo.png';
import catalogData from '@/lib/data/catalogData.json';
import { getCategoryIcon } from '@/lib/catalogIcons';

const ABOUT_LINKS: { label: string; href: string }[] = [
  { label: 'Our Story', href: '/about' },
  { label: 'Leadership', href: '/about/leadership' },
  { label: 'Vision & Values', href: '/about/vision-values' },
  { label: 'Quality & Compliance', href: '/quality' },
  { label: 'Governance & Standards', href: '/about/governance' },
  { label: 'Group Structure', href: '/global' },
  { label: 'Global Network', href: '/global-network' },
  { label: 'Trade & Partners', href: '/trade-partners' },
  { label: 'Contact Us', href: '/contact' },
];

const ENTITY_LINKS: { label: string; href: string; desc: string }[] = [
  {
    label: 'LLP',
    href: '/llp',
    desc: 'Bishnoi Omniverse LLP — our global sourcing hub in India, the pharmaceutical capital of the world, delivering fast, affordable access to high-quality medicines.',
  },
  {
    label: 'CORP',
    href: '/corp',
    desc: 'Bishnoi Omniverse Corp — our Asia-Pacific logistics hub in the Philippines, bridging Southeast Asia with the rest of our global distribution network.',
  },
];

const GLOBAL_NETWORK_LINKS: { label: string; href: string }[] = [
  { label: 'Operating Footprint', href: '/global-network' },
  { label: 'Trade & Partners', href: '/trade-partners' },
  { label: 'Getmeds Philippines', href: '/global#getmeds' },
  { label: 'Getmeds Healthcare', href: '/global#getmeds' },
  { label: 'Getmeds Vanuatu', href: '/global#getmeds' },
  { label: 'Getmeds South East Asia', href: '/global#getmeds' },
  { label: 'Getmeds Latin', href: '/global#getmeds' },
  { label: 'Bishnoi Omniverse Philippines', href: '/global#omniverse' },
  { label: 'Bishnoi Omniverse India', href: '/global#omniverse' },
  { label: 'Naresh Bishnoi', href: '/global#social' },
  { label: 'Naresh Bishnoi Foundation', href: '/global#social' },
  { label: 'UNGC', href: '/global#social' },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [entityOpen, setEntityOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(catalogData.categories[0].id);
  const [categorySelected, setCategorySelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const catalogRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Every mega-menu panel is a full-width overlay under the navbar, so two of them open at once
  // would stack and flash. These helpers keep exactly one menu open and put a short delay on
  // closing, so sweeping the pointer across a trigger (or across the gap between the navbar and
  // a panel) never blinks a panel open and shut.
  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const closeHoverMenus = () => {
    clearCloseTimer();
    setAboutOpen(false);
    setEntityOpen(false);
    setNetworkOpen(false);
  };

  const openHoverMenu = (menu: 'about' | 'entity' | 'network') => {
    clearCloseTimer();
    setAboutOpen(menu === 'about');
    setEntityOpen(menu === 'entity');
    setNetworkOpen(menu === 'network');
    setCatalogOpen(false);
    setCategorySelected(false);
  };

  const scheduleHoverClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(closeHoverMenus, 120);
  };

  useEffect(() => clearCloseTimer, []);

  // Catalog opens on click (not hover), so close it on an outside click instead of mouseleave.
  useEffect(() => {
    if (!catalogOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (catalogRef.current && !catalogRef.current.contains(e.target as Node)) {
        setCatalogOpen(false);
        setCategorySelected(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [catalogOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/catalog?search=${encodeURIComponent(query)}` : '/catalog');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/global', label: 'Businesses' },
  ];

  // Mobile menu keeps plain links (no nested mega-menus on small screens).
  const mobileNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/catalog', label: 'Medical Equipment' },
    { href: '/trade-partners', label: 'Trade & Partners' },
    { href: '/quality', label: 'Quality & Compliance' },
    { href: '/global-network', label: 'Global Network' },
    { href: '/global', label: 'Businesses' },
    { href: '/about', label: 'About Us' },
    { href: '/about/leadership', label: 'Leadership' },
    { href: '/contact', label: 'Contact' },
    { href: '/contact?type=quote', label: 'Request a Quote' },
  ];

  const activeCategory = catalogData.categories.find((c) => c.id === activeCategoryId) || catalogData.categories[0];
  const activeCategoryProducts = catalogData.products.filter((p) => p.categoryId === activeCategoryId);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    // Match the section, not the prefix — otherwise /global-network lights up "Businesses" (/global).
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const isCorp = pathname.startsWith('/corp');

  return (
    <header className="site-header">
      <div className="wrap max-w-[1400px] px-5 flex items-stretch justify-between py-3">
        <div className="flex items-center gap-2.5 text-ink">
          <Link href="/" className="flex items-center gap-2.5 text-ink no-underline">
            <Image src={logo} alt="Bishnoi Omniverse" className="h-11 w-auto shrink-0" priority />
          </Link>
        </div>

        <nav className="nav-links hidden md:flex items-stretch gap-9">
          <Link
            href="/"
            className={`flex items-center h-full no-underline text-sm font-medium transition-colors ${
              isActive('/') ? 'text-accent' : 'text-ink-soft hover:text-ink'
            }`}
          >
            Home
          </Link>

          {/* Catalog — click trigger (not hover) opens a floating sidebar (not attached to the
              navbar, not full width). Clicking a category slides a second panel in beside it. */}
          <div ref={catalogRef} className="flex items-stretch" onMouseEnter={closeHoverMenus}>
            <button
              type="button"
              onClick={() => {
                closeHoverMenus();
                setCatalogOpen((v) => !v);
                setCategorySelected(false);
              }}
              aria-expanded={catalogOpen}
              className={`flex items-center h-full gap-1 text-sm font-medium transition-colors ${
                isActive('/catalog') ? 'text-accent' : 'text-ink-soft hover:text-ink'
              }`}
            >
              Medical Equipment
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${catalogOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* pt-3 keeps the gap (detached from the navbar) inside the same box, pl-5 keeps the
                sidebar off the screen edge (matching the header's own horizontal padding).
                left-0 resolves against .site-header (no relative ancestor here), so the sidebar
                sits at the left edge of the page like a real sidebar, not just under the trigger. */}
            <div className={`absolute left-0 top-full pt-3 pl-5 ${catalogOpen ? 'block' : 'hidden'}`}>
              {/* Anchor box is exactly the sidebar's width; the second panel is positioned off it
                  (absolute, left-full) so its resting spot never depends on sibling layout. */}
              <div className="relative w-72">
              {/* Sidebar — categories only, floating, fixed narrow width */}
              <div className="relative z-10 w-72 bg-surface rounded-lg border border-line shadow-xl overflow-hidden">
                <div className="flex items-center justify-between gap-2 px-5 py-3">
                  <Link
                    href="/catalog"
                    onClick={() => setCatalogOpen(false)}
                    className="inline-flex items-center gap-1.5 no-underline text-xs font-semibold text-ink hover:text-accent"
                  >
                    View Full Catalog <ArrowRight className="w-3 h-3" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setCatalogOpen(false);
                      setCategorySelected(false);
                    }}
                    aria-label="Close catalog menu"
                    className="p-1 rounded-md text-ink-soft hover:bg-paper-2 hover:text-ink transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="catalog-category-scroll border-t border-line max-h-[420px] overflow-y-auto py-3">
                  {catalogData.categories.map((cat) => {
                    const active = cat.id === activeCategoryId && categorySelected;
                    const CatIcon = getCategoryIcon(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onMouseEnter={() => {
                          setActiveCategoryId(cat.id);
                          setCategorySelected(true);
                        }}
                        onClick={() => {
                          setActiveCategoryId(cat.id);
                          setCategorySelected(true);
                        }}
                        className={`w-full flex items-center gap-3 text-left px-5 py-3 text-sm font-semibold transition-colors ${
                          active ? 'bg-accent text-white' : 'text-ink-soft hover:bg-paper-2 hover:text-ink'
                        }`}
                      >
                        <CatIcon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                        <span className="flex-1">{cat.name}</span>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-accent'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Second panel — subcategories/products. Not keyed by category, so switching
                  categories only swaps content: it never remounts and never re-animates.
                  It starts tucked behind the sidebar (z-0) and slides left-to-right into place. */}
              <AnimatePresence initial={false}>
                {categorySelected && (
                  <motion.div
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute z-0 left-full top-0 ml-3 w-80 bg-surface rounded-lg border border-line shadow-xl p-6"
                  >
                    <span className="inline-block text-sm font-semibold text-white bg-accent rounded-full px-3 py-1 mb-2">
                      {activeCategory.name}
                    </span>
                    <p className="text-xs text-ink-soft mb-4">{activeCategory.description}</p>
                    <div className="space-y-1 mb-4">
                      {activeCategoryProducts.map((p) => (
                        <Link
                          key={p.id}
                          href={`/catalog/${p.id}`}
                          onClick={() => setCatalogOpen(false)}
                          className="block no-underline text-sm font-medium text-ink hover:text-accent py-1.5"
                        >
                          {p.name}
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/catalog?category=${activeCategory.id}`}
                      onClick={() => setCatalogOpen(false)}
                      className="inline-flex items-center gap-1.5 no-underline text-xs font-semibold text-accent-dark hover:underline"
                    >
                      View all {activeCategory.name} <ArrowRight className="w-3 h-3" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </div>
          </div>

          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center h-full no-underline text-sm font-medium transition-colors ${
                isActive(link.href) ? 'text-accent' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* About Us — hover mega-menu, same full-width treatment as Catalog. The trigger
              stretches to the header's full height and an invisible bridge covers the header's
              own bottom padding so the pointer never leaves the tracked hover area while
              descending into the panel. */}
          <div
            className="flex items-stretch"
            onMouseEnter={() => openHoverMenu('about')}
            onMouseLeave={scheduleHoverClose}
          >
            <div className="relative flex items-stretch">
              <Link
                href="/about"
                className={`flex items-center h-full gap-1 no-underline text-sm font-medium transition-colors ${
                  isActive('/about') ? 'text-accent' : 'text-ink-soft hover:text-ink'
                }`}
              >
                About Us
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
              </Link>
              <div className="absolute left-0 right-0 top-full h-4" />
            </div>

            {aboutOpen && (
            <div className="absolute left-0 right-0 top-full">
              <div className="bg-surface border-b border-line rounded-b-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-[260px_1fr] gap-14 items-start p-10">
                  <div>
                    <h4 className="font-poppins font-semibold text-xl text-accent mb-3 leading-snug">About Us</h4>
                    <p className="text-sm text-ink-soft leading-relaxed m-0">
                      Our story, the people behind it, and the standards we hold every shipment to.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-x-10 gap-y-4">
                    {ABOUT_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setAboutOpen(false)}
                        className="menu-link no-underline text-[15px] font-medium text-ink hover:text-accent transition-colors leading-snug"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* LLP / CORP — hover mega-menu, same full-width treatment as Catalog / About Us. */}
          <div
            className="flex items-stretch"
            onMouseEnter={() => openHoverMenu('entity')}
            onMouseLeave={scheduleHoverClose}
          >
            <div className="relative flex items-stretch">
              <button
                type="button"
                aria-expanded={entityOpen}
                className="flex items-center h-full gap-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
              >
                <span>{isCorp ? 'CORP' : 'LLP'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${entityOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className="absolute left-0 right-0 top-full h-4" />
            </div>

            {entityOpen && (
            <div className="absolute left-0 right-0 top-full">
              <div className="bg-surface border-b border-line rounded-b-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-[260px_1fr] gap-14 items-start p-10">
                  <div>
                    <h4 className="font-poppins font-semibold text-xl text-accent mb-3 leading-snug">Our Entities</h4>
                    <p className="text-sm text-ink-soft leading-relaxed m-0">
                      Two legal entities, one continuous line of supply — LLP and CORP are the only pages
                      you&apos;ll find under this menu.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                    {ENTITY_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setEntityOpen(false)}
                        className="block no-underline group"
                      >
                        <span className="menu-link flex items-center gap-1.5 text-xl font-semibold text-ink group-hover:text-accent transition-colors leading-snug mb-2">
                          {item.label}
                          <ArrowUpRight className="w-4 h-4 text-accent shrink-0" strokeWidth={2} />
                        </span>
                        <span className="text-sm text-ink-soft leading-relaxed block">{item.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </nav>

        <div className="flex items-stretch gap-6">
          {/* Catalog search */}
          <form onSubmit={handleSearchSubmit} className="relative hidden lg:flex items-center mr-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="How can we help you?"
              aria-label="How can we help you?"
              className="w-56 xl:w-72 pl-8 pr-3 py-2 text-xs rounded-full border border-line bg-[#fafafa] text-ink placeholder:text-muted focus:bg-surface focus:border-ink outline-none transition-colors"
            />
          </form>

          {/* Contact */}
          <Link
            href="/contact"
            className={`hidden sm:flex items-center h-full text-sm font-medium transition-colors ${
              isActive('/contact') ? 'text-accent' : 'text-ink-soft hover:text-ink'
            }`}
          >
            Contact
          </Link>

          {/* Global Network — hover mega-menu, same full-width treatment as Catalog / About Us / LLP. */}
          <div
            className="hidden sm:flex items-stretch"
            onMouseEnter={() => openHoverMenu('network')}
            onMouseLeave={scheduleHoverClose}
          >
            <div className="relative flex items-stretch">
              <button
                type="button"
                onClick={() => (networkOpen ? closeHoverMenus() : openHoverMenu('network'))}
                aria-expanded={networkOpen}
                className="flex items-center h-full gap-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
              >
                <span>Global Network</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${networkOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className="absolute left-0 right-0 top-full h-4" />
            </div>

            {networkOpen && (
            <div className="absolute left-0 right-0 top-full">
              <div className="bg-surface border-b border-line rounded-b-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-[260px_1fr] gap-14 items-start p-10">
                  <div>
                    <h4 className="font-poppins font-semibold text-xl text-accent mb-3 leading-snug">Global Network</h4>
                    <p className="text-sm text-ink-soft leading-relaxed m-0">
                      Getmeds Healthcare&apos;s growing footprint across the world — connect with any of our regional
                      sites and trusted partners.
                    </p>
                  </div>

                  <div className="grid grid-cols-5 gap-x-8 gap-y-6">
                    {GLOBAL_NETWORK_LINKS.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setNetworkOpen(false)}
                        className="menu-link text-sm font-semibold text-ink hover:text-accent no-underline transition-colors leading-snug"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-ink border border-line rounded"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-paper border-t border-line px-8 py-5 space-y-4">
          {mobileNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-medium ${isActive(link.href) ? 'text-ink font-semibold' : 'text-ink-soft'}`}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-line pt-4">
            <h4 className="font-poppins font-bold text-sm text-ink mb-3">Global Network</h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {GLOBAL_NETWORK_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-medium text-ink-soft hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
