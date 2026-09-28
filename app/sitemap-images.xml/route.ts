import { SITEMAP_PAGES, absoluteUrl } from '@/lib/sitemapPages';

// Built once into a static file by the export, like sitemap.xml.
export const dynamic = 'force-static';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/**
 * Image sitemap (/sitemap-images.xml), kept separate from the URL sitemap. Each page is listed
 * with the images shown on it; pages without images are left out.
 */
export function GET() {
  const entries = SITEMAP_PAGES.filter((page) => page.images.length > 0)
    .map((page) => {
      const images = [...new Set(page.images)]
        .map((src) => `    <image:image>\n      <image:loc>${escapeXml(src)}</image:loc>\n    </image:image>`)
        .join('\n');
      return `  <url>\n    <loc>${escapeXml(absoluteUrl(page.path))}</loc>\n${images}\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries}
</urlset>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
