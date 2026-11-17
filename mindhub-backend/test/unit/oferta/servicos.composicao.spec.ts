import type { Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PublicarServico } from '../../../src/oferta/aplicacao/publicar-servico.js';
import {
  PERFIS_ESPECIALISTA_REPOSITORIO,
  type PerfisEspecialistaRepositorio,
} from '../../../src/oferta/dominio/perfis-especialista.repositorio.js';
import {
  SERVICOS_REPOSITORIO,
  type ServicosRepositorio,
} from '../../../src/oferta/dominio/servicos.repositorio.js';
import { ServicosController } from '../../../src/oferta/http/servicos.controller.js';
import { ServicosEmMemoria } from '../../../src/oferta/infra/servicos.em-memoria.js';
import { PerfisEspecialistaEmMemoria } from '../../support/perfis-especialista.em-memoria.js';

/**
 * Diagnóstico de composição (Material 08, Fase 9), em contexto ISOLADO:
 * monta um módulo de teste com o controller e o PublicarServico reais, nas
 * mesmas formas de provider do OfertaModule, variando só o provider do
 * repositório de Serviços. O OfertaModule de produção não é tocado.
 */
describe('Composição do PublicarServico — diagnóstico de injeção (isolado)', () => {
  /** Igual ao provider do OfertaModule. */
  const publicarServico: Provider = {
    provide: PublicarServico,
    useFactory: (
      perfis: PerfisEspecialistaRepositorio,
      servicos: ServicosRepositorio,
    ) => new PublicarServico(perfis, servicos),
    inject: [PERFIS_ESPECIALISTA_REPOSITORIO, SERVICOS_REPOSITORIO],
  };
  const perfis: Provider = {
    provide: PERFIS_ESPECIALISTA_REPOSITORIO,
    useValue: new PerfisEspecialistaEmMemoria(),
  };

  function compilar(providers: Provider[]) {
    return Test.createTestingModule({
      controllers: [ServicosController],
      providers,
    }).compile();
  }

  it('sem provider para SERVICOS_REPOSITORIO: o Nest não resolve o PublicarServico', async () => {
    await expect(compilar([perfis, publicarServico])).rejects.toThrow(
      "Nest can't resolve dependencies of the PublicarServico (Symbol(PerfisEspecialistaRepositorio), ?). Please make sure that the argument Symbol(ServicosRepositorio) at index [1] is available in the RootTestModule module.",
    );
  });

  it('implementação registrada pela classe, e não pelo token: mesmo erro', async () => {
    // Erro comum: providers: [ServicosEmMemoria] registra o token
    // ServicosEmMemoria, mas o PublicarServico pede SERVICOS_REPOSITORIO.
    const erro: unknown = await compilar([
      perfis,
      ServicosEmMemoria,
      publicarServico,
    ]).catch((e: unknown) => e);

    // A exceção não é exportada pelo @nestjs/core; confere-se pelo nome da
    // classe e pelo contexto estruturado que o Nest anexa ao erro.
    expect((erro as object).constructor.name).toBe(
      'UnknownDependenciesException',
    );
    expect(erro).toMatchObject({
      type: 'PublicarServico',
      context: { index: 1, name: SERVICOS_REPOSITORIO },
    });
  });

  it('correção: associar o token à implementação compõe o fluxo', async () => {
    const modulo = await compilar([
      perfis,
      { provide: SERVICOS_REPOSITORIO, useClass: ServicosEmMemoria },
      publicarServico,
    ]);

    expect(modulo.get(PublicarServico)).toBeInstanceOf(PublicarServico);
    expect(modulo.get(SERVICOS_REPOSITORIO)).toBeInstanceOf(ServicosEmMemoria);
    expect(modulo.get(ServicosController)).toBeInstanceOf(ServicosController);
    await modulo.close();
  });
});
