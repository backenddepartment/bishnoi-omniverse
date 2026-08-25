'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Cross, ChevronDown, Globe2 } from 'lucide-react';

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
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/catalog', label: 'Catalog' },
    { href: '/global', label: 'Businesses' },
    { href: '/about', label: 'Our Story' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const isCorp = pathname.startsWith('/corp');
  const isLlp = !isCorp;

  return (
    <header className="site-header">
      <div className="wrap flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5 text-ink">
          <Link href="/" className="flex items-center gap-2.5 text-ink no-underline">
            <Cross className="w-5 h-5 text-accent shrink-0" strokeWidth={2.5} />
            <span className="whitespace-nowrap font-sans text-[15px] font-bold tracking-wide">Bishnoi Omniverse</span>
          </Link>
          <span className="flex items-center gap-1 text-[9px] font-semibold tracking-wider">
            <Link
              href="/llp"
              className={`no-underline rounded px-1.5 py-0.5 border transition-colors ${
                isLlp ? 'bg-ink text-white border-ink' : 'text-muted border-line hover:border-ink hover:text-ink'
              }`}
            >
              LLP
            </Link>
            <Link
              href="/corp"
              className={`no-underline rounded px-1.5 py-0.5 border transition-colors ${
                isCorp ? 'bg-ink text-white border-ink' : 'text-muted border-line hover:border-ink hover:text-ink'
              }`}
            >
              CORP
            </Link>
          </span>
        </div>

        <nav className="nav-links hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`no-underline text-sm font-medium transition-colors ${
                isActive(link.href) ? 'text-ink active' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
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
          {navLinks.map((link) => (
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
