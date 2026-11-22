# Responde Aí!

Aplicativo móvel de quiz desenvolvido em **React Native com Expo** para o trabalho prático da disciplina **Desenvolvimento de Aplicações Móveis** (Sistemas de Informação, PUC Minas Betim, 2º semestre de 2026).

O jogador informa seu nome, escolhe uma categoria e uma dificuldade, responde a 10 perguntas de múltipla escolha obtidas da API pública [Open Trivia DB](https://opentdb.com), recebe o retorno de cada resposta na hora e tem a pontuação registrada em um **ranking local**, guardado no próprio aparelho. As perguntas, que a API fornece em inglês, são traduzidas automaticamente para o português pela API [MyMemory](https://mymemory.translated.net).

**Repositório:** https://github.com/joaomgsb/responde-ai

## Integrantes

- Caio Vieira de Freitas
- Guilherme Setragni Freitas
- João Mateus Gomes Sales Barbosa
- Stéfano Gennaro
- Vitor Lucas Firmino Rezende

Professor: Jardell Fillipe da Silva

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org) em versão LTS (20 ou mais recente) e npm.
- No celular, o aplicativo **Expo Go** (Play Store ou App Store) atualizado. O projeto usa o **Expo SDK 58**, que é a versão suportada pelo Expo Go atual.
- Computador e celular na **mesma rede Wi-Fi**.

### Passo a passo

```bash
# 1. Entrar na pasta do projeto
cd responde-ai

# 2. Instalar as dependências (só na primeira vez)
npm install

# 3. Iniciar o servidor do Expo
npx expo start
```

4. Abra o Expo Go no celular e leia o QR Code que aparece no terminal (no iPhone, use a câmera do próprio aparelho).
5. O app abre na tela **Início**. Digite um nome e toque em **Jogar**.

Outras formas de abrir:

- **Navegador:** com o servidor rodando, aperte `w` no terminal (ou rode `npm run web`).
- **Emulador Android:** aperte `a` no terminal (é preciso ter o Android Studio instalado).
- **Se o QR Code não conectar** (rede da faculdade, por exemplo): rode `npx expo start --tunnel`.

O app precisa de internet para buscar categorias e perguntas. O ranking e o nome do jogador ficam salvos no aparelho e continuam lá depois de fechar o app.

## Requisitos da disciplina

| Requisito | Onde está no código |
|---|---|
| React Native com Expo | Projeto criado com `create-expo-app`, Expo SDK 58 |
| Pelo menos três telas com navegação | Cinco telas em `src/screens/`, ligadas pela pilha em `src/navigation/AppNavigator.js` |
| FlatList | Lista de categorias (`CategoriesScreen.js`) e lista do ranking (`RankingScreen.js`) |
| Consumo de API com carregamento e erro | `src/services/triviaApi.js` (Open Trivia DB) e `src/services/tradutorApi.js` (MyMemory); estados em `LoadingView.js` e `ErrorView.js`, usados em `CategoriesScreen.js` |
| Context API | `src/context/QuizContext.js` (Context API + `useReducer`), acessado pelo hook `useQuiz()` |
| Persistência | `src/services/storage.js` com AsyncStorage (nome do jogador e ranking) |

Opcional: ícone próprio do aplicativo (`assets/icon.png`).

## Funcionalidades

- **Início:** nome do jogador (salvo no aparelho) e resumo do desempenho: partidas, melhor pontuação e percentual de acertos.
- **Categorias:** escolha da dificuldade (qualquer, fácil, média ou difícil) e da categoria. São 24 categorias da API, com nomes traduzidos para o português. Uma chave liga ou desliga a tradução automática das perguntas.
- **Pergunta:** uma pergunta por vez, com alternativas embaralhadas, barra de progresso e pontuação no cabeçalho. Depois de responder, a alternativa certa fica verde, a errada fica vermelha e aparece uma mensagem. O link **Ver original em inglês** mostra o texto da API sem tradução. O botão ✕ sai da partida, sempre com confirmação.
- **Resultado:** pontos, acertos e posição no ranking.
- **Ranking:** partidas ordenadas por pontuação, filtro por categoria e opção de limpar (com confirmação).

Pontuação por acerto: fácil 10, média 20 e difícil 30 pontos. O ranking guarda as 50 melhores partidas.

## Tradução das perguntas

A Open Trivia DB só tem perguntas em inglês. Antes de a partida começar, o app traduz cada pergunta e suas alternativas para o português com a API gratuita **MyMemory** (`src/services/tradutorApi.js`):

- chamada: `https://api.mymemory.translated.net/get?q=TEXTO&langpair=en|pt-BR&de=EMAIL`;
- o parâmetro `de` (e-mail de contato) amplia o limite gratuito de 5.000 para 50.000 caracteres por dia, o suficiente para cerca de 30 partidas; o e-mail fica na constante `EMAIL_CONTATO`;
- **atenção: a tradução é automática e gratuita, e a qualidade é limitada.** Ela traduz cada texto isoladamente, sem o contexto da pergunta, então respostas curtas, nomes próprios, siglas e trocadilhos costumam sair errados. Exemplo real dos testes: numa pergunta sobre o nome de um bando de urubus em inglês, a resposta *Wake* virou *ACORDE*. Por isso a tela da pergunta tem o link **Ver original em inglês**, e a tradução pode ser desligada na tela Categorias;
- se a tradução falhar (sem internet ou limite diário atingido), a pergunta aparece em inglês e o jogo continua normalmente;
- a tradução pode ser desligada na tela Categorias.

## Estrutura do projeto

```
App.js                      Ponto de entrada: QuizProvider + NavigationContainer
src/
  navigation/AppNavigator.js   Pilha de telas (React Navigation, Native Stack)
  screens/                     HomeScreen, CategoriesScreen, QuizScreen, ResultScreen, RankingScreen
  components/                  PrimaryButton, CategoryItem, OptionButton, RankingItem, LoadingView, ErrorView
  context/QuizContext.js       Estado compartilhado: jogador, configuração, partida e ranking
  services/triviaApi.js        Chamadas à Open Trivia DB (categorias, token de sessão, perguntas)
  services/tradutorApi.js      Tradução das perguntas para o português (MyMemory)
  services/storage.js          Leitura e gravação no AsyncStorage
  utils/                       Regras do jogo, tradução das categorias e confirmação
  theme/index.js               Cores, espaçamentos e tamanhos de fonte
```

## API utilizada

[Open Trivia DB](https://opentdb.com/api_config.php): gratuita e sem chave de acesso.

| Endpoint | Uso |
|---|---|
| `/api_category.php` | Lista de categorias |
| `/api_token.php?command=request` | Token de sessão, para não repetir perguntas |
| `/api_token.php?command=reset&token=...` | Reinicia o token quando as perguntas se esgotam |
| `/api.php?amount=10&category=ID&difficulty=...&type=multiple&encode=url3986&token=...` | Perguntas da partida |

Tradução: [MyMemory](https://mymemory.translated.net/doc/spec.php), gratuita e sem cadastro (veja a seção "Tradução das perguntas").

Tratamento das respostas da Open Trivia DB: código 1 (poucas perguntas para a combinação) mostra uma mensagem pedindo outra dificuldade; códigos 3 e 4 renovam ou reiniciam o token; código 5 (limite de uma requisição a cada 5 segundos) aguarda 5 segundos e tenta de novo; falha de rede ou demora acima de 10 segundos mostram a tela de erro com **Tentar novamente**.

## Bibliotecas

Todas instaladas com `npm install`, sem configuração extra, e compatíveis com o Expo Go:

| Biblioteca | Para que serve |
|---|---|
| `@react-navigation/native` e `@react-navigation/native-stack` | Navegação em pilha entre as telas |
| `react-native-screens` e `react-native-safe-area-context` | Dependências da navegação (telas nativas e áreas seguras da tela) |
| `@react-native-async-storage/async-storage` | Persistência local do nome do jogador e do ranking |
| `react-dom`, `react-native-web` e `@expo/metro-runtime` | Apenas para abrir o app no navegador (`npm run web`) |

## Persistência

Os dados ficam no **AsyncStorage**, no próprio aparelho, em duas chaves:

- `@quiz:jogador`: nome do jogador (texto);
- `@quiz:ranking`: lista em JSON das partidas (nome, pontos, acertos, total, categoria, dificuldade e data).

O armazenamento local foi escolhido porque o ranking compara pessoas que usam o mesmo aparelho, os dados são pequenos e não há contas de usuário. Assim o app também mostra o ranking sem internet.