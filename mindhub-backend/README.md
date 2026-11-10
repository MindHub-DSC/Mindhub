# Mindhub — backend

Backend NestJS 12 da Mindhub, com PostgreSQL (Docker Compose) e TypeORM.

| Rota | Caso de Uso | Situação |
| --- | --- | --- |
| `GET /` | Prova de vida (template do NestJS) | Responde `Hello World!`; não é comportamento de negócio |
| `POST /usuarios` | **UC01 — Cadastrar Usuário** | Implementado, grava no PostgreSQL |
| `POST /especialistas` | **UC02 — Cadastrar Perfil de Especialista** (primeiro slice) | Implementado, grava no PostgreSQL |

Especificação do UC02: [`docs/trabalhos/trabalho5.md` §6.1](../docs/trabalhos/trabalho5.md) ·
Issue: [#1](https://github.com/MindHub-DSC/Mindhub/issues/1).

## Pré-requisitos

| Ferramenta | Versão usada |
| --- | --- |
| Node.js | 24 (fixado em `.node-version`) |
| pnpm | 12 (fixado em `packageManager`) — único gerenciador do projeto |
| Docker + Docker Compose | Docker 29, Compose v5 |
| PostgreSQL | 18 (imagem `postgres:18-alpine`, roda no Docker) |

Dependências principais: `@nestjs/*` 12, `@nestjs/typeorm` 12.0.3, `typeorm` 1.1.2,
`pg` 8.23.1, `zod` 4 (validação de entrada), `vitest` 4 + `supertest` (testes).

## Passo a passo

Todos os comandos rodam na pasta `mindhub-backend`. No Windows PowerShell, use
`pnpm.cmd` no lugar de `pnpm` se os scripts `.ps1` estiverem bloqueados.

### 1. Criar o arquivo de ambiente

```powershell
Copy-Item .env.example .env     # bash: cp .env.example .env
```

Abra o `.env` e troque `DB_PASSWORD`. O `.env` está no `.gitignore` e nunca é versionado.
O banco publica a porta **5433** no host (para não conflitar com outro PostgreSQL na 5432);
se mudar, altere `DB_PORT`.

### 2. Iniciar o PostgreSQL

```powershell
pnpm db:up                  # = docker compose up -d --wait (espera o healthcheck)
docker compose ps           # deve mostrar "healthy"
```

Os dados ficam no volume nomeado `mindhub_mindhub-pgdata` e sobrevivem a `stop`,
`down` e à recriação do container.

### 3. Instalar dependências

```powershell
pnpm install --frozen-lockfile
```

### 4. Aplicar as migrations

```powershell
pnpm migration:show         # [ ] = pendente, [X] = aplicada
pnpm migration:run          # aplica no banco DB_NAME do .env
```

O esquema só muda por migration (`synchronize: false`). As migrations ficam em
`src/database/migrations/` e são registradas em `src/database/migracoes.ts`.
Para criar uma nova a partir das ORM Entities:

```powershell
pnpm migration:generate src/database/migrations/NomeDaMudanca
```

Revise o arquivo gerado (o TypeORM não gera `CREATE SCHEMA`), registre a classe em
`migracoes.ts` e só então rode `migration:run`. Para desfazer a última: `pnpm migration:revert`.

### 5. Iniciar a API

```powershell
pnpm start:dev
```

Pronta quando o log mostrar `Mapped {/especialistas, POST} route` e
`Nest application successfully started`. Porta 3000 (ou `PORT`).

### 6. Executar as requisições

Abra [`requests.http`](requests.http) no VS Code (extensão REST Client) e execute os
blocos de cima para baixo. O bloco 1 cria um usuário com email aleatório; os seguintes
usam o `id` dele. Nenhum UUID é fixo.

Com cURL, envie o corpo a partir de um **arquivo UTF-8**. No Windows, o argumento
`-d '{...}'` passa pela página de código do console e corrompe acentos:

```bash
# corpo.json (UTF-8): {"usuarioId":"<id do usuário>","descricao":"Mentora","especialidades":["Carreira"]}
curl -i -X POST http://localhost:3000/especialistas \
  -H "Content-Type: application/json; charset=utf-8" \
  --data-binary @corpo.json
```

### 7. Executar os testes

```powershell
pnpm test                   # unitários: domínio, aplicação, mapper, contrato em memória (sem banco)
pnpm test:e2e               # integração + E2E com PostgreSQL real (exige o passo 2)
```

Os testes com banco usam **só** o banco `DB_TEST_NAME` (padrão `mindhub_test`):

- o nome precisa terminar em `_test` e ser diferente de `DB_NAME`, senão os testes se recusam a rodar;
- o setup cria o banco de testes, se ele não existir, e aplica as mesmas migrations;
- cada teste cria os próprios dados (ids e emails aleatórios) e, no fim, apaga só esses
  registros. Nada de `TRUNCATE` ou `DELETE` sem filtro.

### 8. Encerrar

```powershell
# Ctrl+C no terminal da API
pnpm db:stop                # = docker compose stop (mantém container e dados)
```

`docker compose down` remove o container, mas mantém o volume.
**Não use `docker compose down -v`**: o `-v` apaga o volume e todos os dados.

## Contrato do UC02: POST /especialistas

```json
{
  "usuarioId": "id retornado por POST /usuarios",
  "descricao": "Consultora de produto com 10 anos em startups de saúde.",
  "especialidades": ["Gestão de produto", "Discovery", "Métricas"]
}
```

| Situação | Status | Quem decide |
| --- | --- | --- |
| Perfil cadastrado (nasce `ATIVO`) | **201** com `id`, `usuarioId`, `descricao`, `especialidades`, `situacao`, `criadoEm` | Domínio + repositório |
| Formato inválido ou campo não previsto (ex.: `situacao`) | **400** | Fronteira (schema zod estrito) |
| Descrição fora de 1–2000 caracteres; 0 ou mais de 20 especialidades; especialidade fora de 1–120; especialidades repetidas | **400** | Domínio (`PerfilEspecialista`, `Especialidades`) |
| `usuarioId` não corresponde a nenhum usuário | **422** (decisão D5) | Aplicação |
| Usuário já tem perfil (ativo ou suspenso) | **409** | Domínio, garantido pela restrição única no banco |
| Banco indisponível | **503**, mensagem genérica | Infraestrutura |
| Erro inesperado | **500**, mensagem genérica | Tratamento padrão do Nest |

**Limitação (decisão D1):** não existe autenticação. O `usuarioId` vem no corpo, então
qualquer cliente pode cadastrar um perfil para outro usuário. Use só em desenvolvimento.

## UC01: POST /usuarios

`{ "nome": "Ana", "email": "ana@example.com" }` → **201** `{ id, nome, email }`;
**400** para nome vazio, email inválido ou campo extra; **409** para email já cadastrado.
O email é aparado e convertido para minúsculas.

## Organização do código

```text
src/
├── main.ts, app.module.ts        composição: TypeORM, módulos, pipe e filtro globais
├── config/ambiente.ts            leitura e validação das variáveis do .env
├── database/                     opções do TypeORM, DataSource da CLI, migrations
├── compartilhado/                erros de banco (infra) e filtro 503 (http)
├── identidade/   (C1)            UC01 + porta pública ReconhecimentoDeUsuario
│   ├── dominio/  aplicacao/  publico/  infra/  http/
└── oferta/       (C2)            UC02
    ├── dominio/      PerfilEspecialista, Especialidades, erros, porta do repositório
    ├── aplicacao/    CadastrarPerfilEspecialista (coordena)
    ├── infra/        ORM Entity, mapper, repositório TypeORM
    └── http/         controller, DTO, filtro de erros
test/
├── unit/             sem banco
├── integracao/       repositórios TypeORM contra PostgreSQL
├── e2e/              HTTP de ponta a ponta contra PostgreSQL
├── setup/            trava do banco de teste e migrations
└── support/          dublês, suíte de contrato, limpeza
```

`dominio/` e `aplicacao/` não importam NestJS, TypeORM, `pg` nem HTTP. As ligações entre
portas e implementações ficam nos módulos (`useFactory`).
