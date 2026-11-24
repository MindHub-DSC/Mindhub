# 10-01 — Diagnóstico da containerização

**Projeto:** MindHub (backend NestJS 12 + TypeORM 1 + PostgreSQL 18)
**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Responsável:** Leonardo Herrero S. Martins (@leohsm)
**Data:** 17/11/2026
**Diretório de artefatos:** `docs/planejamento/uc03/` (o mesmo dos Materiais 01 a 09)
**Fontes:** `09-01` a `09-08`; código da branch `feature/37-uc03-persistir-servico` @ `e66b59e` (ponta da cadeia do UC03); ambiente Docker local.

Legenda de classificação: **[DOC]** documentado anteriormente · **[CÓD]** confirmado no código · **[EXE]** executado nesta atividade · **[AGU]** aguardando evidência · **[PEN]** pendente de correção.

## 1. Issue e branch

| Item | Situação |
| --- | --- |
| Issue de containerização | **Não existe** [EXE]: `gh issue list --state all` não tem nenhuma issue de Docker/containerização; as issues abertas do UC03 são #35 a #41 (domínio, persistência, aplicação, concorrência, HTTP, documentação) |
| PR de containerização | **Não existe** [EXE]: `gh pr list --state all` lista #131, #134, #135 e #139 (Draft, cadeia do UC03) e PRs de documentação já integrados |
| Branch de containerização | **Não existe** [EXE] (local nem remota) |
| Branch atual | `feature/37-uc03-persistir-servico` @ `e66b59e`, igual à remota [EXE] |
| Cadeia do UC03 | `main → feature/36 (#131) → feature/38 (#134) → feature/40 (#135) → feature/37 (#139)`, todos Draft [DOC `09-08`] |

O endpoint `POST /servicos` com persistência real **só existe em `feature/37-…`**. Uma containerização a partir da `main` não teria o caso de uso do UC03 para a verificação HTTP (Fase 9).

## 2. Ambiente

| Item | Valor | Classe |
| --- | --- | --- |
| Docker | client/server 29.9.3; Compose v5.7.0 | [EXE] |
| Node.js no host | v24.19.0 (`.node-version` = `24.19.0`; `engines.node` = `>=24.15.0 <25`) | [EXE] [CÓD] |
| pnpm no host | 12.9.1 (`packageManager` = `pnpm@12.9.1`; `engines.pnpm` = `>=12 <13`) | [EXE] [CÓD] |
| Lockfile | `pnpm-lock.yaml`, `lockfileVersion: '9.0'`, bloco `packageManagerDependencies` com `pnpm 12.9.1`, coerente com o `packageManager` | [CÓD] |
| `pnpm-workspace.yaml` | Não existe (projeto de pacote único) | [EXE] |
| Imagens Node locais | Só `node:20` e `node:20-alpine`: a imagem de Node 24 ainda terá de ser baixada | [EXE] |
| Porta 3000 no host | Livre (nenhum backend do Material 09 rodando) | [EXE] |

## 3. Arquivos inspecionados

| Arquivo | Situação | Classificação |
| --- | --- | --- |
| `Dockerfile` | **Não existe** em nenhuma branch | Inexistente e necessário |
| `.dockerignore` | **Não existe** | Inexistente e necessário |
| `compose.yaml` | Existe: projeto `name: mindhub`, só o serviço `postgres` | Já implementado e confirmado (banco); serviço `api` **inexistente e necessário** |
| `package.json` | `"type": "module"`; `build` = `nest build`; `start:prod` = `node dist/main.js`; scripts de migration rodam `pnpm run build` antes | Já implementado; scripts de migration **incompatíveis com a imagem runtime** (ver seção 6) |
| `tsconfig.json` / `tsconfig.build.json` | ESM (`nodenext`), `outDir ./dist`, `rootDir ./src` no build | Já implementado e confirmado |
| `nest-cli.json` | `sourceRoot: src`, `deleteOutDir: true` | Já implementado e confirmado |
| `src/main.ts` | `carregarArquivoEnv()` e `app.listen(process.env.PORT ?? 3000)` | Já implementado e confirmado |
| `src/app.module.ts` | `TypeOrmModule.forRootAsync` com `opcoesTypeOrm(lerAmbienteDoBanco())`, `retryAttempts: 3`, `retryDelay: 2000` | Já implementado e confirmado |
| `src/config/ambiente.ts` | Lê `.env` da pasta atual **sem sobrescrever** variáveis já definidas; valida `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` com zod | Já implementado; comportamento favorável ao contêiner (seção 5) |
| `src/database/data-source.ts` | `export default new DataSource(opcoesTypeOrm(lerAmbienteDoBanco()))` | Já implementado e confirmado |
| `src/database/migracoes.ts` | Lista explícita (sem glob): `EsquemaInicialIdentidadeOferta1794334070122`, `ServicosDoUc031794941417929` | Já implementado e confirmado: funciona igual em `.ts` e em `dist/*.js` |
| `.env.example` | `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_TEST_NAME` | Já implementado; sem as variáveis da API no contêiner |
| `.env` | Existe, não versionado (`.gitignore`: `.env`, `.env.*`, `!.env.example`). Mesmas chaves do exemplo; `PORT=3000`, `DB_HOST=localhost`, `DB_PORT=5433`, `DB_NAME=mindhub`, `DB_TEST_NAME=mindhub_test` (senha não lida) | Já implementado e confirmado |
| `vitest.config.ts` / `vitest.config.e2e.ts` | `pnpm test` só `test/unit/` (sem banco); `pnpm test:e2e` integração + E2E no `DB_TEST_NAME` | Já implementado e confirmado |

## 4. Infraestrutura existente (Docker)

```text
$ docker compose ps -a
NAME                 IMAGE                COMMAND                  SERVICE    CREATED       STATUS                 PORTS
mindhub-postgres-1   postgres:18-alpine   "docker-entrypoint.s…"   postgres   2 hours ago   Up 2 hours (healthy)   0.0.0.0:5433->5432/tcp, [::]:5433->5432/tcp

$ docker volume ls (mindhub)
mindhub_mindhub-pgdata

$ docker ps -a (projeto do contêiner)
mindhub-postgres-1 Up 2 hours (healthy) project=mindhub
```

| Elemento | Valor no MindHub | Referência CeliLac (não imposta) |
| --- | --- | --- |
| Projeto Compose | `mindhub` (chave `name:` do `compose.yaml`) | `COMPOSE_PROJECT_NAME` no `.env` |
| Serviço PostgreSQL (dev) | `postgres`, contêiner `mindhub-postgres-1`, banco `mindhub`, PostgreSQL 18, interna 5432, publicada **5433** | `postgres`, 5432/5432 |
| Banco de testes | **Outro banco (`mindhub_test`) no mesmo serviço**, sem serviço próprio [DOC `09-02`] | Serviço `postgres_test`, porta 5435 |
| Volume | `mindhub_mindhub-pgdata` (nome lógico `mindhub-pgdata`) | `celilac_postgres_data` |
| Healthcheck | `pg_isready`, 5s/3s/10 tentativas | Igual em conceito |
| Serviço da API | **Não existe** | `api`, porta 3200 |
| Porta HTTP da API | **3000** (`PORT` no `.env`, padrão do `main.ts`) | 3200 |
| Variáveis de conexão | `DB_USER` (não `DB_USERNAME`) | `DB_USERNAME` |
| Tabela do caso de uso | `oferta.servicos` (schema `oferta`), chave `id` | `products.products` |

A chave `name: mindhub` já fixa o prefixo de rede e volumes, que é o que o material busca com `COMPOSE_PROJECT_NAME`. Não há volume duplicado.

## 5. Pontos técnicos relevantes para a containerização

1. **`.env` dentro do contêiner:** `carregarArquivoEnv()` lê `.env` da pasta atual e não sobrescreve o que já está no ambiente. Como o `.env` não irá para a imagem, o arquivo não existirá e a função não faz nada; as variáveis virão da chave `environment` do Compose. Nenhuma mudança de código é necessária. [CÓD]
2. **`DB_PORT` tem dois papéis no `.env`:** é a porta **publicada** do PostgreSQL (`"${DB_PORT:-5433}:5432"`) e a porta que a API usa **no host**. No contêiner, a API precisa de `DB_HOST=postgres` e `DB_PORT=5432` (porta interna), fixados no `environment` do serviço `api`. [CÓD]
3. **Migrations compiladas:** `MIGRACOES` é uma lista de classes importadas, então o DataSource compilado (`dist/database/data-source.js`) carrega as migrations sem glob nem distinção `.ts`/`.js`. [CÓD]
4. **Scripts de migration:** `migration:show`/`migration:run` executam `pnpm run build` (Nest CLI, dependência de desenvolvimento, e `src/`) antes da CLI do TypeORM. Na imagem runtime não há `src/` nem Nest CLI. Faltam scripts `:prod` que chamem só `typeorm … -d dist/database/data-source.js`. [CÓD] → [PEN]
5. **CLI do TypeORM em produção:** o binário `typeorm` vem do pacote `typeorm`, que é dependência de produção. [CÓD]
6. **Banco de testes no mesmo servidor:** a API containerizada deve usar `DB_NAME=mindhub`, nunca `mindhub_test`. O `DB_TEST_NAME` não deve ser passado à API.

## 6. Migrations (estado documentado)

| Banco | Histórico | Classe |
| --- | --- | --- |
| `mindhub` | `2 EsquemaInicialIdentidadeOferta1794334070122`, `3 ServicosDoUc031794941417929` | [DOC `09-04`]; será reconferido na Fase 7 de dentro do contêiner |
| `mindhub_test` | `1 EsquemaInicial…`, `3 ServicosDoUc03…` | [DOC `09-04`] |

## 7. Linha de base dos testes (executada agora)

Branch `feature/37-uc03-persistir-servico` @ `e66b59e`.

```text
$ pnpm test
 Test Files  12 passed (12)
      Tests  110 passed (110)
   Start at  16:20:45
   Duration  2.37s (transform 803ms, setup 0ms, import 6.51s, tests 1.06s, environment 3ms)
=== exit 0

$ pnpm test:e2e
 Test Files  6 passed (6)
      Tests  35 passed (35)
   Start at  16:20:48
   Duration  8.17s (transform 547ms, setup 584ms, import 3.68s, tests 2.18s, environment 1ms)
=== exit 0

$ git status --short           (depois dos testes)
?? docs/prompts/10-containerizacao-do-backend-nestjs-com-docker-compose.md
?? docs/prompts/10.1-guia-verificacao-pos-atividade.md
```

| Suíte | Arquivos | Testes | Falhas | Banco |
| --- | --- | --- | --- | --- |
| `pnpm test` | 12 | 110 | 0 | Nenhum |
| `pnpm test:e2e` | 6 | 35 | 0 | `mindhub_test` (no `localhost:5433`) |

O `pnpm-lock.yaml` não foi reescrito pelos testes. Os E2E do projeto **não são suítes legadas do scaffold**: passam por `test/setup/ambiente-de-teste.ts`, que troca `DB_NAME` por `DB_TEST_NAME` (sufixo `_test` obrigatório) [DOC `09-07`].

## 8. Dependências

| Depende de | Situação |
| --- | --- |
| #37 (persistência, PR #139) | Implementada, Draft, sem merge. A containerização precisa do código dela para comprovar `POST /servicos` com PostgreSQL |
| #36, #38, #40 | Implementadas, Draft (cadeia) |

## 9. Problemas e pendências

| # | Item | Tipo |
| --- | --- | --- |
| 1 | Não há Issue de containerização | Bloqueia a branch e o PR: precisa ser criada (decisão do responsável) |
| 2 | Branch-base da containerização | Decisão: `feature/37-…` (tem o UC03 completo) ou `main` (sem UC03) |
| 3 | Dockerfile inexistente | Criar o mínimo (Fase 3) |
| 4 | `.dockerignore` inexistente | Criar o mínimo (Fase 4) |
| 5 | Serviço `api` inexistente no Compose | Acrescentar sem alterar o serviço `postgres` (Fase 5) |
| 6 | Scripts de migration para o runtime compilado inexistentes | Acrescentar `migration:show:prod` e `migration:run:prod` (Fase 7) |
| 7 | Imagem `node:24.19.0-bookworm-slim` não está no host | Será baixada no primeiro build |
| 8 | GitHub Project | Não verificável pela CLI (token sem escopo de Project) [DOC `09-08`] |

## 10. Plano de validação

| Fase | Verificação | Evidência esperada |
| --- | --- | --- |
| 3 | Dockerfile multi-stage com Node 24.19.0 e pnpm 12.9.1; `pnpm build` gera `dist/main.js`, `dist/database/data-source.js` e as migrations | `find dist …` |
| 4 | `.dockerignore` sem `.env`, `node_modules`, `dist`; `docker build` | Saída do build, `docker image ls` |
| 5 | Serviço `api` com `depends_on: service_healthy`; `docker compose config --quiet` | `OK` |
| 6 | `DB_HOST=postgres`, `DB_PORT=5432`, `DB_NAME=mindhub` no processo da API, sem senha impressa | `docker compose exec`/`run` imprimindo só nomes ou valores não sensíveis |
| 7 | `migration:show:prod` de dentro do contêiner | `[X]` nas duas migrations (sem `run` se não houver pendência) |
| 8 | `docker compose up -d --build api` | `ps`, logs do Nest com `Mapped {/servicos, POST}` |
| 9 | `POST /servicos` → SQL em `oferta.servicos` → `docker compose restart api` → mesmo SQL | 201 + linha idêntica antes e depois |
| 10 | `pnpm test` e `pnpm test:e2e` | Números desta execução |
| 12 | Commits, PR Draft para a base escolhida, artefatos | Hashes e URL reais |

---

## 11. Regularização (17/11/2026)

### Decisões de @leohsm

| Item | Decisão |
| --- | --- |
| Issue | Criar uma issue nova de containerização, ligada ao épico #35 |
| Branch-base | `feature/37-uc03-persistir-servico` (cadeia `main → 36 → 38 → 40 → 37 → 141`) |

### Execução [EXE]

```text
$ gh issue create --title "[UC03-SUB-07] [INFRA] Containerizar o backend NestJS com Docker Compose" \
    --assignee leohsm --label usecase:uc03 --label layer:integration --label priority:medium
https://github.com/MindHub-DSC/Mindhub/issues/141

$ gh api -X POST repos/MindHub-DSC/Mindhub/issues/35/sub_issues -F sub_issue_id=<id da #141>
$ gh api repos/MindHub-DSC/Mindhub/issues/35/sub_issues   (últimas)
41 [UC03-SUB-06] [C2] Documentar o UC03 e o endpoint
141 [UC03-SUB-07] [INFRA] Containerizar o backend NestJS com Docker Compose

$ git switch -c feature/141-uc03-containerizar-backend feature/37-uc03-persistir-servico
Switched to a new branch 'feature/141-uc03-containerizar-backend'
```

### Definition of Ready da #141

| Código | Condição | Situação |
| --- | --- | --- |
| DoR-01 | Objetivo | Atende: "Executar o backend NestJS em contêiner, integrado ao PostgreSQL existente…" |
| DoR-02 | Escopo | Atende: inclui Dockerfile, `.dockerignore`, serviço `api`, scripts `:prod`, verificações; exclui domínio, aplicação, migrations e serviço PostgreSQL de testes |
| DoR-03 | Critérios verificáveis | Atende: 5 critérios com evidência objetiva (build, Compose, migrations, HTTP + SQL, testes) |
| DoR-04 | Dependências | Atende: #37 implementada (PR #139, Draft) |
| DoR-05 | Informações técnicas | Atende: este diagnóstico |
| DoR-06 | Responsável | Atende: @leohsm |
| DoR-07 | Revisão | Autorrevisão (equipe de um integrante) |

Labels usados: `usecase:uc03`, `layer:integration`, `priority:medium` (o repositório não tem label de infraestrutura; não foi criado um novo).

**WIP:** a #141 depende da #37, mas a #37 já está implementada e em revisão (PR Draft com todos os critérios marcados). O GitHub Project não é verificável pela CLI; o card da #141 deve ir para `In Progress` manualmente.

**Pendências 1 e 2 da seção 9 resolvidas. Próxima fase: Dockerfile (Fase 3).**
