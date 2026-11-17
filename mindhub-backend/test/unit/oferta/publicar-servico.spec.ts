import { randomUUID } from 'node:crypto';
import {
  AtorSemPerfil,
  PerfilSuspenso,
  PublicarServico,
} from '../../../src/oferta/aplicacao/publicar-servico.js';
import {
  CondicoesVigentesAusentes,
  ServicoInvalido,
} from '../../../src/oferta/dominio/erros.js';
import { PerfilEspecialista } from '../../../src/oferta/dominio/perfil-especialista.js';
import { PerfisEspecialistaEmMemoria } from '../../support/perfis-especialista.em-memoria.js';
import { ServicosEmMemoria } from '../../support/servicos.em-memoria.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const agora = new Date('2026-11-17T12:00:00.000Z');

describe('PublicarServico (aplicação, com dublês)', () => {
  let perfis: PerfisEspecialistaEmMemoria;
  let servicos: ServicosEmMemoria;
  let perfilAtivo: PerfilEspecialista;

  beforeEach(async () => {
    perfis = new PerfisEspecialistaEmMemoria();
    servicos = new ServicosEmMemoria();
    perfilAtivo = PerfilEspecialista.cadastrar({
      usuarioId: randomUUID(),
      descricao: 'Consultora de produto',
      especialidades: ['Discovery'],
      agora,
    });
    await perfis.adicionar(perfilAtivo);
  });

  function publicarServico() {
    return new PublicarServico(perfis, servicos, () => agora);
  }

  const reservaDireta = {
    titulo: 'Mentoria de produto',
    descricao: 'Sessões de discovery',
    modeloContratacao: 'RESERVA_DIRETA' as const,
    condicoes: {
      preco: 15000,
      moeda: 'BRL',
      duracaoMinutos: 60,
      modalidade: 'ONLINE',
    },
  };

  // Critério 1 da #38: ator com perfil ATIVO publica o Serviço e recebe
  // identificador, modelo e situação publicada.
  it('publica o Serviço do perfil ATIVO e o registra', async () => {
    const servico = await publicarServico().executar({
      usuarioId: perfilAtivo.usuarioId,
      ...reservaDireta,
    });

    expect(servico.id).toMatch(UUID);
    expect(servico.perfilId).toBe(perfilAtivo.id);
    expect(servico.modeloContratacao).toBe('RESERVA_DIRETA');
    expect(servico.situacao).toBe('PUBLICADO');
    expect((await servicos.buscarPorId(servico.id))?.titulo).toBe(
      'Mentoria de produto',
    );
  });

  // Critério 4 da #38 (FA-01): o mesmo perfil publica um segundo Serviço sem
  // conflito.
  it('o mesmo perfil publica um segundo Serviço', async () => {
    const caso = publicarServico();
    const primeiro = await caso.executar({
      usuarioId: perfilAtivo.usuarioId,
      ...reservaDireta,
    });
    const segundo = await caso.executar({
      usuarioId: perfilAtivo.usuarioId,
      titulo: 'Consultoria',
      descricao: 'Escopo combinado na proposta',
      modeloContratacao: 'SOB_PROPOSTA',
    });

    const doPerfil = await servicos.listarPorPerfil(perfilAtivo.id);
    expect(doPerfil.map((s) => s.id)).toEqual([primeiro.id, segundo.id]);
  });

  // Critério 2 da #38 (FE-02): ator sem Perfil de Especialista é recusado.
  it('recusa ator sem perfil e não registra nada', async () => {
    await expect(
      publicarServico().executar({ usuarioId: randomUUID(), ...reservaDireta }),
    ).rejects.toBeInstanceOf(AtorSemPerfil);
    expect(servicos.chamadasDeAdicionar).toBe(0);
  });

  // Critério 3 da #38 (FE-03, RN01): perfil SUSPENSO é recusado.
  it('recusa perfil SUSPENSO e não registra nada', async () => {
    const suspenso = PerfilEspecialista.reconstituir({
      id: randomUUID(),
      usuarioId: randomUUID(),
      descricao: 'Perfil suspenso',
      especialidades: ['Mentoria'],
      situacao: 'SUSPENSO',
      criadoEm: agora,
    });
    await perfis.adicionar(suspenso);

    await expect(
      publicarServico().executar({
        usuarioId: suspenso.usuarioId,
        ...reservaDireta,
      }),
    ).rejects.toBeInstanceOf(PerfilSuspenso);
    expect(servicos.chamadasDeAdicionar).toBe(0);
  });

  // Critérios 5 e 6 da #38: recusa de domínio é distinguível da recusa de
  // elegibilidade, e nenhuma recusa registra o Serviço.
  it.each([
    [
      'Reserva Direta sem condições',
      { modeloContratacao: 'RESERVA_DIRETA' as const, condicoes: undefined },
      CondicoesVigentesAusentes,
    ],
    [
      'modelo ausente',
      { modeloContratacao: undefined as never, condicoes: undefined },
      ServicoInvalido,
    ],
  ])(
    'recusa de domínio (%s) não é recusa de elegibilidade e não registra nada',
    async (_caso, alteracao, erroEsperado) => {
      const recusa = publicarServico().executar({
        usuarioId: perfilAtivo.usuarioId,
        ...reservaDireta,
        ...alteracao,
      });

      await expect(recusa).rejects.toBeInstanceOf(erroEsperado);
      await expect(recusa).rejects.not.toBeInstanceOf(AtorSemPerfil);
      await expect(recusa).rejects.not.toBeInstanceOf(PerfilSuspenso);
      expect(servicos.chamadasDeAdicionar).toBe(0);
    },
  );
});
