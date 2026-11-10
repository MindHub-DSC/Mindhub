import { defineConfig } from 'vitest/config';

// Testes unitários: rodam sem banco e sem Docker (pnpm test).
// Os testes com PostgreSQL ficam em vitest.config.e2e.ts (pnpm test:e2e).
export default defineConfig({
  test: {
    globals: true,
    include: ['test/unit/**/*.spec.ts'],
  },
});
