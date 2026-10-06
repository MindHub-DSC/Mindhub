import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { idSchema } from '../common/schemas.js';
import {
  criarSolicitacaoSchema,
  listarSolicitacoesSchema,
} from './solicitacao.dto.js';
import type {
  CriarSolicitacaoDto,
  ListarSolicitacoesDto,
} from './solicitacao.dto.js';
import { SolicitacoesService } from './solicitacoes.service.js';

@Controller('api/solicitacoes')
export class SolicitacoesController {
  constructor(
    @Inject(SolicitacoesService)
    private readonly solicitacoes: SolicitacoesService,
  ) {}

  @Post()
  criar(@Body({ schema: criarSolicitacaoSchema }) dados: CriarSolicitacaoDto) {
    return this.solicitacoes.criar(dados);
  }

  @Get()
  listar(
    @Query({ schema: listarSolicitacoesSchema }) filtros: ListarSolicitacoesDto,
  ) {
    return this.solicitacoes.listar(filtros);
  }

  @Get(':id')
  buscar(@Param('id', { schema: idSchema }) id: string) {
    return this.solicitacoes.buscar(id);
  }
}
