'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Globe2, ArrowRight } from 'lucide-react';
import logo from '@/app/assets/logo.png';
import catalogData from '@/lib/data/catalogData.json';
import { getCategoryIcon } from '@/lib/catalogIcons';

const GLOBAL_NETWORK_LINKS: { label: string; href: string }[] = [
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
  const [entityOpen, setEntityOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(catalogData.categories[0].id);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/global', label: 'Businesses' },
    { href: '/about', label: 'Our Story' },
    { href: '/contact', label: 'Contact' },
  ];

  // Mobile menu keeps a plain Catalog link (no nested mega-menu on small screens).
  const mobileNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/catalog', label: 'Catalog' },
    { href: '/global', label: 'Businesses' },
    { href: '/about', label: 'Our Story' },
    { href: '/contact', label: 'Contact' },
  ];

  const activeCategory = catalogData.categories.find((c) => c.id === activeCategoryId) || catalogData.categories[0];
  const activeCategoryProducts = catalogData.products.filter((p) => p.categoryId === activeCategoryId);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const isCorp = pathname.startsWith('/corp');
  const isLlp = !isCorp;

  return (
    <header className="site-header">
      <div className="wrap flex items-stretch justify-between py-4">
        <div className="flex items-center gap-2.5 text-ink">
          <Link href="/" className="flex items-center gap-2.5 text-ink no-underline">
            <Image src={logo} alt="Bishnoi Omniverse" className="h-14 w-auto shrink-0" priority />
          </Link>
        </div>

        <nav className="nav-links hidden md:flex items-stretch gap-9">
          <Link
            href="/"
            className={`flex items-center h-full no-underline text-sm font-medium transition-colors ${
              isActive('/') ? 'text-ink active' : 'text-ink-soft hover:text-ink'
            }`}
          >
            Home
          </Link>

          {/* Catalog — hover mega-menu. The trigger stretches to the header's full height so
              the pointer never leaves the tracked hover area while moving down into the panel. */}
          <div
            className="flex items-stretch"
            onMouseEnter={() => setCatalogOpen(true)}
            onMouseLeave={() => setCatalogOpen(false)}
          >
            <div className="relative flex items-stretch">
              <Link
                href="/catalog"
                className={`flex items-center h-full gap-1 no-underline text-sm font-medium transition-colors ${
                  isActive('/catalog') ? 'text-ink active' : 'text-ink-soft hover:text-ink'
                }`}
              >
                Catalog
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${catalogOpen ? 'rotate-180' : ''}`} />
              </Link>
              {/* Invisible bridge — covers the header's own bottom padding so the pointer
                  never leaves the tracked hover area while descending into the panel. */}
              <div className="absolute left-0 right-0 top-full h-4" />
            </div>

            <div className={`absolute left-0 right-0 top-full ${catalogOpen ? 'block' : 'hidden'}`}>
              <div className="bg-surface border-t border-line shadow-xl">
                <div className="wrap grid grid-cols-[260px_1fr] gap-6 py-6">
                  {/* Level 1 — categories */}
                  <div className="rounded-xl py-4">
                    {catalogData.categories.map((cat) => {
                      const active = cat.id === activeCategoryId;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onMouseEnter={() => setActiveCategoryId(cat.id)}
                          className={`w-full text-left px-5 py-3 text-sm font-semibold rounded-lg transition-colors ${
                            active ? 'bg-paper-2 text-ink' : 'text-ink-soft hover:text-ink'
                          }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Level 2 — products in the active category */}
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted block mb-1">
                      {activeCategory.name}
                    </span>
                    <p className="text-xs text-ink-soft mb-4">{activeCategory.description}</p>
                    <div className="space-y-1 mb-4">
                      {activeCategoryProducts.map((p) => (
                        <Link
                          key={p.id}
                          href={`/catalog/${p.id}`}
                          onClick={() => setCatalogOpen(false)}
                          className="block no-underline text-sm font-medium text-ink hover:text-accent-dark py-1.5"
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
                  </div>
                </div>

                <div className="border-t border-line">
                  <div className="wrap py-3">
                    <Link
                      href="/catalog"
                      onClick={() => setCatalogOpen(false)}
                      className="inline-flex items-center gap-1.5 no-underline text-xs font-semibold text-ink hover:text-accent-dark"
                    >
                      View Full Catalog <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center h-full no-underline text-sm font-medium transition-colors ${
                isActive(link.href) ? 'text-ink active' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* LLP / CORP — hover dropdown trigger, defaults to LLP */}
          <div
            className="relative hidden sm:block"
            onMouseEnter={() => setEntityOpen(true)}
            onMouseLeave={() => setEntityOpen(false)}
          >
            <button
              type="button"
              aria-expanded={entityOpen}
              className="flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors py-2.5"
            >
              <span>{isCorp ? 'CORP' : 'LLP'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${entityOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className={`absolute right-0 top-full pt-2 ${entityOpen ? 'block' : 'hidden'}`}>
              <div className="bg-surface border border-line rounded-xl shadow-lg overflow-hidden w-28">
                <Link
                  href="/llp"
                  onClick={() => setEntityOpen(false)}
                  className={`block px-4 py-2.5 no-underline text-sm transition-colors ${
                    isLlp ? 'text-ink bg-paper-2 font-semibold' : 'text-ink-soft hover:bg-paper-2 hover:text-ink'
                  }`}
                >
                  LLP
                </Link>
                <Link
                  href="/corp"
                  onClick={() => setEntityOpen(false)}
                  className={`block px-4 py-2.5 no-underline text-sm transition-colors ${
                    isCorp ? 'text-ink bg-paper-2 font-semibold' : 'text-ink-soft hover:bg-paper-2 hover:text-ink'
                  }`}
                >
                  CORP
                </Link>
              </div>
            </div>
          </div>

          {/* Global Network — hover dropdown trigger */}
          <div className="hidden sm:block" onMouseEnter={() => setNetworkOpen(true)} onMouseLeave={() => setNetworkOpen(false)}>
            <button
              type="button"
              onClick={() => setNetworkOpen((v) => !v)}
              aria-expanded={networkOpen}
              className="flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors py-2.5"
            >
              <span>Global Network</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${networkOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Full-width mega panel, spans edge-to-edge under the header */}
            <div className={`absolute left-0 right-0 top-full ${networkOpen ? 'block' : 'hidden'}`}>
              <div className="h-2" />
              <div className="bg-surface border-t border-line shadow-xl">
                <div className="wrap py-10 grid grid-cols-[260px_1fr] gap-14 items-start">
                  <div>
                    <div className="w-11 h-11 rounded-full bg-accent-tint flex items-center justify-center mb-4">
                      <Globe2 className="w-[22px] h-[22px] text-accent-dark" strokeWidth={1.75} />
                    </div>
                    <h4 className="font-poppins font-bold text-xl text-ink mb-3 leading-snug">Global Network</h4>
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
                        className="text-sm font-semibold text-ink hover:text-accent-dark no-underline transition-colors leading-snug"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
