import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import catalogData from '@/lib/data/catalogData.json';
import { AdminApp } from '@/components/admin/AdminApp';

export const metadata: Metadata = {
  title: 'Analytics | Bishnoi Omniverse',
  robots: { index: false, follow: false },
};

// The dashboard's type, after the CRM component sheet: Poppins with its regular weight for body
// text. Loaded here so only /admin/ pays for the extra weight; the site keeps its own set.
const adminFont = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

/**
 * The analytics dashboard. A static page like the rest of the site: the sign-in and every number
 * come from the analytics Worker at runtime (see docs/analytics.md), so nothing private is in the
 * exported HTML.
 */
export default function AdminPage() {
  // Product ids -> names for the "Added to quote" table, built here so the catalog JSON is not
  // shipped to the browser.
  const productNames: Record<string, string> = {};
  for (const product of catalogData.products) productNames[product.id] = product.name;

  return (
    <div className={adminFont.className}>
      <AdminApp productNames={productNames} />
    </div>
  );
}
