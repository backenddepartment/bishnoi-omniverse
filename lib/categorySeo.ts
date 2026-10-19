/**
 * Search-engine title, heading and description for each category page, written by hand. The
 * on-page overview stays in lib/categoryOverviews.ts; this is the short version Google shows.
 *
 *   title        50-60 characters: the page's main keyword first, the brand last
 *   h1           optional; the category name is used when left out
 *   description  under 155 characters: keyword, what is on the page, a call to action
 *
 * The main keywords follow the SEO audit's keyword map (one main keyword per page, never the same
 * one on two pages). Keys are the category slugs (see scripts/sync-catalog.mjs); a new category
 * with no entry falls back to categorySeo()'s generated version until one is added.
 */
type CategorySeo = { title: string; h1?: string; description: string };

const CATEGORY_SEO: Record<string, CategorySeo> = {
  gloves: {
    title: 'Nitrile Gloves Supplier Philippines | Bishnoi Omniverse',
    h1: 'Medical Gloves in Bulk for Philippine Hospitals',
    description:
      'Bulk nitrile, latex and vinyl examination gloves and sterile surgical gloves for hospitals and clinics. Delivered across the Philippines. Request a quote.',
  },
  'personal-protective-equipment-ppe': {
    title: 'PPE Supplier Philippines | Bishnoi Omniverse',
    h1: 'Personal Protective Equipment (PPE) for Hospitals',
    description:
      'PPE supplier for Philippine hospitals: isolation gowns, coveralls, N95 and KN95 respirators, surgical masks and face shields in bulk. Request a quote.',
  },
  'dialysis-equipment': {
    title: 'Dialysis Supplies Philippines | Bishnoi Omniverse',
    h1: 'Dialysis Supplies and Equipment for Dialysis Centres',
    description:
      'Dialyzers, bloodline sets, AV fistula needles and hemodialysis catheters for dialysis centres and renal wards in the Philippines. Request a quote.',
  },
  'patient-monitoring': {
    title: 'Patient Monitor Supplier Philippines | Bishnoi Omniverse',
    h1: 'Patient Monitoring Equipment for Wards and ICU',
    description:
      'Patient monitors, pulse oximeters, ECG and blood pressure monitors for wards, theatres and ICUs in the Philippines. Request a quote today.',
  },
  'respiratory-care': {
    title: 'Oxygen Concentrators & Respiratory Care | Bishnoi Omniverse',
    h1: 'Respiratory Care Equipment and Oxygen Supplies',
    description:
      'Wholesale oxygen concentrators, cylinders, CPAP and BiPAP machines, nebulizers and oxygen masks for hospitals in the Philippines. Request a quote.',
  },
  'surgical-equipment': {
    title: 'Surgical Instruments Supplier Philippines | Bishnoi Omniverse',
    h1: 'Surgical Instruments and Operating Room Equipment',
    description:
      'Surgical scissors, forceps, retractors, electrosurgical units, operating tables and surgical lights for Philippine hospitals. Request a quote.',
  },
  'infection-control-and-sterilization': {
    title: 'Sterilization & Infection Control | Bishnoi Omniverse',
    description:
      'Autoclaves, sterilization pouches, chemical and biological indicators, disinfectants and hand sanitizers for CSSDs and wards. Request a quote.',
  },
  'diagnostic-equipment': {
    title: 'Diagnostic Equipment Supplier | Bishnoi Omniverse',
    description:
      'Stethoscopes, otoscopes, BP monitors, glucose meters and hematology and chemistry analyzers for clinics and laboratories. Request a quote.',
  },
  'patient-care-equipment': {
    title: 'Hospital Beds & Patient Care Equipment | Bishnoi Omniverse',
    description:
      'Electric and manual hospital beds, ICU beds, wheelchairs, stretchers, transfer trolleys and IV stands for hospital wards. Request a quote.',
  },
  'emergency-and-critical-care': {
    title: 'Emergency & Critical Care Equipment | Bishnoi Omniverse',
    description:
      'Defibrillators, AEDs, emergency carts, resuscitation kits, spine boards and infusion pumps for emergency rooms and ICUs. Request a quote.',
  },
  'infusion-and-injection': {
    title: 'Infusion & Injection Supplies | Bishnoi Omniverse',
    description:
      'Infusion pumps, IV sets, IV cannulas, disposable and safety syringes and hypodermic needles in bulk for hospitals and clinics. Request a quote.',
  },
  'laboratory-equipment': {
    title: 'Laboratory Equipment Supplier | Bishnoi Omniverse',
    description:
      'Centrifuges, microscopes, incubators, pipettes, specimen containers and blood bank refrigerators for hospital laboratories. Request a quote.',
  },
  'medical-furniture': {
    title: 'Medical & Hospital Furniture | Bishnoi Omniverse',
    description:
      'Hospital beds, examination tables, instrument trolleys, medical cabinets, bedside lockers and overbed tables for hospitals and clinics. Get a quote.',
  },
  'wound-care': {
    title: 'Wound Care Supplies Wholesale | Bishnoi Omniverse',
    description:
      'Gauze, foam, hydrocolloid and alginate dressings, bandages and wound care kits in bulk for hospitals and clinics. Request a quote today.',
  },
  'medical-consumables': {
    title: 'Medical Consumables in Bulk | Bishnoi Omniverse',
    description:
      'Everyday medical consumables in bulk: cotton, gauze, medical tape, alcohol swabs, underpads, bedpans and urinals for hospitals. Request a quote.',
  },
  urology: {
    title: 'Urology Supplies & Foley Catheters | Bishnoi Omniverse',
    description:
      'Foley, Nelaton and intermittent catheters, urine bags, leg bags and drainage sets for hospitals and clinics. Request a quote today.',
  },
  gastroenterology: {
    title: 'Endoscopy & Gastroenterology Equipment | Bishnoi Omniverse',
    description:
      'Gastroscopes, colonoscopes, biopsy forceps, endoscopic snares and clips and cleaning brushes for endoscopy units. Request a quote today.',
  },
  'obstetrics-and-gynecology': {
    title: 'OB-GYN Equipment & Delivery Supplies | Bishnoi Omniverse',
    description:
      'Fetal dopplers and monitors, delivery beds and kits, infant warmers, gynecological tables and colposcopes for delivery rooms. Request a quote.',
  },
  'neonatal-and-pediatric': {
    title: 'NICU & Pediatric Equipment | Bishnoi Omniverse',
    description:
      'Infant incubators and warmers, phototherapy units, neonatal ventilators and monitors and pediatric beds for NICUs and wards. Request a quote.',
  },
  'physiotherapy-and-rehabilitation': {
    title: 'Physiotherapy & Rehabilitation Equipment | Bishnoi Omniverse',
    description:
      'TENS units, ultrasound therapy machines, parallel bars, exercise bikes, walking frames and crutches for therapy centres. Request a quote today.',
  },
  'imaging-equipment': {
    title: 'Medical Imaging Equipment | Bishnoi Omniverse',
    description:
      'Ultrasound machines, digital and portable X-ray systems, C-arms, mammography, CT and MRI systems for radiology departments. Request a quote.',
  },
  'pharmacy-and-medication-storage': {
    title: 'Pharmacy & Vaccine Refrigerators | Bishnoi Omniverse',
    description:
      'Pharmacy and vaccine refrigerators, medication cabinets and trolleys, dispensing cabinets and tablet counters for hospital pharmacies. Get a quote.',
  },
  'dental-equipment': {
    title: 'Dental Equipment & Instruments | Bishnoi Omniverse',
    description:
      'Dental chairs and units, dental X-ray machines, autoclaves, suction systems and dental instruments for dental clinics. Request a quote today.',
  },
  'medical-waste-management': {
    title: 'Medical Waste Management Supplies | Bishnoi Omniverse',
    description:
      'Sharps containers, biohazard bins, clinical waste bags, waste trolleys and needle destroyers for safe clinical waste handling. Request a quote.',
  },
  'homecare-and-mobility': {
    title: 'Homecare & Mobility Equipment | Bishnoi Omniverse',
    description:
      'Home oxygen concentrators, nebulizers, BP and glucose monitors, wheelchairs, walkers, rollators and crutches for patients at home. Get a quote.',
  },
};

export function categorySeo(category: { id: string; name: string }): Required<CategorySeo> {
  const seo = CATEGORY_SEO[category.id];
  return {
    title: seo?.title ?? `${category.name} | Medical Equipment | Bishnoi Omniverse`,
    h1: seo?.h1 ?? category.name,
    description:
      seo?.description ??
      `${category.name} for hospitals and clinics, supplied in bulk and delivered across the Philippines. Browse the range and request a quote.`,
  };
}

const MAX_DESCRIPTION = 155;

/** "Sterile, single-use" and the like, from the catalog's sterility and reuse columns. */
function productTraits(product: { sterility?: string; reuse?: string }): string {
  const traits: string[] = [];
  if (product.sterility?.startsWith('Sterile')) traits.push('Sterile');
  if (product.reuse?.startsWith('Disposable')) traits.push('single-use');
  if (!traits.length) return '';
  const phrase = traits.join(', ');
  return phrase[0].toUpperCase() + phrase.slice(1);
}

/**
 * A product page's search-engine description, under 155 characters so the call to action is never
 * cut off: "Bulk <product> for hospitals & clinics. <traits>. Delivered across the Philippines. Request
 * a quote." Parts are dropped, longest-sentence first, until it fits. The full product description
 * stays on the page itself.
 */
export function productDescription(product: { name: string; sterility?: string; reuse?: string }): string {
  const traits = productTraits(product);
  const candidates = [
    `Bulk ${product.name} for hospitals & clinics.${traits ? ` ${traits}.` : ''} Delivered across the Philippines. Request a quote today.`,
    `Bulk ${product.name} for hospitals & clinics.${traits ? ` ${traits}.` : ''} Delivered across the Philippines. Request a quote.`,
    `Bulk ${product.name} for hospitals & clinics. Delivered across the Philippines. Request a quote.`,
    `${product.name} for hospitals & clinics in the Philippines. Request a quote.`,
  ];
  return candidates.find((c) => c.length <= MAX_DESCRIPTION) ?? `${product.name.slice(0, MAX_DESCRIPTION - 18)}… Request a quote.`;
}

/** A product page's title: "<product> Supplier Philippines | Bishnoi Omniverse" when it fits in 60. */
export function productTitle(product: { name: string }): string {
  const long = `${product.name} Supplier Philippines | Bishnoi Omniverse`;
  return long.length <= 60 ? long : `${product.name} | Bishnoi Omniverse`;
}
