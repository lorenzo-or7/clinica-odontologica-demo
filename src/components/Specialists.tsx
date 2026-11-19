import { ArrowUpRight } from 'lucide-react';
import { specialists, type Specialist } from '../data/content';
import { useBooking } from '../lib/useBooking';
import { MaskReveal } from './ui/MaskReveal';
import { Picture } from './ui/Picture';
import { Reveal } from './ui/Reveal';

function Profile({ p, size, delay = 0 }: { p: Specialist; size: 'lg' | 'sm'; delay?: number }) {
  const { open } = useBooking();
  return (
    <article className="group flex h-full flex-col" aria-labelledby={`sp-${p.id}`}>
      <MaskReveal
        delay={delay}
        className={`relative bg-surface-2 ${size === 'lg' ? 'aspect-[4/5] rounded-[32px] rounded-tr-[200px]' : 'aspect-[3/4] rounded-[28px]'}`}
      >
        <Picture
          name={p.image}
          alt={p.alt}
          sizes={size === 'lg' ? '(min-width: 1024px) 44vw, 82vw' : '(min-width: 1024px) 24vw, 82vw'}
          className="h-full w-full object-cover saturate-[0.82] transition-[transform,filter] duration-700 ease-out-soft group-hover:scale-[1.035] group-hover:saturate-100"
        />
      </MaskReveal>
      <div className="mt-5 flex flex-1 flex-col">
        <p className="t-label text-accent-strong">{p.area}</p>
        <h3 id={`sp-${p.id}`} className={`mt-1.5 text-ink ${size === 'lg' ? 't-h2' : 't-h3'}`}>
          {p.name}
        </h3>
        <p className="mt-3 max-w-[30rem] text-[0.98rem] text-ink-2">{p.bio}</p>
        <p className="mt-3 text-xs text-ink-2">Profissional fictício · retrato ilustrativo</p>
        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={() => open({ specialist: p.name, treatment: p.area })}
            className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-ink underline decoration-[color-mix(in_oklab,var(--ink),transparent_62%)] underline-offset-[7px] transition-colors hover:decoration-ink"
          >
            Agendar com {p.name.split(' ').slice(0, 2).join(' ')}
            <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}

export function Specialists() {
  const [lead, ...rest] = specialists;
  return (
    <section id="especialistas" aria-labelledby="sp-title" className="relative border-t border-line bg-surface py-24 sm:py-32 lg:py-40">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-x-8">
          <Reveal className="lg:col-span-7">
            <h2 id="sp-title" className="t-h1 text-ink">
              A excelência está nas pessoas.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="text-ink-2">
              Uma equipe que trabalha junta em cada plano. Os perfis abaixo são fictícios e servem para mostrar como a equipe da clínica pode ser apresentada.
            </p>
          </Reveal>
        </div>

        {/* Desktop: composição editorial escalonada */}
        <div className="mt-16 hidden gap-x-8 lg:grid lg:grid-cols-12">
          <div className="col-span-6">
            <Profile p={lead} size="lg" />
          </div>
          <div className="col-span-3 mt-40">
            <Profile p={rest[0]} size="sm" delay={0.1} />
          </div>
          <div className="col-span-3 mt-[22rem]">
            <Profile p={rest[1]} size="sm" delay={0.2} />
          </div>
        </div>

        {/* Mobile e tablet: trilho com encaixe */}
        <ul className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:-mx-7 sm:px-7 lg:hidden" aria-label="Especialistas">
          {specialists.map((p) => (
            <li key={p.id} className="w-[82%] max-w-[380px] shrink-0 snap-start">
              <Profile p={p} size="sm" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
