import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, espaco, fonte, raio } from '../theme';

// Alternativa de resposta. O estado visual depois da resposta é:
// 'correta' (verde), 'errada' (vermelho), 'apagada' (as demais) ou
// 'normal' (antes de responder).
export default function OptionButton({ letra, texto, estado = 'normal', desabilitado, onPress }) {
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
        <Text
          style={[styles.letraTexto, (estado === 'correta' || estado === 'errada') && styles.letraTextoBranco]}
        >
          {letra}
        </Text>
      </View>
      <Text style={styles.texto}>{texto}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    backgroundColor: cores.branco,
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
  letraTexto: { color: cores.primaria, fontWeight: '800', fontSize: 13 },
  letraTextoBranco: { color: cores.branco },
  texto: { flex: 1, fontSize: fonte.normal + 0.5, color: cores.texto, fontWeight: '500' },
});
