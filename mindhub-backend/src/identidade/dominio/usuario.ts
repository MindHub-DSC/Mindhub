import { randomUUID } from 'node:crypto';

export interface DadosDoUsuario {
  id: string;
  nome: string;
  email: string;
}

/**
 * Identidade de uma pessoa na plataforma (C1). Os papéis de cliente e de
 * especialista pertencem a este mesmo Usuário.
 * Nome e email chegam já normalizados pela fronteira (UC01).
 */
export class Usuario {
  private constructor(
    readonly id: string,
    readonly nome: string,
    readonly email: string,
  ) {}

  /** UC01: cria um novo usuário com identidade própria. */
  static cadastrar(dados: { nome: string; email: string }): Usuario {
    return new Usuario(randomUUID(), dados.nome, dados.email);
  }

  /** Restaura um usuário já registrado, sem gerar nova identidade. */
  static reconstituir(dados: DadosDoUsuario): Usuario {
    return new Usuario(dados.id, dados.nome, dados.email);
  }
}
