import type { Metadata } from 'next';
import catalogData from '@/lib/data/catalogData.json';
import { AdminApp } from '@/components/admin/AdminApp';

export const metadata: Metadata = {
  title: 'Analytics | Bishnoi Omniverse',
  robots: { index: false, follow: false },
};

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

  return <AdminApp productNames={productNames} />;
}
