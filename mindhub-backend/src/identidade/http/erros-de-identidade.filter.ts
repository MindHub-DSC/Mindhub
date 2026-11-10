import { Catch, HttpStatus } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { responderErro } from '../../compartilhado/http/responder-erro.js';
import { EmailJaCadastrado } from '../dominio/email-ja-cadastrado.js';

/** Traduz os erros de significado de C1 para HTTP. */
@Catch(EmailJaCadastrado)
export class ErrosDeIdentidadeFilter implements ExceptionFilter {
  catch(erro: EmailJaCadastrado, host: ArgumentsHost): void {
    responderErro(host, HttpStatus.CONFLICT, erro.message);
  }
}
