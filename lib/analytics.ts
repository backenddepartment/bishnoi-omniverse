/**
 * Browser side of the site analytics. Events go to the analytics Worker (analytics-worker/), which
 * stores them in a Cloudflare D1 database; the /admin/ dashboard reads them back from the same
 * Worker. This site is a static export, so neither part can live in the site itself.
 *
 * What is recorded:
 *   pageview    every page, including client-side navigations
 *   click       every link and button, with its text, its href and what kind of link it is
 *   engagement  when a page is left: seconds spent on it and how far down it was scrolled
 *   conversion  sent inquiries and products added to the quote list (see trackConversion callers)
 *
 * While a tab is open and visible it also sends a heartbeat every 30 seconds, so the dashboard
 * knows who is on the site right now; closing the tab says goodbye at once (see heartbeat/leave).
 *
 * A visitor is a random id kept in localStorage; a session is a random id kept in sessionStorage
 * and renewed after 30 minutes of inactivity. No names, emails or form contents are ever sent.
 * Visits to localhost (development) are not tracked unless NEXT_PUBLIC_ANALYTICS_TRACK_LOCAL=1.
 *
 * The endpoint is public and baked in at build time (the GitHub repository variable
 * ANALYTICS_ENDPOINT in CI, .env.local when developing). With none set, nothing is tracked.
 */
export const ANALYTICS_ENDPOINT = (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT ?? '').trim().replace(/\/+$/, '');

const VISITOR_KEY = 'bo-analytics-visitor';
const SESSION_KEY = 'bo-analytics-session';
const SESSION_IDLE_MS = 30 * 60 * 1000;
const FLUSH_DELAY_MS = 2000;
export const HEARTBEAT_MS = 30_000;
const TRACK_LOCAL = process.env.NEXT_PUBLIC_ANALYTICS_TRACK_LOCAL === '1';

export type ClickCategory = 'internal' | 'outbound' | 'email' | 'phone' | 'whatsapp' | 'download' | 'button';

export interface AnalyticsEvent {
  type: 'pageview' | 'click' | 'engagement' | 'conversion';
  path: string;
  title?: string;
  referrer?: string;
  label?: string;
  target?: string;
  category?: ClickCategory;
  value?: number;
  scroll?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

let queue: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | undefined;

function storage(kind: 'local' | 'session'): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null; // Private mode or blocked storage.
  }
}

function randomId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Every browser on the real site is counted, the team's own included. Off without an endpoint, and
 * on localhost, where the only visitor is whoever is working on the site.
 */
export function trackingEnabled(): boolean {
  if (!ANALYTICS_ENDPOINT || typeof window === 'undefined') return false;
  return TRACK_LOCAL || !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
}

function visitorId(): string {
  const store = storage('local');
  let id = store?.getItem(VISITOR_KEY) ?? '';
  if (!id) {
    id = randomId();
    store?.setItem(VISITOR_KEY, id);
  }
  return id;
}

/** The current session id; a new one after 30 minutes without any event. */
function sessionId(): string {
  const store = storage('session');
  const now = Date.now();
  const [id, last] = (store?.getItem(SESSION_KEY) ?? '').split('|');
  const current = id && now - Number(last) < SESSION_IDLE_MS ? id : randomId();
  store?.setItem(SESSION_KEY, `${current}|${now}`);
  return current;
}

/**
 * The device's IANA time zone, e.g. "Europe/Rome". The Worker uses it to cross-check the country
 * it gets from the connection's IP: mobile carriers and VPNs often exit in another country, and
 * the phone's own clock zone is the better signal of where the visitor really is.
 */
function deviceTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  } catch {
    return '';
  }
}

function send(events: AnalyticsEvent[], extra: Record<string, unknown> = {}) {
  const body = JSON.stringify({ visitor: visitorId(), session: sessionId(), tz: deviceTimeZone(), events, ...extra });
  const url = `${ANALYTICS_ENDPOINT}/collect`;
  // text/plain keeps it a CORS "simple" request: no preflight round trip per batch. sendBeacon
  // survives the page being closed; fetch with keepalive is the fallback.
  try {
    if (navigator.sendBeacon?.(url, new Blob([body], { type: 'text/plain' }))) return;
  } catch {
    /* fall through */
  }
  fetch(url, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {});
}

/** Sends whatever is queued now. Called on a short timer and when the page is hidden. */
export function flush() {
  clearTimeout(flushTimer);
  flushTimer = undefined;
  if (!queue.length) return;
  const batch = queue.splice(0, 25);
  send(batch);
  if (queue.length) flush();
}

export function track(event: AnalyticsEvent) {
  if (!trackingEnabled()) return;
  queue.push(event);
  if (!flushTimer) flushTimer = setTimeout(flush, FLUSH_DELAY_MS);
}

/**
 * "Still here": keeps this visitor on the dashboard's online list, on the page they are reading.
 * Sent every 30 seconds while the tab is visible.
 */
export function heartbeat(path: string, title: string) {
  if (!trackingEnabled()) return;
  send([], { presence: { path, title } });
}

/**
 * "Gone": takes this visitor off the online list at once, when the tab is closed. Anything still
 * queued goes in the same request, so nothing sent after the goodbye can put them back.
 */
export function leave() {
  if (!trackingEnabled()) return;
  clearTimeout(flushTimer);
  flushTimer = undefined;
  send(queue.splice(0, 25), { leave: true });
}

/** Records a goal reached on the current page, e.g. trackConversion('Inquiry sent', 'contact'). */
export function trackConversion(label: string, target?: string) {
  if (typeof window === 'undefined') return;
  track({ type: 'conversion', path: window.location.pathname, label, target });
  flush(); // Conversions are rare and matter most; do not risk losing one to a closed tab.
}

/** The referring site's host, or '' when the visitor came from this site or typed the address. */
export function externalReferrer(): string {
  try {
    if (!document.referrer) return '';
    const host = new URL(document.referrer).hostname.replace(/^www\./, '');
    return host === window.location.hostname.replace(/^www\./, '') ? '' : host;
  } catch {
    return '';
  }
}

/** utm_source / utm_medium / utm_campaign from the current URL, when present. */
export function utmParams(): Pick<AnalyticsEvent, 'utm_source' | 'utm_medium' | 'utm_campaign'> {
  const params = new URLSearchParams(window.location.search);
  const out: Pick<AnalyticsEvent, 'utm_source' | 'utm_medium' | 'utm_campaign'> = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign'] as const) {
    const value = params.get(key)?.trim();
    if (value) out[key] = value.slice(0, 120);
  }
  return out;
}

const DOWNLOAD_PATTERN = /\.(pdf|docx?|xlsx?|csv|zip|pptx?)$/i;

/** What a clicked link or button does, for the Clicks breakdown on the dashboard. */
export function classifyClick(el: Element): { category: ClickCategory; target: string } {
  const href = el instanceof HTMLAnchorElement ? el.getAttribute('href') ?? '' : '';
  if (!href) return { category: 'button', target: '' };
  if (href.startsWith('mailto:')) return { category: 'email', target: href.slice(7).split('?')[0] };
  if (href.startsWith('tel:')) return { category: 'phone', target: href.slice(4) };
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return { category: 'internal', target: href };
  }
  if (/(^|\.)wa\.me$|whatsapp\.com$/.test(url.hostname) || url.protocol === 'whatsapp:') {
    return { category: 'whatsapp', target: url.href };
  }
  if ((el as HTMLAnchorElement).hasAttribute('download') || DOWNLOAD_PATTERN.test(url.pathname)) {
    return { category: 'download', target: url.origin === window.location.origin ? url.pathname : url.href };
  }
  if (url.origin !== window.location.origin) return { category: 'outbound', target: url.href };
  return { category: 'internal', target: url.pathname + url.hash };
}

/**
 * The name a clicked element is reported under: an explicit data-track="..." wins, then its
 * aria-label, its visible text, an image's alt text, and finally its title.
 */
export function clickLabel(el: Element): string {
  const explicit = el.getAttribute('data-track') || el.getAttribute('aria-label');
  if (explicit) return explicit.trim().slice(0, 120);
  const visible = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
  if (visible) return visible.slice(0, 120);
  const alt = el.querySelector('img[alt]')?.getAttribute('alt');
  return (alt || el.getAttribute('title') || '').trim().slice(0, 120);
}
