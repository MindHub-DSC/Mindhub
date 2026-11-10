import type { ReconhecimentoDeUsuario } from '../publico/reconhecimento-de-usuario.js';
import type { UsuariosRepositorio } from '../dominio/usuarios.repositorio.js';

/** Implementação da interface pública de C1 sobre o repositório de usuários. */
export class ReconhecerUsuario implements ReconhecimentoDeUsuario {
  constructor(private readonly usuarios: UsuariosRepositorio) {}

  reconhecer(usuarioId: string): Promise<boolean> {
    return this.usuarios.existe(usuarioId);
  }
}
