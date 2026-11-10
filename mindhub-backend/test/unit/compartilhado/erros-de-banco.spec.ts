import {
  ArmazenamentoIndisponivel,
  ehFalhaDeConexao,
  traduzirFalhaDeConexao,
  violouRestricaoUnica,
} from '../../../src/compartilhado/infra/erros-de-banco.js';

/** Formato do QueryFailedError do TypeORM: o erro do pg fica em driverError. */
function erroDoTypeOrm(driverError: Record<string, unknown>) {
  return Object.assign(new Error('query failed'), { driverError });
}

describe('classificação de erros do banco', () => {
  it('reconhece violação da restrição única pelo código 23505 e pelo nome', () => {
    const erro = erroDoTypeOrm({
      code: '23505',
      constraint: 'uq_perfis_especialista_usuario',
    });
    expect(violouRestricaoUnica(erro, 'uq_perfis_especialista_usuario')).toBe(
      true,
    );
    expect(violouRestricaoUnica(erro, 'uq_usuarios_email')).toBe(false);
  });

  it.each([
    ['ECONNREFUSED', { code: 'ECONNREFUSED' }],
    ['servidor desligando (57P01)', { code: '57P01' }],
    ['classe 08 (08006)', { code: '08006' }],
  ])('trata %s como falha de conexão', (_caso, driverError) => {
    const traduzido = traduzirFalhaDeConexao(erroDoTypeOrm(driverError));
    expect(traduzido).toBeInstanceOf(ArmazenamentoIndisponivel);
  });

  it('erro de SQL não é falha de conexão e segue igual (vira 500)', () => {
    const erroDeSintaxe = erroDoTypeOrm({ code: '42601' });
    expect(ehFalhaDeConexao(erroDeSintaxe)).toBe(false);
    expect(traduzirFalhaDeConexao(erroDeSintaxe)).toBe(erroDeSintaxe);
  });

  it('reconhece a mensagem de conexão encerrada sem código', () => {
    expect(
      ehFalhaDeConexao(new Error('Connection terminated unexpectedly')),
    ).toBe(true);
  });
});
