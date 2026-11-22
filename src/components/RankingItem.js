import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTema } from '../context/TemaContext';
import { espaco, fonte, raio } from '../theme';
import { formatarData, rotuloDificuldade } from '../utils/jogo';

// Cores das três primeiras posições (ouro, prata e bronze), iguais nos dois temas.
const MEDALHAS = {
  1: { fundo: '#FEF3C7', texto: '#B45309' },
  2: { fundo: '#E5E7EB', texto: '#374151' },
  3: { fundo: '#FFEDD5', texto: '#C2410C' },
};

function RankingItem({ posicao, registro, destaque }) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const medalha = MEDALHAS[posicao];

  return (
    <View style={[styles.item, destaque && styles.destaque]}>
      <View style={[styles.posicao, medalha && { backgroundColor: medalha.fundo }]}>
        <Text style={[styles.posicaoTexto, medalha && { color: medalha.texto }]}>{posicao}</Text>
      </View>
      <View style={styles.textos}>
        <Text style={styles.nome} numberOfLines={1}>
          {registro.jogador}
        </Text>
        <Text style={styles.detalhe} numberOfLines={1}>
          {registro.categoriaNome} · {rotuloDificuldade(registro.dificuldade)} · {formatarData(registro.data)}
        </Text>
      </View>
      <View style={styles.pontuacao}>
        <Text style={styles.pontos}>{registro.pontos}</Text>
        <Text style={styles.acertos}>
          {registro.acertos}/{registro.total}
        </Text>
      </View>
    </View>
  );
}

export default React.memo(RankingItem);

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
    destaque: { borderWidth: 2, borderColor: cores.destaque },
    posicao: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: cores.primariaSuave,
      alignItems: 'center',
      justifyContent: 'center',
    },
    posicaoTexto: { color: cores.destaque, fontWeight: '800', fontSize: 13 },
    textos: { flex: 1 },
    nome: { fontWeight: '700', fontSize: fonte.normal, color: cores.texto },
    detalhe: { fontSize: fonte.pequena, color: cores.textoSecundario, marginTop: 2 },
    pontuacao: { alignItems: 'flex-end' },
    pontos: { fontWeight: '800', color: cores.destaque, fontSize: fonte.media },
    acertos: { fontSize: 11, color: cores.textoSecundario },
  });
