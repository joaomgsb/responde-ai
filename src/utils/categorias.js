// A Open Trivia DB devolve os nomes das categorias em inglês.
// Este mapa traduz cada categoria (pelo id da API) e define a sigla e a cor
// do ícone exibido na lista. Categorias novas que não estejam aqui usam o
// nome original da API e uma cor padrão.

const MAPA_CATEGORIAS = {
  9: { nome: 'Conhecimentos gerais', sigla: 'CG', cor: '#6366F1' },
  10: { nome: 'Livros', sigla: 'LI', cor: '#A855F7' },
  11: { nome: 'Cinema', sigla: 'CI', cor: '#EC4899' },
  12: { nome: 'Música', sigla: 'MU', cor: '#F43F5E' },
  13: { nome: 'Musicais e teatro', sigla: 'MT', cor: '#D946EF' },
  14: { nome: 'Televisão', sigla: 'TV', cor: '#8B5CF6' },
  15: { nome: 'Videogames', sigla: 'VG', cor: '#7C3AED' },
  16: { nome: 'Jogos de tabuleiro', sigla: 'JT', cor: '#9333EA' },
  17: { nome: 'Ciência e natureza', sigla: 'CN', cor: '#10B981' },
  18: { nome: 'Computação', sigla: 'TI', cor: '#0EA5E9' },
  19: { nome: 'Matemática', sigla: 'MA', cor: '#0284C7' },
  20: { nome: 'Mitologia', sigla: 'MI', cor: '#CA8A04' },
  21: { nome: 'Esportes', sigla: 'ES', cor: '#16A34A' },
  22: { nome: 'Geografia', sigla: 'GE', cor: '#F59E0B' },
  23: { nome: 'História', sigla: 'HI', cor: '#EF4444' },
  24: { nome: 'Política', sigla: 'PO', cor: '#64748B' },
  25: { nome: 'Arte', sigla: 'AR', cor: '#DB2777' },
  26: { nome: 'Celebridades', sigla: 'CE', cor: '#E11D48' },
  27: { nome: 'Animais', sigla: 'AN', cor: '#65A30D' },
  28: { nome: 'Veículos', sigla: 'VE', cor: '#475569' },
  29: { nome: 'Quadrinhos', sigla: 'QD', cor: '#C026D3' },
  30: { nome: 'Gadgets', sigla: 'GA', cor: '#0891B2' },
  31: { nome: 'Anime e mangá', sigla: 'AM', cor: '#BE185D' },
  32: { nome: 'Desenhos animados', sigla: 'DA', cor: '#EA580C' },
};

const COR_PADRAO = '#6366F1';

// Recebe uma categoria no formato da API ({ id, name }) e devolve o formato
// usado no aplicativo: { id, nome, nomeOriginal, sigla, cor }.
export function traduzirCategoria(categoriaApi) {
  const conhecida = MAPA_CATEGORIAS[categoriaApi.id];
  return {
    id: categoriaApi.id,
    nomeOriginal: categoriaApi.name,
    nome: conhecida ? conhecida.nome : categoriaApi.name,
    sigla: conhecida ? conhecida.sigla : categoriaApi.name.slice(0, 2).toUpperCase(),
    cor: conhecida ? conhecida.cor : COR_PADRAO,
  };
}

// Nome em português a partir do id (usado no ranking e no resultado).
export function nomeDaCategoria(id) {
  return MAPA_CATEGORIAS[id] ? MAPA_CATEGORIAS[id].nome : 'Categoria';
}
