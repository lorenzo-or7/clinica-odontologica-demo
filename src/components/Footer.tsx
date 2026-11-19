import { ArrowUp } from 'lucide-react';
import { site } from '../config/site';
import { Wordmark } from './ui/Wordmark';

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="scope-dark bg-bg text-ink">
      <div className="shell pb-[max(2rem,env(safe-area-inset-bottom))] pt-16 sm:pt-20">
        <div className="grid gap-12 border-b border-line pb-12 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-5">
            <Wordmark />
            <p className="mt-5 max-w-[22rem] text-ink-2">{site.tagline}</p>
          </div>

          <nav aria-label="Rodapé" className="md:col-span-3 md:col-start-7">
            <p className="t-label text-ink-2">Navegação</p>
            <ul className="mt-4 space-y-1">
              {[...site.nav, { id: 'jornada', label: 'Jornada do paciente' }, { id: 'duvidas', label: 'Dúvidas frequentes' }].map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="inline-flex min-h-11 items-center text-ink transition-colors hover:text-accent">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="t-label text-ink-2">Sobre este site</p>
            <p className="mt-4 text-sm text-ink-2">{site.demoNotice}</p>
            <p className="mt-3 text-sm text-ink-2">Fotografias: Unsplash (Unsplash License). Fontes: Boska e Satoshi, Fontshare.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-sm text-ink-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {site.credits.project} · Desenvolvido por{' '}
            {site.credits.href ? (
              <a href={site.credits.href} target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-4">
                {site.credits.studio}
              </a>
            ) : (
              <span className="text-ink">{site.credits.studio}</span>
            )}{' '}
            · {year}
          </p>
          <a href="#top" className="inline-flex min-h-11 items-center gap-2 self-start text-ink hover:text-accent sm:self-auto">
            Voltar ao topo
            <ArrowUp size={16} strokeWidth={1.75} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
