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
          src={slide.src}
          alt={idx === active ? slide.alt : ''}
          className={`hero-slide${idx === active ? ' is-active' : ''}`}
          loading={idx === 0 ? 'eager' : 'lazy'}
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
