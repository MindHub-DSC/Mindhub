import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { idSchema } from '../common/schemas.js';
import { criarUsuarioSchema } from './usuario.dto.js';
import type { CriarUsuarioDto } from './usuario.dto.js';
import { UsuariosService } from './usuarios.service.js';

@Controller('api/usuarios')
export class UsuariosController {
  constructor(
    @Inject(UsuariosService) private readonly usuarios: UsuariosService,
  ) {}

  @Post()
  criar(@Body({ schema: criarUsuarioSchema }) dados: CriarUsuarioDto) {
    return this.usuarios.criar(dados);
  }

  @Get()
  listar() {
    return this.usuarios.listar();
  }

  @Get(':id')
  buscar(@Param('id', { schema: idSchema }) id: string) {
    return this.usuarios.buscar(id);
  }
}
