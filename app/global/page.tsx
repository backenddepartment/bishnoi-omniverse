import React from 'react';
import Link from 'next/link';
import businessesData from '@/lib/data/businessesData.json';

export default function GlobalBusinessesPage() {
  const { header, vision, sections, legacy } = businessesData;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 border-b border-black">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
          {header.title}
        </span>
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-black leading-tight max-w-4xl">
          {header.headline}
        </h1>
        <p className="text-base md:text-lg text-slate-800 mt-6 max-w-3xl leading-relaxed font-normal">
          {header.subheadline}
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8">
          <a
            href="#ventures"
            className="px-6 py-3.5 bg-black text-white text-sm uppercase font-bold text-center border border-black hover:bg-slate-900 transition"
          >
            {header.ctaExplore}
          </a>
          <Link
            href="/contact?type=partner"
            className="px-6 py-3.5 bg-white text-black text-sm uppercase font-bold text-center border border-black hover:bg-slate-100 transition"
          >
            {header.ctaPartner}
          </Link>
        </div>
      </section>

      {/* From Vision to the World */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-black">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
          Our Journey
        </span>
        <h2 className="text-2xl md:text-3xl font-bold uppercase text-black mb-6">
          {vision.title}
        </h2>
        <div className="space-y-4 text-slate-800 text-sm md:text-base leading-relaxed max-w-4xl">
          <p className="font-bold text-black text-base md:text-lg">
            {vision.lead}
          </p>
          <p>{vision.paragraph}</p>
        </div>
      </section>

      {/* Sections 1, 2, 3 (Ventures & Ecosystem) */}
      <section id="ventures" className="max-w-6xl mx-auto px-6 py-16 border-b border-black space-y-16">
        {sections.map((sec) => (
          <div key={sec.id} className="p-8 border border-black bg-white space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-1">
                Division 0{sec.number}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold uppercase text-black">
                {sec.title}
              </h2>
              <p className="text-sm font-medium italic text-slate-700 mt-1">
                {sec.tagline}
              </p>
            </div>

            <p className="text-sm md:text-base text-slate-800 leading-relaxed max-w-4xl">
              {sec.description}
            </p>

            <ul className="space-y-3 pt-2">
              {sec.bullets.map((b, idx) => (
                <li key={idx} className="text-sm text-slate-800 leading-relaxed flex items-start gap-2">
                  <span className="font-bold text-black shrink-0">•</span>
                  <div>
                    <strong className="text-black uppercase tracking-wide">{b.name}</strong> {b.desc}
                  </div>
                </li>
              ))}
            </ul>

            {sec.ctaText && sec.ctaHref && (
              <div className="pt-4">
                <Link
                  href={sec.ctaHref}
                  className="inline-block px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider border border-black hover:bg-slate-900 transition"
                >
                  {sec.ctaText}
                </Link>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* A Legacy Still in the Making */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
          Future Outlook
        </span>
        <h2 className="text-2xl md:text-3xl font-bold uppercase text-black mb-6">
          {legacy.title}
        </h2>
        <p className="text-base text-slate-800 max-w-4xl leading-relaxed">
          {legacy.description}
        </p>

        <div className="mt-8 p-6 border-2 border-black bg-slate-900 text-white max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-sm font-bold uppercase block">{legacy.footerBrand}</span>
            <a href={`mailto:${legacy.email}`} className="text-xs text-slate-300 hover:underline block mt-1">
              {legacy.email}
            </a>
          </div>
          <span className="text-xs text-slate-400">{legacy.copyright}</span>
        </div>
      </section>
    </div>
  );
}
