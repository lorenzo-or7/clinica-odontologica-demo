import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ease } from '../../lib/motion';

type Props = {
  lines: readonly string[];
  accentLine?: number;
  delay?: number;
  className?: string;
  lineClassName?: (i: number) => string;
  /** 'mount' anima ao carregar; 'view' anima quando entra na tela. */
  trigger?: 'mount' | 'view';
};

const char: Variants = {
  hidden: { opacity: 0, y: '0.3em', filter: 'blur(6px)' },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.62, ease: ease.out, delay: d },
  }),
};

/**
 * Revelação letra por letra sem quebrar palavras.
 * O texto completo fica disponível para leitores de tela em um único nó.
 */
export function CharReveal({ lines, accentLine, delay = 0, className = '', lineClassName, trigger = 'mount' }: Props) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <span className={className}>
        {lines.map((l, i) => (
          <span key={i} className={`block ${i === accentLine ? 'italic' : ''} ${lineClassName?.(i) ?? ''}`}>
            {l}
          </span>
        ))}
      </span>
    );
  }
  let index = 0;
  const play = trigger === 'mount' ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -20% 0px' } };
  return (
    <span className={className}>
      <span className="sr-only">{lines.join(' ')}</span>
      <motion.span aria-hidden initial="hidden" {...play} className="block">
        {lines.map((line, li) => (
          <span key={li} className={`block ${li === accentLine ? 'italic' : ''} ${lineClassName?.(li) ?? ''}`}>
            {line.split(' ').map((word, wi, arr) => (
              <span key={wi} className="inline-block whitespace-nowrap">
                {[...word].map((ch) => {
                  const i = index++;
                  return (
                    <motion.span key={i} className="inline-block" variants={char} custom={delay + i * 0.03}>
                      {ch}
                    </motion.span>
                  );
                })}
                {wi < arr.length - 1 && <span className="inline-block">&nbsp;</span>}
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </span>
  );
}
