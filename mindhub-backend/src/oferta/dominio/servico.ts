export type ModeloContratacao = 'RESERVA_DIRETA' | 'SOB_PROPOSTA';

export type SituacaoServico = 'PUBLICADO';

/** Falha provisória da fase RED do TDD (#36): comportamento ainda não implementado. */
export class NaoImplementado extends Error {
  constructor(operacao: string) {
    super(`${operacao} ainda não implementado.`);
    this.name = 'NaoImplementado';
  }
}

/**
 * Serviço (C2). STUB do contrato, só para o teste RED da #36: declara como o
 * agregado deve ser usado, sem implementar nenhuma regra de negócio.
 */
export class Servico {
  declare readonly id: string;
  declare readonly perfilId: string;
  declare readonly titulo: string;
  declare readonly descricao: string;
  declare readonly modeloContratacao: ModeloContratacao;
  declare readonly situacao: SituacaoServico;

  static publicar(_dados: {
    perfilId: string;
    titulo: string;
    descricao: string;
    modeloContratacao: ModeloContratacao;
    agora: Date;
  }): Servico {
    throw new NaoImplementado('Servico.publicar');
  }
}
