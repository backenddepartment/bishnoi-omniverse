import {
  Accessibility,
  Ambulance,
  Armchair,
  Baby,
  Bandage,
  BedDouble,
  Biohazard,
  Droplets,
  Filter,
  FlaskConical,
  Hand,
  HeartPulse,
  HousePlus,
  Microscope,
  Milk,
  Package,
  Pill,
  ScanLine,
  Scissors,
  ShieldPlus,
  Smile,
  SprayCan,
  Stethoscope,
  Syringe,
  Waves,
  Wind,
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
  'dialysis-equipment': Filter,
  gloves: Hand,
  'personal-protective-equipment-ppe': ShieldPlus,
  'infection-control-and-sterilization': SprayCan,
  'patient-monitoring': HeartPulse,
  'diagnostic-equipment': Stethoscope,
  'respiratory-care': Wind,
  'surgical-equipment': Scissors,
  'patient-care-equipment': BedDouble,
  'emergency-and-critical-care': Ambulance,
  'infusion-and-injection': Syringe,
  'laboratory-equipment': Microscope,
  'medical-furniture': Armchair,
  'wound-care': Bandage,
  'medical-consumables': Package,
  urology: Droplets,
  gastroenterology: Waves,
  'obstetrics-and-gynecology': Baby,
  'neonatal-and-pediatric': Milk,
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

/** The category's icon, or undefined when the category has none mapped yet. */
export function findCategoryIcon(categoryId: string): LucideIcon | undefined {
  return categoryIcons[categoryId];
}
