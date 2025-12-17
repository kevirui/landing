import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [react()],
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: 'esbuild',
      cssMinify: true,
    },
    esbuild: {
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
      legalComments: 'none',
    },
    resolve: {
      alias: {
        '@layouts': resolve(fileURLToPath(import.meta.url), '../src/layouts'),
        '@components': resolve(
          fileURLToPath(import.meta.url),
          '../src/components'
        ),
        '@i18n': resolve(fileURLToPath(import.meta.url), '../src/i18n'),
        '@custom-types': resolve(
          fileURLToPath(import.meta.url),
          '../src/types'
        ),
        '@utils': resolve(fileURLToPath(import.meta.url), '../src/utils'),
        '@hooks': resolve(fileURLToPath(import.meta.url), '../src/hooks'),
        '@contexts': resolve(fileURLToPath(import.meta.url), '../src/contexts'),
        '@services': resolve(fileURLToPath(import.meta.url), '../src/services'),
        '@store': resolve(fileURLToPath(import.meta.url), '../src/store'),
        '@styles': resolve(fileURLToPath(import.meta.url), '../src/styles'),
        '@assets': resolve(fileURLToPath(import.meta.url), '../src/assets'),
        '@pages': resolve(fileURLToPath(import.meta.url), '../src/pages'),
        '@public': resolve(fileURLToPath(import.meta.url), '../public'),
      },
    },
  },
});
