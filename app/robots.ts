import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/sitemapPages';

/**
 * robots.txt. The sitemaps tell crawlers what to crawl; this file tells them what not to:
 * admin/back-panel and dashboard URLs, the API, internal search results and the coming-soon
 * placeholders. Everything else, including /_next/ (the CSS, scripts and images pages need to
 * render), stays open.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/backpanel/',
        '/back-panel/',
        '/dashboard/',
        '/api/',
        '/search/',
        '/coming-soon/',
      ],
    },
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/sitemap-images.xml`],
  };
}
