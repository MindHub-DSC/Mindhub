import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import type {
  AlterarSituacaoDto,
  CriarEspecialistaDto,
  Especialista,
} from './especialista.dto.js';

@Injectable()
export class EspecialistasService {
  private readonly especialistas = new Map<string, Especialista>();
  constructor(
    @Inject(UsuariosService) private readonly usuarios: UsuariosService,
  ) {}

  criar(dados: CriarEspecialistaDto): Especialista {
    this.usuarios.buscar(dados.usuarioId);
    if (
      [...this.especialistas.values()].some(
        (perfil) => perfil.usuarioId === dados.usuarioId,
      )
    ) {
      throw new ConflictException(
        'O usuário já possui um perfil de especialista.',
      );
    }
    const especialista: Especialista = {
      ...dados,
      id: randomUUID(),
      situacao: 'ATIVO',
      criadoEm: new Date().toISOString(),
    };
    this.especialistas.set(especialista.id, structuredClone(especialista));
    return structuredClone(especialista);
  }

  listar(): Especialista[] {
    return structuredClone([...this.especialistas.values()]);
  }

  buscar(id: string): Especialista {
    const especialista = this.especialistas.get(id);
    if (!especialista)
      throw new NotFoundException('Perfil de especialista não encontrado.');
    return structuredClone(especialista);
  }

  exigirAtivo(id: string): Especialista {
    const especialista = this.buscar(id);
    if (especialista.situacao !== 'ATIVO') {
      throw new ConflictException(
        'Somente especialistas ativos podem publicar serviços ou receber solicitações.',
      );
    }
    return especialista;
  }

  alterarSituacao(id: string, dados: AlterarSituacaoDto): Especialista {
    const especialista = { ...this.buscar(id), situacao: dados.situacao };
    this.especialistas.set(id, especialista);
    return structuredClone(especialista);
  }
}
