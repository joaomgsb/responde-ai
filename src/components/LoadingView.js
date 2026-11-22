import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { cores, espaco, fonte, raio } from '../theme';

// Estado de carregamento (RF12): indicador de atividade, mensagem e,
// opcionalmente, blocos que reservam o espaço dos itens da lista.
export default function LoadingView({ mensagem = 'Carregando…', detalhe, blocos = 0 }) {
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={mensagem}>
      <View style={styles.linha}>
        <ActivityIndicator size="large" color={cores.primaria} />
        <View>
          <Text style={styles.mensagem}>{mensagem}</Text>
          {detalhe ? <Text style={styles.detalhe}>{detalhe}</Text> : null}
        </View>
      </View>
      {Array.from({ length: blocos }).map((_, i) => (
        <View key={i} style={styles.bloco} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: espaco.md, paddingVertical: espaco.sm },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.md, marginVertical: espaco.xs },
  mensagem: { fontWeight: '700', color: cores.texto, fontSize: fonte.normal },
  detalhe: { fontSize: fonte.pequena, color: cores.textoSecundario, marginTop: 2 },
  bloco: { height: 58, borderRadius: raio.lg, backgroundColor: '#EEF0F4' },
});
