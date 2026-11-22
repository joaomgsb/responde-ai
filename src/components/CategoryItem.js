import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTema } from '../context/TemaContext';
import { espaco, fonte, raio } from '../theme';

// Item da lista de categorias: ícone com sigla, nome traduzido, nome
// original da API e marcador de seleção.
function CategoryItem({ categoria, selecionada, onPress }) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: selecionada }}
      accessibilityLabel={categoria.nome}
      onPress={() => onPress(categoria)}
      style={({ pressed }) => [
        styles.item,
        selecionada && styles.itemSelecionado,
        pressed && styles.pressionado,
      ]}
    >
      <View style={[styles.icone, { backgroundColor: categoria.cor }]}>
        <Text style={styles.sigla}>{categoria.sigla}</Text>
      </View>
      <View style={styles.textos}>
        <Text style={styles.nome}>{categoria.nome}</Text>
        <Text style={styles.original}>{categoria.nomeOriginal}</Text>
      </View>
      <View style={[styles.radio, selecionada && styles.radioMarcado]} />
    </Pressable>
  );
}

// memo evita re-renderizar todos os itens da FlatList a cada seleção.
export default React.memo(CategoryItem);

const criarEstilos = (cores) =>
  StyleSheet.create({
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: espaco.md,
      backgroundColor: cores.superficie,
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: raio.lg,
      paddingVertical: 10,
      paddingHorizontal: espaco.md,
    },
    itemSelecionado: { borderWidth: 2, borderColor: cores.destaque, backgroundColor: cores.primariaSuave },
    pressionado: { opacity: 0.8 },
    icone: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    sigla: { color: '#FFFFFF', fontWeight: '800', fontSize: fonte.normal },
    textos: { flex: 1 },
    nome: { fontSize: fonte.normal, fontWeight: '700', color: cores.texto },
    original: { fontSize: fonte.pequena, color: cores.textoSecundario, marginTop: 2 },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: cores.bordaForte },
    radioMarcado: { borderWidth: 6, borderColor: cores.destaque },
  });
