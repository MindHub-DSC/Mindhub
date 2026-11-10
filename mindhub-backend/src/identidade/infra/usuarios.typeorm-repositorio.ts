import type { Repository } from 'typeorm';
import {
  traduzirFalhaDeConexao,
  violouRestricaoUnica,
} from '../../compartilhado/infra/erros-de-banco.js';
import { EmailJaCadastrado } from '../dominio/email-ja-cadastrado.js';
import type { Usuario } from '../dominio/usuario.js';
import type { UsuariosRepositorio } from '../dominio/usuarios.repositorio.js';
import { UsuarioMapper } from './usuario.mapper.js';
import type { UsuarioOrmEntity } from './usuario.orm-entity.js';

/** Adaptador TypeORM da porta UsuariosRepositorio. */
export class UsuariosTypeOrmRepositorio implements UsuariosRepositorio {
  constructor(private readonly orm: Repository<UsuarioOrmEntity>) {}

  async adicionar(usuario: Usuario): Promise<void> {
    try {
      // insert, e não save: save atualizaria um registro existente com o mesmo id.
      await this.orm.insert(UsuarioMapper.paraOrm(usuario));
    } catch (erro) {
      if (violouRestricaoUnica(erro, 'uq_usuarios_email')) {
        throw new EmailJaCadastrado();
      }
      throw traduzirFalhaDeConexao(erro);
    }
  }

  async existe(id: string): Promise<boolean> {
    try {
      return await this.orm.existsBy({ id });
    } catch (erro) {
      throw traduzirFalhaDeConexao(erro);
    }
  }
}
