// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

// Usar adaptador de Node.js para preview local, Vercel para producción
const isPreview = process.env.ASTRO_PREVIEW === 'true';

export default defineConfig({
  output: 'server',
  adapter: isPreview
    ? node({ mode: 'standalone' })
    : vercel({
        edgeMiddleware: false,
        functionPerRoute: false,
      }),
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
      // Ofuscación de nombres: convierte nombres de variables/funciones a letras cortas
      minifyIdentifiers: true, // Reduce nombres de variables a identificadores cortos (a, b, c, etc.)
      minifySyntax: true, // Minifica la sintaxis
      minifyWhitespace: true, // Elimina espacios en blanco
      legalComments: 'none', // Elimina todos los comentarios
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
