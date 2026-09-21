'use client';

import React, { useEffect, useRef } from 'react';

/**
 * The About page's What We Do band, with its two scroll effects.
 *
 * The photograph starts inset from both edges and widens to full bleed as the band rises through
 * the viewport, driven by a --band-progress custom property (0 → 1) that the CSS interpolates the
 * inset and corner radius from. The white panel then fades up into place once it comes into view.
 *
 * Both effects are opt-in from JS: the section only carries data-armed once this mounts, and
 * --band-progress defaults to 1, so without JavaScript — or under reduced-motion, where this bails
 * out early — the band simply renders in its settled state.
 */
export function WhatWeDoBand({ image, children }: { image: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    section.dataset.armed = 'true';

    let frame = 0;
    const update = () => {
      frame = 0;
      const { top } = section.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      // 0 while the band's top edge is still at the bottom of the viewport, 1 once it has risen to
      // a quarter of the way up. The widening happens across that span.
      const progress = Math.min(1, Math.max(0, (viewport - top) / (viewport * 0.75)));
      section.style.setProperty('--band-progress', progress.toFixed(4));
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // The band is taller than the viewport, so the reveal watches the panel rather than the
    // section — otherwise it would fire while the panel is still well below the fold.
    const panel = section.querySelector('.what-we-do-panel');
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          section.classList.add('is-revealed');
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -18% 0px' },
    );
    if (panel) observer.observe(panel);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={ref} className="what-we-do-band section-white">
      <div className="what-we-do-media" aria-hidden="true">
        <img src={image} alt="" loading="lazy" />
      </div>
      <div className="wrap">
        <div className="what-we-do-panel">{children}</div>
      </div>
    </section>
  );
}
