import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { useBooking } from '../lib/useBooking';
import { Button } from './ui/Button';
import { CharReveal } from './ui/CharReveal';
import { Picture } from './ui/Picture';

/** Encerramento: a fotografia se abre de um arco para tela cheia conforme a rolagem. */
export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { open } = useBooking();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const clip = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ['inset(0% 0% 0% 0% round 0px)', 'inset(0% 0% 0% 0% round 0px)'] : ['inset(14% 22% 0% 22% round 400px 400px 24px 24px)', 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)'],
  );
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.2, 1]);

  return (
    <section ref={ref} aria-labelledby="cta-title" className="scope-dark relative bg-bg text-ink">
      <motion.div style={{ clipPath: clip }} className="relative min-h-[92svh] overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0">
          <Picture name="cta" alt="Arquitetura branca em curvas sob luz natural" sizes="100vw" className="h-full w-full object-cover" />
        </motion.div>
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(19_27_25/0.35)_0%,rgb(19_27_25/0.55)_55%,rgb(19_27_25/0.85)_100%)]" />
        <div className="shell relative flex min-h-[92svh] flex-col items-start justify-end pb-16 pt-32 sm:pb-20 lg:pb-24">
          <h2 id="cta-title" className="t-display max-w-[11ch] text-[#f5f3ec]">
            <CharReveal lines={['Seu próximo sorriso', 'começa aqui.']} accentLine={1} delay={0.1} trigger="view" />
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button onClick={() => open()} icon={<ArrowRight size={18} strokeWidth={1.75} />} magnetic className="min-h-14 px-7 text-base">
              Agendar minha avaliação
            </Button>
            <p className="max-w-[22rem] text-sm text-[#d9ddd8]">
              Protótipo: o agendamento abre uma demonstração e não envia mensagens a nenhuma clínica.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
