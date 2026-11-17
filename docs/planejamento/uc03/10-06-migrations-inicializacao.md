# 10-06 — Migrations e inicialização

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#141](https://github.com/MindHub-DSC/Mindhub/issues/141)
**Branch:** `feature/141-uc03-containerizar-backend`
**Data:** 17/11/2026

Legenda: **[DOC]** documentado anteriormente · **[CÓD]** confirmado no código · **[EXE]** executado nesta atividade · **[AGU]** aguardando evidência · **[PEN]** pendente de correção.

# Parte 1 — Migrations no ambiente containerizado (Fase 7)

## 1. Scripts

| Script | Situação | Comando |
| --- | --- | --- |
| `migration:show` / `run` / `revert` / `generate` | Já existiam; **inalterados** | `pnpm run build && typeorm … -d dist/database/data-source.js` (uso no host) |
| `migration:show:prod` | **Criado** | `typeorm migration:show -d dist/database/data-source.js` |
| `migration:run:prod` | **Criado** | `typeorm migration:run -d dist/database/data-source.js` |

Os scripts existentes compilam antes (`nest build`), o que exige `src/` e o Nest CLI, ausentes na imagem runtime (`10-03`). Os `:prod` usam só o DataSource **compilado**. Nenhum script de `revert` em produção foi criado.

## 2. DataSource

```ts
// src/database/data-source.ts → dist/database/data-source.js
export default new DataSource(opcoesTypeOrm(lerAmbienteDoBanco()));

// src/database/migracoes.ts
export const MIGRACOES = [
  EsquemaInicialIdentidadeOferta1794334070122,
  ServicosDoUc031794941417929,
];
```

O projeto não usa glob de arquivos: `MIGRACOES` é uma lista de classes importadas com `.js` (ESM). Por isso não há distinção entre `.ts` e `.js` a fazer: no Vitest, os imports resolvem para `.ts`; no `dist/`, para os `.js` compilados. `synchronize: false` e `migrationsRun: false` em `opcoesTypeOrm` (API, CLI e testes) [CÓD]. O DataSource **não foi alterado**.

## 3. Pré-condições (10.1)

| # | Pré-condição | Situação |
| --- | --- | --- |
| 1 | PostgreSQL de desenvolvimento ativo e banco correto | `mindhub-postgres-1` healthy; `current_database() = mindhub` vista do contêiner da API (`10-05`) [EXE] |
| 2 | DataSource e migrations compilados em `dist/` | `dist/database/data-source.js` e as 2 migrations na imagem [EXE] |
| 3 | Scripts apontando para o DataSource correto | `-d dist/database/data-source.js` [CÓD] |
| 4 | Histórico inspecionado | Seção 4 [EXE] |
| 5 | Sem operações destrutivas | Só leitura nesta fase |

## 4. Consulta ao histórico

### Primeira tentativa: falha do pnpm (diagnosticada e corrigida)

```text
$ docker compose run --rm --no-deps api pnpm migration:show:prod
Update available! 12.9.1 → 12.21.0.
Changelog: https://pnpm.io/v/12.21.0
To update, run: curl -fsSL https://get.pnpm.io/install.sh | sh -
Error: ERR_PNPM_PACKAGE_MANAGER_REMOVE_MODULES_DIR

  × installing dependencies
  ╰─▶ Failed to remove /app/node_modules/.bin from the modules directory:
      Permission denied (os error 13)

[WARN] The install that runs before scripts failed, so your node_modules may be out of sync with your lockfile. Set "verifyDepsBeforeRun: false" to skip this install.
$ typeorm migration:show -d dist/database/data-source.js
[X] 2 EsquemaInicialIdentidadeOferta1794334070122
[X] 3 ServicosDoUc031794941417929
exit=0
```

O histórico saiu correto, mas o pnpm **tentou reinstalar o `node_modules` antes de rodar o script** e só não conseguiu porque o processo roda como `node` (sem permissão de escrita). Ele também consultou a rede em busca de atualização. Investigação (contêineres descartáveis, `--network none`):

```text
$ (usuário node)  pnpm migration:show:prod
Error: ERR_PNPM_PACKAGE_MANAGER_REMOVE_MODULES_DIR … Permission denied (os error 13)
$ (usuário root)  pnpm migration:show:prod
$ typeorm migration:show -d dist/database/data-source.js        ← sem tentativa de instalação
$ grep storeDir node_modules/.modules.yaml
  "storeDir": "/root/.local/share/pnpm/store/v11",
$ (node) pnpm store path
/home/node/.local/share/pnpm/store/v11
$ (root) pnpm store path
/root/.local/share/pnpm/store/v11
$ (env pnpm_config_verify_deps_before_run=false) pnpm config get verify-deps-before-run
false
$ (env npm_config_verify_deps_before_run=false)  pnpm config get verify-deps-before-run
undefined                                                         ← o pnpm 12 não lê mais npm_config_*
```

**Causa:** o `pnpm install --prod` roda como root no build e grava o store do root; o processo roda como `node`, cujo store é outro. O `verifyDepsBeforeRun` do pnpm vê a diferença e tenta reinstalar.

**Correção mínima (Dockerfile, estágio runtime):**

```dockerfile
# A imagem é imutável: "pnpm <script>" não deve reinstalar dependências
# (o store gravado é o do root, e o processo roda como node) nem consultar
# atualizações na rede.
ENV pnpm_config_verify_deps_before_run=false
ENV pnpm_config_update_notifier=false
```

### Depois da correção

```text
$ docker compose build api
 Image mindhub-api:dev Built
=== exit 0
$ docker compose run --rm --no-deps api pnpm migration:show:prod
 Container mindhub-api-run-e8c71195637e Creating
 Container mindhub-api-run-e8c71195637e Created
$ typeorm migration:show -d dist/database/data-source.js
[X] 2 EsquemaInicialIdentidadeOferta1794334070122
[X] 3 ServicosDoUc031794941417929
exit=0
```

### Conferência por SQL (banco de desenvolvimento)

```text
$ docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
 current_database
------------------
 mindhub

 id |   timestamp   |                    name
----+---------------+---------------------------------------------
  2 | 1794334070122 | EsquemaInicialIdentidadeOferta1794334070122
  3 | 1794941417929 | ServicosDoUc031794941417929

     tabela      | servicos
-----------------+----------
 oferta.servicos |        1
```

O histórico é o mesmo registrado no `09-04`; o Serviço existente é o `49e6042b-…` do Material 09.

## 5. Aplicação de migrations pendentes

**Não executada.** As duas migrations do código aparecem como `[X]` no banco de desenvolvimento: não havia pendência. `migration:run:prod` foi criado e não foi usado. Nenhum `revert`, `synchronize`, `DROP` ou alteração manual do histórico.

# Parte 2 — Inicialização (Fase 8)

## 6. Subida

```text
$ date
17/11/2026 16:38:12 -0300
$ docker compose up -d --build api
 Image mindhub-api:dev Building
 Image mindhub-api:dev Built
 Container mindhub-postgres-1 Running
 Container mindhub-api-1 Creating
 Container mindhub-api-1 Created
 Container mindhub-postgres-1 Waiting
 Container mindhub-postgres-1 Healthy
 Container mindhub-api-1 Starting
 Container mindhub-api-1 Started
=== exit 0

$ docker compose ps
NAME                 IMAGE                COMMAND                  SERVICE    CREATED         STATUS                 PORTS
mindhub-api-1        mindhub-api:dev      "docker-entrypoint.s…"   api        6 seconds ago   Up 6 seconds           0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
mindhub-postgres-1   postgres:18-alpine   "docker-entrypoint.s…"   postgres   2 hours ago     Up 2 hours (healthy)   0.0.0.0:5433->5432/tcp, [::]:5433->5432/tcp

$ docker inspect mindhub-api-1
api: mindhub_default 172.23.0.3 restart=unless-stopped user=node
$ docker compose top api
SERVICE  #   UID   PID    PPID   C   STIME  TTY  TIME      CMD
api      1   1000  32706  32682  7   19:38  ?    00:00:01  node dist/main.js
```

O Compose esperou o `postgres` ficar `Healthy` antes de iniciar a API (`depends_on: service_healthy`). O `postgres` **não foi recriado** (`Running`, "2 hours ago"). Nenhum serviço de testes foi iniciado (o projeto não tem um).

## 7. Logs da API

```text
$ docker compose logs --no-log-prefix api      (códigos de cor ANSI removidos)
[Nest] 1  - 11/17/2026, 7:38:15 PM     LOG [NestFactory] Starting Nest application...
[Nest] 1  - 11/17/2026, 7:38:15 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +37ms
[Nest] 1  - 11/17/2026, 7:38:15 PM     LOG [InstanceLoader] AppModule dependencies initialized +1ms
[Nest] 1  - 11/17/2026, 7:38:15 PM     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +28ms
[Nest] 1  - 11/17/2026, 7:38:15 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +0ms
[Nest] 1  - 11/17/2026, 7:38:15 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +0ms
[Nest] 1  - 11/17/2026, 7:38:15 PM     LOG [InstanceLoader] IdentidadeModule dependencies initialized +0ms
[Nest] 1  - 11/17/2026, 7:38:15 PM     LOG [InstanceLoader] OfertaModule dependencies initialized +1ms
[Nest] 1  - 11/17/2026, 7:38:15 PM     LOG [RoutesResolver] AppController {/}: +4ms
[Nest] 1  - 11/17/2026, 7:38:15 PM     LOG [RouterExplorer] Mapped {/, GET} route +3ms
[Nest] 1  - 11/17/2026, 7:38:15 PM     LOG [RoutesResolver] UsuariosController {/usuarios}: +0ms
[Nest] 1  - 11/17/2026, 7:38:15 PM     LOG [RouterExplorer] Mapped {/usuarios, POST} route +1ms
[Nest] 1  - 11/17/2026, 7:38:15 PM     LOG [RoutesResolver] PerfisEspecialistaController {/especialistas}: +0ms
[Nest] 1  - 11/17/2026, 7:38:15 PM     LOG [RouterExplorer] Mapped {/especialistas, POST} route +0ms
[Nest] 1  - 11/17/2026, 7:38:15 PM     LOG [RoutesResolver] ServicosController {/servicos}: +0ms
[Nest] 1  - 11/17/2026, 7:38:15 PM     LOG [RouterExplorer] Mapped {/servicos, POST} route +0ms
[Nest] 1  - 11/17/2026, 7:38:15 PM     LOG [NestApplication] Nest application successfully started +2ms
```

O relógio do contêiner está em UTC (19:38 UTC = 16:38 em Brasília).

## 8. Logs do PostgreSQL

```text
$ docker compose logs --tail 8 postgres
postgres-1  | 2026-11-17 19:20:55.778 UTC [9349] STATEMENT:  INSERT INTO oferta.perfis_especialista …
postgres-1  | 2026-11-17 19:20:56.333 UTC [9350] ERROR:  duplicate key value violates unique constraint "uq_usuarios_email"
postgres-1  | 2026-11-17 19:20:56.333 UTC [9350] DETAIL:  Key (email)=(int-64f2c0e8-…@exemplo.test) already exists.
postgres-1  | 2026-11-17 19:22:49.788 UTC [30] LOG:  checkpoint starting: time
postgres-1  | 2026-11-17 19:22:50.957 UTC [30] LOG:  checkpoint complete: wrote 11 buffers (0.1%) …
```

Os `ERROR` são de **19:20 UTC (16:20 em Brasília)**, horário da linha de base do `pnpm test:e2e` (`10-01`, "Start at 16:20:48"), cujos testes provocam violações de constraint de propósito (e-mail duplicado, FK, CHECK) no banco `mindhub_test`. Não há erro depois da subida da API (19:38 UTC).

## 9. Conferência (Fase 8)

| Verificação | Resultado | Classe |
| --- | --- | --- |
| PostgreSQL `healthy` | Sim | [EXE] |
| Contêiner da API em execução | `Up`, processo `node dist/main.js` como UID 1000 (`node`) | [EXE] |
| NestJS inicializado e módulos carregados | `AppModule`, `IdentidadeModule`, `OfertaModule`; `Nest application successfully started` | [EXE] |
| Rota do caso de uso | `Mapped {/servicos, POST} route` | [EXE] |
| TypeORM conectado | `TypeOrmCoreModule dependencies initialized` sem `Unable to connect to the database` (o `forRootAsync` só termina depois de abrir o `DataSource`, com até 3 tentativas). A conexão efetiva vista pelo servidor é comprovada na Fase 9 (`10-07`) | [EXE] |
| Porta HTTP | `0.0.0.0:3000->3000/tcp` | [EXE] |
| Falhas impeditivas | Nenhuma | [EXE] |

Uma consulta a `pg_stat_activity` feita logo depois da subida voltou **vazia**: o pool do `pg` fecha conexões ociosas após 10 s (padrão `idleTimeoutMillis`). Por isso a conexão do contêiner da API é conferida logo depois de uma requisição (`10-07`).

> **Contêiner ativo não significa aplicação pronta**: a prova de funcionamento é o cadastro HTTP e o registro no banco (Fase 9).
