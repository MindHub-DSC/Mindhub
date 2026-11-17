import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import type { DataSource } from 'typeorm';
import { iniciarAppDeTeste } from '../support/app-de-teste.js';
import { limparDadosDosUsuarios } from '../support/limpeza.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/**
 * UC03 — POST /servicos de ponta a ponta (critério 5 da #40):
 * UC01 cria o usuário, UC02 cria o perfil ATIVO no PostgreSQL e o UC03
 * publica o Serviço. Os Serviços ainda ficam em memória (#37 pendente).
 */
describe('UC03 — Publicar Serviço (E2E, jornada UC01 → UC02 → UC03)', () => {
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

  async function prepararEspecialista(): Promise<string> {
    const usuario = await request(app.getHttpServer())
      .post('/usuarios')
      .send({ nome: 'Ana', email: `e2e-${randomUUID()}@exemplo.test` })
      .expect(201);
    usuariosDoTeste.push(usuario.body.id);
    const perfil = await request(app.getHttpServer())
      .post('/especialistas')
      .send({
        usuarioId: usuario.body.id,
        descricao: 'Consultora de produto',
        especialidades: ['Discovery'],
      })
      .expect(201);
    expect(perfil.body.situacao).toBe('ATIVO');
    return usuario.body.id;
  }

  function publicar(corpo: object) {
    return request(app.getHttpServer()).post('/servicos').send(corpo);
  }

  it('especialista com perfil ATIVO publica Serviço em Reserva Direta (201)', async () => {
    const usuarioId = await prepararEspecialista();
    const [perfil] = await banco.query(
      'SELECT id FROM oferta.perfis_especialista WHERE usuario_id = $1',
      [usuarioId],
    );

    const resposta = await publicar({
      usuarioId,
      titulo: 'Mentoria de produto',
      descricao: 'Sessões de discovery',
      modeloContratacao: 'RESERVA_DIRETA',
      condicoes: {
        preco: 15000,
        moeda: 'BRL',
        duracaoMinutos: 60,
        modalidade: 'ONLINE',
      },
    }).expect(201);

    expect(resposta.body.id).toMatch(UUID);
    expect(resposta.body.perfilId).toBe(perfil.id);
    expect(resposta.body.modeloContratacao).toBe('RESERVA_DIRETA');
    expect(resposta.body.condicoes).toEqual({
      preco: 15000,
      moeda: 'BRL',
      duracaoMinutos: 60,
      modalidade: 'ONLINE',
    });
    expect(resposta.body.situacao).toBe('PUBLICADO');
  });

  it('usuário sem perfil recebe 404 e Reserva Direta sem condições recebe 422', async () => {
    const usuarioId = await prepararEspecialista();

    await publicar({
      usuarioId: randomUUID(),
      titulo: 'Mentoria',
      descricao: 'Discovery',
      modeloContratacao: 'SOB_PROPOSTA',
    }).expect(404);

    await publicar({
      usuarioId,
      titulo: 'Mentoria',
      descricao: 'Discovery',
      modeloContratacao: 'RESERVA_DIRETA',
    }).expect(422);
  });
});
