'use client';

import { motion } from 'framer-motion';

export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 1.4, delay, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
