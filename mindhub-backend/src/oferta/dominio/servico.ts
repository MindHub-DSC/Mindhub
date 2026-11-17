import { randomUUID } from 'node:crypto';
import { CondicoesVigentesAusentes, ServicoInvalido } from './erros.js';

/** Como o Serviço é contratado (UC03). */
export const ModeloContratacao = {
  RESERVA_DIRETA: 'RESERVA_DIRETA',
  SOB_PROPOSTA: 'SOB_PROPOSTA',
} as const;

export type ModeloContratacao =
  (typeof ModeloContratacao)[keyof typeof ModeloContratacao];

export function ehModeloContratacao(
  valor: unknown,
): valor is ModeloContratacao {
  return Object.values<unknown>(ModeloContratacao).includes(valor);
}

export type SituacaoServico = 'PUBLICADO';

/**
 * Condições vigentes de contratação (D-UC03-02): preço inteiro na unidade
 * monetária mínima (ex.: centavos), moeda, duração em minutos e modalidade.
 */
export interface CondicoesVigentes {
  preco: number;
  moeda: string;
  duracaoMinutos: number;
  modalidade: string;
}

/**
 * Serviço (C2): oferta publicada por um Perfil de Especialista.
 * Guarda só a referência do perfil. Não há setters: o Serviço nasce por
 * `publicar` e muda apenas por comportamentos nomeados.
 */
export class Servico {
  private constructor(
    private readonly _id: string,
    private readonly _perfilId: string,
    private readonly _titulo: string,
    private readonly _descricao: string,
    private readonly _modeloContratacao: ModeloContratacao,
    private readonly _situacao: SituacaoServico,
    private readonly _condicoes: CondicoesVigentes | null,
  ) {}

  /**
   * UC03: única forma de nascer um Serviço. Gera a identidade própria e define
   * a situação inicial PUBLICADO (critério 1 da #36).
   */
  static publicar(dados: {
    perfilId: string;
    titulo: string;
    descricao: string;
    modeloContratacao: ModeloContratacao;
    condicoes?: CondicoesVigentes;
    agora: Date;
  }): Servico {
    const modelo = exigirModelo(dados.modeloContratacao);
    return new Servico(
      randomUUID(),
      dados.perfilId,
      dados.titulo,
      dados.descricao,
      modelo,
      'PUBLICADO',
      condicoesPara(modelo, dados.condicoes),
    );
  }

  get id(): string {
    return this._id;
  }

  get perfilId(): string {
    return this._perfilId;
  }

  get titulo(): string {
    return this._titulo;
  }

  get descricao(): string {
    return this._descricao;
  }

  get modeloContratacao(): ModeloContratacao {
    return this._modeloContratacao;
  }

  get situacao(): SituacaoServico {
    return this._situacao;
  }

  /** Cópia das condições vigentes, ou null quando não há (Sob Proposta). */
  get condicoes(): CondicoesVigentes | null {
    return this._condicoes ? { ...this._condicoes } : null;
  }
}

/** Critério 3 da #36: Reserva Direta exige condições vigentes (D-UC03-02). */
function condicoesPara(
  modelo: ModeloContratacao,
  condicoes: CondicoesVigentes | undefined,
): CondicoesVigentes | null {
  if (condicoes === undefined || condicoes === null) {
    if (modelo === ModeloContratacao.RESERVA_DIRETA) {
      throw new CondicoesVigentesAusentes();
    }
    return null;
  }
  return { ...condicoes };
}

/** Critério 2 da #36: só Reserva Direta ou Sob Proposta. */
function exigirModelo(modelo: unknown): ModeloContratacao {
  if (!ehModeloContratacao(modelo)) {
    throw new ServicoInvalido(
      'Informe o Modelo de Contratação: RESERVA_DIRETA ou SOB_PROPOSTA.',
    );
  }
  return modelo;
}
