'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/catalog', label: 'Catalog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const isGlobalActive = pathname.startsWith('/global');

  return (
    <header className="w-full bg-white border-b border-black">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Brand Logo / Text */}
        <Link href="/" className="text-xl font-bold tracking-tight text-black uppercase">
          Bishnoi Omniverse
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide uppercase transition ${
                isActive(link.href)
                  ? 'font-bold underline text-black'
                  : 'font-medium text-slate-700 hover:text-black'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side: Global Ecosystem Button & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link
            href="/global"
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition border flex items-center gap-1.5 ${
              isGlobalActive
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-black hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Global</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-black border border-black"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-black px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm uppercase ${
                isActive(link.href) ? 'font-bold underline text-black' : 'text-slate-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/global"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-sm uppercase font-bold text-black border-t border-slate-200 pt-3 flex items-center gap-2`}
          >
            <Globe className="w-4 h-4 text-black" />
            <span>Global Ecosystem (/global)</span>
          </Link>
        </div>
      )}
    </header>
  );
};
