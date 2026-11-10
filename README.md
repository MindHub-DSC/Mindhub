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
| Análise do domínio e arquitetura | Feitas (trabalhos 1 a 5, em [docs/trabalhos](docs/trabalhos/)) |
| UC01 — Cadastrar Usuário (`POST /usuarios`) | **Implementado**, com dados em memória e 5 testes HTTP |
| UC02 — Cadastrar Perfil de Especialista | **Planejado** (primeiro slice); ainda sem código |
| Banco de dados, ORM, Docker | **Não configurados** |
| Autenticação | **Não existe** |
| Integração contínua (CI) | **Não configurada** |

Os cadastros de usuário ficam em memória e são perdidos quando o servidor reinicia.

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
| Node.js 24, TypeScript (ESM), NestJS 12, pnpm 12 | Configurado |
| zod (validação de entrada) | Configurado |
| Vitest + supertest (testes) | Configurado |
| oxlint e Prettier | Configurado |
| ORM | Previsto; ainda não escolhido |
| PostgreSQL | Previsto |
| Docker (serviços `api` e `db`) | Previsto |

## Organização do repositório

```text
Mindhub/
├── README.md                    este arquivo
├── docs/
│   ├── visao-geral.md           síntese do sistema e do primeiro slice
│   ├── planejamento-operacional.md   ordem de execução do UC02
│   ├── apoio/                   decomposição e revisão das issues (etapas 01 e 02)
│   └── trabalhos/               trabalhos 1 a 5 da disciplina
└── mindhub-backend/             código NestJS
    ├── src/                     UC01 (usuários)
    ├── test/                    testes HTTP
    └── .env.example             variáveis de ambiente conhecidas
```

## Executar o backend

Na pasta do repositório:

```powershell
cd mindhub-backend
pnpm.cmd install --frozen-lockfile
pnpm.cmd run start:dev
```

O servidor usa a porta 3000 (ou a variável `PORT`; veja
[.env.example](mindhub-backend/.env.example)). Para encerrar, pressione `Ctrl+C`.

Cadastrar um usuário, em outro terminal:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/usuarios -ContentType 'application/json' -Body '{"nome":"Ana","email":"ana@example.com"}'
```

Estrutura, respostas e comandos de verificação (`build`, `test`, `lint`) estão no
[README do backend](mindhub-backend/README.md). No Windows, os comandos `.cmd`
funcionam mesmo quando o PowerShell bloqueia os scripts `.ps1` das ferramentas.

## Como contribuir

1. Escolha uma issue do UC02 e confira se ela está pronta (critérios e dependências).
2. Trabalhe em uma branch `feat/issue-<número>-<descrição>`, nunca direto na `main`.
3. Use commits no formato `tipo(escopo): descrição (Refs #<número>)`.
4. Abra um Pull Request com `Closes #<número>`, o que mudou, como foi validado e
   as limitações conhecidas.

## Documentação complementar

- [Visão geral do sistema](docs/visao-geral.md)
- [Trabalhos anteriores (1 a 5)](docs/trabalhos/)
- [Planejamento operacional do UC02](docs/planejamento-operacional.md)
- [Documentos de apoio das issues](docs/apoio/)
