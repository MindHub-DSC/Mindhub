import { randomUUID } from 'node:crypto';
import { PerfilInvalido } from '../../../src/oferta/dominio/erros.js';
import { PerfilEspecialista } from '../../../src/oferta/dominio/perfil-especialista.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const agora = new Date('2026-11-10T17:00:00.000Z');

function cadastrar(
  dados: { descricao?: string; especialidades?: string[] } = {},
) {
  return PerfilEspecialista.cadastrar({
    usuarioId: randomUUID(),
    descricao: dados.descricao ?? 'Consultora de produto',
    especialidades: dados.especialidades ?? ['Discovery'],
    agora,
  });
}

describe('PerfilEspecialista.cadastrar', () => {
  it('nasce ATIVO, com identidade própria e data de criação (D2)', () => {
    const perfil = cadastrar();
    expect(perfil.id).toMatch(UUID);
    expect(perfil.situacao).toBe('ATIVO');
    expect(perfil.criadoEm.toISOString()).toBe(agora.toISOString());
  });

  it('gera identidades diferentes a cada cadastro', () => {
    expect(cadastrar().id).not.toBe(cadastrar().id);
  });

  it('apara descrição e especialidades', () => {
    const perfil = cadastrar({
      descricao: '  Mentora  ',
      especialidades: ['  Discovery '],
    });
    expect(perfil.descricao).toBe('Mentora');
    expect(perfil.especialidades).toEqual(['Discovery']);
  });

  it('guarda só a referência do usuário, sem nome nem email (RN-UC02-02)', () => {
    const perfil = cadastrar() as unknown as Record<string, unknown>;
    expect(perfil.nome).toBeUndefined();
    expect(perfil.email).toBeUndefined();
  });

  it('não permite trocar situação nem dono por atribuição', () => {
    const perfil = cadastrar() as unknown as Record<string, unknown>;
    expect(() => {
      perfil.situacao = 'SUSPENSO';
    }).toThrow(TypeError);
    expect(() => {
      perfil.usuarioId = randomUUID();
    }).toThrow(TypeError);
  });

  it('devolve cópias: alterar o retorno não altera o perfil', () => {
    const perfil = cadastrar({ especialidades: ['Discovery'] });
    (perfil.especialidades as string[]).push('Invasora');
    perfil.criadoEm.setFullYear(2000);
    expect(perfil.especialidades).toEqual(['Discovery']);
    expect(perfil.criadoEm.toISOString()).toBe(agora.toISOString());
  });

  it.each([
    ['vazia', ''],
    ['só espaços', '   '],
    ['com 2001 caracteres', 'a'.repeat(2001)],
  ])('recusa descrição %s', (_caso, descricao) => {
    expect(() => cadastrar({ descricao })).toThrow(PerfilInvalido);
  });

  it('aceita descrição com exatamente 2000 caracteres', () => {
    expect(cadastrar({ descricao: 'a'.repeat(2000) }).descricao).toHaveLength(
      2000,
    );
  });

  it.each([
    ['nenhuma', []],
    ['21 itens', Array.from({ length: 21 }, (_, i) => `Área ${i}`)],
    ['item vazio', ['Discovery', '  ']],
    ['item com 121 caracteres', ['a'.repeat(121)]],
    [
      'repetidas, sem diferenciar maiúsculas (D3)',
      ['Discovery', ' discovery '],
    ],
  ])('recusa especialidades: %s', (_caso, especialidades) => {
    expect(() => cadastrar({ especialidades })).toThrow(PerfilInvalido);
  });

  it('aceita 20 especialidades distintas', () => {
    const vinte = Array.from({ length: 20 }, (_, i) => `Área ${i}`);
    expect(cadastrar({ especialidades: vinte }).especialidades).toHaveLength(
      20,
    );
  });
});

describe('PerfilEspecialista.reconstituir', () => {
  const dados = {
    id: randomUUID(),
    usuarioId: randomUUID(),
    descricao: 'Perfil registrado',
    especialidades: ['Mentoria'],
    situacao: 'SUSPENSO',
    criadoEm: agora,
  };

  it('restaura identidade e situação sem repetir o cadastro', () => {
    const perfil = PerfilEspecialista.reconstituir(dados);
    expect(perfil.id).toBe(dados.id);
    expect(perfil.situacao).toBe('SUSPENSO');
    expect(perfil.criadoEm.toISOString()).toBe(agora.toISOString());
  });

  it('recusa situação desconhecida', () => {
    expect(() =>
      PerfilEspecialista.reconstituir({ ...dados, situacao: 'APROVADO' }),
    ).toThrow(PerfilInvalido);
  });

  it('recusa dados que violam as invariantes', () => {
    expect(() =>
      PerfilEspecialista.reconstituir({ ...dados, especialidades: [] }),
    ).toThrow(PerfilInvalido);
    expect(() =>
      PerfilEspecialista.reconstituir({ ...dados, criadoEm: new Date('x') }),
    ).toThrow(PerfilInvalido);
  });
});
