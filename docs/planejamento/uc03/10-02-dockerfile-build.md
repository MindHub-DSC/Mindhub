# 10-02 — Dockerfile e build

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#141](https://github.com/MindHub-DSC/Mindhub/issues/141) — Containerizar o backend NestJS com Docker Compose
**Branch:** `feature/141-uc03-containerizar-backend` (de `feature/37-uc03-persistir-servico` @ `e66b59e`)
**Data:** 17/11/2026

Legenda: **[DOC]** documentado anteriormente · **[CÓD]** confirmado no código · **[EXE]** executado nesta atividade · **[AGU]** aguardando evidência · **[PEN]** pendente de correção.

## 1. Situação inicial

O repositório **não tinha Dockerfile** em nenhuma branch (`10-01`, seção 3). O arquivo abaixo foi **criado** nesta atividade, no mínimo necessário, em `mindhub-backend/Dockerfile`.

## 2. Versões

| Item | Fonte no projeto | Valor usado | Classe |
| --- | --- | --- | --- |
| Node.js | `.node-version` = `24.19.0`; `engines.node` = `>=24.15.0 <25`; host `v24.19.0` | `node:24.19.0-bookworm-slim` | [CÓD] [EXE] |
| pnpm | `packageManager` = `pnpm@12.9.1`; lockfile `packageManagerDependencies.pnpm` = `12.9.1`; host `12.9.1` | `npm install -g pnpm@12.9.1` | [CÓD] [EXE] |
| Lockfile | `pnpm-lock.yaml`, `lockfileVersion: '9.0'` | `--frozen-lockfile` nos dois estágios | [CÓD] |

Nenhuma versão foi trocada: as da imagem são as mesmas do host e do `package.json`. A imagem de referência do material (`node:24.21.0`) **não** foi usada, porque o projeto fixa `24.19.0`.

## 3. Compilação no host (validação dos caminhos)

```text
$ pnpm build
$ nest build
build exit=0

$ find dist -name "main.js"
dist/main.js
$ find dist -name "data-source.js"
dist/database/data-source.js
$ find dist/database -name "*.js" | sort
dist/database/data-source.js
dist/database/migracoes.js
dist/database/migrations/1794334070122-EsquemaInicialIdentidadeOferta.js
dist/database/migrations/1794941417929-ServicosDoUc03.js
dist/database/opcoes-typeorm.js
$ find dist -name "*.js" | wc -l
49
```

| Caminho | Uso |
| --- | --- |
| `dist/main.js` | Entry point (`start:prod` = `node dist/main.js`) [CÓD] |
| `dist/database/data-source.js` | DataSource da CLI do TypeORM [CÓD] |
| `dist/database/migrations/*.js` | As duas migrations, carregadas por `MIGRACOES` (lista de classes, sem glob) [CÓD] |

`tsconfig.build.json` usa `rootDir: ./src`, por isso a saída fica em `dist/` direto (sem `dist/src/`).

## 4. Dockerfile criado

```dockerfile
# Backend do Mindhub em contêiner (#141).
# Versões iguais às do projeto: Node em .node-version, pnpm em packageManager.
ARG NODE_VERSION=24.19.0
ARG PNPM_VERSION=12.9.1

# --- build: instala tudo (inclusive dev) e compila para dist/ ---
FROM node:${NODE_VERSION}-bookworm-slim AS build
ARG PNPM_VERSION
WORKDIR /app
RUN npm install -g pnpm@${PNPM_VERSION}
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN pnpm build

# --- runtime: só dependências de produção e o código compilado ---
FROM node:${NODE_VERSION}-bookworm-slim AS runtime
ARG PNPM_VERSION
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN npm install -g pnpm@${PNPM_VERSION}
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
COPY --from=build /app/dist ./dist
# Nenhum .env na imagem: as variáveis vêm do compose.yaml.
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## 5. Etapas e decisões

| Etapa | Decisão | Motivo |
| --- | --- | --- |
| Multi-stage `build` → `runtime` | Dev deps (Nest CLI, TypeScript, Vitest, oxlint) só no `build` | Imagem final menor e sem ferramentas de desenvolvimento |
| `COPY package.json pnpm-lock.yaml` antes do código | Camada de dependências reaproveitada pelo cache | Mudança em `src/` não reinstala dependências |
| `COPY` explícitos no `build` (`nest-cli.json`, `tsconfig*.json`, `src`) | Em vez de `COPY . .` | Só entra na compilação o que o `nest build` usa; `test/`, `.env`, `README.md` etc. ficam fora mesmo sem `.dockerignore` |
| Não há `pnpm-workspace.yaml` nem `.npmrc` | Nada a copiar além do lockfile | Confirmado com `ls -a` [EXE] |
| `pnpm install --prod --frozen-lockfile` no runtime | Dependências de produção: `@nestjs/*`, `typeorm`, `pg`, `reflect-metadata`, `rxjs`, `zod` | `typeorm` traz o binário da CLI, necessário para as migrations no contêiner |
| pnpm presente no runtime | Mantido | Permite `docker compose run api pnpm migration:show:prod` (Fase 7) |
| `ENV PORT=3000` / `EXPOSE 3000` | Porta já usada pelo projeto (`main.ts`, `.env.example`) | A porta HTTP não foi alterada |
| `USER node` | Processo sem root | Usuário que já existe na imagem oficial; os arquivos copiados são só lidos |
| `CMD ["node", "dist/main.js"]` | Igual ao `start:prod` | Caminho confirmado na seção 3 |
| Sem `.env`, sem segredos | Nenhum `COPY` de `.env`; nenhuma variável sensível em `ENV`/`ARG` | Credenciais só no Compose, em tempo de execução |

## 6. Dependências de runtime para as migrations

| Necessidade | Onde está |
| --- | --- |
| CLI `typeorm` | Pacote `typeorm` (dependência de produção) |
| Driver `pg` | Dependência de produção |
| DataSource e migrations compilados | `dist/database/…` copiado do estágio `build` |
| Variáveis `DB_*` | Compose (`environment`), lidas por `lerAmbienteDoBanco()` |

Os scripts atuais `migration:show`/`migration:run` executam `pnpm run build` antes (precisa de `src/` e do Nest CLI, ausentes no runtime). Os scripts `:prod` serão tratados na Fase 7 (`10-06`).

## 7. Resultado

| Verificação | Situação |
| --- | --- |
| Dockerfile criado e coerente com versões e caminhos reais | Confirmado no código [CÓD] |
| Build da imagem | [AGU] Fase 4 (`10-03`): o Dockerfile só é considerado válido depois do `docker build` real |

## 8. Pendências

- Criar o `.dockerignore` e construir a imagem (Fase 4).
- Scripts de migration para o runtime compilado (Fase 7).

## 9. Atualização posterior (Dockerfile final)

O Dockerfile da seção 4 é a **primeira versão**. Na Fase 7 (`10-06`, diagnóstico `ERR_PNPM_PACKAGE_MANAGER_REMOVE_MODULES_DIR`) o estágio `runtime` ganhou duas linhas, e o arquivo commitado em `19cd672` as contém:

```dockerfile
ENV pnpm_config_verify_deps_before_run=false
ENV pnpm_config_update_notifier=false
```

Motivo: a imagem é imutável; `pnpm <script>` não deve reinstalar dependências (o `storeDir` gravado é o do root e o processo roda como `node`) nem consultar atualizações na rede. O restante do Dockerfile é o da seção 4.

| Verificação | Situação |
| --- | --- |
| Dockerfile construído e funcional | Confirmado [EXE]: `docker build` (`10-03`) e execução com HTTP + durabilidade (`10-07`); revalidado em 24/11/2026 (`10-07`, seção 12) |
