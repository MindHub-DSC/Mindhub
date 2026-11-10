import { carregarArquivoEnv } from '../../src/config/ambiente.js';

const NOME_DE_BANCO_DE_TESTE = /^[a-z0-9_]+_test$/;

/**
 * Faz o processo apontar para o banco de testes (DB_TEST_NAME) e recusa
 * qualquer outro. Testes de integração e E2E gravam e apagam dados: nunca
 * podem rodar no banco de desenvolvimento ou de produção.
 */
export function apontarParaBancoDeTeste(): string {
  carregarArquivoEnv();
  const alvo = process.env.DB_TEST_NAME;
  if (!alvo || !NOME_DE_BANCO_DE_TESTE.test(alvo)) {
    throw new Error(
      'DB_TEST_NAME ausente ou inválido: o nome precisa terminar em _test. ' +
        'Os testes com banco não rodam em outro banco.',
    );
  }
  // Guarda o banco da aplicação na primeira chamada, para nunca confundi-los.
  const bancoDaAplicacao = process.env.DB_NAME_APLICACAO ?? process.env.DB_NAME;
  if (alvo === bancoDaAplicacao) {
    throw new Error(
      'DB_TEST_NAME não pode ser o mesmo banco da aplicação (DB_NAME).',
    );
  }
  if (bancoDaAplicacao) process.env.DB_NAME_APLICACAO = bancoDaAplicacao;
  process.env.DB_NAME = alvo;
  return alvo;
}
