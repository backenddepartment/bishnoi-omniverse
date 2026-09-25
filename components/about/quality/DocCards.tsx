import React from 'react';
import { Award } from 'lucide-react';
import { FadeIn } from '@/components/FadeIn';

export type DocCard = {
  /** Product group shown beside the ribbon, e.g. "Devices". */
  label: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  text: React.ReactNode;
};

/**
 * P8 "document cards" for Quality & Compliance: each reads like a certificate — white paper, a thin
 * orange rule along the top, a ribbon mark and the standard names in bold. Three across on desktop,
 * one column on phones.
 */
export function DocCards({ items }: { items: DocCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {items.map((item, i) => (
        <FadeIn key={item.label} delay={i * 0.08} className="h-full">
          {/* Hover treatment (lift, deeper shadow, accent border, slow image zoom) lives in
              globals.css under .doc-card, alongside the site's other card hovers. */}
          <article className="doc-card flex h-full flex-col overflow-hidden rounded-2xl bg-white">
            <div className="doc-card-media">
              <img
                src={item.image}
                alt={item.imageAlt}
                loading="lazy"
                className="block w-full object-cover"
                style={{ aspectRatio: '16 / 10', objectPosition: item.imagePosition ?? 'center' }}
              />
            </div>
            <div className="flex flex-1 flex-col px-6 pb-7 pt-6">
              <span
                className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: 'var(--accent-dark)' }}
              >
                <Award className="doc-card-icon h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                {item.label}
              </span>
              <p className="m-0 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {item.text}
              </p>
            </div>
          </article>
        </FadeIn>
      ))}
    </div>
  );
}
