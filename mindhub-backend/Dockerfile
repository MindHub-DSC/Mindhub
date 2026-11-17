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
# A imagem é imutável: "pnpm <script>" não deve reinstalar dependências
# (o store gravado é o do root, e o processo roda como node) nem consultar
# atualizações na rede.
ENV pnpm_config_verify_deps_before_run=false
ENV pnpm_config_update_notifier=false
RUN npm install -g pnpm@${PNPM_VERSION}
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
COPY --from=build /app/dist ./dist
# Nenhum .env na imagem: as variáveis vêm do compose.yaml.
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
