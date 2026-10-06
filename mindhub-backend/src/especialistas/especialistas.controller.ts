import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { idSchema } from '../common/schemas.js';
import {
  alterarSituacaoSchema,
  criarEspecialistaSchema,
} from './especialista.dto.js';
import type {
  AlterarSituacaoDto,
  CriarEspecialistaDto,
} from './especialista.dto.js';
import { EspecialistasService } from './especialistas.service.js';

@Controller('api/especialistas')
export class EspecialistasController {
  constructor(
    @Inject(EspecialistasService)
    private readonly especialistas: EspecialistasService,
  ) {}

  @Post()
  criar(
    @Body({ schema: criarEspecialistaSchema }) dados: CriarEspecialistaDto,
  ) {
    return this.especialistas.criar(dados);
  }

  @Get()
  listar() {
    return this.especialistas.listar();
  }

  @Get(':id')
  buscar(@Param('id', { schema: idSchema }) id: string) {
    return this.especialistas.buscar(id);
  }

  @Patch(':id/situacao')
  alterarSituacao(
    @Param('id', { schema: idSchema }) id: string,
    @Body({ schema: alterarSituacaoSchema }) dados: AlterarSituacaoDto,
  ) {
    return this.especialistas.alterarSituacao(id, dados);
  }
}
