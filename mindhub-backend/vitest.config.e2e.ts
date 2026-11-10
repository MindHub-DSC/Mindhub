import { defineConfig } from 'vitest/config';

// Testes de integração e E2E contra PostgreSQL real (pnpm test:e2e).
// Exigem o banco no ar (pnpm db:up). Operam SÓ no banco DB_TEST_NAME,
// cujo nome precisa terminar em _test (conferido em test/setup).
export default defineConfig({
  test: {
    globals: true,
    include: ['test/integracao/**/*.spec.ts', 'test/e2e/**/*.e2e-spec.ts'],
    globalSetup: ['./test/setup/global-setup.ts'],
    setupFiles: ['./test/setup/ambiente-de-teste.ts'],
    // Um arquivo por vez: os cenários isolam dados por ids aleatórios, mas
    // a execução sequencial deixa os logs e as falhas mais fáceis de ler.
    fileParallelism: false,
    hookTimeout: 30_000,
    testTimeout: 15_000,
  },
});
