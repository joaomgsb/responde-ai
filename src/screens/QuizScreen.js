import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OptionButton from '../components/OptionButton';
import PrimaryButton from '../components/PrimaryButton';
import { useQuiz } from '../context/QuizContext';
import { cores, espaco, fonte, raio } from '../theme';
import { confirmar } from '../utils/confirmar';
import { pontosDaPergunta, rotuloDificuldade } from '../utils/jogo';

const LETRAS = ['A', 'B', 'C', 'D'];

// Tela Pergunta: uma pergunta por vez (RF05), feedback imediato (RF06),
// pontuação (RF07) e saída com confirmação (RF13).
export default function QuizScreen({ navigation }) {
  const { partida, config, responder, proximaPergunta, finalizarPartida, abandonarPartida } = useQuiz();
  const insets = useSafeAreaInsets();
  // Quando true, a tela pode ser removida sem pedir confirmação.
  const liberarSaida = useRef(false);
  // Alterna entre a tradução em português e o texto original em inglês.
  const [verOriginal, setVerOriginal] = useState(false);

  // Cabeçalho: nome da categoria, botão de fechar e pontuação parcial.
  useLayoutEffect(() => {
    navigation.setOptions({
      title: config.categoria ? config.categoria.nome : 'Partida',
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Sair da partida"
          hitSlop={12}
          style={styles.fechar}
        >
          <Text style={styles.fecharTexto}>✕</Text>
        </Pressable>
      ),
      headerRight: () => <Text style={styles.pontosCabecalho}>{partida ? partida.pontos : 0} pts</Text>,
    });
  }, [navigation, config.categoria, partida]);

  // Qualquer tentativa de sair (botão ✕, botão voltar do Android, gesto)
  // passa por aqui e pede confirmação antes de descartar a partida.
  useEffect(() => {
    const remover = navigation.addListener('beforeRemove', (evento) => {
      if (liberarSaida.current) return;
      evento.preventDefault();
      confirmar(
        'Sair da partida?',
        'Seu progresso nesta partida será perdido e ela não entrará no ranking.',
        'Sair'
      ).then((confirmou) => {
        if (!confirmou) return;
        liberarSaida.current = true;
        navigation.dispatch(evento.data.action);
        abandonarPartida();
      });
    });
    return remover;
  }, [navigation, abandonarPartida]);

  if (!partida) return <View style={styles.tela} />;

  const pergunta = partida.perguntas[partida.indice];
  const total = partida.perguntas.length;
  const respondida = partida.respostaAtual !== null;
  const acertou = respondida && partida.respostaAtual === pergunta.correta;
  const ultima = partida.indice === total - 1;
  const letraCorreta = LETRAS[pergunta.alternativas.indexOf(pergunta.correta)];
  const traduzida = Boolean(pergunta.traducao) && !verOriginal;
  const textoEnunciado = traduzida ? pergunta.traducao.enunciado : pergunta.enunciado;
  const textoAlternativa = (alt) => (traduzida ? pergunta.traducao.alternativas[alt] : alt);

  function estadoDaAlternativa(alternativa) {
    if (!respondida) return 'normal';
    if (alternativa === pergunta.correta) return 'correta';
    if (alternativa === partida.respostaAtual) return 'errada';
    return 'apagada';
  }

  function avancar() {
    if (ultima) {
      // A partida terminou: registra no ranking e troca esta tela pelo
      // Resultado (replace), para que "voltar" não reabra a partida.
      liberarSaida.current = true;
      finalizarPartida();
      navigation.replace('Result');
    } else {
      proximaPergunta();
    }
  }

  return (
    <View style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.linhaTopo}>
          <Text style={styles.progressoTexto}>
            Pergunta {partida.indice + 1} de {total}
          </Text>
          <Text style={styles.etiqueta}>{rotuloDificuldade(pergunta.dificuldade)}</Text>
        </View>
        <View style={styles.barra}>
          <View style={[styles.barraPreenchida, { width: `${((partida.indice + 1) / total) * 100}%` }]} />
        </View>

        <Text style={styles.enunciado}>{textoEnunciado}</Text>
        {pergunta.traducao ? (
          <Text
            style={styles.alternarIdioma}
            onPress={() => setVerOriginal((v) => !v)}
            accessibilityRole="button"
          >
            {verOriginal ? 'Ver em português' : 'Ver original em inglês'}
          </Text>
        ) : null}

        <View style={styles.alternativas}>
          {pergunta.alternativas.map((alternativa, i) => (
            <OptionButton
              key={alternativa}
              letra={LETRAS[i]}
              texto={textoAlternativa(alternativa)}
              estado={estadoDaAlternativa(alternativa)}
              desabilitado={respondida}
              onPress={() => responder(alternativa)}
            />
          ))}
        </View>

        {respondida ? (
          <Text
            style={[styles.feedback, acertou ? styles.feedbackCerto : styles.feedbackErrado]}
            accessibilityLiveRegion="polite"
          >
            {acertou
              ? `Resposta certa! +${pontosDaPergunta(pergunta.dificuldade)} pontos.`
              : `Resposta errada. A correta é a alternativa ${letraCorreta}.`}
          </Text>
        ) : null}
      </ScrollView>

      {respondida ? (
        <View style={[styles.rodape, { paddingBottom: insets.bottom + espaco.md }]}>
          <PrimaryButton titulo={ultima ? 'Ver resultado' : 'Próxima pergunta'} onPress={avancar} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.lg, gap: espaco.md },
  fechar: { paddingHorizontal: espaco.sm, minWidth: 44, minHeight: 44, justifyContent: 'center' },
  fecharTexto: { fontSize: 20, color: cores.primaria, fontWeight: '700' },
  pontosCabecalho: { fontWeight: '800', color: cores.primaria, fontSize: fonte.media, paddingHorizontal: espaco.sm },
  linhaTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressoTexto: { fontSize: 13, color: cores.textoSecundario, fontWeight: '600' },
  etiqueta: {
    fontSize: 11,
    fontWeight: '700',
    color: cores.ouro,
    backgroundColor: cores.ouroSuave,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  barra: { height: 8, backgroundColor: cores.borda, borderRadius: raio.pilula, overflow: 'hidden' },
  barraPreenchida: { height: '100%', backgroundColor: cores.primaria },
  enunciado: { fontSize: fonte.grande, fontWeight: '700', lineHeight: 25, color: cores.texto, marginTop: 6 },
  alternarIdioma: { color: cores.primaria, fontWeight: '600', fontSize: 13, marginTop: -4, alignSelf: 'flex-start' },
  alternativas: { gap: espaco.md - 2 },
  feedback: { borderRadius: raio.md, padding: espaco.md, fontSize: 13, fontWeight: '600', overflow: 'hidden' },
  feedbackCerto: { backgroundColor: cores.sucessoSuave, color: '#065F46' },
  feedbackErrado: { backgroundColor: cores.erroSuave, color: cores.erroTexto },
  rodape: { paddingHorizontal: espaco.lg, paddingTop: espaco.md, backgroundColor: cores.fundo },
});
