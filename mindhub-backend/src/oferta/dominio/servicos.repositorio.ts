import type { Servico } from './servico.js';

/**
 * Coleção de Serviços publicados (porta de C2, critério 6 da #36).
 * Tem uma implementação em memória (testes) e terá a TypeORM (#37); as duas
 * devem cumprir a mesma suíte de contrato.
 */
export interface ServicosRepositorio {
  /** Registra o Serviço. */
  adicionar(servico: Servico): Promise<void>;

  /** O Serviço com esse identificador, ou null. */
  buscarPorId(id: string): Promise<Servico | null>;

  /** Os Serviços do perfil, na ordem em que foram registrados. */
  listarPorPerfil(perfilId: string): Promise<Servico[]>;
}

export const SERVICOS_REPOSITORIO = Symbol('ServicosRepositorio');
