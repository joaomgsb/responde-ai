import React, { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Chip from '../components/Chip';
import PrimaryButton from '../components/PrimaryButton';
import { useQuiz } from '../context/QuizContext';
import { PREFERENCIAS_TEMA, useTema } from '../context/TemaContext';
import { espaco, fonte, raio } from '../theme';

// Tela Início: nome do jogador (RF01), resumo do desempenho, escolha do tema
// e acesso ao jogo e ao ranking.
export default function HomeScreen({ navigation }) {
  const { jogador, definirJogador, ranking } = useQuiz();
  const { cores, preferencia, definirPreferencia } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const insets = useSafeAreaInsets();
  const nomeValido = jogador.trim().length > 0;


  // Resumo calculado a partir das partidas do jogador atual no ranking.
  const resumo = useMemo(() => {
    const nome = jogador.trim().toLowerCase();
    const minhas = ranking.filter((r) => r.jogador.toLowerCase() === nome);
    const acertos = minhas.reduce((soma, r) => soma + r.acertos, 0);
    const total = minhas.reduce((soma, r) => soma + r.total, 0);
    return {
      partidas: minhas.length,
      melhor: minhas.length ? Math.max(...minhas.map((r) => r.pontos)) : 0,
      percentual: total ? Math.round((acertos / total) * 100) : 0,
    };
  }, [ranking, jogador]);

  return (
    <KeyboardAvoidingView style={styles.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.rolagem} keyboardShouldPersistTaps="handled">
        <View style={[styles.topo, { paddingTop: insets.top + espaco.xl }]}>
          <View style={styles.logo}>
            <Text style={styles.logoTexto}>?!</Text>
          </View>
          <Text style={styles.titulo}>Responde Aí!</Text>
          <Text style={styles.subtitulo}>
            Teste seus conhecimentos em perguntas de várias categorias e entre para o ranking.
          </Text>
        </View>

        <View style={styles.conteudo}>
          <Text style={styles.rotulo}>Seu nome de jogador</Text>
          <TextInput
            value={jogador}
            onChangeText={definirJogador}
            placeholder="Digite seu nome"
            placeholderTextColor={cores.textoSecundario}
            maxLength={20}
            autoCapitalize="words"
            returnKeyType="done"
            style={styles.campo}
            accessibilityLabel="Seu nome de jogador"
          />

          <View style={styles.cartao}>
            <View style={styles.estatistica}>
              <Text style={styles.numero}>{resumo.partidas}</Text>
              <Text style={styles.legenda}>partidas</Text>
            </View>
            <View style={styles.estatistica}>
              <Text style={styles.numero}>{resumo.melhor}</Text>
              <Text style={styles.legenda}>melhor pontuação</Text>
            </View>
            <View style={styles.estatistica}>
              <Text style={styles.numero}>{resumo.percentual}%</Text>
              <Text style={styles.legenda}>acertos</Text>
            </View>
          </View>

          <Text style={[styles.rotulo, styles.rotuloTema]}>Tema</Text>
          <View style={styles.chips}>
            {PREFERENCIAS_TEMA.map((p) => (
              <Chip
                key={p.valor}
                rotulo={p.rotulo}
                ativo={preferencia === p.valor}
                onPress={() => definirPreferencia(p.valor)}
              />
            ))}
          </View>

          <View style={styles.espacador} />

          {!nomeValido ? <Text style={styles.aviso}>Informe seu nome para jogar.</Text> : null}
          <PrimaryButton
            titulo="Jogar"
            desabilitado={!nomeValido}
            onPress={() => navigation.navigate('Categories')}
          />
          <PrimaryButton
            titulo="Ver ranking"
            variante="contorno"
            onPress={() => navigation.navigate('Ranking')}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const criarEstilos = (cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: cores.fundo },
    rolagem: { flexGrow: 1 },
    topo: {
      backgroundColor: cores.topo,
      paddingHorizontal: 22,
      paddingBottom: 30,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
    },
    logo: {
      width: 60,
      height: 60,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoTexto: { color: '#FFFFFF', fontSize: 30, fontWeight: '800' },
    titulo: { color: '#FFFFFF', fontSize: fonte.titulo, fontWeight: '800', marginTop: 12 },
    subtitulo: { color: '#FFFFFF', opacity: 0.9, fontSize: fonte.normal, marginTop: 6, lineHeight: 20 },
    conteudo: { flex: 1, padding: espaco.lg, paddingTop: 20, gap: espaco.md },
    rotulo: {
      fontSize: fonte.pequena,
      fontWeight: '600',
      color: cores.textoSecundario,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    rotuloTema: { marginTop: espaco.xs },
    campo: {
      minHeight: 48,
      borderWidth: 1.5,
      borderColor: cores.primariaClara,
      borderRadius: raio.md,
      backgroundColor: cores.superficie,
      paddingHorizontal: 14,
      fontSize: fonte.media,
      color: cores.texto,
    },
    cartao: {
      flexDirection: 'row',
      backgroundColor: cores.superficie,
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: raio.lg,
      padding: 14,
      marginTop: espaco.xs,
    },
    estatistica: { flex: 1, alignItems: 'center' },
    numero: { fontSize: 20, fontWeight: '700', color: cores.destaque },
    legenda: { fontSize: 11, color: cores.textoSecundario, textAlign: 'center' },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
    espacador: { flex: 1, minHeight: espaco.md },
    aviso: { textAlign: 'center', color: cores.textoSecundario, fontSize: fonte.pequena },
  });
