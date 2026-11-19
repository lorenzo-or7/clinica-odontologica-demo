import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef } from 'react';
import { manifesto } from '../data/content';
import { MaskReveal } from './ui/MaskReveal';
import { Picture } from './ui/Picture';
import { Reveal } from './ui/Reveal';

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}&nbsp;
    </motion.span>
  );
}

/** Frase manifesto revelada palavra a palavra conforme a rolagem. */
function ScrollStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className="t-h1 text-ink">
      {reduce ? (
        text
      ) : (
        <>
          <span className="sr-only">{text}</span>
          <span aria-hidden>
            {words.map((w, i) => (
              <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
            ))}
          </span>
        </>
      )}
    </p>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const detailY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['18%', '-18%']);

  return (
    <section id="manifesto" ref={ref} aria-labelledby="manifesto-title" className="relative py-24 sm:py-32 lg:py-44">
      <div className="shell grid gap-y-14 lg:grid-cols-12 lg:gap-x-8">
        <h2 id="manifesto-title" className="sr-only">
          Manifesto
        </h2>

        <div className="lg:col-span-9 lg:col-start-4">
          <ScrollStatement text={manifesto.statement} />
        </div>

        {/* Coluna de imagem: retrato vertical com detalhe sobreposto */}
        <div className="relative lg:col-span-5 lg:row-start-2 lg:mt-8">
          <MaskReveal className="aspect-[4/5] w-[86%] rounded-[28px] rounded-tl-[180px] sm:w-[70%] lg:w-full">
            <Picture name={manifesto.images.main.src} alt={manifesto.images.main.alt} sizes="(min-width: 1024px) 38vw, 86vw" className="h-full w-full object-cover" />
          </MaskReveal>
          <motion.div style={{ y: detailY }} className="absolute -bottom-10 right-0 w-[42%] sm:w-[34%] lg:-right-14 lg:w-[44%]">
            <MaskReveal from="left" delay={0.25} className="aspect-[3/4] rounded-[20px] border-[6px] border-bg">
              <Picture name={manifesto.images.detail.src} alt={manifesto.images.detail.alt} sizes="(min-width: 1024px) 18vw, 40vw" className="h-full w-full object-cover" />
            </MaskReveal>
          </motion.div>
        </div>

        {/* Narrativa em passagens escalonadas */}
        <div className="flex flex-col gap-12 pt-10 lg:col-span-6 lg:col-start-7 lg:row-start-2 lg:pt-24">
          <Reveal>
            <p className="t-lead max-w-[30rem] text-ink">{manifesto.intro}</p>
          </Reveal>
          <ol className="flex flex-col">
            {manifesto.passages.map((p, i) => (
              <li key={p.title} className={`border-t border-line py-7 ${i === 1 ? 'lg:ml-16' : i === 2 ? 'lg:ml-32' : ''}`}>
                <Reveal delay={i * 0.08} y={16}>
                  <h3 className="t-h3 text-ink">{p.title}</h3>
                  <p className="mt-3 max-w-[28rem] text-ink-2">{p.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
