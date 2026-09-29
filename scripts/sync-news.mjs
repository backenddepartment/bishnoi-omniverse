#!/usr/bin/env node
/**
 * Pulls recent news on medical equipment and healthcare procurement from a news API and writes
 * lib/data/newsData.json, which the Articles page draws its cards from.
 *
 * The site is a static export, so there is no server to call the API when a visitor loads the
 * page — and the API key must never reach the browser. Instead the news is read once per build,
 * the same way the catalog is read from its sheet: the deploy workflow runs this script, then
 * builds. See docs/news-feed.md.
 *
 * Environment variables (none of them NEXT_PUBLIC_, so none of them is ever bundled):
 *   NEWS_API_KEY        the key. Unset, the script is a no-op and the committed JSON is used.
 *   NEWS_API_PROVIDER   newsdata (default) | gnews | newsapi
 *   NEWS_MAX_ITEMS      how many articles to keep (default 45: five pages of nine)
 *   NEWS_LANGUAGE       two-letter language code (default en)
 *   NEWS_IMAGES         "off" leaves the photos out; every card then shows a plain panel instead
 *   NEWS_MAX_AGE_DAYS   articles older than this are dropped (default 30)
 *   NEWS_DEBUG          "1" lists every article that was left out, and why
 *
 * Locally the script also reads .env.local, so `npm run news:sync` works once the key is in it.
 *
 * Photos: every card shows the article's own photo. The script reads the article's page for the
 * photo the outlet itself puts forward when the page is shared (its og:image), which is usually
 * larger and sharper than the thumbnail the API carries, and falls back to that thumbnail. An
 * article with no photo at all is left out.
 *
 * Articles already in the file are kept alongside the new ones until they age out or are pushed
 * off the end, so the page stays full on a quiet day. They pass through the same checks again, so
 * a change to the rules below takes effect on the next run.
 *
 * Safety: the file is only written once at least one usable article has come back. A failed or
 * empty run leaves the file alone and exits 0 — the news is an extra, and must not stop a deploy
 * that also carries catalog and page changes.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_FILE = resolve(ROOT, 'lib/data/newsData.json');

// Local convenience only; in CI the variables come from the workflow. Variables already set in
// the environment win over the file.
const ENV_FILE = resolve(ROOT, '.env.local');
if (existsSync(ENV_FILE) && typeof process.loadEnvFile === 'function') process.loadEnvFile(ENV_FILE);

const KEY = (process.env.NEWS_API_KEY || '').trim();
const PROVIDER = (process.env.NEWS_API_PROVIDER || 'newsdata').trim().toLowerCase();
const MAX_ITEMS = Math.max(3, Math.min(60, Number(process.env.NEWS_MAX_ITEMS) || 45));
const LANGUAGE = (process.env.NEWS_LANGUAGE || 'en').trim().toLowerCase();
const MAX_AGE_DAYS = Math.max(1, Number(process.env.NEWS_MAX_AGE_DAYS) || 30);
const DEBUG = (process.env.NEWS_DEBUG || '').trim() === '1';
const USE_IMAGES = (process.env.NEWS_IMAGES || '').trim().toLowerCase() !== 'off';
// For tests: point the script at a stand-in server instead of the real API.
const BASE_OVERRIDE = (process.env.NEWS_API_BASE || '').replace(/\/+$/, '');

/**
 * What to ask for. Each entry is one request, so one API credit per build. The phrases are kept
 * under 100 characters each, the limit on NewsData.io's free plan.
 */
const QUERIES = [
  '"medical device" OR "medical devices" OR "medical equipment" OR "hospital equipment"',
  '"healthcare procurement" OR "medical supply chain" OR "hospital infrastructure" OR "medtech"',
  '"medical imaging" OR "MRI scanner" OR "CT scanner" OR "surgical robot" OR "dialysis machine"',
  '"hospital tender" OR "medical supplies" OR "device recall" OR "FDA clearance"',
];

/**
 * An article is kept only if its title or summary mentions one of these: the APIs match loosely,
 * and a story that merely mentions a hospital is not news about equipment.
 */
/** Equipment and devices by name: any one of these is enough. */
const RELEVANT = [
  'medical device', 'medical equipment', 'medical supplies', 'medical supply', 'medical technology',
  'medtech', 'med-tech', 'hospital equipment', 'healthcare equipment', 'hospital technology',
  'medical imaging', 'diagnostic imaging', 'mri', 'ct scan', 'ct scanner', 'ultrasound', 'x-ray',
  'ventilator', 'dialysis machine', 'pacemaker', 'defibrillator', 'stent', 'catheter',
  'infusion pump', 'insulin pump', 'patient monitor', 'surgical robot', 'robotic surgery',
  'surgical instrument', 'implantable', 'oxygen concentrator', 'ppe', 'syringe', 'hospital bed',
  'fda clearance', 'fda clears', 'fda cleared', '510(k)', 'ce mark', 'device recall',
];

/** These turn up in every industry, so they count only beside one of the CONTEXT words. */
const RELEVANT_IN_CONTEXT = [
  'procurement', 'tender', 'supply chain', 'shortage', 'recall', 'infrastructure', 'equipment',
  'diagnostic', 'surgical', 'implant', 'wearable', 'logistics',
];
const CONTEXT = [
  'hospital', 'healthcare', 'health care', 'health centre', 'health center', 'medical', 'clinic',
  'clinical', 'patient', 'surgeon', 'surgery', 'nhs', 'health ministry', 'ministry of health',
  'department of health',
];

/**
 * Left out even when on topic: market-research press releases ("… Market Size, Share and
 * Forecast 2034"), which the wire services carry in volume and which are adverts for a report,
 * and articles an outlet marks as sponsored.
 */
const EXCLUDED_TITLE = /\bmarket\b.*\b(size|share|forecast|outlook|report|cagr|analysis|insights?|growth|industry)\b|\bcagr\b/i;
const EXCLUDED_URL = /\/(spons|sponsored)\//i;
/** Medical supplies, but not for hospitals: animal care, cannabis, and the like. */
const EXCLUDED_TEXT = /(?<![a-z])(veterinary|veterinarian|animals?|pets?|livestock|cannabis|marijuana|horoscope|zodiac)(?![a-z])/i;

/** The label on the card, from the first rule whose words appear in the article. */
const CATEGORIES = [
  ['Procurement', ['procurement', 'tender', 'contract award', 'purchasing']],
  ['Supply Chain', ['supply chain', 'shortage', 'logistics', 'tariff']],
  ['Infrastructure', ['infrastructure', 'new hospital', 'hospital construction', 'expansion']],
  ['Regulation', ['fda', 'recall', 'ce mark', '510(k)', 'regulator', 'clearance']],
  ['Hospital Technology', ['imaging', 'mri', 'ct scan', 'ct scanner', 'ultrasound', 'x-ray', 'robot', 'robotic', 'ai', 'software']],
  ['Medical Devices', ['device', 'implant', 'implantable', 'pacemaker', 'catheter', 'stent', 'wearable', 'ventilator']],
];

/**
 * Matches the words as words — "ppe" must not be found in "stopped", nor "mri" in "primrose" —
 * with or without a plural s.
 */
function wordMatcher(words) {
  const escaped = words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+'));
  return new RegExp(`(?<![a-z0-9])(?:${escaped.join('|')})s?(?![a-z0-9])`, 'i');
}
const IS_RELEVANT = wordMatcher(RELEVANT);
const IS_RELEVANT_IN_CONTEXT = wordMatcher(RELEVANT_IN_CONTEXT);
const HAS_CONTEXT = wordMatcher(CONTEXT);
const CATEGORY_RULES = CATEGORIES.map(([label, words]) => [label, wordMatcher(words)]);
const DEFAULT_CATEGORY = 'Medical Equipment';

/* ---------- Providers ---------- */

/**
 * Each provider turns one query into a list of articles in the same shape:
 *   { title, description, url, image, publishedAt, source, sourceIcon }
 */
const PROVIDERS = {
  // https://newsdata.io/documentation — free plan: 200 credits a day, 10 articles a credit.
  newsdata: {
    name: 'NewsData.io',
    async fetch(query) {
      const url = new URL(`${BASE_OVERRIDE || 'https://newsdata.io'}/api/1/latest`);
      url.searchParams.set('apikey', KEY);
      url.searchParams.set('q', query);
      url.searchParams.set('language', LANGUAGE);
      const data = await getJson(url);
      if (data.status !== 'success') throw new Error(apiMessage(data.results) || 'request was not successful');
      return (data.results || [])
        .filter((a) => a.duplicate !== true)
        .map((a) => ({
          title: a.title,
          description: a.description,
          url: a.link,
          image: a.image_url,
          publishedAt: a.pubDate ? `${String(a.pubDate).replace(' ', 'T')}Z` : undefined,
          source: a.source_name || a.source_id,
          sourceIcon: a.source_icon,
        }));
    },
  },

  // https://gnews.io/docs — the free plan is for non-commercial use only.
  gnews: {
    name: 'GNews',
    async fetch(query) {
      const url = new URL(`${BASE_OVERRIDE || 'https://gnews.io'}/api/v4/search`);
      url.searchParams.set('apikey', KEY);
      url.searchParams.set('q', query);
      url.searchParams.set('lang', LANGUAGE);
      url.searchParams.set('max', '10');
      url.searchParams.set('sortby', 'publishedAt');
      const data = await getJson(url);
      if (!Array.isArray(data.articles)) throw new Error(apiMessage(data.errors) || 'no articles in the response');
      return data.articles.map((a) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image: a.image,
        publishedAt: a.publishedAt,
        source: a.source?.name,
      }));
    },
  },

  // https://newsapi.org/docs — the free Developer plan may not be used on a live site.
  newsapi: {
    name: 'NewsAPI.org',
    async fetch(query) {
      const url = new URL(`${BASE_OVERRIDE || 'https://newsapi.org'}/v2/everything`);
      url.searchParams.set('q', query);
      url.searchParams.set('language', LANGUAGE);
      url.searchParams.set('sortBy', 'publishedAt');
      url.searchParams.set('pageSize', '30');
      const data = await getJson(url, { 'X-Api-Key': KEY });
      if (data.status !== 'ok') throw new Error(data.message || 'request was not successful');
      return (data.articles || []).map((a) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image: a.urlToImage,
        publishedAt: a.publishedAt,
        source: a.source?.name,
      }));
    },
  },
};

function apiMessage(detail) {
  if (!detail) return '';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.join('; ');
  return detail.message || Object.values(detail).join('; ');
}

async function getJson(url, headers = {}) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': 'bishnoi-omniverse-news-sync', ...headers },
    signal: AbortSignal.timeout(20_000),
  });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`HTTP ${response.status}, and the reply was not JSON`);
  }
  // The APIs explain a refusal (bad key, quota used up) in the body; pass that on.
  if (!response.ok) {
    const reason = apiMessage(data.results) || apiMessage(data.errors) || data.message || response.statusText;
    throw new Error(`HTTP ${response.status} — ${reason}`);
  }
  return data;
}

/* ---------- Cleaning ---------- */

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' };

/** Plain text: tags and entities out, whitespace collapsed. */
function clean(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match)
    .replace(/\s+/g, ' ')
    // Taking a tag out can leave a space stranded before the punctuation that followed it.
    .replace(/ ([.,;:!?])/g, '$1')
    .trim();
}

/** Cut at a word, with an ellipsis, when the text runs past `max`. */
function shorten(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 40)).replace(/[\s,;:.–—-]+$/, '')}…`;
}

function httpUrl(value, { httpsOnly = false } = {}) {
  if (typeof value !== 'string') return undefined;
  try {
    const url = new URL(value.trim());
    if (url.protocol === 'https:' || (!httpsOnly && url.protocol === 'http:')) return url.href;
  } catch {}
  return undefined;
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');
}

function categoryOf(text) {
  for (const [label, matcher] of CATEGORY_RULES) {
    if (matcher.test(text)) return label;
  }
  return DEFAULT_CATEGORY;
}

/** Why each article was left out, for NEWS_DEBUG. */
const dropped = [];
function drop(title, reason) {
  dropped.push(`${reason}: ${title || '(no title)'}`);
  return null;
}

/** One raw article -> one card, or null when it cannot be used. */
function toItem(raw) {
  const source = clean(raw.source);
  let title = clean(raw.title);
  // Several APIs append the outlet to the headline: "Headline - Outlet".
  if (source && title.toLowerCase().endsWith(` - ${source.toLowerCase()}`)) {
    title = title.slice(0, -source.length - 3).trim();
  }
  const href = httpUrl(raw.url);
  const published = raw.publishedAt ? new Date(raw.publishedAt) : null;
  if (!title || !href || !published || Number.isNaN(published.getTime())) return drop(title, 'incomplete');
  // A removed article comes back from some APIs as a row of this kind.
  if (/^\[removed\]$/i.test(title)) return drop(title, 'removed');
  if (Date.now() - published.getTime() > MAX_AGE_DAYS * 86_400_000) return drop(title, 'too old');

  const host = new URL(href).hostname.replace(/^www\./, '');
  if (EXCLUDED_TITLE.test(title)) return drop(title, 'market report');
  if (EXCLUDED_URL.test(href)) return drop(title, 'sponsored');

  // The summary is checked only as far as the card will show it: a story that reaches medical
  // devices in its tenth paragraph is about something else.
  const description = clean(raw.description);
  const text = `${title}. ${description.slice(0, 300)}`;
  const onTopic = IS_RELEVANT.test(text) || (IS_RELEVANT_IN_CONTEXT.test(text) && HAS_CONTEXT.test(text));
  if (!onTopic) return drop(title, 'off topic');
  if (EXCLUDED_TEXT.test(text)) return drop(title, 'not healthcare for people');

  const category = categoryOf(text);
  return {
    slug: slugify(title) || slugify(href),
    title: shorten(title, 140),
    category,
    date: published.toISOString(),
    excerpt: description && description.toLowerCase() !== title.toLowerCase() ? shorten(description, 240) : undefined,
    image: httpUrl(raw.image, { httpsOnly: true }),
    // Set once the photo has been looked for on the article's own page, so it is not fetched
    // again on every run.
    photoChecked: raw.photoChecked === true,
    source: source || host,
    sourceIcon: httpUrl(raw.sourceIcon, { httpsOnly: true }),
    href,
  };
}

/* ---------- Photos ---------- */

// Says plainly what is asking. A few outlets turn away anything that is not a browser; their
// articles then keep the thumbnail the API gave.
const PAGE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; BishnoiOmniverseNews/1.0; +https://bishnoi.ai)',
  Accept: 'text/html,application/xhtml+xml',
  'Accept-Language': 'en',
};
const PHOTO_TAGS = ['og:image:secure_url', 'og:image', 'og:image:url', 'twitter:image', 'twitter:image:src'];

/** The photo an article's own page puts forward for sharing, or undefined. */
async function findPagePhoto(href) {
  try {
    const response = await fetch(href, { headers: PAGE_HEADERS, redirect: 'follow', signal: AbortSignal.timeout(9_000) });
    if (!response.ok || !(response.headers.get('content-type') || '').includes('html')) return undefined;
    // The tags sit in the page's head; there is no need for the rest.
    const html = (await response.text()).slice(0, 400_000);

    const found = new Map();
    for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
      const name = /\b(?:property|name)\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1]?.toLowerCase();
      const content = /\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(tag);
      if (name && content && PHOTO_TAGS.includes(name) && !found.has(name)) {
        found.set(name, clean(content[1] ?? content[2]));
      }
    }
    for (const name of PHOTO_TAGS) {
      if (!found.get(name)) continue;
      // Pages often give the address relative to themselves, or without the protocol.
      try {
        const photo = httpUrl(new URL(found.get(name), response.url || href).href, { httpsOnly: true });
        if (photo) return photo;
      } catch {}
    }
  } catch {}
  return undefined;
}

/**
 * False only when the photo is known not to be there: the address is gone, or answers with
 * something that is not an image. A refusal or a timeout proves nothing — many outlets refuse a
 * script and still serve a browser — so those are given the benefit of the doubt, and the card
 * itself falls back to a plain panel if the photo does not load for the visitor.
 */
async function photoExists(url) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': PAGE_HEADERS['User-Agent'], Accept: 'image/*' },
      redirect: 'follow',
      signal: AbortSignal.timeout(9_000),
    });
    response.body?.cancel().catch(() => {});
    if (response.status === 404 || response.status === 410) return false;
    if (response.ok) return (response.headers.get('content-type') || '').toLowerCase().startsWith('image/');
    return true;
  } catch {
    return true;
  }
}

/** The article's photo: from its own page for preference, else the API's thumbnail. */
async function choosePhoto(item) {
  if (item.photoChecked) return item.image;
  const candidates = [await findPagePhoto(item.href), item.image].filter(Boolean);
  for (const candidate of new Set(candidates)) {
    if (await photoExists(candidate)) return candidate;
  }
  return undefined;
}

/* ---------- Run ---------- */

async function main() {
  if (!KEY) {
    console.log('[news] NEWS_API_KEY not set — keeping the committed lib/data/newsData.json.');
    return;
  }
  const provider = PROVIDERS[PROVIDER];
  if (!provider) {
    console.warn(`[news] Unknown NEWS_API_PROVIDER "${PROVIDER}" (use ${Object.keys(PROVIDERS).join(', ')}). Nothing was written.`);
    return;
  }

  console.log(`[news] Fetching from ${provider.name}…`);
  const raw = [];
  for (const query of QUERIES) {
    try {
      const found = await provider.fetch(query);
      raw.push(...found);
      console.log(`[news]   ${String(found.length).padStart(3)} for ${query}`);
    } catch (error) {
      // The key travels in the address for two of the providers; keep it out of the log.
      const message = String(error.message || error).split(KEY).join('***');
      console.warn(`[news] warning — a request failed: ${message}`);
    }
  }

  const fresh = raw.map(toItem).filter(Boolean);

  // What is already in the file, back in the shape the checks expect.
  const previous = existsSync(DATA_FILE) ? JSON.parse(readFileSync(DATA_FILE, 'utf8')) : {};
  const kept = (previous.items || [])
    .map((item) => ({
      title: item.title,
      description: item.excerpt,
      url: item.href,
      image: item.image,
      publishedAt: item.date,
      source: item.source,
      sourceIcon: item.sourceIcon,
      photoChecked: item.photoChecked,
    }))
    .map(toItem)
    .filter(Boolean);

  // Newest first, one card per story: the same article often comes back for several queries,
  // and the same wire story under the same headline from several outlets.
  const seen = new Set();
  // The kept ones first, so that where a story is in both lists the copy whose photo has
  // already been looked up is the one that stays. The sort is stable.
  const candidates = [...kept, ...fresh]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((item) => {
      const keys = [item.href.split(/[?#]/)[0], item.title.toLowerCase()];
      if (keys.some((key) => seen.has(key))) return false;
      keys.forEach((key) => seen.add(key));
      return true;
    });

  // Photos, a few articles at a time, until there are enough cards.
  const items = [];
  let looked = 0;
  for (let i = 0; i < candidates.length && items.length < MAX_ITEMS; i += 6) {
    const batch = candidates.slice(i, i + 6);
    await Promise.all(
      batch.map(async (item) => {
        if (!USE_IMAGES) {
          item.image = undefined;
          return;
        }
        if (!item.photoChecked) looked++;
        item.image = await choosePhoto(item);
        item.photoChecked = true;
      }),
    );
    for (const item of batch) {
      if (USE_IMAGES && !item.image) drop(item.title, 'no photo');
      else if (items.length < MAX_ITEMS) items.push(item);
    }
  }
  if (USE_IMAGES) console.log(`[news] Looked up the photo for ${looked} article(s).`);
  if (DEBUG) for (const line of dropped) console.log(`[news]   left out — ${line}`);

  // Two articles can share a headline's first 80 characters; keep the slugs distinct.
  const slugs = new Set();
  for (const item of items) {
    let slug = item.slug;
    for (let n = 2; slugs.has(slug); n++) slug = `${item.slug}-${n}`;
    slugs.add(slug);
    item.slug = slug;
  }

  if (fresh.length === 0) {
    console.warn(`[news] No usable articles came back (${raw.length} received). The previous news is untouched.`);
    return;
  }

  const next = { ...previous, syncedAt: new Date().toISOString(), provider: provider.name, items };
  writeFileSync(DATA_FILE, JSON.stringify(next, null, 2) + '\n', 'utf8');
  console.log(
    `[news] Wrote ${items.length} article(s) to lib/data/newsData.json: ${fresh.length} usable of ${raw.length} received, the rest kept from before.`,
  );
}

main().catch((error) => {
  const message = String(error?.message || error).split(KEY || '\u0000').join('***');
  console.warn(`[news] Sync failed — nothing was written. ${message}`);
});
