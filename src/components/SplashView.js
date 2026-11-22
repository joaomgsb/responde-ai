import React, { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useTema } from '../context/TemaContext';

// Tela de abertura própria (item opcional da disciplina): o logotipo aparece
// crescendo enquanto o app lê do aparelho o nome do jogador, o ranking e o tema.
export default function SplashView() {
  const { cores } = useTema();
  // Valores animados criados uma única vez, na primeira renderização.
  const [escala] = useState(() => new Animated.Value(0.6));
  const [opacidade] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(escala, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.back(1.6)),
        useNativeDriver: true,
      }),
      Animated.timing(opacidade, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [escala, opacidade]);

  return (
    <View style={[styles.tela, { backgroundColor: cores.topo }]} accessibilityLabel="Abrindo o Responde Aí!">
      <Animated.View style={[styles.centro, { opacity: opacidade, transform: [{ scale: escala }] }]}>
        <View style={styles.logo}>
          <Text style={styles.logoTexto}>?!</Text>
        </View>
        <Text style={styles.nome}>Responde Aí!</Text>
        <Text style={styles.slogan}>Quiz de conhecimentos gerais</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centro: { alignItems: 'center' },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTexto: { color: '#FFFFFF', fontSize: 48, fontWeight: '800' },
  nome: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', marginTop: 18 },
  slogan: { color: '#FFFFFF', opacity: 0.85, fontSize: 15, marginTop: 6 },
});
