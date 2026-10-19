import type { Metadata } from 'next';
import { SITE_URL, absoluteUrl } from '@/lib/siteUrl';

export const SITE_NAME = 'Bishnoi Omniverse';

/** The 1200x630 image shown when a page is shared on LinkedIn, Facebook, Viber or WhatsApp. */
export const OG_IMAGE = { url: absoluteUrl('/og-image.jpg'), width: 1200, height: 630, alt: `${SITE_NAME} medical supplies and specialty medicines` };

/** Site paths are served with a trailing slash (next.config `trailingSlash`). */
const withTrailingSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`);

/**
 * A page's metadata with everything search engines and link previews read from it: the title and
 * description, a self-referencing canonical URL, and the Open Graph and Twitter tags. Use it for
 * every indexable page, so no page ships without a canonical tag.
 *
 * Keep `title` to 50-60 characters (main keyword first, brand last) and `description` under 160,
 * the length Google shows before cutting it off. `path` is left off only for the site-wide defaults
 * in the root layout, so a page that sets nothing (404, search) never claims another's canonical.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
}: {
  title: string;
  description: string;
  path?: string;
  type?: 'website' | 'article';
}): Metadata {
  const url = path === undefined ? undefined : absoluteUrl(withTrailingSlash(path));
  return {
    title,
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: 'en_PH',
      title,
      description,
      ...(url ? { url } : {}),
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

/**
 * schema.org data as a JSON-LD script tag. "<" is escaped so text from the catalog can never close
 * the script tag early.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\u003c') }}
    />
  );
}

export { SITE_URL };
