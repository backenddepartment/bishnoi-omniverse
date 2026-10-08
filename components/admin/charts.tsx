'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The dashboard's chart forms: a trend line for change over time, columns for "when" (hour of day,
 * weekday), ranked bar lists for "which", and a split bar for shares of a whole. Series colours are
 * the palette's main blue and an orange, validated as a pair (dataviz validator: CVD ΔE 26.6,
 * normal 35.4, both at least 3:1 on white). Charts still carry visible values and a table view.
 * Text always stays in ink, never the series colour.
 */
export const SERIES = [
  { key: 'pageviews', name: 'Page views', color: '#0c79e3' },
  { key: 'visitors', name: 'Visitors', color: '#eb6834' },
] as const;

const PRIMARY = SERIES[0].color;

export interface TrendPoint {
  key: string;
  /** Axis label, e.g. "Oct 8" or "14:00". */
  short: string;
  /** Tooltip heading, e.g. "Wed, Oct 8". */
  long: string;
  pageviews: number;
  visitors: number;
}

const fmt = new Intl.NumberFormat('en');

function niceMax(value: number): number {
  if (value <= 4) return 4;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * magnitude * 4 >= value) ?? 10;
  return step * magnitude * 4;
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

/** A small floating readout: value first and strong, the label after it. */
function Tooltip({ x, width, title, rows }: { x: number; width: number; title: string; rows: { color: string; value: number; label: string }[] }) {
  return (
    <div
      className="pointer-events-none absolute top-2 z-10 min-w-[150px] rounded-[14px] border border-crm-rule bg-white px-3.5 py-2.5 shadow-[0_10px_30px_rgba(20,20,20,0.12)]"
      style={x > width / 2 ? { right: width - x + 12 } : { left: x + 12 }}
      aria-live="polite"
    >
      <div className="text-[12px] text-crm-ink-3">{title}</div>
      {rows.map((r) => (
        <div key={r.label} className="mt-1 flex items-center gap-2">
          <span className="h-[2px] w-3 rounded-full" style={{ background: r.color }} />
          <span className="text-[15px] font-semibold tabular-nums text-crm-ink">{fmt.format(r.value)}</span>
          <span className="text-[12px] text-crm-ink-3">{r.label}</span>
        </div>
      ))}
    </div>
  );
}

function TableView({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <details className="mt-3 text-[13px]">
      <summary className="cursor-pointer select-none text-crm-ink-3 hover:text-crm-ink" data-track-ignore>
        Show as table
      </summary>
      <div className="mt-2 max-h-64 overflow-auto rounded-[14px] border border-crm-rule">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-crm-head text-[12px] text-crm-ink-3">
            <tr>
              {head.map((h, i) => (
                <th key={h} className={`px-3 py-2 font-medium ${i ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r[0])} className="border-t border-crm-rule">
                {r.map((c, i) => (
                  <td key={i} className={`px-3 py-1.5 ${i ? 'text-right tabular-nums' : 'text-crm-ink-2'}`}>
                    {typeof c === 'number' ? fmt.format(c) : c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export function TrendChart({ points, height = 260 }: { points: TrendPoint[]; height?: number }) {
  const [wrapRef, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const m = { top: 16, right: 84, bottom: 30, left: 44 };
  const innerW = Math.max(width - m.left - m.right, 10);
  const innerH = height - m.top - m.bottom;
  const max = niceMax(Math.max(1, ...points.map((p) => Math.max(p.pageviews, p.visitors))));
  const n = points.length;
  const x = (i: number) => m.left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v: number) => m.top + innerH - (v / max) * innerH;

  const path = (key: 'pageviews' | 'visitors') =>
    points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join('');

  // About six axis labels whatever the range.
  const every = Math.max(1, Math.ceil(n / 6));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));

  const pick = (clientX: number, rect: DOMRect) => {
    if (!n) return;
    const rel = (clientX - rect.left - m.left) / innerW;
    setActive(Math.min(n - 1, Math.max(0, Math.round(rel * (n - 1)))));
  };

  const last = n - 1;
  const hovered = active != null ? points[active] : null;
  // Direct labels at the line ends, nudged apart when the two values sit close together.
  let endY = SERIES.map((s) => (n ? y(points[last][s.key]) : 0));
  if (Math.abs(endY[0] - endY[1]) < 16) {
    const mid = (endY[0] + endY[1]) / 2;
    endY = endY[0] <= endY[1] ? [mid - 8, mid + 8] : [mid + 8, mid - 8];
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1" aria-hidden="true">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-2 text-[12.5px] text-crm-ink-3">
            <span className="h-[2px] w-4 rounded-full" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>

      <div ref={wrapRef} className="relative">
        {width > 0 && (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={`Page views and visitors over ${n} periods. Use the arrow keys for each value, or open the table below.`}
            tabIndex={0}
            className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-crm-p-200"
            onPointerMove={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
            onPointerLeave={() => setActive(null)}
            onBlur={() => setActive(null)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') setActive((a) => Math.min(last, (a ?? -1) + 1));
              else if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, (a ?? n) - 1));
              else return;
              e.preventDefault();
            }}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={m.left} x2={m.left + innerW} y1={y(t)} y2={y(t)} stroke="#f0f0ee" strokeWidth={1} />
                <text x={m.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-crm-ink-4 text-[11px] tabular-nums">
                  {fmt.format(t)}
                </text>
              </g>
            ))}
            {points.map((p, i) =>
              i % every === 0 || i === last ? (
                <text
                  key={p.key}
                  x={x(i)}
                  y={height - 8}
                  textAnchor={i === 0 ? 'start' : i === last ? 'end' : 'middle'}
                  className="fill-crm-ink-4 text-[11px]"
                >
                  {i === last || last - i >= every * 0.6 ? p.short : ''}
                </text>
              ) : null
            )}

            <path d={`${path('pageviews')}L${x(last)},${y(0)}L${x(0)},${y(0)}Z`} fill={PRIMARY} opacity={0.1} />
            {SERIES.map((s) => (
              <path key={s.key} d={path(s.key)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            ))}

            {n > 0 &&
              SERIES.map((s, i) => (
                <text key={s.key} x={x(last) + 10} y={endY[i]} dy="0.32em" className="fill-crm-ink-2 text-[12px] font-medium">
                  {fmt.format(points[last][s.key])} {s.key === 'pageviews' ? 'views' : 'visitors'}
                </text>
              ))}

            {hovered && active != null && (
              <g pointerEvents="none">
                <line x1={x(active)} x2={x(active)} y1={m.top} y2={m.top + innerH} stroke="#6a6a6a" strokeWidth={1} strokeDasharray="3 3" />
                {SERIES.map((s) => (
                  <circle key={s.key} cx={x(active)} cy={y(hovered[s.key])} r={4.5} fill={s.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </g>
            )}
          </svg>
        )}

        {hovered && active != null && (
          <Tooltip
            x={x(active)}
            width={width}
            title={hovered.long}
            rows={SERIES.map((s) => ({ color: s.color, value: hovered[s.key], label: s.name.toLowerCase() }))}
          />
        )}
      </div>

      <TableView head={['Period', 'Page views', 'Visitors']} rows={points.map((p) => [p.long, p.pageviews, p.visitors])} />
    </div>
  );
}

/**
 * Columns for a fixed set of slots (24 hours, 7 weekdays). Each column is its own hover target,
 * taller than the painted bar; the busiest slot is labelled with its value.
 */
export function ColumnChart({
  data,
  unit,
  height = 170,
}: {
  data: { key: string; label: string; long: string; value: number }[];
  unit: string;
  height?: number;
}) {
  const [wrapRef, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const m = { top: 20, bottom: 24 };
  const innerH = height - m.top - m.bottom;
  const max = Math.max(1, ...data.map((d) => d.value));
  const peak = data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0);
  const slot = width / Math.max(data.length, 1);
  const bar = Math.max(Math.min(slot - 4, 28), 2);
  const every = data.length > 12 ? 3 : 1;
  const hovered = active != null ? data[active] : null;

  return (
    <div>
      <div ref={wrapRef} className="relative">
        {width > 0 && (
          <svg width={width} height={height} role="img" aria-label={`${unit} by ${data.length === 24 ? 'hour of day' : 'weekday'}`} onPointerLeave={() => setActive(null)}>
            <line x1={0} x2={width} y1={m.top + innerH} y2={m.top + innerH} stroke="#e2e2e2" />
            {data.map((d, i) => {
              const h = (d.value / max) * innerH;
              const cx = slot * i + slot / 2;
              return (
                <g key={d.key}>
                  <rect
                    x={cx - bar / 2}
                    y={m.top + innerH - h}
                    width={bar}
                    height={Math.max(h, d.value ? 2 : 0)}
                    rx={Math.min(4, bar / 2)}
                    fill={PRIMARY}
                    opacity={active == null || active === i ? 1 : 0.45}
                  />
                  {i === peak && d.value > 0 && (
                    <text x={cx} y={m.top + innerH - h - 6} textAnchor="middle" className="fill-crm-ink-2 text-[11px] font-semibold tabular-nums">
                      {fmt.format(d.value)}
                    </text>
                  )}
                  {i % every === 0 && (
                    <text x={cx} y={height - 6} textAnchor="middle" className="fill-crm-ink-4 text-[11px]">
                      {d.label}
                    </text>
                  )}
                  {/* Hit target: the whole slot, top to bottom. */}
                  <rect
                    x={slot * i}
                    y={0}
                    width={slot}
                    height={height}
                    fill="transparent"
                    tabIndex={0}
                    aria-label={`${d.long}: ${fmt.format(d.value)} ${unit}`}
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    className="outline-none"
                  />
                </g>
              );
            })}
          </svg>
        )}
        {hovered && active != null && (
          <Tooltip x={slot * active + slot / 2} width={width} title={hovered.long} rows={[{ color: PRIMARY, value: hovered.value, label: unit }]} />
        )}
      </div>
      <TableView head={['When', unit.charAt(0).toUpperCase() + unit.slice(1)]} rows={data.map((d) => [d.long, d.value])} />
    </div>
  );
}

export interface BarRow {
  key: string;
  label: React.ReactNode;
  /** Plain-text label for the hover title. */
  title: string;
  value: number;
  /** Extra figure shown beside the value, e.g. "42%". */
  note?: string;
}

/** A ranked list with a thin bar under each row, all bars on one shared scale. */
export function BarList({ rows, unit }: { rows: BarRow[]; unit: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.key} title={`${r.title}: ${fmt.format(r.value)} ${unit}`}>
          <div className="flex items-baseline justify-between gap-3 text-[14px]">
            <span className="min-w-0 truncate text-crm-ink">{r.label}</span>
            <span className="shrink-0 font-semibold tabular-nums text-crm-ink">
              {fmt.format(r.value)}
              {r.note && <span className="ml-1.5 font-normal text-crm-ink-3">{r.note}</span>}
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-crm-p-100">
            <div className="h-full rounded-full bg-crm-p-400" style={{ width: `${Math.max((r.value / max) * 100, 1.5)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Parts of a whole in one bar, with a 2px gap between parts and a legend that carries the numbers. */
export function SplitBar({ parts, unit }: { parts: { label: string; value: number; color: string }[]; unit: string }) {
  const total = parts.reduce((sum, p) => sum + p.value, 0);
  const pct = (v: number) => (total ? Math.round((v / total) * 100) : 0);
  return (
    <div>
      <div
        className="flex h-2.5 gap-[2px] overflow-hidden rounded-full bg-crm-p-100"
        role="img"
        aria-label={parts.map((p) => `${p.label} ${pct(p.value)}%`).join(', ')}
      >
        {total > 0 &&
          parts
            .filter((p) => p.value > 0)
            .map((p) => <i key={p.label} className="block h-full" style={{ width: `${(p.value / total) * 100}%`, background: p.color }} />)}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] text-crm-ink-3">
        {parts.map((p) => (
          <span key={p.label} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-[2px]" style={{ background: p.color }} />
            {p.label}
            <b className="font-semibold text-crm-ink">{fmt.format(p.value)}</b>
            <span>
              {unit} · {pct(p.value)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
