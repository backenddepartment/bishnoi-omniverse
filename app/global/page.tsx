import React from 'react';
import Link from 'next/link';
import { ArrowRight, HeartHandshake, Globe2 } from 'lucide-react';
import businessesData from '@/lib/data/businessesData.json';

const IMG = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Hospital_corridor_2.jpg',
  omniverse: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Hospital_corridor_2.jpg',
  getmeds:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Former_pharmacy%2C_shelves_with_medicines.jpg/1920px-Former_pharmacy%2C_shelves_with_medicines.jpg',
  india: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Skyline_of_Cannaught_Place%2C_New_Delhi.jpg',
  philippines:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Manila_Skyline_March_2020.jpg/1920px-Manila_Skyline_March_2020.jpg',
};

const divisionImages: Record<string, string> = {
  omniverse: IMG.omniverse,
  getmeds: IMG.getmeds,
};

export default function GlobalBusinessesPage() {
  const { header, sections, legacy } = businessesData;

  return (
    <div className="w-full businesses-page">
      <section className="page-hero">
        <div className="hero-media">
          <img src={IMG.hero} alt="Hospital corridor representing our healthcare infrastructure" loading="eager" />
        </div>
        <div className="hero-content">
          <span className="eyebrow on-dark">{header.title}</span>
          <h1>{header.headline}</h1>
          <p className="lede">{header.subheadline}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="#ventures">
              {header.ctaExplore} <ArrowRight />
            </Link>
            <Link className="btn btn-outline" href="/contact?type=partner">
              {header.ctaPartner}
            </Link>
          </div>
        </div>
      </section>

      <div id="ventures">
        {sections.map((sec) => {
          const img = divisionImages[sec.id];
          return (
            <section key={sec.id} id={sec.id} className="division">
              <div className="wrap">
                {img ? (
                  <div className="division-grid">
                    <img src={img} alt={sec.title} />
                    <div>
                      <span className="tag">
                        {sec.group} &middot; Division 0{sec.number}
                      </span>
                      <h2>{sec.title}</h2>
                      <p className="text-sm font-medium italic text-muted mb-4">{sec.tagline}</p>
                      <p className="text-ink-soft leading-relaxed mb-6">{sec.description}</p>
                      <ul className="space-y-3 mb-6">
                        {sec.bullets.map((b, idx) => (
                          <li key={idx} className="text-sm text-ink-soft leading-relaxed flex items-start gap-2.5">
                            <span className="text-accent shrink-0 mt-0.5">—</span>
                            <span>
                              <strong className="text-ink">{b.name}</strong> {b.desc}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {sec.ctaText && sec.ctaHref && (
                        <Link href={sec.ctaHref} className="btn btn-outline on-light">
                          {sec.ctaText} <ArrowRight />
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="tag">
                      {sec.group} &middot; Division 0{sec.number}
                    </span>
                    <div className="grid-2 items-start">
                      <div>
                        <h2>{sec.title}</h2>
                        <p className="text-sm font-medium italic text-muted mb-4">{sec.tagline}</p>
                        <p className="text-ink-soft leading-relaxed">{sec.description}</p>
                      </div>
                      <div className="bg-paper-2 border border-line rounded p-8 h-full flex flex-col justify-center gap-5">
                        <HeartHandshake className="w-9 h-9 text-accent" strokeWidth={1.5} />
                        <ul className="space-y-3">
                          {sec.bullets.map((b, idx) => (
                            <li key={idx} className="text-sm text-ink-soft leading-relaxed flex items-start gap-2.5">
                              <span className="text-accent shrink-0 mt-0.5">—</span>
                              <span>
                                <strong className="text-ink">{b.name}</strong> {b.desc}
                              </span>
                            </li>
                          ))}
                        </ul>
                        {sec.ctaText && sec.ctaHref && (
                          <Link href={sec.ctaHref} className="btn btn-outline on-light self-start">
                            {sec.ctaText} <ArrowRight />
                          </Link>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <section className="section" id="global-presence">
        <div className="wrap">
          <span className="eyebrow">Our Global Presence</span>
          <h2 className="mb-3">Two Hubs, One Continuous Line of Supply</h2>
          <p className="lead-block text-ink-soft mb-10">
            Sourcing runs through New Delhi and regional logistics through Metro Manila.{' '}
            <Link href="/global-network" className="text-accent-dark font-semibold hover:underline">
              See the full operating footprint
            </Link>
            , including addresses and our UN Global Compact participation.
          </p>
          <div className="grid-2">
            <img src={IMG.india} alt="New Delhi, India — our global sourcing hub" className="w-full h-[300px] object-cover rounded" />
            <img src={IMG.philippines} alt="Manila, Philippines — our Asia-Pacific logistics hub" className="w-full h-[300px] object-cover rounded" />
          </div>
        </div>
      </section>

      <section className="section-dark section-tight">
        <div className="wrap">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="eyebrow on-dark">Future Outlook</span>
              <h2>{legacy.title}</h2>
              <p>{legacy.description}</p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
              <div className="flex items-center gap-2 text-white font-sans font-bold">
                <Globe2 className="w-5 h-5 text-accent" />
                {legacy.footerBrand}
              </div>
              <a href={`mailto:${legacy.email}`} className="text-sm text-[#cfc9ba] hover:text-white">
                {legacy.email}
              </a>
              <span className="text-xs text-[#807a6a]">{legacy.copyright}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
