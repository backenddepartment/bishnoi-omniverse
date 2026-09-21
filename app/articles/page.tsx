import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import articlesData from '@/lib/data/articlesData.json';
import heroImg from '@/app/assets/sourcing.jpg';

export const metadata: Metadata = {
  title: 'Articles | Bishnoi Omniverse',
  description:
    'Practical writing on medical supply sourcing, product documentation, and cross-border access to specialty medicines.',
};

/**
 * One entry in lib/data/articlesData.json → items. Add objects of this shape to publish articles;
 * the grid and the empty state below switch over on their own.
 *
 *   {
 *     "slug": "what-ships-with-a-tender-line",
 *     "title": "What ships with a tender line",
 *     "category": "Documentation",
 *     "date": "2026-02-14",          // ISO, used for both display and ordering
 *     "excerpt": "One or two sentences that stand on their own in the card.",
 *     "href": "/articles/what-ships-with-a-tender-line"
 *   }
 */
type Article = {
  slug: string;
  title: string;
  category?: string;
  date?: string;
  excerpt?: string;
  href: string;
};

const DATE_FORMAT: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

function formatDate(date?: string) {
  if (!date) return null;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toLocaleDateString('en-GB', DATE_FORMAT);
}

export default function ArticlesPage() {
  const { header, emptyState } = articlesData;
  const articles = articlesData.items as Article[];

  // Newest first, with undated entries falling to the end rather than the front.
  const ordered = [...articles].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return (
    <div className="w-full">
      <section className="page-hero page-hero-banner">
        <div className="hero-media">
          <img
            src={heroImg.src}
            alt="Medical supplies being prepared for consolidation and onward shipment"
            loading="eager"
          />
        </div>
        <div className="hero-content">
          <span className="eyebrow on-dark">{header.eyebrow}</span>
          <h1>{header.title}</h1>
          <p className="lede">{header.lede}</p>
        </div>
      </section>

      <section className="section section-white">
        <div className="wrap">
          {ordered.length > 0 ? (
            <div className="grid-3">
              {ordered.map((article) => {
                const published = formatDate(article.date);
                return (
                  <Link
                    key={article.slug}
                    href={article.href}
                    className="border border-line rounded-2xl p-6 no-underline block card-hover"
                  >
                    {(article.category || published) && (
                      <span className="eyebrow">
                        {[article.category, published].filter(Boolean).join(' · ')}
                      </span>
                    )}
                    <h2 className="font-sans text-lg font-bold text-ink mb-2">{article.title}</h2>
                    {article.excerpt && (
                      <p className="text-sm text-ink-soft leading-relaxed m-0">{article.excerpt}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Shown until the first entry lands in articlesData.json, so the page is never blank. */
            <div className="border border-line rounded-2xl px-8 py-16 text-center max-w-2xl mx-auto">
              <FileText className="w-10 h-10 text-accent mx-auto mb-5" strokeWidth={1.5} aria-hidden="true" />
              <h2 className="font-sans text-2xl font-bold text-ink mb-3">{emptyState.title}</h2>
              <p className="text-ink-soft leading-relaxed max-w-lg mx-auto mb-8">{emptyState.body}</p>
              <Link href={emptyState.ctaHref} className="btn btn-primary">
                {emptyState.ctaText}
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="section section-white pt-0 pb-24">
        <div className="wrap">
          <div className="section-dark rounded-3xl px-8 py-20">
            <div className="heading-lg text-center max-w-2xl mx-auto">
              <span className="eyebrow on-dark text-[#f8ae85]">Work With Us</span>
              <h2>Have a requirement rather than a question?</h2>
              <p className="mt-2 mb-8">
                Send it over and a case manager responds within 24 hours, with the quote and the
                paperwork together.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact?type=quote" className="btn btn-primary">
                  Request a Quote
                </Link>
                <Link href="/catalog" className="btn btn-outline">
                  Browse the Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
