'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export type PrincipleTab = {
  /** Short label shown in the pill bar. */
  tab: string;
  title: string;
  desc: string;
  img: string;
  imgAlt: string;
  ctaText: string;
  ctaHref: string;
};

/**
 * Tabbed panel: a pill bar selects which principle is shown, and the panel below pairs its photo
 * with the copy. Client-side because the selection is interactive; the panel is rendered in full
 * for the active tab only, with the others kept mounted-free so there is nothing hidden to index.
 */
export const PrincipleTabs: React.FC<{ items: PrincipleTab[] }> = ({ items }) => {
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <div className="op-tabs">
      <div className="op-tabbar" role="tablist" aria-label="Operating principles">
        {items.map((item, idx) => (
          <button
            key={item.tab}
            type="button"
            role="tab"
            id={`op-tab-${idx}`}
            aria-selected={idx === active}
            aria-controls="op-panel"
            className={`op-tab${idx === active ? ' is-active' : ''}`}
            onClick={() => setActive(idx)}
          >
            {item.tab}
          </button>
        ))}
      </div>

      <div className="op-panel" id="op-panel" role="tabpanel" aria-labelledby={`op-tab-${active}`}>
        <div className="op-panel-media">
          <img src={current.img} alt={current.imgAlt} loading="lazy" />
        </div>
        <div className="op-panel-body">
          <h3>{current.title}</h3>
          <p>{current.desc}</p>
          <Link href={current.ctaHref} className="op-panel-cta">
            {current.ctaText}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
};
