// Funções puras com as regras do jogo: texto, embaralhamento, pontuação e datas.

// Dificuldades aceitas pela API e o rótulo exibido em português.
export const DIFICULDADES = [
  { valor: 'any', rotulo: 'Qualquer' },
  { valor: 'easy', rotulo: 'Fácil' },
  { valor: 'medium', rotulo: 'Média' },
  { valor: 'hard', rotulo: 'Difícil' },
];

export function rotuloDificuldade(valor) {
  const encontrada = DIFICULDADES.find((d) => d.valor === valor);
  return encontrada ? encontrada.rotulo : 'Qualquer';
}

// RF07: pontos por acerto conforme a dificuldade da pergunta.
export const PONTOS_POR_DIFICULDADE = { easy: 10, medium: 20, hard: 30 };

export function pontosDaPergunta(dificuldade) {
  return PONTOS_POR_DIFICULDADE[dificuldade] || 10;
}

// As perguntas são pedidas com encode=url3986 e decodificadas aqui.
// Se algum texto vier malformado, devolvemos o original em vez de quebrar o app.
export function decodificar(texto) {
  try {
    return decodeURIComponent(texto);
  } catch {
    return texto;
  }
}

// Embaralhamento de Fisher-Yates: devolve uma cópia sem alterar o array original.
export function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Formata a data do registro do ranking: "hoje" ou "dd/mm".
export function formatarData(dataIso) {
  const data = new Date(dataIso);
  const agora = new Date();
  const mesmoDia =
    data.getDate() === agora.getDate() &&
    data.getMonth() === agora.getMonth() &&
    data.getFullYear() === agora.getFullYear();
  if (mesmoDia) return 'hoje';
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}`;
}

// Gera um identificador simples e único o bastante para os registros locais.
export function gerarId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
