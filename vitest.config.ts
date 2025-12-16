import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/**',
      '**/.{git,cache}/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.config.*',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@layouts': resolve(fileURLToPath(import.meta.url), '../src/layouts'),
      '@components': resolve(
        fileURLToPath(import.meta.url),
        '../src/components'
      ),
      '@i18n': resolve(fileURLToPath(import.meta.url), '../src/i18n'),
      '@custom-types': resolve(fileURLToPath(import.meta.url), '../src/types'),
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
});
