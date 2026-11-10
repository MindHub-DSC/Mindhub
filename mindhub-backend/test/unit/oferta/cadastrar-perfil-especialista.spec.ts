import { randomUUID } from 'node:crypto';
import type { ReconhecimentoDeUsuario } from '../../../src/identidade/publico/reconhecimento-de-usuario.js';
import {
  CadastrarPerfilEspecialista,
  UsuarioNaoReconhecido,
} from '../../../src/oferta/aplicacao/cadastrar-perfil-especialista.js';
import {
  PerfilInvalido,
  PerfilJaExistente,
} from '../../../src/oferta/dominio/erros.js';
import { ArmazenamentoIndisponivel } from '../../../src/compartilhado/infra/erros-de-banco.js';
import { PerfisEspecialistaEmMemoria } from '../../support/perfis-especialista.em-memoria.js';

/** Dublê da porta de C1: reconhece só os ids informados. */
function reconhecimentoDe(...ids: string[]): ReconhecimentoDeUsuario {
  return { reconhecer: (id) => Promise.resolve(ids.includes(id)) };
}

const agora = new Date('2026-11-10T17:00:00.000Z');

describe('CadastrarPerfilEspecialista (aplicação, com dublês)', () => {
  const usuarioId = randomUUID();
  let perfis: PerfisEspecialistaEmMemoria;

  beforeEach(() => {
    perfis = new PerfisEspecialistaEmMemoria();
  });

  function servico(reconhecimento = reconhecimentoDe(usuarioId)) {
    return new CadastrarPerfilEspecialista(reconhecimento, perfis, () => agora);
  }

  const comando = {
    usuarioId,
    descricao: 'Consultora de produto',
    especialidades: ['Discovery'],
  };

  it('cadastra o perfil ATIVO de um usuário reconhecido e o registra', async () => {
    const perfil = await servico().executar(comando);

    expect(perfil.situacao).toBe('ATIVO');
    expect(perfil.criadoEm.toISOString()).toBe(agora.toISOString());
    expect((await perfis.buscarPorUsuario(usuarioId))?.id).toBe(perfil.id);
  });

  it('usuário não reconhecido: sinaliza e não aciona o repositório', async () => {
    await expect(
      servico(reconhecimentoDe()).executar(comando),
    ).rejects.toBeInstanceOf(UsuarioNaoReconhecido);
    expect(perfis.chamadasDeAdicionar).toBe(0);
  });

  it('perfil já existente: repassa PerfilJaExistente sem segundo registro', async () => {
    const primeiro = await servico().executar(comando);

    await expect(servico().executar(comando)).rejects.toBeInstanceOf(
      PerfilJaExistente,
    );
    expect((await perfis.buscarPorUsuario(usuarioId))?.id).toBe(primeiro.id);
  });

  it('invariante violada: PerfilInvalido e repositório não acionado', async () => {
    await expect(
      servico().executar({ ...comando, especialidades: ['A', 'a'] }),
    ).rejects.toBeInstanceOf(PerfilInvalido);
    expect(perfis.chamadasDeAdicionar).toBe(0);
  });

  it('falha técnica de C1 não vira "usuário não reconhecido"', async () => {
    const c1ForaDoAr: ReconhecimentoDeUsuario = {
      reconhecer: () => Promise.reject(new ArmazenamentoIndisponivel()),
    };

    await expect(servico(c1ForaDoAr).executar(comando)).rejects.toBeInstanceOf(
      ArmazenamentoIndisponivel,
    );
    expect(perfis.chamadasDeAdicionar).toBe(0);
  });
});
