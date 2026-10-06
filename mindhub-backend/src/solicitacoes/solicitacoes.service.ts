import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { EspecialistasService } from '../especialistas/especialistas.service.js';
import { ServicosService } from '../servicos/servicos.service.js';
import type {
  CriarSolicitacaoDto,
  ListarSolicitacoesDto,
  Solicitacao,
} from './solicitacao.dto.js';

@Injectable()
export class SolicitacoesService {
  private readonly solicitacoes = new Map<string, Solicitacao>();
  constructor(
    @Inject(UsuariosService) private readonly usuarios: UsuariosService,
    @Inject(EspecialistasService)
    private readonly especialistas: EspecialistasService,
    @Inject(ServicosService) private readonly servicos: ServicosService,
  ) {}

  criar(dados: CriarSolicitacaoDto): Solicitacao {
    this.usuarios.buscar(dados.clienteId);
    this.especialistas.exigirAtivo(dados.especialistaId);
    if (dados.servicoId) {
      const servico = this.servicos.buscar(dados.servicoId);
      if (servico.especialistaId !== dados.especialistaId) {
        throw new ConflictException(
          'O serviço deve pertencer ao especialista escolhido.',
        );
      }
      if (servico.modeloContratacao !== 'SOB_PROPOSTA') {
        throw new ConflictException(
          'Solicitações vinculadas a serviços exigem o modelo Sob Proposta.',
        );
      }
    }
    const solicitacao: Solicitacao = {
      ...dados,
      id: randomUUID(),
      criadoEm: new Date().toISOString(),
    };
    this.solicitacoes.set(solicitacao.id, solicitacao);
    return structuredClone(solicitacao);
  }

  listar(filtros: ListarSolicitacoesDto): Solicitacao[] {
    return structuredClone(
      [...this.solicitacoes.values()].filter(
        (solicitacao) =>
          (!filtros.clienteId || solicitacao.clienteId === filtros.clienteId) &&
          (!filtros.especialistaId ||
            solicitacao.especialistaId === filtros.especialistaId),
      ),
    );
  }

  buscar(id: string): Solicitacao {
    const solicitacao = this.solicitacoes.get(id);
    if (!solicitacao)
      throw new NotFoundException('Solicitação não encontrada.');
    return structuredClone(solicitacao);
  }
}
