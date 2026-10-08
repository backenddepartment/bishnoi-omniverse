'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Clock,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Settings,
  UserCog,
  Link2,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MousePointerClick,
  RefreshCw,
  Target,
  Users,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { ANALYTICS_ENDPOINT } from '@/lib/analytics';
import brandMark from '@/app/icon.png';
import type { AdminSession } from './AdminApp';
import type { TrendPoint } from './charts';
import { ConfirmDialog } from './ConfirmDialog';
import { ROLE_INFO, SettingsView, UsersView, initials, type Api } from './accounts';
import { SessionEnded } from './AdminApp';
import { Seg, fmt } from './ui';
import {
  AudienceView,
  ClicksView,
  ConversionsView,
  CountriesView,
  LiveView,
  OverviewView,
  PagesView,
  SourcesView,
  type LiveData,
  type Stats,
  type ViewProps,
} from './views';

/* ------------------------------------------------------------------ *
 * Date ranges
 * ------------------------------------------------------------------ */

const RANGES = [
  { id: 'today', label: 'Today', long: 'day', days: 0 },
  { id: '7d', label: '7 days', long: '7 days', days: 6 },
  { id: '30d', label: '30 days', long: '30 days', days: 29 },
  { id: '90d', label: '90 days', long: '90 days', days: 89 },
  { id: '365d', label: '12 months', long: '12 months', days: 364 },
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
  const shortDay = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' });
  const longDay = new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  while (cursor.getTime() < stats.range.to) {
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
 * Sections
 * ------------------------------------------------------------------ */

type SectionId = 'overview' | 'live' | 'pages' | 'sources' | 'countries' | 'audience' | 'clicks' | 'conversions' | 'users' | 'settings';

const SECTIONS: {
  id: SectionId;
  label: string;
  group: string;
  Icon: typeof Activity;
  title: string;
  description: string;
  /** The analytics view; none for the account pages (Users, Settings), which load their own data. */
  View?: (props: ViewProps) => JSX.Element;
  /** The icon's hover motion. */
  anim: 'pop' | 'beat' | 'flip' | 'wiggle' | 'spin' | 'hop' | 'tap' | 'pulse' | 'gear' | 'nod';
  /** Shown only to admins. */
  adminOnly?: boolean;
}[] = [
  { id: 'overview', label: 'Overview', group: 'Analytics', Icon: LayoutDashboard, title: 'Overview', description: 'How the website is doing at a glance.', View: OverviewView, anim: 'pop' },
  { id: 'live', label: 'Live', group: 'Analytics', Icon: Activity, title: 'Live activity', description: 'Who is on the site right now, and what they just did.', View: LiveView, anim: 'beat' },
  { id: 'pages', label: 'Pages', group: 'Content', Icon: FileText, title: 'Pages', description: 'Which pages people view, how long they stay and how far they read.', View: PagesView, anim: 'flip' },
  { id: 'sources', label: 'Traffic sources', group: 'Content', Icon: Link2, title: 'Traffic sources', description: 'How visitors find the website.', View: SourcesView, anim: 'wiggle' },
  { id: 'countries', label: 'Countries', group: 'Content', Icon: Globe2, title: 'Countries', description: 'Where in the world visitors, clicks and inquiries come from.', View: CountriesView, anim: 'spin' },
  { id: 'audience', label: 'Audience', group: 'Content', Icon: Users, title: 'Audience', description: 'Who visits: where from, on what device, and when.', View: AudienceView, anim: 'hop' },
  { id: 'clicks', label: 'Clicks', group: 'Engagement', Icon: MousePointerClick, title: 'Clicks', description: 'Every link and button people use.', View: ClicksView, anim: 'tap' },
  { id: 'conversions', label: 'Conversions', group: 'Engagement', Icon: Target, title: 'Conversions', description: 'Inquiries sent and products added to a quote.', View: ConversionsView, anim: 'pulse' },
  { id: 'users', label: 'Users', group: 'Administration', Icon: UserCog, title: 'Users', description: 'Who can sign in to the analytics, and what each account may do.', anim: 'nod', adminOnly: true },
  { id: 'settings', label: 'Settings', group: 'Administration', Icon: Settings, title: 'Settings', description: 'Your profile, your password and this session.', anim: 'gear' },
];

const GROUPS = ['Analytics', 'Content', 'Engagement', 'Administration'];

function sectionFromHash(isAdmin: boolean): SectionId {
  const id = window.location.hash.replace('#', '') as SectionId;
  const found = SECTIONS.find((s) => s.id === id);
  return found && (!found.adminOnly || isAdmin) ? id : 'overview';
}

/* ------------------------------------------------------------------ *
 * Dashboard
 * ------------------------------------------------------------------ */

export function Dashboard({
  session,
  api,
  onSignOut,
  onSessionChange,
  productNames,
}: {
  session: AdminSession;
  api: Api;
  onSignOut: () => void;
  onSessionChange: (next: Partial<AdminSession>) => void;
  productNames: Record<string, string>;
}) {
  const me = session.user;
  const isAdmin = me.role === 'admin';
  const [section, setSection] = useState<SectionId>('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [range, setRange] = useState<RangeId>('7d');
  const [stats, setStats] = useState<Stats | null>(null);
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const request = useRef(0);
  const [confirm, setConfirm] = useState<'signout' | 'export' | null>(null);
  // The Worker answered 401: the 12-hour sign-in ran out. Polling stops and a notice explains,
  // instead of dropping the page back to the sign-in screen without a word.
  const [expired, setExpired] = useState(false);
  const expiredRef = useRef(false);

  // The section lives in the URL hash, so a refresh or a shared link opens the same one.
  useEffect(() => {
    const sync = () => {
      setSection(sectionFromHash(isAdmin));
      setMenuOpen(false);
      window.scrollTo({ top: 0 });
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const authed = useCallback(
    async (path: string) => {
      const { from, to } = rangeBounds(range);
      const tz = -new Date().getTimezoneOffset();
      const res = await fetch(`${ANALYTICS_ENDPOINT}${path}?from=${from}&to=${to}&tz=${tz}`, {
        headers: { Authorization: `Bearer ${session.token}` },
        cache: 'no-store',
      });
      if (res.status === 401) {
        expiredRef.current = true;
        setExpired(true);
        throw new Error('Your session has ended. Please sign in again.');
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `The analytics service answered ${res.status}.`);
      }
      return res;
    },
    [range, session.token]
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
      if (document.visibilityState === 'visible' && !expiredRef.current) load();
    }, 15_000);
    return () => clearInterval(timer);
  }, [load]);

  // Who is online now: a small request every 4 seconds while the dashboard is visible, so the
  // pill, the Live page and the globe's live dots keep up with the site within seconds.
  useEffect(() => {
    let stopped = false;
    const poll = async () => {
      if (stopped || expiredRef.current || document.visibilityState !== 'visible') return;
      try {
        const data = (await (await authed('/admin/live')).json()) as LiveData;
        if (!stopped) setLiveData(data);
      } catch {
        /* The next tick tries again; the full refresh shows any lasting error. */
      }
    };
    poll();
    const timer = setInterval(poll, 4_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') poll();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      stopped = true;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [authed]);

  const accountApi = useCallback<Api>(
    async (path, init) => {
      try {
        return await api(path, init);
      } catch (err) {
        if (err instanceof SessionEnded) {
          expiredRef.current = true;
          setExpired(true);
        }
        throw err;
      }
    },
    [api]
  ) as Api;
  const accountPage = section === 'users' || section === 'settings';

  const onlineNow = liveData ? liveData.online.length : stats?.liveVisitors ?? 0;

  const exportCsv = async () => {
    setExporting(true);
    try {
      const blob = await (await authed('/admin/export')).blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bishnoi-analytics-${range}-${dayKey(new Date())}.csv`;
      // In the page while clicked, and the file kept for a minute: Firefox ignores a click on a
      // detached link, and revoking the URL at once can cancel the download before it starts.
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not export.');
    } finally {
      setExporting(false);
      setConfirm(null);
    }
  };

  /** "1 Oct – 8 Oct 2026" for the range being exported. */
  const rangeText = () => {
    const { from, to } = rangeBounds(range);
    const day = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short' });
    const year = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' });
    return range === 'today' ? `today, ${year.format(to)}` : `${day.format(from)} – ${year.format(to)}`;
  };

  const points = useMemo(() => (stats ? fillSeries(stats) : []), [stats]);
  const current = SECTIONS.find((s) => s.id === section) ?? SECTIONS[0];
  const rangeInfo = RANGES.find((r) => r.id === range) ?? RANGES[1];
  const counts: Partial<Record<SectionId, number>> = stats
    ? { live: onlineNow, conversions: stats.totals.conversions }
    : {};

  return (
    <div className="min-h-screen bg-white text-[14px] leading-[1.55] text-crm-ink antialiased">
      {/* Phone: the menu slides over the page. */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-[rgba(20,20,20,0.32)] lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[256px] flex-col border-r border-crm-rule bg-white px-3.5 pb-3.5 pt-[22px] transition-transform lg:translate-x-0 ${
          menuOpen ? 'translate-x-0 shadow-[0_18px_50px_rgba(20,20,20,0.12)]' : '-translate-x-full'
        }`}
        aria-label="Analytics menu"
      >
        <div className="mb-3.5 flex items-center gap-2.5 border-b border-crm-rule px-2.5 pb-4">
          {/* The website's own "B" mark. */}
          <Image src={brandMark} alt="" className="h-9 w-9 shrink-0 object-contain" priority />
          <div className="min-w-0 leading-tight">
            <b className="block truncate text-[14px] font-semibold">Bishnoi Omniverse</b>
            <span className="text-[12px] text-crm-ink-3">Site analytics</span>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="ml-auto grid h-9 w-9 place-items-center rounded-full text-crm-ink-3 hover:bg-crm-p-50 hover:text-crm-p-700 lg:hidden"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <nav className="admin-scroll -mr-2 flex-1 overflow-y-auto pr-2" aria-label="Sections">
          {GROUPS.map((group) => (
            <div key={group}>
              <p className="mx-2.5 mb-1.5 mt-3.5 text-[11.5px] font-semibold uppercase tracking-[0.07em] text-crm-ink-3">{group}</p>
              {SECTIONS.filter((s) => s.group === group && (!s.adminOnly || isAdmin)).map((s) => {
                const active = s.id === section;
                const count = counts[s.id];
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    aria-current={active ? 'page' : undefined}
                    className={`admin-nav-link flex items-center gap-3 rounded-full px-3 py-[9px] text-[14px] transition ${
                      active ? 'bg-crm-p-50 font-medium text-crm-p-700' : 'text-crm-ink-2 hover:bg-crm-hover hover:text-crm-ink'
                    }`}
                  >
                    <s.Icon data-anim={s.anim} className={`admin-nav-icon h-[18px] w-[18px] ${active ? 'text-crm-p' : ''}`} aria-hidden="true" />
                    {s.label}
                    {count != null && count > 0 && (
                      <span className="ml-auto grid h-[22px] min-w-[22px] place-items-center rounded-full bg-crm-p px-[7px] text-[11.5px] tabular-nums text-white">
                        {fmt.format(count)}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-crm-rule pt-2.5">
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="admin-nav-link flex items-center gap-3 rounded-full px-3 py-[9px] text-[14px] text-crm-ink-2 transition hover:bg-crm-hover hover:text-crm-ink"
          >
            <ExternalLink data-anim="out" className="admin-nav-icon h-[18px] w-[18px]" aria-hidden="true" />
            View website
          </a>
          <div className="mt-1.5 flex items-center gap-1 px-1.5 py-1">
            <a
              href="#settings"
              title="Your settings"
              className="-ml-1 flex min-w-0 flex-1 items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition hover:bg-crm-hover"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-crm-p text-[12.5px] font-semibold text-white">
                {initials(me.name)}
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <b className="block truncate text-[14px] font-semibold">{me.name}</b>
                <span className="text-[12px] text-crm-ink-3">{ROLE_INFO[me.role].label}</span>
              </span>
            </a>
            <button
              type="button"
              onClick={() => setConfirm('signout')}
              aria-label="Sign out"
              title="Sign out"
              className="admin-nav-link grid h-10 w-10 place-items-center rounded-full text-crm-ink-3 transition hover:bg-crm-bad-bg hover:text-crm-bad"
            >
              <LogOut data-anim="exit" className="admin-nav-icon h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[256px]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full text-crm-ink-2 hover:bg-crm-p-50 hover:text-crm-p-700 lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <nav className="flex min-w-0 items-center gap-2 text-[13px] text-crm-ink-3" aria-label="Breadcrumb">
              <a href={accountPage ? '#settings' : '#overview'} className="hover:text-crm-ink hover:underline">
                {accountPage ? 'Administration' : 'Analytics'}
              </a>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate text-crm-ink">{current.label}</span>
            </nav>

            <div className="ml-auto flex items-center gap-2">
              {stats && (
                <a
                  href="#live"
                  className="hidden h-[34px] items-center gap-2 rounded-full bg-[#86efac] px-4 text-[13px] font-medium text-[#14532d] transition hover:bg-[#6ee7a0] sm:inline-flex"
                >
                  <span className="relative flex h-[7px] w-[7px]">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
                    <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-current" />
                  </span>
                  <span className="tabular-nums">{onlineNow}</span> online now
                </a>
              )}
              <button
                type="button"
                onClick={load}
                className="inline-flex h-[34px] items-center gap-2 rounded-full border-[1.5px] border-crm-p bg-white px-4 text-[13px] font-medium text-crm-ink transition hover:bg-crm-p-50"
              >
                <RefreshCw className={`h-4 w-4 text-crm-p ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              {isAdmin && (
              <button
                type="button"
                onClick={() => setConfirm('export')}
                disabled={exporting}
                className="inline-flex h-[34px] items-center gap-2 rounded-full bg-crm-p px-4 text-[13px] font-medium text-white transition hover:bg-crm-p-600 disabled:opacity-45"
              >
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-4 pb-16 pt-2 sm:px-6 lg:px-8">
          {/* Page head: the section, then the date range that scopes everything below it. */}
          <div className="flex flex-wrap items-end justify-between gap-x-5 gap-y-3">
            <div>
              <h1 className="text-[30px] font-semibold leading-[1.15] tracking-[-0.02em]">{current.title}</h1>
              <p className="mt-0.5 text-crm-ink-3">{current.description}</p>
            </div>
            {!accountPage && (
              <div className="flex min-w-0 max-w-full flex-col items-start gap-1.5 sm:items-end">
                <Seg label="Date range" value={range} onChange={setRange} options={RANGES.map((r) => ({ id: r.id, label: r.label }))} />
                {stats && <span className="text-[12.5px] text-crm-ink-3">Compared with the previous {rangeInfo.long}</span>}
              </div>
            )}
          </div>

          {error && !accountPage && (
            <p role="alert" className="mt-4 flex items-start gap-3 rounded-[18px] bg-crm-bad-bg px-[18px] py-3.5 text-[13.5px] text-[#7a1810]">
              {error}
            </p>
          )}

          <div className="mt-5">
            {section === 'users' && isAdmin ? (
              <UsersView api={accountApi} me={me} />
            ) : section === 'settings' ? (
              <SettingsView
                api={accountApi}
                me={me}
                expiresAt={session.expiresAt}
                onUser={(user) => onSessionChange({ user })}
                onSession={(next) => onSessionChange(next)}
                onSignOut={() => setConfirm('signout')}
              />
            ) : !stats && loading ? (
              <div className="grid gap-4" aria-label="Loading">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-6">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="h-[132px] animate-pulse rounded-[22px] bg-crm-rule-2" />
                  ))}
                </div>
                <div className="h-[340px] animate-pulse rounded-[22px] bg-crm-rule-2" />
              </div>
            ) : stats ? (
              // Refetch keeps the previous numbers on screen, dimmed, instead of flashing empty.
              <div className={`transition-opacity ${loading ? 'opacity-60' : ''}`}>
                {current.View && (
                  <current.View stats={stats} points={points} productNames={productNames} rangeLabel={rangeInfo.long} live={liveData} />
                )}
              </div>
            ) : null}
          </div>
        </main>
      </div>

      <ConfirmDialog
        open={confirm === 'signout'}
        title="Sign out of the analytics?"
        icon={<LogOut className="h-[18px] w-[18px]" />}
        confirmLabel="Sign out"
        onConfirm={() => {
          setConfirm(null);
          onSignOut();
        }}
        onCancel={() => setConfirm(null)}
      >
        You&apos;ll need the username and password to see the dashboard again. The website keeps
        recording visits while you&apos;re away.
      </ConfirmDialog>

      <ConfirmDialog
        open={confirm === 'export'}
        title="Download the raw events?"
        icon={<Download className="h-[18px] w-[18px]" />}
        confirmLabel={exporting ? 'Preparing…' : 'Download CSV'}
        busy={exporting}
        onConfirm={exportCsv}
        onCancel={() => setConfirm(null)}
      >
        <p className="m-0">
          Every page view, click and conversion from <b className="font-semibold text-crm-ink">{rangeText()}</b>
          {stats ? (
            <>
              {' '}
              — about{' '}
              <b className="font-semibold text-crm-ink">
                {fmt.format(stats.totals.pageviews + stats.totals.clicks + stats.totals.conversions)}
              </b>{' '}
              rows
            </>
          ) : null}
          , as a CSV file for Excel or Google Sheets.
        </p>
        <p className="m-0 mt-2 text-[13px] text-crm-ink-3">
          It holds anonymous visitor ids, pages and countries; no names, emails or IP addresses.
        </p>
      </ConfirmDialog>

      <ConfirmDialog
        open={expired}
        title="Your session has ended"
        icon={<Clock className="h-[18px] w-[18px]" />}
        confirmLabel="Sign in again"
        cancelLabel={null}
        dismissible={false}
        onConfirm={onSignOut}
        onCancel={onSignOut}
      >
        For security, the dashboard signs you out after 12 hours. Sign in again to keep reading the
        analytics.
      </ConfirmDialog>
    </div>
  );
}
