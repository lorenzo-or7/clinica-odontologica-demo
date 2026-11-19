import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { faq } from '../data/content';
import { useBooking } from '../lib/useBooking';
import { ease } from '../lib/motion';
import { Button } from './ui/Button';
import { Reveal } from './ui/Reveal';

export function Faq() {
  const [openId, setOpenId] = useState<string | null>(faq[0].id);
  const reduce = useReducedMotion();
  const { open } = useBooking();

  return (
    <section id="duvidas" aria-labelledby="faq-title" className="relative py-24 sm:py-32 lg:py-40">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-4">
          <Reveal className="lg:sticky lg:top-28">
            <h2 id="faq-title" className="t-h1 text-ink">
              Dúvidas frequentes
            </h2>
            <p className="mt-5 max-w-[24rem] text-ink-2">
              Respostas gerais para começar. Questões sobre o seu caso são tratadas na avaliação.
            </p>
            <div className="mt-8">
              <Button variant="outline" onClick={() => open()}>
                Falar com a equipe
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => setOpenId(null)}
              disabled={!openId}
              className="min-h-11 px-1 text-sm font-medium text-ink-2 underline-offset-4 transition-colors enabled:hover:text-ink enabled:hover:underline disabled:opacity-40"
            >
              Fechar todas
            </button>
          </div>
          <ul className="border-t border-line">
            {faq.map((item) => {
              const isOpen = openId === item.id;
              return (
                <li key={item.id} className="border-b border-line">
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${item.id}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${item.id}`}
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className={`font-display text-[clamp(1.3rem,1.1rem+0.8vw,1.85rem)] leading-tight transition-colors duration-200 ${isOpen ? 'text-accent-strong' : 'text-ink group-hover:text-accent-strong'}`}>
                        {item.q}
                      </span>
                      <span
                        aria-hidden
                        className={`grid size-11 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ease-out-soft ${
                          isOpen ? 'rotate-45 border-accent-strong bg-accent-strong text-on-accent' : 'border-line text-ink group-hover:border-ink'
                        }`}
                      >
                        <Plus size={18} strokeWidth={1.75} />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-a-${item.id}`}
                        role="region"
                        aria-labelledby={`faq-q-${item.id}`}
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: ease.out }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[40rem] pb-7 pr-12 text-ink-2">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
