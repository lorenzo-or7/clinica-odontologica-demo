import { AnimatePresence, motion, useReducedMotion, useScroll } from 'motion/react';
import { Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { journey } from '../data/content';
import { ease } from '../lib/motion';
import { Picture } from './ui/Picture';
import { Reveal } from './ui/Reveal';

export function Journey() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.6', 'end 0.6'] });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: '-48% 0px -48% 0px' },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const step = journey[active];

  return (
    <section id="jornada" aria-labelledby="journey-title" className="relative py-24 sm:py-32 lg:py-40">
      <div className="shell grid gap-x-8 lg:grid-cols-12">
        {/* Coluna fixa (desktop) */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <h2 id="journey-title" className="t-h1 text-ink">
                Sua jornada, passo a passo.
              </h2>
              <p className="mt-5 max-w-[26rem] text-ink-2">
                Do primeiro contato ao acompanhamento, você sabe sempre o que vem a seguir.
              </p>
            </Reveal>

            <div className="relative mt-10 hidden aspect-[5/4] overflow-hidden rounded-[28px] bg-surface-2 lg:block">
              <AnimatePresence initial={false}>
                <motion.div
                  key={step.id}
                  className="absolute inset-0"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: ease.out }}
                >
                  <Picture name={step.image} alt={step.alt} sizes="36vw" className="h-full w-full object-cover" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-veil px-3 py-1.5 text-sm font-medium text-ink backdrop-blur-md">
                <span className="tabular-nums">Etapa {active + 1} de {journey.length}</span>
              </div>
            </div>

            {/* Índice compacto */}
            <ol className="mt-6 hidden gap-2 lg:flex" aria-hidden>
              {journey.map((j, i) => (
                <li key={j.id} className="flex-1">
                  <span className={`block h-[3px] rounded-full transition-colors duration-500 ${i <= active ? 'bg-accent-strong' : 'bg-line'}`} />
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Etapas */}
        <ol ref={listRef} className="relative mt-14 lg:col-span-6 lg:col-start-7 lg:mt-0">
          {/* Linha vertical com progresso */}
          <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-px bg-line lg:left-[23px]" />
          <motion.span
            aria-hidden
            style={{ scaleY: reduce ? 1 : scrollYProgress }}
            className="absolute bottom-6 left-[19px] top-6 w-px origin-top bg-accent-strong lg:left-[23px]"
          />
          {journey.map((j, i) => {
            const on = i === active;
            return (
              <li
                key={j.id}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                data-index={i}
                className="relative grid grid-cols-[40px_1fr] gap-x-5 pb-16 last:pb-0 lg:min-h-[62vh] lg:grid-cols-[48px_1fr] lg:gap-x-8 lg:pb-0"
              >
                <span
                  className={`relative z-10 grid size-10 place-items-center rounded-full border text-sm font-medium tabular-nums transition-colors duration-500 lg:size-12 ${
                    on ? 'border-accent-strong bg-accent-strong text-on-accent' : i < active ? 'border-accent-strong bg-bg text-accent-strong' : 'border-line bg-bg text-ink-2'
                  }`}
                >
                  {i + 1}
                </span>
                <div className="lg:pt-1">
                  <h3 className={`t-h2 transition-colors duration-500 ${on || reduce ? 'text-ink' : 'text-ink lg:text-ink-2'}`}>{j.title}</h3>
                  <p className="t-lead mt-4 max-w-[32rem] text-ink-2">{j.text}</p>
                  <ul className="mt-6 space-y-2.5">
                    {j.detail.map((d) => (
                      <li key={d} className="flex items-start gap-3 text-ink">
                        <Check size={18} strokeWidth={1.75} className="mt-[3px] shrink-0 text-accent-strong" aria-hidden />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 aspect-[16/10] overflow-hidden rounded-[22px] bg-surface-2 lg:hidden">
                    <Picture name={j.image} alt={j.alt} sizes="90vw" className="h-full w-full object-cover" />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
