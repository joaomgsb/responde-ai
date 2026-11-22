import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTema } from '../context/TemaContext';
import { ALTURA_TOQUE, raio } from '../theme';

// Botão de opção em formato de pílula, usado para escolher a dificuldade,
// o filtro do ranking e o tema. Altura mínima de 44 pontos (RNF02).
export default function Chip({ rotulo, ativo, onPress }) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: ativo }}
      accessibilityLabel={rotulo}
      style={({ pressed }) => [styles.chip, ativo && styles.chipAtivo, pressed && styles.pressionado]}
    >
      <Text style={[styles.texto, ativo && styles.textoAtivo]}>{rotulo}</Text>
    </Pressable>
  );
}

const criarEstilos = (cores) =>
  StyleSheet.create({
    chip: {
      minHeight: ALTURA_TOQUE,
      paddingHorizontal: 16,
      justifyContent: 'center',
      borderRadius: raio.pilula,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
    },
    chipAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
    pressionado: { opacity: 0.8 },
    texto: { fontSize: 13, fontWeight: '600', color: cores.texto },
    textoAtivo: { color: cores.sobrePrimaria },
  });
