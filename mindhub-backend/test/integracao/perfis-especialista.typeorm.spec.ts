import { randomUUID } from 'node:crypto';
import { DataSource } from 'typeorm';
import { lerAmbienteDoBanco } from '../../src/config/ambiente.js';
import { opcoesTypeOrm } from '../../src/database/opcoes-typeorm.js';
import { RegistroDePerfilCorrompido } from '../../src/oferta/infra/perfil-especialista.mapper.js';
import { PerfilEspecialistaOrmEntity } from '../../src/oferta/infra/perfil-especialista.orm-entity.js';
import { PerfisEspecialistaTypeOrmRepositorio } from '../../src/oferta/infra/perfis-especialista.typeorm-repositorio.js';
import { verificarContratoDePerfis } from '../support/contrato-perfis-especialista.js';
import { limparDadosDosUsuarios } from '../support/limpeza.js';

/**
 * Porta → adaptador TypeORM → mapper → PostgreSQL real (banco de testes).
 * Sem Nest e sem HTTP: verifica só a persistência.
 */
describe('Contrato PerfisEspecialistaRepositorio — TypeORM/PostgreSQL', () => {
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
    await banco.destroy();
  });

  function repositorio() {
    return new PerfisEspecialistaTypeOrmRepositorio(
      banco.getRepository(PerfilEspecialistaOrmEntity),
    );
  }

  function novoUsuarioId() {
    const id = randomUUID();
    usuariosDoTeste.push(id);
    return id;
  }

  verificarContratoDePerfis(repositorio, novoUsuarioId);

  it('registro que o banco aceita mas o domínio não (sem especialidades) não vira perfil', async () => {
    const usuarioId = novoUsuarioId();
    // O banco não tem regra para lista vazia: essa invariante é só do domínio.
    await banco.query(
      `INSERT INTO oferta.perfis_especialista
         (id, usuario_id, descricao, especialidades, situacao, criado_em)
       VALUES ($1, $2, 'Corrompido', '{}', 'ATIVO', now())`,
      [randomUUID(), usuarioId],
    );

    await expect(
      repositorio().buscarPorUsuario(usuarioId),
    ).rejects.toBeInstanceOf(RegistroDePerfilCorrompido);
  });

  it('o banco recusa situação fora do CHECK, mesmo sem passar pelo domínio', async () => {
    await expect(
      banco.query(
        `INSERT INTO oferta.perfis_especialista
           (id, usuario_id, descricao, especialidades, situacao, criado_em)
         VALUES ($1, $2, 'X', '{A}', 'APROVADO', now())`,
        [randomUUID(), novoUsuarioId()],
      ),
    ).rejects.toMatchObject({ driverError: { code: '23514' } });
  });
});
