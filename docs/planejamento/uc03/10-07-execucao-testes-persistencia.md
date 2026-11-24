# 10-07 — Execução, testes e persistência

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#141](https://github.com/MindHub-DSC/Mindhub/issues/141)
**Branch:** `feature/141-uc03-containerizar-backend`
**Data:** 17/11/2026

Legenda: **[DOC]** documentado anteriormente · **[CÓD]** confirmado no código · **[EXE]** executado nesta atividade · **[AGU]** aguardando evidência · **[PEN]** pendente de correção.

# Parte 1 — HTTP e durabilidade (Fase 9)

## 1. Ambiente

| Item | Valor |
| --- | --- |
| API | Contêiner `mindhub-api-1` (imagem `mindhub-api:dev`), `localhost:3000` → 3000 |
| Banco | `mindhub` no contêiner `mindhub-postgres-1` (rede `mindhub_default`) |
| Cliente HTTP | `curl` no host; corpo lido de arquivo UTF-8 com `--data-binary @arquivo` (o `curl -d '…'` do Git Bash troca acentos, ver `07-05`) |
| Cliente SQL | `docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"` (sem senha na linha de comando) |
| Ator | Usuário `3163a113-…`, dono do perfil `ece5a9cc-…` em situação `ATIVO` (conferido por SQL antes da requisição) |

Contrato do corpo (`src/oferta/http/publicar-servico.dto.ts`): `z.strictObject` — campos fora do contrato são **recusados com 400** (FE-01 do UC03), não descartados como no `whitelist: true` do material.

## 2. Cadastro via HTTP

```text
$ date
17/11/2026 16:39:33 -0300
$ curl -sS -i -X POST http://localhost:3000/servicos -H "Content-Type: application/json; charset=utf-8" --data-binary @valido.json
corpo: {"usuarioId":"3163a113-104e-43a1-bb2b-1c06611abc06","titulo":"Mentoria de produto (contêiner)","descricao":"Sessões de discovery publicadas pela API em Docker","modeloContratacao":"RESERVA_DIRETA","condicoes":{"preco":18000,"moeda":"BRL","duracaoMinutos":90,"modalidade":"ONLINE"}}

HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 349
ETag: W/"15d-esXCO4sotCJxYXEJgr/e+0o7pj8"
Date: Tue, 17 Nov 2026 19:39:33 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":"0cf433e8-9ae2-4dc8-99e9-8e9cb2118182","perfilId":"ece5a9cc-d4e4-40e9-98f9-518aaf546244","titulo":"Mentoria de produto (contêiner)","descricao":"Sessões de discovery publicadas pela API em Docker","modeloContratacao":"RESERVA_DIRETA","condicoes":{"preco":18000,"moeda":"BRL","duracaoMinutos":90,"modalidade":"ONLINE"},"situacao":"PUBLICADO"}
```

Identificador gerado: **`0cf433e8-9ae2-4dc8-99e9-8e9cb2118182`**.

### Conexão vista pelo servidor (logo após a requisição)

```text
$ psql: SELECT datname, usename, client_addr, count(*) FROM pg_stat_activity … GROUP BY 1,2,3
 datname | usename | client_addr | count
---------+---------+-------------+-------
 mindhub | mindhub | 172.23.0.3  |     1
```

`172.23.0.3` é o IP do `mindhub-api-1` na rede `mindhub_default` (`10-06`): a conexão ao banco `mindhub` partiu do contêiner da API.

### Validação de entrada

```text
$ curl … --data-binary @invalido.json
corpo: {"usuarioId":"nao-e-uuid","descricao":"Sem título","modeloContratacao":"GRATIS"}
HTTP/1.1 400 Bad Request
{"message":["usuarioId: Invalid UUID","titulo: Invalid input: expected string, received undefined","modeloContratacao: Invalid option: expected one of \"RESERVA_DIRETA\"|\"SOB_PROPOSTA\""],"error":"Bad Request","statusCode":400}

$ curl … --data-binary @campo-extra.json
corpo: {"usuarioId":"3163a113-104e-43a1-bb2b-1c06611abc06","titulo":"Com campo extra","descricao":"Não deve ser gravado","modeloContratacao":"SOB_PROPOSTA","situacao":"SUSPENSO"}
HTTP/1.1 400 Bad Request
{"message":["Unrecognized key: \"situacao\""],"error":"Bad Request","statusCode":400}
```

Os dois corpos foram recusados antes do caso de uso; a consulta abaixo (`com_campo_extra = 0`) confirma que nada foi gravado.

## 3. Consulta SQL antes do reinício

```text
$ docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < consulta.sql
 current_database
------------------
 mindhub

                  id                  |              perfil_id               |             titulo              |                     descricao                      | modelo_contratacao | situacao  | preco | moeda | duracao_minutos | modalidade |        publicado_em        | ordem
--------------------------------------+--------------------------------------+---------------------------------+----------------------------------------------------+--------------------+-----------+-------+-------+-----------------+------------+----------------------------+-------
 0cf433e8-9ae2-4dc8-99e9-8e9cb2118182 | ece5a9cc-d4e4-40e9-98f9-518aaf546244 | Mentoria de produto (contêiner) | Sessões de discovery publicadas pela API em Docker | RESERVA_DIRETA     | PUBLICADO | 18000 | BRL   |              90 | ONLINE     | 2026-11-17 19:39:33.718+00 |     2
(1 row)

 total | com_campo_extra
-------+-----------------
     2 |               0
```

`consulta.sql`:

```sql
SELECT current_database();
SELECT id, perfil_id, titulo, descricao, modelo_contratacao, situacao, preco, moeda, duracao_minutos, modalidade, publicado_em, ordem
  FROM oferta.servicos WHERE id = '0cf433e8-9ae2-4dc8-99e9-8e9cb2118182';
SELECT count(*) AS total, count(*) FILTER (WHERE titulo = 'Com campo extra') AS com_campo_extra FROM oferta.servicos;
```

Sem endpoint `GET` (fora do escopo): a leitura é por SQL, com o schema `oferta`. `publicado_em = 19:39:33.718 UTC` = 16:39:33 em Brasília, o instante da requisição. `ordem = 2` e `total = 2`: o outro registro é o `49e6042b-…` do Material 09.

## 4. Reinício só da API

```text
### estado antes
mindhub-api-1 Up About a minute
mindhub-postgres-1 Up 2 hours (healthy)
/mindhub-api-1 StartedAt=2026-11-17T19:38:14.361567804Z
/mindhub-postgres-1 StartedAt=2026-11-17T17:37:46.918354642Z

$ date
17/11/2026 16:39:42 -0300
$ docker compose restart api
 Container mindhub-api-1 Restarting
 Container mindhub-api-1 Started
exit=0
(espera de 8 s)

### estado depois
mindhub-api-1 Up 8 seconds
mindhub-postgres-1 Up 2 hours (healthy)
/mindhub-api-1 StartedAt=2026-11-17T19:39:45.933561504Z      ← mudou: a API reiniciou
/mindhub-postgres-1 StartedAt=2026-11-17T17:37:46.918354642Z ← igual: o banco não foi tocado

$ docker compose logs --since 30s api
[Nest] 1  - 11/17/2026, 7:39:46 PM     LOG [NestFactory] Starting Nest application...
[Nest] 1  - 11/17/2026, 7:39:46 PM     LOG [RouterExplorer] Mapped {/servicos, POST} route +0ms
[Nest] 1  - 11/17/2026, 7:39:46 PM     LOG [NestApplication] Nest application successfully started +2ms
```

Nenhum volume removido, nenhum `down`, o PostgreSQL não foi reiniciado.

## 5. Consulta SQL depois do reinício

```text
 current_database
------------------
 mindhub

                  id                  |              perfil_id               |             titulo              |                     descricao                      | modelo_contratacao | situacao  | preco | moeda | duracao_minutos | modalidade |        publicado_em        | ordem
--------------------------------------+--------------------------------------+---------------------------------+----------------------------------------------------+--------------------+-----------+-------+-------+-----------------+------------+----------------------------+-------
 0cf433e8-9ae2-4dc8-99e9-8e9cb2118182 | ece5a9cc-d4e4-40e9-98f9-518aaf546244 | Mentoria de produto (contêiner) | Sessões de discovery publicadas pela API em Docker | RESERVA_DIRETA     | PUBLICADO | 18000 | BRL   |              90 | ONLINE     | 2026-11-17 19:39:33.718+00 |     2
(1 row)

 total | com_campo_extra
-------+-----------------
     2 |               0

$ diff antes.txt depois.txt
identicos
```

## 6. Conclusão (durabilidade)

**Durabilidade comprovada.** O Serviço `0cf433e8-…`, criado pela API **containerizada**, está no PostgreSQL antes e depois de `docker compose restart api`, com todos os campos idênticos (`diff` vazio). O processo Node da API é outro depois do reinício (novo `StartedAt`), e o contêiner do banco ficou no ar o tempo todo (`StartedAt` inalterado).

# Parte 2 — Testes e regressões (Fase 10)

## 7. Suítes do projeto

| Script | Configuração | Conteúdo | Banco |
| --- | --- | --- | --- |
| `pnpm test` | `vitest.config.ts` (`test/unit/**`) | Domínio, aplicação, contrato em memória, HTTP com mock, integrado em memória, composição, falha de conexão | Nenhum |
| `pnpm test:e2e` | `vitest.config.e2e.ts` (`test/integracao/**`, `test/e2e/**`) | Integração TypeORM (UC01, UC02, UC03) e E2E HTTP (UC01, UC02, UC03) | `mindhub_test` |

Equivalência com o material: o `test:integration` do CeliLac corresponde ao `pnpm test:e2e` do projeto. Os E2E **não são suítes legadas do scaffold**: passam pelo `test/setup/ambiente-de-teste.ts`, que troca `DB_NAME` por `DB_TEST_NAME` e recusa nomes sem `_test` ou iguais a `DB_NAME` (`test/setup/banco-de-teste.ts`, linhas 3–23) [CÓD]. Por isso foram executados.

### Banco de testes

```text
$ docker ps --filter name=mindhub-postgres --format '{{.Names}} {{.Status}} project={{.Label "com.docker.compose.project"}}'
mindhub-postgres-1 Up 2 hours (healthy) project=mindhub
```

O banco de testes é o `mindhub_test`, no mesmo servidor (não há serviço separado, decisão registrada no `09-02`). Os testes rodam no host e conectam por `localhost:5433`; a API containerizada continua apontando para `mindhub`.

## 8. Execução (agora)

```text
$ pnpm test
 Test Files  12 passed (12)
      Tests  110 passed (110)
   Start at  16:40:02
   Duration  2.20s (transform 966ms, setup 0ms, import 6.40s, tests 1.03s, environment 2ms)
=== exit 0

$ pnpm test:e2e
 Test Files  6 passed (6)
      Tests  35 passed (35)
   Start at  16:40:05
   Duration  6.18s (transform 306ms, setup 401ms, import 2.62s, tests 1.57s, environment 1ms)
=== exit 0

$ pnpm lint
$ oxlint --type-aware src/ test/
=== lint exit 0
$ pnpm build
=== build exit 0

$ (depois dos testes) SELECT current_database(), count(*) FROM oferta.servicos   (via contêiner, banco de desenvolvimento)
mindhub|2                     ← os testes não tocaram o banco de desenvolvimento

$ git status --short
 M mindhub-backend/.env.example
 M mindhub-backend/compose.yaml
 M mindhub-backend/package.json
?? mindhub-backend/.dockerignore
?? mindhub-backend/Dockerfile
?? docs/planejamento/uc03/10-0*.md, docs/prompts/10*.md
```

O `pnpm-lock.yaml` **não** foi reescrito.

## 9. Comparação com a linha de base (`10-01`)

| Suíte | Linha de base (16:20) | Agora (16:40) | Regressões |
| --- | --- | --- | --- |
| `pnpm test` | 12 arquivos, 110 | 12 arquivos, 110 | Nenhuma |
| `pnpm test:e2e` | 6 arquivos, 35 | 6 arquivos, 35 | Nenhuma |

Nenhum teste foi criado ou alterado: a containerização não mudou código de `src/` nem de `test/`.

## 10. Testes automatizados × evidências operacionais

| Tipo | O que comprova | Onde |
| --- | --- | --- |
| Testes automatizados | Comportamento do código (domínio, HTTP, persistência no `mindhub_test`) | Seção 8 |
| Evidências operacionais | Imagem, Compose, rede, variáveis, migrations, logs, HTTP no contêiner, SQL no `mindhub`, reinício | `10-03` a `10-06`, seções 2 a 6 deste artefato |

Uma suíte aprovada **não** substitui a prova do ambiente Docker: os testes rodam no host, fora dos contêineres da API.

## 11. Conclusão

Ambiente containerizado funcional e comprovado, sem regressões. Nenhuma falha de teste a diagnosticar.

## 12. Revalidação independente (24/11/2026)

Repetida a partir da ponta de `feature/141-uc03-containerizar-backend` (`19cd672`), em um worktree limpo, com Docker sem contêineres nem volume (ambiente novo; `.env` gerado de `.env.example` com senha aleatória, não versionado). Senhas não impressas.

| Etapa | Resultado [EXE] |
| --- | --- |
| `docker compose config --quiet` | `OK` |
| `docker compose up -d --build api` | Imagem construída; volume e rede criados; `postgres` `healthy` antes da API; `Nest application successfully started`; `Mapped {/servicos, POST}` |
| `migration:show:prod` (banco novo) | `[ ]` nas 2 migrations (pendentes, pois o volume era novo) |
| `migration:run:prod` | As 2 migrations aplicadas; `show` depois: `[X]` nas duas |
| `POST /usuarios`, `POST /especialistas`, `POST /servicos` | 201 nos três; Serviço `883a3438-86fc-4a87-8444-1d171e543de6` (`PUBLICADO`) |
| Corpo inválido em `POST /servicos` | 400 |
| SQL antes e depois de `docker compose restart api` | `diff` vazio; `postgres` não reiniciado |

Conclusão: build, Compose, migrations compiladas, HTTP e durabilidade reproduzidos em ambiente limpo. `pnpm test` e `pnpm test:e2e` foram reexecutados na verificação da seção 13 (110 e 35).

## 13. Verificação pelo guia pós-atividade (24/11/2026)

Executado o `docs/prompts/10-guia-verificacao-pos-atividade.md` na ponta de `feature/141-uc03-containerizar-backend` (`19cd672`, worktree em HEAD destacado), com o ambiente da seção 12. Senhas não impressas.

| Seção do guia | Resultado [EXE] |
| --- | --- |
| 1. Pré-requisitos | `.env` ignorado (`git check-ignore .env` → `.env`); chaves iguais às do `.env.example`; Docker 29.9.3, Compose v5.7.1. `COMPOSE_PROJECT_NAME` não definido de propósito: o `compose.yaml` fixa `name: mindhub` (`10-04`) |
| 2. Compose e imagem | `config --quiet` → `OK`; `docker compose build api` concluído; `mindhub-api:dev` listada |
| 3. Subir | `postgres` `healthy`, `api` `Up`; logs com `Mapped {/servicos, POST}` e `Nest application successfully started`; 0 linhas com `error` |
| 4. Migrations | `migration:show:prod` → `[X]` nas 2; `run` não executado |
| 5. HTTP | `POST /servicos` válido → 201 (`6e66a44a-6b03-48bf-9359-b03a3ae01634`); corpo sem campos obrigatórios → 400; campo extra → **400** `Unrecognized key: "campoExtra"` (o projeto usa `z.strictObject`: rejeita em vez de descartar, ver seção 6 do `10-07`) |
| 6. SQL e durabilidade | Mesma linha antes e depois de `docker compose restart api`; `diff` vazio |
| 7. Testes | `pnpm test` 12 arquivos / **110** testes; `pnpm test:e2e` 6 arquivos / **35** testes. Sem `node`/`pnpm` no host desta máquina: rodados em contêiner `node:24.19.0-bookworm-slim` na rede `mindhub_default` (`DB_HOST=postgres`, `DB_PORT=5432`), com `node_modules` em volume anônimo |
| 7. Banco de testes | `mindhub_test` criado pelo `global-setup` no serviço `postgres`; `docker ps` → `mindhub-postgres-1 … project=mindhub`; banco de desenvolvimento seguiu com 2 linhas em `oferta.servicos` (testes não o tocaram) |
| 8. Checklist do PR | `git status` limpo; lockfile não reescrito; sem `.env` nem senha no diff |

Os números (110 e 35) são iguais aos da linha de base (`10-01`) e da seção 8, agora obtidos de novo. Não houve regressões.
