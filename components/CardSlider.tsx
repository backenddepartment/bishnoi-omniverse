'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Horizontal scroll-snap track with arrow controls.
 *
 * Children are passed through untouched, so the cards themselves stay server-rendered — this
 * component only owns the scrolling. Native overflow scrolling does the work, which means
 * trackpad, touch swipe, and keyboard all behave as expected without a gesture library.
 */
export function CardSlider({
  children,
  label = 'Card slider',
}: {
  children: React.ReactNode;
  label?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // 2px of slack: sub-pixel widths can leave scrollLeft a hair short of the true maximum.
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="card-slider">
      <div className="card-slider-track" ref={trackRef} role="group" aria-label={label}>
        {children}
      </div>

      <button
        type="button"
        className="card-slider-btn is-prev"
        onClick={() => nudge(-1)}
        disabled={!canPrev}
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
      </button>
      <button
        type="button"
        className="card-slider-btn is-next"
        onClick={() => nudge(1)}
        disabled={!canNext}
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
