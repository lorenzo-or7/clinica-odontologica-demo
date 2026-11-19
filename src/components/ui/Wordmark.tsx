import { site } from '../../config/site';

/** Marca demonstrativa: arco duplo + nome. Substitua pelo SVG oficial da clínica. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 28 32" aria-hidden className="h-7 w-auto shrink-0">
        <path d="M3 31V14a11 11 0 0 1 22 0v17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 31V15.5a4 4 0 0 1 8 0V31" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.6rem] tracking-[-0.01em]">{site.name}</span>
        <span className="mt-0.5 text-[0.6875rem] font-medium tracking-[0.04em] text-ink-2">{site.descriptor}</span>
      </span>
    </span>
  );
}
