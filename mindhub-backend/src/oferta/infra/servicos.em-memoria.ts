import { Servico, type DadosDoServico } from '../dominio/servico.js';
import type { ServicosRepositorio } from '../dominio/servicos.repositorio.js';

/**
 * Implementação em memória da porta ServicosRepositorio.
 * Usada nos testes e, provisoriamente, pela aplicação até existir a
 * persistência TypeORM (#37): os registros se perdem ao reiniciar.
 * Guarda dados copiados, nunca a referência do objeto recebido, e devolve
 * Serviços reconstituídos a cada leitura (cópias defensivas).
 */
export class ServicosEmMemoria implements ServicosRepositorio {
  private readonly registros: DadosDoServico[] = [];
  chamadasDeAdicionar = 0;

  adicionar(servico: Servico): Promise<void> {
    this.chamadasDeAdicionar++;
    this.registros.push(servico.paraDados());
    return Promise.resolve();
  }

  buscarPorId(id: string): Promise<Servico | null> {
    const dados = this.registros.find((registro) => registro.id === id);
    return Promise.resolve(dados ? Servico.reconstituir(dados) : null);
  }

  listarPorPerfil(perfilId: string): Promise<Servico[]> {
    return Promise.resolve(
      this.registros
        .filter((registro) => registro.perfilId === perfilId)
        .map((registro) => Servico.reconstituir(registro)),
    );
  }
}
