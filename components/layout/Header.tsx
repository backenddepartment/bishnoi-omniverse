'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowUpRight, Phone } from 'lucide-react';
import logo from '@/app/assets/logo.png';
import globalNetworkLogo from '@/app/assets/globalnetworklogo.png';
import countriesMap from '@/app/assets/countries.png';
import catalogData from '@/lib/data/catalogData.json';
import { NavSearch } from '@/components/NavSearch';
import { PH_PHONE_DISPLAY, PH_TEL_HREF } from '@/lib/contactChannels';

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

// `external: true` leaves the site — rendered as a plain anchor opening in a new tab.
const GLOBAL_NETWORK_LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: 'Getmeds Philippines', href: 'https://getmeds.ph/', external: true },
  { label: 'Getmeds India', href: 'https://getmedshealthcare.com/', external: true },
  // Sites in the network that have no destination of their own yet land on a per-site
  // coming-soon page (app/coming-soon/[site]) rather than a generic anchor on /global.
  { label: 'Getmeds Vanuatu', href: '/coming-soon/getmeds-vanuatu' },
  { label: 'Getmeds South East Asia', href: '/coming-soon/getmeds-south-east-asia' },
  { label: 'Getmeds Latin', href: '/coming-soon/getmeds-latin' },
  // These two are the entities behind /corp and /llp, so they point at those real pages.
  { label: 'Bishnoi Omniverse Philippines', href: '/corp' },
  { label: 'Bishnoi Omniverse India', href: '/llp' },
  { label: 'Naresh Bishnoi', href: '/coming-soon/naresh-bishnoi' },
  { label: 'Naresh Bishnoi Foundation', href: '/coming-soon/naresh-bishnoi-foundation' },
  { label: 'UNGC', href: '/coming-soon/ungc' },
  { label: '2MG Incorporated', href: 'https://2mginc.com/', external: true },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);

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
    setNetworkOpen(false);
    setCatalogOpen(false);
  };

  const openHoverMenu = (menu: 'about' | 'network' | 'catalog') => {
    clearCloseTimer();
    setAboutOpen(menu === 'about');
    setNetworkOpen(menu === 'network');
    setCatalogOpen(menu === 'catalog');
  };

  const scheduleHoverClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(closeHoverMenus, 120);
  };

  useEffect(() => clearCloseTimer, []);

  // The header is sticky, so anything an in-page anchor scrolls to would land underneath it.
  // Publishing the measured height lets `html { scroll-padding-top }` hold every jump exactly
  // clear of the navbar — measured rather than hard-coded, since the bar's height moves with the
  // logo, the search field and the viewport width.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const apply = () => {
      const height = Math.round(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--header-h', `${height}px`);
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/articles', label: 'Articles' },
  ];

  // Mobile menu keeps plain links (no nested mega-menus on small screens).
  const mobileNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/catalog', label: 'Medical Equipment' },
    { href: '/trade-partners', label: 'Trade & Partners' },
    { href: '/quality', label: 'Quality & Compliance' },
    { href: '/global-network', label: 'Global Network' },
    { href: '/articles', label: 'Articles' },
    { href: '/about', label: 'About Us' },
    { href: '/about/leadership', label: 'Leadership' },
    { href: '/contact', label: 'Contact' },
    { href: '/contact?type=quote', label: 'Request a Quote' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    // Match the section, not the prefix, so a sibling route never lights up its neighbour.
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const isCorp = pathname.startsWith('/corp');

  return (
    <header ref={headerRef} className="site-header">
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

          {/* Medical Equipment — hover mega-menu, the same full-width treatment as About Us /
              LLP / Global Network: an intro column on the left, every catalog category laid out
              in columns beside it. */}
          <div
            className="flex items-stretch"
            onMouseEnter={() => openHoverMenu('catalog')}
            onMouseLeave={scheduleHoverClose}
          >
            <div className="relative flex items-stretch">
              <button
                type="button"
                onClick={() => (catalogOpen ? closeHoverMenus() : openHoverMenu('catalog'))}
                aria-expanded={catalogOpen}
                className={`flex items-center h-full gap-1 text-sm font-medium transition-colors ${
                  isActive('/catalog') ? 'text-accent' : 'text-ink-soft hover:text-ink'
                }`}
              >
                Medical Equipment
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${catalogOpen ? 'rotate-180' : ''}`} />
              </button>
              {/* Invisible bridge over the header's bottom padding, so the pointer can travel
                  from the trigger into the panel without crossing a dead gap. */}
              <div className="absolute left-0 right-0 top-full h-4" />
            </div>

            <AnimatePresence initial={false}>
              {catalogOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0 right-0 top-full origin-top"
                >
                  <div className="bg-surface border-b border-line rounded-b-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 items-start p-10">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.06 }}
                      >
                        <h3 className="font-poppins font-semibold text-3xl text-ink mb-3 leading-tight">
                          Medical Equipment
                        </h3>
                        <p className="text-sm text-ink-soft leading-relaxed mb-5">
                          Browse our hospital-grade catalog by category, or open the full catalog to
                          search across every product.
                        </p>
                        <Link href="/catalog" onClick={closeHoverMenus} className="btn btn-primary">
                          View Full Catalog
                        </Link>
                      </motion.div>

                      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-1">
                        {catalogData.categories.map((cat, idx) => (
                          <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            // Capped stagger: at 25 categories an uncapped one would still be
                            // animating long after the menu has settled.
                            transition={{ duration: 0.35, delay: 0.06 + Math.min(idx, 10) * 0.025 }}
                          >
                            <Link
                              href={`/catalog?category=${cat.id}`}
                              onClick={closeHoverMenus}
                              className="menu-link inline-block py-2.5 text-[15px] font-medium text-ink hover:text-accent no-underline transition-colors leading-snug"
                            >
                              {cat.name}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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

            <AnimatePresence initial={false}>
              {aboutOpen && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 right-0 top-full origin-top"
              >
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
                        className="menu-link inline-flex items-center gap-1.5 no-underline text-[15px] font-medium text-ink hover:text-accent transition-colors leading-snug"
                      >
                        {item.label}
                        <ArrowUpRight className="w-3.5 h-3.5 text-accent shrink-0" strokeWidth={2} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
              )}
            </AnimatePresence>
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

          {/* LLP / CORP — a plain link now; the two entities each have their own page and the
              dropdown only ever held those two. */}
          <Link
            href={isCorp ? '/corp' : '/llp'}
            onMouseEnter={closeHoverMenus}
            className={`flex items-center h-full no-underline text-sm font-medium transition-colors ${
              isActive(isCorp ? '/corp' : '/llp') ? 'text-accent' : 'text-ink-soft hover:text-ink'
            }`}
          >
            {isCorp ? 'CORP' : 'LLP'}
          </Link>
        </nav>

        <div className="flex items-stretch gap-6">
          {/* Site search — inline field with instant results from 1024px, an icon and full-width
              panel below that. Opening the panel closes the mobile menu. */}
          <NavSearch onPanelOpen={() => setMobileMenuOpen(false)} />

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
                <Image src={globalNetworkLogo} alt="Global Network" className="h-9 w-auto shrink-0" />
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${networkOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className="absolute left-0 right-0 top-full h-4" />
            </div>

            <AnimatePresence initial={false}>
              {networkOpen && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 right-0 top-full origin-top"
              >
              <div className="bg-surface border-b border-line rounded-b-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_340px] gap-12 items-center p-10">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.06 }}
                  >
                    <h3 className="font-poppins font-semibold text-3xl text-ink mb-3 leading-tight">Global Network</h3>
                    <p className="text-sm text-ink-soft leading-relaxed m-0">
                      Bishnoi Omniverse&apos;s growing footprint across the world — connect with any of our regional
                      sites and trusted partners.
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                    {GLOBAL_NETWORK_LINKS.map((item, idx) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.06 * (idx + 2) }}
                      >
                        {item.external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setNetworkOpen(false)}
                            className="menu-link inline-flex items-center gap-1.5 py-2.5 text-[15px] font-medium text-ink hover:text-accent no-underline transition-colors leading-snug"
                          >
                            {item.label}
                            <ArrowUpRight className="w-3.5 h-3.5 text-accent shrink-0" strokeWidth={2} />
                          </a>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => setNetworkOpen(false)}
                            className="menu-link inline-block py-2.5 text-[15px] font-medium text-ink hover:text-accent no-underline transition-colors leading-snug"
                          >
                            {item.label}
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="hidden xl:block"
                    aria-hidden="true"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.06 * (GLOBAL_NETWORK_LINKS.length + 2) }}
                  >
                    <Image src={countriesMap} alt="" className="w-full h-auto" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
              )}
            </AnimatePresence>
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

          <a
            href={PH_TEL_HREF}
            className="flex items-center gap-2 text-sm font-semibold text-ink no-underline"
          >
            <Phone className="w-4 h-4 text-accent" aria-hidden="true" />
            Call {PH_PHONE_DISPLAY}
          </a>

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
