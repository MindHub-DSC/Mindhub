import { randomUUID } from 'node:crypto';
import type { Repository } from 'typeorm';
import { ArmazenamentoIndisponivel } from '../../../src/compartilhado/infra/erros-de-banco.js';
import { Servico } from '../../../src/oferta/dominio/servico.js';
import type { ServicoOrmEntity } from '../../../src/oferta/infra/servico.orm-entity.js';
import { ServicosTypeOrmRepositorio } from '../../../src/oferta/infra/servicos.typeorm-repositorio.js';

/**
 * Critério 4 da #37: falha técnica do armazenamento vira
 * ArmazenamentoIndisponivel. O Repository do TypeORM é um dublê que falha
 * como o driver pg falha com o servidor fora do ar (código ECONNREFUSED);
 * a classificação do erro é a mesma de compartilhado/infra/erros-de-banco.
 */
describe('ServicosTypeOrmRepositorio — falha de conexão (sem banco)', () => {
  const quedaDeConexao = Object.assign(new Error('connect ECONNREFUSED'), {
    code: 'ECONNREFUSED',
  });

  const ormQueFalha = {
    insert: () => Promise.reject(quedaDeConexao),
    findOneBy: () => Promise.reject(quedaDeConexao),
    find: () => Promise.reject(quedaDeConexao),
  } as unknown as Repository<ServicoOrmEntity>;

  const repositorio = new ServicosTypeOrmRepositorio(ormQueFalha);

  it.each([
    [
      'adicionar',
      () =>
        repositorio.adicionar(
          Servico.publicar({
            perfilId: randomUUID(),
            titulo: 'Mentoria',
            descricao: 'Discovery',
            modeloContratacao: 'SOB_PROPOSTA',
            agora: new Date(),
          }),
        ),
    ],
    ['buscarPorId', () => repositorio.buscarPorId(randomUUID())],
    ['listarPorPerfil', () => repositorio.listarPorPerfil(randomUUID())],
  ])(
    '%s: queda de conexão vira ArmazenamentoIndisponivel',
    async (_op, chamar) => {
      const erro = await chamar().catch((e: unknown) => e);

      expect(erro).toBeInstanceOf(ArmazenamentoIndisponivel);
      expect((erro as ArmazenamentoIndisponivel).cause).toBe(quedaDeConexao);
    },
  );
});
