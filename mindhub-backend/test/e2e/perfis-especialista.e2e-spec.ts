import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import type { DataSource } from 'typeorm';
import { iniciarAppDeTeste } from '../support/app-de-teste.js';
import { limparDadosDosUsuarios } from '../support/limpeza.js';

/**
 * UC02 — POST /especialistas de ponta a ponta:
 * HTTP → controller → aplicação → domínio → portas → TypeORM → PostgreSQL.
 * Cada cenário cria o próprio usuário pela API (UC01) e, no fim, apaga só
 * os dados desse usuário. O estado é relido direto no banco.
 */
describe('UC02 — Cadastrar Perfil de Especialista (E2E, PostgreSQL)', () => {
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

  /** Prepara um usuário real pelo UC01 (mecanismo legítimo de criação). */
  async function prepararUsuario(): Promise<string> {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios')
      .send({ nome: 'Ana', email: `e2e-${randomUUID()}@exemplo.test` })
      .expect(201);
    usuariosDoTeste.push(resposta.body.id);
    return resposta.body.id;
  }

  function cadastrarPerfil(corpo: object) {
    return request(app.getHttpServer()).post('/especialistas').send(corpo);
  }

  function perfisNoBanco(usuarioId: string) {
    return banco.query(
      `SELECT id, usuario_id, descricao, especialidades, situacao, criado_em
         FROM oferta.perfis_especialista WHERE usuario_id = $1`,
      [usuarioId],
    ) as Promise<Array<Record<string, unknown>>>;
  }

  const corpoValido = (usuarioId: string) => ({
    usuarioId,
    descricao: 'Consultora de produto com 10 anos em startups de saúde.',
    especialidades: ['Gestão de produto', ' Discovery ', 'Métricas'],
  });

  it('sucesso: 201 com o perfil ATIVO e o registro gravado no PostgreSQL', async () => {
    const usuarioId = await prepararUsuario();

    const resposta = await cadastrarPerfil(corpoValido(usuarioId));

    expect(resposta.status).toBe(201);
    expect(resposta.body).toEqual({
      id: expect.any(String),
      usuarioId,
      descricao: 'Consultora de produto com 10 anos em startups de saúde.',
      especialidades: ['Gestão de produto', 'Discovery', 'Métricas'],
      situacao: 'ATIVO',
      criadoEm: expect.any(String),
    });

    const [registro, ...outros] = await perfisNoBanco(usuarioId);
    expect(outros).toHaveLength(0);
    expect(registro).toMatchObject({
      id: resposta.body.id,
      usuario_id: usuarioId,
      especialidades: ['Gestão de produto', 'Discovery', 'Métricas'],
      situacao: 'ATIVO',
    });
    expect((registro.criado_em as Date).toISOString()).toBe(
      resposta.body.criadoEm,
    );
  });

  it('usuário não reconhecido: 422 e nada gravado', async () => {
    const inexistente = randomUUID();
    usuariosDoTeste.push(inexistente);

    const resposta = await cadastrarPerfil(corpoValido(inexistente));

    expect(resposta.status).toBe(422);
    expect(resposta.body).toEqual({
      statusCode: 422,
      message: 'Usuário não reconhecido.',
    });
    expect(await perfisNoBanco(inexistente)).toHaveLength(0);
  });

  it('perfil já existente: 409 e o primeiro perfil continua igual', async () => {
    const usuarioId = await prepararUsuario();
    const primeiro = await cadastrarPerfil(corpoValido(usuarioId)).expect(201);

    const segundo = await cadastrarPerfil({
      ...corpoValido(usuarioId),
      descricao: 'Tentativa de sobrescrever',
    });

    expect(segundo.status).toBe(409);
    expect(segundo.body.message).toBe(
      'O usuário já possui perfil de especialista.',
    );
    const registros = await perfisNoBanco(usuarioId);
    expect(registros).toHaveLength(1);
    expect(registros[0]).toMatchObject({
      id: primeiro.body.id,
      descricao: 'Consultora de produto com 10 anos em startups de saúde.',
    });
  });

  it('duas requisições simultâneas: uma 201, outra 409, um único registro', async () => {
    const usuarioId = await prepararUsuario();

    const respostas = await Promise.all([
      cadastrarPerfil(corpoValido(usuarioId)),
      cadastrarPerfil(corpoValido(usuarioId)),
    ]);

    expect(respostas.map((r) => r.status).sort((a, b) => a - b)).toEqual([
      201, 409,
    ]);
    expect(await perfisNoBanco(usuarioId)).toHaveLength(1);
  });

  it('especialidades repetidas (D3): 400 do domínio e nada gravado', async () => {
    const usuarioId = await prepararUsuario();

    const resposta = await cadastrarPerfil({
      ...corpoValido(usuarioId),
      especialidades: ['Discovery', 'discovery'],
    });

    expect(resposta.status).toBe(400);
    expect(resposta.body.message).toBe(
      'Especialidades repetidas não são permitidas.',
    );
    expect(await perfisNoBanco(usuarioId)).toHaveLength(0);
  });

  it.each([
    ['campo não previsto (situacao)', { situacao: 'SUSPENSO' }],
    ['usuarioId fora do formato UUID', { usuarioId: '123' }],
    ['especialidades que não são lista', { especialidades: 'Discovery' }],
  ])(
    'formato inválido — %s: 400 na fronteira e nada gravado',
    async (_caso, alteracao) => {
      const usuarioId = await prepararUsuario();

      const resposta = await cadastrarPerfil({
        ...corpoValido(usuarioId),
        ...alteracao,
      });

      expect(resposta.status).toBe(400);
      expect(await perfisNoBanco(usuarioId)).toHaveLength(0);
    },
  );

  it('a resposta de erro não expõe SQL, stack nem detalhes internos', async () => {
    const usuarioId = await prepararUsuario();
    await cadastrarPerfil(corpoValido(usuarioId)).expect(201);

    const resposta = await cadastrarPerfil(corpoValido(usuarioId)).expect(409);

    const texto = JSON.stringify(resposta.body);
    expect(texto).not.toMatch(/INSERT|uq_perfis|duplicate key|stack|23505/i);
  });
});
