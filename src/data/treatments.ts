/**
 * Catálogo demonstrativo. As descrições são gerais e não prometem resultado:
 * indicação, duração e etapas dependem sempre da avaliação individual.
 */

export type Category = 'estetica' | 'reabilitacao' | 'saude';

export const categories: { id: Category | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'estetica', label: 'Estética' },
  { id: 'reabilitacao', label: 'Função e reabilitação' },
  { id: 'saude', label: 'Saúde e prevenção' },
];

export type Treatment = {
  id: string;
  name: string;
  category: Category;
  image: string;
  imageAlt: string;
  /** Uma linha, mostrada na lista. */
  summary: string;
  /** Parágrafo aberto ao expandir. */
  detail: string;
  /** O que costuma fazer parte do percurso. */
  steps: string[];
  /** Para quem costuma ser indicado (sempre após avaliação). */
  forWhom: string;
};

export const treatments: Treatment[] = [
  {
    id: 'estetica',
    name: 'Odontologia estética',
    category: 'estetica',
    image: 't-estetica',
    imageAlt: 'Detalhe de um sorriso em fundo claro',
    summary: 'Ajustes de forma, cor e proporção pensados para o rosto de cada pessoa.',
    detail:
      'Reúne procedimentos como restaurações em resina, recontorno e harmonização das proporções dos dentes. O planejamento parte de fotografias e da análise do sorriso em movimento, para que as mudanças conversem com as feições de quem sorri.',
    steps: ['Análise facial e do sorriso', 'Simulação para discutir possibilidades', 'Execução em etapas combinadas'],
    forWhom: 'Quem deseja mudanças pontuais de forma, cor ou alinhamento visual.',
  },
  {
    id: 'clareamento',
    name: 'Clareamento dental',
    category: 'estetica',
    image: 't-clareamento',
    imageAlt: 'Mulher sorrindo em luz natural',
    summary: 'Protocolos supervisionados, no consultório ou em casa.',
    detail:
      'Antes de clarear, avaliamos a saúde da gengiva, restaurações existentes e sensibilidade. O protocolo é escolhido em conjunto e acompanhado de perto, porque a resposta ao clareamento varia de pessoa para pessoa.',
    steps: ['Avaliação de sensibilidade e restaurações', 'Escolha do protocolo', 'Acompanhamento durante o uso'],
    forWhom: 'Quem tem dentes saudáveis e quer uma tonalidade mais clara.',
  },
  {
    id: 'lentes',
    name: 'Lentes de contato dental',
    category: 'estetica',
    image: 't-lentes',
    imageAlt: 'Reflexo de um sorriso em espelho redondo',
    summary: 'Laminados finos de cerâmica, desenhados dente a dente.',
    detail:
      'As lentes são lâminas cerâmicas cimentadas sobre a face visível do dente. Por envolverem decisões duradouras, a indicação é feita com cautela, depois de um ensaio que permite ver e discutir a proposta antes de qualquer etapa definitiva.',
    steps: ['Planejamento digital do sorriso', 'Ensaio em boca (mock-up)', 'Confecção e adaptação das peças'],
    forWhom: 'Casos selecionados, após avaliação das estruturas dentárias e da mordida.',
  },
  {
    id: 'ortodontia',
    name: 'Ortodontia',
    category: 'reabilitacao',
    image: 't-ortodontia',
    imageAlt: 'Alinhador ortodôntico transparente sobre superfície branca',
    summary: 'Alinhadores transparentes ou aparelhos fixos, conforme o caso.',
    detail:
      'O alinhamento dos dentes influencia mastigação, higiene e conforto. Indicamos o tipo de aparelho a partir do escaneamento e dos exames, explicando o que cada opção exige de rotina e de acompanhamento.',
    steps: ['Escaneamento intraoral e exames', 'Plano de movimentação', 'Consultas periódicas de ajuste'],
    forWhom: 'Crianças, adolescentes e adultos, com indicação definida na avaliação.',
  },
  {
    id: 'implante',
    name: 'Implantodontia',
    category: 'reabilitacao',
    image: 't-implante',
    imageAlt: 'Modelo de implante dentário com coroa segurado por mão com luva',
    summary: 'Reposição de dentes com planejamento guiado por tomografia.',
    detail:
      'O implante substitui a raiz de um dente perdido e recebe uma coroa sobre ele. A tomografia permite estudar o osso disponível e planejar a posição com antecedência. Prazos e etapas variam conforme cada situação clínica.',
    steps: ['Tomografia e planejamento virtual', 'Instalação do implante', 'Coroa definitiva após o período indicado'],
    forWhom: 'Quem perdeu um ou mais dentes e passou por avaliação de saúde e de osso.',
  },
  {
    id: 'prevencao',
    name: 'Prevenção e saúde bucal',
    category: 'saude',
    image: 't-prevencao',
    imageAlt: 'Espelho clínico e sonda sobre superfície branca',
    summary: 'Consultas regulares, limpeza profissional e orientação de cuidado.',
    detail:
      'A base de qualquer tratamento é uma boca saudável. As consultas preventivas incluem exame clínico, limpeza profissional e orientação de higiene adaptada à rotina de cada pessoa.',
    steps: ['Exame clínico completo', 'Limpeza e polimento profissional', 'Orientação e intervalo de retorno'],
    forWhom: 'Todas as idades, como rotina de acompanhamento.',
  },
];
