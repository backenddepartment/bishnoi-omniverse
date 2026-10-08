'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The dashboard's two chart forms: a trend line for change over time, and ranked bar lists for
 * "which pages / sources / countries". Colours are the validated categorical slots 1 (blue) and
 * 2 (orange); text always stays in the ink tokens, never the series colour.
 */
export const SERIES = [
  { key: 'pageviews', name: 'Page views', color: '#2a78d6' },
  { key: 'visitors', name: 'Visitors', color: '#eb6834' },
] as const;

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

export function TrendChart({ points }: { points: TrendPoint[] }) {
  const [wrapRef, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const height = 260;
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
          <span key={s.key} className="flex items-center gap-2 text-[13px] text-ink-soft">
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
            className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
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
                <line x1={m.left} x2={m.left + innerW} y1={y(t)} y2={y(t)} stroke="#ece6da" strokeWidth={1} />
                <text x={m.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted text-[11px] tabular-nums">
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
                  className="fill-muted text-[11px]"
                >
                  {i === last || (last - i >= every * 0.6) ? p.short : ''}
                </text>
              ) : null
            )}

            <path d={`${path('pageviews')}L${x(last)},${y(0)}L${x(0)},${y(0)}Z`} fill={SERIES[0].color} opacity={0.08} />
            {SERIES.map((s) => (
              <path key={s.key} d={path(s.key)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            ))}

            {n > 0 &&
              SERIES.map((s, i) => (
                <text key={s.key} x={x(last) + 10} y={endY[i]} dy="0.32em" className="fill-ink-soft text-[12px] font-medium">
                  {fmt.format(points[last][s.key])} {s.key === 'pageviews' ? 'views' : 'visitors'}
                </text>
              ))}

            {hovered && active != null && (
              <g pointerEvents="none">
                <line x1={x(active)} x2={x(active)} y1={m.top} y2={m.top + innerH} stroke="#4a463d" strokeWidth={1} strokeDasharray="3 3" />
                {SERIES.map((s) => (
                  <circle key={s.key} cx={x(active)} cy={y(hovered[s.key])} r={4.5} fill={s.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </g>
            )}
          </svg>
        )}

        {hovered && active != null && (
          <div
            className="pointer-events-none absolute top-2 z-10 min-w-[150px] rounded-lg border border-line bg-surface px-3 py-2.5 shadow-lg"
            style={
              x(active) > width / 2
                ? { right: width - x(active) + 12 }
                : { left: x(active) + 12 }
            }
            aria-live="polite"
          >
            <div className="text-[12px] text-muted">{hovered.long}</div>
            {SERIES.map((s) => (
              <div key={s.key} className="mt-1 flex items-center gap-2">
                <span className="h-[2px] w-3 rounded-full" style={{ background: s.color }} />
                <span className="text-[15px] font-semibold tabular-nums text-ink">{fmt.format(hovered[s.key])}</span>
                <span className="text-[12px] text-muted">{s.name.toLowerCase()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <details className="mt-3 text-[13px]">
        <summary className="cursor-pointer select-none text-muted hover:text-ink" data-track-ignore>
          Show as table
        </summary>
        <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-line">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-paper-2 text-[12px] text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">Period</th>
                <th className="px-3 py-2 text-right font-medium">Page views</th>
                <th className="px-3 py-2 text-right font-medium">Visitors</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.key} className="border-t border-line">
                  <td className="px-3 py-1.5 text-ink-soft">{p.long}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{fmt.format(p.pageviews)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{fmt.format(p.visitors)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
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
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.key} title={`${r.title}: ${fmt.format(r.value)} ${unit}`}>
          <div className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className="min-w-0 truncate text-ink">{r.label}</span>
            <span className="shrink-0 tabular-nums text-ink-soft">
              {fmt.format(r.value)}
              {r.note && <span className="ml-1.5 text-muted">{r.note}</span>}
            </span>
          </div>
          <div className="mt-1 h-[6px] rounded-r bg-paper-2">
            <div
              className="h-full rounded-r"
              style={{ width: `${Math.max((r.value / max) * 100, 1.5)}%`, background: SERIES[0].color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
