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
import { criarServicoSchema, listarServicosSchema } from './servico.dto.js';
import type { CriarServicoDto, ListarServicosDto } from './servico.dto.js';
import { ServicosService } from './servicos.service.js';

@Controller('api/servicos')
export class ServicosController {
  constructor(
    @Inject(ServicosService) private readonly servicos: ServicosService,
  ) {}

  @Post()
  criar(@Body({ schema: criarServicoSchema }) dados: CriarServicoDto) {
    return this.servicos.criar(dados);
  }

  @Get()
  listar(@Query({ schema: listarServicosSchema }) filtros: ListarServicosDto) {
    return this.servicos.listar(filtros);
  }

  @Get(':id')
  buscar(@Param('id', { schema: idSchema }) id: string) {
    return this.servicos.buscar(id);
  }
}
