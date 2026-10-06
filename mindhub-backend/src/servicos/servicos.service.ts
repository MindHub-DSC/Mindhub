import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { EspecialistasService } from '../especialistas/especialistas.service.js';
import type {
  CriarServicoDto,
  ListarServicosDto,
  Servico,
} from './servico.dto.js';

@Injectable()
export class ServicosService {
  private readonly servicos = new Map<string, Servico>();
  constructor(
    @Inject(EspecialistasService)
    private readonly especialistas: EspecialistasService,
  ) {}

  criar(dados: CriarServicoDto): Servico {
    this.especialistas.exigirAtivo(dados.especialistaId);
    const servico: Servico = {
      ...dados,
      id: randomUUID(),
      criadoEm: new Date().toISOString(),
    };
    this.servicos.set(servico.id, structuredClone(servico));
    return structuredClone(servico);
  }

  listar(filtros: ListarServicosDto): Servico[] {
    return structuredClone(
      [...this.servicos.values()].filter(
        (servico) =>
          (!filtros.especialistaId ||
            servico.especialistaId === filtros.especialistaId) &&
          (!filtros.modeloContratacao ||
            servico.modeloContratacao === filtros.modeloContratacao),
      ),
    );
  }

  buscar(id: string): Servico {
    const servico = this.servicos.get(id);
    if (!servico) throw new NotFoundException('Serviço não encontrado.');
    return structuredClone(servico);
  }
}
