import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useState, type KeyboardEvent } from 'react';
import { visit } from '../data/content';
import { ease } from '../lib/motion';
import { Picture } from './ui/Picture';
import { Reveal } from './ui/Reveal';

const rooms = visit.rooms;

export function Visit() {
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const reduce = useReducedMotion();
  const room = rooms[index];

  const go = useCallback((to: number) => {
    setState(([cur]) => {
      const next = (to + rooms.length) % rooms.length;
      return [next, next > cur || (cur === rooms.length - 1 && next === 0) ? 1 : -1];
    });
  }, []);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(index + 1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(index - 1);
  };

  const enter = dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)';

  return (
    <section id="experiencia" aria-labelledby="visit-title" className="relative py-24 sm:py-32 lg:py-40">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <Reveal className="lg:col-span-6">
            <p className="t-label mb-4 text-accent-strong">Visita guiada</p>
            <h2 id="visit-title" className="t-h1 text-ink">
              {visit.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="text-ink-2">{visit.text}</p>
          </Reveal>
        </div>

        {/* As setas do teclado funcionam a partir de qualquer controle do carrossel (delegação). */}
        {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <section className="relative mt-12 lg:mt-16" aria-roledescription="carrossel" aria-label="Ambientes da clínica" onKeyDown={onKey}>
          {/* Palco */}
          <motion.div
            className="relative aspect-[4/5] cursor-grab touch-pan-y overflow-hidden rounded-[28px] bg-surface-2 active:cursor-grabbing sm:aspect-[4/3] lg:aspect-[16/8.2] lg:rounded-[36px]"
            drag={reduce ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={onDragEnd}
          >
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={room.id}
                className="absolute inset-0"
                initial={reduce ? { opacity: 0 } : { clipPath: enter, zIndex: 2 }}
                animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)', zIndex: 2 }}
                exit={reduce ? { opacity: 0 } : { zIndex: 1 }}
                transition={{ duration: 1.0, ease: ease.inOut }}
              >
                <motion.div
                  className="h-full w-full"
                  initial={reduce ? false : { scale: 1.16, x: dir > 0 ? '4%' : '-4%' }}
                  animate={{ scale: 1, x: '0%' }}
                  transition={{ duration: 1.5, ease: ease.out }}
                >
                  <Picture
                    name={room.image}
                    alt={room.alt}
                    sizes="(min-width: 1360px) 1300px, 100vw"
                    draggable={false}
                    className="pointer-events-none h-full w-full select-none object-cover"
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Véu para legibilidade da legenda */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-1/2 bg-gradient-to-t from-black/55 to-transparent" />

            <div className="absolute left-5 top-5 z-[4] flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md sm:left-7 sm:top-7">
              <span className="tabular-nums">
                {String(index + 1).padStart(2, '0')} / {String(rooms.length).padStart(2, '0')}
              </span>
            </div>

            <div className="absolute inset-x-5 bottom-5 z-[4] flex items-end justify-between gap-6 text-white sm:inset-x-8 sm:bottom-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={room.id}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, ease: ease.out, delay: reduce ? 0 : 0.25 }}
                  className="max-w-[32rem]"
                  aria-live="polite"
                >
                  <h3 className="font-display text-[clamp(1.9rem,1.3rem+2.4vw,3.4rem)] leading-none">{room.name}</h3>
                  <p className="mt-3 text-[0.98rem] text-white/85">{room.caption}</p>
                </motion.div>
              </AnimatePresence>
              <div className="hidden shrink-0 gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Ambiente anterior"
                  className="grid size-12 place-items-center rounded-full border border-white/40 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white hover:text-[#252b29]"
                >
                  <ArrowLeft size={18} strokeWidth={1.75} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Próximo ambiente"
                  className="grid size-12 place-items-center rounded-full border border-white/40 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white hover:text-[#252b29]"
                >
                  <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Índice de ambientes */}
          <div className="mt-5 flex items-center gap-3 sm:hidden">
            <button type="button" onClick={() => go(index - 1)} aria-label="Ambiente anterior" className="grid size-12 shrink-0 place-items-center rounded-full border border-line">
              <ArrowLeft size={18} strokeWidth={1.75} aria-hidden />
            </button>
            <p className="flex-1 text-center text-sm text-ink-2">Deslize ou use as setas</p>
            <button type="button" onClick={() => go(index + 1)} aria-label="Próximo ambiente" className="grid size-12 shrink-0 place-items-center rounded-full border border-line">
              <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
          <ol className="mt-4 grid grid-cols-4 gap-2 sm:mt-6 sm:gap-6">
            {rooms.map((r, i) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === index ? 'true' : undefined}
                  aria-label={`${r.name}, ambiente ${i + 1} de ${rooms.length}`}
                  className="group flex min-h-11 w-full flex-col gap-3 pt-1 text-left"
                >
                  <span className="relative block h-[2px] w-full overflow-hidden bg-line">
                    <motion.span
                      className="absolute inset-0 origin-left bg-accent-strong"
                      initial={false}
                      animate={{ scaleX: i === index ? 1 : i < index ? 0.999 : 0 }}
                      style={{ opacity: i < index ? 0.35 : 1 }}
                      transition={{ duration: 0.6, ease: ease.out }}
                    />
                  </span>
                  <span className={`hidden text-sm transition-colors duration-200 sm:block ${i === index ? 'text-ink' : 'text-ink-2 group-hover:text-ink'}`}>
                    {r.name}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs text-ink-2">{visit.note}</p>
        </section>
      </div>
    </section>
  );
}
