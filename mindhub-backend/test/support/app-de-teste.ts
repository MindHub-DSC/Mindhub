import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import type { App } from 'supertest/types.js';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module.js';

/**
 * Sobe a aplicação Nest real (com TypeORM e PostgreSQL de teste), sem abrir
 * porta: o supertest chama o servidor HTTP em memória.
 */
export async function iniciarAppDeTeste(): Promise<{
  app: INestApplication<App>;
  banco: DataSource;
}> {
  const modulo = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = modulo.createNestApplication<INestApplication<App>>();
  await app.init();
  return { app, banco: app.get(DataSource) };
}
