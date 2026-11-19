import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { hero } from '../data/content';
import { ease } from '../lib/motion';
import { Button } from './ui/Button';
import { CharReveal } from './ui/CharReveal';
import { Picture } from './ui/Picture';

/**
 * Hero em moldura verde profunda: tipografia clara à esquerda e retrato sorrindo
 * dentro de um arco à direita. O verde da moldura continua o fundo da fotografia.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '10%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-10%']);
  const appear = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: ease.out, delay },
        };

  return (
    <section id="top" ref={ref} aria-labelledby="hero-title" className="relative px-2 pt-2 sm:px-3 sm:pt-3">
      <motion.div
        className="hero-frame relative isolate overflow-hidden rounded-[28px] text-[#f5f3ec] sm:rounded-[36px]"
        initial={reduce ? false : { clipPath: 'inset(3% 3% 3% 3% round 48px)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0% round 0px)' }}
        transition={{ duration: 1.2, ease: ease.inOut }}
      >
        {/* Luz suave vinda da direita, onde está o retrato */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_78%_40%,rgb(164_196_178/0.16),transparent_70%)]" />

        <div className="shell relative grid min-h-[calc(100svh-16px)] grid-rows-[auto_1fr] gap-y-8 pt-28 sm:pt-32 lg:max-h-[1000px] lg:grid-cols-12 lg:grid-rows-1 lg:gap-x-8 lg:pt-0">
          {/* Texto */}
          <motion.div style={{ y: textY }} className="relative z-10 flex flex-col justify-center lg:col-span-7 lg:pb-16 lg:pt-36">
            <motion.p {...appear(0.35)} className="t-label mb-6 flex items-center gap-3 text-[#c9d6ce] sm:mb-8">
              <span className="h-px w-10 bg-[#a4c4b2]" aria-hidden />
              Odontologia estética e reabilitação
            </motion.p>
            <h1 id="hero-title" className="t-display lg:text-[min(6.4rem,7.2vw)]">
              <CharReveal
                lines={hero.lines}
                accentLine={hero.accentLine}
                delay={0.45}
                lineClassName={(i) => (i === 1 ? 'pl-[0.5em] text-[#a4c4b2] sm:pl-[1em]' : '')}
              />
            </h1>
            <motion.p {...appear(1.15)} className="t-lead mt-8 max-w-[27rem] text-[#c9d6ce] sm:mt-10">
              {hero.text}
            </motion.p>
            <motion.div {...appear(1.3)} className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 sm:mt-10">
              <Button
                href={hero.primary.href}
                icon={<ArrowRight size={18} strokeWidth={1.75} />}
                magnetic
                className="bg-[#f5f3ec]! text-[#1f2b26]! hover:bg-white!"
              >
                {hero.primary.label}
              </Button>
              <a
                href={hero.secondary.href}
                className="inline-flex min-h-12 items-center px-1 text-[0.9375rem] font-medium text-[#f5f3ec] underline decoration-[rgb(245_243_236/0.4)] underline-offset-[7px] transition-colors hover:decoration-[#f5f3ec]"
              >
                {hero.secondary.label}
              </a>
            </motion.div>

            {/* Compromissos (desktop) */}
            <motion.ul {...appear(1.5)} className="mt-14 hidden max-w-[36rem] grid-cols-3 border-t border-[rgb(245_243_236/0.16)] pt-6 text-sm text-[#c9d6ce] lg:grid">
              {['Avaliação individualizada', 'Planejamento digital', 'Acompanhamento contínuo'].map((t, i) => (
                <li key={t} className={i > 0 ? 'border-l border-[rgb(245_243_236/0.16)] pl-5' : 'pr-5'}>
                  {t}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Retrato em arco, ancorado na base da moldura */}
          <div className="relative -mx-2 flex items-end justify-center sm:-mx-3 lg:col-span-5 lg:mx-0 lg:pt-28">
            <motion.div
              className="arch relative aspect-[4/5] w-[88%] max-w-[440px] overflow-hidden bg-[#2a3a33] sm:w-[62%] lg:aspect-auto lg:h-[min(76vh,760px)] lg:w-full lg:max-w-[520px]"
              initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration: 1.4, ease: ease.inOut, delay: 0.5 }}
            >
              <motion.div
                className="absolute inset-[-8%_0_0_0]"
                style={{ y: imgY }}
                initial={reduce ? false : { scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2.2, ease: ease.out, delay: 0.5 }}
              >
                <Picture
                  name={hero.image}
                  alt={hero.imageAlt}
                  priority
                  sizes="(min-width: 1024px) 38vw, 80vw"
                  className="h-full w-full scale-[1.32] object-cover object-[50%_62%]"
                  style={{ transformOrigin: '50% 58%' }}
                />
              </motion.div>
              {/* Fusão do retrato com a moldura */}
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#1f2b26]/70 to-transparent" />
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-[rgb(19_27_25/0.45)] px-3 py-1.5 text-xs font-medium text-[#f5f3ec] backdrop-blur-md">
                Imagem ilustrativa
              </span>
            </motion.div>
          </div>
        </div>

        <motion.a
          href="#manifesto"
          {...appear(1.7)}
          className="group absolute bottom-5 left-1/2 hidden min-h-11 -translate-x-1/2 items-center gap-3 text-sm font-medium text-[#c9d6ce] hover:text-[#f5f3ec] xl:inline-flex"
        >
          Role para conhecer
          <span className="grid size-11 place-items-center rounded-full border border-[rgb(245_243_236/0.25)]">
            <ArrowDown size={16} strokeWidth={1.75} aria-hidden className="transition-transform duration-300 ease-out-soft group-hover:translate-y-0.5" />
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}
