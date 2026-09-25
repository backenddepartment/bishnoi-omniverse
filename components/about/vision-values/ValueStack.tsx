'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export type StackValue = {
  /** The giant word for the row, e.g. "Customer Focus". */
  word: string;
  /** Bold lead-in of the paragraph, e.g. "Your Requirement Comes First". */
  title: string;
  body: string[];
  img: string;
  imgAlt: string;
  imgPosition?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

// The reveal, one set of variants per piece. The row owns the trigger (whileInView) and passes
// the variant name down, so pieces hidden inside a clipping mask still animate: an observer on
// the word itself would never see it while it sits below the mask.
const num: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
};
const copy: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.15, ease: EASE } },
};
const word: Variants = {
  hidden: { y: '110%' },
  show: { y: 0, transition: { duration: 1, delay: 0.3, ease: EASE } },
};
const rule: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.8, delay: 0.75, ease: EASE } },
};
const arrow: Variants = {
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.9, ease: EASE } },
};
// Under reduced motion everything is simply there.
const still: Variants = { hidden: {}, show: {} };

/**
 * Full-bleed photo rows that stack as the page scrolls: each row sticks under the header and the
 * next one slides up over it, dimming and shrinking the one beneath. As a row comes into view its
 * number and paragraph rise in on the left, the giant word climbs out of a mask with an underline
 * drawing beneath it, and the arrow slides in on the right. Replays on every pass, like the
 * site's other fade-ins, and stays still under reduced motion.
 */
export function ValueStack({ values }: { values: StackValue[] }) {
  return (
    <div className="value-stack">
      {values.map((value, i) => (
        <ValueRow key={value.word} value={value} index={i} last={i === values.length - 1} />
      ))}
    </div>
  );
}

/**
 * How far the next row has climbed over this one: 0 while this row is fully showing, 1 once the
 * next row has reached its own sticky position. Measured from the next row rather than this one,
 * because a stuck row's own position never changes while it is being covered.
 */
function useCoverProgress(ref: React.RefObject<HTMLElement>, enabled: boolean) {
  const progress = useMotionValue(0);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    const next = el?.nextElementSibling as HTMLElement | null;
    if (!el || !next) return;

    const update = () => {
      const top = parseFloat(getComputedStyle(el).top) || 0;
      const travel = window.innerHeight - top;
      const nextTop = next.getBoundingClientRect().top - top;
      progress.set(Math.min(1, Math.max(0, 1 - nextTop / travel)));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [ref, enabled, progress]);

  return progress;
}

function ValueRow({ value, index, last }: { value: StackValue; index: number; last: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  // The last row has nothing sliding over it, so it keeps its full size and brightness.
  const animateCover = !last && !reduceMotion;
  const progress = useCoverProgress(ref, animateCover);
  const scale = useTransform(progress, [0, 1], [1, 0.94]);
  const dim = useTransform(progress, [0, 1], [0, 0.55]);

  const v = (variants: Variants) => (reduceMotion ? still : variants);

  return (
    <motion.article
      ref={ref}
      className="value-row"
      style={animateCover ? { scale } : undefined}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.45 }}
    >
      <img
        src={value.img}
        alt={value.imgAlt}
        loading="lazy"
        className="value-row-media"
        style={{ objectPosition: value.imgPosition ?? 'center' }}
      />
      <div className="value-row-scrim" aria-hidden="true" />
      {animateCover && <motion.div className="value-row-dim" aria-hidden="true" style={{ opacity: dim }} />}

      <div className="wrap value-row-grid">
        <motion.span className="value-row-num" aria-hidden="true" variants={v(num)}>
          {index + 1}
        </motion.span>

        <motion.div className="value-row-copy" variants={v(copy)}>
          <p>
            <strong>{value.title}.</strong> {value.body[0]}
          </p>
          {value.body.slice(1).map((para) => (
            <p key={para}>{para}</p>
          ))}
        </motion.div>

        <h3 className="value-row-word">
          {/* The mask: the word climbs out of it, then the underline draws left to right. */}
          <span className="value-row-mask">
            <motion.span className="value-row-word-inner" variants={v(word)}>
              {value.word}
            </motion.span>
          </span>
          <motion.span className="value-row-rule" aria-hidden="true" variants={v(rule)} />
        </h3>

        <motion.span className="value-row-arrow" aria-hidden="true" variants={v(arrow)}>
          <ArrowRight strokeWidth={1.5} />
        </motion.span>
      </div>
    </motion.article>
  );
}
