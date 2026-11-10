import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import type { DataSource } from 'typeorm';
import { iniciarAppDeTeste } from '../support/app-de-teste.js';
import { limparDadosDosUsuarios } from '../support/limpeza.js';

/** UC01 — POST /usuarios, agora gravando no PostgreSQL de testes. */
describe('UC01 — Cadastrar usuário (E2E, PostgreSQL)', () => {
  let app: INestApplication<App>;
  let banco: DataSource;
  const usuariosDoTeste: string[] = [];

  beforeAll(async () => {
    ({ app, banco } = await iniciarAppDeTeste());
  });

  afterEach(async () => {
    await limparDadosDosUsuarios(banco, usuariosDoTeste.splice(0));
  });

  afterAll(async () => {
    await app.close();
  });

  /** Email único por execução: nada colide com dados de outras execuções. */
  const emailUnico = () => `ana-${randomUUID()}@example.com`;

  async function postarUsuario(corpo: object) {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios')
      .send(corpo);
    if (resposta.status === 201) usuariosDoTeste.push(resposta.body.id);
    return resposta;
  }

  it('cadastra com nome e email normalizados, grava e retorna um ID', async () => {
    const email = emailUnico();
    const resposta = await postarUsuario({
      nome: '  Ana  ',
      email: `  ${email.toUpperCase()}  `,
    });

    expect(resposta.status).toBe(201);
    expect(resposta.body).toEqual({
      id: expect.any(String),
      nome: 'Ana',
      email,
    });
    const linhas = await banco.query(
      'SELECT nome, email FROM identidade.usuarios WHERE id = $1',
      [resposta.body.id],
    );
    expect(linhas).toEqual([{ nome: 'Ana', email }]);
  });

  it('impede repetir o email de um usuário já cadastrado (409)', async () => {
    const email = emailUnico();
    await postarUsuario({ nome: 'Ana', email }).then((r) =>
      expect(r.status).toBe(201),
    );

    const repetido = await postarUsuario({
      nome: 'Outra pessoa',
      email: email.toUpperCase(),
    });

    expect(repetido.status).toBe(409);
    expect(repetido.body.message).toBe('Já existe um usuário com este email.');
    const [{ total }] = await banco.query(
      'SELECT count(*)::int AS total FROM identidade.usuarios WHERE email = $1',
      [email],
    );
    expect(total).toBe(1);
  });

  it.each([
    { nome: ' ', email: 'ana@example.com' },
    { nome: 'Ana', email: 'invalido' },
    { nome: 'Ana', email: 'ana@example.com', papel: 'ADMINISTRADOR' },
  ])('recusa dados inválidos: %j', async (dados) => {
    expect((await postarUsuario(dados)).status).toBe(400);
  });
});
