import type { Repository } from 'typeorm';
import { traduzirFalhaDeConexao } from '../../compartilhado/infra/erros-de-banco.js';
import type { Servico } from '../dominio/servico.js';
import type { ServicosRepositorio } from '../dominio/servicos.repositorio.js';
import { ServicoMapper } from './servico.mapper.js';
import type { ServicoOrmEntity } from './servico.orm-entity.js';

/**
 * Adaptador TypeORM da porta ServicosRepositorio (#37).
 * Criado pelo OfertaModule por useFactory (padrão do UC02), sem decorators:
 * recebe o Repository<ServicoOrmEntity> já resolvido pelo TypeOrmModule.
 * Falhas de conexão viram ArmazenamentoIndisponivel; demais erros seguem.
 */
export class ServicosTypeOrmRepositorio implements ServicosRepositorio {
  constructor(private readonly orm: Repository<ServicoOrmEntity>) {}

  async adicionar(servico: Servico): Promise<void> {
    try {
      // insert, e não save: save faria UPDATE se o id já existisse.
      await this.orm.insert(ServicoMapper.paraOrm(servico));
    } catch (erro) {
      throw traduzirFalhaDeConexao(erro);
    }
  }

  async buscarPorId(id: string): Promise<Servico | null> {
    let registro: ServicoOrmEntity | null;
    try {
      registro = await this.orm.findOneBy({ id });
    } catch (erro) {
      throw traduzirFalhaDeConexao(erro);
    }
    return registro ? ServicoMapper.paraDominio(registro) : null;
  }

  async listarPorPerfil(perfilId: string): Promise<Servico[]> {
    let registros: ServicoOrmEntity[];
    try {
      // "ordem" (identity) dá a ordem de registro exigida pelo contrato.
      registros = await this.orm.find({
        where: { perfilId },
        order: { ordem: 'ASC' },
      });
    } catch (erro) {
      throw traduzirFalhaDeConexao(erro);
    }
    return registros.map((registro) => ServicoMapper.paraDominio(registro));
  }
}
