/** Public site address, without a trailing slash. Set NEXT_PUBLIC_SITE_URL for the live domain. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bishnoiomniverse.com').replace(/\/+$/, '');

/** Absolute URL for a site path, e.g. `/about/` → `https://bishnoiomniverse.com/about/`. */
export function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}
