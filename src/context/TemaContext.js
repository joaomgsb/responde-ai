import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { carregarTema, salvarTema } from '../services/storage';
import { temaClaro, temaEscuro } from '../theme';

// Tema claro ou escuro (item opcional da disciplina).
// O jogador escolhe "automático" (segue a configuração do aparelho),
// "claro" ou "escuro"; a escolha fica salva no AsyncStorage.

export const PREFERENCIAS_TEMA = [
  { valor: 'automatico', rotulo: 'Automático' },
  { valor: 'claro', rotulo: 'Claro' },
  { valor: 'escuro', rotulo: 'Escuro' },
];

const TemaContext = createContext(null);

export function TemaProvider({ children }) {
  const esquemaDoAparelho = useColorScheme(); // 'light', 'dark' ou null
  const [preferencia, setPreferencia] = useState('automatico');
  const [carregado, setCarregado] = useState(false);

  // Lê a preferência salva ao abrir o app.
  useEffect(() => {
    let ativo = true;
    carregarTema().then((salva) => {
      if (!ativo) return;
      if (salva) setPreferencia(salva);
      setCarregado(true);
    });
    return () => {
      ativo = false;
    };
  }, []);

  const escuro =
    preferencia === 'escuro' || (preferencia === 'automatico' && esquemaDoAparelho === 'dark');

  const valor = useMemo(
    () => ({
      carregado,
      preferencia,
      escuro,
      cores: escuro ? temaEscuro : temaClaro,
      definirPreferencia: (nova) => {
        setPreferencia(nova);
        salvarTema(nova);
      },
    }),
    [carregado, preferencia, escuro]
  );

  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}

export function useTema() {
  const contexto = useContext(TemaContext);
  if (!contexto) {
    throw new Error('useTema precisa ser usado dentro de <TemaProvider>.');
  }
  return contexto;
}
