# Mindhub

Plataforma de mentorias e consultorias. O Mindhub organiza, em um só lugar, a
jornada entre quem procura orientação profissional e quem a oferece: encontrar
especialistas, negociar condições, reservar horário, pagar, realizar a sessão e
avaliar o atendimento.

Projeto da disciplina **Desenvolvimento de Software (DSC 2026/1)**.

## Contexto

Hoje esse processo costuma ser feito com mensagens, planilhas, agendas externas
e pagamentos pouco integrados. Isso gera conflitos de horário, perda das
condições combinadas e falta de histórico. O Mindhub quer resolver essa
fragmentação. Detalhes em [docs/visao-geral.md](docs/visao-geral.md).

## Responsáveis

| Pessoa | Papel |
| --- | --- |
| Leonardo Herrero S. Martins ([@leohsm](https://github.com/leohsm)) | Trabalho individual: análise, arquitetura, implementação e administração do repositório |

## Estágio atual

| Item | Situação |
| --- | --- |
| Análise do domínio e arquitetura | Feitas (trabalhos 1 a 7, em [docs/trabalhos](docs/trabalhos/)) |
| Base técnica NestJS 12 (`GET /` → `Hello World!`) | **Validada** |
| UC01 — Cadastrar Usuário (`POST /usuarios`) | **Implementado**, gravando no PostgreSQL |
| UC02 — Cadastrar Perfil de Especialista (`POST /especialistas`) | **Implementado** (primeiro slice), gravando no PostgreSQL, com testes unitários, de integração e E2E |
| PostgreSQL (Docker Compose), TypeORM, migrations | **Configurados** para desenvolvimento e testes |
| API dentro do Docker | **Não** (só o banco roda no container) |
| Autenticação | **Não existe**: o `usuarioId` do UC02 vem no corpo (limitação D1) |
| Integração contínua (CI) | **Não configurada** |

## Primeiro slice: UC02 — Cadastrar Perfil de Especialista

Um usuário já cadastrado passa a atuar como especialista. Regra central: **um
usuário tem no máximo um Perfil de Especialista**, e o perfil nasce `ATIVO`.

- Issue do slice: [#1](https://github.com/MindHub-DSC/Mindhub/issues/1)
  (sub-issues #2, #3, #5, #6 e #8)
- Branch de trabalho: `feat/issue-1-cadastrar-perfil-especialista`
- Blueprint: [docs/trabalhos/trabalho5.md](docs/trabalhos/trabalho5.md)
- Ordem de execução: [docs/planejamento-operacional.md](docs/planejamento-operacional.md)

## Tecnologias

| Tecnologia | Situação |
| --- | --- |
| Node.js 24, TypeScript (ESM), NestJS 12 (`@nestjs/core` 12.1.2), pnpm 12 | Configurado |
| zod (validação de entrada) | Configurado |
| Vitest + supertest (testes) | Configurado |
| oxlint e Prettier | Configurado |
| TypeORM 1.1 (`@nestjs/typeorm`) com migrations versionadas | Configurado |
| PostgreSQL 18 | Configurado (container `postgres`, porta 5433 no host) |
| Docker Compose | Configurado só para o banco; a API ainda roda fora do Docker |

## Organização do repositório

```text
Mindhub/
├── README.md                    este arquivo
├── docs/
│   ├── visao-geral.md           síntese do sistema e do primeiro slice
│   ├── planejamento-operacional.md   ordem de execução do UC02
│   ├── apoio/                   decomposição e revisão das issues (etapas 01 e 02)
│   └── trabalhos/               trabalhos da disciplina
└── mindhub-backend/             código NestJS
    ├── src/identidade/          C1: UC01 e a porta pública de reconhecimento de usuário
    ├── src/oferta/              C2: UC02 (domínio, aplicação, infra, http)
    ├── src/database/            TypeORM e migrations
    ├── test/                    unitários, integração e E2E
    ├── compose.yaml             PostgreSQL com volume persistente
    ├── requests.http            cenários para o REST Client
    └── .env.example             variáveis de ambiente (sem segredos)
```

## Executar o backend

O passo a passo completo (`.env`, PostgreSQL, migrations, API, requisições, testes e
encerramento sem perder dados) está no [README do backend](mindhub-backend/README.md).
Resumo, na pasta `mindhub-backend`:

```powershell
Copy-Item .env.example .env       # e troque DB_PASSWORD
pnpm db:up                        # PostgreSQL no Docker
pnpm install --frozen-lockfile
pnpm migration:run
pnpm start:dev
```

## Como contribuir

1. Escolha uma issue do UC02 e confira se ela está pronta (critérios e dependências).
2. Trabalhe em uma branch `feat/issue-<número>-<descrição>`, nunca direto na `main`.
3. Use commits no formato `tipo(escopo): descrição (Refs #<número>)`.
4. Abra um Pull Request com `Closes #<número>`, o que mudou, como foi validado e
   as limitações conhecidas.

## Documentação complementar

- [Visão geral do sistema](docs/visao-geral.md)
- [Trabalhos anteriores](docs/trabalhos/)
- [Planejamento operacional do UC02](docs/planejamento-operacional.md)
- [Documentos de apoio das issues](docs/apoio/)
