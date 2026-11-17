import { randomUUID } from 'node:crypto';
import { DataSource } from 'typeorm';
import { lerAmbienteDoBanco } from '../../src/config/ambiente.js';
import { opcoesTypeOrm } from '../../src/database/opcoes-typeorm.js';
import { PerfilEspecialista } from '../../src/oferta/dominio/perfil-especialista.js';
import { Servico } from '../../src/oferta/dominio/servico.js';
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
 *
 * Segurança (Material 09): test/setup/ambiente-de-teste.ts já apontou
 * DB_NAME para DB_TEST_NAME (sufixo _test obrigatório). Antes de qualquer
 * escrita, o beforeAll confere a identidade REAL da conexão no servidor.
 * Nada é truncado: cada teste apaga só os registros dos usuários que criou.
 */
describe('Contrato ServicosRepositorio — TypeORM/PostgreSQL', () => {
  let banco: DataSource;
  const usuariosDoTeste: string[] = [];

  beforeAll(async () => {
    const ambiente = lerAmbienteDoBanco();
    banco = new DataSource(opcoesTypeOrm(ambiente));
    try {
      await banco.initialize();

      // Identidade informada pelo servidor (não pela configuração do cliente).
      const [identidade] = (await banco.query(
        'SELECT current_database() AS banco, current_user AS usuario, inet_server_port() AS porta',
      )) as { banco: string; usuario: string; porta: number | null }[];
      expect(identidade.banco).toBe(process.env.DB_TEST_NAME);
      expect(identidade.banco).toMatch(/_test$/);
      expect(identidade.usuario).toBe(ambiente.DB_USER);
      // O cliente usa a porta publicada no host (DB_PORT); o servidor informa
      // a porta interna do contêiner. Só se exige que seja uma porta TCP.
      expect(typeof identidade.porta).toBe('number');

      // Migrations versionadas (o global-setup já aplicou; aqui é idempotente).
      await banco.runMigrations({ transaction: 'each' });
    } catch (erro) {
      if (banco.isInitialized) await banco.destroy();
      throw erro;
    }
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

  it('grava pelo adaptador e o registro no banco coincide com o Serviço', async () => {
    const servico = Servico.publicar({
      perfilId: await novoPerfilId(),
      titulo: 'Mentoria de produto',
      descricao: 'Sessões de discovery para times iniciantes',
      modeloContratacao: 'RESERVA_DIRETA',
      condicoes: {
        preco: 15000,
        moeda: 'BRL',
        duracaoMinutos: 60,
        modalidade: 'ONLINE',
      },
      agora: new Date('2026-11-17T12:00:00.000Z'),
    });

    await repositorio().adicionar(servico);

    // Leitura direta, sem passar pelo mapper nem pelo adaptador.
    const linhas = (await banco.query(
      `SELECT id, perfil_id, titulo, descricao, modelo_contratacao, situacao,
              preco, moeda, duracao_minutos, modalidade, publicado_em
         FROM oferta.servicos WHERE id = $1`,
      [servico.id],
    )) as Record<string, unknown>[];
    expect(linhas).toHaveLength(1);
    expect(linhas[0]).toEqual({
      id: servico.id,
      perfil_id: servico.perfilId,
      titulo: 'Mentoria de produto',
      descricao: 'Sessões de discovery para times iniciantes',
      modelo_contratacao: 'RESERVA_DIRETA',
      situacao: 'PUBLICADO',
      preco: 15000,
      moeda: 'BRL',
      duracao_minutos: 60,
      modalidade: 'ONLINE',
      publicado_em: new Date('2026-11-17T12:00:00.000Z'),
    });
  });

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
