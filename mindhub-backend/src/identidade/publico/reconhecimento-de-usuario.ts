/**
 * Interface pública de C1 (ADR-04). É o único arquivo de Identidade que
 * outros contextos podem importar: informa só se o usuário existe, sem
 * expor nome, email ou o tipo Usuario.
 */
export interface ReconhecimentoDeUsuario {
  /**
   * true se a referência corresponde a um Usuário cadastrado.
   * Falhas técnicas são lançadas como erro, nunca respondidas com false:
   * "não sei se existe" não é o mesmo que "não existe".
   */
  reconhecer(usuarioId: string): Promise<boolean>;
}

export const RECONHECIMENTO_DE_USUARIO = Symbol('ReconhecimentoDeUsuario');
