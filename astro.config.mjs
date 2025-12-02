// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import astroI18next from 'astro-i18next';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), astroI18next()],
  vite: {
    plugins: [tailwindcss()],
  },
});
