import type { ReconhecimentoDeUsuario } from '../../identidade/publico/reconhecimento-de-usuario.js';
import { PerfilEspecialista } from '../dominio/perfil-especialista.js';
import type { PerfisEspecialistaRepositorio } from '../dominio/perfis-especialista.repositorio.js';

/** Intenção "quero atuar como especialista", independente de HTTP. */
export interface CadastrarPerfilEspecialistaCommand {
  usuarioId: string;
  descricao: string;
  especialidades: readonly string[];
}

/** A referência informada não corresponde a nenhum Usuário de C1. */
export class UsuarioNaoReconhecido extends Error {
  constructor() {
    super('Usuário não reconhecido.');
    this.name = 'UsuarioNaoReconhecido';
  }
}

/**
 * UC02 — Cadastrar Perfil de Especialista.
 * Só coordena: reconhece o usuário (C1), pede ao domínio que crie o perfil e
 * ao repositório que o registre. Não decide limites, situação nem unicidade.
 */
export class CadastrarPerfilEspecialista {
  constructor(
    private readonly reconhecimento: ReconhecimentoDeUsuario,
    private readonly perfis: PerfisEspecialistaRepositorio,
    private readonly relogio: () => Date = () => new Date(),
  ) {}

  async executar(
    comando: CadastrarPerfilEspecialistaCommand,
  ): Promise<PerfilEspecialista> {
    // Falha técnica de C1 é propagada como erro, nunca vira "não reconhecido".
    if (!(await this.reconhecimento.reconhecer(comando.usuarioId))) {
      throw new UsuarioNaoReconhecido();
    }
    const perfil = PerfilEspecialista.cadastrar({
      ...comando,
      agora: this.relogio(),
    });
    await this.perfis.adicionar(perfil);
    return perfil;
  }
}
