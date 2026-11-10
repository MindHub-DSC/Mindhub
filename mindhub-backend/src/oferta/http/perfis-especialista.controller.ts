import { Body, Controller, Inject, Post, UseFilters } from '@nestjs/common';
import { CadastrarPerfilEspecialista } from '../aplicacao/cadastrar-perfil-especialista.js';
import { cadastrarPerfilSchema, paraResposta } from './cadastrar-perfil.dto.js';
import type {
  CadastrarPerfilRequest,
  PerfilEspecialistaResponse,
} from './cadastrar-perfil.dto.js';
import { ErrosDeOfertaFilter } from './erros-de-oferta.filter.js';

/** Fronteira HTTP do UC02: recebe, valida o formato e traduz. Não decide regras. */
@Controller('especialistas')
@UseFilters(ErrosDeOfertaFilter)
export class PerfisEspecialistaController {
  constructor(
    @Inject(CadastrarPerfilEspecialista)
    private readonly cadastrarPerfil: CadastrarPerfilEspecialista,
  ) {}

  @Post()
  async cadastrar(
    @Body({ schema: cadastrarPerfilSchema }) dados: CadastrarPerfilRequest,
  ): Promise<PerfilEspecialistaResponse> {
    const perfil = await this.cadastrarPerfil.executar(dados);
    return paraResposta(perfil);
  }
}
