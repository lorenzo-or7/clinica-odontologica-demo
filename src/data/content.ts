/**
 * Conteúdo editorial demonstrativo. Substitua livremente por textos da clínica.
 * Pessoas, depoimentos e ambientes são fictícios ou ilustrativos.
 */

export const hero = {
  lines: ['A beleza de sorrir', 'naturalmente.'],
  /** Índice da linha com destaque tipográfico (itálico). */
  accentLine: 1,
  text: 'Odontologia contemporânea, tecnologia e cuidado em cada detalhe.',
  primary: { label: 'Conheça nossa experiência', href: '#manifesto' },
  secondary: { label: 'Explorar tratamentos', href: '#tratamentos' },
  image: 'hero-smile',
  imageAlt: 'Mulher sorrindo ao ar livre, com cabelos soltos e olhos fechados',
};

export const manifesto = {
  statement: 'Mais que transformar sorrisos. Criar experiências de cuidado.',
  intro:
    'Cada sorriso tem uma história, uma rotina e expectativas próprias. Por isso a primeira coisa que fazemos é ouvir.',
  passages: [
    {
      title: 'Escuta antes da técnica',
      text: 'A consulta começa pela conversa: o que incomoda, o que você espera e o que cabe na sua rotina.',
    },
    {
      title: 'Planejamento que se explica',
      text: 'Mostramos exames, imagens e alternativas em linguagem clara, para que cada decisão seja tomada junto com você.',
    },
    {
      title: 'Tempo para cada pessoa',
      text: 'Agendas sem pressa e acompanhamento depois do tratamento fazem parte do cuidado, não são extras.',
    },
  ],
  images: {
    main: { src: 'manifesto-stair', alt: 'Escada de pedra clara iluminada por luz lateral' },
    detail: { src: 'manifesto-light', alt: 'Faixa de luz vertical em um interior branco' },
  },
};

export const sculpture = {
  title: ['Precisão que você sente.', 'Tecnologia que transforma.'],
  intro:
    'Um dente é uma pequena arquitetura: esmalte, curvas e raízes que trabalham em conjunto. Entender essa forma é o ponto de partida de qualquer tratamento.',
  steps: [
    {
      id: 'forma',
      label: 'Forma',
      heading: 'Anatomia e harmonia',
      text: 'Cúspides, sulcos e o contorno da coroa definem como o dente toca, mastiga e reflete a luz. Respeitar essa anatomia é o que faz um tratamento parecer natural.',
      notes: ['Cúspides', 'Sulco central', 'Colo do dente', 'Raízes'],
    },
    {
      id: 'precisao',
      label: 'Precisão',
      heading: 'Planejamento e tecnologia',
      text: 'Escaneamento intraoral, fotografias e tomografia viram um modelo digital. É nele que estudamos alternativas e testamos cada etapa antes de chegar à cadeira.',
      notes: ['Escaneamento digital', 'Modelo tridimensional', 'Simulação do plano'],
    },
    {
      id: 'resultado',
      label: 'Resultado',
      heading: 'Estética e naturalidade',
      text: 'Cor, textura e brilho são ajustados para conversar com os dentes vizinhos e com o seu rosto. O objetivo é um sorriso que pareça seu.',
      notes: ['Cor e translucidez', 'Textura de superfície', 'Integração ao sorriso'],
    },
  ],
};

export const visit = {
  title: 'Uma visita antes da visita',
  text: 'Percorra os ambientes de uma clínica pensada para receber com calma.',
  note: 'Fotografias ilustrativas de bancos de imagem. Não retratam uma clínica real.',
  rooms: [
    {
      id: 'recepcao',
      name: 'Recepção',
      caption: 'Luz natural, poltronas confortáveis e uma chegada sem filas.',
      image: 'v-recepcao',
      alt: 'Área de espera com mesa, cadeiras e grandes janelas de vidro',
    },
    {
      id: 'consultorios',
      name: 'Consultórios',
      caption: 'Salas claras e silenciosas, com janela e equipamento ergonômico.',
      image: 'v-consultorio',
      alt: 'Cadeira odontológica branca ao lado de uma janela',
    },
    {
      id: 'tecnologia',
      name: 'Tecnologia',
      caption: 'Exames digitais que podem ser revistos com você na própria tela.',
      image: 'v-tecnologia',
      alt: 'Mão com luva apontando para uma tomografia odontológica em um tablet',
    },
    {
      id: 'atendimento',
      name: 'Espaços de atendimento',
      caption: 'Conversas sem pressa, olho no olho, antes de qualquer procedimento.',
      image: 'v-atendimento',
      alt: 'Dentista conversando com uma paciente sentada na cadeira do consultório',
    },
  ],
};

export type Specialist = {
  id: string;
  name: string;
  area: string;
  bio: string;
  image: string;
  alt: string;
  focus: string;
};

export const specialists: Specialist[] = [
  {
    id: 'helena',
    name: 'Dra. Helena Duarte',
    area: 'Odontologia estética',
    bio: 'Conduz os planejamentos de sorriso e as reabilitações estéticas, sempre a partir de fotografias e ensaios.',
    image: 'pro-1',
    alt: 'Retrato ilustrativo de uma profissional de jaleco branco',
    focus: 'estetica',
  },
  {
    id: 'rafael',
    name: 'Dr. Rafael Moura',
    area: 'Implantodontia',
    bio: 'Responsável pelos casos de reabilitação com implantes e pelo planejamento guiado por tomografia.',
    image: 'pro-2',
    alt: 'Retrato ilustrativo de um profissional sorrindo',
    focus: 'implante',
  },
  {
    id: 'lia',
    name: 'Dra. Lia Takeda',
    area: 'Ortodontia',
    bio: 'Acompanha tratamentos ortodônticos de crianças a adultos, com alinhadores ou aparelhos fixos.',
    image: 'pro-3',
    alt: 'Retrato ilustrativo de uma profissional de jaleco ao ar livre',
    focus: 'ortodontia',
  },
];

export const journey = [
  {
    id: 'contato',
    title: 'Primeiro contato',
    text: 'Você conta o que procura pelo canal que preferir. Nossa equipe explica como funciona a avaliação, tira dúvidas iniciais e sugere horários.',
    detail: ['Atendimento por WhatsApp ou telefone', 'Orientação sobre documentos e exames anteriores', 'Escolha do melhor horário'],
    image: 'j-contato',
    alt: 'Corredor claro com quadros e iluminação suave',
  },
  {
    id: 'avaliacao',
    title: 'Avaliação individualizada',
    text: 'Uma consulta dedicada a conhecer sua saúde bucal e suas expectativas. Exame clínico, fotografias e, quando necessário, exames de imagem.',
    detail: ['Conversa sobre histórico e objetivos', 'Exame clínico completo', 'Solicitação de exames quando indicados'],
    image: 'j-avaliacao',
    alt: 'Profissional analisando radiografias em um negatoscópio',
  },
  {
    id: 'planejamento',
    title: 'Planejamento',
    text: 'Apresentamos as alternativas possíveis, com etapas, prazos estimados e cuidados envolvidos. Você decide com informação, sem pressa.',
    detail: ['Plano explicado com imagens', 'Alternativas e etapas por escrito', 'Espaço para dúvidas antes de começar'],
    image: 'j-planejamento',
    alt: 'Modelo odontológico mostrando dentes, raízes e um implante',
  },
  {
    id: 'acompanhamento',
    title: 'Acompanhamento',
    text: 'Depois do tratamento, seguimos juntos: retornos programados, ajustes quando necessários e orientação para manter os cuidados em casa.',
    detail: ['Retornos com intervalo definido', 'Canal aberto para dúvidas', 'Orientação de manutenção'],
    image: 'v-atendimento',
    alt: 'Dentista conversando com uma paciente no consultório',
  },
];

/**
 * Depoimentos de EXEMPLO para composição visual.
 * Substitua por relatos reais, autorizados por escrito, antes de publicar.
 */
export const testimonials = [
  {
    id: 'ex-1',
    quote: 'Espaço reservado para um relato sobre a primeira consulta: como foi ser recebido, ouvido e orientado.',
    author: 'Nome do paciente',
    context: 'Exemplo · avaliação inicial',
  },
  {
    id: 'ex-2',
    quote: 'Espaço reservado para um relato sobre o planejamento: a clareza das explicações e a liberdade para decidir.',
    author: 'Nome do paciente',
    context: 'Exemplo · planejamento estético',
  },
  {
    id: 'ex-3',
    quote: 'Espaço reservado para um relato sobre o acompanhamento depois do tratamento.',
    author: 'Nome do paciente',
    context: 'Exemplo · acompanhamento',
  },
];

export const faq = [
  {
    id: 'primeira-consulta',
    q: 'Como funciona a primeira consulta?',
    a: 'A primeira consulta é uma avaliação. Conversamos sobre seu histórico e o que você procura, fazemos o exame clínico e, se preciso, solicitamos exames complementares. Ao final, explicamos os próximos passos possíveis.',
  },
  {
    id: 'escolher-tratamento',
    q: 'Como escolher o tratamento adequado?',
    a: 'A escolha depende da sua saúde bucal, das suas expectativas e da sua rotina. Por isso nenhum tratamento é indicado antes da avaliação. Apresentamos as alternativas com vantagens, limitações e cuidados de cada uma.',
  },
  {
    id: 'agendar',
    q: 'É possível agendar uma avaliação?',
    a: 'Sim. Use o botão de agendamento para enviar seu interesse e o período de preferência. A equipe retorna para confirmar data e horário.',
  },
  {
    id: 'personalizados',
    q: 'Os tratamentos são personalizados?',
    a: 'Sim. O plano é construído a partir da sua avaliação e revisto com você antes de começar. Etapas, materiais e prazos variam de pessoa para pessoa.',
  },
  {
    id: 'acompanhamento',
    q: 'Como funciona o acompanhamento?',
    a: 'Depois do tratamento, combinamos retornos periódicos para revisar o resultado e a saúde bucal. Entre as consultas, você pode falar com a equipe sempre que tiver dúvidas.',
  },
];
