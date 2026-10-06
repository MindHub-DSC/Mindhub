import { Body, Controller, Inject, Post } from '@nestjs/common';
import { criarUsuarioSchema } from './criar-usuario.dto.js';
import type { CriarUsuarioDto } from './criar-usuario.dto.js';
import { UsuariosService } from './usuarios.service.js';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    @Inject(UsuariosService) private readonly usuarios: UsuariosService,
  ) {}

  @Post()
  cadastrar(@Body({ schema: criarUsuarioSchema }) dados: CriarUsuarioDto) {
    return this.usuarios.cadastrar(dados);
  }
}
