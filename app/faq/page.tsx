import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import homepageData from '@/lib/data/homepageData.json';
import partnerFaqData from '@/lib/data/partnerFaqData.json';
import { FaqAccordion } from '@/components/FaqAccordion';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Bishnoi Omniverse',
  description:
    'Answers on named-patient supply, quote documentation, cold-chain handling, sourcing and delivery markets, minimum order quantities, tenders, and how distribution and manufacturer partnerships work.',
};

const IMG = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Hospital_corridor_2.jpg',
};

export default function FaqPage() {
  const { faq } = homepageData;

  return (
    <div className="w-full">
      <section className="page-hero">
        <div className="hero-media">
          <img src={IMG.hero} alt="Hospital corridor" loading="eager" />
        </div>
        <div className="hero-content">
          <span className="eyebrow on-dark">Frequently Asked Questions</span>
          <h1>The questions procurement teams ask first</h1>
          <p className="lede">
            How supply, documentation, and partnership actually work at Bishnoi Omniverse — answered
            in the same detail we would give you on a call.
          </p>
        </div>
      </section>

      {/* Supply & procurement — the same set shown on the homepage, read from one source. */}
      <section className="section section-white">
        <div className="wrap grid grid-cols-1 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-12 md:gap-20 items-start">
          <div className="heading-lg">
            <span className="eyebrow">{faq.sectionTag}</span>
            <h2 className="mb-4">{faq.title}</h2>
            <p className="text-ink-soft leading-relaxed">
              Supply, documentation, and logistics — what a hospital, clinic, or procurement office
              needs to know before sending a requirement.
            </p>
          </div>

          <FaqAccordion questions={faq.questions} />
        </div>
      </section>

      <section className="section section-line section-white">
        <div className="wrap grid grid-cols-1 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-12 md:gap-20 items-start">
          <div className="heading-lg">
            <span className="eyebrow">For Partners</span>
            <h2 className="mb-4">Distribution &amp; manufacturing</h2>
            <p className="text-ink-soft leading-relaxed">
              For distributors and manufacturers looking at a partnership. The full picture — routes,
              onboarding, and benefits — is on the{' '}
              <Link href="/trade-partners" className="text-accent-dark font-semibold hover:underline">
                Trade &amp; Partners
              </Link>{' '}
              page.
            </p>
          </div>

          <FaqAccordion questions={partnerFaqData.questions} />
        </div>
      </section>

      <section className="section section-white pt-0 pb-24">
        <div className="wrap">
          <div className="section-dark rounded-3xl px-8 py-16">
            <div className="heading-lg text-center max-w-2xl mx-auto">
              <span className="eyebrow on-dark text-[#f8ae85]">Still Have a Question?</span>
              <h2>Send us the requirement and we&apos;ll answer it directly.</h2>
              <p className="mt-2 mb-8">
                A case manager responds within 24 hours — whether that is a quote, a document
                request, or a question we have not answered here.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact?type=quote" className="btn btn-primary">
                  Request a Quote
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
