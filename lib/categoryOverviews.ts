/**
 * The overview shown under each category page's heading, and used as that page's search-engine
 * description. Written by hand: the sheet has no category blurb, and the one the sync generates
 * is only the list of subcategory names.
 *
 * Each one names what the category is for, then the products people actually search for, in the
 * words they search with. Keep them to product types: no brand, certification or performance
 * claims, for the same reason the catalog's reference notes exist (see docs/catalog-sheet.md).
 *
 * Keys are the category slugs generated from the sheet's Category column (see
 * scripts/sync-catalog.mjs). A renamed or new category has no entry here and falls back to the
 * generated description until one is added.
 */
const CATEGORY_OVERVIEWS: Record<string, string> = {
  'dialysis-equipment':
    'Source dialysis equipment and consumables for hemodialysis units and renal wards. Find dialyzers, bloodline sets, AV fistula needles, hemodialysis catheters, bicarbonate cartridges, IV cannulas, central venous catheters, blood bags, sutures and surgical staplers.',
  gloves:
    'Order medical gloves in bulk for hospitals and clinics. Choose nitrile, latex or vinyl examination gloves, sterile surgical gloves, powder-free gloves, disposable PE gloves, chemotherapy gloves and radiation protection gloves.',
  'personal-protective-equipment-ppe':
    'Stock up on PPE for clinical and infection-control teams. Find isolation gowns, surgical gowns, coveralls, surgical masks, 3-ply masks, N95 and KN95 respirators, face shields, bouffant caps and shoe covers.',
  'infection-control-and-sterilization':
    'Equip your CSSD and wards for sterilization and disinfection. Find autoclaves, steam and plasma sterilizers, sterilization pouches and wraps, chemical and biological indicators, surface disinfectants, hand sanitizers and alcohol preparations.',
  'patient-monitoring':
    'Find patient monitoring equipment for wards, theatres and ICU. Browse patient monitors, pulse oximeters, blood pressure monitors, ECG monitors, capnography monitors, fetal monitors, digital and infrared thermometers, and central monitoring systems.',
  'diagnostic-equipment':
    'Source diagnostic equipment for consultation rooms and laboratories. Find stethoscopes, otoscopes, ophthalmoscopes, sphygmomanometers, digital BP monitors, blood glucose meters, and hemoglobin, urine, hematology and chemistry analyzers.',
  'respiratory-care':
    'Get respiratory care equipment for acute and long-term care. Find oxygen concentrators, oxygen cylinders and regulators, CPAP and BiPAP machines, ventilators, nebulizers, suction machines, oxygen masks, nasal cannulas, endotracheal tubes and Ambu bags.',
  'surgical-equipment':
    'Equip your operating room with surgical instruments and theatre equipment. Find surgical scissors, forceps, needle holders, retractors, scalpel handles and blades, electrosurgical units, operating tables, surgical lights and suction units.',
  'patient-care-equipment':
    'Furnish wards with patient care equipment. Find electric and manual hospital beds, ICU beds, bariatric and pediatric beds, wheelchairs, stretchers, patient transfer trolleys, commode chairs, overbed tables, bedside lockers and IV stands.',
  'emergency-and-critical-care':
    'Prepare emergency rooms and ICUs with critical care equipment. Find defibrillators, AEDs, emergency carts, resuscitation kits, spine boards, cervical collars, splints, trauma kits, infusion pumps, syringe pumps, ventilators and suction machines.',
  'infusion-and-injection':
    'Order infusion and injection supplies for IV therapy. Find infusion pumps, syringe pumps, IV administration sets, IV cannulas and catheters, IV fluids, disposable syringes, insulin syringes, safety syringes and hypodermic needles.',
  'laboratory-equipment':
    'Set up your laboratory and blood bank. Find centrifuges, microscopes, incubators, water baths, analytical balances, test tubes, pipettes, petri dishes, specimen containers, blood bank refrigerators and plasma freezers.',
  'medical-furniture':
    'Furnish hospitals and clinics with medical furniture. Find hospital beds, examination tables, treatment couches, instrument and dressing trolleys, medical cabinets, bedside lockers, overbed tables, IV poles and doctor’s stools.',
  'wound-care':
    'Stock wound care supplies for dressing and bandaging. Find gauze and gauze swabs, foam, hydrocolloid and alginate dressings, adhesive dressings, elastic, crepe and compression bandages, plaster bandages, dressing sets and wound care kits.',
  'medical-consumables':
    'Order everyday medical consumables in bulk. Find cotton balls and rolls, gauze, medical tape, alcohol swabs, tongue depressors, applicators, disposable underpads, kidney dishes, bedpans and urinals.',
  urology:
    'Source urology supplies for catheterization and urine collection. Find Foley catheters, Nelaton and intermittent catheters, suprapubic catheters, urine bags, leg bags, urine drainage sets and collection containers.',
  gastroenterology:
    'Equip your endoscopy unit with GI equipment and accessories. Find endoscopes, gastroscopes, colonoscopes, duodenoscopes, biopsy forceps, endoscopic snares and clips, irrigation tubes and endoscope cleaning brushes.',
  'obstetrics-and-gynecology':
    'Find OB-GYN equipment for delivery rooms and women’s health clinics. Browse fetal dopplers, fetal monitors, delivery beds, delivery kits, infant warmers, gynecological examination tables, vaginal speculums and colposcopes.',
  'neonatal-and-pediatric':
    'Equip your NICU and pediatric ward. Find infant incubators, infant warmers, phototherapy units, neonatal ventilators and monitors, pediatric hospital beds, pediatric pulse oximeters, BP monitors, nebulizers and scales.',
  'physiotherapy-and-rehabilitation':
    'Source physiotherapy and rehabilitation equipment for therapy centers. Find TENS units, ultrasound therapy machines, electrical stimulation units, infrared lamps, parallel bars, exercise bikes, walking frames, crutches and canes.',
  'imaging-equipment':
    'Find medical imaging equipment for radiology departments. Browse ultrasound machines, portable ultrasound systems and probes, digital and portable X-ray systems, C-arms, mammography systems, CT scanners and MRI systems.',
  'pharmacy-and-medication-storage':
    'Equip your pharmacy for storing and dispensing medicines. Find pharmacy and vaccine refrigerators, medical refrigerators, medication cabinets and trolleys, automated dispensing cabinets, tablet counters and pill crushers.',
  'dental-equipment':
    'Set up your dental clinic with equipment and instruments. Find dental chairs, dental units, dental X-ray machines, dental autoclaves, suction systems, dental mirrors, probes, scalers, forceps and extraction instruments.',
  'medical-waste-management':
    'Manage clinical waste from the point of use to disposal. Find sharps containers, biohazard waste bins, clinical waste bags, pharmaceutical waste containers, waste segregation bins, waste trolleys and needle destroyers.',
  'homecare-and-mobility':
    'Find homecare and mobility equipment for patients at home. Browse home oxygen concentrators, nebulizers, home BP and glucose monitors, manual and electric wheelchairs, walkers, rollators, crutches and walking canes.',
};

export function getCategoryOverview(category: { id: string; description: string }): string {
  return CATEGORY_OVERVIEWS[category.id] ?? category.description;
}
