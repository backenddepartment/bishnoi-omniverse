import type { Metadata } from 'next';
import { Fraunces, Inter, Poppins } from 'next/font/google';
import './globals.css';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { RouteProgress } from '@/components/layout/RouteProgress';
import { Analytics } from '@/components/layout/Analytics';
import { GoogleAnalytics } from '@/components/layout/GoogleAnalytics';
import { SITE_URL } from '@/lib/siteUrl';
import { pageMetadata } from '@/lib/seo';

// `display: 'swap'` is next/font's default, stated here on purpose: changing these options makes
// the dev server download the fonts afresh instead of reusing a fallback it cached after a failed
// download from Google Fonts.
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

// Google Search Console ownership check (HTML-tag method). Paste only the content="..." value Search
// Console gives you into the GOOGLE_SITE_VERIFICATION repository variable; blank = no tag. Not
// needed if the domain is verified with a DNS TXT record instead.
const GOOGLE_SITE_VERIFICATION = (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '').trim();

// The defaults every page starts from. Each indexable page overrides them with pageMetadata()
// (lib/seo.tsx) so it gets its own title, description, canonical URL and share tags.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({
    title: 'Medical Supplies Supplier Philippines | Bishnoi Omniverse',
    description:
      'Hospital-grade medical supplies and specialty medicines for hospitals and clinics, sourced through our India and Philippines hubs. Request a quote.',
  }),
  ...(GOOGLE_SITE_VERIFICATION ? { verification: { google: GOOGLE_SITE_VERIFICATION } } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${poppins.variable}`}>
      <body className="flex flex-col min-h-screen">
        <RouteProgress />
        <Analytics />
        <GoogleAnalytics />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
