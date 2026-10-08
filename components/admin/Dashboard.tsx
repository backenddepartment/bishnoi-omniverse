'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  LogOut,
  Mail,
  MessageCircle,
  MousePointerClick,
  Phone,
  RefreshCw,
  Send,
  ShoppingCart,
} from 'lucide-react';
import { ANALYTICS_ENDPOINT } from '@/lib/analytics';
import type { AdminSession } from './AdminApp';
import { BarList, TrendChart, type TrendPoint } from './charts';

/* ------------------------------------------------------------------ *
 * Data from GET /admin/stats (analytics-worker/src/index.js)
 * ------------------------------------------------------------------ */

interface Totals {
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

interface Stats {
  range: { from: number; to: number; tz: number; hourly: boolean };
  totals: Totals;
  previous: Totals;
  liveVisitors: number;
  series: { bucket: string; pageviews: number; visitors: number; clicks: number }[];
  pages: { path: string; title: string | null; views: number; visitors: number; avgSeconds: number | null; avgScroll: number | null }[];
  entryPages: { name: string; sessions: number }[];
  referrers: { name: string; sessions: number }[];
  campaigns: { source: string; medium: string; campaign: string; sessions: number }[];
  countries: Breakdown[];
  devices: Breakdown[];
  browsers: Breakdown[];
  systems: Breakdown[];
  clicks: { label: string; target: string; category: string; clicks: number; visitors: number }[];
  clickCategories: { name: string; clicks: number }[];
  conversions: { name: string; count: number; visitors: number }[];
  quotedProducts: { name: string; count: number }[];
  recent: { ts: number; type: string; path: string; label: string | null; target: string | null; country: string | null; device: string | null; browser: string | null }[];
}

interface Breakdown {
  name: string;
  visitors: number;
  views: number;
}

/* ------------------------------------------------------------------ *
 * Date ranges
 * ------------------------------------------------------------------ */

const RANGES = [
  { id: 'today', label: 'Today', days: 0 },
  { id: '7d', label: 'Last 7 days', days: 6 },
  { id: '30d', label: 'Last 30 days', days: 29 },
  { id: '90d', label: 'Last 90 days', days: 89 },
  { id: '365d', label: 'Last 12 months', days: 364 },
] as const;

type RangeId = (typeof RANGES)[number]['id'];

/** Local midnight `days` days ago, through now. */
function rangeBounds(id: RangeId) {
  const days = RANGES.find((r) => r.id === id)?.days ?? 6;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - days);
  return { from: start.getTime(), to: Date.now() };
}

const pad = (n: number) => String(n).padStart(2, '0');
const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/**
 * Every hour or day in the range, including the empty ones the Worker leaves out, keyed the way the
 * Worker buckets them (the viewer's local time).
 */
function fillSeries(stats: Stats): TrendPoint[] {
  const byKey = new Map(stats.series.map((s) => [s.bucket, s]));
  const points: TrendPoint[] = [];
  const cursor = new Date(stats.range.from);
  const end = stats.range.to;
  const shortDay = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' });
  const longDay = new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  while (cursor.getTime() < end) {
    const key = stats.range.hourly ? `${dayKey(cursor)} ${pad(cursor.getHours())}:00` : dayKey(cursor);
    const row = byKey.get(key);
    points.push({
      key,
      short: stats.range.hourly ? `${pad(cursor.getHours())}:00` : shortDay.format(cursor),
      long: stats.range.hourly ? `${shortDay.format(cursor)}, ${pad(cursor.getHours())}:00` : longDay.format(cursor),
      pageviews: row?.pageviews ?? 0,
      visitors: row?.visitors ?? 0,
    });
    if (stats.range.hourly) cursor.setHours(cursor.getHours() + 1);
    else cursor.setDate(cursor.getDate() + 1);
  }
  return points;
}

/* ------------------------------------------------------------------ *
 * Formatting
 * ------------------------------------------------------------------ */

const fmt = new Intl.NumberFormat('en');

function duration(seconds: number | null | undefined) {
  if (seconds == null || !Number.isFinite(seconds)) return '—';
  const s = Math.round(seconds);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return m < 60 ? `${m}m ${pad(s % 60)}s` : `${Math.floor(m / 60)}h ${pad(m % 60)}m`;
}

let regionNames: Intl.DisplayNames | null = null;
function countryName(code: string) {
  if (!/^[A-Z]{2}$/.test(code) || code === 'XX' || code === 'T1') return code === 'T1' ? 'Tor network' : 'Unknown';
  try {
    regionNames ??= new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

function flag(code: string) {
  return /^[A-Z]{2}$/.test(code) ? String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0))) : '🌐';
}

function timeAgo(ts: number) {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function percent(part: number, whole: number) {
  return whole ? `${Math.round((part / whole) * 100)}%` : '';
}

const CLICK_KINDS: Record<string, { label: string; Icon: typeof Eye }> = {
  internal: { label: 'Internal link', Icon: ArrowUpRight },
  outbound: { label: 'External link', Icon: ExternalLink },
  email: { label: 'Email', Icon: Mail },
  phone: { label: 'Phone', Icon: Phone },
  whatsapp: { label: 'WhatsApp', Icon: MessageCircle },
  download: { label: 'Download', Icon: Download },
  button: { label: 'Button', Icon: MousePointerClick },
};

const capitalise = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);

/* ------------------------------------------------------------------ *
 * Dashboard
 * ------------------------------------------------------------------ */

export function Dashboard({
  session,
  onSignOut,
  productNames,
}: {
  session: AdminSession;
  onSignOut: () => void;
  productNames: Record<string, string>;
}) {
  const [range, setRange] = useState<RangeId>('7d');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const request = useRef(0);

  const authed = useCallback(
    async (path: string) => {
      const { from, to } = rangeBounds(range);
      const tz = -new Date().getTimezoneOffset();
      const res = await fetch(`${ANALYTICS_ENDPOINT}${path}?from=${from}&to=${to}&tz=${tz}`, {
        headers: { Authorization: `Bearer ${session.token}` },
        cache: 'no-store',
      });
      if (res.status === 401) {
        onSignOut();
        throw new Error('Your session has ended. Please sign in again.');
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `The analytics service answered ${res.status}.`);
      }
      return res;
    },
    [range, session.token, onSignOut]
  );

  const load = useCallback(async () => {
    const id = ++request.current;
    setLoading(true);
    try {
      const data = (await (await authed('/admin/stats')).json()) as Stats;
      if (id === request.current) {
        setStats(data);
        setError('');
      }
    } catch (err) {
      if (id === request.current) setError(err instanceof Error ? err.message : 'Could not load analytics.');
    } finally {
      if (id === request.current) setLoading(false);
    }
  }, [authed]);

  useEffect(() => {
    load();
    // Live: new visits appear within seconds while the dashboard is open and visible.
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') load();
    }, 15_000);
    return () => clearInterval(timer);
  }, [load]);

  const exportCsv = async () => {
    setExporting(true);
    try {
      const blob = await (await authed('/admin/export')).blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bishnoi-analytics-${range}-${dayKey(new Date())}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not export.');
    } finally {
      setExporting(false);
    }
  };

  const points = useMemo(() => (stats ? fillSeries(stats) : []), [stats]);
  const t = stats?.totals;
  const p = stats?.previous;

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-tint text-accent-dark">
              <BarChart3 className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <div className="font-serif text-[17px] font-semibold text-ink">Site analytics</div>
              <div className="text-[12px] text-muted">bishnoiomniverse.com</div>
            </div>
          </div>

          {stats && (
            <span className="ml-1 flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 text-[12px] text-ink-soft">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0b8457] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0b8457]" />
              </span>
              <span className="font-semibold tabular-nums text-ink">{stats.liveVisitors}</span> online now
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={load}
              className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[13px] font-medium text-ink-soft transition hover:bg-paper"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              type="button"
              onClick={exportCsv}
              disabled={exporting}
              className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[13px] font-medium text-ink-soft transition hover:bg-paper disabled:opacity-60"
            >
              {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Download className="h-3.5 w-3.5" aria-hidden="true" />}
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="flex items-center gap-1.5 rounded-lg bg-ink px-3 py-2 text-[13px] font-medium text-white transition hover:bg-ink-2"
              title={`Signed in as ${session.username}`}
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 pb-16 pt-6 sm:px-6">
        {/* Filters: one row, above everything they scope. */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Date range">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              aria-pressed={range === r.id}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
                range === r.id ? 'bg-ink text-white' : 'border border-line bg-surface text-ink-soft hover:bg-paper-2'
              }`}
            >
              {r.label}
            </button>
          ))}
          {stats && (
            <span className="ml-auto text-[12px] text-muted">
              Compared with the previous {RANGES.find((r) => r.id === range)?.label.replace('Last ', '').toLowerCase()}
            </span>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">
            {error}
          </p>
        )}

        {!stats && loading && (
          <div className="flex items-center justify-center py-32 text-muted">
            <Loader2 className="h-6 w-6 animate-spin" aria-label="Loading" />
          </div>
        )}

        {stats && t && p && (
          // Refetch keeps the previous numbers on screen, dimmed, instead of flashing empty.
          <div className={`transition-opacity ${loading ? 'opacity-60' : ''}`}>
            {/* Headline numbers */}
            <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              <Stat label="Visitors" value={fmt.format(t.visitors)} now={t.visitors} before={p.visitors}
                sub={`${fmt.format(t.returningVisitors ?? 0)} returning`} />
              <Stat label="Page views" value={fmt.format(t.pageviews)} now={t.pageviews} before={p.pageviews}
                sub={t.sessions ? `${(t.pageviews / t.sessions).toFixed(1)} per visit` : undefined} />
              <Stat label="Avg. time on page" value={duration(t.avgSeconds)} now={t.avgSeconds ?? 0} before={p.avgSeconds ?? 0}
                sub={t.avgScroll != null ? `${Math.round(t.avgScroll)}% scrolled` : undefined} />
              <Stat label="Bounce rate" value={`${t.bounceRate}%`} now={t.bounceRate} before={p.bounceRate} lowerIsBetter
                sub="left after one page" />
              <Stat label="Clicks" value={fmt.format(t.clicks)} now={t.clicks} before={p.clicks}
                sub={t.visitors ? `${(t.clicks / t.visitors).toFixed(1)} per visitor` : undefined} />
              <Stat label="Conversions" value={fmt.format(t.conversions)} now={t.conversions} before={p.conversions}
                sub="inquiries + quote adds" />
            </section>

            {/* Trend */}
            <Panel className="mt-4" title="Traffic over time" subtitle={stats.range.hourly ? 'By hour, your local time' : 'By day, your local time'}>
              {t.pageviews === 0 ? <Empty /> : <TrendChart points={points} />}
            </Panel>

            {/* Pages */}
            <Panel className="mt-4" title="Top pages" subtitle="Most viewed, with how long people stayed and how far they read">
              {stats.pages.length === 0 ? (
                <Empty />
              ) : (
                <div className="-mx-5 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-[13px]">
                    <thead className="text-[12px] text-muted">
                      <tr className="border-b border-line">
                        <th className="px-5 py-2 font-medium">Page</th>
                        <th className="px-3 py-2 text-right font-medium">Views</th>
                        <th className="px-3 py-2 text-right font-medium">Visitors</th>
                        <th className="px-3 py-2 text-right font-medium">Avg. time</th>
                        <th className="px-5 py-2 text-right font-medium">Scroll depth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.pages.map((row) => (
                        <tr key={row.path} className="border-b border-line/70 last:border-0 hover:bg-paper">
                          <td className="max-w-[360px] px-5 py-2.5">
                            <a href={row.path} target="_blank" rel="noopener" className="block truncate font-medium text-ink hover:text-accent-dark">
                              {row.path}
                            </a>
                            {row.title && <div className="truncate text-[12px] text-muted">{row.title.replace(/\s*\|\s*Bishnoi Omniverse.*$/, '')}</div>}
                          </td>
                          <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-ink">{fmt.format(row.views)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-ink-soft">{fmt.format(row.visitors)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-ink-soft">{duration(row.avgSeconds)}</td>
                          <td className="px-5 py-2.5 text-right tabular-nums text-ink-soft">
                            {row.avgScroll != null ? `${Math.round(row.avgScroll)}%` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>

            {/* Acquisition */}
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <Panel title="Traffic sources" subtitle="Visits arriving from other sites">
                {stats.referrers.length === 0 ? (
                  <Empty text="No referrals yet — visits so far were direct or from bookmarks." />
                ) : (
                  <BarList unit="visits" rows={stats.referrers.map((r) => ({ key: r.name, label: r.name, title: r.name, value: r.sessions }))} />
                )}
              </Panel>
              <Panel title="Landing pages" subtitle="Where visits start">
                {stats.entryPages.length === 0 ? (
                  <Empty />
                ) : (
                  <BarList unit="visits" rows={stats.entryPages.map((r) => ({ key: r.name, label: r.name, title: r.name, value: r.sessions }))} />
                )}
              </Panel>
              <Panel title="Campaigns" subtitle="Links tagged with utm_source / utm_campaign">
                {stats.campaigns.length === 0 ? (
                  <Empty text="No tagged links used yet." />
                ) : (
                  <BarList
                    unit="visits"
                    rows={stats.campaigns.map((c) => {
                      const name = [c.source, c.medium, c.campaign].filter(Boolean).join(' / ');
                      return { key: name, label: name, title: name, value: c.sessions };
                    })}
                  />
                )}
              </Panel>
            </div>

            {/* Clicks */}
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <Panel className="lg:col-span-2" title="Most clicked" subtitle="Links and buttons, by number of clicks">
                {stats.clicks.length === 0 ? (
                  <Empty />
                ) : (
                  <div className="-mx-5 max-h-[460px] overflow-auto">
                    <table className="w-full min-w-[560px] text-left text-[13px]">
                      <thead className="sticky top-0 bg-surface text-[12px] text-muted">
                        <tr className="border-b border-line">
                          <th className="px-5 py-2 font-medium">Clicked</th>
                          <th className="px-3 py-2 font-medium">Type</th>
                          <th className="px-3 py-2 text-right font-medium">Clicks</th>
                          <th className="px-5 py-2 text-right font-medium">Visitors</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.clicks.map((c) => {
                          const kind = CLICK_KINDS[c.category] ?? CLICK_KINDS.button;
                          return (
                            <tr key={`${c.label}|${c.target}|${c.category}`} className="border-b border-line/70 last:border-0 hover:bg-paper">
                              <td className="max-w-[340px] px-5 py-2.5">
                                <div className="truncate font-medium text-ink">{c.label}</div>
                                {c.target && <div className="truncate text-[12px] text-muted">{c.target}</div>}
                              </td>
                              <td className="px-3 py-2.5">
                                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-paper-2 px-2 py-0.5 text-[12px] text-ink-soft">
                                  <kind.Icon className="h-3 w-3" aria-hidden="true" />
                                  {kind.label}
                                </span>
                              </td>
                              <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-ink">{fmt.format(c.clicks)}</td>
                              <td className="px-5 py-2.5 text-right tabular-nums text-ink-soft">{fmt.format(c.visitors)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Panel>
              <Panel title="Clicks by type" subtitle="Where clicks lead">
                {stats.clickCategories.length === 0 ? (
                  <Empty />
                ) : (
                  <BarList
                    unit="clicks"
                    rows={stats.clickCategories.map((c) => {
                      const kind = CLICK_KINDS[c.name] ?? CLICK_KINDS.button;
                      return {
                        key: c.name,
                        label: (
                          <span className="inline-flex items-center gap-1.5">
                            <kind.Icon className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                            {kind.label}
                          </span>
                        ),
                        title: kind.label,
                        value: c.clicks,
                        note: percent(c.clicks, t.clicks),
                      };
                    })}
                  />
                )}
              </Panel>
            </div>

            {/* Conversions */}
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Panel title="Conversions" subtitle="Inquiries sent and products added to a quote">
                {stats.conversions.length === 0 ? (
                  <Empty />
                ) : (
                  <ul className="divide-y divide-line">
                    {stats.conversions.map((c) => {
                      const Icon = c.name === 'Added to quote' ? ShoppingCart : Send;
                      return (
                        <li key={c.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-tint text-accent-dark">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-[14px] font-medium text-ink">{c.name}</div>
                            <div className="text-[12px] text-muted">
                              by {fmt.format(c.visitors)} visitor{c.visitors === 1 ? '' : 's'}
                              {t.visitors ? ` · ${percent(c.visitors, t.visitors)} of all visitors` : ''}
                            </div>
                          </div>
                          <span className="text-[20px] font-semibold tabular-nums text-ink">{fmt.format(c.count)}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Panel>
              <Panel title="Products added to quote" subtitle="Most requested catalog items">
                {stats.quotedProducts.length === 0 ? (
                  <Empty />
                ) : (
                  <BarList
                    unit="adds"
                    rows={stats.quotedProducts.map((q) => ({
                      key: q.name,
                      label: productNames[q.name] ?? q.name,
                      title: productNames[q.name] ?? q.name,
                      value: q.count,
                    }))}
                  />
                )}
              </Panel>
            </div>

            {/* Audience */}
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Panel title="Countries" subtitle="Visitors">
                {stats.countries.length === 0 ? (
                  <Empty />
                ) : (
                  <BarList
                    unit="visitors"
                    rows={stats.countries.map((c) => ({
                      key: c.name,
                      label: (
                        <span>
                          <span className="mr-1.5" aria-hidden="true">{flag(c.name)}</span>
                          {countryName(c.name)}
                        </span>
                      ),
                      title: countryName(c.name),
                      value: c.visitors,
                      note: percent(c.visitors, t.visitors),
                    }))}
                  />
                )}
              </Panel>
              {(
                [
                  ['Devices', stats.devices],
                  ['Browsers', stats.browsers],
                  ['Operating systems', stats.systems],
                ] as const
              ).map(([title, rows]) => (
                <Panel key={title} title={title} subtitle="Visitors">
                  {rows.length === 0 ? (
                    <Empty />
                  ) : (
                    <BarList
                      unit="visitors"
                      rows={rows.map((r) => ({
                        key: r.name,
                        label: capitalise(r.name),
                        title: capitalise(r.name),
                        value: r.visitors,
                        note: percent(r.visitors, t.visitors),
                      }))}
                    />
                  )}
                </Panel>
              ))}
            </div>

            {/* Live feed */}
            <Panel className="mt-4" title="Recent activity" subtitle="The latest page views, clicks and conversions, newest first">
              {stats.recent.length === 0 ? (
                <Empty />
              ) : (
                <ul className="max-h-[420px] divide-y divide-line overflow-auto">
                  {stats.recent.map((e, i) => {
                    const Icon = e.type === 'pageview' ? Eye : e.type === 'click' ? MousePointerClick : e.type === 'conversion' ? Send : FileText;
                    const what =
                      e.type === 'pageview'
                        ? 'Viewed'
                        : e.type === 'click'
                          ? `Clicked “${e.label ?? ''}”`
                          : e.label === 'Added to quote'
                            ? `Added “${productNames[e.target ?? ''] ?? e.target}” to quote`
                            : `${e.label}${e.target ? ` (${e.target})` : ''}`;
                    return (
                      <li key={`${e.ts}-${i}`} className="flex items-center gap-3 py-2.5 text-[13px]">
                        <Icon className={`h-4 w-4 shrink-0 ${e.type === 'conversion' ? 'text-accent-dark' : 'text-muted'}`} aria-hidden="true" />
                        <div className="min-w-0 flex-1 truncate">
                          <span className="text-ink">{what}</span>
                          <span className="text-muted"> on {e.path}</span>
                        </div>
                        <span className="hidden shrink-0 text-[12px] text-muted sm:inline">
                          {e.country ? `${flag(e.country)} ` : ''}
                          {[e.device && capitalise(e.device), e.browser].filter(Boolean).join(' · ')}
                        </span>
                        <span className="w-16 shrink-0 text-right text-[12px] tabular-nums text-muted">{timeAgo(e.ts)}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          </div>
        )}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Pieces
 * ------------------------------------------------------------------ */

function Panel({
  title,
  subtitle,
  className = '',
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`min-w-0 rounded-2xl border border-line bg-surface p-5 ${className}`}>
      <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
      {subtitle && <p className="mt-0.5 text-[12px] text-muted">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Empty({ text = 'No data for this period yet.' }: { text?: string }) {
  return <p className="py-6 text-center text-[13px] text-muted">{text}</p>;
}

/** A headline number with its change against the previous period of the same length. */
function Stat({
  label,
  value,
  now,
  before,
  sub,
  lowerIsBetter = false,
}: {
  label: string;
  value: string;
  now: number;
  before: number;
  sub?: string;
  lowerIsBetter?: boolean;
}) {
  const change = before > 0 ? ((now - before) / before) * 100 : null;
  const up = (change ?? 0) >= 0;
  const good = change == null || Math.abs(change) < 0.5 ? null : up !== lowerIsBetter;
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="text-[12px] font-medium text-muted">{label}</div>
      <div className="mt-1.5 text-[26px] font-semibold leading-none tabular-nums text-ink">{value}</div>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px]">
        {change == null ? (
          <span className="text-muted">No earlier data</span>
        ) : (
          <span
            className={`inline-flex items-center gap-0.5 font-medium ${
              good == null ? 'text-muted' : good ? 'text-[#086a45]' : 'text-[#b42318]'
            }`}
          >
            {up ? <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /> : <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />}
            {up ? '+' : '−'}
            {Math.abs(change).toFixed(change !== 0 && Math.abs(change) < 10 ? 1 : 0)}%
          </span>
        )}
        {sub && <span className="text-muted">{sub}</span>}
      </div>
    </div>
  );
}
