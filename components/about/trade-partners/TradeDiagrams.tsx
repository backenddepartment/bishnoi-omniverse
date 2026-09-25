import React from 'react';
import { Check, Factory, Hospital, PenLine, Truck } from 'lucide-react';

/**
 * Page-specific visuals for /trade-partners (design guide P8 diagrams and the P1 document card).
 * Colours are the site tokens: accent #f36b21, ink #0f0e0c, soft ink #4a463d, line #e4ddd0.
 */

const ACCENT = '#f36b21';
const INK = '#0f0e0c';
const INK_SOFT = '#4a463d';
const LINE = '#e4ddd0';
const LAND = '#e7e2d8';

/** Section 2: a dotted route from a manufacturer in New Delhi to a hospital in Metro Manila. */
export function RouteMap() {
  return (
    <svg viewBox="0 0 560 380" role="img" aria-labelledby="tp-route-title">
      <title id="tp-route-title">
        Route from manufacturers in New Delhi, India, to hospitals in Metro Manila, the Philippines
      </title>

      {/* India, simplified flat shape */}
      <path
        d="M96 58 L140 44 L168 70 L178 96 L214 108 L236 104 L232 128 L204 146 L184 152 L170 190 L150 246 L134 290 L120 262 L106 214 L88 186 L60 170 L66 146 L84 128 L80 96 Z"
        fill={LAND}
      />
      {/* The Philippines: Luzon, Visayas, Mindanao */}
      <path d="M452 118 L470 112 L478 140 L474 172 L488 196 L476 214 L456 204 L448 178 L446 146 Z" fill={LAND} />
      <path d="M470 228 L492 222 L500 240 L484 250 L466 244 Z" fill={LAND} />
      <path d="M438 236 L452 230 L446 262 L436 256 Z" fill={LAND} />
      <path d="M478 268 L510 262 L524 284 L508 312 L482 306 L472 288 Z" fill={LAND} />

      <text x="118" y="226" fontSize="12" letterSpacing="2" fill={INK_SOFT} opacity="0.7">
        INDIA
      </text>
      <text x="498" y="352" fontSize="12" letterSpacing="2" fill={INK_SOFT} opacity="0.7" textAnchor="middle">
        PHILIPPINES
      </text>

      {/* Dotted orange route */}
      <path
        d="M140 92 C 230 -10, 400 20, 458 170"
        fill="none"
        stroke={ACCENT}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="0.1 10"
      />
      <path d="M452 158 L458 172 L466 159" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* New Delhi: manufacturer */}
      <circle cx="140" cy="92" r="6" fill={ACCENT} />
      <g>
        <circle cx="70" cy="46" r="26" fill="#fff" stroke={ACCENT} strokeWidth="1.5" />
        <Factory x={56} y={32} size={28} color={ACCENT} strokeWidth={1.5} aria-hidden="true" />
      </g>
      <line x1="89" y1="64" x2="134" y2="88" stroke={ACCENT} strokeWidth="1" opacity="0.5" />
      <text x="150" y="118" fontSize="14" fontWeight="600" fill={INK}>
        New Delhi
      </text>

      {/* Metro Manila: hospital */}
      <circle cx="458" cy="176" r="6" fill={ACCENT} />
      <g>
        <circle cx="380" cy="228" r="26" fill="#fff" stroke={ACCENT} strokeWidth="1.5" />
        <Hospital x={366} y={214} size={28} color={ACCENT} strokeWidth={1.5} aria-hidden="true" />
      </g>
      <line x1="402" y1="214" x2="452" y2="180" stroke={ACCENT} strokeWidth="1" opacity="0.5" />
      <text x="360" y="176" fontSize="14" fontWeight="600" fill={INK} textAnchor="end">
        Metro Manila
      </text>
    </svg>
  );
}

/** Section 3: Bishnoi Omniverse at the centre, linked to buyer, supplier and logistics partner. */
export function PartnerHub() {
  const nodes = [
    { label: 'Buyer', cx: 260, cy: 70, Icon: Hospital },
    { label: 'Supplier', cx: 90, cy: 320, Icon: Factory },
    { label: 'Logistics partner', cx: 430, cy: 320, Icon: Truck },
  ];
  const hub = { cx: 260, cy: 215 };
  return (
    <svg viewBox="0 0 520 420" role="img" aria-labelledby="tp-hub-title">
      <title id="tp-hub-title">
        Bishnoi Omniverse as the single point of communication between buyer, supplier and logistics partner
      </title>

      {nodes.map((n) => (
        <line
          key={`l-${n.label}`}
          x1={hub.cx}
          y1={hub.cy}
          x2={n.cx}
          y2={n.cy}
          stroke={ACCENT}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="0.1 8"
        />
      ))}

      {nodes.map(({ label, cx, cy, Icon }) => (
        <g key={label}>
          <circle cx={cx} cy={cy} r="44" fill="#f2ede2" stroke={LINE} strokeWidth="1.5" />
          <Icon x={cx - 16} y={cy - 16} size={32} color={INK_SOFT} strokeWidth={1.5} aria-hidden="true" />
          <text x={cx} y={cy + 66} fontSize="15" fontWeight="600" fill={INK} textAnchor="middle">
            {label}
          </text>
        </g>
      ))}

      <circle cx={hub.cx} cy={hub.cy} r="78" fill={ACCENT} opacity="0.14" />
      <circle cx={hub.cx} cy={hub.cy} r="64" fill={ACCENT} />
      <text x={hub.cx} y={hub.cy - 4} fontSize="16" fontWeight="600" fill="#fff" textAnchor="middle">
        Bishnoi
      </text>
      <text x={hub.cx} y={hub.cy + 16} fontSize="16" fontWeight="600" fill="#fff" textAnchor="middle">
        Omniverse
      </text>
    </svg>
  );
}

/** Section 4: a card styled like a signed agreement, listing the terms named in the copy. */
export function OrderTermsCard() {
  const terms = ['Price', 'Quantity', 'Lead time', 'Packaging', 'Documents'];
  return (
    <div
      className="relative mx-auto w-full max-w-[440px] rounded-2xl border p-8 sm:p-10"
      style={{ background: 'var(--paper)', borderColor: 'var(--line)', boxShadow: '0 18px 40px rgba(0,0,0,0.28)', color: 'var(--ink)' }}
    >
      <div className="mb-6 flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--line)' }}>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--accent-dark)' }}>
          Order confirmation
        </span>
        <span aria-hidden="true" className="block h-2 w-16 rounded-full" style={{ background: 'var(--line)' }} />
      </div>

      <ul className="m-0 list-none space-y-4 p-0">
        {terms.map((t, i) => (
          <li key={t} className="flex items-center gap-3">
            <span
              className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full"
              style={{ background: 'var(--accent-tint)' }}
            >
              <Check size={16} color="var(--accent)" strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="text-[15px] font-semibold">{t}</span>
            <span
              aria-hidden="true"
              className="ml-auto block h-2 rounded-full"
              style={{ background: 'var(--line)', width: `${[38, 30, 44, 34, 40][i]}%` }}
            />
          </li>
        ))}
      </ul>

      <div className="mt-10 flex items-end gap-3">
        <PenLine size={24} color="var(--accent)" strokeWidth={1.5} aria-hidden="true" className="flex-none" />
        <div className="flex-1">
          <svg viewBox="0 0 200 40" className="block h-9 w-44" aria-hidden="true">
            <path
              d="M4 30 C 20 6, 30 6, 34 24 S 50 36, 60 18 S 80 4, 86 22 S 104 34, 118 16 C 126 8, 132 26, 146 20 S 176 14, 196 18"
              fill="none"
              stroke={INK}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <div className="mt-1 border-t" style={{ borderColor: 'var(--ink-soft)' }} />
        </div>
      </div>
    </div>
  );
}
