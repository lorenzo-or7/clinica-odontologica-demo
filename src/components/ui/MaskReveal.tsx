import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { ease } from '../../lib/motion';

type Props = {
  children: ReactNode;
  className?: string;
  from?: 'bottom' | 'top' | 'left' | 'right';
  delay?: number;
  duration?: number;
};

const start = {
  bottom: 'inset(100% 0% 0% 0%)',
  top: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
};

/**
 * Cinematic Image Reveal: a máscara abre enquanto a imagem desacelera de 1.14 para 1.
 * Com movimento reduzido o conteúdo aparece imediatamente.
 */
export function MaskReveal({ children, className = '', from = 'bottom', delay = 0, duration = 1.1 }: Props) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={`overflow-hidden ${className}`}>{children}</div>;
  const view = { once: true, margin: '0px 0px -12% 0px' } as const;
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: start[from] }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={view}
      transition={{ duration, ease: ease.inOut, delay }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.14 }}
        whileInView={{ scale: 1 }}
        viewport={view}
        transition={{ duration: duration + 0.5, ease: ease.out, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
