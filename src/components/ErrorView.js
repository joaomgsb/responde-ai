import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from './PrimaryButton';
import { useTema } from '../context/TemaContext';
import { espaco, fonte } from '../theme';

// Estado de erro (RF12): mensagem compreensível e botão "Tentar novamente".
export default function ErrorView({ titulo = 'Não foi possível carregar', mensagem, onTentarNovamente }) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={styles.icone}>
        <Text style={styles.iconeTexto}>!</Text>
      </View>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.mensagem}>{mensagem}</Text>
      {onTentarNovamente ? (
        <PrimaryButton titulo="Tentar novamente" onPress={onTentarNovamente} style={styles.botao} />
      ) : null}
    </View>
  );
}

const criarEstilos = (cores) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: espaco.md,
      paddingHorizontal: espaco.xl,
    },
    icone: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: cores.erroSuave,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconeTexto: { color: cores.erro, fontSize: 40, fontWeight: '800' },
    titulo: { fontWeight: '800', fontSize: fonte.grande, color: cores.texto, textAlign: 'center' },
    mensagem: { fontSize: fonte.normal, color: cores.textoSecundario, textAlign: 'center', lineHeight: 20 },
    botao: { alignSelf: 'stretch', marginTop: espaco.sm },
  });
