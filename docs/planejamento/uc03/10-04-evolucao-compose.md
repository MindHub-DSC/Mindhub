# 10-04 — Evolução do Compose

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#141](https://github.com/MindHub-DSC/Mindhub/issues/141)
**Branch:** `feature/141-uc03-containerizar-backend`
**Data:** 17/11/2026

Legenda: **[DOC]** documentado anteriormente · **[CÓD]** confirmado no código · **[EXE]** executado nesta atividade · **[AGU]** aguardando evidência · **[PEN]** pendente de correção.

## 1. Serviços existentes (preservados)

| Serviço | Situação antes | Depois |
| --- | --- | --- |
| `postgres` | `postgres:18-alpine`, `${DB_PORT:-5433}:5432`, volume `mindhub-pgdata`, healthcheck `pg_isready` (5s/3s/10) [DOC `09-02`] | **Sem nenhuma alteração** (o diff só toca o comentário do topo do arquivo e acrescenta o serviço `api`) |
| Banco de testes | Banco `mindhub_test` no mesmo serviço `postgres` (não há serviço `postgres_test`) [DOC `09-02`] | Inalterado |
| Volume | `mindhub-pgdata` → `mindhub_mindhub-pgdata` | Inalterado |
| Projeto | `name: mindhub` | Inalterado |

## 2. Serviço `api` (adicionado: não existia)

Trecho acrescentado ao `mindhub-backend/compose.yaml`, sem sobrescrever o arquivo:

```yaml
  # API NestJS em contêiner (#141): docker compose up -d --build api
  api:
    build:
      context: .
      dockerfile: Dockerfile
    image: mindhub-api:dev
    restart: unless-stopped
    ports:
      - "${PORT:-3000}:3000"
    environment:
      PORT: 3000
      # Dentro da rede do Compose o banco é o serviço "postgres", na porta
      # interna 5432. O DB_HOST/DB_PORT do .env (localhost:5433) valem só
      # para quem roda no host. Sempre o banco de desenvolvimento (DB_NAME),
      # nunca o de testes.
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: ${DB_USER:?defina DB_USER no .env}
      DB_PASSWORD: ${DB_PASSWORD:?defina DB_PASSWORD no .env}
      DB_NAME: ${DB_NAME:?defina DB_NAME no .env}
    depends_on:
      postgres:
        condition: service_healthy
```

| Decisão | Motivo |
| --- | --- |
| Sem `container_name` | O Compose nomeia `mindhub-api-1`, no mesmo padrão de `mindhub-postgres-1`, e evita o conflito "container name already in use" descrito no material |
| Nomes de variáveis do projeto | `DB_USER` (não `DB_USERNAME`); são os que `lerAmbienteDoBanco()` valida |
| `${VAR:?…}` | Mesmo padrão do serviço `postgres`: falha clara se faltar no `.env`, sem valor padrão de senha |
| `DB_TEST_NAME` não é passado | A API não tem como apontar para o banco de testes |
| Porta | `PORT=3000` (a mesma do projeto); publicada em `${PORT:-3000}` |
| Healthcheck da API | Não criado: a imagem runtime não tem `curl`/`wget`, e o projeto não tem rota de saúde. A prontidão é verificada por logs e HTTP (Fases 8 e 9) |

## 3. Ajustes relacionados

| Arquivo | Alteração | Motivo |
| --- | --- | --- |
| `compose.yaml` (comentário do topo) | "A API roda fora do Docker…" → "…e a API em contêiner. A API também pode rodar fora do Docker (pnpm start:dev), usando o .env." | O comentário antigo ficou falso |
| `package.json` | `db:up`: `docker compose up -d --wait` → `docker compose up -d --wait postgres` | Sem nome de serviço, o `db:up` (usado antes dos testes) passaria a subir também a API e ocupar a porta 3000. O script continua fazendo só o que fazia |
| `.env.example` | Comentário: `DB_HOST`/`DB_PORT` valem para a API no host; a do contêiner usa `postgres:5432` | Evita confusão entre porta publicada e interna. Nenhuma variável nova |

### `COMPOSE_PROJECT_NAME`

Não foi acrescentado ao `.env`/`.env.example`. O `compose.yaml` já fixa `name: mindhub`, o que dá o prefixo de rede e volumes (`mindhub_default`, `mindhub_mindhub-pgdata`) independentemente da pasta. Definir `COMPOSE_PROJECT_NAME` teria prioridade sobre `name:` e criaria o risco de volume duplicado se alguém usasse outro valor.

## 4. Validação

```text
$ docker compose config --quiet && echo OK
OK

$ docker compose config --services
postgres
api
```

Resumo do modelo resolvido (senhas substituídas por `<oculto>` no próprio script, antes de imprimir):

```text
api {"image":"mindhub-api:dev","ports":["3000->3000"],"env":{"DB_HOST":"postgres","DB_NAME":"mindhub","DB_PASSWORD":"<oculto>","DB_PORT":"5432","DB_USER":"mindhub","PORT":"3000"},"depends_on":{"postgres":{"condition":"service_healthy","required":true}},"networks":["default"],"healthcheck":false}
postgres {"image":"postgres:18-alpine","ports":["5433->5432"],"env":{"POSTGRES_DB":"mindhub","POSTGRES_PASSWORD":"<oculto>","POSTGRES_USER":"mindhub"},"networks":["default"],"volumes":["mindhub-pgdata:/var/lib/postgresql"],"healthcheck":true}
networks [ 'default' ] volumes {"mindhub-pgdata":{"name":"mindhub_mindhub-pgdata"}} name mindhub
```

### Credenciais (sem expor valores)

```text
usuario igual: true | senha igual: true | banco igual: true | banco da API termina em _test: false
```

A API e o PostgreSQL recebem as credenciais das **mesmas** variáveis interpoladas do `.env`, que já abriam o volume existente no Material 09 [DOC `09-02`]. Nenhuma credencial foi alterada (mudar o `environment` não muda a senha já gravada no volume).

### Efeito sobre o PostgreSQL em execução

```text
$ docker compose up -d --no-build --dry-run api
 Container mindhub-postgres-1 Running
 Container mindhub-api-1 Creating
 Container mindhub-api-1 Created
 Container mindhub-postgres-1 Waiting
 Container mindhub-postgres-1 Healthy
 Container mindhub-api-1 Starting
 Container mindhub-api-1 Started
```

O dry-run (sem efeito real) mostra que o `mindhub-postgres-1` **não será recriado**: a configuração dele não mudou.

## 5. Verificações (8.1)

| # | Verificação | Resultado |
| --- | --- | --- |
| 1 | Serviço da API | Adicionado [EXE] |
| 2 | `build` → `Dockerfile` | `context: .`, `dockerfile: Dockerfile` [CÓD] |
| 3 | Porta e nome | 3000 → 3000; `mindhub-api-1` [EXE] |
| 4 | Variáveis | `DB_HOST=postgres`, `DB_PORT=5432`, `DB_NAME=mindhub` [EXE] |
| 5 | `service_healthy` + healthcheck | Sim; healthcheck `pg_isready` do `postgres` [EXE] |
| 6 | Volumes preservados | `mindhub_mindhub-pgdata` inalterado; o banco de testes está no mesmo volume [EXE] |
| 7 | Rede compartilhada | Ambos em `default` (`mindhub_default`) [EXE] |
| 8 | Sem alterações nos bancos | Nenhum comando executado contra o PostgreSQL nesta fase |

## 6. Pendências

- Confirmar a rede e as variáveis com os contêineres rodando (Fase 6).
