import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTema } from '../context/TemaContext';
import { ALTURA_TOQUE, fonte } from '../theme';

// Botão com aparência de link (texto sem fundo), com área de toque de 44 pontos.
export default function LinkButton({ titulo, onPress, alinhamento = 'center', style }) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      style={({ pressed }) => [styles.area, { alignSelf: alinhamento }, pressed && styles.pressionado, style]}
    >
      <Text style={styles.texto}>{titulo}</Text>
    </Pressable>
  );
}

const criarEstilos = (cores) =>
  StyleSheet.create({
    area: { minHeight: ALTURA_TOQUE, justifyContent: 'center', paddingHorizontal: 4 },
    pressionado: { opacity: 0.6 },
    texto: { color: cores.destaque, fontWeight: '600', fontSize: fonte.normal - 1 },
  });
