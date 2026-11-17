# 09-02 — Ambiente PostgreSQL

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#37](https://github.com/MindHub-DSC/Mindhub/issues/37)
**Data:** 17/11/2026

> Fase de **inspeção**. Nenhum arquivo, contêiner, volume, banco ou usuário foi alterado. Nenhuma senha aparece neste documento: as consultas dentro do contêiner usam `$POSTGRES_USER`, e a de fora lê o `.env` sem imprimir valores.

## 1. Infraestrutura existente

`mindhub-backend/compose.yaml` (versionado, sem segredos):

```yaml
name: mindhub
services:
  postgres:
    image: postgres:18-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER:?defina DB_USER no .env}
      POSTGRES_PASSWORD: ${DB_PASSWORD:?defina DB_PASSWORD no .env}
      POSTGRES_DB: ${DB_NAME:?defina DB_NAME no .env}
    ports:
      - "${DB_PORT:-5433}:5432"
    volumes:
      - mindhub-pgdata:/var/lib/postgresql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
volumes:
  mindhub-pgdata:
```

```text
$ docker compose ps
NAME                 IMAGE                COMMAND                  SERVICE    CREATED          STATUS                    PORTS
mindhub-postgres-1   postgres:18-alpine   "docker-entrypoint.s…"   postgres   51 minutes ago   Up 51 minutes (healthy)   0.0.0.0:5433->5432/tcp, [::]:5433->5432/tcp

$ docker compose port postgres 5432
0.0.0.0:5433

$ docker volume ls (mindhub)
mindhub_mindhub-pgdata
```

| Item | Valor |
| --- | --- |
| Serviço | Um só (`postgres`), usado por UC01, UC02 e agora UC03 |
| Imagem | `postgres:18-alpine` (servidor `PostgreSQL 18.6`) |
| Portas | **5433 no host** → **5432 no contêiner** |
| Volume | `mindhub_mindhub-pgdata` (os dados sobrevivem a reinícios do contêiner) |
| Healthcheck | `pg_isready`, status `healthy` |
| Rede | Padrão do compose; a API roda fora do Docker e conecta por `localhost:5433` |

## 2. Bancos, usuários e variáveis

```text
$ psql: bancos do servidor
mindhub
mindhub_test
postgres
$ psql: usuários (roles com login)
mindhub|t
```

| Ambiente | Banco | Usuário | Variáveis (nomes; valores não expostos) |
| --- | --- | --- | --- |
| Desenvolvimento | `mindhub` | `mindhub` | `DB_HOST=localhost`, `DB_PORT=5433`, `DB_USER`, `DB_PASSWORD`, `DB_NAME=mindhub` |
| Testes (integração/E2E) | `mindhub_test` | `mindhub` (o mesmo) | `DB_TEST_NAME=mindhub_test` (o setup troca `DB_NAME` por ele) |

O `.env` existe e define `DB_USER` e `DB_PASSWORD` (uma ocorrência de cada, conferido por contagem, sem ler o valor). O `.env` não é versionado; o `.env.example` traz só um valor de exemplo (`troque-esta-senha`).

## 3. Identidade da conexão e portas

```text
$ (contêiner) psql -h localhost -U "$POSTGRES_USER" -d mindhub_test -Atc "SELECT current_database(), current_user, inet_server_port()"
mindhub_test|mindhub|5432

$ (host) node + pg, host/porta do .env
cliente localhost:5433 -> {"banco":"mindhub","usuario":"mindhub","porta_servidor":5432}
cliente localhost:5433 -> {"banco":"mindhub_test","usuario":"mindhub","porta_servidor":5432}
```

- O cliente no host conecta em **`localhost:5433`** (porta **publicada**), mas o servidor informa **`inet_server_port() = 5432`** (porta **interna**). As duas estão certas: o Docker repassa 5433 → 5432. Por isso nenhum teste pode exigir `inet_server_port() = 5433`.
- A primeira tentativa dentro do contêiner, sem `-h`, devolveu a porta **vazia**: o `psql` usou o socket Unix, e `inet_server_port()` só tem valor em conexões TCP.
- `current_database()` diferencia corretamente `mindhub` e `mindhub_test`.

## 4. Separação desenvolvimento × testes

| Requisito do Material 09 | Situação no projeto |
| --- | --- |
| Banco exclusivo de testes | **Atende**: `mindhub_test`, separado de `mindhub` |
| Nome distinto do de desenvolvimento | **Atende**, e é imposto no código: `apontarParaBancoDeTeste()` exige o sufixo `_test` e recusa `DB_TEST_NAME = DB_NAME` |
| Migrations no banco de testes | **Atende**: `test/setup/global-setup.ts` cria o banco se faltar e roda as migrations nele |
| Serviço/porta próprios para testes | **Não**: mesmo serviço e mesma porta (5433). O material usa outra porta só como exemplo |
| **Credenciais distintas das de desenvolvimento** | **Não atende**: o mesmo usuário `mindhub`, que é **superusuário** (`rolsuper = t`) |
| Sem credenciais de produção | **Atende**: não existe ambiente de produção configurado |
| Limpeza destrutiva | Não há `TRUNCATE`: os testes apagam só os registros que criaram (`limparDadosDosUsuarios`, por id) |

### Ponto pendente: usuário dos testes

O mesmo superusuário acessa os dois bancos. A proteção hoje está no **código** (nome `_test`, diferente de `DB_NAME`), não nas **permissões** do banco. Duas opções, sem nada aplicado:

| Opção | O que mudaria | Prós | Contras |
| --- | --- | --- | --- |
| Manter | Nada; registrar a justificativa | Sem mudança na infraestrutura usada por UC01/UC02; os testes não fazem limpeza destrutiva | Um erro de configuração que contorne o setup teria acesso ao banco de desenvolvimento |
| Usuário próprio de testes | Criar a role `mindhub_test` (sem superusuário), dona apenas de `mindhub_test`; novas variáveis `DB_TEST_USER`/`DB_TEST_PASSWORD` no `.env` e no `.env.example`; ajustar `apontarParaBancoDeTeste()` | Isolamento também por permissão | Muda o setup de testes de todos os casos de uso; exige `CREATE ROLE` e `ALTER DATABASE … OWNER` no servidor (não destrutivo, mas é alteração de ambiente) |

## 5. Salvaguardas aplicadas nesta fase

- Nenhum `docker compose down`, nenhuma remoção de volume, nenhum `DROP`/`TRUNCATE`.
- Nenhum serviço Docker novo; nenhum `.env` sobrescrito.
- Senha não lida nem impressa (consultas com `$POSTGRES_USER` e leitura do `.env` dentro do processo Node).

## 6. Conclusão e pendências

A infraestrutura existente é **suficiente** para o Material 09: servidor saudável, volume persistente, bancos de desenvolvimento e de testes separados e conexão comprovada pelos dois lados do mapeamento de portas.

**Decisão de @leohsm (17/11/2026) sobre o usuário dos testes: manter.** O banco de testes continua com o usuário `mindhub`. Justificativa: a proteção no código (sufixo `_test`, diferente de `DB_NAME`) impede rodar no banco de desenvolvimento; os testes não fazem limpeza destrutiva (apagam por id o que criaram); e mudar o usuário alteraria o setup de testes de UC01 e UC02, fora do escopo da #37. O requisito "credenciais distintas" fica **não atendido, com justificativa**, e pode virar uma issue de infraestrutura depois. Nenhuma alteração foi feita no ambiente.
