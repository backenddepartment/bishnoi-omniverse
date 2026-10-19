import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import homepageData from '@/lib/data/homepageData.json';
import partnerFaqData from '@/lib/data/partnerFaqData.json';
import { FaqAccordion } from '@/components/FaqAccordion';
import { JsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Frequently Asked Questions | Bishnoi Omniverse',
  description:
    'Answers on named-patient supply, quote documents, cold-chain handling, sourcing and delivery markets, minimum orders, tenders and partnerships.',
  path: '/faq/',
});

const IMG = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Hospital_corridor_2.jpg',
};

export default function FaqPage() {
  const { faq } = homepageData;

  // schema.org FAQPage data, from the same lists the accordions below render, so the marked-up
  // questions and answers always match what is on the page.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [...faq.questions, ...partnerFaqData.questions].map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div className="w-full">
      <JsonLd data={structuredData} />
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
    </div>
  );
}
