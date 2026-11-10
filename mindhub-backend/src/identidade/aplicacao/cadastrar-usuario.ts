import { Usuario } from '../dominio/usuario.js';
import type { UsuariosRepositorio } from '../dominio/usuarios.repositorio.js';

export interface CadastrarUsuarioCommand {
  nome: string;
  email: string;
}

/**
 * UC01 — Cadastrar Usuário. Coordena criação e registro.
 * A unicidade do email é garantida pelo repositório (restrição única no
 * banco), que sinaliza EmailJaCadastrado; a tradução para HTTP fica na fronteira.
 */
export class CadastrarUsuario {
  constructor(private readonly usuarios: UsuariosRepositorio) {}

  async executar(comando: CadastrarUsuarioCommand): Promise<Usuario> {
    const usuario = Usuario.cadastrar(comando);
    await this.usuarios.adicionar(usuario);
    return usuario;
  }
}
