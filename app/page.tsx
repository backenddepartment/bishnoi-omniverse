import React from 'react';
import Link from 'next/link';
import homepageData from '@/lib/data/homepageData.json';

export default function HomePage() {
  const { hero, realProblem, whoWeHelp, howItWorks, globalFootprint, whyTrustUs, faq } = homepageData;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 border-b border-black">
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-black leading-tight max-w-4xl">
          {hero.headline}
        </h1>
        <p className="text-base md:text-lg text-slate-800 mt-6 max-w-3xl leading-relaxed font-normal">
          {hero.subheadline}
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8">
          <Link
            href="/contact?type=find-medicine"
            className="px-6 py-3.5 bg-black text-white text-sm uppercase font-bold text-center border border-black hover:bg-slate-900 transition"
          >
            {hero.ctaFindMedicine}
          </Link>
          <Link
            href="/contact?type=hospital-supply"
            className="px-6 py-3.5 bg-white text-black text-sm uppercase font-bold text-center border border-black hover:bg-slate-100 transition"
          >
            {hero.ctaHospitalSupply}
          </Link>
        </div>
      </section>

      {/* The Real Problem */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-black">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
          {realProblem.sectionTag}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold uppercase text-black mb-6">
          {realProblem.title}
        </h2>
        <div className="space-y-4 text-slate-800 text-sm md:text-base leading-relaxed max-w-4xl">
          {realProblem.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </section>

      {/* Who We Help & What We Provide */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-black">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
          {whoWeHelp.sectionTag}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold uppercase text-black mb-8">
          {whoWeHelp.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whoWeHelp.items.map((item) => (
            <div key={item.id} className="p-6 border border-black space-y-3">
              <h3 className="text-lg font-bold uppercase text-black">
                {item.title}
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works (4 Simple Steps) */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-black">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
          {howItWorks.sectionTag}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold uppercase text-black mb-8">
          {howItWorks.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          {howItWorks.steps.map((step) => (
            <div key={step.step} className="p-6 border border-black space-y-2">
              <div className="text-xs font-bold uppercase text-slate-500">Step {step.step}</div>
              <h4 className="text-base font-bold uppercase text-black">{step.title}</h4>
              <p className="text-slate-800 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEW SECTION: Our Global Footprint & Core Catalog */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-black bg-slate-50">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
          {globalFootprint.sectionTag}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold uppercase text-black mb-3">
          {globalFootprint.title}
        </h2>
        <p className="text-base md:text-lg font-bold text-black max-w-3xl mb-4">
          {globalFootprint.lead}
        </p>
        <div className="space-y-4 text-sm md:text-base text-slate-800 max-w-4xl leading-relaxed mb-10">
          <p>{globalFootprint.description}</p>
          <p className="italic font-medium text-slate-700">{globalFootprint.subtext}</p>
        </div>

        {/* Essential Hospital Line Box */}
        <div className="p-8 border-2 border-black bg-white space-y-8">
          <div>
            <h3 className="text-xl md:text-2xl font-bold uppercase text-black">
              {globalFootprint.essentialLineTitle}
            </h3>
            <p className="text-xs font-medium italic text-slate-600 mt-1">
              {globalFootprint.essentialLineTagline}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            {globalFootprint.categories.map((cat, idx) => (
              <div key={idx} className="space-y-3 p-5 border border-slate-300 bg-slate-50/50">
                <h4 className="text-base font-bold uppercase text-black border-b border-black pb-2">
                  {cat.name}
                </h4>
                <ul className="space-y-3">
                  {cat.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="space-y-1">
                      <strong className="text-black uppercase tracking-wide block text-xs">
                        {item.title}
                      </strong>
                      <p className="text-slate-800 text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Section CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-slate-200">
            <Link
              href="/catalog"
              className="px-6 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-wider text-center border border-black hover:bg-slate-900 transition"
            >
              {globalFootprint.ctaExplore}
            </Link>
            <Link
              href="/contact?type=hospital-supplies"
              className="px-6 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-wider text-center border border-black hover:bg-slate-100 transition"
            >
              {globalFootprint.ctaDownload}
            </Link>
          </div>
        </div>
      </section>

      {/* Why Trust Bishnoi Omniverse? */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-black">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
          {whyTrustUs.sectionTag}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold uppercase text-black mb-8">
          {whyTrustUs.title}
        </h2>

        <div className="space-y-6 max-w-4xl">
          {whyTrustUs.points.map((point) => (
            <div key={point.title} className="p-6 border border-black space-y-2">
              <h3 className="text-lg font-bold uppercase text-black">
                {point.title}
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed">
                {point.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Questions You Might Have (FAQ) */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
          {faq.sectionTag}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold uppercase text-black mb-8">
          {faq.title}
        </h2>

        <div className="space-y-6 max-w-4xl text-sm">
          {faq.questions.map((item) => (
            <div key={item.q} className="p-6 border border-black space-y-2">
              <h3 className="text-base font-bold uppercase text-black">
                {item.q}
              </h3>
              <p className="text-slate-800 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
