import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { site } from '../config/site';
import { useBooking } from '../lib/useBooking';
import { ease } from '../lib/motion';
import { useActiveSection } from '../lib/useActiveSection';
import type { Theme } from '../lib/useTheme';
import { Wordmark } from './ui/Wordmark';

const ids = site.nav.map((n) => n.id);

type Props = { theme: Theme; onToggleTheme: () => void };

export function Navbar({ theme, onToggleTheme }: Props) {
  const { scrollY } = useScroll();
  // Sobre a moldura escura da hero a cápsula é vidro escuro; depois dela, superfície sólida do tema.
  const [onHero, setOnHero] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(ids);
  const { open } = useBooking();
  const reduce = useReducedMotion();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const heroEnd = document.getElementById('top')?.offsetHeight ?? window.innerHeight;
    setOnHero(y < heroEnd - 72);
    // Recolhe ao descer rápido e volta ao subir; nunca esconde perto do topo.
    setHidden(!menuOpen && y > 640 && y > prev + 4);
    if (y < prev - 4) setHidden(false);
  });

  const ThemeIcon = theme === 'dark' ? Sun : Moon;
  const themeLabel = theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro';

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
        animate={{ y: hidden && !reduce ? '-120%' : '0%' }}
        transition={{ duration: 0.45, ease: ease.out }}
      >
        <nav
          aria-label="Principal"
          className={`mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-3 rounded-full border pl-5 pr-2 transition-[background-color,border-color,box-shadow] duration-500 ease-out-soft sm:pl-6 ${
            onHero
              ? 'scope-dark border-[rgb(245_243_236/0.14)] bg-[rgb(19_27_25/0.42)] text-ink backdrop-blur-xl'
              : 'border-line bg-[color-mix(in_oklab,var(--surface),transparent_8%)] text-ink shadow-[var(--shadow)] backdrop-blur-xl'
          }`}
        >
          <a href="#top" className="-ml-1 flex min-h-11 items-center rounded-full px-1" aria-label={`${site.name} ${site.descriptor}, início`}>
            <Wordmark />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {site.nav.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className="relative">
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'location' : undefined}
                    className={`relative z-10 flex min-h-11 items-center rounded-full px-4 text-[0.9375rem] font-medium transition-colors duration-200 ${
                      isActive ? 'text-ink' : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    {item.label}
                  </a>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-surface-2"
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={themeLabel}
              title={themeLabel}
              className="grid size-11 place-items-center rounded-full text-ink transition-colors duration-200 hover:bg-surface-2"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -60, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 60, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid place-items-center"
                >
                  <ThemeIcon size={18} strokeWidth={1.75} aria-hidden />
                </motion.span>
              </AnimatePresence>
            </button>
            <button
              type="button"
              onClick={() => open()}
              className="hidden min-h-12 items-center rounded-full bg-accent-strong px-5 text-[0.9375rem] font-medium text-on-accent transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--accent-strong),var(--ink)_20%)] sm:inline-flex"
            >
              Agendar avaliação
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid size-12 place-items-center rounded-full bg-surface-2 text-ink lg:hidden"
            >
              <Menu size={20} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        active={active}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onBook={() => {
          setMenuOpen(false);
          open();
        }}
      />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  active,
  theme,
  onToggleTheme,
  onBook,
}: {
  open: boolean;
  onClose: () => void;
  active: string | null;
  theme: Theme;
  onToggleTheme: () => void;
  onBook: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const first = panel.current?.querySelector<HTMLElement>('button, a');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panel.current) {
        const f = [...panel.current.querySelectorAll<HTMLElement>('a, button')];
        const firstEl = f[0];
        const lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      prevFocus?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-bg lg:hidden"
          initial={reduce ? { opacity: 0 } : { clipPath: 'circle(0% at calc(100% - 44px) 44px)' }}
          animate={reduce ? { opacity: 1 } : { clipPath: 'circle(150% at calc(100% - 44px) 44px)' }}
          exit={reduce ? { opacity: 0 } : { clipPath: 'circle(0% at calc(100% - 44px) 44px)' }}
          transition={{ duration: 0.7, ease: ease.inOut }}
        >
          <div className="flex h-[88px] items-center justify-between px-5 pt-3 sm:px-7">
            <Wordmark />
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar menu"
              className="grid size-12 place-items-center rounded-full bg-surface-2 text-ink"
            >
              <X size={20} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
          <nav aria-label="Menu móvel" className="flex flex-1 flex-col justify-center px-6 sm:px-10">
            <ul className="space-y-1">
              {site.nav.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: ease.out, delay: 0.25 + i * 0.06 }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={onClose}
                    aria-current={active === item.id ? 'location' : undefined}
                    className="flex min-h-14 items-baseline gap-4 py-1 font-display text-[clamp(2.4rem,9vw,3.5rem)] leading-none"
                  >
                    <span className={active === item.id ? 'text-ink' : 'text-ink-2'}>{item.label}</span>
                    {active === item.id && <span className="size-2 translate-y-[-0.4em] rounded-full bg-accent" aria-hidden />}
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-3 border-t border-line px-6 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-10">
            <button
              type="button"
              onClick={onBook}
              className="min-h-14 rounded-full bg-accent-strong px-6 text-base font-medium text-on-accent"
            >
              Agendar avaliação
            </button>
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-line text-ink"
            >
              {theme === 'dark' ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
              {theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
