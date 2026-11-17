# 09-03 — Configuração do TypeORM

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#37](https://github.com/MindHub-DSC/Mindhub/issues/37)
**Branch inspecionada:** `feature/40-uc03-endpoint-publicar-servico` @ `7eb5cf7` (base da futura branch da #37)
**Data:** 17/11/2026

> Fase de **inspeção**. Nenhuma configuração foi alterada e nenhuma migration foi executada (`migration:show` só lê o histórico).

## 1. Pacotes

```text
@nestjs/typeorm  ^12.0.3
typeorm          ^1.1.2
pg               ^8.23.1
@nestjs/config   (não instalado)
dotenv           (não instalado)
```

`@nestjs/config` e `dotenv` **não são necessários**: o projeto lê o `.env` com `node:util` `parseEnv` (`src/config/ambiente.ts`) e valida com zod. Nada será instalado.

Sistema de módulos: `package.json` `"type": "module"`, `tsconfig` `"module": "nodenext"` (ESM, imports relativos com `.js`).

## 2. `AppModule`

```ts
TypeOrmModule.forRootAsync({
  useFactory: () => ({
    ...opcoesTypeOrm(lerAmbienteDoBanco()),
    retryAttempts: 3,
    retryDelay: 2000,
  }),
}),
```

`opcoesTypeOrm` (`src/database/opcoes-typeorm.ts`):

```ts
return {
  type: 'postgres',
  host: ambiente.DB_HOST,
  port: ambiente.DB_PORT,
  username: ambiente.DB_USER,
  password: ambiente.DB_PASSWORD,
  database: ambiente.DB_NAME,
  entities: ENTIDADES_ORM,           // [UsuarioOrmEntity, PerfilEspecialistaOrmEntity]
  migrations: MIGRACOES,             // [EsquemaInicialIdentidadeOferta1794334070122]
  migrationsTableName: 'migrations',
  synchronize: false,
  migrationsRun: false,
  logging: false,
};
```

| Verificação | Situação |
| --- | --- |
| Host, porta, usuário, senha e banco do ambiente | Sim, via `lerAmbienteDoBanco()` (validado) |
| `synchronize: false` | **Sim** |
| `autoLoadEntities: true` | **Não**: o projeto usa a lista explícita `ENTIDADES_ORM`, compartilhada pela API, pela CLI e pelos testes. É uma escolha coerente (a CLI precisa da lista); a #37 deve **acrescentar** a nova entidade nela, sem trocar a estratégia |
| `migrationsRun: false` | Sim: migrations só por comando explícito |
| Propriedades duplicadas | Nenhuma |

## 3. `DataSource` da CLI e estratégia de migrations

| Item | Valor |
| --- | --- |
| Arquivo | `src/database/data-source.ts` → `export default new DataSource(opcoesTypeOrm(lerAmbienteDoBanco()))` |
| Uso | Compilado: `typeorm … -d dist/database/data-source.js` |
| Registro | Lista explícita em `src/database/migracoes.ts` (`MIGRACOES`), não glob: "Ao gerar uma nova migration, acrescente a classe aqui, em ordem" |
| Scripts | `migration:generate`, `migration:run`, `migration:revert`, `migration:show` (todos rodam `pnpm run build` antes) |
| Destino | O banco de `DB_NAME` (`mindhub`); o de testes recebe as migrations pelo `test/setup/global-setup.ts` |

### Convenção da migration existente

`1794334070122-EsquemaInicialIdentidadeOferta.ts`: gerada por `migration:generate` a partir das entidades e editada à mão para `CREATE/DROP SCHEMA`. Constraints com nomes explícitos (`pk_…`, `uq_…`, `ck_…`), comentário explicando as decisões, `down` sem `CASCADE` que desfaz na ordem inversa.

## 4. Estado dos bancos antes da nova migration

```text
$ psql -d mindhub: histórico de migrations
2|1794334070122|EsquemaInicialIdentidadeOferta1794334070122
$ psql -d mindhub: tabelas dos schemas identidade/oferta
identidade.usuarios
oferta.perfis_especialista

$ psql -d mindhub_test: histórico de migrations
1|1794334070122|EsquemaInicialIdentidadeOferta1794334070122
$ psql -d mindhub_test: tabelas dos schemas identidade/oferta
identidade.usuarios
oferta.perfis_especialista

$ pnpm migration:show
$ pnpm run build && typeorm migration:show -d dist/database/data-source.js
$ nest build
[X] 2 EsquemaInicialIdentidadeOferta1794334070122
```

| Verificação de segurança (7.2) | Resultado |
| --- | --- |
| 1. Banco de destino | CLI → `mindhub` (desenvolvimento); testes → `mindhub_test` |
| 2. Histórico aplicado | Só `EsquemaInicialIdentidadeOferta1794334070122` nos dois bancos (`[X]` no `migration:show`). No `mindhub` o id é 2: houve uma reversão e reaplicação anterior; não há pendência |
| 3. Esquema atual | `oferta.servicos` **não existe** em nenhum dos dois |
| 4. Conflitos | Nenhum: a nova migration terá timestamp maior e cria uma tabela inexistente |

## 5. Ajustes previstos para a #37 (ainda não feitos)

| Arquivo | Ajuste |
| --- | --- |
| `src/database/opcoes-typeorm.ts` | Acrescentar `ServicoOrmEntity` a `ENTIDADES_ORM` |
| `src/database/migracoes.ts` | Acrescentar a nova classe de migration depois da atual |
| `src/oferta/oferta.module.ts` | `TypeOrmModule.forFeature([PerfilEspecialistaOrmEntity, ServicoOrmEntity])` e troca do provider (Fase 7) |

Nenhum ajuste no `AppModule` nem no `data-source.ts`.

## 6. Pendências

Nenhuma bloqueante. A migration será gerada e aplicada na Fase 5, primeiro no banco de desenvolvimento por `migration:run`, conferindo destino e histórico antes.
