import type { PerfilEspecialista } from './perfil-especialista.js';

/**
 * Coleção de perfis de especialista da plataforma (porta de C2).
 * Não é uma tabela: tem uma implementação TypeORM e uma em memória (testes),
 * e as duas cumprem a mesma suíte de contrato.
 */
export interface PerfisEspecialistaRepositorio {
  /**
   * Registra o perfil, desde que o Usuário ainda não tenha nenhum (RN-UC02-01),
   * em qualquer situação. Verificar e gravar acontecem em uma única operação.
   * Falha com PerfilJaExistente e mantém o perfil anterior intacto.
   */
  adicionar(perfil: PerfilEspecialista): Promise<void>;

  /** O perfil do Usuário, ou null. */
  buscarPorUsuario(usuarioId: string): Promise<PerfilEspecialista | null>;
}

export const PERFIS_ESPECIALISTA_REPOSITORIO = Symbol(
  'PerfisEspecialistaRepositorio',
);
