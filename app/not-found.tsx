import type { Metadata } from 'next';
import Link from 'next/link';
import { CATALOG_PATH, EQUIPMENT_PATH } from '@/lib/catalogRoutes';

export const metadata: Metadata = {
  title: 'Page Not Found | Bishnoi Omniverse',
  robots: { index: false, follow: true },
};

/** Shown for any address that has no page: says so plainly and offers the ways back in. */
export default function NotFound() {
  return (
    <section className="section section-white">
      <div className="wrap not-found">
        <span className="eyebrow">Error 404</span>
        <h1>We couldn&apos;t find that page</h1>
        <p>
          The link may be out of date, or the page may have moved. These will get you back on track.
        </p>
        <div className="not-found-actions">
          <Link href="/" className="btn btn-primary">
            Go to the homepage
          </Link>
          <Link href={CATALOG_PATH} className="btn btn-outline">
            Browse the catalog
          </Link>
        </div>
        <ul>
          <li>
            <Link href={EQUIPMENT_PATH}>Search all medical equipment</Link>
          </li>
          <li>
            <Link href="/contact">Contact us or request a quote</Link>
          </li>
          <li>
            <Link href="/site-map">See every page on the site</Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
