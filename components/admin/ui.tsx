'use client';

import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Search } from 'lucide-react';

/**
 * Building blocks for the analytics dashboard, after the Bishnoi One CRM component sheet
 * (analytics-worker/bishnoi-one-crm-components.html): ink lines, the blue main-colour scale, pill
 * controls, 22px cards, status tags, the segmented filter and a searchable table.
 */

export const fmt = new Intl.NumberFormat('en');

const pad = (n: number) => String(n).padStart(2, '0');

export function duration(seconds: number | null | undefined) {
  if (seconds == null || !Number.isFinite(seconds)) return '—';
  const s = Math.round(seconds);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return m < 60 ? `${m}m ${pad(s % 60)}s` : `${Math.floor(m / 60)}h ${pad(m % 60)}m`;
}

export function percent(part: number, whole: number) {
  return whole ? `${Math.round((part / whole) * 100)}%` : '';
}

/** A white card with a section title (19/600 on the sheet; 17 here, as cards sit in a grid). */
export function Box({
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = 'px-5 pb-5',
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`min-w-0 rounded-[22px] border border-crm-rule bg-white ${className}`}>
      <div className="flex items-start justify-between gap-3 px-5 pb-4 pt-[18px]">
        <div className="min-w-0">
          <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-crm-ink">{title}</h3>
          {subtitle && <p className="mt-0.5 text-[12.5px] text-crm-ink-3">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

/** "View all" link in a card heading: a small outlined pill. */
export function BoxLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex h-[30px] shrink-0 items-center rounded-full border border-crm-rule px-3.5 text-[12.5px] font-medium text-crm-ink-2 transition hover:border-crm-ink hover:text-crm-ink"
    >
      {children}
    </a>
  );
}

/**
 * A figure card: name, what it covers, the number, and where it stands against the previous
 * period. The page's main figure wears a 1.5px outline in the main blue; the rest are soft.
 */
export function StatCard({
  label,
  sub,
  value,
  now,
  before,
  note,
  lowerIsBetter = false,
  primary = false,
  bar,
}: {
  label: string;
  sub?: string;
  value: string;
  now?: number;
  before?: number;
  note?: string;
  lowerIsBetter?: boolean;
  primary?: boolean;
  /** 0-100: a progress bar under the number. */
  bar?: number;
}) {
  const change = now != null && before != null && before > 0 ? ((now - before) / before) * 100 : null;
  const up = (change ?? 0) >= 0;
  const good = change == null || Math.abs(change) < 0.5 ? null : up !== lowerIsBetter;
  return (
    <div
      className={`min-w-0 rounded-[22px] bg-white px-5 py-[18px] ${
        primary ? 'border-[1.5px] border-crm-p' : 'border border-crm-rule'
      }`}
    >
      <h3 className="text-[15px] font-semibold text-crm-ink">{label}</h3>
      {sub && <p className="mt-0.5 text-[12.5px] text-crm-ink-3">{sub}</p>}
      <div className="mt-2.5 text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] tabular-nums text-crm-ink">{value}</div>
      {bar != null && <Meter value={bar} className="mt-3.5" />}
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-crm-ink-3">
        {now != null &&
          (change == null ? (
            <span>No earlier data</span>
          ) : (
            <Tag tone={good == null ? 'mute' : good ? 'good' : 'bad'}>
              {up ? <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /> : <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />}
              {up ? '+' : '−'}
              {Math.abs(change).toFixed(change !== 0 && Math.abs(change) < 10 ? 1 : 0)}%
            </Tag>
          ))}
        {note && <span>{note}</span>}
      </div>
    </div>
  );
}

/** The sheet's progress bar: 8px, a p-100 track and a p-400 fill. */
export function Meter({ value, className = '', thin = false }: { value: number; className?: string; thin?: boolean }) {
  return (
    <div className={`${thin ? 'h-1.5' : 'h-2'} overflow-hidden rounded-full bg-crm-p-100 ${className}`}>
      <i className="block h-full rounded-full bg-crm-p-400" style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
    </div>
  );
}

type Tone = 'good' | 'bad' | 'warn' | 'info' | 'mute' | 'outline';

const TONES: Record<Tone, string> = {
  good: 'bg-crm-good-bg text-crm-good',
  bad: 'bg-crm-bad-bg text-crm-bad',
  warn: 'bg-crm-warn-bg text-crm-warn',
  info: 'bg-crm-info-bg text-crm-info',
  mute: 'bg-crm-rule-2 text-crm-ink-2',
  outline: 'border border-crm-ink bg-white text-crm-ink',
};

/** A short status label. Never colour alone: the words always say it. */
export function Tag({ tone = 'mute', dot = false, children }: { tone?: Tone; dot?: boolean; children: React.ReactNode }) {
  return (
    <span className={`inline-flex h-[26px] items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[12.5px] font-medium ${TONES[tone]}`}>
      {dot && <span className="h-[7px] w-[7px] rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}

/** The segmented filter: a white pill track, the chosen option in the main colour. */
export function Seg<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { id: T; label: string; count?: number }[];
  onChange: (id: T) => void;
  label: string;
}) {
  return (
    <div className="inline-flex max-w-full gap-0.5 overflow-x-auto rounded-full border border-crm-rule bg-white p-1" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={`whitespace-nowrap rounded-full px-4 py-[7px] text-[13px] transition ${
            value === o.id ? 'bg-crm-p text-white' : 'text-crm-ink-2 hover:bg-crm-hover hover:text-crm-ink'
          }`}
        >
          {o.label}
          {o.count != null && <span className="ml-1.5 text-[11.5px] opacity-70">{fmt.format(o.count)}</span>}
        </button>
      ))}
    </div>
  );
}

export function Empty({ text = 'No data for this period yet.' }: { text?: string }) {
  return <p className="px-4 py-8 text-center text-[13px] text-crm-ink-3">{text}</p>;
}

/** The sheet's line icon in a circle: white or soft blue, 1.5px ink ring. */
export function IconCircle({ children, tone = 'plain' }: { children: React.ReactNode; tone?: 'plain' | 'soft' }) {
  return (
    <span
      className={`grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full border-[1.5px] border-crm-ink text-crm-ink ${
        tone === 'soft' ? 'bg-crm-p-200' : 'bg-white'
      }`}
    >
      {children}
    </span>
  );
}

export interface Column<Row> {
  key: string;
  head: string;
  /** Right-aligned, tabular figures. */
  num?: boolean;
  width?: string;
  render: (row: Row) => React.ReactNode;
}

/**
 * The sheet's table: a toolbar with a pill search box and filters, plain headings, soft blue hover
 * rows, and a count of what is showing.
 */
export function DataTable<Row>({
  rows,
  columns,
  rowKey,
  search,
  searchLabel,
  tools,
  noun,
  maxHeight,
}: {
  rows: Row[];
  columns: Column<Row>[];
  rowKey: (row: Row) => string;
  /** Text a row is searched by. Without it there is no search box. */
  search?: (row: Row) => string;
  searchLabel?: string;
  tools?: React.ReactNode;
  noun: string;
  maxHeight?: number;
}) {
  const [query, setQuery] = useState('');
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q && search ? rows.filter((r) => search(r).toLowerCase().includes(q)) : rows;
  }, [rows, query, search]);

  return (
    <div className="min-w-0 overflow-hidden rounded-[22px] border border-crm-rule bg-white">
      {(search || tools) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-crm-rule px-[18px] py-4">
          {search ? (
            <label className="relative w-[320px] max-w-full">
              <Search className="pointer-events-none absolute left-[18px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-crm-ink-3" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchLabel ?? `Search ${noun}`}
                aria-label={searchLabel ?? `Search ${noun}`}
                className="h-10 w-full rounded-full border border-crm-outline bg-white pl-[46px] pr-5 text-[14px] text-crm-ink outline-none transition placeholder:text-crm-ink-4 hover:border-crm-ink-3 focus:border-crm-ink focus:shadow-[0_0_0_3px_#b1d4f6]"
              />
            </label>
          ) : (
            <span />
          )}
          {tools}
        </div>
      )}
      <div className="overflow-auto" style={maxHeight ? { maxHeight } : undefined}>
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead className="sticky top-0 z-[1]">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={c.width ? { width: c.width } : undefined}
                  className={`whitespace-nowrap border-b border-crm-rule bg-crm-head px-[18px] py-3 text-[12px] font-medium text-crm-ink-3 ${c.num ? 'text-right' : ''}`}
                >
                  {c.head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => (
              <tr key={rowKey(row)} className="border-b border-crm-rule last:border-0 hover:bg-crm-p-50">
                {columns.map((c) => (
                  <td key={c.key} className={`px-[18px] py-3.5 align-middle text-[14px] text-crm-ink ${c.num ? 'text-right tabular-nums' : ''}`}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <Empty text={query ? `Nothing matches “${query}”.` : undefined} />}
      </div>
      <div className="border-t border-crm-rule px-[18px] py-3 text-[13px] text-crm-ink-3">
        {shown.length === rows.length ? `${fmt.format(rows.length)} ${noun}` : `${fmt.format(shown.length)} of ${fmt.format(rows.length)} ${noun}`}
      </div>
    </div>
  );
}
