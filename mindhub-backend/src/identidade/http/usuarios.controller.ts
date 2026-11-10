import { Body, Controller, Inject, Post, UseFilters } from '@nestjs/common';
import { CadastrarUsuario } from '../aplicacao/cadastrar-usuario.js';
import { criarUsuarioSchema } from './criar-usuario.dto.js';
import type { CriarUsuarioDto } from './criar-usuario.dto.js';
import { ErrosDeIdentidadeFilter } from './erros-de-identidade.filter.js';

@Controller('usuarios')
@UseFilters(ErrosDeIdentidadeFilter)
export class UsuariosController {
  constructor(
    @Inject(CadastrarUsuario)
    private readonly cadastrarUsuario: CadastrarUsuario,
  ) {}

  @Post()
  async cadastrar(
    @Body({ schema: criarUsuarioSchema }) dados: CriarUsuarioDto,
  ) {
    const usuario = await this.cadastrarUsuario.executar(dados);
    return { id: usuario.id, nome: usuario.nome, email: usuario.email };
  }
}
