import type { Repository } from 'typeorm';
import {
  traduzirFalhaDeConexao,
  violouRestricaoUnica,
} from '../../compartilhado/infra/erros-de-banco.js';
import { PerfilJaExistente } from '../dominio/erros.js';
import type { PerfilEspecialista } from '../dominio/perfil-especialista.js';
import type { PerfisEspecialistaRepositorio } from '../dominio/perfis-especialista.repositorio.js';
import { PerfilEspecialistaMapper } from './perfil-especialista.mapper.js';
import type { PerfilEspecialistaOrmEntity } from './perfil-especialista.orm-entity.js';

/**
 * Adaptador TypeORM da porta PerfisEspecialistaRepositorio.
 * A unicidade é garantida pela restrição uq_perfis_especialista_usuario:
 * não há consulta antes do INSERT, então não existe janela de concorrência.
 */
export class PerfisEspecialistaTypeOrmRepositorio implements PerfisEspecialistaRepositorio {
  constructor(private readonly orm: Repository<PerfilEspecialistaOrmEntity>) {}

  async adicionar(perfil: PerfilEspecialista): Promise<void> {
    try {
      // insert, e não save: save faria UPDATE se o id já existisse.
      await this.orm.insert(PerfilEspecialistaMapper.paraOrm(perfil));
    } catch (erro) {
      // Detecção técnica; o significado (PerfilJaExistente) é do domínio.
      if (violouRestricaoUnica(erro, 'uq_perfis_especialista_usuario')) {
        throw new PerfilJaExistente();
      }
      throw traduzirFalhaDeConexao(erro);
    }
  }

  async buscarPorUsuario(
    usuarioId: string,
  ): Promise<PerfilEspecialista | null> {
    let registro: PerfilEspecialistaOrmEntity | null;
    try {
      registro = await this.orm.findOneBy({ usuarioId });
    } catch (erro) {
      throw traduzirFalhaDeConexao(erro);
    }
    return registro ? PerfilEspecialistaMapper.paraDominio(registro) : null;
  }
}
