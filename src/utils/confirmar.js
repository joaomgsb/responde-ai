import { Alert, Platform } from 'react-native';

// Mostra uma caixa de confirmação e devolve uma Promise<boolean>.
// No celular usa o Alert nativo; na versão web o Alert com botões não
// funciona, então usamos o window.confirm do navegador.
export function confirmar(titulo, mensagem, textoConfirmar = 'Confirmar') {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`));
  }
  return new Promise((resolve) => {
    Alert.alert(
      titulo,
      mensagem,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        { text: textoConfirmar, style: 'destructive', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    );
  });
}
