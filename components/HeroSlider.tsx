'use client';

import React, { useEffect, useState } from 'react';

export type HeroSlide = { src: string; alt: string };

const INTERVAL_MS = 6000;

/**
 * Cross-fading background slider for the homepage hero. Every slide stays mounted and stacked, so
 * advancing only animates opacity — no layout work, and the first frame is painted immediately
 * rather than after a swap. Pauses while the tab is hidden and respects reduced-motion.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  // Later slides get their src only after hydration, so they do not download alongside the first
  // slide (the LCP image). They have the whole first interval to arrive before the crossfade.
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = window.setInterval(() => {
      if (document.hidden) return;
      setActive((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <div className="hero-media">
      {slides.map((slide, idx) => (
        <img
          key={slide.src}
          src={idx === 0 || mounted ? slide.src : undefined}
          alt={idx === active ? slide.alt : ''}
          className={`hero-slide${idx === active ? ' is-active' : ''}`}
          loading={idx === 0 ? 'eager' : 'lazy'}
          // The first slide is the page's LCP element: fetchPriority="high" also makes React emit a
          // <link rel="preload"> for it at the top of <head>. Later slides stay out of its way.
          fetchPriority={idx === 0 ? 'high' : 'low'}
          decoding={idx === 0 ? 'sync' : 'async'}
          aria-hidden={idx !== active}
        />
      ))}

      {slides.length > 1 && (
        <div className="hero-dots" role="tablist" aria-label="Hero slides">
          {slides.map((slide, idx) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={idx === active}
              aria-label={`Show slide ${idx + 1}`}
              className={`hero-dot${idx === active ? ' is-active' : ''}`}
              onClick={() => setActive(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
