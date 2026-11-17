import { randomUUID } from 'node:crypto';
import { DataSource } from 'typeorm';
import { lerAmbienteDoBanco } from '../../src/config/ambiente.js';
import { opcoesTypeOrm } from '../../src/database/opcoes-typeorm.js';
import { PerfilEspecialista } from '../../src/oferta/dominio/perfil-especialista.js';
import { PerfilEspecialistaOrmEntity } from '../../src/oferta/infra/perfil-especialista.orm-entity.js';
import { PerfisEspecialistaTypeOrmRepositorio } from '../../src/oferta/infra/perfis-especialista.typeorm-repositorio.js';
import { RegistroDeServicoCorrompido } from '../../src/oferta/infra/servico.mapper.js';
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

  // Esquema (migration ServicosDoUc03): o banco protege sozinho, mesmo sem
  // passar pelo domínio.
  function inserirDireto(
    perfilId: string,
    modelo: string,
    preco: number | null,
  ) {
    return banco.query(
      `INSERT INTO oferta.servicos
         (id, perfil_id, titulo, descricao, modelo_contratacao, situacao,
          preco, moeda, duracao_minutos, modalidade, publicado_em)
       VALUES ($1, $2, 'T', 'D', $3, 'PUBLICADO', $4, $5, $6, $7, now())`,
      [
        randomUUID(),
        perfilId,
        modelo,
        preco,
        preco === null ? null : 'BRL',
        preco === null ? null : 60,
        preco === null ? null : 'ONLINE',
      ],
    );
  }

  it('registro que o banco aceita mas o domínio não (título só espaços) não vira Serviço', async () => {
    const perfilId = await novoPerfilId();
    const id = randomUUID();
    // O banco não tem regra para título só com espaços: é invariante do domínio.
    await banco.query(
      `INSERT INTO oferta.servicos
         (id, perfil_id, titulo, descricao, modelo_contratacao, situacao, publicado_em)
       VALUES ($1, $2, '   ', 'Discovery', 'SOB_PROPOSTA', 'PUBLICADO', now())`,
      [id, perfilId],
    );

    await expect(repositorio().buscarPorId(id)).rejects.toBeInstanceOf(
      RegistroDeServicoCorrompido,
    );
  });

  it('o banco recusa Serviço de perfil inexistente (fk_servicos_perfil)', async () => {
    await expect(
      inserirDireto(randomUUID(), 'SOB_PROPOSTA', null),
    ).rejects.toMatchObject({
      driverError: { code: '23503', constraint: 'fk_servicos_perfil' },
    });
  });

  it('o banco recusa Reserva Direta sem condições (CHECK)', async () => {
    await expect(
      inserirDireto(await novoPerfilId(), 'RESERVA_DIRETA', null),
    ).rejects.toMatchObject({
      driverError: {
        code: '23514',
        constraint: 'ck_servicos_reserva_direta_com_condicoes',
      },
    });
  });
});
