import type { PerfisEspecialistaRepositorio } from '../dominio/perfis-especialista.repositorio.js';
import {
  Servico,
  type CondicoesVigentes,
  type ModeloContratacao,
} from '../dominio/servico.js';
import type { ServicosRepositorio } from '../dominio/servicos.repositorio.js';
import { SituacaoPerfil } from '../dominio/situacao-perfil.js';

/**
 * Intenção "quero publicar um Serviço", independente de HTTP.
 * D-UC03-05 (proposta): usuarioId é o identificador do ator, informado pelo
 * cliente enquanto não existe autenticação (mesma limitação da D1 do UC02).
 */
export interface PublicarServicoCommand {
  usuarioId: string;
  titulo: string;
  descricao: string;
  modeloContratacao: ModeloContratacao;
  condicoes?: CondicoesVigentes;
}

/** FE-02: o ator não possui Perfil de Especialista. */
export class AtorSemPerfil extends Error {
  constructor() {
    super('O usuário não possui perfil de especialista.');
    this.name = 'AtorSemPerfil';
  }
}

/** FE-03 / RN01: só perfil ATIVO publica Serviços. */
export class PerfilSuspenso extends Error {
  constructor() {
    super('Perfil de especialista suspenso não pode publicar Serviços.');
    this.name = 'PerfilSuspenso';
  }
}

/**
 * UC03 — Publicar Serviço (#38).
 * Só coordena: obtém o perfil do ator, pede ao domínio que crie o Serviço e
 * ao repositório que o registre. Não decide as invariantes do Serviço.
 */
export class PublicarServico {
  constructor(
    private readonly perfis: PerfisEspecialistaRepositorio,
    private readonly servicos: ServicosRepositorio,
    private readonly relogio: () => Date = () => new Date(),
  ) {}

  async executar(comando: PublicarServicoCommand): Promise<Servico> {
    const perfil = await this.perfis.buscarPorUsuario(comando.usuarioId);
    if (!perfil) throw new AtorSemPerfil();
    if (perfil.situacao !== SituacaoPerfil.ATIVO) throw new PerfilSuspenso();

    const servico = Servico.publicar({
      perfilId: perfil.id,
      titulo: comando.titulo,
      descricao: comando.descricao,
      modeloContratacao: comando.modeloContratacao,
      condicoes: comando.condicoes,
      agora: this.relogio(),
    });
    await this.servicos.adicionar(servico);
    return servico;
  }
}
