import type { Metadata } from 'next';
import { CatalogBrowser } from '@/components/catalog/CatalogBrowser';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Medical Equipment Supplier Philippines | Bishnoi Omniverse',
  description:
    'Hospital supplies and medical equipment in bulk: gloves, PPE, dialysis, surgical, respiratory and patient monitoring, delivered across the Philippines.',
  path: '/medical-equipment/',
});

export default function MedicalEquipmentPage() {
  return <CatalogBrowser />;
}
