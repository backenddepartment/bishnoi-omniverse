'use client';

import React, { useEffect, useRef, useState } from 'react';
import flowImg from '@/app/assets/flow.png';
import logoImg from '@/app/assets/logo.png';

/**
 * Sourcing Coordination on /global-network: the orange arrow with a pin and a label on each of its
 * five parts, from the three suppliers at its tail, through Bishnoi Omniverse, to the hospitals at
 * its head.
 *
 * Every position and size is a fraction of the arrow image (1672 × 941), so the pins stay on their
 * parts of the arrow at any width. The styles are in globals.css under `ap-flow`, where
 * `--ap-flow-scale` sets how large the pins and labels are drawn.
 *
 * When the diagram scrolls into view the pins land one after another, tail to head, each followed
 * by its label. The arrow itself is always there. Without JavaScript, or for visitors who ask for
 * reduced motion, everything is simply shown.
 */

type Glyph = 'gear' | 'workflow' | 'person' | 'hospital';

type Stop = {
  label: string;
  /** Icon in the pin, filled with the orange sweep, or the Bishnoi Omniverse logo as it is. */
  icon: Glyph | 'logo';
  /** Centre of the pin's circle, in image pixels. */
  pin: [number, number];
  /** Diameter of the pin's circle, in image pixels. The pins grow towards the arrow's head. */
  size: number;
  /** Right edge and vertical centre of the label, in image pixels. */
  tag: [number, number];
  /** A different right edge for the label on phones, in image pixels. */
  tagPhoneX?: number;
};

const W = flowImg.width;
const H = flowImg.height;

const STOPS: Stop[] = [
  { label: 'Supplier', icon: 'gear', pin: [1222, 108], size: 96, tag: [1156, 105] },
  // Set further left than in the reference: with no box behind it, the word has to clear the
  // arrow. Further still on phones, where the words are larger against the drawing.
  { label: 'Supplier', icon: 'workflow', pin: [1474, 210], size: 116, tag: [1346, 250], tagPhoneX: 1285 },
  { label: 'Supplier', icon: 'person', pin: [1414, 430], size: 130, tag: [1332, 405] },
  { label: 'Bishnoi Omniverse', icon: 'logo', pin: [1032, 578], size: 150, tag: [950, 499] },
  { label: 'Hospitals', icon: 'hospital', pin: [514, 610], size: 166, tag: [432, 510] },
];

/** Id of the gradient the icons are filled with. */
const SWEEP = 'ap-flow-sweep';
const FILL = `url(#${SWEEP})`;

/**
 * The pin icons as solid shapes. They follow the outlines of the site's line icons (Lucide's
 * Settings, Workflow, UserRoundPlus and Hospital), filled with the orange sweep; the details that
 * a fill would swallow, such as the gear's hub and the hospital's cross, are cut back in in white.
 */
function GlyphIcon({ name }: { name: Glyph }) {
  const line = { fill: 'none', stroke: FILL, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  const cut = { ...line, stroke: '#fff', strokeWidth: 1.6 } as const;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {name === 'gear' && (
        <>
          <path
            fill={FILL}
            d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
          />
          <circle cx="12" cy="12" r="3.2" fill="#fff" />
        </>
      )}
      {name === 'workflow' && (
        <>
          <rect x="3" y="3" width="8" height="8" rx="2" fill={FILL} />
          <rect x="13" y="13" width="8" height="8" rx="2" fill={FILL} />
          <path d="M7 11v4a2 2 0 0 0 2 2h4" {...line} />
        </>
      )}
      {name === 'person' && (
        <>
          <circle cx="10" cy="8" r="5" fill={FILL} />
          <path d="M2 21.5a8 8 0 0 1 13.3-6v6z" fill={FILL} />
          <path d="M19 16v6M22 19h-6" {...line} />
        </>
      )}
      {name === 'hospital' && (
        <>
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18z" fill={FILL} />
          <path d="M6 9H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2z" fill={FILL} opacity="0.8" />
          <path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2z" fill={FILL} opacity="0.8" />
          <path d="M12 5.5v4.5M14.25 7.75h-4.5M14 14h-4M14 18h-4" {...cut} />
        </>
      )}
    </svg>
  );
}

/** How far the pin's point sits below the centre of its circle, as a share of its diameter. */
const TIP = Math.SQRT1_2;

const pct = (n: number, of: number) => `${((n / of) * 100).toFixed(3)}%`;
/** The pin's diameter at the drawing's own size; globals.css scales it by --ap-flow-scale. */
const pinSize = (stop: Stop) => `${((stop.size / W) * 100).toFixed(3)}cqw`;

/** How much of the diagram has to be on screen before the pins start to land. */
const START_AT = 0.35;

export function FlowDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  // 'idle': everything shown, as rendered on the server. 'armed': pins and labels hidden, waiting
  // for the diagram to scroll into view. 'shown': landing, or landed.
  const [phase, setPhase] = useState<'idle' | 'armed' | 'shown'>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setPhase('armed');
    // Like the site's other entrances, it plays again each time the diagram comes back into view
    // after leaving the screen altogether.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= START_AT) setPhase('shown');
        else if (!entry.isIntersecting) setPhase('armed');
      },
      { threshold: [0, START_AT] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    // The frame places the diagram in its section; on phones it runs out to the screen's edges.
    <div className="ap-flow-scroll">
      <div
        ref={ref}
        className={`ap-flow${phase === 'idle' ? '' : ` is-${phase}`}`}
        role="img"
        aria-label="Diagram: three suppliers lead along an arrow to Bishnoi Omniverse, which leads on to hospitals."
        style={{ aspectRatio: `${W} / ${H}` }}
      >
        <img src={flowImg.src} alt="" loading="lazy" draggable={false} className="ap-flow-arrow" />

        {/* The hero headline's orange sweep as a fill for the icons: the same run of colours,
            with the yellow glow of its top left corner folded into the first stops. It is set
            across the icons' own 24 × 24 drawing area, corner to corner. */}
        <svg className="ap-flow-defs" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id={SWEEP} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0" stopColor="#ffb506" />
              <stop offset="0.3" stopColor="#f98318" />
              <stop offset="0.45" stopColor="#f36b21" />
              <stop offset="0.8" stopColor="#e8401c" />
              <stop offset="1" stopColor="#c7331a" />
            </linearGradient>
          </defs>
        </svg>

        {STOPS.map((stop, i) => {
          return (
            <React.Fragment key={i}>
              <span
                className="ap-flow-pin"
                style={
                  {
                    left: pct(stop.pin[0], W),
                    top: pct(stop.pin[1] + stop.size * TIP, H),
                    '--ap-pin': pinSize(stop),
                    '--ap-i': i,
                  } as React.CSSProperties
                }
              >
                <span className="ap-flow-pin-shape" />
                <span className="ap-flow-pin-face">
                  {stop.icon === 'logo' ? (
                    <img src={logoImg.src} alt="" loading="lazy" draggable={false} />
                  ) : (
                    <GlyphIcon name={stop.icon} />
                  )}
                </span>
              </span>
              <span
                className="ap-flow-tag"
                style={
                  {
                    top: pct(stop.tag[1], H),
                    '--ap-tag-right': pct(W - stop.tag[0], W),
                    '--ap-tag-right-phone': pct(W - (stop.tagPhoneX ?? stop.tag[0]), W),
                    '--ap-pin': pinSize(stop),
                    '--ap-i': i,
                  } as React.CSSProperties
                }
              >
                <span className="ap-flow-tag-text">{stop.label}</span>
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
