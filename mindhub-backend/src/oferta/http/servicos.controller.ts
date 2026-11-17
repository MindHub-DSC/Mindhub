import { Body, Controller, Inject, Post, UseFilters } from '@nestjs/common';
import { PublicarServico } from '../aplicacao/publicar-servico.js';
import { ErrosDePublicacaoFilter } from './erros-de-publicacao.filter.js';
import { paraResposta, publicarServicoSchema } from './publicar-servico.dto.js';
import type {
  PublicarServicoRequest,
  ServicoResponse,
} from './publicar-servico.dto.js';

/** Fronteira HTTP do UC03 (#40): recebe, valida o formato e traduz. Não decide regras. */
@Controller('servicos')
@UseFilters(ErrosDePublicacaoFilter)
export class ServicosController {
  constructor(
    @Inject(PublicarServico)
    private readonly publicarServico: PublicarServico,
  ) {}

  @Post()
  async publicar(
    @Body({ schema: publicarServicoSchema }) dados: PublicarServicoRequest,
  ): Promise<ServicoResponse> {
    const servico = await this.publicarServico.executar(dados);
    return paraResposta(servico);
  }
}
