import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import * as parserVue from 'vue-eslint-parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import parserTypescript from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,cjs,ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/coverage/**'],
  },

  js.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: parserTypescript,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        console: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-undef': 'error',
    },
  },

  ...pluginVue.configs['flat/essential'],

  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: parserTypescript,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },

  {
    name: 'app/custom-rules',
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      semi: 'error',
      'prefer-const': 'error',
      'no-unused-vars': 'error',
      'prettier/prettier': 'error',
    },
  },

  prettierConfig,
]
