module.exports = {
  extends: [
    '@nextgis/eslint-config',
    'plugin:vue/recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'vue/script-setup-uses-vars': 'error',
    'vue/no-mutating-props': 'error',
    'vue/require-default-prop': 'off',
    'vue/no-v-html': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'prefer-rest-params': 0,
    '@typescript-eslint/no-use-before-define': 0,
  },
};
