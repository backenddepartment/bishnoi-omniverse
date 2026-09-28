import { SITEMAP_PAGES, absoluteUrl } from '@/lib/sitemapPages';

// Built once into a static file by the export. A route handler rather than app/sitemap.ts: the
// metadata-route version fails under `output: 'export'` in Next 14 (missing generateStaticParams).
export const dynamic = 'force-static';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/**
 * URL sitemap (/sitemap.xml). Pages, priorities and change frequencies come from
 * lib/sitemapPages.ts: 1.0 main pages, 0.8 secondary pages, 0.5 static pages. Images are listed
 * separately in /sitemap-images.xml.
 */
export function GET() {
  const lastModified = new Date().toISOString();

  const entries = SITEMAP_PAGES.map(
    (page) => `  <url>
    <loc>${escapeXml(absoluteUrl(page.path))}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`,
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
