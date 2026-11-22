import React, { useEffect, useMemo, useState } from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import SplashView from './src/components/SplashView';
import { QuizProvider, useQuiz } from './src/context/QuizContext';
import { TemaProvider, useTema } from './src/context/TemaContext';
import AppNavigator from './src/navigation/AppNavigator';

// Mantém a splash nativa até a primeira tela do app ser desenhada,
// para a transição para a splash animada não piscar.
SplashScreen.preventAutoHideAsync().catch(() => {});

const TEMPO_MINIMO_SPLASH_MS = 1500;

// Ponto de entrada: os provedores de tema e do quiz envolvem a navegação para
// que todas as telas tenham acesso ao mesmo estado (tema, jogador, partida e ranking).
export default function App() {
  return (
    <SafeAreaProvider>
      <TemaProvider>
        <QuizProvider>
          <Raiz />
        </QuizProvider>
      </TemaProvider>
    </SafeAreaProvider>
  );
}

function Raiz() {
  const { carregado: quizCarregado } = useQuiz();
  const { carregado: temaCarregado, cores, escuro } = useTema();
  const [tempoMinimoPassou, setTempoMinimoPassou] = useState(false);
  const [telaAtual, setTelaAtual] = useState('Home');
  const navegacao = useNavigationContainerRef();

  // Esconde a splash nativa e garante que a splash animada apareça por um
  // tempo mínimo, mesmo quando os dados do aparelho carregam rápido.
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
    const temporizador = setTimeout(() => setTempoMinimoPassou(true), TEMPO_MINIMO_SPLASH_MS);
    return () => clearTimeout(temporizador);
  }, []);

  // Cores da navegação (cabeçalhos e fundo) de acordo com o tema atual.
  const temaNavegacao = useMemo(() => {
    const base = escuro ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: cores.destaque,
        background: cores.fundo,
        card: cores.superficie,
        text: cores.texto,
        border: cores.borda,
      },
    };
  }, [escuro, cores]);

  if (!quizCarregado || !temaCarregado || !tempoMinimoPassou) {
    return (
      <>
        <SplashView />
        <StatusBar style="light" />
      </>
    );
  }

  // A tela Início tem a faixa superior escura, então nela os ícones da barra
  // de status ficam claros; nas demais, seguem o tema.
  const estiloBarra = escuro || telaAtual === 'Home' ? 'light' : 'dark';

  return (
    <NavigationContainer
      ref={navegacao}
      theme={temaNavegacao}
      onStateChange={() => setTelaAtual(navegacao.getCurrentRoute()?.name)}
    >
      <AppNavigator />
      <StatusBar style={estiloBarra} />
    </NavigationContainer>
  );
}
