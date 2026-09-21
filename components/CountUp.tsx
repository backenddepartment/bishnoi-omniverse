'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const DURATION_MS = 1600;

// useLayoutEffect warns during SSR, but it is what keeps the reset to zero off-screen: it runs
// before the browser paints, so the final figure React rendered on the server is never shown.
const useBeforePaint = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Splits a stat into the number to count and whatever sits either side of it, so "50+" counts to
 * 50 and keeps its plus, and a value with no digits at all is left alone.
 */
function parse(value: string) {
  const match = value.match(/^(\D*?)(\d+)(.*)$/);
  if (!match) return null;
  return { prefix: match[1], target: Number(match[2]), suffix: match[3] };
}

/**
 * A figure that counts up to its value the first time it scrolls into view.
 *
 * The server renders the finished number, so it is correct without JavaScript and for anything
 * reading the markup directly. Screen readers get that value once from a visually hidden copy
 * rather than hearing every intermediate frame.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);

  const parsed = parse(value);

  useBeforePaint(() => {
    const el = ref.current;
    if (!el || !parsed) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const { prefix, target, suffix } = parsed;
    setDisplay(`${prefix}0${suffix}`);

    let frame = 0;
    let startedAt = 0;

    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const t = Math.min(1, (now - startedAt) / DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(`${prefix}${Math.round(target * eased)}${suffix}`);
      if (t < 1) frame = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          frame = window.requestAnimationFrame(tick);
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
    // The stat is fixed for the life of the strip; re-running on every render would restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
