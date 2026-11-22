import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoryItem from '../components/CategoryItem';
import ErrorView from '../components/ErrorView';
import LoadingView from '../components/LoadingView';
import PrimaryButton from '../components/PrimaryButton';
import { useQuiz } from '../context/QuizContext';
import { buscarCategorias, buscarPerguntas } from '../services/triviaApi';
import { traduzirPerguntas } from '../services/tradutorApi';
import { cores, espaco, fonte, raio } from '../theme';
import { DIFICULDADES } from '../utils/jogo';

// Tela Categorias: escolha da dificuldade (RF03) e da categoria (RF02, FlatList)
// e início da partida (RF04). Trata carregamento e erro da API (RF12).
export default function CategoriesScreen({ navigation }) {
  const { config, definirConfig, iniciarPartida } = useQuiz();
  const insets = useSafeAreaInsets();

  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [buscandoPerguntas, setBuscandoPerguntas] = useState(false);
  const [etapa, setEtapa] = useState(''); // texto exibido enquanto prepara a partida
  const [erroPartida, setErroPartida] = useState(null);

  const carregarCategorias = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setCategorias(await buscarCategorias());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarCategorias();
  }, [carregarCategorias]);

  const selecionarCategoria = useCallback(
    (categoria) => {
      setErroPartida(null);
      definirConfig({ categoria });
    },
    [definirConfig]
  );

  async function comecar() {
    if (!config.categoria) return;
    setBuscandoPerguntas(true);
    setErroPartida(null);
    try {
      setEtapa('Buscando perguntas…');
      let perguntas = await buscarPerguntas({
        categoriaId: config.categoria.id,
        dificuldade: config.dificuldade,
        quantidade: config.quantidade,
      });
      if (config.traduzir) {
        // A tradução nunca impede o jogo: o que não for traduzido fica em inglês.
        setEtapa('Traduzindo para o português…');
        perguntas = await traduzirPerguntas(perguntas);
      }
      iniciarPartida(perguntas);
      navigation.navigate('Quiz');
    } catch (e) {
      setErroPartida(e.message);
    } finally {
      setBuscandoPerguntas(false);
      setEtapa('');
    }
  }

  if (erro) {
    return (
      <View style={styles.tela}>
        <ErrorView mensagem={erro} onTentarNovamente={carregarCategorias} />
      </View>
    );
  }

  return (
    <View style={styles.tela}>
      <View style={styles.cabecalho}>
        <Text style={styles.rotulo}>Dificuldade</Text>
        <View style={styles.chips}>
          {DIFICULDADES.map((d) => {
            const ativo = config.dificuldade === d.valor;
            return (
              <Pressable
                key={d.valor}
                accessibilityRole="radio"
                accessibilityState={{ selected: ativo }}
                onPress={() => {
                  setErroPartida(null);
                  definirConfig({ dificuldade: d.valor });
                }}
                style={[styles.chip, ativo && styles.chipAtivo]}
              >
                <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>{d.rotulo}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.rotulo, styles.rotuloCategorias]}>Categorias</Text>
      </View>

      {carregando ? (
        <View style={styles.lista}>
          <LoadingView mensagem="Carregando categorias…" detalhe="Buscando na Open Trivia DB" blocos={6} />
        </View>
      ) : (
        <FlatList
          style={styles.lista}
          contentContainerStyle={styles.listaConteudo}
          data={categorias}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <CategoryItem
              categoria={item}
              selecionada={config.categoria?.id === item.id}
              onPress={selecionarCategoria}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: espaco.sm }} />}
        />
      )}

      <View style={[styles.rodape, { paddingBottom: insets.bottom + espaco.md }]}>
        <View style={styles.traduzir}>
          <View style={styles.traduzirTextos}>
            <Text style={styles.traduzirTitulo}>Traduzir perguntas para o português</Text>
            <Text style={styles.traduzirDetalhe}>Tradução automática; o original em inglês fica disponível</Text>
          </View>
          <Switch
            value={config.traduzir}
            onValueChange={(valor) => definirConfig({ traduzir: valor })}
            trackColor={{ true: cores.primariaClara, false: cores.borda }}
            thumbColor={cores.branco}
            activeThumbColor={cores.branco}
            accessibilityLabel="Traduzir perguntas para o português"
          />
        </View>
        {erroPartida ? <Text style={styles.erroPartida}>{erroPartida}</Text> : null}
        {etapa ? <Text style={styles.etapa}>{etapa}</Text> : null}
        <PrimaryButton
          titulo={config.categoria ? `Começar (${config.quantidade} perguntas)` : 'Escolha uma categoria'}
          desabilitado={!config.categoria || carregando}
          carregando={buscandoPerguntas}
          onPress={comecar}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  cabecalho: { paddingHorizontal: espaco.lg, paddingTop: espaco.lg, gap: espaco.sm },
  rotulo: {
    fontSize: fonte.pequena,
    fontWeight: '600',
    color: cores.textoSecundario,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rotuloCategorias: { marginTop: espaco.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    minHeight: 36,
    justifyContent: 'center',
    borderRadius: raio.pilula,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.branco,
  },
  chipAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  chipTexto: { fontSize: 13, fontWeight: '600', color: cores.texto },
  chipTextoAtivo: { color: cores.branco },
  lista: { flex: 1, paddingHorizontal: espaco.lg },
  listaConteudo: { paddingVertical: espaco.sm },
  rodape: {
    paddingHorizontal: espaco.lg,
    paddingTop: espaco.md,
    gap: espaco.sm,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    backgroundColor: cores.fundo,
  },
  traduzir: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  traduzirTextos: { flex: 1 },
  traduzirTitulo: { fontSize: fonte.normal, fontWeight: '600', color: cores.texto },
  traduzirDetalhe: { fontSize: 11.5, color: cores.textoSecundario, marginTop: 1 },
  etapa: { textAlign: 'center', fontSize: fonte.pequena, color: cores.textoSecundario },
  erroPartida: {
    backgroundColor: cores.erroSuave,
    color: cores.erroTexto,
    padding: 10,
    borderRadius: raio.md,
    fontSize: 13,
    fontWeight: '600',
  },
});
