// Paletas de cores (tema claro e tema escuro), espaçamentos e tamanhos de fonte.
// As telas não usam cores fixas: recebem a paleta do tema atual pelo hook
// useTema() (src/context/TemaContext.js).

export const temaClaro = {
  primaria: '#4338CA', // fundo dos botões principais
  primariaClara: '#6366F1',
  primariaSuave: '#EEF2FF', // fundo de itens selecionados
  primariaDesabilitada: '#C7D2FE',
  destaque: '#4338CA', // links, ícones do cabeçalho e números em destaque
  sobrePrimaria: '#FFFFFF', // texto sobre a cor primária
  texto: '#111827',
  textoSecundario: '#6B7280',
  borda: '#E5E7EB',
  bordaForte: '#CBD5E1',
  fundo: '#F8FAFC',
  superficie: '#FFFFFF', // cartões, campos e itens de lista
  esqueleto: '#EEF0F4', // blocos exibidos durante o carregamento
  sucesso: '#059669',
  sucessoSuave: '#D1FAE5',
  sucessoTexto: '#065F46',
  erro: '#DC2626',
  erroSuave: '#FEE2E2',
  erroTexto: '#991B1B',
  ouro: '#B45309',
  ouroSuave: '#FEF3C7',
  topo: '#4338CA', // faixa superior da tela Início
};

export const temaEscuro = {
  primaria: '#4F46E5',
  primariaClara: '#818CF8',
  primariaSuave: '#1E1B4B',
  primariaDesabilitada: '#312E81',
  destaque: '#A5B4FC',
  sobrePrimaria: '#FFFFFF',
  texto: '#F1F5F9',
  textoSecundario: '#94A3B8',
  borda: '#334155',
  bordaForte: '#475569',
  fundo: '#0F172A',
  superficie: '#1E293B',
  esqueleto: '#273449',
  sucesso: '#34D399',
  sucessoSuave: '#064E3B',
  sucessoTexto: '#A7F3D0',
  erro: '#F87171',
  erroSuave: '#450A0A',
  erroTexto: '#FECACA',
  ouro: '#FBBF24',
  ouroSuave: '#422006',
  topo: '#312E81',
};

export const espaco = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const raio = {
  sm: 8,
  md: 12,
  lg: 14,
  pilula: 999,
};

export const fonte = {
  pequena: 12,
  normal: 14,
  media: 16,
  grande: 18,
  titulo: 28,
};

// Altura mínima das áreas de toque (RNF02: pelo menos 44 pontos).
export const ALTURA_TOQUE = 44;
