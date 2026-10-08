'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { geoCentroid, geoGraticule10, geoOrthographic, geoPath, type GeoPermissibleObjects } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import type { Feature, Geometry } from 'geojson';
import countries from 'i18n-iso-countries';
import { fmt } from './ui';

/**
 * An interactive D3 globe: countries shaded by one figure (visitors, page views, clicks or
 * conversions) on a single-hue blue ramp from the dashboard palette, light for few and dark for
 * many, neutral grey for none. Drag to turn it, hover a country for its numbers, click one to
 * select it (the globe turns to face it). Countries with someone on the site right now pulse.
 *
 * Country shapes are world-atlas's 1:110m TopoJSON, loaded on demand so the rest of the dashboard
 * never waits for it. The events carry ISO alpha-2 codes (from Cloudflare); world-atlas uses ISO
 * numeric ids, so i18n-iso-countries maps between the two.
 */

export interface CountryStat {
  name: string;
  visitors: number;
  views: number;
  clicks: number;
  conversions: number;
  avgSeconds: number | null;
}

export type GlobeMetric = 'visitors' | 'views' | 'clicks' | 'conversions';

export const METRIC_LABEL: Record<GlobeMetric, string> = {
  visitors: 'visitors',
  views: 'page views',
  clicks: 'clicks',
  conversions: 'conversions',
};

/** p-100, p-300, p-400, p-600, p-800: one hue, light to dark. */
const RAMP = ['#d8eafb', '#86bcf1', '#499bea', '#0a68c3', '#07437d'];
const NO_DATA = '#ebebe8';
const OCEAN = '#ffffff';
const LIVE = '#15803d';

type CountryFeature = Feature<Geometry, { name: string }> & { code: string };

/**
 * Countries too small to have a shape in the 1:110m map, as [longitude, latitude]. Visits from
 * them still show, as a dot shaded like the countries around it.
 */
const SMALL_STATES: Record<string, [number, number]> = {
  SG: [103.82, 1.35], HK: [114.17, 22.32], MO: [113.54, 22.19], BH: [50.56, 26.07], MT: [14.38, 35.94],
  MV: [73.22, 3.2], MU: [57.55, -20.35], SC: [55.49, -4.68], KM: [43.87, -11.88], ST: [6.61, 0.19],
  CV: [-23.6, 15.12], AD: [1.52, 42.55], LI: [9.55, 47.17], MC: [7.42, 43.74], SM: [12.46, 43.94],
  VA: [12.45, 41.9], BB: [-59.54, 13.19], AG: [-61.8, 17.06], DM: [-61.37, 15.41], LC: [-60.98, 13.91],
  VC: [-61.2, 13.25], GD: [-61.68, 12.12], KN: [-62.78, 17.36], TO: [-175.2, -21.18], WS: [-172.1, -13.76],
  FM: [158.22, 6.92], PW: [134.58, 7.51], MH: [171.18, 7.13], KI: [173.0, 1.87], NR: [166.93, -0.52],
  TV: [179.2, -8.52], GU: [144.79, 13.44], AW: [-69.97, 12.52], CW: [-68.99, 12.17], BM: [-64.78, 32.3],
  GI: [-5.35, 36.14], JE: [-2.13, 49.21], GG: [-2.59, 49.45], IM: [-4.55, 54.24], RE: [55.54, -21.12],
  MQ: [-61.02, 14.64], GP: [-61.55, 16.27], PF: [-149.41, -17.68], YT: [45.17, -12.83],
};

let worldCache: Promise<CountryFeature[]> | null = null;

function loadWorld(): Promise<CountryFeature[]> {
  worldCache ??= import('world-atlas/countries-110m.json').then((mod) => {
    const topo = (mod.default ?? mod) as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
    const fc = feature(topo, topo.objects.countries);
    return fc.features
      .map((f) => ({ ...f, code: (f.id != null && countries.numericToAlpha2(String(f.id))) || '' }) as CountryFeature)
      .filter((f) => f.geometry);
  });
  return worldCache;
}

/**
 * Five classes with thresholds on a square-root scale, so one big country does not wash every
 * other country out to the lightest step.
 */
function classify(max: number) {
  const edges = [0.04, 0.16, 0.36, 0.64].map((f) => Math.max(1, Math.round(max * f)));
  const bin = (v: number) => (v <= 0 ? -1 : edges.findIndex((e) => v <= e) === -1 ? 4 : edges.findIndex((e) => v <= e));
  const ranges = RAMP.map((_, i) => {
    const lo = i === 0 ? 1 : edges[i - 1] + 1;
    const hi = i === 4 ? max : edges[i];
    return lo > hi ? null : lo === hi ? fmt.format(lo) : `${fmt.format(lo)}–${fmt.format(hi)}`;
  });
  return { bin, ranges };
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function Globe({
  rows,
  metric,
  liveCodes,
  selected,
  onSelect,
  countryName,
}: {
  rows: CountryStat[];
  metric: GlobeMetric;
  /** Countries with a visitor in the last few minutes. */
  liveCodes: string[];
  selected: string | null;
  onSelect: (code: string | null) => void;
  countryName: (code: string) => string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState(0);
  const [world, setWorld] = useState<CountryFeature[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [hover, setHover] = useState<{ code: string; x: number; y: number } | null>(null);

  // The globe's turn, kept out of React state: it changes every frame.
  const rotation = useRef<[number, number, number]>([-100, -12, 0]);
  const dragging = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const tween = useRef<number | null>(null);
  const paused = useRef(false);

  useEffect(() => {
    loadWorld().then(setWorld).catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setSize(Math.min(entry.contentRect.width, 480)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const byCode = useMemo(() => new Map(rows.map((r) => [r.name, r])), [rows]);
  const max = Math.max(0, ...rows.map((r) => r[metric]));
  const { bin, ranges } = useMemo(() => classify(max), [max]);
  const fillFor = useCallback(
    (code: string) => {
      const v = byCode.get(code)?.[metric] ?? 0;
      const b = bin(v);
      return b < 0 ? NO_DATA : RAMP[b];
    },
    [byCode, metric, bin]
  );

  const projection = useMemo(() => geoOrthographic().clipAngle(90).precision(0.5), []);

  const shapeCodes = useMemo(() => new Set(world?.map((w) => w.code) ?? []), [world]);
  /** Small countries with numbers but no shape: drawn as dots. */
  const dots = useMemo(
    () => (world ? rows.filter((r) => r[metric] > 0 && !shapeCodes.has(r.name) && SMALL_STATES[r.name]).map((r) => r.name) : []),
    [world, rows, metric, shapeCodes]
  );
  const locate = useCallback(
    (code: string): [number, number] | null => {
      const f = world?.find((w) => w.code === code);
      if (f) return geoCentroid(f as GeoPermissibleObjects);
      return SMALL_STATES[code] ?? null;
    },
    [world]
  );

  /** Redraws every path for the current rotation, straight on the DOM. */
  const draw = useCallback(() => {
    const svg = svgRef.current;
    if (!svg || !size) return;
    projection.scale(size / 2 - 6).translate([size / 2, size / 2]).rotate(rotation.current);
    const path = geoPath(projection);
    svg.querySelectorAll<SVGPathElement>('path[data-geo]').forEach((el) => {
      const key = el.dataset.geo!;
      if (key === 'graticule') el.setAttribute('d', path(geoGraticule10()) ?? '');
      else {
        const f = world?.[Number(key)];
        if (f) el.setAttribute('d', path(f as GeoPermissibleObjects) ?? '');
      }
    });
    // Dots (live visitors, small countries): shown only on the facing side of the globe.
    svg.querySelectorAll<SVGGElement>('g[data-at]').forEach((el) => {
      const c = locate(el.dataset.at!);
      if (!c) return;
      const visible = path({ type: 'Point', coordinates: c }) != null;
      const p = projection(c);
      if (!p || !visible) el.setAttribute('visibility', 'hidden');
      else {
        el.setAttribute('visibility', 'visible');
        el.setAttribute('transform', `translate(${p[0]},${p[1]})`);
      }
    });
  }, [projection, size, world, locate]);

  // Redraw after any render that adds paths: new data, a new live dot, or an outline for the
  // selected or hovered country.
  const hoverCode = hover?.code;
  useEffect(() => {
    draw();
  }, [draw, metric, rows, liveCodes, selected, hoverCode, dots]);

  // Slow spin, paused while the pointer is on the globe, while dragging and after a selection.
  useEffect(() => {
    if (!world || prefersReducedMotion()) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      if (!paused.current && !dragging.current && tween.current == null && !selected) {
        rotation.current = [rotation.current[0] + dt * 0.006, rotation.current[1], 0];
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [world, draw, selected]);

  /** Turns the globe to face a country over about 0.8s. */
  const turnTo = useCallback(
    (code: string) => {
      const at = locate(code);
      if (!at) return;
      const [lon, lat] = at;
      const from = rotation.current;
      const to: [number, number, number] = [-lon, Math.max(-60, Math.min(60, -lat)), 0];
      // Take the short way round.
      let dLon = to[0] - from[0];
      dLon = ((((dLon + 180) % 360) + 360) % 360) - 180;
      if (tween.current != null) cancelAnimationFrame(tween.current);
      if (prefersReducedMotion()) {
        rotation.current = [from[0] + dLon, to[1], 0];
        draw();
        return;
      }
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / 800, 1);
        const e = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
        rotation.current = [from[0] + dLon * e, from[1] + (to[1] - from[1]) * e, 0];
        draw();
        tween.current = t < 1 ? requestAnimationFrame(step) : null;
      };
      tween.current = requestAnimationFrame(step);
    },
    [locate, draw]
  );

  useEffect(() => {
    if (selected) turnTo(selected);
  }, [selected, turnTo]);

  useEffect(() => () => {
    if (tween.current != null) cancelAnimationFrame(tween.current);
  }, []);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    dragging.current = { x: e.clientX, y: e.clientY, moved: false };
    if (tween.current != null) {
      cancelAnimationFrame(tween.current);
      tween.current = null;
    }
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragging.current;
    if (d) {
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      if (!d.moved && Math.hypot(dx, dy) < 4) return;
      if (!d.moved) e.currentTarget.setPointerCapture(e.pointerId);
      d.moved = true;
      d.x = e.clientX;
      d.y = e.clientY;
      const k = 75 / (size / 2);
      const [lon, lat] = rotation.current;
      rotation.current = [lon + dx * k, Math.max(-75, Math.min(75, lat - dy * k)), 0];
      setHover(null);
      draw();
      return;
    }
    const target = (e.target as Element).closest('[data-code]') as SVGElement | null;
    const code = target?.dataset.code;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (code && rect) setHover({ code, x: e.clientX - rect.left, y: e.clientY - rect.top });
    else setHover(null);
  };

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragging.current;
    dragging.current = null;
    if (d && !d.moved) {
      // A click, not a drag: select the country under the pointer (or clear on the ocean).
      const code = ((e.target as Element).closest('[data-code]') as SVGElement | null)?.dataset.code;
      onSelect(code && code !== selected ? code : null);
    }
  };

  const hovered = hover ? byCode.get(hover.code) : undefined;

  if (failed) {
    return <p className="py-10 text-center text-[13px] text-crm-ink-3">The world map could not be loaded. The table lists every country.</p>;
  }

  return (
    <div className="min-w-0">
      <div ref={wrapRef} className="relative mx-auto w-full max-w-[480px]">
        {size > 0 && (
          // Sized by its column (width 100%), never the other way round: a fixed width here would
          // hold the column open when the window narrows.
          <svg
            ref={svgRef}
            viewBox={`0 0 ${size} ${size}`}
            style={{ width: '100%', height: 'auto' }}
            role="img"
            aria-label={`Globe of ${METRIC_LABEL[metric]} by country. Drag to turn it; the table beside it lists every country.`}
            className={`mx-auto block touch-none select-none ${world ? 'cursor-grab active:cursor-grabbing' : ''}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerEnter={() => (paused.current = true)}
            onPointerLeave={() => {
              paused.current = false;
              dragging.current = null;
              setHover(null);
            }}
          >
            <defs>
              <radialGradient id="globe-shade" cx="38%" cy="32%" r="75%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="100%" stopColor="#0c79e3" stopOpacity="0.08" />
              </radialGradient>
            </defs>
            <circle cx={size / 2} cy={size / 2} r={size / 2 - 6} fill={OCEAN} stroke="#e2e2e2" strokeWidth={1.5} />
            <path data-geo="graticule" fill="none" stroke="#f0f0ee" strokeWidth={0.75} />
            {world?.map((f, i) => (
              <path
                key={`${f.code || 'x'}-${i}`}
                data-geo={i}
                data-code={f.code || undefined}
                fill={f.code ? fillFor(f.code) : NO_DATA}
                stroke="#ffffff"
                strokeWidth={0.6}
                className="transition-[fill] duration-300"
              />
            ))}
            {/* Outlines for the selected and hovered country, drawn last so no neighbour's border
                covers them. They share the country's data-geo index, so draw() moves them too. */}
            {world &&
              [selected, hover?.code]
                .filter((code, i, all): code is string => !!code && all.indexOf(code) === i)
                .map((code) => {
                  const i = world.findIndex((w) => w.code === code);
                  return i < 0 ? null : (
                    <path key={`outline-${code}`} data-geo={i} fill="none" stroke="#141414" strokeWidth={1.5} strokeLinejoin="round" pointerEvents="none" />
                  );
                })}
            <circle cx={size / 2} cy={size / 2} r={size / 2 - 6} fill="url(#globe-shade)" pointerEvents="none" />
            {dots.map((code) => (
              <g key={`dot-${code}`} data-at={code} visibility="hidden">
                {/* A 24px hit area around a small dot. */}
                <circle r={12} fill="transparent" data-code={code} />
                <circle
                  r={5}
                  fill={fillFor(code)}
                  stroke={code === selected || code === hover?.code ? '#141414' : '#ffffff'}
                  strokeWidth={code === selected || code === hover?.code ? 2 : 1.5}
                  data-code={code}
                />
              </g>
            ))}
            {world &&
              liveCodes.map((code) => (
                <g key={code} data-at={code} pointerEvents="none" visibility="hidden">
                  <circle r={9} fill={LIVE} opacity={0.25} className="motion-safe:animate-ping" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
                  <circle r={4.5} fill={LIVE} stroke="#ffffff" strokeWidth={2} />
                </g>
              ))}
            {!world && (
              <text x={size / 2} y={size / 2} textAnchor="middle" className="fill-crm-ink-3 text-[13px]">
                Loading the world…
              </text>
            )}
          </svg>
        )}

        {hover && (
          <div
            className="pointer-events-none absolute z-10 min-w-[180px] rounded-[14px] border border-crm-rule bg-white px-3.5 py-2.5 shadow-[0_10px_30px_rgba(20,20,20,0.12)]"
            style={{
              left: Math.min(hover.x + 14, size - 190),
              top: Math.max(hover.y - 20, 0),
            }}
          >
            <div className="text-[13px] font-semibold text-crm-ink">{countryName(hover.code)}</div>
            {hovered ? (
              <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5 text-[12.5px]">
                {(['visitors', 'views', 'clicks', 'conversions'] as GlobeMetric[]).map((m) => (
                  <div key={m} className="flex items-baseline justify-between gap-2">
                    <span className="text-crm-ink-3">{METRIC_LABEL[m].replace('page ', '')}</span>
                    <span className={`tabular-nums ${m === metric ? 'font-semibold text-crm-ink' : 'text-crm-ink-2'}`}>{fmt.format(hovered[m])}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-0.5 text-[12.5px] text-crm-ink-3">No visits in this period</div>
            )}
          </div>
        )}
      </div>

      {/* Legend: the five steps and what each covers. */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[12px] text-crm-ink-3">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[3px] border border-crm-rule" style={{ background: NO_DATA }} />
          None
        </span>
        {RAMP.map((color, i) =>
          ranges[i] ? (
            <span key={color} className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-[3px]" style={{ background: color }} />
              <span className="tabular-nums">{ranges[i]}</span>
            </span>
          ) : null
        )}
        {liveCodes.length > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: LIVE }} />
            On the site now
          </span>
        )}
      </div>
    </div>
  );
}
