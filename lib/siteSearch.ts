import catalogData from '@/lib/data/catalogData.json';

/**
 * Site search, ported from the Getmeds navbar search (lib/search.php) to run in the browser: this
 * site is a static export with no server, so the index is built from the same JSON the pages use.
 *
 * Every typed word must appear in a record (words are ANDed). A match in the title counts most,
 * then the subtitle, then the body, and an exact title match wins its own search. Groups are
 * ordered by their best score, so the strongest answer comes first.
 */

export const SEARCH_MIN_CHARS = 2;

export interface SearchHit {
  score: number;
  title: string;
  summary: string;
  meta: string;
  href: string;
}

export interface SearchGroup {
  key: string;
  label: string;
  items: SearchHit[];
  total: number;
  top: number;
}

export interface SearchResults {
  query: string;
  terms: string[];
  groups: SearchGroup[];
  total: number;
}

interface PageEntry {
  title: string;
  href: string;
  summary: string;
  /** Words people type that are not in the title. */
  keywords: string;
}

/** Hand-written index of the site's own pages. */
const PAGE_INDEX: PageEntry[] = [
  {
    title: 'Home',
    href: '/',
    summary:
      'Bishnoi Omniverse sources and supplies medical equipment and specialty medicines to hospitals, clinics and distributors worldwide.',
    keywords: 'home bishnoi omniverse medical supply hospital equipment medicines global',
  },
  {
    title: 'Medical Equipment',
    href: '/catalog',
    summary: 'Browse the full medical equipment catalog by category, from gloves and PPE to dialysis equipment.',
    keywords: 'catalog catalogue products equipment browse categories list range',
  },
  {
    title: 'About Us',
    href: '/about',
    summary: 'Our story, the people behind it, and the standards we hold every shipment to.',
    keywords: 'about company who we are story history mission',
  },
  {
    title: 'Leadership',
    href: '/about/leadership',
    summary: 'The team that leads Bishnoi Omniverse.',
    keywords: 'leadership team founder management directors people naresh bishnoi',
  },
  {
    title: 'Vision & Values',
    href: '/about/vision-values',
    summary: 'What Bishnoi Omniverse is working towards, and the values behind it.',
    keywords: 'vision values mission purpose principles',
  },
  {
    title: 'Quality & Compliance',
    href: '/quality',
    summary: 'How we document quality and compliance, with certification references published per product.',
    keywords: 'quality compliance certification certificate ce who gmp iso standards documentation regulatory',
  },
  {
    title: 'Governance & Standards',
    href: '/about/governance',
    summary: 'Group governance and the commitments we report against, including the UN Global Compact.',
    keywords: 'governance standards ungc un global compact ethics policy esg sustainability',
  },
  {
    title: 'Businesses',
    href: '/global',
    summary: 'The group structure and the businesses that make up Bishnoi Omniverse.',
    keywords: 'businesses group structure entities companies who we serve',
  },
  {
    title: 'Global Network',
    href: '/global-network',
    summary: "Bishnoi Omniverse's footprint across the world, with our India and Philippines hubs and regional sites.",
    keywords: 'global network countries india philippines hubs offices locations worldwide',
  },
  {
    title: 'Trade & Partners',
    href: '/trade-partners',
    summary: 'How distributors, hospitals and trade partners work with Bishnoi Omniverse.',
    keywords: 'trade partners partner distributor wholesale b2b bulk supply partnership tender',
  },
  {
    title: 'LLP (India)',
    href: '/llp',
    summary:
      'Bishnoi Omniverse LLP, our global sourcing hub in India, delivering fast, affordable access to high-quality medicines.',
    keywords: 'llp india sourcing hub pharmaceutical',
  },
  {
    title: 'CORP (Philippines)',
    href: '/corp',
    summary:
      'Bishnoi Omniverse Corp, our Asia-Pacific logistics hub in the Philippines, bridging Southeast Asia with our global network.',
    keywords: 'corp philippines logistics asia pacific southeast asia manila',
  },
  {
    title: 'Frequently Asked Questions',
    href: '/faq',
    summary: 'Answers to common procurement and access questions, from quotes and documentation to named-patient supply.',
    keywords: 'faq faqs questions answers help support',
  },
  {
    title: 'Contact Us',
    href: '/contact',
    summary: 'Get in touch, request a quote or send a hospital supply enquiry.',
    keywords: 'contact email phone address enquiry inquiry get in touch reach us support office',
  },
  {
    title: 'Request a Quote',
    href: '/contact?type=quote',
    summary: 'Request a costed quote for equipment or medicines. We respond within 24 hours.',
    keywords: 'quote rfq pricing price cost request requisition order',
  },
];

/** Lowercase, strip accents, and fold punctuation to single spaces. */
export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Split a query into terms. Drops 1-character words unless that is all there is. */
export function searchTerms(query: string): string[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];
  const words = normalized.split(' ');
  const longer = words.filter((word) => word.length > 1);
  return Array.from(new Set(longer.length > 0 ? longer : words));
}

interface IndexRecord {
  title: string;
  summary: string;
  meta: string;
  href: string;
  // Pre-normalized once, so each keystroke only scores.
  n: { title: string; subtitle: string; body: string };
}

function record(
  fields: { title: string; subtitle?: string; body?: string },
  display: Omit<IndexRecord, 'n' | 'title'>
): IndexRecord {
  return {
    title: fields.title,
    ...display,
    n: {
      title: normalizeSearchText(fields.title),
      subtitle: normalizeSearchText(fields.subtitle ?? ''),
      body: normalizeSearchText(fields.body ?? ''),
    },
  };
}

type SourceKey = 'products' | 'categories' | 'pages';

const SOURCE_LABELS: Record<SourceKey, string> = {
  products: 'Products',
  categories: 'Categories',
  pages: 'Pages',
};

let index: Record<SourceKey, IndexRecord[]> | null = null;

function getIndex(): Record<SourceKey, IndexRecord[]> {
  if (index) return index;

  const categoryName = new Map(catalogData.categories.map((c) => [c.id, c.name]));
  const subcategoryName = new Map(catalogData.subcategories.map((s) => [s.id, s.name]));
  const productCount = new Map<string, number>();
  for (const product of catalogData.products) {
    productCount.set(product.categoryId, (productCount.get(product.categoryId) ?? 0) + 1);
  }

  index = {
    products: catalogData.products.map((product) => {
      const category = categoryName.get(product.categoryId) ?? '';
      const subcategory = subcategoryName.get(product.subcategoryId) ?? '';
      return record(
        {
          title: product.name,
          subtitle: `${category} ${subcategory}`,
          body: `${product.description} ${product.useSetting} ${product.endUser}`,
        },
        {
          summary: [category, subcategory].filter(Boolean).join(' · '),
          meta: product.sterility,
          href: `/catalog/${product.id}`,
        }
      );
    }),
    categories: catalogData.categories.map((category) => {
      const count = productCount.get(category.id) ?? 0;
      return record(
        { title: category.name, subtitle: category.description },
        {
          summary: category.description,
          meta: `${count} product${count === 1 ? '' : 's'}`,
          href: `/catalog?category=${category.id}`,
        }
      );
    }),
    pages: PAGE_INDEX.map((page) =>
      record(
        { title: page.title, subtitle: page.keywords, body: page.summary },
        { summary: page.summary, meta: '', href: page.href }
      )
    ),
  };
  return index;
}

/** Score a record; 0 means it is not a match. Every term must appear somewhere. */
function scoreRecord(n: IndexRecord['n'], terms: string[]): number {
  if (!n.title && !n.subtitle && !n.body) return 0;

  // Terms are normalized to [a-z0-9], so they are safe to drop into a pattern unescaped.
  let score = 0;
  for (const term of terms) {
    let termScore = 0;
    if (n.title.includes(term)) {
      if (new RegExp(`(?:^| )${term}(?:$| )`).test(n.title)) termScore = 30; // whole word in title
      else if (new RegExp(`(?:^| )${term}`).test(n.title)) termScore = 20; // starts a word in title
      else termScore = 12; // somewhere in title
    } else if (n.subtitle.includes(term)) {
      termScore = new RegExp(`(?:^| )${term}(?:$| )`).test(n.subtitle) ? 8 : 5;
    } else if (n.body.includes(term)) {
      termScore = 2;
    }
    if (termScore === 0) return 0; // a missing term disqualifies
    score += termScore;
  }

  // Whole-query bonuses, so the exact thing wins its own search.
  const phrase = terms.join(' ');
  if (n.title === phrase) score += 200;
  else if (n.title.startsWith(phrase)) score += 60;
  else if (n.title.includes(phrase)) score += 25;

  return score;
}

/** Search every source, grouped, with groups ordered by their best score. `perGroup` 0 = all. */
export function searchSite(query: string, perGroup = 6): SearchResults {
  const trimmed = query.trim().slice(0, 100);
  const terms = searchTerms(trimmed);
  if (terms.length === 0) return { query: trimmed, terms: [], groups: [], total: 0 };

  const sources = getIndex();
  const groups: SearchGroup[] = [];
  let total = 0;

  for (const key of Object.keys(sources) as SourceKey[]) {
    const hits: SearchHit[] = [];
    for (const item of sources[key]) {
      const score = scoreRecord(item.n, terms);
      if (score > 0) {
        hits.push({ score, title: item.title, summary: item.summary, meta: item.meta, href: item.href });
      }
    }
    if (hits.length === 0) continue;

    // Score descending, then title A–Z for stable ties.
    hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
    groups.push({
      key,
      label: SOURCE_LABELS[key],
      items: perGroup > 0 ? hits.slice(0, perGroup) : hits,
      total: hits.length,
      top: hits[0].score,
    });
    total += hits.length;
  }

  groups.sort((a, b) => b.top - a.top);
  return { query: trimmed, terms, groups, total };
}

const ABBREVIATION =
  /(?:^|[\s("“])(?:[A-Z]|Inc|Ltd|Corp|Co|Dept|Est|Dr|Prof|Mr|Mrs|Ms|Jr|Sr|St|No|Vol|Fig|approx|etc|vs|al|e\.g|i\.e)$/;

/** Shorten text to whole sentences, falling back to a word boundary and "…". */
export function trimToSentence(text: string, limit: number, hardLimit = Math.round(limit * 1.6)): string {
  const clean = text.trim();
  if (!clean || clean.length <= limit) return clean;

  let best = 0;
  const sentenceEnd = /[.!?](?=[\s"'”’]|$)/g;
  let hit: RegExpExecArray | null;
  while ((hit = sentenceEnd.exec(clean)) !== null) {
    if (hit[0] === '.' && ABBREVIATION.test(clean.slice(0, hit.index))) continue;
    const end = hit.index + 1;
    if (end <= limit) {
      best = end;
      continue;
    }
    if (best === 0 && end <= hardLimit) best = end;
    break;
  }
  if (best > 0) return clean.slice(0, best).trim();

  let slice = clean.slice(0, limit);
  const lastSpace = slice.lastIndexOf(' ');
  if (lastSpace > 0) slice = slice.slice(0, lastSpace);
  return `${slice.replace(/[\s,;:—–-]+$/, '')}…`;
}
