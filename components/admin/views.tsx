'use client';

import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Clock,
  Download,
  DoorOpen,
  ExternalLink,
  Eye,
  Mail,
  MessageCircle,
  MousePointerClick,
  MapPin,
  Phone,
  Send,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { BarList, ColumnChart, SplitBar, TrendChart, type TrendPoint } from './charts';
import { Globe, METRIC_LABEL, type CountryStat, type GlobeMetric } from './Globe';
import { Box, BoxLink, DataTable, Empty, IconCircle, Meter, Seg, StatCard, Tag, duration, fmt, percent } from './ui';

/* ------------------------------------------------------------------ *
 * Data from GET /admin/stats (analytics-worker/src/index.js)
 * ------------------------------------------------------------------ */

export interface Totals {
  pageviews: number;
  visitors: number;
  sessions: number;
  clicks: number;
  conversions: number;
  avgSeconds: number | null;
  avgScroll: number | null;
  bounceRate: number;
  returningVisitors?: number;
}

interface Breakdown {
  name: string;
  visitors: number;
  views: number;
}

interface RecentEvent {
  ts: number;
  type: string;
  path: string;
  label: string | null;
  target: string | null;
  country: string | null;
  region?: string | null;
  city?: string | null;
  device: string | null;
  browser: string | null;
}

/** One person on the site right now (GET /admin/live). */
export interface Presence {
  visitor: string;
  firstSeen: number;
  ts: number;
  path: string | null;
  title: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
}

export interface LiveData {
  now: number;
  online: Presence[];
  recent: RecentEvent[];
}

export interface Stats {
  range: { from: number; to: number; tz: number; hourly: boolean };
  totals: Totals;
  previous: Totals;
  liveVisitors: number;
  series: { bucket: string; pageviews: number; visitors: number; clicks: number }[];
  pages: { path: string; title: string | null; views: number; visitors: number; avgSeconds: number | null; avgScroll: number | null }[];
  entryPages: { name: string; sessions: number }[];
  exitPages: { name: string; sessions: number }[];
  referrers: { name: string; sessions: number }[];
  campaigns: { source: string; medium: string; campaign: string; sessions: number }[];
  arrivals: { referred: number; campaign: number };
  countries: Breakdown[];
  devices: Breakdown[];
  browsers: Breakdown[];
  systems: Breakdown[];
  hours: { hour: number; views: number; visitors: number }[];
  weekdays: { weekday: number; views: number; visitors: number }[];
  scrollBands: { band: number; views: number }[];
  clicks: { label: string; target: string; category: string; clicks: number; visitors: number }[];
  clickCategories: { name: string; clicks: number }[];
  conversions: { name: string; count: number; visitors: number }[];
  inquiryTypes: { name: string; count: number }[];
  quotedProducts: { name: string; count: number }[];
  recentConversions: Omit<RecentEvent, 'type'>[];
  countryStats: CountryStat[];
  recent: RecentEvent[];
}

export interface ViewProps {
  stats: Stats;
  points: TrendPoint[];
  productNames: Record<string, string>;
  rangeLabel: string;
  /** Who is online now, refreshed every few seconds; null until the first answer. */
  live: LiveData | null;
}

/** "Cebu City, Central Visayas, Philippines": as much of the place as Cloudflare knows. */
export function placeName(e: { city?: string | null; region?: string | null; country?: string | null }) {
  const parts = [e.city, e.region && e.region !== e.city ? e.region : null, e.country ? countryName(e.country) : null];
  return parts.filter(Boolean).join(', ') || 'Unknown place';
}

/** "4m", "1h 12m": how long someone has been on the site. */
function onFor(ms: number) {
  const m = Math.max(0, Math.floor(ms / 60_000));
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

let regionNames: Intl.DisplayNames | null = null;
export function countryName(code: string) {
  if (code === 'T1') return 'Tor network';
  if (!/^[A-Z]{2}$/.test(code) || code === 'XX') return 'Unknown';
  try {
    regionNames ??= new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

export function flag(code: string) {
  return /^[A-Z]{2}$/.test(code) ? String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0))) : '🌐';
}

export function timeAgo(ts: number) {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const clock = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

const capitalise = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);

/** Page titles end in "| Bishnoi Omniverse"; the dashboard only needs the first part. */
const shortTitle = (title: string | null) => (title ?? '').replace(/\s*\|\s*Bishnoi Omniverse.*$/, '');

export const CLICK_KINDS: Record<string, { label: string; Icon: typeof Eye }> = {
  internal: { label: 'Internal link', Icon: ArrowUpRight },
  outbound: { label: 'External link', Icon: ExternalLink },
  email: { label: 'Email', Icon: Mail },
  phone: { label: 'Phone', Icon: Phone },
  whatsapp: { label: 'WhatsApp', Icon: MessageCircle },
  download: { label: 'Download', Icon: Download },
  button: { label: 'Button', Icon: MousePointerClick },
};

/** Colours for parts of a whole: the validated blue and orange pair, and grey for "direct". */
const PART = { blue: '#0c79e3', orange: '#eb6834', grey: '#8f8f8f' };

function Grid({ cols, children, className = '' }: { cols: string; children: React.ReactNode; className?: string }) {
  return <div className={`grid gap-4 ${cols} ${className}`}>{children}</div>;
}

function ProductName({ id, names }: { id: string; names: Record<string, string> }) {
  return <>{names[id] ?? id}</>;
}

/* ------------------------------------------------------------------ *
 * Overview
 * ------------------------------------------------------------------ */

export function OverviewView({ stats, points, productNames, rangeLabel }: ViewProps) {
  const t = stats.totals;
  const p = stats.previous;
  const vs = `vs previous ${rangeLabel}`;
  const inquiries = stats.conversions.find((c) => c.name === 'Inquiry sent');
  const quotes = stats.conversions.find((c) => c.name === 'Added to quote');

  return (
    <div className="space-y-4">
      <Grid cols="grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <StatCard primary label="Visitors" sub={vs} value={fmt.format(t.visitors)} now={t.visitors} before={p.visitors} note={`${fmt.format(t.returningVisitors ?? 0)} returning`} />
        <StatCard label="Page views" sub={vs} value={fmt.format(t.pageviews)} now={t.pageviews} before={p.pageviews} note={t.sessions ? `${(t.pageviews / t.sessions).toFixed(1)} per visit` : undefined} />
        <StatCard label="Avg. time on page" sub={vs} value={duration(t.avgSeconds)} now={t.avgSeconds ?? 0} before={p.avgSeconds ?? 0} note={t.avgScroll != null ? `${Math.round(t.avgScroll)}% scrolled` : undefined} />
        <StatCard label="Bounce rate" sub="Left after one page" value={`${t.bounceRate}%`} now={t.bounceRate} before={p.bounceRate} lowerIsBetter bar={t.bounceRate} />
        <StatCard label="Clicks" sub={vs} value={fmt.format(t.clicks)} now={t.clicks} before={p.clicks} note={t.visitors ? `${(t.clicks / t.visitors).toFixed(1)} per visitor` : undefined} />
        <StatCard label="Conversions" sub="Inquiries + quote adds" value={fmt.format(t.conversions)} now={t.conversions} before={p.conversions} note={`${fmt.format(inquiries?.count ?? 0)} inquiries · ${fmt.format(quotes?.count ?? 0)} quotes`} />
      </Grid>

      <Grid cols="xl:grid-cols-3">
        <Box className="xl:col-span-2" title="Traffic over time" subtitle={stats.range.hourly ? 'By hour, your local time' : 'By day, your local time'}>
          {t.pageviews === 0 ? <Empty /> : <TrendChart points={points} />}
        </Box>
        <WorthALook stats={stats} rangeLabel={rangeLabel} />
      </Grid>

      <Grid cols="lg:grid-cols-3">
        <Box title="Top pages" subtitle="Most viewed" action={<BoxLink href="#pages">View all</BoxLink>}>
          {stats.pages.length === 0 ? <Empty /> : (
            <BarList unit="views" rows={stats.pages.slice(0, 5).map((r) => ({ key: r.path, label: r.path, title: r.path, value: r.views }))} />
          )}
        </Box>
        <Box title="Traffic sources" subtitle="Sites sending visits" action={<BoxLink href="#sources">View all</BoxLink>}>
          {stats.referrers.length === 0 ? <Empty text="No referrals yet: visits so far were direct." /> : (
            <BarList unit="visits" rows={stats.referrers.slice(0, 5).map((r) => ({ key: r.name, label: r.name, title: r.name, value: r.sessions }))} />
          )}
        </Box>
        <Box title="Countries" subtitle="Where visitors are" action={<BoxLink href="#countries">View globe</BoxLink>}>
          {stats.countries.length === 0 ? <Empty /> : (
            <BarList
              unit="visitors"
              rows={stats.countries.slice(0, 5).map((c) => ({
                key: c.name,
                label: <span><span className="mr-1.5" aria-hidden="true">{flag(c.name)}</span>{countryName(c.name)}</span>,
                title: countryName(c.name),
                value: c.visitors,
                note: percent(c.visitors, t.visitors),
              }))}
            />
          )}
        </Box>
      </Grid>

      <Grid cols="lg:grid-cols-2">
        <Box title="Most clicked" subtitle="Top links and buttons" action={<BoxLink href="#clicks">View all</BoxLink>}>
          {stats.clicks.length === 0 ? <Empty /> : (
            <BarList unit="clicks" rows={stats.clicks.slice(0, 5).map((c) => ({ key: `${c.label}|${c.target}`, label: c.label, title: c.label, value: c.clicks }))} />
          )}
        </Box>
        <Box title="Latest conversions" subtitle="Inquiries and quote adds" action={<BoxLink href="#conversions">View all</BoxLink>} bodyClassName="px-5 pb-3">
          {stats.recentConversions.length === 0 ? <Empty /> : (
            <ConversionList items={stats.recentConversions.slice(0, 5)} productNames={productNames} />
          )}
        </Box>
      </Grid>
    </div>
  );
}

/**
 * The sheet's "Needs your attention" panel on soft blue, turned to analytics: a few plain sentences about
 * what stands out in this period, each with its own icon.
 */
function WorthALook({ stats, rangeLabel }: { stats: Stats; rangeLabel: string }) {
  const t = stats.totals;
  const items: { key: string; Icon: typeof Eye; title: string; meta: string }[] = [];

  const country = stats.countries[0];
  if (country) {
    items.push({
      key: 'country',
      Icon: MapPin,
      title: `Most visitors came from ${countryName(country.name)}`,
      meta: `${fmt.format(country.visitors)} of ${fmt.format(t.visitors)} visitors · ${percent(country.visitors, t.visitors)}`,
    });
  }
  const landing = stats.entryPages[0];
  if (landing) {
    items.push({
      key: 'landing',
      Icon: DoorOpen,
      title: `${landing.name} is where most visits start`,
      meta: `${fmt.format(landing.sessions)} visits · ${percent(landing.sessions, t.sessions)} of all visits`,
    });
  }
  const busiest = stats.hours.reduce<Stats['hours'][number] | null>((best, h) => (!best || h.views > best.views ? h : best), null);
  if (busiest && busiest.views > 0) {
    const hour = (h: number) => (h === 0 ? '12 am' : h < 12 ? `${h} am` : h === 12 ? '12 pm' : `${h - 12} pm`);
    items.push({
      key: 'hour',
      Icon: Clock,
      title: `Busiest around ${hour(busiest.hour)}`,
      meta: `${fmt.format(busiest.views)} page views between ${hour(busiest.hour)} and ${hour((busiest.hour + 1) % 24)}`,
    });
  }
  const before = stats.previous.bounceRate;
  if (t.sessions > 0 && stats.previous.sessions > 0 && Math.abs(t.bounceRate - before) >= 1) {
    const better = t.bounceRate < before;
    items.push({
      key: 'bounce',
      Icon: better ? TrendingDown : TrendingUp,
      title: `Bounce rate ${better ? 'down' : 'up'} to ${t.bounceRate}%`,
      meta: `${Math.abs(t.bounceRate - before).toFixed(1)} points ${better ? 'better' : 'worse'} than the previous ${rangeLabel}`,
    });
  }
  const inquiries = stats.conversions.find((c) => c.name === 'Inquiry sent')?.count ?? 0;
  items.push({
    key: 'inquiries',
    Icon: Send,
    title: inquiries ? `${fmt.format(inquiries)} ${inquiries === 1 ? 'inquiry' : 'inquiries'} sent` : 'No inquiries sent yet',
    meta: inquiries ? `Most were “${stats.inquiryTypes[0]?.name ?? 'Inquiry'}”` : `in the last ${rangeLabel}`,
  });

  return (
    <section className="min-w-0 rounded-[28px] bg-crm-p-50 p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[17px] font-semibold text-crm-ink">Worth a look</h3>
        <Tag tone="outline">{items.length}</Tag>
      </div>
      <ul className="m-0 mt-3 list-none p-0">
        {items.map(({ key, Icon, title, meta }) => (
          <li key={key} className="flex items-start gap-3.5 border-b border-crm-p-100 py-3.5 last:border-0 last:pb-0">
            <IconCircle>
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </IconCircle>
            <div className="min-w-0">
              <b className="block font-semibold text-crm-ink">{title}</b>
              <span className="block text-[12.5px] text-crm-ink-3">{meta}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ConversionList({ items, productNames }: { items: Stats['recentConversions']; productNames: Record<string, string> }) {
  return (
    <ul className="divide-y divide-crm-rule">
      {items.map((c, i) => {
        const quote = c.label === 'Added to quote';
        const Icon = quote ? ShoppingCart : Send;
        return (
          <li key={`${c.ts}-${i}`} className="flex items-start gap-3.5 py-3.5">
            <IconCircle tone={quote ? 'plain' : 'soft'}>
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </IconCircle>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14px] font-semibold text-crm-ink">
                {quote ? <ProductName id={c.target ?? ''} names={productNames} /> : c.target || 'Inquiry'}
              </div>
              <div className="truncate text-[12.5px] text-crm-ink-3">
                {quote ? 'Added to quote' : 'Inquiry sent'} on {c.path}
                {c.country ? ` · ${flag(c.country)} ${countryName(c.country)}` : ''}
              </div>
            </div>
            <time className="shrink-0 whitespace-nowrap text-[12.5px] text-crm-ink-3" dateTime={new Date(c.ts).toISOString()}>
              {timeAgo(c.ts)}
            </time>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ *
 * Live
 * ------------------------------------------------------------------ */

/**
 * The empty "Who's online now" card: the component sheet's empty-state drawing (ink lines on a
 * soft shadow), redrawn in the dashboard blue: a browser window with a globe on its screen and a
 * radar pulse around it, waiting for the next visitor. The pulse is still for reduced motion.
 */
function NoOneOnline() {
  return (
    <div className="flex flex-col items-center px-4 pb-6 pt-4 text-center">
      <svg width="200" height="150" viewBox="0 0 200 150" aria-hidden="true" className="overflow-visible">
        {/* Shadow on the floor */}
        <ellipse cx="100" cy="138" rx="66" ry="6" fill="#ecf4fd" />
        {/* Radar pulse behind the window */}
        <circle cx="100" cy="74" r="62" fill="none" stroke="#d8eafb" strokeWidth="2" className="admin-radar" />
        <circle cx="100" cy="74" r="62" fill="none" stroke="#d8eafb" strokeWidth="2" className="admin-radar admin-radar-late" />
        <circle cx="100" cy="74" r="46" fill="#ecf4fd" />
        {/* Browser window */}
        <rect x="46" y="34" width="108" height="82" rx="10" fill="#ffffff" stroke="#141414" strokeWidth="2" />
        <path d="M46 52h108" stroke="#141414" strokeWidth="2" />
        <circle cx="57" cy="43" r="2.6" fill="#141414" />
        <circle cx="66" cy="43" r="2.6" fill="#141414" />
        <circle cx="75" cy="43" r="2.6" fill="#b1d4f6" />
        <rect x="88" y="39.5" width="56" height="7" rx="3.5" fill="#ecf4fd" stroke="#141414" strokeWidth="1.5" />
        {/* Globe on the screen */}
        <circle cx="100" cy="84" r="20" fill="#d8eafb" stroke="#141414" strokeWidth="2" />
        <ellipse cx="100" cy="84" rx="8.5" ry="20" fill="none" stroke="#141414" strokeWidth="1.5" />
        <path d="M80.5 78h39M80.5 90h39" stroke="#141414" strokeWidth="1.5" strokeLinecap="round" />
        {/* A visitor dot in orbit, still on its way */}
        <path d="M150 30c14 8 18 24 10 38" fill="none" stroke="#86bcf1" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 6" />
        <circle cx="150" cy="30" r="7" fill="#0c79e3" stroke="#ffffff" strokeWidth="2.5" />
        {/* Sparkles */}
        <path d="M34 40v8M30 44h8" stroke="#86bcf1" strokeWidth="2" strokeLinecap="round" />
        <path d="M168 104v6M165 107h6" stroke="#86bcf1" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <h4 className="mt-3 text-[17px] font-semibold text-crm-ink">No one&apos;s online right now</h4>
      <p className="mx-auto mt-1 max-w-[340px] text-[13.5px] leading-relaxed text-crm-ink-3">
        Visitors appear here within seconds of opening the website, with their city, device and the page they&apos;re
        reading.
      </p>
      <a
        href="/"
        target="_blank"
        rel="noopener"
        className="mt-4 inline-flex h-[34px] items-center gap-2 rounded-full border-[1.5px] border-crm-p bg-white px-4 text-[13px] font-medium text-crm-ink transition hover:bg-crm-p-50"
      >
        <ExternalLink className="h-4 w-4 text-crm-p" aria-hidden="true" />
        Open the website
      </a>
    </div>
  );
}

export function LiveView({ stats, productNames, live }: ViewProps) {
  const online = live?.online ?? [];
  const recent = live?.recent ?? stats.recent;
  const now = live?.now ?? Date.now();
  const lastHour = recent.filter((e) => now - e.ts < 3_600_000);
  const countries = Array.from(new Set(online.map((o) => o.country).filter(Boolean))) as string[];
  const devices = online.reduce<Record<string, number>>((acc, o) => {
    const d = o.device ?? 'unknown';
    acc[d] = (acc[d] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <Grid cols="grid-cols-2 lg:grid-cols-4">
        <StatCard primary label="Online now" sub="On the site this minute" value={fmt.format(online.length)} />
        <StatCard
          label="Countries"
          sub="Where they are"
          value={fmt.format(countries.length)}
          note={countries.length ? countries.slice(0, 3).map(countryName).join(', ') + (countries.length > 3 ? '…' : '') : undefined}
        />
        <StatCard
          label="Devices"
          sub="What they're using"
          value={fmt.format(online.length)}
          note={Object.keys(devices).length ? Object.entries(devices).map(([d, n]) => `${n} ${d}`).join(' · ') : undefined}
        />
        <StatCard label="Page views" sub="In the last hour" value={fmt.format(lastHour.filter((e) => e.type === 'pageview').length)} />
      </Grid>

      <Box
        title="Who's online now"
        subtitle="Everyone with the website open right now. Updates every few seconds."
        action={
          <span className="inline-flex h-[26px] shrink-0 items-center gap-1.5 rounded-full bg-[#86efac] px-3 text-[12.5px] font-medium text-[#14532d]">
            <span className="relative flex h-[7px] w-[7px]">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
              <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-current" />
            </span>
            Live
          </span>
        }
        bodyClassName="px-5 pb-3"
      >
        {online.length === 0 ? (
          <NoOneOnline />
        ) : (
          <ul className="m-0 list-none divide-y divide-crm-rule p-0">
            {online.map((o) => (
              <li key={o.visitor} className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-start gap-3.5 py-3.5">
                <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-crm-p-50 text-[18px]" aria-hidden="true">
                  {o.country ? flag(o.country) : '🌐'}
                </span>
                <div className="min-w-0">
                  <b className="block truncate text-[14px] font-semibold text-crm-ink">{placeName(o)}</b>
                  <span className="block truncate text-[12.5px] text-crm-ink-3">
                    {[o.device && capitalise(o.device), o.browser, o.os].filter(Boolean).join(' · ')}
                  </span>
                  <span className="mt-1 block truncate text-[12.5px] text-crm-ink-2">
                    Reading <b className="font-medium text-crm-ink">{o.path ?? '/'}</b>
                    {o.title ? <span className="text-crm-ink-3"> · {shortTitle(o.title)}</span> : null}
                  </span>
                </div>
                <div className="text-right text-[12.5px]">
                  <span className="block font-medium tabular-nums text-crm-ink">{onFor(now - o.firstSeen)}</span>
                  <span className="block text-crm-ink-3">on the site</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Box>

      <Box title="Activity" subtitle="The latest page views, clicks and conversions, newest first.">
        {recent.length === 0 ? <Empty text="Nothing yet. Open the website in another tab and it will show up here." /> : (
          <ol className="m-0 list-none p-0">
            {recent.map((e, i) => {
              const Icon = e.type === 'pageview' ? Eye : e.type === 'click' ? MousePointerClick : e.label === 'Added to quote' ? ShoppingCart : Send;
              const what =
                e.type === 'pageview'
                  ? 'Viewed a page'
                  : e.type === 'click'
                    ? `Clicked “${e.label ?? ''}”`
                    : e.label === 'Added to quote'
                      ? `Added “${productNames[e.target ?? ''] ?? e.target}” to quote`
                      : `Sent an inquiry${e.target ? ` (${e.target})` : ''}`;
              const isLast = i === recent.length - 1;
              return (
                <li key={`${e.ts}-${i}`} className="relative grid grid-cols-[38px_1fr_auto] gap-3.5 pb-[18px] last:pb-0">
                  {!isLast && <span className="absolute bottom-0.5 left-[18px] top-10 w-[1.5px] bg-crm-rule" aria-hidden="true" />}
                  {/* Conversions wear soft blue, so the goals stand out in the feed. */}
                  <IconCircle tone={e.type === 'conversion' ? 'soft' : 'plain'}>
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </IconCircle>
                  <div className="min-w-0">
                    <b className="block truncate text-[14px] font-semibold text-crm-ink">{what}</b>
                    <span className="block truncate text-[12.5px] text-crm-ink-3">
                      {e.path}
                      {e.country ? ` · ${flag(e.country)} ${placeName(e)}` : ''}
                      {e.device ? ` · ${capitalise(e.device)}` : ''}
                      {e.browser ? ` · ${e.browser}` : ''}
                    </span>
                  </div>
                  <time className="whitespace-nowrap text-[12.5px] text-crm-ink-3" dateTime={new Date(e.ts).toISOString()} title={clock.format(e.ts)}>
                    {timeAgo(e.ts)}
                  </time>
                </li>
              );
            })}
          </ol>
        )}
      </Box>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Pages
 * ------------------------------------------------------------------ */

const SCROLL_BANDS = ['Under 25%', '25–49%', '50–74%', '75–100%'];

export function PagesView({ stats }: ViewProps) {
  const t = stats.totals;
  const bands = SCROLL_BANDS.map((label, band) => ({ label, views: stats.scrollBands.find((b) => b.band === band)?.views ?? 0 }));
  const read = bands.reduce((sum, b) => sum + b.views, 0);

  return (
    <div className="space-y-4">
      <Grid cols="grid-cols-2 lg:grid-cols-4">
        <StatCard primary label="Pages viewed" sub="Different pages with a view" value={fmt.format(stats.pages.length)} />
        <StatCard label="Page views" value={fmt.format(t.pageviews)} now={t.pageviews} before={stats.previous.pageviews} />
        <StatCard label="Avg. time on page" value={duration(t.avgSeconds)} now={t.avgSeconds ?? 0} before={stats.previous.avgSeconds ?? 0} />
        <StatCard label="Avg. scroll depth" value={t.avgScroll != null ? `${Math.round(t.avgScroll)}%` : '—'} bar={t.avgScroll ?? 0} note="How far down people read" />
      </Grid>

      <DataTable
        noun="pages"
        rows={stats.pages}
        rowKey={(r) => r.path}
        search={(r) => `${r.path} ${r.title ?? ''}`}
        searchLabel="Search pages"
        columns={[
          {
            key: 'page',
            head: 'Page',
            render: (r) => (
              <div className="max-w-[380px]">
                <a href={r.path} target="_blank" rel="noopener" className="block truncate font-semibold text-crm-ink hover:underline">
                  {r.path}
                </a>
                {r.title && <span className="block truncate text-[12px] text-crm-ink-3">{shortTitle(r.title)}</span>}
              </div>
            ),
          },
          { key: 'views', head: 'Views', num: true, render: (r) => <b className="font-semibold">{fmt.format(r.views)}</b> },
          { key: 'visitors', head: 'Visitors', num: true, render: (r) => fmt.format(r.visitors) },
          { key: 'share', head: 'Share', num: true, render: (r) => percent(r.views, t.pageviews) },
          { key: 'time', head: 'Avg. time', num: true, render: (r) => duration(r.avgSeconds) },
          {
            key: 'scroll',
            head: 'Scroll depth',
            width: '160px',
            render: (r) =>
              r.avgScroll == null ? (
                <span className="text-crm-ink-4">—</span>
              ) : (
                <div className="flex items-center gap-2">
                  <Meter value={r.avgScroll} thin className="flex-1" />
                  <span className="w-9 text-right text-[12.5px] tabular-nums text-crm-ink-2">{Math.round(r.avgScroll)}%</span>
                </div>
              ),
          },
        ]}
      />

      <Grid cols="lg:grid-cols-3">
        <Box title="Landing pages" subtitle="Where visits start">
          {stats.entryPages.length === 0 ? <Empty /> : (
            <BarList unit="visits" rows={stats.entryPages.map((r) => ({ key: r.name, label: r.name, title: r.name, value: r.sessions, note: percent(r.sessions, t.sessions) }))} />
          )}
        </Box>
        <Box title="Exit pages" subtitle="Where visits end">
          {stats.exitPages.length === 0 ? <Empty /> : (
            <BarList unit="visits" rows={stats.exitPages.map((r) => ({ key: r.name, label: r.name, title: r.name, value: r.sessions, note: percent(r.sessions, t.sessions) }))} />
          )}
        </Box>
        <Box title="How far people read" subtitle="Page views by deepest scroll">
          {read === 0 ? <Empty /> : (
            <BarList unit="page views" rows={bands.map((b) => ({ key: b.label, label: b.label, title: b.label, value: b.views, note: percent(b.views, read) }))} />
          )}
        </Box>
      </Grid>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Traffic sources
 * ------------------------------------------------------------------ */

export function SourcesView({ stats }: ViewProps) {
  const t = stats.totals;
  const referred = stats.arrivals.referred;
  const direct = Math.max(t.sessions - referred, 0);

  return (
    <div className="space-y-4">
      <Grid cols="grid-cols-2 lg:grid-cols-4">
        <StatCard primary label="Visits" sub="Sessions in this period" value={fmt.format(t.sessions)} now={t.sessions} before={stats.previous.sessions} />
        <StatCard label="Direct" sub="Typed the address or a bookmark" value={fmt.format(direct)} note={percent(direct, t.sessions)} />
        <StatCard label="From other sites" sub="Search engines, social, links" value={fmt.format(referred)} note={percent(referred, t.sessions)} />
        <StatCard label="From campaigns" sub="Links tagged with utm_" value={fmt.format(stats.arrivals.campaign)} note={percent(stats.arrivals.campaign, t.sessions)} />
      </Grid>

      <Box title="How visits arrive" subtitle="Every visit counted once">
        {t.sessions === 0 ? <Empty /> : (
          <SplitBar unit="visits" parts={[
            { label: 'From other sites', value: referred, color: PART.blue },
            { label: 'Direct', value: direct, color: PART.grey },
          ]} />
        )}
      </Box>

      <Grid cols="lg:grid-cols-2">
        <Box title="Referring sites" subtitle="Which sites send visitors">
          {stats.referrers.length === 0 ? <Empty text="No referrals yet: visits so far were direct." /> : (
            <BarList unit="visits" rows={stats.referrers.map((r) => ({ key: r.name, label: r.name, title: r.name, value: r.sessions, note: percent(r.sessions, t.sessions) }))} />
          )}
        </Box>
        <Box title="Campaigns" subtitle="Tagged links, e.g. ?utm_source=linkedin&utm_campaign=cphi" bodyClassName="">
          {stats.campaigns.length === 0 ? <Empty text="No tagged links used yet." /> : (
            <table className="w-full text-left">
              <thead>
                <tr>
                  {['Source', 'Medium', 'Campaign', 'Visits'].map((h, i) => (
                    <th key={h} className={`border-b border-crm-rule bg-crm-head px-[18px] py-3 text-[12px] font-medium text-crm-ink-3 ${i === 3 ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.campaigns.map((c) => (
                  <tr key={`${c.source}|${c.medium}|${c.campaign}`} className="border-b border-crm-rule last:border-0 hover:bg-crm-p-50">
                    <td className="px-[18px] py-3.5 text-[14px] font-semibold text-crm-ink">{c.source || '—'}</td>
                    <td className="px-[18px] py-3.5 text-[14px] text-crm-ink-2">{c.medium ? <Tag tone="outline">{c.medium}</Tag> : '—'}</td>
                    <td className="px-[18px] py-3.5 text-[14px] text-crm-ink-2">{c.campaign || '—'}</td>
                    <td className="px-[18px] py-3.5 text-right text-[14px] font-semibold tabular-nums text-crm-ink">{fmt.format(c.sessions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Box>
      </Grid>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Audience
 * ------------------------------------------------------------------ */

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function hourLabel(h: number) {
  return h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`;
}

export function AudienceView({ stats }: ViewProps) {
  const t = stats.totals;
  const returning = t.returningVisitors ?? 0;
  const fresh = Math.max(t.visitors - returning, 0);
  const hours = Array.from({ length: 24 }, (_, h) => ({
    key: String(h),
    label: hourLabel(h),
    long: `${hourLabel(h).replace('a', ' am').replace('p', ' pm')} – ${hourLabel((h + 1) % 24).replace('a', ' am').replace('p', ' pm')}`,
    value: stats.hours.find((r) => r.hour === h)?.views ?? 0,
  }));
  // Monday first.
  const days = [1, 2, 3, 4, 5, 6, 0].map((d) => ({
    key: String(d),
    label: WEEKDAYS[d],
    long: WEEKDAYS_LONG[d],
    value: stats.weekdays.find((r) => r.weekday === d)?.views ?? 0,
  }));
  const breakdown = (rows: Breakdown[], label: (name: string) => React.ReactNode = capitalise, title: (name: string) => string = capitalise) =>
    rows.length === 0 ? <Empty /> : (
      <BarList unit="visitors" rows={rows.map((r) => ({ key: r.name, label: label(r.name), title: title(r.name), value: r.visitors, note: percent(r.visitors, t.visitors) }))} />
    );

  return (
    <div className="space-y-4">
      <Grid cols="grid-cols-2 lg:grid-cols-4">
        <StatCard primary label="Visitors" value={fmt.format(t.visitors)} now={t.visitors} before={stats.previous.visitors} />
        <StatCard label="New" sub="First visit in this period" value={fmt.format(fresh)} note={percent(fresh, t.visitors)} />
        <StatCard label="Returning" sub="Seen before this period" value={fmt.format(returning)} note={percent(returning, t.visitors)} />
        <StatCard label="Countries" sub="Different countries" value={fmt.format(stats.countries.length)} note={stats.countries[0] ? `Most from ${countryName(stats.countries[0].name)}` : undefined} />
      </Grid>

      <Box title="New and returning visitors">
        {t.visitors === 0 ? <Empty /> : (
          <SplitBar unit="visitors" parts={[
            { label: 'New', value: fresh, color: PART.blue },
            { label: 'Returning', value: returning, color: PART.orange },
          ]} />
        )}
      </Box>

      <Grid cols="lg:grid-cols-2">
        <Box title="When people visit" subtitle="Page views by hour of day, your local time">
          {t.pageviews === 0 ? <Empty /> : <ColumnChart data={hours} unit="page views" />}
        </Box>
        <Box title="Busiest days" subtitle="Page views by weekday">
          {t.pageviews === 0 ? <Empty /> : <ColumnChart data={days} unit="page views" />}
        </Box>
      </Grid>

      <Grid cols="md:grid-cols-2 2xl:grid-cols-4">
        <Box title="Countries" subtitle="Visitors" action={<BoxLink href="#countries">View globe</BoxLink>}>
          {breakdown(stats.countries, (c) => <span><span className="mr-1.5" aria-hidden="true">{flag(c)}</span>{countryName(c)}</span>, countryName)}
        </Box>
        <Box title="Devices" subtitle="Visitors">{breakdown(stats.devices)}</Box>
        {/* Browser and OS names are already cased ("iOS", "macOS"); only device types are lower case. */}
        <Box title="Browsers" subtitle="Visitors">{breakdown(stats.browsers, (n) => n, (n) => n)}</Box>
        <Box title="Operating systems" subtitle="Visitors">{breakdown(stats.systems, (n) => n, (n) => n)}</Box>
      </Grid>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Clicks
 * ------------------------------------------------------------------ */

type ClickFilter = 'all' | 'internal' | 'contact' | 'outbound' | 'download' | 'button';
const CONTACT = ['email', 'phone', 'whatsapp'];

export function ClicksView({ stats }: ViewProps) {
  const t = stats.totals;
  const [filter, setFilter] = useState<ClickFilter>('all');
  const count = (names: string[]) => stats.clickCategories.filter((c) => names.includes(c.name)).reduce((s, c) => s + c.clicks, 0);
  const contact = count(CONTACT);

  const rows = useMemo(
    () =>
      stats.clicks.filter((c) =>
        filter === 'all' ? true : filter === 'contact' ? CONTACT.includes(c.category) : c.category === filter
      ),
    [stats.clicks, filter]
  );

  return (
    <div className="space-y-4">
      <Grid cols="grid-cols-2 lg:grid-cols-4">
        <StatCard primary label="Clicks" value={fmt.format(t.clicks)} now={t.clicks} before={stats.previous.clicks} note={t.visitors ? `${(t.clicks / t.visitors).toFixed(1)} per visitor` : undefined} />
        <StatCard label="Contact clicks" sub="Email, phone and WhatsApp" value={fmt.format(contact)} note={percent(contact, t.clicks)} />
        <StatCard label="External links" sub="Leaving the site" value={fmt.format(count(['outbound']))} note={percent(count(['outbound']), t.clicks)} />
        <StatCard label="Downloads" sub="PDFs and documents" value={fmt.format(count(['download']))} note={percent(count(['download']), t.clicks)} />
      </Grid>

      <Grid cols="lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTable
            noun="links and buttons"
            rows={rows}
            rowKey={(r) => `${r.label}|${r.target}|${r.category}`}
            search={(r) => `${r.label} ${r.target}`}
            searchLabel="Search clicks"
            maxHeight={560}
            tools={
              <Seg
                label="Click type"
                value={filter}
                onChange={setFilter}
                options={[
                  { id: 'all', label: 'All' },
                  { id: 'internal', label: 'Internal' },
                  { id: 'contact', label: 'Contact' },
                  { id: 'outbound', label: 'External' },
                  { id: 'download', label: 'Downloads' },
                  { id: 'button', label: 'Buttons' },
                ]}
              />
            }
            columns={[
              {
                key: 'clicked',
                head: 'Clicked',
                render: (c) => (
                  <div className="max-w-[340px]">
                    <span className="block truncate font-semibold text-crm-ink">{c.label}</span>
                    {c.target && <span className="block truncate text-[12px] text-crm-ink-3">{c.target}</span>}
                  </div>
                ),
              },
              {
                key: 'type',
                head: 'Type',
                render: (c) => {
                  const kind = CLICK_KINDS[c.category] ?? CLICK_KINDS.button;
                  return (
                    <Tag tone={CONTACT.includes(c.category) ? 'good' : c.category === 'outbound' ? 'info' : 'outline'}>
                      <kind.Icon className="h-3 w-3" aria-hidden="true" />
                      {kind.label}
                    </Tag>
                  );
                },
              },
              { key: 'clicks', head: 'Clicks', num: true, render: (c) => <b className="font-semibold">{fmt.format(c.clicks)}</b> },
              { key: 'visitors', head: 'Visitors', num: true, render: (c) => fmt.format(c.visitors) },
            ]}
          />
        </div>
        <Box title="Clicks by type" subtitle="Where clicks lead">
          {stats.clickCategories.length === 0 ? <Empty /> : (
            <BarList
              unit="clicks"
              rows={stats.clickCategories.map((c) => {
                const kind = CLICK_KINDS[c.name] ?? CLICK_KINDS.button;
                return {
                  key: c.name,
                  label: <span className="inline-flex items-center gap-1.5"><kind.Icon className="h-3.5 w-3.5 text-crm-ink-3" aria-hidden="true" />{kind.label}</span>,
                  title: kind.label,
                  value: c.clicks,
                  note: percent(c.clicks, t.clicks),
                };
              })}
            />
          )}
        </Box>
      </Grid>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Conversions
 * ------------------------------------------------------------------ */

export function ConversionsView({ stats, productNames }: ViewProps) {
  const t = stats.totals;
  const inquiries = stats.conversions.find((c) => c.name === 'Inquiry sent');
  const quotes = stats.conversions.find((c) => c.name === 'Added to quote');
  const converters = stats.conversions.reduce((s, c) => s + c.visitors, 0);
  const rate = t.visitors ? Math.min((converters / t.visitors) * 100, 100) : 0;

  return (
    <div className="space-y-4">
      <Grid cols="grid-cols-2 lg:grid-cols-4">
        <StatCard primary label="Conversions" value={fmt.format(t.conversions)} now={t.conversions} before={stats.previous.conversions} />
        <StatCard label="Inquiries sent" sub="Contact and requisition forms" value={fmt.format(inquiries?.count ?? 0)} note={`by ${fmt.format(inquiries?.visitors ?? 0)} visitors`} />
        <StatCard label="Added to quote" sub="Products put on a quote list" value={fmt.format(quotes?.count ?? 0)} note={`by ${fmt.format(quotes?.visitors ?? 0)} visitors`} />
        <StatCard label="Conversion rate" sub="Visitors who converted" value={`${rate.toFixed(rate && rate < 10 ? 1 : 0)}%`} bar={rate} />
      </Grid>

      <Grid cols="lg:grid-cols-2">
        <Box title="Inquiry types" subtitle="Which forms were sent">
          {stats.inquiryTypes.length === 0 ? <Empty text="No inquiries in this period yet." /> : (
            <BarList unit="inquiries" rows={stats.inquiryTypes.map((r) => ({ key: r.name, label: r.name, title: r.name, value: r.count, note: percent(r.count, inquiries?.count ?? 0) }))} />
          )}
        </Box>
        <Box title="Most requested products" subtitle="Added to a quote list">
          {stats.quotedProducts.length === 0 ? <Empty text="No products added to a quote yet." /> : (
            <BarList unit="adds" rows={stats.quotedProducts.map((q) => ({ key: q.name, label: productNames[q.name] ?? q.name, title: productNames[q.name] ?? q.name, value: q.count }))} />
          )}
        </Box>
      </Grid>

      <Box title="Recent conversions" subtitle="Newest first, in this period" bodyClassName="px-4 py-2">
        {stats.recentConversions.length === 0 ? <Empty /> : <ConversionList items={stats.recentConversions} productNames={productNames} />}
      </Box>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Countries
 * ------------------------------------------------------------------ */

export function CountriesView({ stats, live: liveData }: ViewProps) {
  const t = stats.totals;
  const rows = stats.countryStats;
  const [metric, setMetric] = useState<GlobeMetric>('visitors');
  const [selected, setSelected] = useState<string | null>(null);
  const top = rows[0];
  const live = useMemo(
    () => Array.from(new Set((liveData?.online ?? []).map((o) => o.country).filter(Boolean))) as string[],
    [liveData]
  );
  const pick = rows.find((r) => r.name === selected);
  const abroad = top ? Math.max(t.visitors - top.visitors, 0) : 0;

  const choose = (code: string | null) => {
    setSelected(code);
    // On a phone the globe sits above the table: bring it into view.
    if (code && window.innerWidth < 1024) document.getElementById('globe-box')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-4">
      <Grid cols="grid-cols-2 lg:grid-cols-4">
        <StatCard primary label="Countries" sub="Sending at least one visit" value={fmt.format(rows.filter((r) => r.visitors > 0).length)} />
        <StatCard label="Top country" sub={top ? countryName(top.name) : 'No visits yet'} value={top ? percent(top.visitors, t.visitors) || '0%' : '—'} note={top ? `${fmt.format(top.visitors)} visitors` : undefined} />
        <StatCard label="From other countries" sub={top ? `Outside ${countryName(top.name)}` : 'Outside the top country'} value={fmt.format(abroad)} note={`${percent(abroad, t.visitors) || '0%'} of visitors`} />
        <StatCard label="On the site now" sub="Countries with someone online" value={fmt.format(live.length)} note={live.length ? live.map(countryName).join(', ') : undefined} />
      </Grid>

      <section id="globe-box" className="scroll-mt-20 rounded-[22px] border border-crm-rule bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-crm-ink">Around the world</h3>
            <p className="mt-0.5 text-[12.5px] text-crm-ink-3">Drag to turn the globe · hover a country for its numbers · click to select it</p>
          </div>
          <Seg
            label="Shade countries by"
            value={metric}
            onChange={setMetric}
            options={[
              { id: 'visitors', label: 'Visitors' },
              { id: 'views', label: 'Page views' },
              { id: 'clicks', label: 'Clicks' },
              { id: 'conversions', label: 'Conversions' },
            ]}
          />
        </div>

        <div className="mt-5 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Globe rows={rows} metric={metric} liveCodes={live} selected={selected} onSelect={choose} countryName={countryName} />

          <div className="rounded-[22px] bg-crm-p-50 p-5">
            {pick ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-crm-ink-3">Selected country</p>
                    <h4 className="mt-1 truncate text-[19px] font-semibold text-crm-ink">
                      <span className="mr-2" aria-hidden="true">{flag(pick.name)}</span>
                      {countryName(pick.name)}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="shrink-0 rounded-full px-3 py-1 text-[12.5px] text-crm-ink-2 hover:bg-white hover:text-crm-ink"
                  >
                    Clear
                  </button>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    ['Visitors', fmt.format(pick.visitors), percent(pick.visitors, t.visitors)],
                    ['Page views', fmt.format(pick.views), percent(pick.views, t.pageviews)],
                    ['Clicks', fmt.format(pick.clicks), percent(pick.clicks, t.clicks)],
                    ['Conversions', fmt.format(pick.conversions), percent(pick.conversions, t.conversions)],
                  ].map(([label, value, share]) => (
                    <div key={label} className="rounded-[16px] bg-white px-3.5 py-3">
                      <dt className="text-[12px] text-crm-ink-3">{label}</dt>
                      <dd className="m-0 mt-0.5 text-[22px] font-semibold leading-tight tabular-nums text-crm-ink">{value}</dd>
                      {share && <dd className="m-0 text-[12px] text-crm-ink-3">{share} of all</dd>}
                    </div>
                  ))}
                </dl>
                <div className="mt-3 space-y-1.5 rounded-[16px] bg-white px-3.5 py-3 text-[13px]">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-crm-ink-3">Avg. time on page</span>
                    <b className="font-semibold tabular-nums text-crm-ink">{duration(pick.avgSeconds)}</b>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-crm-ink-3">Pages per visitor</span>
                    <b className="font-semibold tabular-nums text-crm-ink">{pick.visitors ? (pick.views / pick.visitors).toFixed(1) : '—'}</b>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-crm-ink-3">Clicks per visitor</span>
                    <b className="font-semibold tabular-nums text-crm-ink">{pick.visitors ? (pick.clicks / pick.visitors).toFixed(1) : '—'}</b>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-crm-ink-3">Top countries</p>
                {rows.length === 0 ? (
                  <Empty text="No visits in this period yet." />
                ) : (
                  <ol className="m-0 mt-3 list-none space-y-1 p-0">
                    {[...rows]
                      .sort((a, b) => b[metric] - a[metric])
                      .slice(0, 6)
                      .map((r, i) => (
                        <li key={r.name}>
                          <button
                            type="button"
                            onClick={() => choose(r.name)}
                            className="flex w-full items-center gap-3 rounded-full px-3 py-2 text-left text-[14px] transition hover:bg-white"
                          >
                            <span className="w-4 text-[12px] tabular-nums text-crm-ink-3">{i + 1}</span>
                            <span aria-hidden="true">{flag(r.name)}</span>
                            <span className="min-w-0 flex-1 truncate text-crm-ink">{countryName(r.name)}</span>
                            <b className="font-semibold tabular-nums text-crm-ink">{fmt.format(r[metric])}</b>
                          </button>
                        </li>
                      ))}
                  </ol>
                )}
                <p className="mt-3 text-[12.5px] text-crm-ink-3">Ranked by {METRIC_LABEL[metric]}. Click one to see it on the globe.</p>
              </>
            )}
          </div>
        </div>
      </section>

      <DataTable
        noun="countries"
        rows={rows}
        rowKey={(r) => r.name}
        search={(r) => `${countryName(r.name)} ${r.name}`}
        searchLabel="Search countries"
        columns={[
          {
            key: 'country',
            head: 'Country',
            render: (r) => (
              <button type="button" onClick={() => choose(r.name)} className="flex items-center gap-2 text-left font-semibold text-crm-ink hover:underline">
                <span aria-hidden="true">{flag(r.name)}</span>
                {countryName(r.name)}
                {r.name === selected && <Tag tone="info">Selected</Tag>}
              </button>
            ),
          },
          { key: 'visitors', head: 'Visitors', num: true, render: (r) => <b className="font-semibold">{fmt.format(r.visitors)}</b> },
          { key: 'views', head: 'Page views', num: true, render: (r) => fmt.format(r.views) },
          { key: 'clicks', head: 'Clicks', num: true, render: (r) => fmt.format(r.clicks) },
          { key: 'conversions', head: 'Conversions', num: true, render: (r) => fmt.format(r.conversions) },
          { key: 'time', head: 'Avg. time', num: true, render: (r) => duration(r.avgSeconds) },
          {
            key: 'share',
            head: 'Share of visitors',
            width: '170px',
            render: (r) => (
              <div className="flex items-center gap-2">
                <Meter value={t.visitors ? (r.visitors / t.visitors) * 100 : 0} thin className="flex-1" />
                <span className="w-9 text-right text-[12.5px] tabular-nums text-crm-ink-2">{percent(r.visitors, t.visitors)}</span>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
