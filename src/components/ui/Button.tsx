import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import type { MouseEvent, PointerEvent, ReactNode } from 'react';
import { spring } from '../../lib/motion';

type Variant = 'primary' | 'outline' | 'quiet';

type Common = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: ReactNode;
  magnetic?: boolean;
  ariaLabel?: string;
};
type AsLink = Common & { href: string; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void; external?: boolean };
type AsButton = Common & { href?: undefined; onClick?: () => void; type?: 'button' | 'submit' };

const styles: Record<Variant, string> = {
  primary: 'px-6 bg-accent-strong text-on-accent hover:bg-[color-mix(in_oklab,var(--accent-strong),var(--ink)_20%)]',
  outline:
    'px-6 border border-[color-mix(in_oklab,var(--ink),transparent_68%)] text-ink hover:border-ink hover:bg-[color-mix(in_oklab,var(--ink),transparent_94%)]',
  quiet:
    'px-1 text-ink underline decoration-[color-mix(in_oklab,var(--ink),transparent_62%)] underline-offset-[7px] hover:decoration-ink',
};

/** Botão ou link em pílula, com pressão em mola e atração magnética leve opcional. */
export function Button(props: AsLink | AsButton) {
  const { children, variant = 'primary', className = '', icon, magnetic, ariaLabel } = props;
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 20 });
  const sy = useSpring(y, { stiffness: 260, damping: 20 });

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!magnetic || reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.16);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.26);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const cls = `group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full text-[0.9375rem] font-medium leading-none transition-[background-color,border-color,color,text-decoration-color] duration-200 ease-out-soft select-none ${styles[variant]} ${className}`;
  const motionProps = {
    style: { x: sx, y: sy },
    whileTap: reduce ? undefined : { scale: 0.97 },
    transition: spring,
    onPointerMove: onMove,
    onPointerLeave: reset,
    'aria-label': ariaLabel,
  };
  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <span aria-hidden className="transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </>
  );

  if (props.href !== undefined) {
    const p = props as AsLink;
    const ext = p.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    return (
      <motion.a href={p.href} onClick={p.onClick} className={cls} {...ext} {...motionProps}>
        {content}
      </motion.a>
    );
  }
  const b = props as AsButton;
  return (
    <motion.button type={b.type ?? 'button'} onClick={b.onClick} className={cls} {...motionProps}>
      {content}
    </motion.button>
  );
}
