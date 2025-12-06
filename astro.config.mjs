// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@layouts': resolve(fileURLToPath(import.meta.url), '../src/layouts'),
        '@components': resolve(
          fileURLToPath(import.meta.url),
          '../src/components'
        ),
        '@i18n': resolve(fileURLToPath(import.meta.url), '../src/i18n'),
        '@types': resolve(fileURLToPath(import.meta.url), '../src/types'),
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
