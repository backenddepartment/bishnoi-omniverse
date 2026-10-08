/**
 * Bishnoi Omniverse analytics — a Cloudflare Worker with a D1 (SQLite) database.
 *
 * The website is a static export on GitHub Pages, so like the inquiry forms (inquiry-worker/) its
 * analytics need somewhere else to live. This Worker does three jobs:
 *
 *   POST /collect        the site's tracker (lib/analytics.ts) sends page views, clicks, time on
 *                        page and conversions here, plus a heartbeat every 30 seconds while a tab
 *                        is open (who is online now). Public, but only from ALLOWED_ORIGINS.
 *   POST /admin/login    username + password -> a signed session token (12 hours).
 *   /admin/me, /admin/users  your own account, and managing everyone's (see src/users.js).
 *   GET  /admin/stats    everything the dashboard at /admin/ shows, for one date range. Needs the
 *                        token as `Authorization: Bearer <token>`.
 *   GET  /admin/live     who is on the site right now, and the latest events. Small and fast, so
 *                        the dashboard can ask every few seconds. Same token.
 *   GET  /admin/export   the raw events for a date range as CSV. Same token.
 *
 * A daily cron deletes events older than RETENTION_DAYS.
 *
 * Configuration — [vars] in wrangler.toml for the non-secret values, `npx wrangler secret put <NAME>`
 * for the rest (see docs/analytics.md):
 *   ADMIN_USERNAME    the first admin's username; used only while there are no accounts yet
 *   ADMIN_PASSWORD    secret; that first admin's password (12+ characters)
 *   SESSION_SECRET    secret; a long random string that signs login tokens. Changing it signs
 *                     everyone out
 *   ALLOWED_ORIGINS   comma-separated origins allowed to send events and use the dashboard
 *   RETENTION_DAYS    optional; how long raw events are kept. Default 400
 *
 * Privacy: no IP address is stored with events. A visitor is a random id the browser keeps in
 * localStorage, the country, region and city come from Cloudflare's own approximate lookup (no
 * street-level location, nothing from the browser), and the device, browser and OS are
 * reduced to a family name ("Chrome", "Android") from the user agent.
 */

import { currentUser, handleLogin, handleMe, handleUsers } from './users.js';

const MAX_EVENTS_PER_REQUEST = 25;
const MAX_RANGE_DAYS = 400;
/** A visitor counts as online while their tab has checked in within this long (heartbeat: 30s). */
const ONLINE_WINDOW_MS = 75_000;

const EVENT_TYPES = ['pageview', 'click', 'engagement', 'conversion'];
const CLICK_CATEGORIES = ['internal', 'outbound', 'email', 'phone', 'whatsapp', 'download', 'button'];

// Crawlers, uptime checkers and headless browsers. Their hits are dropped, not stored.
const BOT_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|monitor|uptime|lighthouse|pagespeed|headless|phantom|puppeteer|playwright|selenium|curl|wget|python-requests|httpclient|axios|node-fetch/i;

const log = (message) => console.log(`[bishnoi-analytics] ${message}`);

/* ------------------------------------------------------------------ *
 * Small helpers
 * ------------------------------------------------------------------ */

/** Single-line text, trimmed and capped. Stored as given; the dashboard renders it as text. */
function text(value, max = 200) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .trim()
    .slice(0, max);
}

/** A site path: starts with /, no query string or hash, capped. */
function sitePath(value) {
  const v = text(value, 300).split(/[?#]/)[0];
  return v.startsWith('/') ? v : '/';
}

function int(value, min, max) {
  const n = Math.round(Number(value));
  return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : null;
}

function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

function originAllowed(origin, env) {
  const list = allowedOrigins(env);
  return list.includes('*') || (origin !== '' && list.includes(origin));
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') ?? '';
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (originAllowed(origin, env)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

function json(request, env, status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request, env), 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

/* ------------------------------------------------------------------ *
 * User agent -> device, browser, OS
 * ------------------------------------------------------------------ */

function parseAgent(ua) {
  const device = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)
    ? 'tablet'
    : /Mobi|iPhone|iPod|Android|BlackBerry|Opera Mini|IEMobile/i.test(ua)
      ? 'mobile'
      : 'desktop';

  // Order matters: Edge, Opera and Samsung Internet all also say "Chrome", and Chrome says "Safari".
  const browser = /Edg\//.test(ua)
    ? 'Edge'
    : /OPR\/|Opera/.test(ua)
      ? 'Opera'
      : /SamsungBrowser/.test(ua)
        ? 'Samsung Internet'
        : /FBAN|FBAV|Instagram|Line\//.test(ua)
          ? 'In-app browser'
          : /Firefox|FxiOS/.test(ua)
            ? 'Firefox'
            : /Chrome|CriOS/.test(ua)
              ? 'Chrome'
              : /Safari/.test(ua)
                ? 'Safari'
                : 'Other';

  const os = /Windows/.test(ua)
    ? 'Windows'
    : /iPhone|iPad|iPod/.test(ua)
      ? 'iOS'
      : /Android/.test(ua)
        ? 'Android'
        : /Mac OS X|Macintosh/.test(ua)
          ? 'macOS'
          : /CrOS/.test(ua)
            ? 'ChromeOS'
            : /Linux/.test(ua)
              ? 'Linux'
              : 'Other';

  return { device, browser, os };
}

/* ------------------------------------------------------------------ *
 * POST /collect
 * ------------------------------------------------------------------ */

async function handleCollect(request, env) {
  const origin = request.headers.get('Origin') ?? '';
  if (!originAllowed(origin, env)) return json(request, env, 403, { message: 'Origin not allowed.' });

  const ua = request.headers.get('User-Agent') ?? '';
  // Answer bots with success so they have nothing to retry, but keep nothing.
  if (ua === '' || BOT_PATTERN.test(ua)) return new Response(null, { status: 204, headers: corsHeaders(request, env) });

  // The tracker sends text/plain (a "simple" request, so no CORS preflight per event).
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 64 * 1024) return json(request, env, 413, { message: 'Too large.' });
    body = JSON.parse(raw);
  } catch {
    return json(request, env, 400, { message: 'Invalid JSON.' });
  }

  const visitor = text(body?.visitor, 64);
  const session = text(body?.session, 64);
  if (!/^[A-Za-z0-9-]{8,64}$/.test(visitor) || !/^[A-Za-z0-9-]{8,64}$/.test(session)) {
    return json(request, env, 400, { message: 'Missing visitor or session.' });
  }

  const events = Array.isArray(body?.events) ? body.events.slice(0, MAX_EVENTS_PER_REQUEST) : [];
  const { device, browser, os } = parseAgent(ua);
  const country = text(request.cf?.country, 2) || null;
  // Cloudflare's approximate place for the connection, from its IP. Never more exact than a city.
  const region = text(request.cf?.region, 80) || null;
  const city = text(request.cf?.city, 80) || null;
  const now = Date.now();

  const insert = env.DB.prepare(
    `INSERT INTO events (ts, type, path, title, referrer, visitor, session, country, device, browser, os,
       label, target, category, value, scroll, utm_source, utm_medium, utm_campaign, region, city)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?21)`
  );

  const statements = [];
  for (const event of events) {
    const type = text(event?.type, 20);
    if (!EVENT_TYPES.includes(type)) continue;
    const category = text(event.category, 20);
    statements.push(
      insert.bind(
        now,
        type,
        sitePath(event.path),
        text(event.title, 200) || null,
        text(event.referrer, 120).toLowerCase() || null,
        visitor,
        session,
        country,
        device,
        browser,
        os,
        text(event.label, 120) || null,
        text(event.target, 300) || null,
        CLICK_CATEGORIES.includes(category) ? category : null,
        type === 'engagement' ? int(event.value, 0, 3600) : null,
        type === 'engagement' ? int(event.scroll, 0, 100) : null,
        text(event.utm_source, 80) || null,
        text(event.utm_medium, 80) || null,
        text(event.utm_campaign, 120) || null,
        region,
        city
      )
    );
  }

  // Presence: a closed tab says goodbye and leaves the online list at once. The heartbeat, a page
  // view, a click or a conversion marks the visitor as here. A batch holding only the time-on-page
  // figure does not: it is sent as a tab is hidden or closed, and may arrive after the goodbye.
  const active = body?.presence || events.some((e) => e?.type && e.type !== 'engagement');
  if (body?.leave === true) {
    statements.push(env.DB.prepare('DELETE FROM presence WHERE visitor = ?1').bind(visitor));
  } else if (active) {
    const lastView = [...events].reverse().find((e) => e?.type === 'pageview');
    const here = body?.presence && typeof body.presence === 'object' ? body.presence : lastView;
    statements.push(
      env.DB.prepare(
        `INSERT INTO presence (visitor, session, first_seen, ts, path, title, country, region, city, device, browser, os)
         VALUES (?1, ?2, ?3, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
         ON CONFLICT(visitor) DO UPDATE SET
           first_seen = CASE WHEN presence.session = excluded.session THEN presence.first_seen ELSE excluded.first_seen END,
           session = excluded.session,
           ts = excluded.ts,
           path = COALESCE(excluded.path, presence.path),
           title = COALESCE(excluded.title, presence.title),
           country = excluded.country, region = excluded.region, city = excluded.city,
           device = excluded.device, browser = excluded.browser, os = excluded.os`
      ).bind(
        visitor,
        session,
        now,
        here ? sitePath(here.path) : null,
        here ? text(here.title, 200) || null : null,
        country,
        region,
        city,
        device,
        browser,
        os
      )
    );
  }

  if (statements.length) {
    try {
      await env.DB.batch(statements);
    } catch (err) {
      log(`insert failed: ${err}`);
      return json(request, env, 500, { message: 'Could not store events.' });
    }
  }
  return new Response(null, { status: 204, headers: corsHeaders(request, env) });
}

/* ------------------------------------------------------------------ *
 * Accounts: sign-in, sessions, users (src/users.js)
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 * Date ranges
 * ------------------------------------------------------------------ */

/**
 * Reads ?from=&to= (epoch ms) and ?tz= (minutes east of UTC, the viewer's time zone) from the URL.
 * Days and hours in the charts are the viewer's local ones. The previous period is the same length
 * immediately before, for the change figures on the stat tiles.
 */
function readRange(url) {
  const now = Date.now();
  let to = Number(url.searchParams.get('to'));
  let from = Number(url.searchParams.get('from'));
  if (!Number.isFinite(to) || to <= 0 || to > now + 60_000) to = now;
  if (!Number.isFinite(from) || from <= 0 || from >= to) from = to - 7 * 86_400_000;
  from = Math.max(from, to - MAX_RANGE_DAYS * 86_400_000);
  const tz = int(url.searchParams.get('tz'), -840, 840) ?? 0;
  const hourly = to - from <= 2 * 86_400_000;
  return { from, to, tz, hourly, prevFrom: from - (to - from), prevTo: from };
}

/* ------------------------------------------------------------------ *
 * GET /admin/stats
 * ------------------------------------------------------------------ */

async function handleStats(request, env, url) {
  const { from, to, tz, hourly, prevFrom, prevTo } = readRange(url);
  const db = env.DB;
  const R = 'ts >= ?1 AND ts < ?2';

  const totalsSql = `
    SELECT
      COALESCE(SUM(type = 'pageview'), 0) AS pageviews,
      COUNT(DISTINCT CASE WHEN type = 'pageview' THEN visitor END) AS visitors,
      COUNT(DISTINCT CASE WHEN type = 'pageview' THEN session END) AS sessions,
      COALESCE(SUM(type = 'click'), 0) AS clicks,
      COALESCE(SUM(type = 'conversion'), 0) AS conversions,
      AVG(CASE WHEN type = 'engagement' THEN value END) AS avgSeconds,
      AVG(CASE WHEN type = 'engagement' THEN scroll END) AS avgScroll
    FROM events WHERE ${R}`;

  const bounceSql = `
    SELECT COUNT(*) AS bounced FROM (
      SELECT session FROM events WHERE ${R} AND type = 'pageview' GROUP BY session HAVING COUNT(*) = 1
    )`;

  // The viewer's local hour or day. tz is minutes, so it shifts the epoch seconds before bucketing.
  const bucket = hourly ? `strftime('%Y-%m-%d %H:00', ts / 1000 + ?3 * 60, 'unixepoch')` : `strftime('%Y-%m-%d', ts / 1000 + ?3 * 60, 'unixepoch')`;

  const breakdown = (column, where = '') =>
    db
      .prepare(
        `SELECT COALESCE(${column}, 'Unknown') AS name, COUNT(DISTINCT visitor) AS visitors, COUNT(*) AS views
         FROM events WHERE ${R} AND type = 'pageview' ${where}
         GROUP BY name ORDER BY visitors DESC, views DESC LIMIT 12`
      )
      .bind(from, to);

  const statements = [
    db.prepare(totalsSql).bind(from, to),
    db.prepare(totalsSql).bind(prevFrom, prevTo),
    db.prepare(bounceSql).bind(from, to),
    db.prepare(bounceSql).bind(prevFrom, prevTo),
    db
      .prepare(
        `SELECT ${bucket} AS bucket,
           SUM(type = 'pageview') AS pageviews,
           COUNT(DISTINCT CASE WHEN type = 'pageview' THEN visitor END) AS visitors,
           SUM(type = 'click') AS clicks
         FROM events WHERE ${R} GROUP BY bucket ORDER BY bucket`
      )
      .bind(from, to, tz),
    db
      .prepare(
        `SELECT path,
           MAX(title) AS title,
           SUM(type = 'pageview') AS views,
           COUNT(DISTINCT CASE WHEN type = 'pageview' THEN visitor END) AS visitors,
           AVG(CASE WHEN type = 'engagement' THEN value END) AS avgSeconds,
           AVG(CASE WHEN type = 'engagement' THEN scroll END) AS avgScroll
         FROM events WHERE ${R} AND type IN ('pageview', 'engagement')
         GROUP BY path HAVING views > 0 ORDER BY views DESC LIMIT 25`
      )
      .bind(from, to),
    // Entry pages: the first page view of each session.
    db
      .prepare(
        `SELECT e.path AS name, COUNT(*) AS sessions FROM events e
         JOIN (SELECT session, MIN(id) AS first FROM events WHERE ${R} AND type = 'pageview' GROUP BY session) f
           ON e.id = f.first
         GROUP BY e.path ORDER BY sessions DESC LIMIT 12`
      )
      .bind(from, to),
    db
      .prepare(
        `SELECT referrer AS name, COUNT(DISTINCT session) AS sessions FROM events
         WHERE ${R} AND type = 'pageview' AND referrer IS NOT NULL AND referrer != ''
         GROUP BY referrer ORDER BY sessions DESC LIMIT 12`
      )
      .bind(from, to),
    db
      .prepare(
        `SELECT COALESCE(utm_source, '') AS source, COALESCE(utm_medium, '') AS medium,
           COALESCE(utm_campaign, '') AS campaign, COUNT(DISTINCT session) AS sessions
         FROM events WHERE ${R} AND type = 'pageview'
           AND (utm_source IS NOT NULL OR utm_medium IS NOT NULL OR utm_campaign IS NOT NULL)
         GROUP BY source, medium, campaign ORDER BY sessions DESC LIMIT 12`
      )
      .bind(from, to),
    breakdown('country'),
    breakdown('device'),
    breakdown('browser'),
    breakdown('os'),
    db
      .prepare(
        `SELECT COALESCE(label, '(no text)') AS label, COALESCE(target, '') AS target,
           COALESCE(category, 'button') AS category, COUNT(*) AS clicks, COUNT(DISTINCT visitor) AS visitors
         FROM events WHERE ${R} AND type = 'click'
         GROUP BY label, target, category ORDER BY clicks DESC LIMIT 30`
      )
      .bind(from, to),
    db
      .prepare(
        `SELECT COALESCE(category, 'button') AS name, COUNT(*) AS clicks FROM events
         WHERE ${R} AND type = 'click' GROUP BY name ORDER BY clicks DESC`
      )
      .bind(from, to),
    db
      .prepare(
        `SELECT COALESCE(label, 'conversion') AS name, COUNT(*) AS count, COUNT(DISTINCT visitor) AS visitors
         FROM events WHERE ${R} AND type = 'conversion' GROUP BY name ORDER BY count DESC`
      )
      .bind(from, to),
    // Products added to the quote list, most popular first.
    db
      .prepare(
        `SELECT target AS name, COUNT(*) AS count FROM events
         WHERE ${R} AND type = 'conversion' AND label = 'Added to quote' AND target IS NOT NULL
         GROUP BY target ORDER BY count DESC LIMIT 12`
      )
      .bind(from, to),
    db.prepare(`SELECT COUNT(*) AS n FROM presence WHERE ts > ?1`).bind(Date.now() - ONLINE_WINDOW_MS),
    db
      .prepare(
        `SELECT ts, type, path, label, target, country, region, city, device, browser FROM events
         WHERE type != 'engagement' ORDER BY ts DESC, id DESC LIMIT 40`
      ),
    // Returning visitors: seen in this range and also at some point before it.
    db
      .prepare(
        `SELECT COUNT(DISTINCT visitor) AS n FROM events
         WHERE ${R} AND type = 'pageview'
           AND visitor IN (SELECT visitor FROM events WHERE ts < ?1 AND type = 'pageview')`
      )
      .bind(from, to),
    // Exit pages: the last page view of each session.
    db
      .prepare(
        `SELECT e.path AS name, COUNT(*) AS sessions FROM events e
         JOIN (SELECT session, MAX(id) AS last FROM events WHERE ${R} AND type = 'pageview' GROUP BY session) l
           ON e.id = l.last
         GROUP BY e.path ORDER BY sessions DESC LIMIT 12`
      )
      .bind(from, to),
    // When people visit, in the viewer's local time: hour of day (0-23) and weekday (0 = Sunday).
    db
      .prepare(
        `SELECT CAST(strftime('%H', ts / 1000 + ?3 * 60, 'unixepoch') AS INTEGER) AS hour,
           COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors
         FROM events WHERE ${R} AND type = 'pageview' GROUP BY hour ORDER BY hour`
      )
      .bind(from, to, tz),
    db
      .prepare(
        `SELECT CAST(strftime('%w', ts / 1000 + ?3 * 60, 'unixepoch') AS INTEGER) AS weekday,
           COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors
         FROM events WHERE ${R} AND type = 'pageview' GROUP BY weekday ORDER BY weekday`
      )
      .bind(from, to, tz),
    // How far down pages people read, in quarters.
    db
      .prepare(
        `SELECT CASE WHEN scroll >= 75 THEN 3 WHEN scroll >= 50 THEN 2 WHEN scroll >= 25 THEN 1 ELSE 0 END AS band,
           COUNT(*) AS views
         FROM events WHERE ${R} AND type = 'engagement' AND scroll IS NOT NULL GROUP BY band ORDER BY band`
      )
      .bind(from, to),
    // Visits that arrived from another site, and visits from a tagged campaign link.
    db
      .prepare(
        `SELECT
           COUNT(DISTINCT CASE WHEN referrer IS NOT NULL AND referrer != '' THEN session END) AS referred,
           COUNT(DISTINCT CASE WHEN utm_source IS NOT NULL OR utm_medium IS NOT NULL OR utm_campaign IS NOT NULL THEN session END) AS campaign
         FROM events WHERE ${R} AND type = 'pageview'`
      )
      .bind(from, to),
    // Which kinds of inquiry were sent.
    db
      .prepare(
        `SELECT COALESCE(target, 'Other') AS name, COUNT(*) AS count FROM events
         WHERE ${R} AND type = 'conversion' AND label = 'Inquiry sent'
         GROUP BY name ORDER BY count DESC LIMIT 12`
      )
      .bind(from, to),
    db
      .prepare(
        `SELECT ts, path, label, target, country, device, browser FROM events
         WHERE ${R} AND type = 'conversion' ORDER BY ts DESC, id DESC LIMIT 25`
      )
      .bind(from, to),
    // Everything per country, for the globe: visitors, page views, clicks, conversions, time.
    db
      .prepare(
        `SELECT COALESCE(country, 'XX') AS name,
           COUNT(DISTINCT CASE WHEN type = 'pageview' THEN visitor END) AS visitors,
           SUM(type = 'pageview') AS views,
           SUM(type = 'click') AS clicks,
           SUM(type = 'conversion') AS conversions,
           AVG(CASE WHEN type = 'engagement' THEN value END) AS avgSeconds
         FROM events WHERE ${R}
         GROUP BY name ORDER BY visitors DESC, views DESC LIMIT 250`
      )
      .bind(from, to),
  ];

  let results;
  try {
    results = (await db.batch(statements)).map((r) => r.results ?? []);
  } catch (err) {
    log(`stats query failed: ${err}`);
    return json(request, env, 500, { message: 'Could not load analytics.' });
  }

  const [
    totals, prevTotals, bounce, prevBounce, series, pages, entryPages, referrers, campaigns,
    countries, devices, browsers, systems, clicks, clickCategories, conversions, quotedProducts,
    live, recent, returning, exitPages, hours, weekdays, scrollBands, arrivals, inquiryTypes,
    recentConversions, countryStats,
  ] = results;

  const withBounce = (t, b) => ({
    ...t,
    bounceRate: t.sessions ? Math.round(((b?.bounced ?? 0) / t.sessions) * 1000) / 10 : 0,
  });

  return json(request, env, 200, {
    range: { from, to, tz, hourly },
    totals: { ...withBounce(totals[0], bounce[0]), returningVisitors: returning[0]?.n ?? 0 },
    previous: withBounce(prevTotals[0], prevBounce[0]),
    liveVisitors: live[0]?.n ?? 0,
    series,
    pages,
    entryPages,
    referrers,
    campaigns,
    countries,
    devices,
    browsers,
    systems,
    clicks,
    clickCategories,
    conversions,
    quotedProducts,
    recent,
    exitPages,
    hours,
    weekdays,
    scrollBands,
    arrivals: arrivals[0] ?? { referred: 0, campaign: 0 },
    inquiryTypes,
    recentConversions,
    countryStats,
  });
}

/* ------------------------------------------------------------------ *
 * GET /admin/live
 * ------------------------------------------------------------------ */

/** Who is online right now and the latest events: two small queries, cheap to ask every 5s. */
async function handleLive(request, env) {
  const since = Date.now() - ONLINE_WINDOW_MS;
  try {
    const [online, recent] = await env.DB.batch([
      env.DB.prepare(
        `SELECT visitor, first_seen AS firstSeen, ts, path, title, country, region, city, device, browser, os
         FROM presence WHERE ts > ?1 ORDER BY first_seen DESC LIMIT 200`
      ).bind(since),
      env.DB.prepare(
        `SELECT ts, type, path, label, target, country, region, city, device, browser FROM events
         WHERE type != 'engagement' ORDER BY ts DESC, id DESC LIMIT 40`
      ),
    ]);
    return json(request, env, 200, { now: Date.now(), online: online.results ?? [], recent: recent.results ?? [] });
  } catch (err) {
    log(`live query failed: ${err}`);
    return json(request, env, 500, { message: 'Could not load live activity.' });
  }
}

/* ------------------------------------------------------------------ *
 * GET /admin/export
 * ------------------------------------------------------------------ */

const EXPORT_COLUMNS = [
  'ts', 'type', 'path', 'title', 'referrer', 'visitor', 'session', 'country', 'device', 'browser', 'os',
  'label', 'target', 'category', 'value', 'scroll', 'utm_source', 'utm_medium', 'utm_campaign', 'region', 'city',
];

function csvCell(value) {
  if (value == null) return '';
  let v = String(value);
  // A leading = + - @ would run as a formula when the file is opened in Excel or Sheets.
  if (/^[=+\-@]/.test(v)) v = `'${v}`;
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

async function handleExport(request, env, url) {
  const { from, to } = readRange(url);
  const { results } = await env.DB.prepare(
    `SELECT ${EXPORT_COLUMNS.join(', ')} FROM events WHERE ts >= ?1 AND ts < ?2 ORDER BY ts LIMIT 100000`
  )
    .bind(from, to)
    .all();

  const lines = [EXPORT_COLUMNS.join(',')];
  for (const row of results ?? []) {
    lines.push(
      EXPORT_COLUMNS.map((c) => csvCell(c === 'ts' ? new Date(row.ts).toISOString() : row[c])).join(',')
    );
  }
  return new Response(lines.join('\n'), {
    headers: {
      ...corsHeaders(request, env),
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="analytics-events.csv"',
      'Cache-Control': 'no-store',
    },
  });
}

/* ------------------------------------------------------------------ *
 * Entry points
 * ------------------------------------------------------------------ */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const route = url.pathname.replace(/\/+$/, '') || '/';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }

    try {
      if (route === '/collect' && request.method === 'POST') return await handleCollect(request, env);
      const reply = (status, body) => json(request, env, status, body);
      if (route === '/admin/login' && request.method === 'POST') return await handleLogin(request, env, reply);

      if (route.startsWith('/admin/')) {
        const me = await currentUser(request, env);
        if (!me) return reply(401, { message: 'Please sign in again.' });
        if (route === '/admin/me' || route === '/admin/me/password') return await handleMe(request, env, reply, me, route);
        if (route === '/admin/users' || route.startsWith('/admin/users/')) return await handleUsers(request, env, reply, me, route);

        if (route === '/admin/stats' || route === '/admin/export' || route === '/admin/live') {
          if (request.method !== 'GET') return reply(405, { message: 'Method not allowed.' });
          if (route === '/admin/live') return await handleLive(request, env);
          if (route === '/admin/export') {
            if (me.role !== 'admin') return reply(403, { message: 'Only administrators can export the raw events.' });
            return await handleExport(request, env, url);
          }
          return await handleStats(request, env, url);
        }
      }

      if (route === '/') return json(request, env, 200, { service: 'bishnoi-analytics', ok: true });
      return json(request, env, 404, { message: 'Not found.' });
    } catch (err) {
      log(`unhandled error on ${route}: ${err?.stack ?? err}`);
      return json(request, env, 500, { message: 'Something went wrong.' });
    }
  },

  /** Daily cron (wrangler.toml [triggers]): drops events past the retention window. */
  async scheduled(_event, env) {
    const days = int(env.RETENTION_DAYS, 30, 3650) ?? 400;
    const cutoff = Date.now() - days * 86_400_000;
    const events = await env.DB.prepare('DELETE FROM events WHERE ts < ?1').bind(cutoff).run();
    await env.DB.prepare('DELETE FROM login_attempts WHERE ts < ?1').bind(Date.now() - 86_400_000).run();
    await env.DB.prepare('DELETE FROM presence WHERE ts < ?1').bind(Date.now() - 86_400_000).run();
    log(`retention: removed ${events.meta?.changes ?? 0} events older than ${days} days`);
  },
};
