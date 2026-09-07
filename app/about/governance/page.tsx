import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import catalogData from '@/lib/data/catalogData.json';

const IMG = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Ethylene_oxide_sterilisation_sticker_on_box_of_medical_supplies.jpg',
};

export default function GovernancePage() {
  const { trustBanner } = catalogData;

  return (
    <div className="w-full">
      <section className="page-hero">
        <div className="hero-media">
          <img src={IMG.hero} alt="A certified medical supply box, ready for sterile shipment" loading="eager" />
        </div>
        <div className="hero-content">
          <span className="eyebrow on-dark">About Us</span>
          <h1>Governance &amp; Standards</h1>
          <p className="lede">{trustBanner.subtitle}</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap grid-2">
          <div>
            <span className="eyebrow">Compliance</span>
            <h2 className="mb-0">{trustBanner.title}</h2>
          </div>
          <div className="lead-block space-y-3">
            {trustBanner.points.map((point) => (
              <div key={point.step} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <h3 className="font-sans text-base font-bold text-ink mb-1">{point.title}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed m-0">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-line section-2col">
        <div className="wrap">
          <span className="eyebrow">Certifications We Verify Against</span>
          <h2 className="mb-10">Every Product, Fully Documented</h2>

          <div className="grid-4">
            {['CE Marked', 'ISO 9809-1', 'CMDR Approved', 'WHO-GMP'].map((cert, idx) => (
              <div key={cert} className="pillar">
                <span className="num">0{idx + 1}</span>
                <h3>{cert}</h3>
                <p>Verified before any product reaches your facility, with documentation available on request.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark section-tight">
        <div className="wrap text-center max-w-2xl mx-auto">
          <span className="eyebrow on-dark">Partner With Us</span>
          <h2>Building the world&apos;s most trusted supply line for medicine that can&apos;t wait.</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/contact" className="btn btn-primary">
              Get In Touch <ArrowRight />
            </Link>
            <Link href="/catalog" className="btn btn-outline">
              Browse The Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
