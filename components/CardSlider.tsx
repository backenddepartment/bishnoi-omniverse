'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Horizontal scroll-snap track with arrow controls.
 *
 * Children are passed through untouched, so the cards themselves stay server-rendered — this
 * component only owns the scrolling. Native overflow scrolling does the work, which means
 * trackpad, touch swipe, and keyboard all behave as expected without a gesture library. Mouse
 * users can also click and drag the track; a drag suppresses the click that ends it, so letting
 * go over a card does not follow its link.
 */
export function CardSlider({
  children,
  label = 'Card slider',
  className = '',
}: {
  children: React.ReactNode;
  label?: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [dragging, setDragging] = useState(false);
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

  // Mouse drag only — touch and pen already scroll the track natively.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || e.pointerType !== 'mouse' || e.button !== 0) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    const d = drag.current;
    if (!el || !d.active) return;
    const dx = e.clientX - d.startX;
    // A few pixels of slack, so an ordinary click on a card still counts as a click.
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      setDragging(true);
      el.setPointerCapture(e.pointerId);
    }
    if (d.moved) el.scrollLeft = d.startScroll - dx;
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    // Snapping is off while dragging (see .is-dragging); turning it back on settles the track.
    setDragging(false);
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className={`card-slider ${className}`}>
      <div
        className={`card-slider-track${dragging ? ' is-dragging' : ''}`}
        ref={trackRef}
        role="group"
        aria-label={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
      >
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
