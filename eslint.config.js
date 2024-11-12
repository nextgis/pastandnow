// eslint.config.mjs

import pluginJs from '@eslint/js';
import vueConfigPrettier from '@vue/eslint-config-prettier';
import vueConfigTypescript from '@vue/eslint-config-typescript';
import prettier from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // js
  pluginJs.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
  // ts
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // vue
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    rules: {
      ...vueConfigTypescript.rules,
      ...vueConfigPrettier.rules,
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
        },
      ],
      'vue/multi-word-component-names': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/no-v-html': 'off',
      'vue/v-on-event-hyphenation': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'none',
          destructuredArrayIgnorePattern: '^_',
          vars: 'all',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    ignores: [
      'node_modules',
      '.nuxt',
      '.output',
      'dist',
      '@nextgis',
      'nextgisweb.d.ts',
    ],
  },
  // prettier
  prettier,
  {
    rules: {
      'prettier/prettier': ['warn', { singleQuote: true }],
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'warn',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // Regular (non-type) imports first
            // Built-in modules (e.g., fs, path, or other Node.js built-ins)
            ['^node:'],
            // External packages (e.g., react, lodash)
            ['^@?\\w'],
            // Parent imports (e.g., ../)
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Sibling imports (same directory)
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Index imports (e.g., ./index)
            ['^\\./?$'],
            // Type imports last, sorted by the same rules
            // Built-in type imports
            ['^node:.*\\u0000$'],
            // External package type imports (e.g., type imports from npm packages)
            ['^@?\\w.*\\u0000$'],
            // Parent directory type imports (e.g., ../types)
            ['^\\.\\.(?!/?$).*(\\u0000)$', '^\\.\\./?.*(\\u0000)$'],
            // Sibling directory type imports (e.g., ./types)
            ['^\\./(?=.*/)(?!/?$).*(\\u0000)$', '^\\.(?!/?$).*(\\u0000)$'],
            // Index file type imports
            ['^\\./?.*(\\u0000)$'],
          ],
        },
      ],
    },
  },
];
