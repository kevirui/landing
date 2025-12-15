import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactCompiler from 'eslint-plugin-react-compiler';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import astroParser from 'astro-eslint-parser';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...astro.configs.recommended,
  {
    ignores: ['node_modules/**', 'dist/**', '.astro/**', '.vercel/**'],
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-compiler': reactCompiler,
      prettier,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-compiler/react-compiler': 'warn',
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.astro'],
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        Astro: 'readonly',
        Fragment: 'readonly',
      },
    },
  },
  prettierConfig,
];
