'use client';

import { motion, useReducedMotion } from 'framer-motion';

type Direction = 'up' | 'left' | 'right';

// Where the element starts before it settles. Sideways entrances travel further than the upward
// one, since horizontal movement reads as less pronounced at the same distance.
const OFFSETS: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  left: { x: -64, y: 0 },
  right: { x: 64, y: 0 },
};

export function FadeIn({
  children,
  delay = 0,
  className,
  from = 'up',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: Direction;
}) {
  // Under reduced-motion the element still fades, it just does not travel.
  const reduceMotion = useReducedMotion();
  const offset = reduceMotion ? { x: 0, y: 0 } : OFFSETS[from];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, amount: 0.2, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 1.4, delay, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
