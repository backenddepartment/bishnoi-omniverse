import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import comingSoonData from '@/lib/data/comingSoonData.json';
import { UnderConstructionArt } from '@/components/UnderConstructionArt';

const { copy, sites } = comingSoonData;

export function generateStaticParams() {
  return sites.map((site) => ({ site: site.slug }));
}

export function generateMetadata({ params }: { params: { site: string } }): Metadata {
  const site = sites.find((s) => s.slug === params.site);
  if (!site) return { title: 'Coming Soon | Bishnoi Omniverse' };

  return {
    title: `${site.name} — Coming Soon | Bishnoi Omniverse`,
    description: `${site.name} is under construction.`,
    // Nothing here is worth indexing until the real site exists.
    robots: { index: false, follow: true },
  };
}

/**
 * Standalone page — SiteChrome drops the navbar and footer for /coming-soon/*, so the only
 * way onward is the Return Home button.
 */
export default function ComingSoonPage({ params }: { params: { site: string } }) {
  const site = sites.find((s) => s.slug === params.site);
  if (!site) notFound();

  return (
    <div className="uc-section">
      <div className="wrap uc-grid">
        <div>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1 className="uc-title">
            {site.name} {copy.headingSuffix}
          </h1>
          <p className="uc-line">{copy.line}</p>

          <Link href="/" className="btn btn-primary">
            {copy.ctaHome}
          </Link>
        </div>

        <UnderConstructionArt className="uc-art" />
      </div>
    </div>
  );
}
