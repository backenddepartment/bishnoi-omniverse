import React from 'react';

/**
 * "Website under construction" illustration: a browser window whose page is still being assembled,
 * with a small crane lowering the last block into a dashed slot. Deliberately light — it sits on
 * the site's paper background, not on a dark panel — and drawn only from the brand tokens
 * (--accent, --accent-dark, --accent-tint, --line, --surface) so it matches the rest of the site.
 *
 * aria-hidden: the page's heading and body already say everything this conveys.
 */
export function UnderConstructionArt({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 480 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
      aria-hidden="true"
    >
      {/* Soft tinted ground so the scene reads as one object against the paper background */}
      <ellipse cx="243" cy="300" rx="196" ry="30" fill="var(--accent-tint)" />

      {/* Browser window */}
      <rect
        x="86"
        y="58"
        width="308"
        height="224"
        rx="16"
        fill="var(--surface)"
        stroke="var(--line)"
        strokeWidth="2.5"
      />
      {/* Title bar */}
      <path
        d="M86 74a16 16 0 0 1 16-16h276a16 16 0 0 1 16 16v22H86V74Z"
        fill="var(--paper-2)"
      />
      <path d="M86 96h308" stroke="var(--line)" strokeWidth="2.5" />
      <circle cx="110" cy="77" r="5" fill="var(--accent)" />
      <circle cx="128" cy="77" r="5" fill="var(--line)" />
      <circle cx="146" cy="77" r="5" fill="var(--line)" />
      {/* Address field, still empty */}
      <rect x="170" y="70" width="150" height="14" rx="7" fill="var(--line)" opacity="0.55" />

      {/* Left column — the parts of the page already built */}
      <rect x="112" y="120" width="88" height="12" rx="6" fill="var(--accent)" opacity="0.85" />
      <rect x="112" y="146" width="116" height="8" rx="4" fill="var(--line)" />
      <rect x="112" y="164" width="96" height="8" rx="4" fill="var(--line)" />
      <rect
        x="112"
        y="192"
        width="104"
        height="62"
        rx="8"
        fill="var(--accent-tint)"
        stroke="var(--accent)"
        strokeWidth="2"
      />

      {/* Crane — mast, jib, and cable, all inside the viewport being built */}
      <path
        d="M344 122v132"
        stroke="var(--accent-dark)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M252 122h96"
        stroke="var(--accent-dark)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Counterweight and tie-back give the jib something to hang from */}
      <path d="M344 122 300 138" stroke="var(--accent-dark)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M266 126v22" stroke="var(--accent-dark)" strokeWidth="2.5" strokeLinecap="round" />

      {/* The block being lowered */}
      <rect
        x="244"
        y="148"
        width="44"
        height="34"
        rx="6"
        fill="var(--accent)"
      />

      {/* The slot it is heading for */}
      <rect
        x="244"
        y="212"
        width="44"
        height="34"
        rx="6"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeDasharray="7 6"
        opacity="0.75"
      />

      {/* Floor of the browser viewport */}
      <path d="M104 268h272" stroke="var(--line)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Traffic cone, outside the window, to place the scene as a building site */}
      <path
        d="M64 246l19 50H45l19-50Z"
        fill="var(--accent)"
        strokeLinejoin="round"
      />
      <path d="M56.5 266h15" stroke="var(--surface)" strokeWidth="6" strokeLinecap="round" />
      <rect x="36" y="294" width="56" height="11" rx="5.5" fill="var(--accent-dark)" />
    </svg>
  );
}
