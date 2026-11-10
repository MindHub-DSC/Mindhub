import { PerfilInvalido } from './erros.js';

export const MIN_ESPECIALIDADES = 1;
export const MAX_ESPECIALIDADES = 20;
export const MAX_CARACTERES_ESPECIALIDADE = 120;

/**
 * Lista de áreas em que o especialista declara atuar.
 * Invariantes: 1 a 20 itens; cada item com 1 a 120 caracteres após aparar;
 * sem repetição, sem diferenciar maiúsculas e minúsculas (D3).
 */
export class Especialidades {
  private constructor(private readonly itens: readonly string[]) {}

  static criar(itens: readonly string[]): Especialidades {
    const aparados = itens.map((item) => item.trim());

    if (aparados.length < MIN_ESPECIALIDADES) {
      throw new PerfilInvalido('Informe ao menos uma especialidade.');
    }
    if (aparados.length > MAX_ESPECIALIDADES) {
      throw new PerfilInvalido(
        `Informe no máximo ${MAX_ESPECIALIDADES} especialidades.`,
      );
    }
    for (const item of aparados) {
      if (item.length === 0 || item.length > MAX_CARACTERES_ESPECIALIDADE) {
        throw new PerfilInvalido(
          `Cada especialidade deve ter de 1 a ${MAX_CARACTERES_ESPECIALIDADE} caracteres.`,
        );
      }
    }
    const chaves = new Set(
      aparados.map((item) => item.toLocaleLowerCase('pt-BR')),
    );
    if (chaves.size !== aparados.length) {
      throw new PerfilInvalido('Especialidades repetidas não são permitidas.');
    }
    return new Especialidades(aparados);
  }

  get valores(): readonly string[] {
    return [...this.itens];
  }
}
