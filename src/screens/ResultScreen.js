import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinkButton from '../components/LinkButton';
import PrimaryButton from '../components/PrimaryButton';
import { useQuiz } from '../context/QuizContext';
import { useTema } from '../context/TemaContext';
import { espaco, fonte, raio } from '../theme';
import { pontosDaPergunta, rotuloDificuldade } from '../utils/jogo';

// Tela Resultado: pontos, acertos e posição no ranking (RF07 e RF08).
export default function ResultScreen({ navigation }) {
  const { ultimoResultado: resultado, ranking } = useQuiz();
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const insets = useSafeAreaInsets();

  if (!resultado) {
    return (
      <View style={[styles.tela, styles.vazio]}>
        <Text style={styles.mensagem}>Nenhuma partida concluída.</Text>
        <PrimaryButton titulo="Voltar ao início" onPress={() => navigation.popToTop()} />
      </View>
    );
  }

  const posicao = ranking.findIndex((r) => r.id === resultado.id) + 1;
  const percentual = resultado.acertos / resultado.total;
  const saudacao =
    percentual >= 0.7 ? 'Muito bem' : percentual >= 0.4 ? 'Bom jogo' : 'Continue tentando';

  return (
    <View style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.anel}>
          <Text style={styles.pontos}>{resultado.pontos}</Text>
          <Text style={styles.pontosLegenda}>pontos</Text>
        </View>
        <Text style={styles.saudacao}>
          {saudacao}, {resultado.jogador}!
        </Text>
        <Text style={styles.posicao}>
          {posicao > 0
            ? `Você ficou em ${posicao}º lugar no ranking`
            : 'Essa pontuação não entrou entre as 50 melhores do ranking'}
        </Text>

        <View style={styles.cartao}>
          <Linha styles={styles} rotulo="Acertos" valor={`${resultado.acertos} de ${resultado.total}`} />
          <Linha styles={styles} rotulo="Categoria" valor={resultado.categoriaNome} />
          <Linha styles={styles} rotulo="Dificuldade" valor={rotuloDificuldade(resultado.dificuldade)} />
          <Linha
            styles={styles}
            rotulo="Pontos por acerto"
            valor={resultado.dificuldade === 'any' ? '10 a 30' : String(pontosDaPergunta(resultado.dificuldade))}
            ultima
          />
        </View>
      </ScrollView>

      <View style={[styles.rodape, { paddingBottom: insets.bottom + espaco.md }]}>
        {/* "Jogar novamente" volta para Categorias com a mesma configuração. */}
        <PrimaryButton titulo="Jogar novamente" onPress={() => navigation.navigate('Categories')} />
        <PrimaryButton titulo="Ver ranking" variante="contorno" onPress={() => navigation.navigate('Ranking')} />
        <LinkButton titulo="Voltar ao início" onPress={() => navigation.popToTop()} />
      </View>
    </View>
  );
}

function Linha({ styles, rotulo, valor, ultima }) {
  return (
    <View style={[styles.linha, ultima && styles.linhaUltima]}>
      <Text style={styles.linhaRotulo}>{rotulo}</Text>
      <Text style={styles.linhaValor}>{valor}</Text>
    </View>
  );
}

const criarEstilos = (cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: cores.fundo },
    vazio: { justifyContent: 'center', padding: espaco.xl, gap: espaco.md },
    mensagem: { textAlign: 'center', color: cores.textoSecundario, fontSize: fonte.media },
    conteudo: { padding: espaco.lg, gap: espaco.md, alignItems: 'stretch' },
    anel: {
      alignSelf: 'center',
      width: 150,
      height: 150,
      borderRadius: 75,
      borderWidth: 16,
      borderColor: cores.primaria,
      backgroundColor: cores.superficie,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: espaco.sm,
    },
    pontos: { fontSize: 34, fontWeight: '800', color: cores.texto },
    pontosLegenda: { fontSize: fonte.pequena, color: cores.textoSecundario },
    saudacao: { textAlign: 'center', fontWeight: '700', fontSize: 17, color: cores.texto },
    posicao: { textAlign: 'center', fontSize: 13, color: cores.textoSecundario, marginTop: -6 },
    cartao: {
      backgroundColor: cores.superficie,
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: raio.lg,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    linha: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 9,
      borderBottomWidth: 1,
      borderBottomColor: cores.borda,
    },
    linhaUltima: { borderBottomWidth: 0 },
    linhaRotulo: { color: cores.textoSecundario, fontSize: fonte.normal },
    linhaValor: { color: cores.texto, fontWeight: '700', fontSize: fonte.normal },
    rodape: { paddingHorizontal: espaco.lg, paddingTop: espaco.sm, gap: espaco.md },
  });
