import type { Servico } from '../../src/oferta/dominio/servico.js';
import type { ServicosRepositorio } from '../../src/oferta/dominio/servicos.repositorio.js';

/**
 * Implementação em memória da porta ServicosRepositorio, só para testes.
 * Contrato do critério 6 da #36; ainda sem comportamento (RED).
 */
export class ServicosEmMemoria implements ServicosRepositorio {
  adicionar(_servico: Servico): Promise<void> {
    return Promise.resolve();
  }

  buscarPorId(_id: string): Promise<Servico | null> {
    return Promise.resolve(null);
  }

  listarPorPerfil(_perfilId: string): Promise<Servico[]> {
    return Promise.resolve([]);
  }
}
