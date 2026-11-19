import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { testimonials } from '../data/content';
import { ease } from '../lib/motion';
import { MaskReveal } from './ui/MaskReveal';
import { Picture } from './ui/Picture';

export function Testimonials() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const t = testimonials[i];
  const go = (d: number) => setI((v) => (v + d + testimonials.length) % testimonials.length);

  return (
    <section aria-labelledby="test-title" className="relative bg-surface-2 py-24 sm:py-32 lg:py-36">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-x-8">
        <div className="relative hidden lg:col-span-4 lg:block">
          <MaskReveal from="left" className="arch aspect-[3/4] bg-surface">
            <Picture name="quote" alt="Interior em concreto iluminado por luz natural" sizes="30vw" className="h-full w-full object-cover" />
          </MaskReveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="test-title" className="t-label text-ink-2">
              Relatos de pacientes
            </h2>
            <span className="rounded-full border border-[color-mix(in_oklab,var(--ink),transparent_70%)] px-3 py-1 text-xs font-medium text-ink">
              Exemplos de layout, não são depoimentos reais
            </span>
          </div>

          <figure className="mt-8 min-h-[16rem] sm:min-h-[14rem]" aria-live="polite">
            <span aria-hidden className="block font-display text-[5rem] leading-[0.6] text-accent">
              “
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={t.id}
                initial={reduce ? false : { opacity: 0, y: 18, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.55, ease: ease.out }}
              >
                <blockquote className="t-h2 mt-2 text-ink">{t.quote}</blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span aria-hidden className="grid size-12 place-items-center rounded-full border border-dashed border-ink-2 text-xs text-ink-2">
                    Foto
                  </span>
                  <span>
                    <span className="block font-medium text-ink">{t.author}</span>
                    <span className="block text-sm text-ink-2">{t.context}</span>
                  </span>
                </figcaption>
              </motion.div>
            </AnimatePresence>
          </figure>

          <div className="mt-10 flex items-center gap-4 border-t border-line pt-6">
            <button type="button" onClick={() => go(-1)} aria-label="Relato anterior" className="grid size-12 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink">
              <ArrowLeft size={18} strokeWidth={1.75} aria-hidden />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Próximo relato" className="grid size-12 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink">
              <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
            </button>
            <span className="text-sm tabular-nums text-ink-2">
              {i + 1} de {testimonials.length}
            </span>
            <p className="ml-auto hidden max-w-[17rem] text-right text-xs text-ink-2 sm:block">
              Substitua por relatos autorizados por escrito em src/data/content.ts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
