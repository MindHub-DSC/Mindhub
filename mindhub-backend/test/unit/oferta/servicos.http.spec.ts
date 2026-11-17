import { randomUUID } from 'node:crypto';
import { StandardSchemaValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { ArmazenamentoIndisponivelFilter } from '../../../src/compartilhado/http/armazenamento-indisponivel.filter.js';
import { ArmazenamentoIndisponivel } from '../../../src/compartilhado/infra/erros-de-banco.js';
import {
  AtorSemPerfil,
  PerfilSuspenso,
  PublicarServico,
} from '../../../src/oferta/aplicacao/publicar-servico.js';
import {
  CondicoesVigentesAusentes,
  ServicoInvalido,
} from '../../../src/oferta/dominio/erros.js';
import { Servico } from '../../../src/oferta/dominio/servico.js';
import { ServicosController } from '../../../src/oferta/http/servicos.controller.js';

/**
 * Fronteira HTTP do UC03 (#40) com o serviço de aplicação simulado:
 * roteamento, schema + pipe, serialização, delegação e tradução de erros.
 * Não usa banco nem o PublicarServico real.
 */
describe('POST /servicos (fronteira HTTP, serviço simulado)', () => {
  let app: INestApplication<App>;
  const publicarServico = { executar: vi.fn() };

  const usuarioId = randomUUID();
  const corpoValido = {
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
  };

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      controllers: [ServicosController],
      providers: [{ provide: PublicarServico, useValue: publicarServico }],
    }).compile();
    app = modulo.createNestApplication<INestApplication<App>>();
    // Reproduz o que o AppModule registra globalmente (APP_PIPE e APP_FILTER).
    app.useGlobalPipes(new StandardSchemaValidationPipe());
    app.useGlobalFilters(new ArmazenamentoIndisponivelFilter());
    await app.init();
  });

  beforeEach(() => {
    publicarServico.executar.mockReset();
  });

  afterAll(async () => {
    await app.close();
  });

  function publicar(corpo: object) {
    return request(app.getHttpServer()).post('/servicos').send(corpo);
  }

  // Teste 1 (Refinamento 3) — critério 1 da #40.
  it('requisição válida: 201, delega ao serviço e devolve o Serviço publicado', async () => {
    const servico = Servico.publicar({
      perfilId: randomUUID(),
      titulo: corpoValido.titulo,
      descricao: corpoValido.descricao,
      modeloContratacao: 'RESERVA_DIRETA',
      condicoes: corpoValido.condicoes,
      agora: new Date(),
    });
    publicarServico.executar.mockResolvedValue(servico);

    const resposta = await publicar(corpoValido).expect(201);

    expect(publicarServico.executar).toHaveBeenCalledTimes(1);
    expect(publicarServico.executar).toHaveBeenCalledWith(corpoValido);
    expect(resposta.body).toEqual({
      id: servico.id,
      perfilId: servico.perfilId,
      titulo: 'Mentoria de produto',
      descricao: 'Sessões de discovery',
      modeloContratacao: 'RESERVA_DIRETA',
      condicoes: corpoValido.condicoes,
      situacao: 'PUBLICADO',
    });
  });

  // Teste 2 (Refinamento 3) — critério 2 da #40 (FE-01).
  it.each([
    ['campo não previsto', { ...corpoValido, situacao: 'PUBLICADO' }],
    ['usuarioId fora do formato', { ...corpoValido, usuarioId: 'abc' }],
    ['título não é texto', { ...corpoValido, titulo: 123 }],
    ['modelo desconhecido', { ...corpoValido, modeloContratacao: 'LEILAO' }],
    [
      'condição com tipo errado',
      { ...corpoValido, condicoes: { ...corpoValido.condicoes, preco: '150' } },
    ],
    ['corpo vazio', {}],
  ])(
    'entrada inválida (%s): 400 sem chamar o serviço',
    async (_caso, corpo) => {
      const resposta = await publicar(corpo).expect(400);

      expect(resposta.body.statusCode).toBe(400);
      expect(resposta.body.error).toBe('Bad Request');
      expect(publicarServico.executar).not.toHaveBeenCalled();
    },
  );

  // Critérios 3 e 4 da #40 (D-UC03-07): códigos distintos e estáveis.
  it.each([
    ['ator sem perfil', new AtorSemPerfil(), 404],
    ['perfil suspenso', new PerfilSuspenso(), 403],
    ['Reserva Direta sem condições', new CondicoesVigentesAusentes(), 422],
    [
      'dado de domínio inválido',
      new ServicoInvalido('O título: informe ao menos 1 caractere.'),
      400,
    ],
    [
      'armazenamento indisponível',
      new ArmazenamentoIndisponivel({ cause: new Error('ECONNREFUSED') }),
      503,
    ],
  ])('%s → responde com o status mapeado', async (_caso, erro, status) => {
    publicarServico.executar.mockRejectedValue(erro);

    const resposta = await publicar(corpoValido).expect(status);

    expect(resposta.body.statusCode).toBe(status);
    expect(typeof resposta.body.message).toBe('string');
    // 503 usa mensagem genérica, sem detalhes da infraestrutura.
    expect(resposta.body.message).toBe(
      status === 503
        ? 'Serviço temporariamente indisponível. Tente novamente.'
        : erro.message,
    );
  });
});
