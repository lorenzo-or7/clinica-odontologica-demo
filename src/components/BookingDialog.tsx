import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CheckCircle2, Info, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { site } from '../config/site';
import { treatments } from '../data/treatments';
import { useBooking } from '../lib/useBooking';
import { whatsappLink } from '../lib/contact';
import { ease } from '../lib/motion';

const periods = ['Manhã', 'Tarde', 'Noite', 'Sábado'];

type Errors = Partial<Record<'name' | 'interest' | 'period', string>>;

/**
 * Agendamento demonstrativo.
 * Nada é armazenado nem enviado por este site. Com WhatsApp configurado, o botão
 * abre uma conversa com a mensagem pronta; sem número, mostra o estado demonstrativo.
 */
export function BookingDialog() {
  const { isOpen, close, preset } = useBooking();
  const ref = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();
  const uid = useId();
  const [name, setName] = useState('');
  const [interest, setInterest] = useState('');
  const [period, setPeriod] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'demo' | 'sent'>('idle');

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (isOpen && !d.open) {
      setStatus('idle');
      setErrors({});
      setInterest(preset.treatment ?? '');
      d.showModal();
      document.body.style.overflow = 'hidden';
    }
    if (!isOpen && d.open) {
      d.close();
    }
    if (!isOpen) document.body.style.overflow = '';
  }, [isOpen, preset]);

  const message = [
    site.contact.whatsappGreeting,
    name && `Meu nome é ${name.trim()}.`,
    interest && `Tenho interesse em: ${interest}.`,
    preset.specialist && `Profissional de preferência: ${preset.specialist}.`,
    period && `Período de preferência: ${period}.`,
    note.trim() && `Observação: ${note.trim()}`,
  ]
    .filter(Boolean)
    .join('\n');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (name.trim().length < 2) next.name = 'Informe como podemos chamar você.';
    if (!interest) next.interest = 'Escolha um assunto para a avaliação.';
    if (!period) next.period = 'Escolha um período de preferência.';
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      ref.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    const link = whatsappLink(message);
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
      setStatus('sent');
    } else {
      setStatus('demo');
    }
  };

  const field =
    'mt-2 w-full rounded-2xl border bg-bg px-4 py-3 text-base text-ink placeholder:text-ink-2/70 transition-[border-color,box-shadow] duration-200 focus:outline-none focus-visible:border-accent-strong focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent),transparent_70%)]';

  return (
    // Clique no fundo fecha; pelo teclado, Esc já fecha o <dialog> nativamente.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      aria-labelledby={`${uid}-title`}
      onClose={close}
      onClick={(e) => e.target === ref.current && close()}
      className="m-auto max-h-[100dvh] w-full max-w-none bg-transparent p-0 text-ink backdrop:bg-[rgb(19_27_25/0.55)] backdrop:backdrop-blur-sm sm:max-h-[92dvh] sm:max-w-[560px]"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: ease.out }}
            className="relative min-h-[100dvh] overflow-y-auto bg-surface px-5 pb-8 pt-6 shadow-[var(--shadow)] sm:min-h-0 sm:rounded-[28px] sm:px-8 sm:pb-8 sm:pt-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id={`${uid}-title`} className="t-h3">
                  Agendar avaliação
                </h2>
                <p className="mt-1.5 text-sm text-ink-2">Conte o essencial. A equipe retorna para confirmar data e horário.</p>
              </div>
              <button type="button" onClick={close} aria-label="Fechar agendamento" className="-mr-2 -mt-1 grid size-11 shrink-0 place-items-center rounded-full hover:bg-surface-2">
                <X size={20} strokeWidth={1.75} aria-hidden />
              </button>
            </div>

            {status === 'idle' ? (
              <form noValidate onSubmit={submit} className="mt-6 space-y-5">
                <div>
                  <label htmlFor={`${uid}-name`} className="text-sm font-medium">
                    Nome
                  </label>
                  <input
                    id={`${uid}-name`}
                    data-field="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                    className={`${field} ${errors.name ? 'border-danger' : 'border-line'}`}
                    placeholder="Como prefere ser chamado"
                  />
                  {errors.name && (
                    <p id={`${uid}-name-err`} className="mt-1.5 text-sm text-danger">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={`${uid}-interest`} className="text-sm font-medium">
                    Assunto
                  </label>
                  <select
                    id={`${uid}-interest`}
                    data-field="interest"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    aria-invalid={Boolean(errors.interest)}
                    aria-describedby={errors.interest ? `${uid}-interest-err` : undefined}
                    className={`${field} min-h-12 ${errors.interest ? 'border-danger' : 'border-line'}`}
                  >
                    <option value="">Selecione</option>
                    <option value="Avaliação geral">Avaliação geral</option>
                    {treatments.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                    {preset.treatment && !treatments.some((t) => t.name === preset.treatment) && preset.treatment !== 'Avaliação geral' && (
                      <option value={preset.treatment}>{preset.treatment}</option>
                    )}
                  </select>
                  {errors.interest && (
                    <p id={`${uid}-interest-err`} className="mt-1.5 text-sm text-danger">
                      {errors.interest}
                    </p>
                  )}
                </div>

                <fieldset aria-describedby={errors.period ? `${uid}-period-err` : undefined}>
                  <legend className="text-sm font-medium">Período de preferência</legend>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {periods.map((p, i) => (
                      <label
                        key={p}
                        className={`flex min-h-12 cursor-pointer items-center justify-center rounded-full border text-[0.9375rem] transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-strong ${
                          period === p ? 'border-accent-strong bg-accent-strong text-on-accent' : 'border-line hover:border-ink'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`${uid}-period`}
                          value={p}
                          checked={period === p}
                          onChange={() => setPeriod(p)}
                          data-field={i === 0 ? 'period' : undefined}
                          className="sr-only"
                        />
                        {p}
                      </label>
                    ))}
                  </div>
                  {errors.period && (
                    <p id={`${uid}-period-err`} className="mt-1.5 text-sm text-danger">
                      {errors.period}
                    </p>
                  )}
                </fieldset>

                <div>
                  <label htmlFor={`${uid}-note`} className="text-sm font-medium">
                    Observação <span className="font-normal text-ink-2">(opcional)</span>
                  </label>
                  <textarea
                    id={`${uid}-note`}
                    rows={3}
                    maxLength={280}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className={`${field} resize-none border-line`}
                    placeholder="Algo que a equipe deva saber antes do contato"
                  />
                  <p className="mt-1.5 text-xs text-ink-2">Não inclua dados de saúde ou documentos. Este formulário não armazena informações.</p>
                </div>

                <button
                  type="submit"
                  className="flex min-h-14 w-full items-center justify-center rounded-full bg-accent-strong px-6 text-base font-medium text-on-accent transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--accent-strong),var(--ink)_20%)]"
                >
                  {site.contact.whatsapp ? 'Continuar no WhatsApp' : 'Agendar minha avaliação'}
                </button>
              </form>
            ) : (
              <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mt-6" role="status">
                {status === 'sent' ? (
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-accent-strong" size={22} aria-hidden />
                    <div>
                      <p className="font-medium">Abrimos o WhatsApp com a sua mensagem.</p>
                      <p className="mt-1 text-sm text-ink-2">Revise o texto e envie por lá. Se a janela não abriu, verifique o bloqueador de pop-ups.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Info className="mt-0.5 shrink-0 text-accent-strong" size={22} aria-hidden />
                    <div>
                      <p className="font-medium">Demonstração concluída. Nada foi enviado.</p>
                      <p className="mt-1 text-sm text-ink-2">
                        Este é um protótipo sem número de contato configurado. Em um site publicado, a mensagem abaixo seguiria para o WhatsApp da clínica.
                      </p>
                    </div>
                  </div>
                )}
                <pre className="mt-5 whitespace-pre-wrap rounded-2xl bg-surface-2 p-4 font-sans text-sm text-ink">{message}</pre>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={close} className="min-h-12 rounded-full bg-accent-strong px-6 font-medium text-on-accent">
                    Fechar
                  </button>
                  <button type="button" onClick={() => setStatus('idle')} className="min-h-12 rounded-full border border-line px-6 font-medium">
                    Editar informações
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
