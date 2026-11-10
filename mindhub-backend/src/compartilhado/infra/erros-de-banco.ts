/**
 * Classificação de erros do driver PostgreSQL (pg), usada só pelos
 * adaptadores de infraestrutura. Domínio e aplicação não importam este arquivo.
 */

/** O armazenamento não respondeu: não se sabe o resultado da operação. */
export class ArmazenamentoIndisponivel extends Error {
  constructor(options?: { cause?: unknown }) {
    super('Armazenamento indisponível.', options);
    this.name = 'ArmazenamentoIndisponivel';
  }
}

type ErroComCodigo = { code?: unknown; constraint?: unknown };

function erroDoDriver(erro: unknown): ErroComCodigo | undefined {
  if (typeof erro !== 'object' || erro === null) return undefined;
  // O TypeORM embrulha o erro do pg em QueryFailedError.driverError.
  const driverError = (erro as { driverError?: unknown }).driverError;
  const alvo = driverError ?? erro;
  return typeof alvo === 'object' && alvo !== null
    ? (alvo as ErroComCodigo)
    : undefined;
}

/** 23505 = unique_violation. Confere também o nome da restrição. */
export function violouRestricaoUnica(
  erro: unknown,
  restricao: string,
): boolean {
  const driver = erroDoDriver(erro);
  return driver?.code === '23505' && driver.constraint === restricao;
}

const CODIGOS_DE_CONEXAO = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EAI_AGAIN',
  '57P01', // admin_shutdown
  '57P02', // crash_shutdown
  '57P03', // cannot_connect_now
]);

/** Falhas de conexão (rede ou servidor fora do ar), e não erros de SQL. */
export function ehFalhaDeConexao(erro: unknown): boolean {
  const codigo = erroDoDriver(erro)?.code;
  if (typeof codigo !== 'string') {
    const mensagem = erro instanceof Error ? erro.message : '';
    return /Connection terminated|timeout exceeded when trying to connect/i.test(
      mensagem,
    );
  }
  // Classe 08 do PostgreSQL = connection_exception.
  return CODIGOS_DE_CONEXAO.has(codigo) || codigo.startsWith('08');
}

/** Converte falha de conexão em ArmazenamentoIndisponivel; demais erros seguem iguais. */
export function traduzirFalhaDeConexao(erro: unknown): unknown {
  return ehFalhaDeConexao(erro)
    ? new ArmazenamentoIndisponivel({ cause: erro })
    : erro;
}
