# 09-04 — Entidade ORM, mapper e migration

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#37](https://github.com/MindHub-DSC/Mindhub/issues/37)
**Branch:** `feature/37-uc03-persistir-servico` (criada a partir de `feature/40-uc03-endpoint-publicar-servico` @ `7eb5cf7`)
**Data:** 17/11/2026

```text
$ git switch -c feature/37-uc03-persistir-servico feature/40-uc03-endpoint-publicar-servico
Switched to a new branch 'feature/37-uc03-persistir-servico'
```

## 1. Ordem de trabalho (TDD)

| Commit | Fase | Conteúdo |
| --- | --- | --- |
| `c819fc2` | RED | Suíte de contrato contra o adaptador TypeORM (`test/integracao/servicos.typeorm.spec.ts`), 6 falhas pelo adaptador vazio. Contrato: `ServicoOrmEntity` (registrada em `ENTIDADES_ORM`) e `ServicosTypeOrmRepositorio` sem comportamento. A suíte de contrato passa a receber uma fábrica de `perfilId` e a conferir `publicadoEm` |
| `c8dd26e` | Migration | `ServicosDoUc031794941417929` gerada, registrada em `MIGRACOES` e aplicada; limpeza dos testes apaga Serviços antes dos perfis; 2 testes do esquema |
| Fase 6 | GREEN | Mapper e adaptador |

```text
$ pnpm exec vitest run --config ./vitest.config.e2e.ts test/integracao/servicos.typeorm.spec.ts   (RED, c819fc2)
      6 Error: ServicosTypeOrmRepositorio ainda não implementado.
      Tests  6 failed (6)
$ pnpm test   (unitários, sem banco)
 Test Files  11 passed (11)
      Tests  107 passed (107)
```

## 2. Entidade ORM — `src/oferta/infra/servico.orm-entity.ts`

```ts
import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { PerfilEspecialistaOrmEntity } from './perfil-especialista.orm-entity.js';

/**
 * Registro persistido de um Serviço (schema "oferta", #37).
 * Não é a entidade de domínio: o mapeamento fica em ServicoMapper.
 *
 * - perfil_id tem chave estrangeira para oferta.perfis_especialista: o perfil
 *   e o Serviço são do mesmo contexto (C2). Sem UNIQUE: 1 perfil : 0..* Serviços.
 * - As condições vigentes ficam em colunas nulas: todas preenchidas ou todas
 *   nulas, e obrigatórias em RESERVA_DIRETA (D-UC03-02/03), por CHECK.
 * - "ordem" é técnica (identity): garante a ordem de registro exigida por
 *   listarPorPerfil mesmo quando dois Serviços têm o mesmo publicado_em.
 *   Não existe no domínio.
 */
@Entity({ name: 'servicos', schema: 'oferta' })
@Index('ix_servicos_perfil_ordem', ['perfilId', 'ordem'])
@Check(
  'ck_servicos_modelo_contratacao',
  `"modelo_contratacao" IN ('RESERVA_DIRETA', 'SOB_PROPOSTA')`,
)
@Check('ck_servicos_situacao', `"situacao" IN ('PUBLICADO')`)
@Check(
  'ck_servicos_condicoes_completas',
  `("preco" IS NULL AND "moeda" IS NULL AND "duracao_minutos" IS NULL AND "modalidade" IS NULL) OR ("preco" IS NOT NULL AND "moeda" IS NOT NULL AND "duracao_minutos" IS NOT NULL AND "modalidade" IS NOT NULL)`,
)
@Check(
  'ck_servicos_reserva_direta_com_condicoes',
  `"modelo_contratacao" <> 'RESERVA_DIRETA' OR "preco" IS NOT NULL`,
)
@Check('ck_servicos_preco', `"preco" >= 0`)
@Check('ck_servicos_duracao', `"duracao_minutos" > 0`)
export class ServicoOrmEntity {
  /** Gerado pelo domínio (randomUUID), não pelo banco. */
  @PrimaryColumn({ type: 'uuid', primaryKeyConstraintName: 'pk_servicos' })
  id: string;

  @Column({ name: 'perfil_id', type: 'uuid' })
  perfilId: string;

  @ManyToOne(() => PerfilEspecialistaOrmEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'perfil_id',
    foreignKeyConstraintName: 'fk_servicos_perfil',
  })
  perfil?: PerfilEspecialistaOrmEntity;

  /** Limite decidido em 17/11/2026 (#36); o domínio também o impõe. */
  @Column({ type: 'varchar', length: 120 })
  titulo: string;

  /** Limite decidido em 17/11/2026 (#36); o domínio também o impõe. */
  @Column({ type: 'varchar', length: 2000 })
  descricao: string;

  @Column({ name: 'modelo_contratacao', type: 'varchar', length: 20 })
  modeloContratacao: string;

  @Column({ type: 'varchar', length: 20 })
  situacao: string;

  /** Unidade monetária mínima (ex.: centavos). */
  @Column({ type: 'integer', nullable: true })
  preco: number | null;

  /** Sem limite de tamanho: o domínio não define um (decisão técnica). */
  @Column({ type: 'text', nullable: true })
  moeda: string | null;

  @Column({ name: 'duracao_minutos', type: 'integer', nullable: true })
  duracaoMinutos: number | null;

  /** Sem limite de tamanho: o domínio não define um (decisão técnica). */
  @Column({ type: 'text', nullable: true })
  modalidade: string | null;

  /** Decisão A2 (17/11/2026, #36). */
  @Column({ name: 'publicado_em', type: 'timestamptz' })
  publicadoEm: Date;

  /** Técnica: ordem de registro (identity). Não é lida pelo domínio. */
  @Column({
    type: 'bigint',
    generated: 'identity',
    generatedIdentity: 'ALWAYS',
    insert: false,
    update: false,
  })
  ordem?: string;
}
```

### Decisões de mapeamento

| Coluna | Origem | Tipo de decisão |
| --- | --- | --- |
| `id uuid` PK `pk_servicos` | `Servico.id`, gerado pelo domínio (`randomUUID`) → `@PrimaryColumn`, sem geração no banco | Contrato do domínio |
| `perfil_id uuid` + FK `fk_servicos_perfil` | `Servico.perfilId`; perfil e Serviço no mesmo contexto (C2); `ON DELETE RESTRICT`; sem `UNIQUE` (1 : 0..*) | Decidido na #37 |
| `titulo varchar(120)`, `descricao varchar(2000)` | Limites decididos na #36 em 17/11/2026 e **também** impostos pelo domínio (`MAX_CARACTERES_*`) | Regra de domínio refletida no banco |
| `modelo_contratacao`, `situacao varchar(20)` + CHECK | Valores conhecidos do domínio | Defesa em profundidade |
| `preco integer`, `duracao_minutos integer`, `moeda text`, `modalidade text` (nulas) | `CondicoesVigentes` "achatadas"; `null` em Sob Proposta | `moeda`/`modalidade` como `text`: **decisão técnica**, pois o domínio não define tamanho |
| CHECKs das condições | Todas ou nenhuma; Reserva Direta ⇒ condições; `preco >= 0`; `duracao_minutos > 0` (D-UC03-02/03) | Defesa em profundidade |
| `publicado_em timestamptz` | `Servico.publicadoEm` (A2, #36) | Contrato do domínio |
| `ordem bigint generated always as identity` + índice `(perfil_id, ordem)` | **Técnica**: o contrato exige "ordem de registro" e vários Serviços podem ter o mesmo `publicado_em`. Não existe no domínio; o mapper não a lê. Substitui o "ordenar por `publicado_em`" do comentário de 17/11 na #37 | Decisão técnica de persistência |

## 3. Migration — `src/database/migrations/1794941417929-ServicosDoUc03.ts`

Gerada com `pnpm migration:generate src/database/migrations/ServicosDoUc03` (o TypeORM comparou as entidades com o banco `mindhub` e gerou **só** a tabela nova, o que confirma que `usuarios` e `perfis_especialista` já estavam em sincronia). Editados só o `import type`, a formatação (Prettier) e o comentário. Registrada em `src/database/migracoes.ts` depois da migration inicial.

```ts
import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Tabela de Serviços do UC03 (#37).
 * Gerada por `pnpm migration:generate` a partir da ServicoOrmEntity; só a
 * formatação e este comentário foram editados.
 *
 * - perfil_id → oferta.perfis_especialista (mesmo contexto C2), sem UNIQUE:
 *   um perfil publica vários Serviços (FA-01). ON DELETE RESTRICT.
 * - CHECKs repetem no banco as invariantes do domínio que cabem em SQL:
 *   modelo e situação conhecidos, condições vigentes todas ou nenhuma,
 *   Reserva Direta com condições, preço >= 0 e duração > 0.
 * - "ordem" (identity) é técnica: dá a ordem de registro de listarPorPerfil.
 */
export class ServicosDoUc031794941417929 implements MigrationInterface {
  name = 'ServicosDoUc031794941417929';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "oferta"."servicos" ("id" uuid NOT NULL, "perfil_id" uuid NOT NULL, "titulo" character varying(120) NOT NULL, "descricao" character varying(2000) NOT NULL, "modelo_contratacao" character varying(20) NOT NULL, "situacao" character varying(20) NOT NULL, "preco" integer, "moeda" text, "duracao_minutos" integer, "modalidade" text, "publicado_em" TIMESTAMP WITH TIME ZONE NOT NULL, "ordem" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, CONSTRAINT "ck_servicos_duracao" CHECK ("duracao_minutos" > 0), CONSTRAINT "ck_servicos_preco" CHECK ("preco" >= 0), CONSTRAINT "ck_servicos_reserva_direta_com_condicoes" CHECK ("modelo_contratacao" <> 'RESERVA_DIRETA' OR "preco" IS NOT NULL), CONSTRAINT "ck_servicos_condicoes_completas" CHECK (("preco" IS NULL AND "moeda" IS NULL AND "duracao_minutos" IS NULL AND "modalidade" IS NULL) OR ("preco" IS NOT NULL AND "moeda" IS NOT NULL AND "duracao_minutos" IS NOT NULL AND "modalidade" IS NOT NULL)), CONSTRAINT "ck_servicos_situacao" CHECK ("situacao" IN ('PUBLICADO')), CONSTRAINT "ck_servicos_modelo_contratacao" CHECK ("modelo_contratacao" IN ('RESERVA_DIRETA', 'SOB_PROPOSTA')), CONSTRAINT "pk_servicos" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "ix_servicos_perfil_ordem" ON "oferta"."servicos"  ("perfil_id", "ordem") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oferta"."servicos" ADD CONSTRAINT "fk_servicos_perfil" FOREIGN KEY ("perfil_id") REFERENCES "oferta"."perfis_especialista"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oferta"."servicos" DROP CONSTRAINT "fk_servicos_perfil"`,
    );
    await queryRunner.query(`DROP INDEX "oferta"."ix_servicos_perfil_ordem"`);
    await queryRunner.query(`DROP TABLE "oferta"."servicos"`);
  }
}
```

## 4. Aplicação no banco de desenvolvimento

### Verificação prévia

```text
destino da CLI: DB_HOST=localhost DB_PORT=5433 DB_NAME=mindhub
$ pnpm migration:show
[X] 2 EsquemaInicialIdentidadeOferta1794334070122
[ ] ServicosDoUc031794941417929
```

### Execução

```text
$ pnpm migration:run
1 migrations are already loaded in the database.
2 migrations were found in the source code.
EsquemaInicialIdentidadeOferta1794334070122 is the last executed migration. It was executed on Tue Nov 10 2026 15:07:50 GMT-0300 (Horário Padrão de Brasília).
1 migrations are new migrations must be executed.
query: START TRANSACTION
query: CREATE TABLE "oferta"."servicos" (… igual ao up …)
query: CREATE INDEX "ix_servicos_perfil_ordem" ON "oferta"."servicos"  ("perfil_id", "ordem")
query: ALTER TABLE "oferta"."servicos" ADD CONSTRAINT "fk_servicos_perfil" FOREIGN KEY ("perfil_id") REFERENCES "oferta"."perfis_especialista"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
query: INSERT INTO "migrations"("timestamp", "name") VALUES ($1, $2) -- PARAMETERS: [1794941417929,"ServicosDoUc031794941417929"]
Migration ServicosDoUc031794941417929 has been executed successfully.
query: COMMIT
```

### Esquema efetivamente criado (`\d oferta.servicos`, banco `mindhub`)

```text
                                       Table "oferta.servicos"
       Column       |           Type           | Collation | Nullable |           Default            
--------------------+--------------------------+-----------+----------+------------------------------
 id                 | uuid                     |           | not null | 
 perfil_id          | uuid                     |           | not null | 
 titulo             | character varying(120)   |           | not null | 
 descricao          | character varying(2000)  |           | not null | 
 modelo_contratacao | character varying(20)    |           | not null | 
 situacao           | character varying(20)    |           | not null | 
 preco              | integer                  |           |          | 
 moeda              | text                     |           |          | 
 duracao_minutos    | integer                  |           |          | 
 modalidade         | text                     |           |          | 
 publicado_em       | timestamp with time zone |           | not null | 
 ordem              | bigint                   |           | not null | generated always as identity
Indexes:
    "pk_servicos" PRIMARY KEY, btree (id)
    "ix_servicos_perfil_ordem" btree (perfil_id, ordem)
Check constraints:
    "ck_servicos_condicoes_completas" CHECK (preco IS NULL AND moeda IS NULL AND duracao_minutos IS NULL AND modalidade IS NULL OR preco IS NOT NULL AND moeda IS NOT NULL AND duracao_minutos IS NOT NULL AND modalidade IS NOT NULL)
    "ck_servicos_duracao" CHECK (duracao_minutos > 0)
    "ck_servicos_modelo_contratacao" CHECK (modelo_contratacao::text = ANY (ARRAY['RESERVA_DIRETA'::character varying, 'SOB_PROPOSTA'::character varying]::text[]))
    "ck_servicos_preco" CHECK (preco >= 0)
    "ck_servicos_reserva_direta_com_condicoes" CHECK (modelo_contratacao::text <> 'RESERVA_DIRETA'::text OR preco IS NOT NULL)
    "ck_servicos_situacao" CHECK (situacao::text = 'PUBLICADO'::text)
Foreign-key constraints:
    "fk_servicos_perfil" FOREIGN KEY (perfil_id) REFERENCES oferta.perfis_especialista(id) ON DELETE RESTRICT

```

### Histórico de migrations × tabela da funcionalidade

Consultas **diferentes**: a tabela de histórico do TypeORM (`migrations`, no schema `public`, nome confirmado em `opcoesTypeOrm`: `migrationsTableName: 'migrations'`) e a tabela do caso de uso (`oferta.servicos`).

```text
$ SELECT id, timestamp, name FROM migrations ORDER BY id      (banco mindhub)
 id |   timestamp   |                    name
----+---------------+---------------------------------------------
  2 | 1794334070122 | EsquemaInicialIdentidadeOferta1794334070122
  3 | 1794941417929 | ServicosDoUc031794941417929

$ SELECT count(*) FROM oferta.servicos                         (banco mindhub)
 count
-------
     0

$ SELECT id, name FROM migrations ORDER BY id                   (banco mindhub_test, aplicada pelo global-setup)
1|EsquemaInicialIdentidadeOferta1794334070122
2|ServicosDoUc031794941417929
```

### Esperado × criado

| Item | Entidade | Banco |
| --- | --- | --- |
| Tabela | `oferta.servicos` | `oferta.servicos` |
| 12 colunas, tipos e nulabilidade | Conforme a seção 2 | Iguais (`\d`) |
| PK | `pk_servicos (id)` | `pk_servicos` |
| FK | `fk_servicos_perfil → perfis_especialista(id)`, RESTRICT | Igual |
| Índice | `ix_servicos_perfil_ordem (perfil_id, ordem)` | Igual |
| CHECKs | 6 | 6 |
| `ordem` | identity ALWAYS | `generated always as identity` |

### Testes do esquema (banco de testes)

```text
 ✓ … > o banco recusa Serviço de perfil inexistente (fk_servicos_perfil) 9ms
 ✓ … > o banco recusa Reserva Direta sem condições (CHECK) 14ms
      Tests  6 failed | 2 passed (8)        ← os 6 do contrato continuam RED (Fase 6)
```

## 5. Mapper — `src/oferta/infra/servico.mapper.ts` (Fase 6, commit `33b8ace`)

```ts
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
```

| Aspecto | Como ficou |
| --- | --- |
| Nomes | `paraOrm` / `paraDominio`, a convenção do projeto (`PerfilEspecialistaMapper`), equivalentes a `toPersistence` / `toDomain` do material |
| Entrada do domínio | `servico.paraDados()`: o mapper não lê campos privados |
| Restauração | `Servico.reconstituir(...)`: não gera id nem muda a situação, mas valida |
| Condições vigentes | Achatadas em `preco`, `moeda`, `duracao_minutos`, `modalidade`; `preco = null` ⇒ `condicoes: null` (o CHECK garante "todas ou nenhuma") |
| `ordem` | Não é lida: é só de persistência |
| Regra de negócio | Nenhuma. Um registro que o domínio recusa vira `RegistroDeServicoCorrompido` (falha técnica, 500), não `ServicoInvalido` (erro do cliente, 400) |
| Exposição da entidade ORM | Só dentro de `src/oferta/infra/` |

Verificado pelos testes da Fase 6 (`09-05`): contrato no PostgreSQL 9/9, incluindo "registro que o banco aceita mas o domínio não (título só espaços) não vira Serviço".

## 6. Reversibilidade da migration (autorizada por @leohsm em 17/11/2026)

Executada **só no banco de testes**, com o destino conferido antes. O banco de desenvolvimento não foi tocado.

```text
$ export DB_NAME=mindhub_test          (o terminal tem prioridade sobre o .env)
$ (DB_NAME=mindhub_test) destino real da CLI
{"banco":"mindhub_test","usuario":"mindhub"}
$ pnpm migration:show
[X] 1 EsquemaInicialIdentidadeOferta1794334070122
[X] 2 ServicosDoUc031794941417929
$ SELECT count(*) FROM oferta.servicos (mindhub_test)
0

$ pnpm migration:revert   (DB_NAME=mindhub_test)
query: START TRANSACTION
query: ALTER TABLE "oferta"."servicos" DROP CONSTRAINT "fk_servicos_perfil"
query: DROP INDEX "oferta"."ix_servicos_perfil_ordem"
query: DROP TABLE "oferta"."servicos"
query: DELETE FROM "migrations" WHERE "timestamp" = $1 AND "name" = $2 -- PARAMETERS: [1794941417929,"ServicosDoUc031794941417929"]
Migration ServicosDoUc031794941417929 has been reverted successfully.
query: COMMIT
--- depois do revert:
oferta.servicos existe? f
histórico:
1|EsquemaInicialIdentidadeOferta1794334070122
perfis_especialista intacta? t

$ pnpm migration:run   (DB_NAME=mindhub_test)
query: START TRANSACTION
query: CREATE TABLE "oferta"."servicos" (…)
query: CREATE INDEX "ix_servicos_perfil_ordem" ON "oferta"."servicos"  ("perfil_id", "ordem")
query: ALTER TABLE "oferta"."servicos" ADD CONSTRAINT "fk_servicos_perfil" FOREIGN KEY ("perfil_id") REFERENCES "oferta"."perfis_especialista"(…)
Migration ServicosDoUc031794941417929 has been executed successfully.
query: COMMIT
--- depois do run:
oferta.servicos existe? t
histórico:
1|EsquemaInicialIdentidadeOferta1794334070122
3|ServicosDoUc031794941417929
constraints: ck_servicos_condicoes_completas, ck_servicos_duracao, ck_servicos_modelo_contratacao,
             ck_servicos_preco, ck_servicos_reserva_direta_com_condicoes, ck_servicos_situacao,
             fk_servicos_perfil, pk_servicos (+ NOT NULL das 8 colunas obrigatórias)

$ histórico do banco de desenvolvimento (mindhub)        ← intocado
2|EsquemaInicialIdentidadeOferta1794334070122
3|ServicosDoUc031794941417929
Serviço 49e6042b no mindhub: 1

$ pnpm test:e2e
 Test Files  6 passed (6)
      Tests  35 passed (35)
```

O `down` desfaz exatamente o `up` (FK, índice, tabela) e deixa intactos o restante do schema `oferta` e o histórico da migration anterior; reaplicar recria a tabela com as mesmas constraints. O id no histórico passou de 2 para 3 (a sequência da tabela `migrations` não reaproveita ids). Uma consulta auxiliar minha ao banco de desenvolvimento falhou por erro de aspas no shell (`column ":" does not exist`) e foi repetida corrigida, como acima. **Critério 1 da #37 comprovado e marcado.**
