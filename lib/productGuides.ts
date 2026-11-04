/**
 * Hand-written buying guides for the product pages that target a search keyword. A product with
 * a guide gets its own title, meta description and H1, the guide's copy and FAQ under the product
 * details (with FAQPage structured data), and links to related categories. Every other product
 * page is unchanged and keeps its generated title and description (lib/categorySeo.ts).
 *
 * Rules for the copy: factual, written for Philippine hospitals and laboratories, no brands,
 * prices or certifications that have not been checked. A claim that still needs checking can be
 * marked "[CONFIRM: …]": the marker is highlighted on the page and scripts/check-seo.mjs fails the
 * deploy while any remain, so an unchecked claim is never published.
 *
 *   title        under 60 characters, main keyword first, brand last
 *   description  under 155 characters, ending in a call to action
 *   heading      the page's one H1, containing the keyword
 */

import { GUIDES_GROUP_1 } from '@/lib/guides/group1';
import { GUIDES_GROUP_2 } from '@/lib/guides/group2';

export type GuideSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: string[];
};

export type ProductGuide = {
  keyword: string;
  title: string;
  description: string;
  heading: string;
  intro: string[];
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  /** Category ids linked under the guide. */
  relatedCategoryIds: string[];
  /** Product ids linked under the guide. */
  relatedProductIds?: string[];
};

export const PRODUCT_GUIDES: Record<string, ProductGuide> = {
  microscopes: {
    keyword: 'microscope supplier philippines',
    title: 'Microscope Supplier Philippines | Bishnoi Omniverse',
    description:
      'Microscope supplier for Philippine hospitals and clinical labs: binocular and trinocular compound microscopes, sourced and documented. Request a quote.',
    heading: 'Microscope Supplier in the Philippines for Hospital Laboratories',
    intro: [
      'Bishnoi Omniverse supplies laboratory microscopes to hospitals, clinical laboratories, blood banks and diagnostic clinics in the Philippines. We source through our hubs in India and the Philippines, and one team handles your quotation, the product documents and delivery, so your laboratory has a single contact from the first request to the day the microscopes arrive.',
      'Microscopy is still the daily workhorse of a hospital laboratory. Peripheral blood smears, urinalysis, fecalysis, Gram stains and many other routine tests depend on a microscope that gives a sharp, evenly lit image hour after hour. Choosing the right configuration, and keeping it in good condition in a tropical climate, matters as much as the purchase price.',
    ],
    sections: [
      {
        heading: 'Microscopes we supply',
        bullets: [
          'Compound brightfield microscopes with binocular heads, for routine hematology, urinalysis, fecalysis and stained smears.',
          'Trinocular microscopes, with a third port for a microscope camera, for teaching, second opinions and keeping image records.',
          'Objective sets of 4×, 10×, 40× and 100× oil immersion. With 10× eyepieces these give a total magnification of 40× to 1,000×.',
          'LED illumination, mechanical stages and condenser options, which vary by model.',
        ],
        paragraphs: [
          'Microscope slides and cover slips are part of the same laboratory range, so a laboratory can put its microscopes and the consumables it reads on them on one quotation.',
        ],
      },
      {
        heading: 'Choosing a microscope for a Philippine hospital laboratory',
        paragraphs: [
          'Start with the workload. A laboratory reading many blood films and urine sediments every shift needs a comfortable binocular head with adjustable eye distance, coaxial focus controls and a stage that is easy to move with one hand. A small clinic laboratory may need only one or two units, but the same optical basics apply.',
          'Look at the objectives. Plan achromatic objectives keep the whole field of view in focus at once, which saves refocusing when scanning a slide. The 100× oil immersion objective is the one used for blood cell morphology, malaria parasites and bacteria in Gram stains, so it is worth checking its quality closely.',
          'Think about the people using it. Where several technologists share a microscope across shifts, adjustable eye distance, a focusing adjustment on each eyepiece, a low stage and controls within easy reach reduce neck and eye strain over long reading sessions.',
          'Choose the illumination. LED lighting runs cooler, lasts much longer than halogen bulbs and uses less power, which means fewer replacement bulbs to keep in stock.',
          'Check the power supply. Mains electricity in the Philippines is 220 V at 60 Hz. Confirm that the microscope and any camera run on it and come with a suitable plug, and use a voltage regulator or UPS where the supply is unstable.',
          'Plan for the climate. Heat and humidity let fungus grow on lenses and prisms, which slowly fogs the image. Keep microscopes in an air-conditioned room, cover them when not in use, store spare objectives with desiccant, and clean the optics on a regular schedule.',
        ],
      },
      {
        heading: 'Regulation and documents',
        paragraphs: [
          'Medical devices in the Philippines are regulated by the Food and Drug Administration through its Center for Device Regulation, Radiation Health, and Research (CDRRHR). Whether a particular microscope model needs a notification or registration depends on how it is classified, so check the current requirement for the model you choose and ask for its regulatory documents with the quotation.',
          'Clinical laboratories are licensed by the Department of Health according to their category and the services they offer. Tell us your laboratory category and the tests you run, and we will match the quotation to the equipment you need.',
          'Product documentation is available on request, so your procurement and licensing files can be completed before the microscopes arrive.',
        ],
      },
      {
        heading: 'How ordering works',
        steps: [
          'Send your requirements: the number of units, binocular or trinocular, the objectives you need, your laboratory category and the delivery address.',
          'We reply with a line-by-line quotation for the configuration you asked for, with product details, lead times and the documents for each item.',
          'Once the order is confirmed, we arrange the documents and delivery to your hospital or laboratory, in Metro Manila or the provinces.',
          'Ask about warranty, installation and user training when you request the quotation, so that what is included is written into it.',
        ],
      },
    ],
    faq: [
      {
        q: 'What magnification does a hospital laboratory microscope need?',
        a: 'Most clinical work is covered by 4×, 10×, 40× and 100× oil immersion objectives with 10× eyepieces, giving 40× to 1,000× total magnification. The 100× oil objective is needed for blood cell morphology, malaria parasites and bacteria in Gram-stained smears.',
      },
      {
        q: 'Should we buy a binocular or a trinocular microscope?',
        a: 'A binocular microscope is enough for routine reading. Choose a trinocular model if you want to attach a camera to show images to colleagues, teach students, ask for a second opinion or keep image records.',
      },
      {
        q: 'Do you deliver microscopes outside Metro Manila?',
        a: 'Yes. We deliver to hospitals and laboratories across the Philippines. Lead times depend on the model and the quantity ordered, and are stated in the quotation.',
      },
      {
        q: 'Are your microscopes registered with FDA Philippines?',
        a: 'Requirements depend on how each model is classified. Ask for the regulatory documents of the exact model when you request a quote, and we will send them with the quotation.',
      },
      {
        q: 'How do we keep a microscope in good condition in a humid climate?',
        a: 'Keep it in an air-conditioned room under a dust cover, store spare objectives and eyepieces with desiccant, clean the lenses with lens paper and a suitable cleaning solution, and wipe oil off the 100× objective after every use. Have the microscope serviced on a regular schedule.',
      },
    ],
    relatedCategoryIds: ['laboratory-equipment', 'diagnostic-equipment', 'infection-control-and-sterilization'],
    relatedProductIds: ['microscope-slides', 'cover-slips'],
  },
};

/** Every guide: the one above plus the ones kept in lib/guides/ to keep this file readable. */
const ALL_GUIDES: Record<string, ProductGuide> = {
  ...PRODUCT_GUIDES,
  ...GUIDES_GROUP_1,
  ...GUIDES_GROUP_2,
};

export function productGuide(productId: string): ProductGuide | undefined {
  return ALL_GUIDES[productId];
}

export function allProductGuides(): Record<string, ProductGuide> {
  return ALL_GUIDES;
}
