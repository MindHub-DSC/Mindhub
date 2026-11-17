import type { PerfisEspecialistaRepositorio } from '../dominio/perfis-especialista.repositorio.js';
import type {
  CondicoesVigentes,
  ModeloContratacao,
  Servico,
} from '../dominio/servico.js';
import type { ServicosRepositorio } from '../dominio/servicos.repositorio.js';

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
 * Contrato da fase RED: ainda sem comportamento.
 */
export class PublicarServico {
  constructor(
    private readonly perfis: PerfisEspecialistaRepositorio,
    private readonly servicos: ServicosRepositorio,
    private readonly relogio: () => Date = () => new Date(),
  ) {}

  executar(_comando: PublicarServicoCommand): Promise<Servico> {
    return Promise.reject(
      new Error('PublicarServico.executar ainda não implementado.'),
    );
  }
}
