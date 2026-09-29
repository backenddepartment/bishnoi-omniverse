'use client';

import React, { useId, useState } from 'react';
import { ArrowUpRight, Minus, Plus } from 'lucide-react';

/**
 * Contact Us · the guide under the form: a headline, a line of copy and two buttons on the left,
 * and on the right a stack of cards that open one at a time — how to request a quote, how to send
 * a list, which form suits which inquiry, and what happens next. Each open card carries its copy
 * and a round arrow button that takes the visitor to the part of the form it is about.
 *
 * The styles are in globals.css under `ap-guide`.
 */

export type GuideItem = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  /** What the round arrow button does, for screen readers, and the action itself. */
  actionLabel: string;
  onAction: () => void;
};

export function GuideAccordion({
  eyebrow,
  title,
  text,
  actions,
  items,
}: {
  eyebrow?: string;
  title: string;
  text: string;
  actions?: React.ReactNode;
  items: GuideItem[];
}) {
  const [open, setOpen] = useState(0);
  const id = useId();

  return (
    <div className="ap-guide">
      <div className="ap-guide-copy">
        <span className="ap-guide-mark" aria-hidden="true">
          <span />
          <span />
        </span>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        <p>{text}</p>
        {actions && <div className="ap-guide-actions">{actions}</div>}
      </div>

      <div className="ap-guide-cards">
        {items.map((item, i) => {
          const isOpen = i === open;
          return (
            <div key={item.title} className={`ap-guide-card${isOpen ? ' is-open' : ''}`}>
              <h3 className="ap-guide-card-head">
                <button
                  type="button"
                  id={`${id}-head-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`${id}-panel-${i}`}
                  // A card that is open closes on a second press, leaving the stack all shut.
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>
                    <span className="ap-guide-card-eyebrow">{item.eyebrow}</span>
                    <span className="ap-guide-card-title">{item.title}</span>
                  </span>
                  <span className="ap-guide-card-toggle" aria-hidden="true">
                    {isOpen ? <Minus strokeWidth={1.75} /> : <Plus strokeWidth={1.75} />}
                  </span>
                </button>
              </h3>
              <div
                id={`${id}-panel-${i}`}
                role="region"
                aria-labelledby={`${id}-head-${i}`}
                className="ap-guide-card-panel"
              >
                <div className="ap-guide-card-body">
                  {item.paragraphs.map((p, n) => (
                    <p key={n}>{p}</p>
                  ))}
                  <button type="button" className="ap-guide-card-go" onClick={item.onAction} aria-label={item.actionLabel}>
                    <ArrowUpRight strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
