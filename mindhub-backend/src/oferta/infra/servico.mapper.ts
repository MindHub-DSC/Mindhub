import { ServicoInvalido } from '../dominio/erros.js';
import type { Servico } from '../dominio/servico.js';
import type { ServicoOrmEntity } from './servico.orm-entity.js';

/** O banco devolveu um registro que não forma um Serviço válido. */
export class RegistroDeServicoCorrompido extends Error {
  constructor(id: string, options: { cause: unknown }) {
    super(`Registro de Serviço inválido no armazenamento (id ${id}).`, options);
    this.name = 'RegistroDeServicoCorrompido';
  }
}

/** Tradução Servico ↔ ServicoOrmEntity. Contrato da fase RED. */
export const ServicoMapper = {
  paraOrm(_servico: Servico): ServicoOrmEntity {
    throw new ServicoInvalido('ServicoMapper ainda não implementado.');
  },
  paraDominio(_registro: ServicoOrmEntity): Servico {
    throw new ServicoInvalido('ServicoMapper ainda não implementado.');
  },
};
