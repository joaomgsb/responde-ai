import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { ALTURA_TOQUE, cores, fonte, raio } from '../theme';

// Botão padrão do app.
// variante: 'cheio' (fundo colorido), 'contorno' ou 'perigo' (contorno vermelho).
export default function PrimaryButton({
  titulo,
  onPress,
  variante = 'cheio',
  desabilitado = false,
  carregando = false,
  style,
}) {
  const inativo = desabilitado || carregando;
  const estiloVariante = {
    cheio: [styles.cheio, inativo && styles.cheioInativo],
    contorno: [styles.contorno, inativo && styles.contornoInativo],
    perigo: [styles.contorno, styles.perigo, inativo && styles.contornoInativo],
  }[variante];
  const corTexto = variante === 'cheio' ? cores.branco : variante === 'perigo' ? cores.erro : cores.primaria;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inativo }}
      disabled={inativo}
      onPress={onPress}
      style={({ pressed }) => [styles.base, estiloVariante, pressed && styles.pressionado, style]}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <Text style={[styles.texto, { color: corTexto }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: ALTURA_TOQUE + 2,
    borderRadius: raio.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  cheio: { backgroundColor: cores.primaria },
  cheioInativo: { backgroundColor: cores.primariaDesabilitada },
  contorno: { backgroundColor: cores.branco, borderWidth: 2, borderColor: cores.primaria },
  contornoInativo: { opacity: 0.45 },
  perigo: { borderColor: cores.erro },
  pressionado: { opacity: 0.85 },
  texto: { fontSize: fonte.media, fontWeight: '700' },
});
