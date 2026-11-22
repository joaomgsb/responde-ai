import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import {
  carregarJogador,
  carregarRanking,
  LIMITE_RANKING,
  salvarJogador,
  salvarRanking,
} from '../services/storage';
import { gerarId, pontosDaPergunta } from '../utils/jogo';

// Estado compartilhado do aplicativo (Context API + useReducer).
// Guarda o jogador, a configuração da partida, a partida em andamento,
// o ranking e o resultado da última partida. As telas leem e alteram esse
// estado pelo hook useQuiz().

const QuizContext = createContext(null);

const estadoInicial = {
  carregado: false, // vira true depois de ler o AsyncStorage
  jogador: '',
  config: { categoria: null, dificuldade: 'any', quantidade: 10, traduzir: true },
  partida: null,
  ranking: [],
  ultimoResultado: null,
};

// Ordena por pontos (maior primeiro) e, no empate, pela partida mais recente.
function ordenarRanking(lista) {
  return [...lista]
    .sort((a, b) => b.pontos - a.pontos || new Date(b.data) - new Date(a.data))
    .slice(0, LIMITE_RANKING);
}

function reducer(estado, acao) {
  switch (acao.type) {
    case 'HIDRATAR':
      return {
        ...estado,
        carregado: true,
        jogador: acao.jogador,
        ranking: ordenarRanking(acao.ranking),
      };

    case 'DEFINIR_JOGADOR':
      return { ...estado, jogador: acao.nome };

    case 'DEFINIR_CONFIG':
      return { ...estado, config: { ...estado.config, ...acao.config } };

    case 'INICIAR_PARTIDA':
      return {
        ...estado,
        partida: {
          perguntas: acao.perguntas,
          indice: 0,
          acertos: 0,
          pontos: 0,
          respostaAtual: null, // alternativa escolhida na pergunta atual
        },
      };

    case 'RESPONDER': {
      const { partida } = estado;
      // RF06: não aceita uma segunda resposta para a mesma pergunta.
      if (!partida || partida.respostaAtual !== null) return estado;
      const pergunta = partida.perguntas[partida.indice];
      const acertou = acao.alternativa === pergunta.correta;
      return {
        ...estado,
        partida: {
          ...partida,
          respostaAtual: acao.alternativa,
          acertos: partida.acertos + (acertou ? 1 : 0),
          pontos: partida.pontos + (acertou ? pontosDaPergunta(pergunta.dificuldade) : 0),
        },
      };
    }

    case 'PROXIMA_PERGUNTA': {
      const { partida } = estado;
      if (!partida || partida.indice >= partida.perguntas.length - 1) return estado;
      return {
        ...estado,
        partida: { ...partida, indice: partida.indice + 1, respostaAtual: null },
      };
    }

    case 'FINALIZAR_PARTIDA': {
      // RF09: registra a partida concluída no ranking local.
      const { partida, config, jogador } = estado;
      if (!partida) return estado;
      const registro = {
        id: gerarId(),
        jogador: jogador.trim(),
        pontos: partida.pontos,
        acertos: partida.acertos,
        total: partida.perguntas.length,
        categoriaId: config.categoria ? config.categoria.id : null,
        categoriaNome: config.categoria ? config.categoria.nome : 'Variadas',
        dificuldade: config.dificuldade,
        data: new Date().toISOString(),
      };
      return {
        ...estado,
        partida: null,
        ultimoResultado: registro,
        ranking: ordenarRanking([...estado.ranking, registro]),
      };
    }

    case 'ABANDONAR_PARTIDA':
      // RF13: sai sem registrar no ranking.
      return { ...estado, partida: null };

    case 'LIMPAR_RANKING':
      return { ...estado, ranking: [], ultimoResultado: null };

    default:
      return estado;
  }
}

export function QuizProvider({ children }) {
  const [estado, dispatch] = useReducer(reducer, estadoInicial);

  // Ao abrir o app, carrega o nome do jogador e o ranking salvos no aparelho.
  useEffect(() => {
    let ativo = true;
    Promise.all([carregarJogador(), carregarRanking()]).then(([jogador, ranking]) => {
      if (ativo) dispatch({ type: 'HIDRATAR', jogador, ranking });
    });
    return () => {
      ativo = false;
    };
  }, []);

  // Sempre que o nome ou o ranking mudam, grava no AsyncStorage.
  // A condição "carregado" evita sobrescrever os dados antes de lê-los.
  useEffect(() => {
    if (estado.carregado) salvarJogador(estado.jogador);
  }, [estado.carregado, estado.jogador]);

  useEffect(() => {
    if (estado.carregado) salvarRanking(estado.ranking);
  }, [estado.carregado, estado.ranking]);

  // Ações expostas às telas.
  const definirJogador = useCallback((nome) => dispatch({ type: 'DEFINIR_JOGADOR', nome }), []);
  const definirConfig = useCallback((config) => dispatch({ type: 'DEFINIR_CONFIG', config }), []);
  const iniciarPartida = useCallback(
    (perguntas) => dispatch({ type: 'INICIAR_PARTIDA', perguntas }),
    []
  );
  const responder = useCallback((alternativa) => dispatch({ type: 'RESPONDER', alternativa }), []);
  const proximaPergunta = useCallback(() => dispatch({ type: 'PROXIMA_PERGUNTA' }), []);
  const finalizarPartida = useCallback(() => dispatch({ type: 'FINALIZAR_PARTIDA' }), []);
  const abandonarPartida = useCallback(() => dispatch({ type: 'ABANDONAR_PARTIDA' }), []);
  const limparRanking = useCallback(() => dispatch({ type: 'LIMPAR_RANKING' }), []);

  const valor = useMemo(
    () => ({
      ...estado,
      definirJogador,
      definirConfig,
      iniciarPartida,
      responder,
      proximaPergunta,
      finalizarPartida,
      abandonarPartida,
      limparRanking,
    }),
    [
      estado,
      definirJogador,
      definirConfig,
      iniciarPartida,
      responder,
      proximaPergunta,
      finalizarPartida,
      abandonarPartida,
      limparRanking,
    ]
  );

  return <QuizContext.Provider value={valor}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const contexto = useContext(QuizContext);
  if (!contexto) {
    throw new Error('useQuiz precisa ser usado dentro de <QuizProvider>.');
  }
  return contexto;
}
