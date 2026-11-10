import { Usuario } from '../dominio/usuario.js';
import { UsuarioOrmEntity } from './usuario.orm-entity.js';

/** Tradução Usuario ↔ UsuarioOrmEntity. Não aplica regras. */
export const UsuarioMapper = {
  paraOrm(usuario: Usuario): UsuarioOrmEntity {
    const registro = new UsuarioOrmEntity();
    registro.id = usuario.id;
    registro.nome = usuario.nome;
    registro.email = usuario.email;
    return registro;
  },

  paraDominio(registro: UsuarioOrmEntity): Usuario {
    return Usuario.reconstituir({
      id: registro.id,
      nome: registro.nome,
      email: registro.email,
    });
  },
};
