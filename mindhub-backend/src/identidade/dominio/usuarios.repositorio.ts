import type { Usuario } from './usuario.js';

/** Porta de persistência de usuários (interna a C1). */
export interface UsuariosRepositorio {
  /** Registra o usuário. Falha com EmailJaCadastrado se o email já existir. */
  adicionar(usuario: Usuario): Promise<void>;
  /** Informa se existe usuário com este identificador. */
  existe(id: string): Promise<boolean>;
}

export const USUARIOS_REPOSITORIO = Symbol('UsuariosRepositorio');
