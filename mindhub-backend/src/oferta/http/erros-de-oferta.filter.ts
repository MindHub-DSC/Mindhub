import { Catch, HttpStatus } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { responderErro } from '../../compartilhado/http/responder-erro.js';
import { UsuarioNaoReconhecido } from '../aplicacao/cadastrar-perfil-especialista.js';
import { PerfilInvalido, PerfilJaExistente } from '../dominio/erros.js';

type ErroDeOferta = PerfilInvalido | PerfilJaExistente | UsuarioNaoReconhecido;

/**
 * Traduz os significados de C2 para HTTP. O domínio não conhece status:
 * a escolha do código acontece só aqui. Erros que este filtro não reconhece
 * seguem para o tratamento padrão do Nest (500 genérico).
 */
@Catch(PerfilInvalido, PerfilJaExistente, UsuarioNaoReconhecido)
export class ErrosDeOfertaFilter implements ExceptionFilter {
  catch(erro: ErroDeOferta, host: ArgumentsHost): void {
    responderErro(host, statusPara(erro), erro.message);
  }
}

function statusPara(erro: ErroDeOferta): number {
  if (erro instanceof PerfilInvalido) return HttpStatus.BAD_REQUEST;
  if (erro instanceof PerfilJaExistente) return HttpStatus.CONFLICT;
  // D5 (decidida em 10/11/2026): 422, porque a rota existe e o que não é
  // reconhecido é um dado do corpo. Com autenticação, passará a ser 401.
  return HttpStatus.UNPROCESSABLE_ENTITY;
}
