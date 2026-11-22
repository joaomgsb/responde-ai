import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { QuizProvider } from './src/context/QuizContext';
import AppNavigator from './src/navigation/AppNavigator';

// Ponto de entrada: o QuizProvider envolve a navegação para que todas as
// telas tenham acesso ao mesmo estado (jogador, partida e ranking).
export default function App() {
  return (
    <SafeAreaProvider>
      <QuizProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </QuizProvider>
    </SafeAreaProvider>
  );
}
