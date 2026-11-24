# 10-03 — `.dockerignore` e imagem

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#141](https://github.com/MindHub-DSC/Mindhub/issues/141)
**Branch:** `feature/141-uc03-containerizar-backend`
**Data:** 17/11/2026

Legenda: **[DOC]** documentado anteriormente · **[CÓD]** confirmado no código · **[EXE]** executado nesta atividade · **[AGU]** aguardando evidência · **[PEN]** pendente de correção.

## 1. `.dockerignore` (criado: não existia)

`mindhub-backend/.dockerignore`:

```text
# Contexto de build do Dockerfile (#141): só o que a imagem usa.
# Dependências e saídas geradas no host (a imagem instala e compila as suas)
node_modules
dist
coverage
*.tsbuildinfo
*.log
tmp

# Variáveis de ambiente e segredos: nunca entram na imagem
.env
.env.*
!.env.example

# Arquivos que a imagem não usa
.git
test
requests.http
Dockerfile
.dockerignore
compose.yaml
```

| Exclusão | Motivo |
| --- | --- |
| `node_modules`, `dist`, `*.tsbuildinfo` | Gerados no host (Windows); a imagem instala e compila os seus. O `tsbuildinfo` desatualizado poderia fazer o `tsc` incremental pular arquivos |
| `.env`, `.env.*` (exceto `.env.example`) | Segredos fora do contexto de build, mesmo que um `COPY` futuro seja amplo |
| `.git`, `test`, `requests.http`, `compose.yaml`, `Dockerfile`, `.dockerignore` | Não são usados pela imagem |
| Mantidos | `package.json`, `pnpm-lock.yaml`, `nest-cli.json`, `tsconfig.json`, `tsconfig.build.json`, `src/` (os únicos que o Dockerfile copia) |

## 2. Contexto de build

```text
#6 [internal] load build context
#6 transferring context: 3.77kB done
```

O contexto enviado ao Docker tem **3,77 kB** (sem `node_modules`, `dist` nem `.env`). [EXE]

## 3. Construção (sem cache, para registrar todos os passos)

```text
$ docker build --no-cache --progress=plain -t mindhub-api:dev .
exit=0

#4 [build 1/8] FROM docker.io/library/node:24.19.0-bookworm-slim@sha256:a9f5f7c91a432850b2a8a7797adf5eadb6c733ceed61167806cee7ea7fbc29df
#7 [build 3/8] RUN npm install -g pnpm@12.9.1                    DONE 25.6s
#12 [build 5/8] RUN pnpm install --frozen-lockfile
#12 20.69 Packages: +300
#12 20.78 Done in 20.4s using pnpm v12.9.1
#13 [build 6/8] COPY nest-cli.json tsconfig.json tsconfig.build.json ./
#14 [build 7/8] COPY src ./src
#15 [build 8/8] RUN pnpm build                                   DONE 3.3s
#8 [runtime 3/6] RUN npm install -g pnpm@12.9.1                  DONE 14.0s
#10 [runtime 5/6] RUN pnpm install --prod --frozen-lockfile
#10 12.04 Packages: +137
#10 12.13 dependencies:
#10 12.13 + @nestjs/common 12.1.2
#10 12.13 + @nestjs/core 12.1.2
#10 12.13 + @nestjs/platform-express 12.1.2
#10 12.13 + @nestjs/typeorm 12.0.3
#10 12.13 + pg 8.23.1
#10 12.13 + reflect-metadata 0.2.2
#10 12.13 + rxjs 7.8.2
#10 12.13 + typeorm 1.1.2
#10 12.13 + zod 4.6.5
#10 12.13 Done in 11.9s using pnpm v12.9.1
#16 [runtime 6/6] COPY --from=build /app/dist ./dist
#17 naming to docker.io/library/mindhub-api:dev done
```

O primeiro build (com download da imagem base) também terminou com `exit 0`; a reconstrução sem cache acima é a evidência completa. O lockfile foi aceito com `--frozen-lockfile` nos dois estágios (nenhum `ERR_PNPM_FROZEN_LOCKFILE…`).

### Aviso registrado (não impeditivo)

```text
npm warn allow-scripts 1 package has install scripts not yet covered by allowScripts:
npm warn allow-scripts   pnpm@12.9.1 (preinstall: node install.js; postinstall: node install.js)
```

O npm do Node 24.19 não executa scripts de instalação de pacotes globais sem autorização. O pnpm funcionou sem eles: `pnpm install` e `pnpm build` rodaram com `pnpm v12.9.1`, e `pnpm -v` no contêiner devolve `12.9.1` (seção 4). Nenhuma correção aplicada.

## 4. Identificação e conteúdo da imagem

```text
$ docker image ls mindhub-api
IMAGE             ID             DISK USAGE   CONTENT SIZE   EXTRA
mindhub-api:dev   6139e755d1bb        622MB          153MB

$ docker image inspect mindhub-api:dev (Config)
user=node workdir=/app cmd=[node dist/main.js] expose=map[3000/tcp:{}]
env=[PATH=… NODE_VERSION=24.19.0 YARN_VERSION=1.22.22 NODE_ENV=production PORT=3000]

$ docker run --rm --entrypoint sh mindhub-api:dev -c '…'
v24.19.0                 ← node -v
12.9.1                   ← pnpm -v
node                     ← whoami
dist  node_modules  package.json  pnpm-lock.yaml        ← ls -A /app
/app/dist/database: data-source.js  migracoes.js  migrations  opcoes-typeorm.js  (+ .d.ts/.map)
/app/dist/database/migrations:
  1794334070122-EsquemaInicialIdentidadeOferta.js
  1794941417929-ServicosDoUc03.js
.env ausente
src ausente
test ausente
node_modules: @nestjs  pg  reflect-metadata  rxjs  typeorm  zod
node_modules/.bin: typeorm  typeorm-ts-node-commonjs  typeorm-ts-node-esm
nest cli ausente
```

(A primeira inspeção foi feita no ID `46823db3e64f`, do primeiro build; o build sem cache gerou `6139e755d1bb` com o mesmo Dockerfile e o mesmo conteúdo.)

| Verificação | Resultado |
| --- | --- |
| Build concluído | Sim, `exit=0` [EXE] |
| Dependências instaladas | 300 pacotes no `build`; **137 só de produção** no `runtime` [EXE] |
| Compilação | `nest build` no estágio `build` [EXE] |
| Arquivos obrigatórios | `dist/main.js`, DataSource e as duas migrations compiladas presentes [EXE] |
| Tag | `mindhub-api:dev` [EXE] |
| Segredos | `.env` ausente; nenhuma variável sensível em `Config.Env` [EXE] |
| Ferramentas de dev | Nest CLI, Vitest, TypeScript ausentes no runtime [EXE] |
| CLI de migrations | `node_modules/.bin/typeorm` presente [EXE] |
| Usuário | `node` (não root) [EXE] |
| Erros impeditivos | Nenhum |

> **Imagem construída não significa aplicação funcional.** O funcionamento só será confirmado com o contêiner conectado ao PostgreSQL e a requisição HTTP (Fases 8 e 9).

## 5. Problemas e correções

Nenhum problema exigiu correção nesta fase.

## 6. Pendências

- Serviço `api` no `compose.yaml` (Fase 5).
