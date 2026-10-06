import { ConflictException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { CriarUsuarioDto } from './criar-usuario.dto.js';

export type Usuario = CriarUsuarioDto & { id: string };

@Injectable()
export class UsuariosService {
  private readonly usuarios: Usuario[] = [];

  cadastrar(dados: CriarUsuarioDto): Usuario {
    if (this.usuarios.some((usuario) => usuario.email === dados.email)) {
      throw new ConflictException('Já existe um usuário com este email.');
    }
    const usuario = { id: randomUUID(), ...dados };
    this.usuarios.push(usuario);
    return { ...usuario };
  }
}
