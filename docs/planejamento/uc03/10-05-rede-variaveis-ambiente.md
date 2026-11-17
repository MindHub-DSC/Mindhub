# 10-05 — Rede e variáveis de ambiente

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#141](https://github.com/MindHub-DSC/Mindhub/issues/141)
**Branch:** `feature/141-uc03-containerizar-backend`
**Data:** 17/11/2026

Legenda: **[DOC]** documentado anteriormente · **[CÓD]** confirmado no código · **[EXE]** executado nesta atividade · **[AGU]** aguardando evidência · **[PEN]** pendente de correção.

> Nenhuma senha aparece neste documento: o script de verificação imprime só se `DB_PASSWORD` está definida.

## 1. Onde a API roda × como ela acha o banco

| API executada | `DB_HOST` | `DB_PORT` | De onde vêm |
| --- | --- | --- | --- |
| No host (`pnpm start:dev`, testes) | `localhost` | `5433` (porta **publicada**) | `.env`, lido por `carregarArquivoEnv()` |
| No Compose (serviço `api`) | `postgres` | `5432` (porta **interna**) | Chave `environment` do serviço `api` |

**Por que não `localhost` no contêiner:** cada contêiner tem a sua própria interface de rede. Dentro do contêiner da API, `localhost` é o **próprio contêiner da API**, onde não há PostgreSQL escutando. O banco é alcançado pelo nome do serviço (`postgres`), que o DNS interno do Docker resolve para o IP do contêiner do banco na rede `mindhub_default`. E, nessa rede, a porta é a **interna** (5432): o mapeamento `5433→5432` só existe na interface do host.

## 2. Fontes de variáveis

| Fonte | Papel neste projeto |
| --- | --- |
| `.env` (pasta `mindhub-backend/`) | 1) Interpolação do `compose.yaml` (`${DB_USER}`, `${DB_PASSWORD}`, `${DB_NAME}`, `${DB_PORT}`, `${PORT}`); 2) leitura direta pelo backend **no host** |
| Chave `environment` do serviço `api` | Define as variáveis **do processo** da API no contêiner. `DB_HOST`/`DB_PORT` fixos aqui sobrepõem o que o `.env` tem para o host |
| `env_file` | **Não usado**: passaria `DB_HOST=localhost`, `DB_PORT=5433` e `DB_TEST_NAME` para a API |
| `.env.example` | Modelo versionado, sem segredos (senha de exemplo `troque-esta-senha`) |
| `.env` dentro da imagem | **Não existe** (excluído pelo `.dockerignore`, conferido no `10-03`); `carregarArquivoEnv()` não encontra arquivo e não faz nada |

## 3. Verificação prática (contêiner temporário da imagem `mindhub-api:dev`)

Script `verifica-rede.mjs` (fora do repositório, montado só leitura em um `docker compose run --rm --no-deps api`), usando o `pg` e o Node da própria imagem:

```js
import { lookup } from 'node:dns/promises';
import pg from 'pg';
const e = process.env;
console.log('variaveis:', JSON.stringify({ PORT: e.PORT, NODE_ENV: e.NODE_ENV, DB_HOST: e.DB_HOST, DB_PORT: e.DB_PORT, DB_USER: e.DB_USER, DB_NAME: e.DB_NAME, DB_PASSWORD: e.DB_PASSWORD ? '<definida>' : '<AUSENTE>', DB_TEST_NAME: e.DB_TEST_NAME ?? '<ausente>' }));
console.log('postgres resolve para:', (await lookup('postgres')).address);
console.log('localhost resolve para:', (await lookup('localhost')).address, '(o proprio conteiner da API)');
// conexão com as variáveis da API e consulta da identidade no servidor
// ... SELECT current_database(), current_user, inet_server_addr(), inet_server_port()
// tentativa em localhost:5432 (deve falhar)
```

```text
$ docker compose run --rm --no-deps -v "<scratch>/verifica-rede.mjs:/app/verifica-rede.mjs:ro" api node verifica-rede.mjs
 Container mindhub-api-run-acc7b199ddfe Creating
 Container mindhub-api-run-acc7b199ddfe Created
variaveis: {"PORT":"3000","NODE_ENV":"production","DB_HOST":"postgres","DB_PORT":"5432","DB_USER":"mindhub","DB_NAME":"mindhub","DB_PASSWORD":"<definida>","DB_TEST_NAME":"<ausente>"}
postgres resolve para: 172.23.0.2
localhost resolve para: ::1 (o proprio conteiner da API)
identidade da conexao: {"banco":"mindhub","usuario":"mindhub","ip_servidor":"172.23.0.2/32","porta_servidor":5432}
localhost:5432 dentro do conteiner da API -> ECONNREFUSED
exit=0

$ docker network inspect mindhub_default
mindhub_default driver=bridge subnet=172.23.0.0/16
$ docker inspect mindhub-postgres-1 (redes)
mindhub_default 172.23.0.2 aliases=[mindhub-postgres-1 postgres b161fb9bb5b9]
$ docker compose ps -a
mindhub-postgres-1   postgres:18-alpine   …   Up 2 hours (healthy)   0.0.0.0:5433->5432/tcp
```

O contêiner temporário foi removido ao final (`--rm`); o `postgres` não foi reiniciado.

## 4. Conferência (9.4)

| Verificação | Resultado | Classe |
| --- | --- | --- |
| API e PostgreSQL na mesma rede | `mindhub_default` (bridge); o `postgres` tem os aliases `postgres` e `mindhub-postgres-1` | [EXE] |
| Nome do serviço resolvido | `postgres` → `172.23.0.2`, o mesmo IP informado pelo servidor (`inet_server_addr`) | [EXE] |
| Porta interna | `inet_server_port() = 5432`, com o cliente usando `DB_PORT=5432` | [EXE] |
| Variáveis chegando ao processo | `DB_HOST=postgres`, `DB_PORT=5432`, `DB_USER=mindhub`, `DB_NAME=mindhub`, `DB_PASSWORD` definida, `PORT=3000`, `NODE_ENV=production` | [EXE] |
| Credenciais permitem conexão | Conexão aceita (usuário `mindhub`) | [EXE] |
| Banco diferente do de testes | `current_database() = mindhub`; `DB_TEST_NAME` **ausente** no processo da API | [EXE] |
| `localhost` no contêiner | Resolve para `::1`, e `localhost:5432` dá `ECONNREFUSED`: comprova que lá não há banco | [EXE] |

## 5. Banco de testes

| Item | Situação |
| --- | --- |
| Banco | `mindhub_test`, no mesmo serviço `postgres` [DOC `09-02`] |
| Acesso pelos testes | Pelo host, `localhost:5433`, com `DB_NAME` trocado por `DB_TEST_NAME` em `test/setup` [DOC `09-07`] |
| Acesso pela API containerizada | **Impossível pela configuração**: o serviço `api` não recebe `DB_TEST_NAME` e tem `DB_NAME` interpolado do `.env` (`mindhub`) |

## 6. Diagnóstico e pendências

Nenhuma falha. Rede, resolução de nome, porta interna, variáveis e credenciais confirmadas antes de subir a API. Próximo passo: histórico de migrations de dentro do contêiner (Fase 7).
