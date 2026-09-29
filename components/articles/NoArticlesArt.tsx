import React from 'react';

/**
 * The picture for "no articles": a browser window of empty cards under a magnifying glass that
 * has found nothing, in flat shapes and the site's orange. Decorative — the words beside it say
 * what happened — so it is hidden from screen readers.
 */

const TINT = '#fde9de';
const SOFT = '#fbd3bd';
const LIGHT = '#f9c9ad';
const MID = '#f8ae85';
const ACCENT = '#f36b21';
const DEEP = '#c2561a';

/** A cog: a disc with eight teeth and a hole, drawn around its own centre. */
function Gear({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y})`} fill={fill}>
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x={-0.21 * r}
          y={-r}
          width={0.42 * r}
          height={0.5 * r}
          rx={0.07 * r}
          transform={`rotate(${i * 45})`}
        />
      ))}
      <circle r={0.74 * r} />
      <circle r={0.3 * r} fill="#fff" />
    </g>
  );
}

export function NoArticlesArt({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 380"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* Ground */}
      <ellipse cx="238" cy="342" rx="196" ry="15" fill={TINT} />

      {/* Cogs */}
      <Gear x={88} y={92} r={24} fill={MID} />
      <Gear x={133} y={58} r={14} fill={SOFT} />

      {/* A loose page, drifting off */}
      <g transform="rotate(14 408 92)">
        <rect x="384" y="62" width="48" height="60" rx="7" fill="#fff" stroke={LIGHT} strokeWidth="3" />
        <rect x="394" y="76" width="28" height="6" rx="3" fill={LIGHT} />
        <rect x="394" y="90" width="22" height="5" rx="2.5" fill={TINT} />
        <rect x="394" y="102" width="26" height="5" rx="2.5" fill={TINT} />
      </g>
      <circle cx="356" cy="70" r="5" fill={MID} />
      <circle cx="446" cy="164" r="4" fill={SOFT} />
      <circle cx="44" cy="214" r="5" fill={SOFT} />
      <circle cx="176" cy="40" r="3.5" fill={LIGHT} />

      {/* Browser window */}
      <rect x="62" y="116" width="284" height="210" rx="16" fill="#fff" stroke={LIGHT} strokeWidth="3" />
      <path d="M62 132a16 16 0 0 1 16-16h252a16 16 0 0 1 16 16v20H62z" fill={TINT} />
      <path d="M62 152h284" stroke={LIGHT} strokeWidth="3" />
      <circle cx="86" cy="134" r="5.5" fill={MID} />
      <circle cx="103" cy="134" r="5.5" fill={MID} />
      <circle cx="120" cy="134" r="5.5" fill={MID} />
      <rect x="142" y="124" width="182" height="20" rx="10" fill="#fff" />

      {/* What would have been a page of articles */}
      <rect x="86" y="176" width="116" height="12" rx="6" fill={LIGHT} />
      <rect x="86" y="200" width="94" height="7" rx="3.5" fill={TINT} />
      <rect x="86" y="214" width="106" height="7" rx="3.5" fill={TINT} />
      <rect x="86" y="234" width="52" height="15" rx="7.5" fill={ACCENT} />
      <rect
        x="226"
        y="172"
        width="98"
        height="78"
        rx="9"
        fill="#fff8f4"
        stroke={ACCENT}
        strokeWidth="2.2"
        strokeDasharray="7 6"
        strokeLinecap="round"
      />
      <rect x="86" y="268" width="72" height="42" rx="9" fill={TINT} />
      <rect x="168" y="268" width="72" height="42" rx="9" fill={TINT} />
      <rect x="250" y="268" width="72" height="42" rx="9" fill={TINT} />

      {/* Magnifying glass, and the nothing it found */}
      <path d="M401 284l42 42" stroke={DEEP} strokeWidth="16" strokeLinecap="round" />
      <path d="M401 284l14 14" stroke={ACCENT} strokeWidth="16" strokeLinecap="round" />
      <circle cx="358" cy="240" r="60" fill="#fff" fillOpacity="0.92" stroke={DEEP} strokeWidth="9" />
      <path d="M318 222a44 44 0 0 1 24-24" stroke={LIGHT} strokeWidth="6" strokeLinecap="round" fill="none" />
      <rect x="333" y="206" width="50" height="62" rx="7" fill={TINT} />
      <rect x="343" y="220" width="30" height="6" rx="3" fill={MID} />
      <rect x="343" y="234" width="22" height="5" rx="2.5" fill={LIGHT} />
      <rect x="343" y="246" width="26" height="5" rx="2.5" fill={LIGHT} />
      <circle cx="384" cy="266" r="15" fill={ACCENT} stroke="#fff" strokeWidth="3" />
      <path d="M378 260l12 12M390 260l-12 12" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}
