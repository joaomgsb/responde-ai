import { decodificar, embaralhar, gerarId } from '../utils/jogo';
import { traduzirCategoria } from '../utils/categorias';

// Comunicação com a Open Trivia DB (https://opentdb.com).
// Todas as chamadas à API passam por este módulo.

const URL_BASE = 'https://opentdb.com';
const TEMPO_LIMITE_MS = 10000; // RNF03: tempo limite de 10 segundos
const ESPERA_LIMITE_MS = 5000; // RNF04: a API aceita 1 requisição a cada 5 s por IP
const TENTATIVAS_LIMITE = 2;

// Erro com mensagem pronta para ser exibida ao jogador.
export class ErroApi extends Error {
  constructor(mensagem, codigo) {
    super(mensagem);
    this.name = 'ErroApi';
    this.codigo = codigo;
  }
}

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// fetch com tempo limite, usando AbortController.
async function buscarJson(caminho) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TEMPO_LIMITE_MS);
  try {
    const resposta = await fetch(`${URL_BASE}${caminho}`, { signal: controlador.signal });
    if (!resposta.ok) {
      throw new ErroApi('O servidor de perguntas está indisponível. Tente novamente em instantes.', 'http');
    }
    return await resposta.json();
  } catch (erro) {
    if (erro instanceof ErroApi) throw erro;
    if (erro.name === 'AbortError') {
      throw new ErroApi('A resposta demorou demais. Verifique sua conexão e tente novamente.', 'tempo');
    }
    throw new ErroApi('Verifique sua conexão com a internet e tente novamente.', 'rede');
  } finally {
    clearTimeout(temporizador);
  }
}

// ---------- Categorias ----------

export async function buscarCategorias() {
  const dados = await buscarJson('/api_category.php');
  const lista = (dados.trivia_categories || []).map(traduzirCategoria);
  return lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

// ---------- Token de sessão (RF14) ----------
// O token faz a API não repetir perguntas. Fica só em memória: a própria API
// o descarta após 6 horas sem uso.

let tokenSessao = null;

async function obterToken() {
  if (tokenSessao) return tokenSessao;
  try {
    const dados = await buscarJson('/api_token.php?command=request');
    if (dados.response_code === 0 && dados.token) tokenSessao = dados.token;
  } catch {
    // Sem token o jogo continua funcionando, só pode repetir perguntas.
    tokenSessao = null;
  }
  return tokenSessao;
}

async function reiniciarToken() {
  if (!tokenSessao) return;
  try {
    await buscarJson(`/api_token.php?command=reset&token=${tokenSessao}`);
  } catch {
    tokenSessao = null;
  }
}

// ---------- Perguntas ----------

// Converte um item da API para o formato usado no app, já decodificado
// e com as alternativas embaralhadas (RF05).
function normalizarPergunta(item) {
  const correta = decodificar(item.correct_answer);
  const incorretas = item.incorrect_answers.map(decodificar);
  return {
    id: gerarId(),
    enunciado: decodificar(item.question),
    dificuldade: item.difficulty,
    correta,
    alternativas: embaralhar([correta, ...incorretas]),
  };
}

export async function buscarPerguntas({ categoriaId, dificuldade, quantidade = 10 }) {
  await obterToken();

  const parametros = [`amount=${quantidade}`, 'type=multiple', 'encode=url3986'];
  if (categoriaId) parametros.push(`category=${categoriaId}`);
  if (dificuldade && dificuldade !== 'any') parametros.push(`difficulty=${dificuldade}`);

  for (let tentativa = 0; tentativa <= TENTATIVAS_LIMITE; tentativa += 1) {
    const comToken = tokenSessao ? [...parametros, `token=${tokenSessao}`] : parametros;
    const dados = await buscarJson(`/api.php?${comToken.join('&')}`);

    switch (dados.response_code) {
      case 0:
        return dados.results.map(normalizarPergunta);
      case 1:
        throw new ErroApi(
          'Não há perguntas suficientes para essa combinação. Tente outra dificuldade ou categoria.',
          1
        );
      case 2:
        throw new ErroApi('A busca de perguntas recebeu um parâmetro inválido.', 2);
      case 3:
        // Token não encontrado: pede um novo e tenta de novo.
        tokenSessao = null;
        await obterToken();
        break;
      case 4:
        // O token já entregou todas as perguntas disponíveis: reinicia.
        await reiniciarToken();
        break;
      case 5:
        // Limite de requisições: aguarda 5 segundos e tenta de novo.
        await esperar(ESPERA_LIMITE_MS);
        break;
      default:
        throw new ErroApi('Resposta inesperada do servidor de perguntas.', dados.response_code);
    }
  }
  throw new ErroApi('O servidor está ocupado agora. Aguarde alguns segundos e tente novamente.', 5);
}
