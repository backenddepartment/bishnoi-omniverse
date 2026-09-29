/** Public site address, without a trailing slash. Set NEXT_PUBLIC_SITE_URL for the live domain. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bishnoi.ai').replace(/\/+$/, '');

/** Absolute URL for a site path, e.g. `/about/` → `https://bishnoi.ai/about/`. */
export function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}
