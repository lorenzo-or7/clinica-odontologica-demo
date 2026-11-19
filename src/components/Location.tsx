import { Clock, MapPin, Navigation } from 'lucide-react';
import { site } from '../config/site';
import { useBooking } from '../lib/useBooking';
import { hasAddress, routesLink } from '../lib/contact';
import { Button } from './ui/Button';
import { Reveal } from './ui/Reveal';

/** Mapa ilustrativo em SVG: não aponta para nenhum lugar real. */
function DemoMap() {
  return (
    <svg viewBox="0 0 640 520" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Mapa demonstrativo, sem localização real">
      <rect width="640" height="520" fill="var(--surface-2)" />
      <g fill="none" stroke="var(--line)" strokeWidth="14" strokeLinecap="round">
        <path d="M-20 140 C 160 120, 260 210, 660 170" />
        <path d="M-20 380 C 140 360, 330 420, 660 330" />
        <path d="M180 -20 C 200 160, 150 330, 230 540" />
        <path d="M470 -20 C 430 140, 520 300, 450 540" />
      </g>
      <g fill="none" stroke="var(--line)" strokeWidth="5" strokeLinecap="round" opacity="0.8">
        <path d="M-20 260 L 660 250" />
        <path d="M330 -20 L 350 540" />
        <path d="M40 -20 L 90 540" />
        <path d="M580 -20 L 600 540" />
        <path d="M-20 470 L 660 450" />
        <path d="M-20 40 L 660 60" />
      </g>
      <path d="M380 90 h120 a24 24 0 0 1 24 24 v40 a24 24 0 0 1-24 24 h-120 z" fill="color-mix(in oklab, var(--accent), transparent 78%)" />
      <circle cx="140" cy="440" r="46" fill="color-mix(in oklab, var(--accent), transparent 84%)" />
      <g transform="translate(340 252)">
        <circle r="46" fill="color-mix(in oklab, var(--accent-strong), transparent 84%)" />
        <circle r="20" fill="var(--accent-strong)" />
        <circle r="7" fill="var(--bg)" />
      </g>
    </svg>
  );
}

export function Location() {
  const { open } = useBooking();
  const route = routesLink();
  const a = site.address;

  return (
    <section id="contato" aria-labelledby="loc-title" className="relative border-t border-line bg-surface py-24 sm:py-32 lg:py-36">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-5">
          <Reveal>
            <h2 id="loc-title" className="t-h1 text-ink">
              Venha nos visitar
            </h2>
          </Reveal>

          <dl className="mt-10 space-y-8">
            <div className="flex gap-4">
              <MapPin size={20} strokeWidth={1.75} className="mt-1 shrink-0 text-accent-strong" aria-hidden />
              <div>
                <dt className="t-label text-ink-2">Endereço</dt>
                <dd className="mt-1 text-ink">
                  {hasAddress() ? (
                    <>
                      {a.street}
                      <br />
                      {a.district} · {a.city}
                    </>
                  ) : (
                    <>
                      <span className="block">{a.placeholder}</span>
                      <span className="mt-1 block text-sm text-ink-2">Demonstração: configure o endereço em src/config/site.ts.</span>
                    </>
                  )}
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock size={20} strokeWidth={1.75} className="mt-1 shrink-0 text-accent-strong" aria-hidden />
              <div className="flex-1">
                <dt className="t-label text-ink-2">Horários</dt>
                <dd className="mt-2">
                  <table className="w-full max-w-[24rem] text-left">
                    <caption className="sr-only">Horários de atendimento</caption>
                    <tbody>
                      {site.hours.map((h) => (
                        <tr key={h.days} className="border-b border-line last:border-0">
                          <th scope="row" className="py-2 pr-4 font-normal text-ink">
                            {h.days}
                          </th>
                          <td className="py-2 text-right tabular-nums text-ink-2">{h.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-2 text-sm text-ink-2">{site.hoursNote}</p>
                </dd>
              </div>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button onClick={() => open()}>Entrar em contato</Button>
            {route ? (
              <Button href={route} variant="outline" external icon={<Navigation size={16} strokeWidth={1.75} />}>
                Como chegar
              </Button>
            ) : (
              <span className="inline-flex min-h-12 items-center gap-2 rounded-full border border-dashed border-line px-5 text-[0.9375rem] text-ink-2" aria-disabled="true">
                <Navigation size={16} strokeWidth={1.75} aria-hidden />
                Rotas disponíveis com endereço configurado
              </span>
            )}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-line lg:aspect-auto lg:h-full lg:min-h-[480px]">
            <DemoMap />
            <span className="absolute left-4 top-4 rounded-full bg-veil px-3 py-1.5 text-xs font-medium text-ink backdrop-blur-md">
              Mapa demonstrativo
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
