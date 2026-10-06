import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { CriarUsuarioDto, Usuario } from './usuario.dto.js';

@Injectable()
export class UsuariosService {
  private readonly usuarios = new Map<string, Usuario>();

  criar(dados: CriarUsuarioDto): Usuario {
    if (
      [...this.usuarios.values()].some(
        (usuario) => usuario.email === dados.email,
      )
    ) {
      throw new ConflictException('Já existe um usuário com este email.');
    }
    const usuario: Usuario = {
      ...dados,
      id: randomUUID(),
      situacao: 'ATIVO',
      criadoEm: new Date().toISOString(),
    };
    this.usuarios.set(usuario.id, usuario);
    return structuredClone(usuario);
  }

  listar(): Usuario[] {
    return structuredClone([...this.usuarios.values()]);
  }

  buscar(id: string): Usuario {
    const usuario = this.usuarios.get(id);
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    return structuredClone(usuario);
  }
}
