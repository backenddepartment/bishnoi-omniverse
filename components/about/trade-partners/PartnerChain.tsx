'use client';

import React, { useEffect, useRef, useState } from 'react';
import logoImg from '@/app/assets/logo.png';

/**
 * Trade & Partners · Partner Communication: the line of communication as a chain of arrows, each
 * running into the next — supplier, logistics partner, Bishnoi Omniverse (its logo), hospitals. A row
 * on wide screens, a column of arrows pointing down on phones. The styles are in globals.css
 * under `ap-chain`.
 *
 * When the chain scrolls into view the arrows appear one after another, first to last, each
 * settling into the place it always had. Without JavaScript, or for visitors who ask for reduced
 * motion, the whole chain is simply shown.
 */
const CHAIN: { label: string; logo?: boolean }[] = [
  { label: 'Supplier' },
  { label: 'Logistics partner' },
  { label: 'Bishnoi Omniverse', logo: true },
  { label: 'Hospitals' },
];

/** How much of the chain has to be on screen before the arrows start to appear. */
const START_AT = 0.4;

export function PartnerChain() {
  const ref = useRef<HTMLOListElement>(null);
  // 'idle': everything shown, as rendered on the server. 'armed': arrows hidden, waiting for the
  // chain to scroll into view. 'shown': appearing, or in place.
  const [phase, setPhase] = useState<'idle' | 'armed' | 'shown'>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setPhase('armed');
    // Like the site's other entrances, it plays again each time the chain comes back into view
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
    <ol
      ref={ref}
      className={`ap-chain${phase === 'idle' ? '' : ` is-${phase}`}`}
      aria-label="The line of communication: supplier, logistics partner, Bishnoi Omniverse, hospitals"
    >
      {CHAIN.map((step, i) => (
        <li key={step.label} className="ap-chain-step" style={{ '--ap-i': i } as React.CSSProperties}>
          <span className="ap-chain-shape" aria-hidden="true" />
          <span className="ap-chain-label">
            {step.logo ? <img src={logoImg.src} alt={step.label} loading="lazy" draggable={false} /> : step.label}
          </span>
        </li>
      ))}
    </ol>
  );
}
