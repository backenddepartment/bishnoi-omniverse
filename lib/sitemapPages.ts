import type { MetadataRoute } from 'next';
import catalogData from '@/lib/data/catalogData.json';
import { PRODUCT_GALLERIES } from '@/lib/productImageOverrides';

import homeHeroImg from '@/app/assets/background.png';
import homeSlideTwoImg from '@/app/assets/slidertwo.png';
import homeSlideThreeImg from '@/app/assets/sliderthree.png';
import hospitalCardImg from '@/app/assets/hospitalcard.png';
import clinicsCardImg from '@/app/assets/clinicscard.png';
import distributorsCardImg from '@/app/assets/distributorscard.png';
import familiesCardImg from '@/app/assets/familiescard.png';
import glovesImg from '@/app/assets/gloves.png';
import ppeSuitImg from '@/app/assets/ppesuit.jpg';
import dialysisImg from '@/app/assets/dialysis.jpg';
import patientMonitoringImg from '@/app/assets/patientmonitoring.png';
import respiratoryCareImg from '@/app/assets/respiratorycare.png';
import surgicalImg from '@/app/assets/surgical.png';
import catalogHeroImg from '@/app/assets/medicinebgpage.png';
import articlesHeroImg from '@/app/assets/article.png';
import qualityHeroImg from '@/app/assets/quality.png';
import suppliesImg from '@/app/assets/supplies.jpg';
import medicinesImg from '@/app/assets/medicines.jpg';
import doctorsImg from '@/app/assets/doctors.jpg';
import hospitalsImg from '@/app/assets/hospitals.png';
import groupHeroImg from '@/app/assets/groupstructure.png';
import groupRoleImg from '@/app/assets/omniverseabout.png';
import networkHeroImg from '@/app/assets/globalnetworkbg.png';
import networkMapImg from '@/app/assets/metromanila.png';
import networkFlowImg from '@/app/assets/flow.png';
import networkCtaImg from '@/app/assets/ctabannertwo.jpg';
import tradeHeroImg from '@/app/assets/tradeandpartners.png';
import tradeRouteImg from '@/app/assets/mapconnection.png';
import tradeRelationshipImg from '@/app/assets/omniverserelationship-cutout.webp';
import teamImg from '@/app/assets/team.jpg';
import aboutHeroImg from '@/app/assets/aboutusherobg.png';
import cphiImg from '@/app/assets/cphi.jpeg';
import howWeWorkImg from '@/app/assets/howwework.jpg';
import familiesImg from '@/app/assets/families.jpg';
import leadershipHeroImg from '@/app/assets/Leadership.png';
import founderImg from '@/app/assets/CEO.png';
import sameenImg from '@/app/assets/sirsameen.png';
import sumitImg from '@/app/assets/sirsumit.png';
import chiImg from '@/app/assets/maamchi.png';
import debbieImg from '@/app/assets/maamdebbie.png';
import experienceImg from '@/app/assets/backgroundsection.png';
import visionHeroImg from '@/app/assets/qualityandcompliance.png';
import contactHeroImg from '@/app/assets/contact.png';

/**
 * One list of the site's public pages, shared by the three sitemaps: sitemap.xml (URLs),
 * sitemap-images.xml (images per page) and the human-readable /sitemap page. Add a page here and
 * all three pick it up.
 *
 * Priority tiers:
 *   1.0  main pages — the top-level navigation (Home, Medical Equipment, Articles, LLP)
 *   0.8  secondary pages — supporting sections and every product page
 *   0.5  static pages — About Us and its sub-pages, Contact Us and FAQ
 *
 * Left out on purpose: /search (results page, marked noindex) and /coming-soon/* (placeholders,
 * also noindex). Both are disallowed in robots.txt as well.
 */

/** Public site address, without a trailing slash. Set NEXT_PUBLIC_SITE_URL for the live domain. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bishnoi.ai').replace(/\/+$/, '');

const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '');

/** Absolute URL for a site path, e.g. `/about/` → `https://bishnoi.ai/about/`. */
export function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}

/**
 * Absolute URL for a static image import's `.src`. On a sub-path build (GitHub Pages) `.src`
 * already carries the base path, which SITE_URL is expected to include, so strip it once.
 */
function imageUrl(src: string) {
  if (/^https?:\/\//.test(src)) return src;
  const path = BASE_PATH && src.startsWith(`${BASE_PATH}/`) ? src.slice(BASE_PATH.length) : src;
  return absoluteUrl(path);
}

type Frequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

export type SitemapPage = {
  /** Path with the trailing slash the static export serves (next.config `trailingSlash`). */
  path: string;
  title: string;
  group: 'Main' | 'Company' | 'About Us' | 'Products';
  priority: 1.0 | 0.8 | 0.5;
  changeFrequency: Frequency;
  /** Absolute image URLs shown on the page, for the image sitemap. */
  images: string[];
};

const MAIN = { priority: 1.0, changeFrequency: 'weekly' } as const;
const SECONDARY = { priority: 0.8, changeFrequency: 'monthly' } as const;
const STATIC = { priority: 0.5, changeFrequency: 'yearly' } as const;

const imgs = (...list: { src: string }[]) => list.map((i) => imageUrl(i.src));

const STATIC_PAGES: SitemapPage[] = [
  // Main
  {
    path: '/',
    title: 'Home',
    group: 'Main',
    ...MAIN,
    changeFrequency: 'daily',
    images: imgs(
      homeHeroImg, homeSlideTwoImg, homeSlideThreeImg, hospitalCardImg, clinicsCardImg,
      distributorsCardImg, familiesCardImg, glovesImg, ppeSuitImg, dialysisImg,
      patientMonitoringImg, respiratoryCareImg, surgicalImg,
    ),
  },
  { path: '/catalog/', title: 'Medical Equipment Catalog', group: 'Main', ...MAIN, changeFrequency: 'daily', images: imgs(catalogHeroImg) },
  { path: '/articles/', title: 'Articles', group: 'Main', ...MAIN, images: imgs(articlesHeroImg) },
  { path: '/llp/', title: 'Bishnoi Omniverse LLP', group: 'Main', ...MAIN, images: [] },

  // Secondary
  { path: '/quality/', title: 'Quality & Compliance', group: 'Company', ...SECONDARY, images: imgs(qualityHeroImg, suppliesImg, medicinesImg, respiratoryCareImg, doctorsImg) },
  { path: '/global-network/', title: 'Global Network', group: 'Company', ...SECONDARY, images: imgs(networkHeroImg, networkMapImg, teamImg, networkFlowImg, networkCtaImg) },
  { path: '/global/', title: 'Group Structure', group: 'Company', ...SECONDARY, images: imgs(groupHeroImg, groupRoleImg) },
  { path: '/trade-partners/', title: 'Trade & Partners', group: 'Company', ...SECONDARY, images: imgs(tradeHeroImg, tradeRelationshipImg, tradeRouteImg) },
  { path: '/corp/', title: 'Bishnoi Omniverse Corp', group: 'Company', ...SECONDARY, images: [] },

  // Static
  { path: '/about/', title: 'About Us — Our Story', group: 'About Us', ...STATIC, images: imgs(aboutHeroImg, cphiImg, howWeWorkImg, familiesImg, teamImg) },
  {
    path: '/about/leadership/',
    title: 'Leadership',
    group: 'About Us',
    ...STATIC,
    images: imgs(leadershipHeroImg, founderImg, sameenImg, sumitImg, chiImg, debbieImg, experienceImg),
  },
  { path: '/about/vision-values/', title: 'Vision & Values', group: 'About Us', ...STATIC, images: imgs(visionHeroImg, doctorsImg, suppliesImg, teamImg, familiesImg) },
  { path: '/about/governance/', title: 'Governance & Standards', group: 'About Us', ...STATIC, images: imgs(hospitalsImg) },
  { path: '/contact/', title: 'Contact Us', group: 'About Us', ...STATIC, images: imgs(contactHeroImg) },
  { path: '/faq/', title: 'Frequently Asked Questions', group: 'About Us', ...STATIC, images: [] },
];

// Product pages come from the catalog data (synced from the Google Sheet), so a new product is
// listed without a code change.
const PRODUCT_PAGES: SitemapPage[] = catalogData.products.map((product) => ({
  path: `/catalog/${product.id}/`,
  title: product.name,
  group: 'Products',
  ...SECONDARY,
  images: (PRODUCT_GALLERIES[product.id] ?? []).map((img) => imageUrl(img.src)),
}));

export const SITEMAP_PAGES: SitemapPage[] = [...STATIC_PAGES, ...PRODUCT_PAGES];
