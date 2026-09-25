import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { FadeIn } from '@/components/FadeIn';

/**
 * Page-specific visuals for /global-network: the Philippines coverage map (P8), the two hub cards
 * joined by a connector (P1 twin cards) and the "many suppliers to one partner" diagram (P8).
 */

const ACCENT = '#f36b21';
const INK = '#0f0e0c';
const MUTED = '#6e675a';
const LINE = '#e4ddd0';
const PAPER = '#faf8f4';
const GREY = '#c9c3b6';

/* ---------- Philippines map ---------- */

// Plain equirectangular projection: 36 SVG units per degree, shifted right to leave room for the inset.
const OX = 110;
const pt = (lon: number, lat: number) => [(lon - 116) * 36 + OX, (19.5 - lat) * 36] as const;
const poly = (pts: [number, number][]) =>
  pts
    .map(([lon, lat]) => pt(lon, lat))
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ');

// Stylised outlines, simplified from real coastlines (Luzon, Mindoro, Palawan, the Visayas, Mindanao).
const ISLANDS: [number, number][][] = [
  // Luzon, with the Bicol peninsula
  [
    [120.6, 18.5], [121.2, 18.6], [122.2, 18.4], [122.1, 17.0], [121.6, 16.0], [121.6, 15.0],
    [122.0, 14.2], [122.8, 14.1], [123.3, 13.8], [124.0, 13.0], [124.1, 12.6], [123.8, 12.7],
    [123.0, 13.2], [122.5, 13.5], [121.8, 13.9], [121.0, 13.7], [120.6, 14.2], [120.9, 14.6],
    [120.5, 14.8], [120.0, 15.5], [119.8, 16.3], [120.3, 16.5], [120.4, 17.5],
  ],
  // Mindoro
  [[120.3, 13.5], [121.2, 13.4], [121.5, 12.9], [121.2, 12.2], [120.8, 12.4], [120.4, 13.1]],
  // Palawan
  [
    [119.9, 11.4], [119.6, 10.4], [118.8, 9.8], [117.3, 8.3], [117.1, 8.5], [118.4, 9.6],
    [119.3, 10.5], [119.6, 11.2],
  ],
  // Panay
  [[122.0, 11.9], [123.1, 11.5], [122.6, 10.5], [122.0, 10.7], [121.9, 11.4]],
  // Negros
  [[123.0, 10.9], [123.5, 10.6], [123.2, 9.1], [122.8, 9.3], [122.4, 9.9], [122.9, 10.4]],
  // Cebu
  [[123.9, 11.3], [124.1, 11.1], [123.5, 9.5], [123.4, 9.8]],
  // Bohol
  [[123.8, 10.1], [124.6, 10.1], [124.5, 9.6], [123.9, 9.6]],
  // Samar
  [[124.3, 12.5], [125.3, 12.3], [125.7, 11.1], [125.1, 11.0], [124.6, 11.3], [124.3, 11.8]],
  // Leyte
  [[124.4, 11.4], [125.0, 11.2], [125.2, 10.2], [124.8, 10.0], [124.7, 10.8], [124.4, 10.9]],
  // Mindanao
  [
    [122.2, 7.8], [123.0, 8.2], [123.6, 8.6], [124.2, 8.4], [124.8, 9.0], [125.5, 9.8],
    [126.1, 9.3], [126.4, 8.0], [126.6, 7.0], [126.2, 6.3], [125.6, 7.0], [125.4, 6.0],
    [124.8, 5.9], [124.2, 6.4], [124.0, 7.2], [123.5, 7.8], [122.8, 7.5], [122.0, 7.0],
  ],
];

// Sulu archipelago, drawn as small dots.
const SULU: [number, number][] = [[120.5, 5.9], [121.0, 6.0], [121.5, 6.15], [121.9, 6.4]];

const INSET_REGIONS = [
  { label: 'Southeast Asia', cx: 60, dots: [[-14, -6], [0, 4], [12, -10], [-4, 16], [16, 10]] },
  { label: 'Pacific', cx: 128, dots: [[-12, 8], [2, -6], [14, 12], [-2, 18], [18, -4]] },
  { label: 'Latin America', cx: 192, dots: [[-8, -12], [4, 0], [-2, 14], [8, 22], [14, -4]] },
];

export function PhilippinesMap() {
  const [mx, my] = pt(121.0, 14.6);
  return (
    <svg
      viewBox="0 0 520 510"
      role="img"
      aria-label="Map of the Philippines shaded in orange to show where we serve, with our operations hub in Metro Manila. An inset marks where the Getmeds network also supplies medicines: Southeast Asia, the Pacific and Latin America."
      className="max-w-[560px] mx-auto"
    >
      {/* Inset: the wider Getmeds network, kept faint so the Philippines stays the main element. */}
      <g aria-hidden="true">
        <rect x="12" y="12" width="222" height="140" rx="12" fill={PAPER} stroke={LINE} />
        <text x="26" y="36" fontSize="11" fontWeight="600" letterSpacing="1.2" fill={MUTED}>
          GETMEDS NETWORK
        </text>
        {INSET_REGIONS.map((r) => (
          <g key={r.label}>
            {r.dots.map(([dx, dy], i) => (
              <circle key={i} cx={r.cx + dx} cy={82 + dy} r="3.5" fill={ACCENT} opacity="0.35" />
            ))}
            <text x={r.cx} y="134" fontSize="10.5" textAnchor="middle" fill={MUTED}>
              {r.label}
            </text>
          </g>
        ))}
      </g>

      {/* The Philippines: every island shaded as coverage. */}
      <g aria-hidden="true" fill={ACCENT} stroke={ACCENT} strokeWidth="3" strokeLinejoin="round">
        {ISLANDS.map((isl, i) => (
          <polygon key={i} points={poly(isl)} />
        ))}
        {SULU.map(([lon, lat], i) => {
          const [x, y] = pt(lon, lat);
          return <circle key={i} cx={x} cy={y} r="3" strokeWidth="0" />;
        })}
      </g>

      {/* Metro Manila pin and label */}
      <g aria-hidden="true">
        <circle cx={mx} cy={my} r="15" fill="none" stroke={INK} strokeOpacity="0.3" strokeWidth="1.5" />
        <circle cx={mx} cy={my} r="7" fill={INK} stroke="#fff" strokeWidth="2.5" />
        <line x1={mx + 16} y1={my} x2={mx + 52} y2={my} stroke={INK} strokeWidth="1.2" />
        <text x={mx + 58} y={my + 5} fontSize="15" fontWeight="600" fill={INK}>
          Metro Manila
        </text>
      </g>
    </svg>
  );
}

/* ---------- Hub cards ---------- */

export type Hub = {
  city: string;
  text: string;
  href: string;
  image: string;
  imageAlt: string;
};

/**
 * The hub photos are presentation slides with text on the left and a building on the right, so
 * the card shows only the building: the image is scaled up and shifted to its text-free upper-right
 * region (roughly x 1000–1920, y 120–695 of the 1920×1080 source).
 */
function BuildingCrop({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute top-0 transition-transform duration-500 group-hover:scale-[1.03]"
        style={{ width: '208.7%', maxWidth: 'none', height: 'auto', left: '-108.7%', marginTop: '-13%' }}
      />
    </div>
  );
}

function HubCard({ hub }: { hub: Hub }) {
  return (
    <Link
      href={hub.href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white no-underline text-inherit transition-colors duration-300 hover:border-accent"
    >
      <BuildingCrop src={hub.image} alt={hub.imageAlt} />
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="ap-card-eyebrow" style={{ marginBottom: 0 }}>
            <MapPin strokeWidth={1.5} aria-hidden="true" />
            {hub.city}
          </span>
          <ArrowUpRight
            className="h-6 w-6 shrink-0 text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>
        <p className="m-0 text-[15px] leading-relaxed text-ink-soft">{hub.text}</p>
      </div>
    </Link>
  );
}

/** Two hub cards joined by an orange connector; the connector turns vertical when the cards stack. */
export function HubPair({ hubs, connectorLabel }: { hubs: [Hub, Hub]; connectorLabel: string }) {
  return (
    <div className="grid grid-cols-1 items-stretch md:grid-cols-[minmax(0,1fr)_150px_minmax(0,1fr)]">
      <FadeIn from="left" className="h-full">
        <HubCard hub={hubs[0]} />
      </FadeIn>
      <div className="relative flex items-center justify-center py-10 md:py-0" aria-hidden="true">
        <span className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-accent md:left-0 md:right-0 md:top-1/2 md:bottom-auto md:h-0.5 md:w-auto md:translate-x-0 md:-translate-y-1/2" />
        <span className="relative whitespace-nowrap rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-white">
          {connectorLabel}
        </span>
      </div>
      <FadeIn from="right" className="h-full">
        <HubCard hub={hubs[1]} />
      </FadeIn>
    </div>
  );
}

/* ---------- Many suppliers to one partner ---------- */

const SUPPLIER_YS = [70, 125, 180, 235, 290];

export function ManyToOne() {
  const node = { x: 250, y: 180, r: 36 };
  const hospital = { x: 420, y: 180 };
  return (
    <svg
      viewBox="0 0 480 340"
      role="img"
      aria-label="Diagram: several suppliers, shown as grey dots, all flow into one Bishnoi Omniverse node in orange, which sends one quotation line to the hospital."
      className="max-w-[540px] mx-auto"
    >
      <defs>
        <marker id="gn-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={INK} />
        </marker>
      </defs>
      <g aria-hidden="true">
        <text x="56" y="34" fontSize="13" fontWeight="600" textAnchor="middle" fill={MUTED}>
          Suppliers
        </text>
        {SUPPLIER_YS.map((y) => (
          <path
            key={y}
            d={`M66,${y} C150,${y} 160,${node.y} ${node.x - node.r},${node.y}`}
            fill="none"
            stroke={GREY}
            strokeWidth="1.5"
          />
        ))}
        {SUPPLIER_YS.map((y) => (
          <circle key={y} cx="56" cy={y} r="11" fill={GREY} />
        ))}

        <circle cx={node.x} cy={node.y} r={node.r + 10} fill={ACCENT} opacity="0.14" />
        <circle cx={node.x} cy={node.y} r={node.r} fill={ACCENT} />
        <text x={node.x} y={node.y + node.r + 34} fontSize="13" fontWeight="600" textAnchor="middle" fill={INK}>
          <tspan x={node.x}>Bishnoi</tspan>
          <tspan x={node.x} dy="16">Omniverse</tspan>
        </text>

        <line
          x1={node.x + node.r + 12}
          y1={node.y}
          x2={hospital.x - 30}
          y2={node.y}
          stroke={INK}
          strokeWidth="2.5"
          markerEnd="url(#gn-arrow)"
        />
        <text x={(node.x + node.r + hospital.x - 18) / 2} y={node.y - 14} fontSize="12" textAnchor="middle" fill={MUTED}>
          One quotation
        </text>

        <rect x={hospital.x - 24} y={hospital.y - 24} width="48" height="48" rx="10" fill={INK} />
        <path
          d={`M${hospital.x - 4},${hospital.y - 13} h8 v9 h9 v8 h-9 v9 h-8 v-9 h-9 v-8 h9 z`}
          fill="#fff"
        />
        <text x={hospital.x} y={hospital.y + 50} fontSize="13" fontWeight="600" textAnchor="middle" fill={INK}>
          Hospital
        </text>
      </g>
    </svg>
  );
}
