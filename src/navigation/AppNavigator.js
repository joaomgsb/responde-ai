import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultScreen from '../screens/ResultScreen';
import RankingScreen from '../screens/RankingScreen';
import { useTema } from '../context/TemaContext';

// Pilha de navegação com as cinco telas do app.
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { cores } = useTema();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTintColor: cores.destaque,
        headerStyle: { backgroundColor: cores.superficie },
        headerTitleStyle: { color: cores.texto, fontWeight: '700' },
        headerBackTitle: 'Voltar',
        headerShadowVisible: true,
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: 'Escolha a categoria' }}
      />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        // Sem gesto de voltar: a saída da partida sempre passa pela confirmação.
        options={{ title: 'Partida', gestureEnabled: false }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{ title: 'Fim de partida', headerBackVisible: false, gestureEnabled: false }}
      />
      <Stack.Screen name="Ranking" component={RankingScreen} options={{ title: 'Ranking local' }} />
    </Stack.Navigator>
  );
}
