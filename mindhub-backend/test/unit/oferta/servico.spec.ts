import { randomUUID } from 'node:crypto';
import {
  CondicoesVigentesAusentes,
  ServicoInvalido,
} from '../../../src/oferta/dominio/erros.js';
import { Servico } from '../../../src/oferta/dominio/servico.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const agora = new Date('2026-11-11T12:00:00.000Z');

describe('Servico.publicar', () => {
  // Critério de aceite 1 da #36 (UC03): o Serviço nasce publicado, com
  // identidade própria, referência ao perfil e Modelo de Contratação declarado.
  it('nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação', () => {
    // Arrange: dados válidos. Sob Proposta não exige condições vigentes (D-UC03-03).
    const perfilId = randomUUID();
    const dados = {
      perfilId,
      titulo: 'Mentoria de produto',
      descricao: 'Sessões de discovery para times iniciantes',
      modeloContratacao: 'SOB_PROPOSTA' as const,
      agora,
    };

    // Act
    const servico = Servico.publicar(dados);

    // Assert
    expect(servico.id).toMatch(UUID);
    expect(servico.perfilId).toBe(perfilId);
    expect(servico.titulo).toBe('Mentoria de produto');
    expect(servico.descricao).toBe(
      'Sessões de discovery para times iniciantes',
    );
    expect(servico.modeloContratacao).toBe('SOB_PROPOSTA');
    expect(servico.situacao).toBe('PUBLICADO');
  });

  it('gera identidades diferentes a cada publicação', () => {
    const dados = {
      perfilId: randomUUID(),
      titulo: 'Mentoria de produto',
      descricao: 'Sessões de discovery para times iniciantes',
      modeloContratacao: 'SOB_PROPOSTA' as const,
      agora,
    };

    expect(Servico.publicar(dados).id).not.toBe(Servico.publicar(dados).id);
  });

  // Critério de aceite 2 da #36: Modelo de Contratação ausente ou fora de
  // Reserva Direta/Sob Proposta é recusado pelo domínio.
  it.each([
    ['ausente', undefined],
    ['vazio', ''],
    ['fora dos valores', 'LEILAO'],
  ])('recusa Modelo de Contratação %s', (_caso, modeloContratacao) => {
    const dados = {
      perfilId: randomUUID(),
      titulo: 'Mentoria de produto',
      descricao: 'Sessões de discovery para times iniciantes',
      // Simula o dado vindo de fora do TypeScript (API, banco).
      modeloContratacao: modeloContratacao as never,
      agora,
    };

    expect(() => Servico.publicar(dados)).toThrow(ServicoInvalido);
  });
});

describe('Servico.publicar — Reserva Direta', () => {
  const condicoes = {
    preco: 15000,
    moeda: 'BRL',
    duracaoMinutos: 60,
    modalidade: 'ONLINE',
  };

  function reservaDireta(extra: Record<string, unknown> = {}) {
    return {
      perfilId: randomUUID(),
      titulo: 'Mentoria de produto',
      descricao: 'Sessões de discovery para times iniciantes',
      modeloContratacao: 'RESERVA_DIRETA' as const,
      agora,
      ...extra,
    };
  }

  // Critério de aceite 3 da #36: Reserva Direta só é criada com condições
  // vigentes completas, conforme D-UC03-02.
  it('nasce com as condições vigentes informadas', () => {
    const servico = Servico.publicar(reservaDireta({ condicoes }));

    expect(servico.modeloContratacao).toBe('RESERVA_DIRETA');
    expect(servico.condicoes).toEqual(condicoes);
  });

  it('recusa Reserva Direta sem condições vigentes', () => {
    expect(() => Servico.publicar(reservaDireta())).toThrow(
      CondicoesVigentesAusentes,
    );
  });
});

describe('Servico.publicar — Sob Proposta', () => {
  // Critério de aceite 4 da #36: Sob Proposta é criada sem condições vigentes
  // obrigatórias (D-UC03-03).
  it('nasce sem condições vigentes', () => {
    const servico = Servico.publicar({
      perfilId: randomUUID(),
      titulo: 'Consultoria sob medida',
      descricao: 'Escopo e preço combinados na proposta',
      modeloContratacao: 'SOB_PROPOSTA',
      agora,
    });

    expect(servico.modeloContratacao).toBe('SOB_PROPOSTA');
    expect(servico.condicoes).toBeNull();
  });
});

describe('Servico.publicar — condições vigentes inválidas', () => {
  const validas = {
    preco: 15000,
    moeda: 'BRL',
    duracaoMinutos: 60,
    modalidade: 'ONLINE',
  };

  // Critério de aceite 5 da #36: preço negativo ou não inteiro, moeda vazia e
  // duração não positiva são recusados.
  it.each([
    ['preço negativo', { preco: -1 }],
    ['preço não inteiro', { preco: 99.5 }],
    ['moeda vazia', { moeda: '' }],
    ['moeda só espaços', { moeda: '   ' }],
    ['duração zero', { duracaoMinutos: 0 }],
    ['duração negativa', { duracaoMinutos: -30 }],
    ['modalidade vazia', { modalidade: '' }],
  ])('recusa %s', (_caso, alteracao) => {
    expect(() =>
      Servico.publicar({
        perfilId: randomUUID(),
        titulo: 'Mentoria de produto',
        descricao: 'Sessões de discovery para times iniciantes',
        modeloContratacao: 'RESERVA_DIRETA',
        condicoes: { ...validas, ...alteracao },
        agora,
      }),
    ).toThrow(ServicoInvalido);
  });

  it('aceita preço zero (D-UC03-02: inteiro maior ou igual a 0)', () => {
    const servico = Servico.publicar({
      perfilId: randomUUID(),
      titulo: 'Mentoria de produto',
      descricao: 'Sessões de discovery para times iniciantes',
      modeloContratacao: 'RESERVA_DIRETA',
      condicoes: { ...validas, preco: 0 },
      agora,
    });

    expect(servico.condicoes?.preco).toBe(0);
  });
});

describe('Servico.publicar — título, descrição e perfil (D-UC03-01)', () => {
  function publicar(alteracao: Record<string, string>) {
    return Servico.publicar({
      perfilId: randomUUID(),
      titulo: 'Mentoria de produto',
      descricao: 'Sessões de discovery para times iniciantes',
      modeloContratacao: 'SOB_PROPOSTA',
      agora,
      ...alteracao,
    });
  }

  it('apara título e descrição', () => {
    const servico = publicar({
      titulo: '  Mentoria  ',
      descricao: ' Discovery ',
    });

    expect(servico.titulo).toBe('Mentoria');
    expect(servico.descricao).toBe('Discovery');
  });

  it.each([
    ['título vazio', { titulo: '' }],
    ['título só espaços', { titulo: '   ' }],
    ['descrição vazia', { descricao: '' }],
    ['descrição só espaços', { descricao: '  ' }],
    ['referência ao perfil vazia', { perfilId: ' ' }],
  ])('recusa %s', (_caso, alteracao) => {
    expect(() => publicar(alteracao)).toThrow(ServicoInvalido);
  });
});

describe('Servico.reconstituir', () => {
  const registrado = {
    id: randomUUID(),
    perfilId: randomUUID(),
    titulo: 'Mentoria',
    descricao: 'Discovery',
    modeloContratacao: 'SOB_PROPOSTA',
    situacao: 'PUBLICADO',
    condicoes: null,
    publicadoEm: new Date('2026-11-17T12:00:00.000Z'),
  };

  it('restaura identidade e situação sem gerar id novo', () => {
    const servico = Servico.reconstituir(registrado);

    expect(servico.id).toBe(registrado.id);
    expect(servico.situacao).toBe('PUBLICADO');
  });

  it.each([
    ['situação desconhecida', { situacao: 'ARQUIVADO' }],
    ['modelo desconhecido', { modeloContratacao: 'LEILAO' }],
    ['identificador vazio', { id: '' }],
    ['Reserva Direta sem condições', { modeloContratacao: 'RESERVA_DIRETA' }],
  ])('recusa %s', (_caso, alteracao) => {
    expect(() => Servico.reconstituir({ ...registrado, ...alteracao })).toThrow(
      ServicoInvalido,
    );
  });
});

describe('Servico — data de publicação (A2, decidida em 17/11/2026)', () => {
  function publicar() {
    return Servico.publicar({
      perfilId: randomUUID(),
      titulo: 'Mentoria',
      descricao: 'Discovery',
      modeloContratacao: 'SOB_PROPOSTA',
      agora,
    });
  }

  it('guarda o instante de publicação recebido em agora', () => {
    expect(publicar().publicadoEm.toISOString()).toBe(agora.toISOString());
  });

  it('devolve cópia: alterar a data retornada não altera o Serviço', () => {
    const servico = publicar();
    servico.publicadoEm.setFullYear(2000);

    expect(servico.publicadoEm.toISOString()).toBe(agora.toISOString());
  });

  it('reconstituir restaura a data e paraDados a devolve', () => {
    const data = new Date('2026-11-01T08:30:00.000Z');
    const servico = Servico.reconstituir({
      id: randomUUID(),
      perfilId: randomUUID(),
      titulo: 'Mentoria',
      descricao: 'Discovery',
      modeloContratacao: 'SOB_PROPOSTA',
      situacao: 'PUBLICADO',
      condicoes: null,
      publicadoEm: data,
    });

    expect(servico.publicadoEm.toISOString()).toBe(data.toISOString());
    expect(servico.paraDados().publicadoEm.toISOString()).toBe(
      data.toISOString(),
    );
  });

  it('recusa data de publicação inválida', () => {
    expect(() =>
      Servico.publicar({
        perfilId: randomUUID(),
        titulo: 'Mentoria',
        descricao: 'Discovery',
        modeloContratacao: 'SOB_PROPOSTA',
        agora: new Date('data inválida'),
      }),
    ).toThrow(ServicoInvalido);
  });
});

describe('Servico — limites de texto (decididos em 17/11/2026)', () => {
  function publicar(titulo: string, descricao: string) {
    return Servico.publicar({
      perfilId: randomUUID(),
      titulo,
      descricao,
      modeloContratacao: 'SOB_PROPOSTA',
      agora,
    });
  }

  it('aceita título com 120 e descrição com 2000 caracteres', () => {
    const servico = publicar('t'.repeat(120), 'd'.repeat(2000));

    expect(servico.titulo).toHaveLength(120);
    expect(servico.descricao).toHaveLength(2000);
  });

  it('recusa título com 121 caracteres', () => {
    expect(() => publicar('t'.repeat(121), 'Discovery')).toThrow(
      ServicoInvalido,
    );
  });

  it('recusa descrição com 2001 caracteres', () => {
    expect(() => publicar('Mentoria', 'd'.repeat(2001))).toThrow(
      ServicoInvalido,
    );
  });

  it('conta o tamanho depois de aparar', () => {
    expect(publicar(`  ${'t'.repeat(120)}  `, 'Discovery').titulo).toHaveLength(
      120,
    );
  });
});
