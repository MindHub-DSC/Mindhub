import { ServicoInvalido } from '../dominio/erros.js';
import { Servico } from '../dominio/servico.js';
import { ServicoOrmEntity } from './servico.orm-entity.js';

/** O banco devolveu um registro que não forma um Serviço válido. */
export class RegistroDeServicoCorrompido extends Error {
  constructor(id: string, options: { cause: unknown }) {
    super(`Registro de Serviço inválido no armazenamento (id ${id}).`, options);
    this.name = 'RegistroDeServicoCorrompido';
  }
}

/**
 * Tradução Servico ↔ ServicoOrmEntity (#37).
 * Não decide nada: lê o agregado por paraDados() e o restaura com
 * Servico.reconstituir (que valida, mas não gera id nem muda a situação).
 * As condições vigentes são "achatadas" em quatro colunas; "ordem" é técnica
 * e não passa para o domínio.
 */
export const ServicoMapper = {
  paraOrm(servico: Servico): ServicoOrmEntity {
    const dados = servico.paraDados();
    const registro = new ServicoOrmEntity();
    registro.id = dados.id;
    registro.perfilId = dados.perfilId;
    registro.titulo = dados.titulo;
    registro.descricao = dados.descricao;
    registro.modeloContratacao = dados.modeloContratacao;
    registro.situacao = dados.situacao;
    registro.preco = dados.condicoes?.preco ?? null;
    registro.moeda = dados.condicoes?.moeda ?? null;
    registro.duracaoMinutos = dados.condicoes?.duracaoMinutos ?? null;
    registro.modalidade = dados.condicoes?.modalidade ?? null;
    registro.publicadoEm = dados.publicadoEm;
    return registro;
  },

  paraDominio(registro: ServicoOrmEntity): Servico {
    try {
      return Servico.reconstituir({
        id: registro.id,
        perfilId: registro.perfilId,
        titulo: registro.titulo,
        descricao: registro.descricao,
        modeloContratacao: registro.modeloContratacao,
        situacao: registro.situacao,
        condicoes:
          registro.preco === null
            ? null
            : {
                preco: registro.preco,
                moeda: registro.moeda as string,
                duracaoMinutos: registro.duracaoMinutos as number,
                modalidade: registro.modalidade as string,
              },
        publicadoEm: registro.publicadoEm,
      });
    } catch (erro) {
      // Dado inválido vindo do banco é defeito técnico (500), não erro do cliente.
      if (erro instanceof ServicoInvalido) {
        throw new RegistroDeServicoCorrompido(registro.id, { cause: erro });
      }
      throw erro;
    }
  },
};
