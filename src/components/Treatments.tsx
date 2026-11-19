import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Plus } from 'lucide-react';
import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { categories, treatments, type Category } from '../data/treatments';
import { useBooking } from '../lib/useBooking';
import { ease } from '../lib/motion';
import { Picture } from './ui/Picture';
import { Reveal } from './ui/Reveal';

type Filter = Category | 'todos';

export function Treatments() {
  const [filter, setFilter] = useState<Filter>('todos');
  const [openId, setOpenId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState(treatments[0].id);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  const { open } = useBooking();

  const list = useMemo(() => treatments.filter((t) => filter === 'todos' || t.category === filter), [filter]);
  const preview = treatments.find((t) => t.id === (openId ?? previewId)) ?? list[0] ?? treatments[0];

  const choose = (f: Filter) => {
    setFilter(f);
    setOpenId(null);
    const first = treatments.find((t) => f === 'todos' || t.category === f);
    if (first) setPreviewId(first.id);
  };

  const onRowKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const move = (to: number) => {
      e.preventDefault();
      rowRefs.current[(to + list.length) % list.length]?.focus();
    };
    if (e.key === 'ArrowDown') move(i + 1);
    if (e.key === 'ArrowUp') move(i - 1);
    if (e.key === 'Home') move(0);
    if (e.key === 'End') move(list.length - 1);
  };

  const catLabel = (c: Category) => categories.find((x) => x.id === c)?.label ?? '';

  return (
    <section id="tratamentos" aria-labelledby="treat-title" className="relative py-24 sm:py-32 lg:py-40">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <Reveal className="lg:col-span-7">
            <h2 id="treat-title" className="t-h1 text-ink">
              Cuidado para cada sorriso.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="text-ink-2">
              Conheça os tratamentos mais procurados. A indicação de cada um depende sempre de uma avaliação individual.
            </p>
          </Reveal>
        </div>

        {/* Filtros */}
        <div className="mt-12 flex items-center justify-between gap-4 border-b border-line pb-5 lg:mt-16">
          <div
            role="group"
            aria-label="Filtrar tratamentos por categoria"
            className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0"
          >
            <LayoutGroup id="filters">
              {categories.map((c) => {
                const on = filter === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => choose(c.id)}
                    className={`relative min-h-11 shrink-0 rounded-full px-4 text-[0.9375rem] font-medium transition-colors duration-200 ${
                      on ? 'text-on-accent' : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="filter-pill"
                        className="absolute inset-0 rounded-full bg-accent-strong"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    {!on && <span className="absolute inset-0 rounded-full border border-line" aria-hidden />}
                    <span className="relative">{c.label}</span>
                  </button>
                );
              })}
            </LayoutGroup>
          </div>
          <p className="hidden shrink-0 text-sm text-ink-2 sm:block" aria-live="polite">
            {list.length} {list.length === 1 ? 'tratamento' : 'tratamentos'}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 lg:gap-x-8">
          {/* Lista */}
          <div className="lg:col-span-7">
            {list.length === 0 ? (
              <div className="py-16 text-center">
                <p className="t-h3">Nenhum tratamento nesta categoria.</p>
                <button type="button" onClick={() => choose('todos')} className="mt-4 min-h-11 text-accent-strong underline underline-offset-4">
                  Ver todos os tratamentos
                </button>
              </div>
            ) : (
              <motion.ul layout={!reduce} className="flex flex-col">
                <AnimatePresence initial={false} mode="popLayout">
                  {list.map((t, i) => {
                    const isOpen = openId === t.id;
                    const panelId = `treat-${t.id}`;
                    return (
                      <motion.li
                        key={t.id}
                        layout={!reduce}
                        initial={reduce ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -8, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.45, ease: ease.out }}
                        className="group/row border-b border-line"
                        onMouseEnter={() => setPreviewId(t.id)}
                      >
                        <h3>
                          <button
                            ref={(el) => {
                              rowRefs.current[i] = el;
                            }}
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() => setOpenId(isOpen ? null : t.id)}
                            onFocus={() => setPreviewId(t.id)}
                            onKeyDown={(e) => onRowKey(e, i)}
                            className="flex w-full items-center gap-4 py-5 text-left sm:gap-6 sm:py-7"
                          >
                            <span className="size-16 shrink-0 overflow-hidden rounded-2xl bg-surface-2 lg:hidden">
                              <Picture name={t.image} alt="" sizes="64px" className="h-full w-full object-cover" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="t-label block text-ink-2">{catLabel(t.category)}</span>
                              <span
                                className={`mt-1 block font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.6rem)] leading-[1.05] tracking-[-0.01em] transition-[color,transform] duration-300 ease-out-soft lg:group-hover/row:translate-x-2 ${
                                  isOpen ? 'text-accent-strong' : 'text-ink'
                                }`}
                              >
                                {t.name}
                              </span>
                              <span className="mt-2 block max-w-[34rem] text-[0.98rem] text-ink-2 lg:grid lg:grid-rows-[0fr] lg:opacity-0 lg:transition-[grid-template-rows,opacity] lg:duration-500 lg:ease-out-soft lg:group-hover/row:grid-rows-[1fr] lg:group-hover/row:opacity-100 lg:group-focus-within/row:grid-rows-[1fr] lg:group-focus-within/row:opacity-100">
                                <span className="overflow-hidden">{t.summary}</span>
                              </span>
                            </span>
                            <span
                              aria-hidden
                              className={`grid size-11 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ease-out-soft ${
                                isOpen ? 'rotate-45 border-accent-strong bg-accent-strong text-on-accent' : 'border-line text-ink group-hover/row:border-ink'
                              }`}
                            >
                              <Plus size={18} strokeWidth={1.75} />
                            </span>
                          </button>
                        </h3>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              id={panelId}
                              role="region"
                              aria-label={t.name}
                              initial={reduce ? false : { height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={reduce ? undefined : { height: 0, opacity: 0 }}
                              transition={{ duration: 0.5, ease: ease.out }}
                              className="overflow-hidden"
                            >
                              <div className="grid gap-6 pb-8 sm:grid-cols-[1fr_auto] sm:gap-10 lg:pl-0">
                                <div className="max-w-[36rem]">
                                  <p className="text-ink">{t.detail}</p>
                                  <p className="mt-4 text-sm text-ink-2">
                                    <span className="font-medium text-ink">Indicação: </span>
                                    {t.forWhom}
                                  </p>
                                  <div className="mt-6 flex flex-wrap items-center gap-3">
                                    <button
                                      type="button"
                                      onClick={() => open({ treatment: t.name })}
                                      className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent-strong px-5 text-[0.9375rem] font-medium text-on-accent transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--accent-strong),var(--ink)_20%)]"
                                    >
                                      Perguntar sobre {t.name.toLowerCase()}
                                      <ArrowUpRight size={17} strokeWidth={1.75} aria-hidden />
                                    </button>
                                  </div>
                                </div>
                                <ol className="min-w-[15rem] space-y-0 text-sm">
                                  <li className="t-label pb-2 text-ink-2">Como costuma ser</li>
                                  {t.steps.map((s, si) => (
                                    <li key={s} className="flex gap-3 border-t border-line py-2.5 text-ink">
                                      <span className="w-4 text-accent-strong tabular-nums">{si + 1}</span>
                                      {s}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </motion.ul>
            )}
          </div>

          {/* Prévia fotográfica (desktop) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28 mt-10">
              <div className="arch-soft relative aspect-[4/5] overflow-hidden bg-surface-2">
                <AnimatePresence initial={false} mode="sync">
                  <motion.div
                    key={preview.id}
                    className="absolute inset-0"
                    initial={reduce ? { opacity: 0 } : { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 }}
                    animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
                    exit={{ opacity: 1 }}
                    transition={{ duration: 0.8, ease: ease.inOut }}
                  >
                    <Picture name={preview.image} alt={preview.imageAlt} sizes="38vw" className="h-full w-full object-cover" />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4 text-sm">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={preview.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="text-ink"
                  >
                    {preview.name}
                  </motion.p>
                </AnimatePresence>
                <span className="text-ink-2">Imagem ilustrativa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
