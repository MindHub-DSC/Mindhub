import type { ArgumentsHost } from '@nestjs/common';

/** O mínimo da resposta do Express usado pelos filtros. */
interface RespostaHttp {
  status(codigo: number): { json(corpo: unknown): unknown };
}

/** Envia um erro no mesmo formato do NestJS: { statusCode, message }. */
export function responderErro(
  host: ArgumentsHost,
  statusCode: number,
  message: string,
): void {
  host
    .switchToHttp()
    .getResponse<RespostaHttp>()
    .status(statusCode)
    .json({ statusCode, message });
}
