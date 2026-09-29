import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import catalogData from '@/lib/data/catalogData.json';
import { LegacyRedirect } from '@/components/catalog/LegacyRedirect';
import { productPath } from '@/lib/catalogRoutes';

/**
 * Products used to live at /catalog/<product>/ and now live under their category, at
 * /medical-equipment/<category>/<product>/. The old addresses are in search results, bookmarks
 * and the requisition emails already sent, so each one is kept as a stub that forwards there.
 */

export function generateStaticParams() {
  return catalogData.products.map((product) => ({ productId: product.id }));
}

export const metadata: Metadata = {
  title: 'Medical Equipment | Bishnoi Omniverse',
  // Only the page it forwards to should be indexed.
  robots: { index: false, follow: true },
};

export default function LegacyProductPage({ params }: { params: { productId: string } }) {
  const product = catalogData.products.find((p) => p.id === params.productId);
  if (!product) notFound();

  return <LegacyRedirect href={productPath(product)} label={product.name} />;
}
