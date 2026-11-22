import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Chip from '../components/Chip';
import PrimaryButton from '../components/PrimaryButton';
import RankingItem from '../components/RankingItem';
import { useQuiz } from '../context/QuizContext';
import { useTema } from '../context/TemaContext';
import { espaco, fonte } from '../theme';
import { confirmar } from '../utils/confirmar';

const TODAS = 'todas';

// Tela Ranking: lista local ordenada por pontos (RF10, FlatList), filtro por
// categoria e opção de limpar com confirmação (RF11).
export default function RankingScreen() {
  const { ranking, ultimoResultado, limparRanking } = useQuiz();
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const insets = useSafeAreaInsets();
  const [filtro, setFiltro] = useState(TODAS);

  // Categorias que aparecem no ranking, para montar os filtros.
  const categorias = useMemo(() => {
    const mapa = new Map();
    ranking.forEach((r) => {
      if (r.categoriaId !== null) mapa.set(r.categoriaId, r.categoriaNome);
    });
    return Array.from(mapa, ([id, nome]) => ({ id, nome }));
  }, [ranking]);

  // Se a categoria filtrada deixar de existir (ranking limpo), volta para "Todas".
  const filtroAtual = filtro === TODAS || categorias.some((c) => c.id === filtro) ? filtro : TODAS;
  const lista = useMemo(
    () => (filtroAtual === TODAS ? ranking : ranking.filter((r) => r.categoriaId === filtroAtual)),
    [ranking, filtroAtual]
  );

  async function pedirLimpeza() {
    const confirmou = await confirmar(
      'Limpar ranking?',
      'Todas as partidas salvas neste aparelho serão apagadas.',
      'Limpar'
    );
    if (confirmou) limparRanking();
  }

  return (
    <View style={styles.tela}>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtros}>
          <Chip rotulo="Todas" ativo={filtroAtual === TODAS} onPress={() => setFiltro(TODAS)} />
          {categorias.map((c) => (
            <Chip key={c.id} rotulo={c.nome} ativo={filtroAtual === c.id} onPress={() => setFiltro(c.id)} />
          ))}
        </ScrollView>
      </View>

      <FlatList
        style={styles.lista}
        contentContainerStyle={styles.listaConteudo}
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <RankingItem posicao={index + 1} registro={item} destaque={ultimoResultado?.id === item.id} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: espaco.sm }} />}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioTitulo}>Nenhuma partida ainda</Text>
            <Text style={styles.vazioTexto}>Jogue uma partida para aparecer no ranking.</Text>
          </View>
        }
      />

      <View style={[styles.rodape, { paddingBottom: insets.bottom + espaco.md }]}>
        <PrimaryButton
          titulo="Limpar ranking"
          variante="perigo"
          desabilitado={ranking.length === 0}
          onPress={pedirLimpeza}
        />
      </View>
    </View>
  );
}

const criarEstilos = (cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: cores.fundo },
    filtros: { paddingHorizontal: espaco.lg, paddingTop: espaco.lg, paddingBottom: espaco.sm, gap: espaco.sm },
    lista: { flex: 1 },
    listaConteudo: { paddingHorizontal: espaco.lg, paddingVertical: espaco.sm, flexGrow: 1 },
    vazio: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: espaco.xs, paddingVertical: 60 },
    vazioTitulo: { fontWeight: '700', fontSize: fonte.media, color: cores.texto },
    vazioTexto: { color: cores.textoSecundario, fontSize: fonte.normal, textAlign: 'center' },
    rodape: { paddingHorizontal: espaco.lg, paddingTop: espaco.sm },
  });
