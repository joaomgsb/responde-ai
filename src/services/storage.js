import AsyncStorage from '@react-native-async-storage/async-storage';

// Persistência local (AsyncStorage). Só este módulo conhece as chaves e o
// formato dos dados; o restante do app usa estas funções.

const CHAVE_JOGADOR = '@quiz:jogador';
const CHAVE_RANKING = '@quiz:ranking';
const CHAVE_TEMA = '@quiz:tema';
const TEMAS_VALIDOS = ['automatico', 'claro', 'escuro'];

// RNF05: o ranking guarda no máximo as 50 melhores partidas.
export const LIMITE_RANKING = 50;

export async function carregarJogador() {
  try {
    const nome = await AsyncStorage.getItem(CHAVE_JOGADOR);
    return nome || '';
  } catch (erro) {
    console.warn('Não foi possível ler o nome do jogador', erro);
    return '';
  }
}

export async function salvarJogador(nome) {
  try {
    await AsyncStorage.setItem(CHAVE_JOGADOR, nome);
  } catch (erro) {
    console.warn('Não foi possível salvar o nome do jogador', erro);
  }
}

export async function carregarRanking() {
  try {
    const json = await AsyncStorage.getItem(CHAVE_RANKING);
    const lista = json ? JSON.parse(json) : [];
    return Array.isArray(lista) ? lista : [];
  } catch (erro) {
    // Dado corrompido ou ilegível: começa com o ranking vazio.
    console.warn('Não foi possível ler o ranking', erro);
    return [];
  }
}

export async function salvarRanking(ranking) {
  try {
    await AsyncStorage.setItem(CHAVE_RANKING, JSON.stringify(ranking));
  } catch (erro) {
    console.warn('Não foi possível salvar o ranking', erro);
  }
}

// Preferência de tema: 'automatico', 'claro' ou 'escuro'.
export async function carregarTema() {
  try {
    const tema = await AsyncStorage.getItem(CHAVE_TEMA);
    return TEMAS_VALIDOS.includes(tema) ? tema : null;
  } catch (erro) {
    console.warn('Não foi possível ler o tema', erro);
    return null;
  }
}

export async function salvarTema(tema) {
  try {
    await AsyncStorage.setItem(CHAVE_TEMA, tema);
  } catch (erro) {
    console.warn('Não foi possível salvar o tema', erro);
  }
}
