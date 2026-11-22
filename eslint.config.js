// Configuração do ESLint recomendada pelo Expo (rode com: npx expo lint)
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([expoConfig, { ignores: ['dist/*'] }]);
