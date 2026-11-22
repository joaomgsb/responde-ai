import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTema } from '../context/TemaContext';
import { espaco, fonte, raio } from '../theme';

// Alternativa de resposta. O estado visual depois da resposta é:
// 'correta' (verde), 'errada' (vermelho), 'apagada' (as demais) ou
// 'normal' (antes de responder).
export default function OptionButton({ letra, texto, estado = 'normal', desabilitado, onPress }) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const marcada = estado === 'correta' || estado === 'errada';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: desabilitado }}
      accessibilityLabel={`Alternativa ${letra}: ${texto}`}
      disabled={desabilitado}
      onPress={onPress}
      style={({ pressed }) => [
        styles.opcao,
        estado === 'correta' && styles.correta,
        estado === 'errada' && styles.errada,
        estado === 'apagada' && styles.apagada,
        pressed && styles.pressionado,
      ]}
    >
      <View
        style={[
          styles.letra,
          estado === 'correta' && styles.letraCorreta,
          estado === 'errada' && styles.letraErrada,
        ]}
      >
        <Text style={[styles.letraTexto, marcada && styles.letraTextoMarcada]}>{letra}</Text>
      </View>
      <Text style={styles.texto}>{texto}</Text>
    </Pressable>
  );
}

const criarEstilos = (cores) =>
  StyleSheet.create({
    opcao: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: espaco.md,
      backgroundColor: cores.superficie,
      borderWidth: 1.5,
      borderColor: cores.borda,
      borderRadius: raio.lg,
      paddingVertical: 13,
      paddingHorizontal: espaco.md,
      minHeight: 52,
    },
    correta: { borderColor: cores.sucesso, backgroundColor: cores.sucessoSuave },
    errada: { borderColor: cores.erro, backgroundColor: cores.erroSuave },
    apagada: { opacity: 0.5 },
    pressionado: { opacity: 0.8 },
    letra: {
      width: 28,
      height: 28,
      borderRadius: raio.sm,
      backgroundColor: cores.primariaSuave,
      alignItems: 'center',
      justifyContent: 'center',
    },
    letraCorreta: { backgroundColor: cores.sucesso },
    letraErrada: { backgroundColor: cores.erro },
    letraTexto: { color: cores.destaque, fontWeight: '800', fontSize: 13 },
    letraTextoMarcada: { color: cores.superficie },
    texto: { flex: 1, fontSize: fonte.normal + 0.5, color: cores.texto, fontWeight: '500' },
  });
