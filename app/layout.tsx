import type { Metadata } from 'next';
import { Fraunces, Inter, Poppins } from 'next/font/google';
import './globals.css';
import { SiteChrome } from '@/components/layout/SiteChrome';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fraunces',
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
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
