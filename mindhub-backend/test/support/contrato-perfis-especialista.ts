import { randomUUID } from 'node:crypto';
import { PerfilJaExistente } from '../../src/oferta/dominio/erros.js';
import { PerfilEspecialista } from '../../src/oferta/dominio/perfil-especialista.js';
import type { PerfisEspecialistaRepositorio } from '../../src/oferta/dominio/perfis-especialista.repositorio.js';

/**
 * Suíte de contrato da porta PerfisEspecialistaRepositorio.
 * A mesma suíte roda contra a implementação em memória (unit) e contra a
 * TypeORM/PostgreSQL (integração): as duas precisam se comportar igual.
 *
 * novoUsuarioId() devolve um id novo e o registra para limpeza, quando houver.
 */
export function verificarContratoDePerfis(
  obterRepositorio: () => PerfisEspecialistaRepositorio,
  novoUsuarioId: () => string = () => randomUUID(),
): void {
  const agora = new Date('2026-11-10T17:00:00.000Z');

  function novoPerfil(usuarioId: string, descricao = 'Consultora de produto') {
    return PerfilEspecialista.cadastrar({
      usuarioId,
      descricao,
      especialidades: ['Discovery', 'Métricas'],
      agora,
    });
  }

  it('adiciona e recupera o mesmo perfil pelo usuário', async () => {
    const repositorio = obterRepositorio();
    const perfil = novoPerfil(novoUsuarioId());

    await repositorio.adicionar(perfil);
    const lido = await repositorio.buscarPorUsuario(perfil.usuarioId);

    expect(lido).not.toBeNull();
    expect(lido?.id).toBe(perfil.id);
    expect(lido?.usuarioId).toBe(perfil.usuarioId);
    expect(lido?.descricao).toBe('Consultora de produto');
    expect(lido?.especialidades).toEqual(['Discovery', 'Métricas']);
    expect(lido?.situacao).toBe('ATIVO');
    expect(lido?.criadoEm.toISOString()).toBe(agora.toISOString());
  });

  it('devolve null para usuário sem perfil', async () => {
    expect(
      await obterRepositorio().buscarPorUsuario(novoUsuarioId()),
    ).toBeNull();
  });

  it('recusa um segundo perfil do mesmo usuário e mantém o primeiro', async () => {
    const repositorio = obterRepositorio();
    const usuarioId = novoUsuarioId();
    const primeiro = novoPerfil(usuarioId, 'Primeira descrição');
    await repositorio.adicionar(primeiro);

    await expect(
      repositorio.adicionar(novoPerfil(usuarioId, 'Segunda descrição')),
    ).rejects.toBeInstanceOf(PerfilJaExistente);

    const lido = await repositorio.buscarPorUsuario(usuarioId);
    expect(lido?.id).toBe(primeiro.id);
    expect(lido?.descricao).toBe('Primeira descrição');
  });

  it('recusa novo perfil quando o existente está SUSPENSO (não contorna RN01)', async () => {
    const repositorio = obterRepositorio();
    const usuarioId = novoUsuarioId();
    // "suspender" ainda não existe (UC18); o estado é restaurado como viria do banco.
    const suspenso = PerfilEspecialista.reconstituir({
      id: randomUUID(),
      usuarioId,
      descricao: 'Perfil suspenso',
      especialidades: ['Mentoria'],
      situacao: 'SUSPENSO',
      criadoEm: agora,
    });
    await repositorio.adicionar(suspenso);

    await expect(
      repositorio.adicionar(novoPerfil(usuarioId)),
    ).rejects.toBeInstanceOf(PerfilJaExistente);
    expect((await repositorio.buscarPorUsuario(usuarioId))?.situacao).toBe(
      'SUSPENSO',
    );
  });

  it('com duas inclusões simultâneas, exatamente uma vence', async () => {
    const repositorio = obterRepositorio();
    const usuarioId = novoUsuarioId();

    const resultados = await Promise.allSettled([
      repositorio.adicionar(novoPerfil(usuarioId, 'A')),
      repositorio.adicionar(novoPerfil(usuarioId, 'B')),
    ]);

    const sucessos = resultados.filter((r) => r.status === 'fulfilled');
    const falhas = resultados.filter((r) => r.status === 'rejected');
    expect(sucessos).toHaveLength(1);
    expect(falhas).toHaveLength(1);
    expect((falhas[0] as PromiseRejectedResult).reason).toBeInstanceOf(
      PerfilJaExistente,
    );
  });
}
