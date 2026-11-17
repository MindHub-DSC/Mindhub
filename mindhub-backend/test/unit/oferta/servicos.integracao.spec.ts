import { StandardSchemaValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { ArmazenamentoIndisponivelFilter } from '../../../src/compartilhado/http/armazenamento-indisponivel.filter.js';
import { UsuarioOrmEntity } from '../../../src/identidade/infra/usuario.orm-entity.js';
import { PublicarServico } from '../../../src/oferta/aplicacao/publicar-servico.js';
import { PerfilEspecialista } from '../../../src/oferta/dominio/perfil-especialista.js';
import { PERFIS_ESPECIALISTA_REPOSITORIO } from '../../../src/oferta/dominio/perfis-especialista.repositorio.js';
import { SERVICOS_REPOSITORIO } from '../../../src/oferta/dominio/servicos.repositorio.js';
import { PerfilEspecialistaOrmEntity } from '../../../src/oferta/infra/perfil-especialista.orm-entity.js';
import { ServicosEmMemoria } from '../../../src/oferta/infra/servicos.em-memoria.js';
import { OfertaModule } from '../../../src/oferta/oferta.module.js';
import { PerfisEspecialistaEmMemoria } from '../../support/perfis-especialista.em-memoria.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/**
 * Teste integrado do backend do UC03 (Material 08, #40):
 * HTTP → ServicosController → PublicarServico → SERVICOS_REPOSITORIO →
 * ServicosEmMemoria, todos REAIS e resolvidos pelo OfertaModule.
 *
 * Nenhum mock de serviço ou de repositório de Serviços. Só o que depende do
 * PostgreSQL (fora do escopo do UC03 nesta etapa) é trocado:
 * - os dois tokens de repositório TypeORM, lidos apenas pelas fábricas dos
 *   adaptadores TypeORM, que este fluxo não usa;
 * - a porta de perfis (UC02), pela implementação em memória que cumpre a
 *   mesma suíte de contrato do adaptador TypeORM.
 */
describe('POST /servicos — integração do backend (OfertaModule real, sem banco)', () => {
  let app: INestApplication<App>;
  let servicos: ServicosEmMemoria;
  let perfilAtivo: PerfilEspecialista;

  beforeAll(async () => {
    const perfis = new PerfisEspecialistaEmMemoria();
    perfilAtivo = PerfilEspecialista.cadastrar({
      usuarioId: '7b1e2c55-3a4d-4f6e-8a9b-0c1d2e3f4a5b',
      descricao: 'Consultora de produto',
      especialidades: ['Discovery'],
      agora: new Date('2026-11-17T12:00:00.000Z'),
    });
    await perfis.adicionar(perfilAtivo);

    const modulo = await Test.createTestingModule({
      imports: [OfertaModule],
    })
      .overrideProvider(getRepositoryToken(PerfilEspecialistaOrmEntity))
      .useValue({})
      .overrideProvider(getRepositoryToken(UsuarioOrmEntity))
      .useValue({})
      .overrideProvider(PERFIS_ESPECIALISTA_REPOSITORIO)
      .useValue(perfis)
      .compile();

    app = modulo.createNestApplication<INestApplication<App>>();
    // Mesma configuração global do AppModule (APP_PIPE e APP_FILTER).
    app.useGlobalPipes(new StandardSchemaValidationPipe());
    app.useGlobalFilters(new ArmazenamentoIndisponivelFilter());
    await app.init();

    // O MESMO provider que o container injetou no PublicarServico.
    servicos = modulo.get<ServicosEmMemoria>(SERVICOS_REPOSITORIO);
  });

  afterAll(async () => {
    await app?.close();
  });

  function publicar(corpo: object) {
    return request(app.getHttpServer()).post('/servicos').send(corpo);
  }

  it('compõe o fluxo com os componentes reais do módulo', () => {
    expect(app.get(PublicarServico)).toBeInstanceOf(PublicarServico);
    expect(servicos).toBeInstanceOf(ServicosEmMemoria);
  });

  it('cenário válido: 201, devolve o Serviço e o registra no repositório em memória', async () => {
    const corpo = {
      usuarioId: perfilAtivo.usuarioId,
      titulo: 'Mentoria de produto',
      descricao: 'Sessões de discovery para times iniciantes',
      modeloContratacao: 'RESERVA_DIRETA',
      condicoes: {
        preco: 15000,
        moeda: 'BRL',
        duracaoMinutos: 60,
        modalidade: 'ONLINE',
      },
    };
    const antes = servicos.chamadasDeAdicionar;

    const resposta = await publicar(corpo).expect(201);

    // Resposta HTTP: identificador gerado e dados preservados.
    expect(resposta.body.id).toMatch(UUID);
    expect(resposta.body).toEqual({
      id: resposta.body.id,
      perfilId: perfilAtivo.id,
      titulo: corpo.titulo,
      descricao: corpo.descricao,
      modeloContratacao: 'RESERVA_DIRETA',
      condicoes: corpo.condicoes,
      situacao: 'PUBLICADO',
    });

    // Armazenamento: leitura pelo contrato da porta, no provider real.
    expect(servicos.chamadasDeAdicionar).toBe(antes + 1);
    const registrado = await servicos.buscarPorId(resposta.body.id);
    expect(registrado?.perfilId).toBe(perfilAtivo.id);
    expect(registrado?.titulo).toBe(corpo.titulo);
    expect(registrado?.condicoes).toEqual(corpo.condicoes);
    expect(registrado?.situacao).toBe('PUBLICADO');
    const doPerfil = await servicos.listarPorPerfil(perfilAtivo.id);
    expect(doPerfil.map((s) => s.id)).toContain(resposta.body.id);
  });

  it('cenário inválido: 400 na fronteira e nada registrado', async () => {
    const antes = servicos.chamadasDeAdicionar;
    const totalAntes = (await servicos.listarPorPerfil(perfilAtivo.id)).length;

    const resposta = await publicar({
      usuarioId: perfilAtivo.usuarioId,
      titulo: 'Mentoria',
      descricao: 'Discovery',
      modeloContratacao: 'SOB_PROPOSTA',
      preco: 100,
    }).expect(400);

    expect(resposta.body.statusCode).toBe(400);
    expect(resposta.body.error).toBe('Bad Request');
    expect(resposta.body.message).toEqual(['Unrecognized key: "preco"']);
    expect(servicos.chamadasDeAdicionar).toBe(antes);
    expect(await servicos.listarPorPerfil(perfilAtivo.id)).toHaveLength(
      totalAntes,
    );
  });

  it('recusa de domínio pelo serviço real: 422 e nada registrado', async () => {
    const antes = servicos.chamadasDeAdicionar;

    const resposta = await publicar({
      usuarioId: perfilAtivo.usuarioId,
      titulo: 'Mentoria',
      descricao: 'Discovery',
      modeloContratacao: 'RESERVA_DIRETA',
    }).expect(422);

    expect(resposta.body.message).toBe(
      'Reserva Direta exige condições vigentes: preço, moeda, duração e modalidade.',
    );
    expect(servicos.chamadasDeAdicionar).toBe(antes);
  });
});
