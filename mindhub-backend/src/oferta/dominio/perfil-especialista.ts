import { randomUUID } from 'node:crypto';
import { Especialidades } from './especialidades.js';
import { PerfilInvalido } from './erros.js';
import { ehSituacaoPerfil, SituacaoPerfil } from './situacao-perfil.js';

export const MAX_CARACTERES_DESCRICAO = 2000;

/** Dados de um perfil já registrado, usados para reconstituí-lo. */
export interface DadosDoPerfil {
  id: string;
  usuarioId: string;
  descricao: string;
  especialidades: readonly string[];
  situacao: string;
  criadoEm: Date;
}

/**
 * Perfil de Especialista (C2): atuação profissional de um Usuário.
 * Guarda só a referência do Usuário, nunca nome ou email (RN-UC02-02).
 * Não há setters: situação e dono mudam só por comportamentos nomeados.
 */
export class PerfilEspecialista {
  private constructor(
    private readonly _id: string,
    private readonly _usuarioId: string,
    private readonly _descricao: string,
    private readonly _especialidades: Especialidades,
    private readonly _situacao: SituacaoPerfil,
    private readonly _criadoEm: Date,
  ) {}

  /**
   * UC02: única forma de nascer um perfil. Aplica as invariantes, gera a
   * identidade e define a situação inicial ATIVO (D2).
   */
  static cadastrar(dados: {
    usuarioId: string;
    descricao: string;
    especialidades: readonly string[];
    agora: Date;
  }): PerfilEspecialista {
    return new PerfilEspecialista(
      randomUUID(),
      exigirReferencia(dados.usuarioId),
      validarDescricao(dados.descricao),
      Especialidades.criar(dados.especialidades),
      SituacaoPerfil.ATIVO,
      exigirData(dados.agora),
    );
  }

  /**
   * Restaura um perfil já registrado, com a identidade e a situação que ele
   * tinha. Não repete o cadastro (não gera id nem volta a ATIVO), mas recusa
   * dados que violem as invariantes.
   */
  static reconstituir(dados: DadosDoPerfil): PerfilEspecialista {
    if (!ehSituacaoPerfil(dados.situacao)) {
      throw new PerfilInvalido(
        `Situação desconhecida: ${String(dados.situacao)}.`,
      );
    }
    return new PerfilEspecialista(
      exigirReferencia(dados.id),
      exigirReferencia(dados.usuarioId),
      validarDescricao(dados.descricao),
      Especialidades.criar(dados.especialidades),
      dados.situacao,
      exigirData(dados.criadoEm),
    );
  }

  get id(): string {
    return this._id;
  }

  get usuarioId(): string {
    return this._usuarioId;
  }

  get descricao(): string {
    return this._descricao;
  }

  get especialidades(): readonly string[] {
    return this._especialidades.valores;
  }

  get situacao(): SituacaoPerfil {
    return this._situacao;
  }

  get criadoEm(): Date {
    return new Date(this._criadoEm);
  }
}

function validarDescricao(descricao: string): string {
  const aparada = descricao.trim();
  if (aparada.length === 0 || aparada.length > MAX_CARACTERES_DESCRICAO) {
    throw new PerfilInvalido(
      `A descrição deve ter de 1 a ${MAX_CARACTERES_DESCRICAO} caracteres.`,
    );
  }
  return aparada;
}

function exigirReferencia(valor: string): string {
  if (valor.trim().length === 0) {
    throw new PerfilInvalido('Referência vazia.');
  }
  return valor;
}

function exigirData(data: Date): Date {
  if (!(data instanceof Date) || Number.isNaN(data.getTime())) {
    throw new PerfilInvalido('Data de criação inválida.');
  }
  return new Date(data);
}
