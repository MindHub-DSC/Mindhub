import { Catch, HttpStatus } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { responderErro } from '../../compartilhado/http/responder-erro.js';
import {
  AtorSemPerfil,
  PerfilSuspenso,
} from '../aplicacao/publicar-servico.js';
import {
  CondicoesVigentesAusentes,
  ServicoInvalido,
} from '../dominio/erros.js';

type ErroDePublicacao = ServicoInvalido | AtorSemPerfil | PerfilSuspenso;

/**
 * Traduz os erros do UC03 para HTTP, conforme D-UC03-07 (decidida em
 * 17/11/2026). O domínio e a aplicação não conhecem status. Falha de
 * armazenamento (503) é tratada pelo filtro global de armazenamento.
 */
@Catch(ServicoInvalido, AtorSemPerfil, PerfilSuspenso)
export class ErrosDePublicacaoFilter implements ExceptionFilter {
  catch(erro: ErroDePublicacao, host: ArgumentsHost): void {
    responderErro(host, statusPara(erro), erro.message);
  }
}

function statusPara(erro: ErroDePublicacao): number {
  if (erro instanceof AtorSemPerfil) return HttpStatus.NOT_FOUND;
  if (erro instanceof PerfilSuspenso) return HttpStatus.FORBIDDEN;
  // CondicoesVigentesAusentes estende ServicoInvalido: testar antes.
  if (erro instanceof CondicoesVigentesAusentes) {
    return HttpStatus.UNPROCESSABLE_ENTITY;
  }
  return HttpStatus.BAD_REQUEST;
}
