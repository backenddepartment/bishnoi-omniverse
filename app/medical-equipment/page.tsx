import type { Metadata } from 'next';
import { CatalogBrowser } from '@/components/catalog/CatalogBrowser';

export const metadata: Metadata = {
  title: 'Medical Equipment | Bishnoi Omniverse',
  description:
    'Browse every product in the Bishnoi Omniverse medical equipment range, from gloves and PPE to dialysis, surgical and patient monitoring equipment, and request a quote.',
};

export default function MedicalEquipmentPage() {
  return <CatalogBrowser />;
}
