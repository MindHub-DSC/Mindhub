import { Catch, HttpStatus, Logger } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { ArmazenamentoIndisponivel } from '../infra/erros-de-banco.js';
import { responderErro } from './responder-erro.js';

/**
 * Falha técnica: o banco não respondeu. A resposta é genérica (503) e não
 * expõe SQL, host nem credenciais; a causa fica só no log do servidor.
 */
@Catch(ArmazenamentoIndisponivel)
export class ArmazenamentoIndisponivelFilter implements ExceptionFilter {
  private readonly logger = new Logger('Armazenamento');

  catch(erro: ArmazenamentoIndisponivel, host: ArgumentsHost): void {
    this.logger.error(`Banco indisponível: ${descreverCausa(erro.cause)}`);
    responderErro(
      host,
      HttpStatus.SERVICE_UNAVAILABLE,
      'Serviço temporariamente indisponível. Tente novamente.',
    );
  }
}

/**
 * Erros de conexão do Node (ex.: AggregateError de ECONNREFUSED) podem vir
 * com mensagem vazia; o código é o que identifica a causa.
 */
function descreverCausa(causa: unknown): string {
  if (typeof causa !== 'object' || causa === null) return 'desconhecida';
  const { code, message } = causa as { code?: unknown; message?: unknown };
  const partes = [code, message].filter(
    (p) => typeof p === 'string' && p.length > 0,
  );
  return partes.length > 0 ? partes.join(' ') : 'desconhecida';
}
