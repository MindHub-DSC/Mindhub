import { randomUUID } from 'node:crypto';
import { DataSource } from 'typeorm';
import { lerAmbienteDoBanco } from '../../src/config/ambiente.js';
import { opcoesTypeOrm } from '../../src/database/opcoes-typeorm.js';
import { PerfilEspecialista } from '../../src/oferta/dominio/perfil-especialista.js';
import { PerfilEspecialistaOrmEntity } from '../../src/oferta/infra/perfil-especialista.orm-entity.js';
import { PerfisEspecialistaTypeOrmRepositorio } from '../../src/oferta/infra/perfis-especialista.typeorm-repositorio.js';
import { ServicoOrmEntity } from '../../src/oferta/infra/servico.orm-entity.js';
import { ServicosTypeOrmRepositorio } from '../../src/oferta/infra/servicos.typeorm-repositorio.js';
import { verificarContratoDeServicos } from '../support/contrato-servicos.js';
import { limparDadosDosUsuarios } from '../support/limpeza.js';

/**
 * Porta ServicosRepositorio → adaptador TypeORM → mapper → PostgreSQL real
 * (banco de testes, #37). Sem Nest e sem HTTP: verifica só a persistência.
 * Roda a MESMA suíte de contrato do adaptador em memória.
 */
describe('Contrato ServicosRepositorio — TypeORM/PostgreSQL', () => {
  let banco: DataSource;
  const usuariosDoTeste: string[] = [];

  beforeAll(async () => {
    banco = new DataSource(opcoesTypeOrm(lerAmbienteDoBanco()));
    await banco.initialize();
  });

  afterEach(async () => {
    await limparDadosDosUsuarios(banco, usuariosDoTeste.splice(0));
  });

  afterAll(async () => {
    if (banco?.isInitialized) await banco.destroy();
  });

  function repositorio() {
    return new ServicosTypeOrmRepositorio(
      banco.getRepository(ServicoOrmEntity),
    );
  }

  /** Cria um perfil ATIVO real (a FK exige) e o registra para limpeza. */
  async function novoPerfilId(): Promise<string> {
    const usuarioId = randomUUID();
    usuariosDoTeste.push(usuarioId);
    const perfil = PerfilEspecialista.cadastrar({
      usuarioId,
      descricao: 'Consultora de produto',
      especialidades: ['Discovery'],
      agora: new Date('2026-11-17T12:00:00.000Z'),
    });
    await new PerfisEspecialistaTypeOrmRepositorio(
      banco.getRepository(PerfilEspecialistaOrmEntity),
    ).adicionar(perfil);
    return perfil.id;
  }

  verificarContratoDeServicos(repositorio, novoPerfilId);
});
