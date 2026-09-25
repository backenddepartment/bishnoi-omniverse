import React from 'react';
import Link from 'next/link';

// Shared body for the About Us pages: each one follows the same approved outline — proof points,
// five content sections, then a closing call to action — so the pages differ only in their copy.

export type ProofPoint = { value: string; label: string };
export type AboutSection = { eyebrow: string; title: string; body: React.ReactNode[] };
export type AboutCta = { label: string; href: string };

export function ProofPoints({ points }: { points: ProofPoint[] }) {
  return (
    <section className="section-tight section-white pb-0">
      <div className="wrap">
        <span className="eyebrow">Proof Points</span>
        <div className="proof-row mt-4" style={{ '--proof-cols': points.length } as React.CSSProperties}>
          {points.map((point) => (
            <div key={point.label} className="proof">
              <div className="num">{point.value}</div>
              <div className="label">{point.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutSectionList({ sections }: { sections: AboutSection[] }) {
  return (
    <>
      {sections.map((section, idx) => (
        <section key={section.title} className={`section section-white${idx > 0 ? ' section-line' : ''}`}>
          <div className="wrap grid-2 items-start">
            <div className="heading-lg">
              <span className="eyebrow">{section.eyebrow}</span>
              <h2 className="mb-0">{section.title}</h2>
            </div>
            <div className="lead-block">
              {section.body.map((para, pIdx) => (
                <p key={pIdx} className="text-ink-soft leading-relaxed last:mb-0">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

export function AboutClosing({
  eyebrow,
  title,
  body,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  body: string;
  primary: AboutCta;
  secondary: AboutCta;
}) {
  return (
    <section className="section-dark section-tight">
      <div className="wrap text-center max-w-2xl mx-auto">
        <span className="eyebrow on-dark">{eyebrow}</span>
        <h2>{title}</h2>
        <p className="mt-2 mb-8">{body}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href={primary.href} className="btn btn-primary">
            {primary.label}
          </Link>
          <Link href={secondary.href} className="btn btn-outline">
            {secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
