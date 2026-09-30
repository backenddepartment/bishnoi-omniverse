import type { Metadata } from 'next';
import { Fraunces, Inter, Poppins } from 'next/font/google';
import './globals.css';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { RouteProgress } from '@/components/layout/RouteProgress';

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

export const metadata: Metadata = {
  title: 'Bishnoi Omniverse | Global Medical Supply & Specialty Sourcing',
  description:
    'Bishnoi Omniverse supplies hospitals, clinics, and trade partners with hospital-grade medical supplies and hard-to-source specialty medicines, sourced through our India and Philippines hubs and delivered to healthcare providers worldwide.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${poppins.variable}`}>
      <body className="flex flex-col min-h-screen">
        <RouteProgress />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
