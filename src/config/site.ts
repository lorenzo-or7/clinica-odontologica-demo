/**
 * Configuração central da marca demonstrativa.
 * Tudo o que muda de uma clínica para outra fica aqui ou em src/data/.
 * Valores `null` ativam o estado demonstrativo correspondente no site.
 */

const env = import.meta.env;
const digits = (v: string | undefined) => (v ? v.replace(/\D/g, '') : '') || null;

export const site = {
  name: 'Alva',
  descriptor: 'Odontologia',
  /** Frase curta usada no rodapé e no SEO. */
  tagline: 'Odontologia contemporânea, tecnologia e cuidado em cada detalhe.',
  /** Marca fictícia: o site sinaliza isso em pontos visíveis. */
  isDemo: true,
  demoNotice: 'Marca fictícia criada para demonstração. Nomes, imagens e dados são ilustrativos.',

  contact: {
    /** Somente dígitos com DDI e DDD, ex.: 5511999999999. Configure em .env.local. */
    whatsapp: digits(env.VITE_CLINIC_WHATSAPP),
    phone: digits(env.VITE_CLINIC_PHONE),
    email: null as string | null,
    /** Mensagem inicial do agendamento por WhatsApp. */
    whatsappGreeting: 'Olá! Gostaria de agendar uma avaliação.',
  },

  address: {
    /** Preencha para ativar o botão de rotas. Nada aqui representa um endereço real. */
    street: null as string | null,
    district: null as string | null,
    city: null as string | null,
    mapsQuery: null as string | null,
    placeholder: 'Endereço da clínica',
  },

  hours: [
    { days: 'Segunda a sexta', time: '8h às 19h' },
    { days: 'Sábado', time: '8h às 13h' },
    { days: 'Domingo e feriados', time: 'Fechado' },
  ],
  hoursNote: 'Horários de exemplo. Ajuste em src/config/site.ts.',

  social: [
    { label: 'Instagram', href: null as string | null },
    { label: 'LinkedIn', href: null as string | null },
  ],

  nav: [
    { id: 'tratamentos', label: 'Tratamentos' },
    { id: 'experiencia', label: 'Experiência' },
    { id: 'especialistas', label: 'Especialistas' },
    { id: 'contato', label: 'Contato' },
  ],

  credits: {
    studio: 'Or7.dev',
    href: null as string | null,
    project: 'Protótipo 05.01 · Clínica odontológica',
  },
} as const;

export type Site = typeof site;
