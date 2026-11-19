import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { sculpture } from '../data/content';
import { ease } from '../lib/motion';
import { ToothFallback } from './sculpture/ToothFallback';

const ToothCanvas = lazy(() => import('./sculpture/ToothCanvas'));

class CanvasBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function useMedia(query: string) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return match;
}

const stepAt = (p: number) => (p < 0.36 ? 0 : p < 0.68 ? 1 : 2);

/** Posição vertical (em % do palco) das anotações anatômicas do primeiro momento. */
const anatomy = [
  { label: 'Cúspides', top: '20%', side: 'left' },
  { label: 'Sulco central', top: '27%', side: 'right' },
  { label: 'Colo do dente', top: '49%', side: 'left' },
  { label: 'Raízes', top: '72%', side: 'right' },
] as const;

export function Sculpture() {
  const section = useRef<HTMLElement>(null);
  const reduce = Boolean(useReducedMotion());
  const compact = !useMedia('(min-width: 1024px)');
  const [webgl] = useState(supportsWebGL);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const { scrollYProgress: entry } = useScroll({ target: section, offset: ['start end', 'start start'] });
  const curtain = useTransform(entry, [0, 1], reduce ? ['inset(0% 0% 0% 0% round 0px)', 'inset(0% 0% 0% 0% round 0px)'] : ['inset(8% 5% 0% 5% round 56px)', 'inset(0% 0% 0% 0% round 0px)']);
  const rail = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (p) => setStep(stepAt(p)));

  // Carrega o chunk 3D só quando a seção se aproxima e pausa o render fora da tela.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const pre = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '150% 0px' });
    const vis = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '10% 0px' });
    pre.observe(el);
    vis.observe(el);
    return () => {
      pre.disconnect();
      vis.disconnect();
    };
  }, []);

  const current = sculpture.steps[step];
  const fallback = <ToothFallback className="h-[78%] w-auto" />;

  return (
    <section
      id="escultura"
      ref={section}
      aria-labelledby="sculpture-title"
      className={`relative ${reduce ? '' : 'h-[330svh]'}`}
    >
      <motion.div
        style={{ clipPath: curtain }}
        className={`scope-dark grain relative overflow-hidden bg-bg text-ink ${reduce ? '' : 'sticky top-0 h-svh'}`}
      >
        <div className="shell relative grid h-full grid-rows-[auto_minmax(0,1fr)_auto] gap-4 pb-6 pt-24 lg:grid-cols-12 lg:grid-rows-[1fr_auto] lg:gap-x-8 lg:pb-10 lg:pt-28">
          {/* Texto */}
          <div className="relative z-10 flex flex-col lg:col-span-5 lg:row-span-1 lg:justify-center">
            <h2 id="sculpture-title" className="t-h2 max-w-[13ch] text-ink">
              {sculpture.title[0]} <span className="text-accent">{sculpture.title[1]}</span>
            </h2>
            <p className="mt-5 hidden max-w-[30rem] text-ink-2 lg:block">{sculpture.intro}</p>

            {reduce ? (
              <ol className="mt-10 space-y-8">
                {sculpture.steps.map((s, i) => (
                  <li key={s.id} className="border-t border-line pt-5">
                    <p className="t-label text-accent">
                      {i + 1}. {s.label}
                    </p>
                    <h3 className="t-h3 mt-2">{s.heading}</h3>
                    <p className="mt-2 text-ink-2">{s.text}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="relative mt-6 min-h-[11.5rem] lg:mt-12 lg:min-h-[15rem]" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
                    transition={{ duration: 0.55, ease: ease.out }}
                  >
                    <p className="t-label text-accent">
                      {step + 1} de 3 · {current.label}
                    </p>
                    <h3 className="t-h3 mt-2 text-ink">{current.heading}</h3>
                    <p className="mt-3 max-w-[30rem] text-[0.98rem] text-ink-2 lg:text-[1.0625rem]">{current.text}</p>
                    <ul className="mt-5 hidden flex-wrap gap-2 lg:flex">
                      {current.notes.map((n) => (
                        <li key={n} className="rounded-full border border-line px-3 py-1.5 text-sm text-ink-2">
                          {n}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Palco 3D */}
          <div className={`relative row-start-2 lg:col-span-7 lg:row-span-2 lg:row-start-1 lg:-mr-8 ${reduce ? 'h-[420px] lg:h-[600px] lg:self-center' : 'min-h-0'}`}>
            <div className="absolute inset-0 grid place-items-center">
              {/* Base luminosa discreta sob o objeto */}
              <div aria-hidden className="absolute bottom-[6%] left-1/2 h-[10%] w-[46%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(164_196_178/0.18),transparent)]" />
              {!ready && <div className="absolute inset-0 grid place-items-center">{fallback}</div>}
              {webgl && near && (
                <CanvasBoundary fallback={<div className="absolute inset-0 grid place-items-center">{fallback}</div>}>
                  <Suspense fallback={null}>
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: ready ? 1 : 0 }}
                      transition={{ duration: 0.9, ease: ease.out }}
                    >
                      <ToothCanvas
                        progress={scrollYProgress}
                        active={visible}
                        reduced={reduce}
                        compact={compact}
                        onReady={() => setReady(true)}
                      />
                    </motion.div>
                  </Suspense>
                </CanvasBoundary>
              )}
            </div>

            {/* Anotações anatômicas (momento 1, desktop) */}
            {!compact && !reduce && (
              <AnimatePresence>
                {step === 0 &&
                  anatomy.map((a, i) => (
                    <motion.div
                      key={a.label}
                      aria-hidden
                      className={`pointer-events-none absolute hidden items-center gap-3 xl:flex text-sm text-ink-2 ${a.side === 'left' ? 'left-[6%] flex-row' : 'right-[8%] flex-row-reverse'}`}
                      style={{ top: a.top }}
                      initial={{ opacity: 0, x: a.side === 'left' ? -12 : 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: ease.out, delay: 0.1 + i * 0.08 }}
                    >
                      <span>{a.label}</span>
                      <span className="h-px w-[clamp(3rem,8vw,7rem)] bg-[color-mix(in_oklab,var(--ink),transparent_70%)]" />
                      <span className="size-1.5 rounded-full bg-accent" />
                    </motion.div>
                  ))}
              </AnimatePresence>
            )}
          </div>

          {/* Trilho de progresso */}
          {!reduce && (
            <div className="relative z-10 row-start-3 lg:col-span-5 lg:row-start-2">
              <div className="relative h-px w-full bg-line">
                <motion.div style={{ scaleX: rail }} className="absolute inset-0 origin-left bg-accent" />
              </div>
              <ol className="mt-3 grid grid-cols-3 text-sm">
                {sculpture.steps.map((s, i) => (
                  <li key={s.id} className={`transition-colors duration-300 ${i === step ? 'text-ink' : 'text-ink-2/70'} ${i === 1 ? 'text-center' : i === 2 ? 'text-right' : ''}`}>
                    {s.label}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
