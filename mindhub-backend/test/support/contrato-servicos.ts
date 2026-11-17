import { randomUUID } from 'node:crypto';
import { Servico } from '../../src/oferta/dominio/servico.js';
import type { ServicosRepositorio } from '../../src/oferta/dominio/servicos.repositorio.js';

/**
 * Suíte de contrato da porta ServicosRepositorio (critério 6 da #36).
 * Roda contra a implementação em memória e, na #37, contra a TypeORM.
 */
export function verificarContratoDeServicos(
  obterRepositorio: () => ServicosRepositorio,
): void {
  const agora = new Date('2026-11-17T12:00:00.000Z');

  function reservaDireta(perfilId = randomUUID(), titulo = 'Mentoria') {
    return Servico.publicar({
      perfilId,
      titulo,
      descricao: 'Sessões de discovery',
      modeloContratacao: 'RESERVA_DIRETA',
      condicoes: {
        preco: 15000,
        moeda: 'BRL',
        duracaoMinutos: 60,
        modalidade: 'ONLINE',
      },
      agora,
    });
  }

  function sobProposta(perfilId = randomUUID(), titulo = 'Consultoria') {
    return Servico.publicar({
      perfilId,
      titulo,
      descricao: 'Escopo combinado na proposta',
      modeloContratacao: 'SOB_PROPOSTA',
      agora,
    });
  }

  it('adiciona e busca o mesmo Serviço pelo identificador', async () => {
    const repositorio = obterRepositorio();
    const servico = reservaDireta();

    await repositorio.adicionar(servico);
    const lido = await repositorio.buscarPorId(servico.id);

    expect(lido).not.toBeNull();
    expect(lido?.id).toBe(servico.id);
    expect(lido?.perfilId).toBe(servico.perfilId);
    expect(lido?.titulo).toBe('Mentoria');
    expect(lido?.descricao).toBe('Sessões de discovery');
    expect(lido?.modeloContratacao).toBe('RESERVA_DIRETA');
    expect(lido?.situacao).toBe('PUBLICADO');
    expect(lido?.condicoes).toEqual({
      preco: 15000,
      moeda: 'BRL',
      duracaoMinutos: 60,
      modalidade: 'ONLINE',
    });
  });

  it('preserva Serviço Sob Proposta sem condições', async () => {
    const repositorio = obterRepositorio();
    const servico = sobProposta();

    await repositorio.adicionar(servico);

    expect((await repositorio.buscarPorId(servico.id))?.condicoes).toBeNull();
  });

  it('devolve null para identificador desconhecido', async () => {
    expect(await obterRepositorio().buscarPorId(randomUUID())).toBeNull();
  });

  it('lista os Serviços do perfil na ordem de registro, sem os de outros perfis', async () => {
    const repositorio = obterRepositorio();
    const perfilId = randomUUID();
    const primeiro = reservaDireta(perfilId, 'Primeiro');
    const segundo = sobProposta(perfilId, 'Segundo');
    await repositorio.adicionar(primeiro);
    await repositorio.adicionar(reservaDireta(randomUUID(), 'De outro perfil'));
    await repositorio.adicionar(segundo);

    const lista = await repositorio.listarPorPerfil(perfilId);

    expect(lista.map((s) => s.id)).toEqual([primeiro.id, segundo.id]);
  });

  it('lista vazia para perfil sem Serviços', async () => {
    expect(await obterRepositorio().listarPorPerfil(randomUUID())).toEqual([]);
  });

  it('devolve cópias defensivas: alterar o retorno não altera o registro', async () => {
    const repositorio = obterRepositorio();
    const perfilId = randomUUID();
    const servico = reservaDireta(perfilId);
    await repositorio.adicionar(servico);

    const lido = await repositorio.buscarPorId(servico.id);
    expect(lido).not.toBe(servico);
    const condicoesLidas = lido?.condicoes;
    if (condicoesLidas) condicoesLidas.preco = 1;

    const lista = await repositorio.listarPorPerfil(perfilId);
    lista.pop();

    expect((await repositorio.buscarPorId(servico.id))?.condicoes?.preco).toBe(
      15000,
    );
    expect(await repositorio.listarPorPerfil(perfilId)).toHaveLength(1);
  });
}
