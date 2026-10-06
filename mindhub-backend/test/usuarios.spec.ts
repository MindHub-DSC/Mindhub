import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';

describe('Cadastrar usuário', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const modulo = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = modulo.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('cadastra com nome e email normalizados e retorna um ID', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios')
      .send({ nome: '  Ana  ', email: '  ANA@example.com  ' })
      .expect(201);
    expect(resposta.body).toEqual({
      id: expect.any(String),
      nome: 'Ana',
      email: 'ana@example.com',
    });
  });

  it('impede repetir o email de um usuário já cadastrado', async () => {
    await request(app.getHttpServer())
      .post('/usuarios')
      .send({ nome: 'Ana', email: 'ana@example.com' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/usuarios')
      .send({ nome: 'Outra pessoa', email: 'ANA@example.com' })
      .expect(409);
  });

  it.each([
    { nome: ' ', email: 'ana@example.com' },
    { nome: 'Ana', email: 'invalido' },
    { nome: 'Ana', email: 'ana@example.com', papel: 'ADMINISTRADOR' },
  ])('recusa dados inválidos: %j', async (dados) => {
    await request(app.getHttpServer())
      .post('/usuarios')
      .send(dados)
      .expect(400);
  });
});
