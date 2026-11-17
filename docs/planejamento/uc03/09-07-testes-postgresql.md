# 09-07 — Testes automatizados com PostgreSQL

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#37](https://github.com/MindHub-DSC/Mindhub/issues/37)
**Branch:** `feature/37-uc03-persistir-servico`
**Data:** 17/11/2026

## 1. Configuração dos testes com banco

| Item | Valor |
| --- | --- |
| Runner | `vitest.config.e2e.ts` (`pnpm test:e2e`): `test/integracao/**/*.spec.ts` e `test/e2e/**/*.e2e-spec.ts`, `fileParallelism: false` |
| Equivalente ao `test:integration` do material | `pnpm test:e2e` (o projeto já separava assim; nenhum script novo) |
| Banco | `mindhub_test` no mesmo servidor (`localhost:5433` → contêiner 5432) |
| Seleção do banco | `test/setup/ambiente-de-teste.ts` → `apontarParaBancoDeTeste()`: exige `DB_TEST_NAME` com sufixo `_test` e diferente de `DB_NAME`, e troca `DB_NAME` por ele |
| Migrations | `test/setup/global-setup.ts` cria o banco se faltar e roda `runMigrations`; o arquivo de teste repete `runMigrations` (idempotente) |
| `DataSource` | `new DataSource(opcoesTypeOrm(lerAmbienteDoBanco()))`: `entities: ENTIDADES_ORM` (inclui `ServicoOrmEntity` e a de perfis, por causa da FK), `migrations: MIGRACOES` (inclui `ServicosDoUc031794941417929`), **`synchronize: false`** |
| Suíte sem banco | `pnpm test` (`vitest.config.ts`, só `test/unit/`) continua sem PostgreSQL |

## 2. Os 10 pontos de segurança

| # | Ponto | Situação |
| --- | --- | --- |
| 1 | Banco exclusivo de testes | `mindhub_test` (banco isolado; mesmo serviço Docker) |
| 2 | Variáveis de teste | `DB_TEST_NAME` (o projeto não usa `TEST_DB_*`) |
| 3 | Host e porta | `localhost:5433` (`DB_HOST`/`DB_PORT`) |
| 4 | Nome distinto | Imposto em código (sufixo `_test`, diferente de `DB_NAME`) e conferido no teste por `current_database()` |
| 5 | Usuário de testes | `mindhub` |
| 6 | Credenciais distintas | **Não**: mesmo usuário do desenvolvimento, por decisão registrada no `09-02` |
| 7 | Sem produção | Não há ambiente de produção configurado |
| 8 | Portas Docker | 5433 publicada × 5432 interna; o teste **não** exige `inet_server_port() = 5433` |
| 9 | Migrations | As versionadas, pela mesma lista `MIGRACOES` da aplicação |
| 10 | Autorização | Aplicar migrations no `mindhub_test` é o fluxo do projeto (`global-setup`). Nenhum `TRUNCATE`/`DROP` |

## 3. Arquivo de teste — `test/integracao/servicos.typeorm.spec.ts`

Arquivo único. O roteiro de 11 passos do material está distribuído assim: 1 a 5 no `beforeAll` (DataSource, conexão, identidade, porta, migrations); 6 a 10 nos testes (adaptador real, Serviço válido, `adicionar`, leitura direta por SQL, comparação); 11 no `afterAll` e no `catch` do `beforeAll`.

```ts
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
```

A suíte de contrato usada (`test/support/contrato-servicos.ts`) é a mesma do adaptador em memória; ela passou a receber `novoPerfilId` (o PostgreSQL exige um perfil real pela FK) e a conferir `publicadoEm`.

### Salvaguardas

| Salvaguarda | Onde |
| --- | --- |
| Identidade conferida antes de qualquer escrita | `beforeAll`: `current_database() = DB_TEST_NAME`, sufixo `_test`, `current_user = DB_USER` |
| Sem exigir a porta do host | `inet_server_port()` só precisa ser número (retorna 5432; o cliente usou 5433) |
| Sem `TRUNCATE` | Limpeza por id: `limparDadosDosUsuarios` apaga Serviços, perfis e usuários **só** dos usuários criados no teste |
| Encerramento seguro | `afterAll`: `if (banco?.isInitialized) await banco.destroy()`; o `catch` do `beforeAll` também destrói a conexão se a verificação falhar |
| Sem senhas | O teste lê o `.env` pela função do projeto; nenhum valor é impresso |

## 4. Execuções

### Teste de integração isolado

```text
$ pnpm exec vitest run --config ./vitest.config.e2e.ts test/integracao/servicos.typeorm.spec.ts --reporter=verbose
 ✓ … > adiciona e busca o mesmo Serviço pelo identificador 34ms
 ✓ … > preserva Serviço Sob Proposta sem condições 12ms
 ✓ … > devolve null para identificador desconhecido 1ms
 ✓ … > lista os Serviços do perfil na ordem de registro, sem os de outros perfis 18ms
 ✓ … > lista vazia para perfil sem Serviços 2ms
 ✓ … > devolve cópias defensivas: alterar o retorno não altera o registro 15ms
 ✓ … > grava pelo adaptador e o registro no banco coincide com o Serviço 9ms
 ✓ … > registro que o banco aceita mas o domínio não (título só espaços) não vira Serviço 14ms
 ✓ … > o banco recusa Serviço de perfil inexistente (fk_servicos_perfil) 2ms
 ✓ … > o banco recusa Reserva Direta sem condições (CHECK) 7ms
 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  16:00:10
   Duration  1.22s (transform 144ms, setup 83ms, import 361ms, tests 200ms, environment 0ms)
```

`…` = `test/integracao/servicos.typeorm.spec.ts > Contrato ServicosRepositorio — TypeORM/PostgreSQL`.

### Suítes completas (regressão)

```text
$ pnpm test
 Test Files  12 passed (12)
      Tests  110 passed (110)
   Start at  16:00:22
   Duration  2.47s (transform 976ms, setup 0ms, import 6.02s, tests 1.08s, environment 3ms)
$ pnpm test:e2e
 Test Files  6 passed (6)
      Tests  35 passed (35)
   Start at  16:00:25
   Duration  6.44s (transform 318ms, setup 409ms, import 2.98s, tests 1.58s, environment 1ms)
$ pnpm exec vitest run test/unit/oferta/publicar-servico.spec.ts test/unit/oferta/servicos.http.spec.ts test/unit/oferta/servicos.integracao.spec.ts
 Test Files  3 passed (3)
      Tests  22 passed (22)
$ pnpm lint   → 0 avisos
$ pnpm build  → build exit=0
```

### Evolução em relação à linha de base (`09-01`, depois da regularização)

| Suíte | Linha de base | Agora | Diferença |
| --- | --- | --- | --- |
| `pnpm test` (sem banco) | 11 arquivos, 107 | 12 arquivos, **110** | +3 (`servicos.typeorm-repositorio.spec.ts`, falha de conexão) |
| `pnpm test:e2e` (PostgreSQL) | 5 arquivos, 25 | 6 arquivos, **35** | +10 (`servicos.typeorm.spec.ts`) |

Nenhuma regressão. A única alteração em teste anterior foi a **montagem** do `servicos.integracao.spec.ts` (overrides, `09-05` seção 4), sem mudança de asserção.

## 5. Diagnóstico estruturado dos problemas (Fase 10)

| # | Categoria | Sintoma | Evidência | Componente | Causa raiz | Correção | Verificação |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | TypeORM / DI | Teste integrado em memória (Material 08) falhou depois da troca do provider | `Nest can't resolve dependencies of the ServicoOrmEntityRepository (?) … DataSource at index [0]` | `servicos.integracao.spec.ts` + `OfertaModule` | `forFeature([…, ServicoOrmEntity])` exige `DataSource`, ausente no teste sem banco (risco previsto no `08-07`) | Override de `getRepositoryToken(ServicoOrmEntity)` e de `SERVICOS_REPOSITORIO` (memória) | `pnpm test` 110/110 |
| 2 | Conexão | `inet_server_port()` vazio no `psql` dentro do contêiner | Linha `mindhub_test` + `mindhub` + porta vazia (`09-02`) | Consulta de inspeção | `psql` sem `-h` usa socket Unix; a função só tem valor em TCP | `psql -h localhost` e cliente `pg` no host | `5432` nos dois casos (`09-02`) |
| 3 | Persistência / contrato | Ordem de `listarPorPerfil` não seria garantida por `publicado_em` | A suíte de contrato publica vários Serviços com o mesmo `agora` | Entidade ORM | PostgreSQL não garante ordem de inserção; empate de `publicado_em` | Coluna técnica `ordem` (identity) + índice | Teste "lista … na ordem de registro" verde no PostgreSQL |
| 4 | Persistência / FK | A suíte de contrato usava `perfilId` aleatório | Seria violação de `fk_servicos_perfil` (23503) | `contrato-servicos.ts` | O banco exige perfil existente | Fábrica `novoPerfilId` (cria perfil real no PostgreSQL) | Contrato 6/6 nos dois adaptadores |
| 5 | Ferramentas (não é defeito do projeto) | `build exit=1` depois do merge | Saída do comando composto | Script da sessão | `grep -c` sai com 1 ao contar 0 avisos e o `&&` pulou o build | Rodar `pnpm build` separado | `build exit=0` nas branches #38 e #40 (`09-01`) |
| 6 | Ferramentas (não é defeito do projeto) | Comentário de correção não apareceu na #37 | O link devolvido era o do comentário anterior | `gh issue comment -q` | `-q` não é opção do subcomando; o erro estava escondido | Repetido sem `-q` | Comentário publicado (`09-01` seção 7) |

Nenhuma correção usou operação destrutiva (`DROP`, `TRUNCATE`, `migration:revert`, `down -v`).
