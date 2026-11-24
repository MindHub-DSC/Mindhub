# 10-08 — Versionamento e checklist consolidado

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#141](https://github.com/MindHub-DSC/Mindhub/issues/141) — [UC03-SUB-07] [INFRA] Containerizar o backend NestJS com Docker Compose
**Data:** 17/11/2026

## 1. Projeto

MindHub — backend NestJS 12, TypeORM 1, PostgreSQL 18 (`mindhub-backend/`).

## 2. Issue

[#141](https://github.com/MindHub-DSC/Mindhub/issues/141), criada nesta atividade (não existia issue de containerização), sub-issue do épico #35. Labels `usecase:uc03`, `layer:integration`, `priority:medium`; responsável @leohsm. Aberta, com os **5 de 5** critérios marcados e referência ao PR #142.

## 3. Epic

[#35](https://github.com/MindHub-DSC/Mindhub/issues/35) — [UC03] Publicar Serviço (aberto). Sub-issues: #36, #37, #38, #39, #40, #41, **#141**.

## 4. Branch

```text
main
  └── feature/36-uc03-modelar-servico                         PR #131 (Draft) → main
        └── feature/38-uc03-publicar-servico                  PR #134 (Draft) → feature/36-…
              └── feature/40-uc03-endpoint-publicar-servico   PR #135 (Draft) → feature/38-…
                    └── feature/37-uc03-persistir-servico     PR #139 (Draft) → feature/40-…
                          └── feature/141-uc03-containerizar-backend   PR #142 (Draft) → feature/37-…
```

Base `feature/37-…` por decisão de @leohsm (`10-01`, seção 11): é a única branch com `POST /servicos` persistido.

## 5. Estado inicial

Sem `Dockerfile`, sem `.dockerignore`, sem serviço `api`; `compose.yaml` só com `postgres` (`name: mindhub`, 5433→5432, volume `mindhub_mindhub-pgdata`); scripts de migration só para o host. Linha de base: `pnpm test` 110/110, `pnpm test:e2e` 35/35 (`10-01`).

## 6. Arquivos verificados

`Dockerfile` (inexistente), `.dockerignore` (inexistente), `compose.yaml`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` (inexistente), `.npmrc` (inexistente), `.node-version`, `tsconfig.json`, `tsconfig.build.json`, `nest-cli.json`, `src/main.ts`, `src/app.module.ts`, `src/config/ambiente.ts`, `src/database/data-source.ts`, `src/database/migracoes.ts`, `.env.example`, `.env` (só nomes das chaves), `vitest.config*.ts`, `test/setup/*`, `src/oferta/http/publicar-servico.dto.ts`, `README.md`.

## 7. Alterações realizadas

| Arquivo | Tipo | Resumo |
| --- | --- | --- |
| `mindhub-backend/Dockerfile` | Criado | Multi-stage, Node 24.19.0, pnpm 12.9.1, runtime como `node`, `verifyDepsBeforeRun` e `update-notifier` desligados |
| `mindhub-backend/.dockerignore` | Criado | Exclui `node_modules`, `dist`, `.env`, `.git`, `test` etc. |
| `mindhub-backend/compose.yaml` | Alterado | + serviço `api`; comentário do topo atualizado; `postgres` e volume intactos |
| `mindhub-backend/package.json` | Alterado | + `migration:show:prod`, `migration:run:prod`; `db:up` → `… --wait postgres` |
| `mindhub-backend/.env.example` | Alterado | Comentário sobre `DB_HOST`/`DB_PORT` no host × contêiner |
| `mindhub-backend/README.md` | Alterado | Comentário do `db:up` e subseção "API em contêiner" |

Não alterados: `src/`, `test/`, migrations, DataSource, `pnpm-lock.yaml`, credenciais, `.env`.

## 8. Imagem

`mindhub-api:dev` (622 MB em disco, 153 MB de conteúdo), `node:24.19.0-bookworm-slim`, 137 pacotes de produção, `USER node`, `EXPOSE 3000`, `CMD ["node", "dist/main.js"]`, sem `.env`/`src`/`test` (`10-03`). Reconstruída depois da correção do pnpm (`10-06`).

## 9. Compose

`postgres` (inalterado) + `api` (`build: .`, `image: mindhub-api:dev`, `restart: unless-stopped`, `${PORT:-3000}:3000`, `depends_on: postgres: service_healthy`). `docker compose config --quiet` → `OK`; dry-run sem recriar o `postgres` (`10-04`).

## 10. Variáveis

No processo da API: `PORT=3000`, `NODE_ENV=production`, `DB_HOST=postgres`, `DB_PORT=5432`, `DB_USER=mindhub`, `DB_NAME=mindhub`, `DB_PASSWORD` definida (valor não impresso), `DB_TEST_NAME` ausente. Credenciais da API e do PostgreSQL iguais (comparadas sem imprimir) (`10-04`, `10-05`).

## 11. Migrations

`docker compose run --rm --no-deps api pnpm migration:show:prod` → `[X] 2 EsquemaInicialIdentidadeOferta1794334070122`, `[X] 3 ServicosDoUc031794941417929`. Nenhuma pendência; **nenhuma migration executada** (`10-06`).

## 12. Execução

`docker compose up -d --build api` → `mindhub-api-1` em `Up`, `postgres` `healthy` e não recriado; logs com `OfertaModule dependencies initialized`, `Mapped {/servicos, POST} route`, `Nest application successfully started` (`10-06`).

## 13. HTTP

`POST /servicos` → **201**, id `0cf433e8-9ae2-4dc8-99e9-8e9cb2118182`. Corpo inválido → 400 (3 mensagens); campo fora do contrato (`situacao`) → 400 `Unrecognized key` (`10-07`).

## 14. PostgreSQL

Registro encontrado em `oferta.servicos` do banco `mindhub`; `pg_stat_activity` mostrou a conexão do IP do contêiner da API (`172.23.0.3`) logo após a requisição (`10-07`).

## 15. Durabilidade

`docker compose restart api` (novo `StartedAt` da API; `StartedAt` do PostgreSQL inalterado) → mesma consulta, `diff` **idêntico**. Comprovada (`10-07`).

## 16. Testes

`pnpm test` 12 arquivos / 110 testes; `pnpm test:e2e` 6 arquivos / 35 testes (banco `mindhub_test`); `pnpm lint` e `pnpm build` sem erros. Iguais à linha de base, sem regressões; lockfile não reescrito; banco de desenvolvimento intocado pelos testes (`10-07`).

## 17. Commits reais

| Branch | Hash | Mensagem |
| --- | --- | --- |
| `feature/141-uc03-containerizar-backend` | `19cd672` | `build(docker): containeriza o backend NestJS e integra ao Compose (ref #141, ref #35)` |

```text
$ git diff --staged --stat
 mindhub-backend/.dockerignore | 21 +++++++++++++++++++++
 mindhub-backend/.env.example  |  2 ++
 mindhub-backend/Dockerfile    | 35 +++++++++++++++++++++++++++++++++++
 mindhub-backend/README.md     | 17 ++++++++++++++++-
 mindhub-backend/compose.yaml  | 28 ++++++++++++++++++++++++++--
 mindhub-backend/package.json  |  6 ++++--
 6 files changed, 104 insertions(+), 5 deletions(-)

$ git push -u origin feature/141-uc03-containerizar-backend
 * [new branch]      feature/141-uc03-containerizar-backend -> feature/141-uc03-containerizar-backend
```

Segurança antes do commit: `.env` ignorado (`.gitignore:10:.env`); a senha real do `.env` foi procurada (sem imprimir) em todos os arquivos commitados e nos artefatos `10-*`, sem ocorrências; a única linha nova com `PASSWORD` é a interpolação `${DB_PASSWORD:?…}`. Arquivos adicionados por caminho (sem `git add .`).

A documentação (`10-01` a `10-08` e os prompts `10` e `10.1`) vai num PR separado para a `main` (branch `docs/material-10-uc03`), como nos Materiais 07 a 09.

## 18. Pull Request

[#142](https://github.com/MindHub-DSC/Mindhub/pull/142) — Draft, `feature/141-uc03-containerizar-backend` → `feature/37-uc03-persistir-servico`; um commit (`19cd672`), 6 arquivos; descrição com cadeia, alterações, evidências e checklist. PRs #131, #134, #135 e #139 preservados. **Nenhum merge executado.**

## 19. GitHub Project

Primeira tentativa: `gh project list` → `your authentication token is missing required scopes [read:project]`. @leohsm ampliou o token (`gh auth refresh -h github.com -s project`, `✓ Authentication complete.`) e a verificação foi refeita:

```text
$ gh project list --owner MindHub-DSC
1	Planejamento - Mindhub	open	PVT_kwDOFAG7gs4BrCtE

$ gh project item-list 1 --owner MindHub-DSC   (issues do UC03, antes)
35	Backlog
36	In Progress
37	Backlog
38	Backlog
39	Backlog
40	Backlog
41	Backlog
141	-            ← incluída automaticamente no Project, sem status

$ gh project item-edit … --field-id <Status> --single-select-option-id <In Review>   (#141)
$ gh issue view 141 --json projectItems
Planejamento - Mindhub=In Review
```

Fluxo do campo Status: `Backlog → Ready → In Progress → In Review → Done` (preservado). A **#141** foi movida para **`In Review`** (PR #142 aguarda revisão humana); nada foi para `Done`.

**Divergência encontrada e corrigida com autorização de @leohsm:** o quadro não acompanhava o andamento real das outras sub-issues do UC03. #36 estava em `In Progress` e #37, #38 e #40 em `Backlog`, embora as quatro tenham PRs Draft com o trabalho feito (#131, #139, #134, #135). O `09-08` registrou a #37 como `In Progress` só porque o Project não pôde ser conferido. Com a autorização, as quatro foram movidas para `In Review`:

```text
$ gh project item-edit … --single-select-option-id <In Review>   (#36, #37, #38, #40)
$ gh project item-list 1 --owner MindHub-DSC   (issues do UC03, depois)
35	Backlog
36	In Review
37	In Review
38	In Review
39	Backlog
40	In Review
41	Backlog
141	In Review
```

O épico #35 e as issues não iniciadas (#39, #41) continuam em `Backlog`. Nenhuma foi para `Done`: os PRs não foram integrados.

## 20. Diagnóstico estruturado de falhas (Fase 11)

| # | Categoria | Comando | Sintoma / mensagem real | Hipótese → causa | Correção | Nova verificação |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Execução (pnpm na imagem) | `docker compose run --rm --no-deps api pnpm migration:show:prod` | `ERR_PNPM_PACKAGE_MANAGER_REMOVE_MODULES_DIR … Failed to remove /app/node_modules/.bin … Permission denied (os error 13)` + `Update available! 12.9.1 → 12.21.0` | Hipótese: pnpm reinstala antes de scripts. Causa (comparando root × node, sem rede): `storeDir` gravado = `/root/.local/share/pnpm/store/v11`, store do usuário `node` = `/home/node/…`; o `verifyDepsBeforeRun` vê divergência | `ENV pnpm_config_verify_deps_before_run=false` e `ENV pnpm_config_update_notifier=false` no runtime (`npm_config_*` não é lido pelo pnpm 12: `undefined`) | Saída limpa, `[X]` nas duas migrations, `exit=0` |
| 2 | Construção (aviso) | `docker build` | `npm warn allow-scripts … pnpm@12.9.1 (preinstall/postinstall: node install.js)` | npm do Node 24.19 não roda scripts de pacotes globais sem autorização | Nenhuma: pnpm funciona (`pnpm -v` = 12.9.1, install e build ok) | Registrado como não impeditivo (`10-03`) |
| 3 | PostgreSQL (observação) | `pg_stat_activity` logo após a subida | 0 linhas | Pool do `pg` fecha conexões ociosas após 10 s | Consultar logo após uma requisição | 1 conexão de `172.23.0.3` ao `mindhub` (`10-07`) |
| 4 | Logs (observação) | `docker compose logs postgres` | `ERROR: duplicate key … uq_usuarios_email` | Horário 19:20 UTC = linha de base do `test:e2e` (16:20), que provoca violações de propósito no `mindhub_test` | Nenhuma | Nenhum erro depois da subida da API (`10-06`) |

Categorias sem ocorrência: rede (nome/porta), credenciais, TypeORM, persistência, conflito de nome de contêiner. Nenhuma correção usou comando destrutivo.

## 21. Checklist classificado

### Planejamento

| Item | Situação | Evidência |
| --- | --- | --- |
| Oito Markdown do Material 09 analisados | Confirmado | `10-01` |
| Issue de containerização e Epic verificadas | Confirmado | #141 criada (inexistente antes), ligada ao #35 |
| Branch confirmada | Confirmado | `feature/141-uc03-containerizar-backend` |
| Definition of Ready, WIP e dependências verificadas | Confirmado | `10-01`, seção 11 |

### Dockerfile e imagem

| Item | Situação | Evidência |
| --- | --- | --- |
| Dockerfile examinado (ou criado, com registro) | Confirmado | Criado (`10-02`) |
| Versões de Node e pnpm confirmadas | Confirmado | 24.19.0 / 12.9.1 no host e na imagem |
| Lockfile validado | Confirmado | `--frozen-lockfile` nos dois estágios, sem erro |
| Build multi-stage verificado | Confirmado | `build` → `runtime` (`10-03`) |
| Entry point, DataSource e migrations compilados identificados | Confirmado | `dist/main.js`, `dist/database/…` |
| `.dockerignore` auditado | Confirmado | Criado; contexto 3,77 kB |
| Imagem construída e identificada | Confirmado | `mindhub-api:dev` |

### Compose e rede

| Item | Situação | Evidência |
| --- | --- | --- |
| Serviço da API confirmado (ou adicionado, com registro) | Confirmado | Adicionado (`10-04`) |
| Serviços PostgreSQL (dev e testes) e volumes preservados | Confirmado | `postgres` inalterado e não recriado; `mindhub_test` no mesmo serviço; volume intacto |
| Healthchecks verificados | Confirmado | `pg_isready`; API iniciou após `Healthy` |
| Porta HTTP e porta interna do PostgreSQL confirmadas | Confirmado | 3000; 5432 (`inet_server_port`) |
| `DB_HOST` apontando para o serviço do Compose | Confirmado | `postgres` → 172.23.0.2 |
| Credenciais verificadas sem exposição | Confirmado | Comparação booleana; senha nunca impressa |
| Configuração validada com `docker compose config --quiet` | Confirmado | `OK` |

### Migrations

| Item | Situação | Evidência |
| --- | --- | --- |
| Scripts de migration confirmados | Confirmado | `:prod` criados; os de host inalterados |
| Banco de destino confirmado | Confirmado | `mindhub` |
| Histórico inspecionado e pendências identificadas | Confirmado | `[X]` nas duas; SQL ids 2 e 3 |
| Migrations aplicadas somente quando necessárias | Confirmado | Nenhuma aplicada (não havia pendência) |
| Nenhuma operação destrutiva indevida realizada | Confirmado | Sem `down -v`, `DROP`, `TRUNCATE`, `revert` |

### Execução e persistência

| Item | Situação | Evidência |
| --- | --- | --- |
| API inicializada e PostgreSQL saudável | Confirmado | `10-06` |
| Logs inspecionados | Confirmado | API e PostgreSQL |
| Comunicação entre contêineres confirmada | Confirmado | DNS, conexão e `pg_stat_activity` de 172.23.0.3 |
| Cadastro HTTP executado e resposta registrada | Confirmado | 201, `0cf433e8-…` |
| Registro consultado no PostgreSQL | Confirmado | `oferta.servicos` |
| API reiniciada e registro consultado novamente | Confirmado | `docker compose restart api` |
| Durabilidade comprovada | Confirmado | `diff` idêntico |

### Testes

| Item | Situação | Evidência |
| --- | --- | --- |
| Scripts de teste verificados | Confirmado | `test`, `test:e2e`, `lint`, `build` |
| Testes aplicáveis executados com números obtidos agora | Confirmado | 110/110, 35/35 (16:40) |
| Banco de testes isolado | Confirmado | `mindhub_test` (trava `_test` em código); dev intocado (`count = 2`) |
| Suítes E2E legadas tratadas com segurança | Confirmado | Não há suíte legada do scaffold; os E2E do projeto usam o banco de testes |
| Regressões investigadas | Confirmado | Nenhuma |

### GitHub

| Item | Situação | Evidência |
| --- | --- | --- |
| Alterações inspecionadas e segredos não versionados | Confirmado | Seção 17 |
| Commits reais identificados | Confirmado | `19cd672` |
| PR existente verificado ou novo PR preparado | Confirmado | Nenhum existia; #142 criado (Draft) |
| Evidências registradas e GitHub Project atualizado | Confirmado | Evidências no PR #142 e na #141; #141 em `In Review` no Project (seção 19) |
| Nenhum merge automático realizado | Confirmado | #131, #134, #135, #139, #142 sem merge |

**Resumo (35 itens):** 35 confirmados. (O Project ficou "não foi possível verificar" até o token ganhar o escopo `project`; depois foi conferido e atualizado.)

## 22. Pendências

| Pendência | Responsável |
| --- | --- |
| Revisão humana do PR #142 | @leohsm |
| Integrar a cadeia na ordem #131 → #134 → #135 → #139 → #142 | @leohsm |
| Revisar e integrar o PR de documentação do Material 10 | @leohsm |
| A API em contêiner e a API no host disputam a porta 3000: parar uma antes de subir a outra (registrado no README) | Uso |

## 23. Próximas ações

- #39 (proteção contra suspensão concorrente) e #41 (documentação do UC03), agora com um ambiente containerizado reproduzível.
- Opcional, fora do escopo da #141: rota de saúde HTTP para permitir `healthcheck` do serviço `api` (a imagem runtime não tem `curl`).
