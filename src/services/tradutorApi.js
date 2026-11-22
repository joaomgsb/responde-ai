// Tradução automática das perguntas para o português usando a API gratuita
// MyMemory (https://mymemory.translated.net). A Open Trivia DB só fornece
// perguntas em inglês, então cada pergunta e suas alternativas são traduzidas
// antes de a partida começar.
//
// Se a tradução falhar (sem internet, limite diário atingido ou resposta
// estranha), o texto original em inglês é usado e o jogo segue normalmente.

const URL_BASE = 'https://api.mymemory.translated.net/get';
const PAR_IDIOMAS = 'en|pt-BR';
const TEMPO_LIMITE_MS = 8000;
const REQUISICOES_SIMULTANEAS = 5;

// E-mail de contato exigido pela MyMemory para ampliar o limite gratuito de
// 5.000 para 50.000 caracteres por dia (parâmetro "de").
const EMAIL_CONTATO = 'joaomgsb@gmail.com';

// Traduções já feitas nesta sessão, para não gastar o limite com textos repetidos.
const cache = new Map();

// A MyMemory às vezes devolve entidades HTML (por exemplo &#39; no lugar de ').
function limparEntidades(texto) {
  return texto
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

// Textos sem letras (números, ".svg", "1024") não precisam de tradução.
function precisaTraduzir(texto) {
  return /[a-zA-Z]{2,}/.test(texto);
}

async function traduzirTexto(texto) {
  if (!precisaTraduzir(texto)) return texto;
  if (cache.has(texto)) return cache.get(texto);

  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TEMPO_LIMITE_MS);
  try {
    const url =
      `${URL_BASE}?q=${encodeURIComponent(texto)}` +
      `&langpair=${encodeURIComponent(PAR_IDIOMAS)}&de=${encodeURIComponent(EMAIL_CONTATO)}`;
    const resposta = await fetch(url, { signal: controlador.signal });
    if (!resposta.ok) return null;
    const dados = await resposta.json();
    const traduzido = dados?.responseData?.translatedText;
    // Status diferente de 200 indica erro ou limite diário atingido; nesse caso
    // a API devolve um aviso em maiúsculas no lugar da tradução.
    if (Number(dados?.responseStatus) !== 200 || !traduzido || /MYMEMORY WARNING|QUERY LENGTH/i.test(traduzido)) {
      return null;
    }
    const limpo = limparEntidades(traduzido).trim();
    cache.set(texto, limpo);
    return limpo;
  } catch (erro) {
    return null;
  } finally {
    clearTimeout(temporizador);
  }
}

// Executa as traduções em pequenos lotes para não sobrecarregar a API.
async function traduzirTodos(textos) {
  const resultado = new Map();
  const unicos = [...new Set(textos)];
  for (let i = 0; i < unicos.length; i += REQUISICOES_SIMULTANEAS) {
    const lote = unicos.slice(i, i + REQUISICOES_SIMULTANEAS);
    const traduzidos = await Promise.all(lote.map(traduzirTexto));
    lote.forEach((original, j) => resultado.set(original, traduzidos[j]));
  }
  return resultado;
}

// Recebe as perguntas já normalizadas e acrescenta o campo "traducao":
// { enunciado, alternativas: { textoOriginal: textoTraduzido } }.
// Quando a tradução de uma pergunta não é confiável, "traducao" fica null
// e a tela exibe o texto em inglês.
export async function traduzirPerguntas(perguntas) {
  const textos = perguntas.flatMap((p) => [p.enunciado, ...p.alternativas]);
  const traducoes = await traduzirTodos(textos);

  return perguntas.map((p) => {
    const enunciado = traducoes.get(p.enunciado);
    if (!enunciado) return { ...p, traducao: null };

    const alternativas = {};
    p.alternativas.forEach((alt) => {
      alternativas[alt] = traducoes.get(alt) || alt;
    });
    // Se duas alternativas diferentes viraram o mesmo texto em português,
    // as alternativas ficam no original para não confundir o jogador.
    const valores = Object.values(alternativas).map((v) => v.toLowerCase());
    const temRepetida = new Set(valores).size !== valores.length;
    if (temRepetida) {
      p.alternativas.forEach((alt) => {
        alternativas[alt] = alt;
      });
    }
    return { ...p, traducao: { enunciado, alternativas } };
  });
}
