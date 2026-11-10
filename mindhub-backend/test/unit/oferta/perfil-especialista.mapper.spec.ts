import { randomUUID } from 'node:crypto';
import { PerfilEspecialista } from '../../../src/oferta/dominio/perfil-especialista.js';
import {
  PerfilEspecialistaMapper,
  RegistroDePerfilCorrompido,
} from '../../../src/oferta/infra/perfil-especialista.mapper.js';
import { PerfilEspecialistaOrmEntity } from '../../../src/oferta/infra/perfil-especialista.orm-entity.js';

const agora = new Date('2026-11-10T17:00:00.000Z');

function registro(campos: Partial<PerfilEspecialistaOrmEntity> = {}) {
  return Object.assign(new PerfilEspecialistaOrmEntity(), {
    id: randomUUID(),
    usuarioId: randomUUID(),
    descricao: 'Perfil registrado',
    especialidades: ['Mentoria', 'Carreira'],
    situacao: 'SUSPENSO',
    criadoEm: agora,
    ...campos,
  });
}

describe('PerfilEspecialistaMapper', () => {
  it('paraOrm copia todos os campos persistidos', () => {
    const perfil = PerfilEspecialista.cadastrar({
      usuarioId: randomUUID(),
      descricao: 'Consultora',
      especialidades: ['Discovery'],
      agora,
    });

    const orm = PerfilEspecialistaMapper.paraOrm(perfil);

    expect(orm).toBeInstanceOf(PerfilEspecialistaOrmEntity);
    expect(orm).toEqual({
      id: perfil.id,
      usuarioId: perfil.usuarioId,
      descricao: 'Consultora',
      especialidades: ['Discovery'],
      situacao: 'ATIVO',
      criadoEm: agora,
    });
  });

  it('paraDominio preserva identidade e situação (não volta a ATIVO)', () => {
    const orm = registro();
    const perfil = PerfilEspecialistaMapper.paraDominio(orm);

    expect(perfil.id).toBe(orm.id);
    expect(perfil.usuarioId).toBe(orm.usuarioId);
    expect(perfil.situacao).toBe('SUSPENSO');
    expect(perfil.especialidades).toEqual(['Mentoria', 'Carreira']);
    expect(perfil.criadoEm.toISOString()).toBe(agora.toISOString());
  });

  it('ida e volta mantém o perfil igual', () => {
    const original = PerfilEspecialista.cadastrar({
      usuarioId: randomUUID(),
      descricao: 'Ida e volta',
      especialidades: ['A', 'B'],
      agora,
    });
    const volta = PerfilEspecialistaMapper.paraDominio(
      PerfilEspecialistaMapper.paraOrm(original),
    );
    expect(PerfilEspecialistaMapper.paraOrm(volta)).toEqual(
      PerfilEspecialistaMapper.paraOrm(original),
    );
  });

  it.each([
    ['situação desconhecida', { situacao: 'APROVADO' }],
    ['sem especialidades', { especialidades: [] }],
    ['descrição vazia', { descricao: '' }],
  ])(
    'registro inválido (%s) vira RegistroDePerfilCorrompido, não erro do cliente',
    (_caso, campos) => {
      expect(() =>
        PerfilEspecialistaMapper.paraDominio(registro(campos)),
      ).toThrow(RegistroDePerfilCorrompido);
    },
  );
});
