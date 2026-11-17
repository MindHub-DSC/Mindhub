import type { Repository } from 'typeorm';
import type { Servico } from '../dominio/servico.js';
import type { ServicosRepositorio } from '../dominio/servicos.repositorio.js';
import type { ServicoOrmEntity } from './servico.orm-entity.js';

/**
 * Adaptador TypeORM da porta ServicosRepositorio (#37).
 * Contrato da fase RED: ainda sem comportamento.
 */
export class ServicosTypeOrmRepositorio implements ServicosRepositorio {
  constructor(private readonly orm: Repository<ServicoOrmEntity>) {}

  adicionar(_servico: Servico): Promise<void> {
    return Promise.reject(
      new Error('ServicosTypeOrmRepositorio ainda não implementado.'),
    );
  }

  buscarPorId(_id: string): Promise<Servico | null> {
    return Promise.reject(
      new Error('ServicosTypeOrmRepositorio ainda não implementado.'),
    );
  }

  listarPorPerfil(_perfilId: string): Promise<Servico[]> {
    return Promise.reject(
      new Error('ServicosTypeOrmRepositorio ainda não implementado.'),
    );
  }
}
