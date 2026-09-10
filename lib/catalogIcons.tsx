import {
  Accessibility,
  Armchair,
  Baby,
  Bandage,
  Biohazard,
  Droplets,
  FlaskConical,
  Hand,
  HeartPulse,
  Package,
  Pill,
  HousePlus,
  ScanLine,
  Scissors,
  Shield,
  Siren,
  Smile,
  SprayCan,
  Stethoscope,
  Syringe,
  TestTubes,
  Waves,
  Wind,
  BedDouble,
  type LucideIcon,
} from 'lucide-react';

/**
 * One line icon per catalog category. Keys are the slugs generated from the sheet's Category
 * column (see scripts/sync-catalog.mjs), so renaming a category in the sheet changes its slug
 * and drops it back to the default icon — add the new key here when that happens.
 *
 * Icons carry the catalog's product imagery: the sheet's "Reference Image URL" column holds
 * research links to stock-photo pages rather than licensed image files, so products are
 * illustrated by category until real photos are licensed and committed to public/products.
 */
export const categoryIcons: Record<string, LucideIcon> = {
  gloves: Hand,
  'personal-protective-equipment-ppe': Shield,
  'infection-control-and-sterilization': SprayCan,
  'patient-monitoring': HeartPulse,
  'diagnostic-equipment': Stethoscope,
  'respiratory-care': Wind,
  'surgical-equipment': Scissors,
  'patient-care-equipment': BedDouble,
  'emergency-and-critical-care': Siren,
  'infusion-and-injection': Syringe,
  'laboratory-equipment': TestTubes,
  'medical-furniture': Armchair,
  'wound-care': Bandage,
  'medical-consumables': Package,
  urology: Droplets,
  gastroenterology: Waves,
  'obstetrics-and-gynecology': Baby,
  'neonatal-and-pediatric': Baby,
  'physiotherapy-and-rehabilitation': Accessibility,
  'imaging-equipment': ScanLine,
  'pharmacy-and-medication-storage': Pill,
  'dental-equipment': Smile,
  'medical-waste-management': Biohazard,
  'homecare-and-mobility': HousePlus,
};

export function getCategoryIcon(categoryId: string): LucideIcon {
  return categoryIcons[categoryId] || FlaskConical;
}
