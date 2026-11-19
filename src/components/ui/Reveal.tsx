import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { ease } from '../../lib/motion';

/** Entrada discreta de blocos de texto, usada com parcimônia. */
export function Reveal({
  children,
  delay = 0,
  className = '',
  y = 24,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}
