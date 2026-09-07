// Real product photography for the catalog, replacing the icon placeholders.
// Every file is served locally from /public/products (downloaded rather than hotlinked, so the
// pages don't depend on an external host). Sources are Wikimedia Commons; the CC BY / CC BY-SA
// entries require attribution, which is rendered as a caption under the image.

export type ProductImage = {
  src: string;
  alt: string;
  credit: string;
  source: string;
};

export const productImages: Record<string, ProductImage> = {
  'iv-cannula-set': {
    src: '/products/iv-cannula-set.jpg',
    alt: 'An intravenous cannula secured to a patient’s forearm with a transparent dressing',
    credit: 'CC0 via Wikimedia Commons',
    source: 'https://commons.wikimedia.org/wiki/File:Cannula_B.jpg',
  },
  'blood-transfusion-set': {
    src: '/products/blood-transfusion-set.jpg',
    alt: 'A filled blood collection bag held during a donation session',
    credit: 'Bibeyjj · CC BY-SA 4.0 via Wikimedia Commons',
    source: 'https://commons.wikimedia.org/wiki/File:Blood_Donation_Bag.jpg',
  },
  'carboplatin-injection': {
    src: '/products/carboplatin-injection.jpg',
    alt: 'Glass vials and ampoules of injectable chemotherapy preparations',
    credit: 'Bill Branson · Public domain via Wikimedia Commons',
    source: 'https://commons.wikimedia.org/wiki/File:Chemotherapy_vials_(4).jpg',
  },
  'medical-oxygen-cylinder': {
    src: '/products/medical-oxygen-cylinder.png',
    alt: 'A high-pressure seamless steel medical oxygen cylinder with pin-index valve',
    credit: 'Pawar0365 · CC BY-SA 4.0 via Wikimedia Commons',
    source: 'https://commons.wikimedia.org/wiki/File:10ltr_oxygen_cylinder.png',
  },
  'endotracheal-tube-set': {
    src: '/products/endotracheal-tube-set.jpg',
    alt: 'A cuffed endotracheal airway tube with inflation line and pilot balloon',
    credit: 'ICUnurses · CC BY-SA 4.0 via Wikimedia Commons',
    source: 'https://commons.wikimedia.org/wiki/File:Endotracheal_Tube.JPG',
  },
  'patient-monitor': {
    src: '/products/patient-monitor.jpg',
    alt: 'A multi-parameter patient monitor displaying ECG, SpO2 and blood-pressure traces',
    credit: 'James Stenberg · Public domain via Wikimedia Commons',
    source: 'https://commons.wikimedia.org/wiki/File:Vital_signs_monitor_display.jpg',
  },
  'icu-hospital-bed': {
    src: '/products/icu-hospital-bed.jpg',
    alt: 'An electric hospital bed and bedside monitor in a prepared patient room',
    credit: 'Diane A. Reid · Public domain via Wikimedia Commons',
    source: 'https://commons.wikimedia.org/wiki/File:Patient_room_with_hospital_bed.jpg',
  },
  'isolation-gown': {
    src: '/products/isolation-gown.jpg',
    alt: 'A disposable surgical isolation gown with tie fastenings, laid flat',
    credit: 'CC BY 4.0 via Wikimedia Commons',
    source: 'https://commons.wikimedia.org/wiki/File:Gown,_isolation,_939973_001.jpg',
  },
  'portable-ultrasound': {
    src: '/products/portable-ultrasound.jpg',
    alt: 'A sonographer performing a scan with a portable point-of-care ultrasound system',
    credit: 'Goleisureintl · CC BY 4.0 via Wikimedia Commons',
    source: 'https://commons.wikimedia.org/wiki/File:Abdominal_Ultrasound_Imaging_in_Navi_Mumbai.jpg',
  },
  'autoclave-sterilizer': {
    src: '/products/autoclave-sterilizer.jpg',
    alt: 'A benchtop vacuum autoclave sterilizer unit',
    credit: 'SystecAutoclaves · CC BY-SA 4.0 via Wikimedia Commons',
    source: 'https://commons.wikimedia.org/wiki/File:Systec_D-65.jpg',
  },
  'silver-foam-dressing': {
    src: '/products/silver-foam-dressing.jpg',
    alt: 'An adhesive foam wound dressing with an absorbent central pad',
    credit: 'Enter · CC BY-SA 4.0 via Wikimedia Commons',
    source: 'https://commons.wikimedia.org/wiki/File:Schaumverband.JPG',
  },
};
