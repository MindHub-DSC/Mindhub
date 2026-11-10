/** O conteúdo do perfil viola uma invariante (descrição ou especialidades). */
export class PerfilInvalido extends Error {
  constructor(readonly motivo: string) {
    super(motivo);
    this.name = 'PerfilInvalido';
  }
}

/**
 * RN-UC02-01: o Usuário já possui um Perfil de Especialista, em qualquer
 * situação. A mensagem não revela se o perfil existente está suspenso.
 */
export class PerfilJaExistente extends Error {
  constructor() {
    super('O usuário já possui perfil de especialista.');
    this.name = 'PerfilJaExistente';
  }
}
