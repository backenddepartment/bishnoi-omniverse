import React from 'react';
import Link from 'next/link';
import homepageData from '@/lib/data/homepageData.json';

export const Footer: React.FC = () => {
  const { brand } = homepageData;

  return (
    <footer className="w-full bg-white border-t border-black py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-6 space-y-6">
        {/* Top Footer Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black pb-6">
          <div>
            <span className="text-base font-bold uppercase tracking-tight text-black block">
              {brand.name} <span className="font-normal normal-case text-slate-700">| {brand.tagline}</span>
            </span>
            <span className="text-xs text-slate-600 italic block mt-1">
              {brand.affiliation}
            </span>
          </div>

          <div className="text-xs md:text-sm font-medium text-slate-800">
            <a href={`mailto:${brand.email}`} className="hover:underline">
              {brand.email}
            </a>
            <span className="mx-2">|</span>
            <span>{brand.phone}</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs uppercase">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-slate-900">Quick Links:</span>
            <Link href="/contact?type=find-medicine" className="hover:underline text-slate-800">
              Find a Medicine
            </Link>
            <span>|</span>
            <Link href="/contact?type=hospital-supplies" className="hover:underline text-slate-800">
              Hospital Supplies
            </Link>
            <span>|</span>
            <Link href="/about" className="hover:underline text-slate-800">
              Partner With Us
            </Link>
            <span>|</span>
            <Link href="/contact" className="hover:underline text-slate-800">
              Contact
            </Link>
          </div>

          <div className="text-slate-500">
            © {new Date().getFullYear()} Bishnoi Omniverse. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
