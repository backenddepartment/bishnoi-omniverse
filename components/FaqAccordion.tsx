'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export type FaqItem = { q: string; a: string };

/**
 * Accordion FAQ list. Items open independently (not a single-open accordion), so a reader can
 * compare two answers side by side. The first item starts open so the section never reads as an
 * inert list of headings.
 */
export function FaqAccordion({ questions }: { questions: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number[]>([0]);

  const toggle = (i: number) =>
    setOpenIdx((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  return (
    <div className="faq-list">
      {questions.map((item, i) => {
        const isOpen = openIdx.includes(i);
        return (
          <div key={item.q} className="faq-item">
            <button
              type="button"
              className="faq-q"
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
            >
              <span>{item.q}</span>
              <span className={`faq-toggle${isOpen ? ' is-open' : ''}`} aria-hidden="true">
                <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="faq-a">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
