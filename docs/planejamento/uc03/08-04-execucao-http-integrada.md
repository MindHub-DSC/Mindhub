# 08-04 — Execução HTTP integrada

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Data:** 17/11/2026

## 1. Ambiente

| Item | Valor |
| --- | --- |
| Aplicação | `node dist/main.js`, processo 11784, build da branch `feature/40-uc03-endpoint-publicar-servico` @ `2545027` (iniciado na Fase 5, `08-03`) |
| Endereço | `http://localhost:3000` |
| Componentes do fluxo | Todos reais: `StandardSchemaValidationPipe` + `publicarServicoSchema` → `ServicosController` → `PublicarServico` → `PERFIS_ESPECIALISTA_REPOSITORIO` (TypeORM/PostgreSQL) e `SERVICOS_REPOSITORIO` (`ServicosEmMemoria`) |
| Cliente | Python `urllib`, corpo codificado em UTF-8 (o `curl` do Git Bash troca acentos, ver `07-05`) |
| Endpoint | `POST /servicos` |

## 2. Pré-condição: perfil ATIVO

O usuário `3163a113-…` e o perfil `ece5a9cc-…` foram criados no Material 07 (`07-05`) e ficam no PostgreSQL. Como a aplicação foi reiniciada, os **Serviços** daquela fase se perderam (memória), mas o **perfil** continua. A existência dele foi confirmada pela própria API, sem consultar o banco por fora:

```text
$ POST /especialistas  Content-Type: application/json; charset=utf-8
  corpo: {"usuarioId": "3163a113-104e-43a1-bb2b-1c06611abc06", "descricao": "Outra", "especialidades": ["X"]}
  HTTP 409 Conflict
  {"statusCode":409,"message":"O usuário já possui perfil de especialista."}
```

## 3. Cenário válido

```text
$ POST /servicos  Content-Type: application/json; charset=utf-8
  corpo: {"usuarioId": "3163a113-104e-43a1-bb2b-1c06611abc06", "titulo": "Mentoria de produto", "descricao": "Sessões de discovery para times iniciantes", "modeloContratacao": "RESERVA_DIRETA", "condicoes": {"preco": 15000, "moeda": "BRL", "duracaoMinutos": 60, "modalidade": "ONLINE"}}
  HTTP 201 Created
  {"id":"88a1b7a2-8cac-4cd1-a071-06033a6f6464","perfilId":"ece5a9cc-d4e4-40e9-98f9-518aaf546244","titulo":"Mentoria de produto","descricao":"Sessões de discovery para times iniciantes","modeloContratacao":"RESERVA_DIRETA","condicoes":{"preco":15000,"moeda":"BRL","duracaoMinutos":60,"modalidade":"ONLINE"},"situacao":"PUBLICADO"}
```

### Os 10 pontos do fluxo integrado

| # | Ponto | Situação | Como se sabe |
| --- | --- | --- | --- |
| 1 | Aplicação inicializada | Confirmado | `Nest application successfully started` (`08-03`) |
| 2 | Rota disponível | Confirmado | `Mapped {/servicos, POST} route`; resposta 201 |
| 3 | Validação pelo pipe + schema | Confirmado (inferido) | O corpo válido passou; o inválido (seção 4) foi barrado com a mensagem do zod |
| 4 | Controller real acionado | Confirmado (inferido) | Única rota `POST /servicos`; o corpo da resposta tem o formato de `paraResposta` |
| 5 | Serviço real executado | Confirmado (inferido) | `perfilId` = `ece5a9cc-…`, o id do perfil **buscado pelo `usuarioId`**: só o `PublicarServico` faz essa busca; `situacao: PUBLICADO` vem do domínio |
| 6 | Token do repositório resolvido | Confirmado (inferido) | A aplicação subiu sem erro de injeção e a requisição terminou em 201 (o serviço chama `servicos.adicionar` antes de retornar) |
| 7 | Implementação em memória acionada (`adicionar`) | **Não observado diretamente** | Ver seção 5 |
| 8 | Resposta HTTP | Confirmado | `201 Created` |
| 9 | Identificador gerado retornado | Confirmado | `id: 88a1b7a2-8cac-4cd1-a071-06033a6f6464` (UUID v4) |
| 10 | Dados de entrada preservados | Confirmado | `titulo`, `descricao` (com acento), `modeloContratacao` e `condicoes` iguais aos enviados |

## 4. Cenário inválido

```text
$ POST /servicos  Content-Type: application/json; charset=utf-8
  corpo: {"usuarioId": "3163a113-104e-43a1-bb2b-1c06611abc06", "titulo": "", "descricao": "Discovery", "modeloContratacao": "SOB_PROPOSTA", "preco": 100}
  HTTP 400 Bad Request
  {"message":["Unrecognized key: \"preco\""],"error":"Bad Request","statusCode":400}
```

- Rejeitado na **fronteira**: a resposta tem o formato do pipe do Nest (`message` em lista e `error: "Bad Request"`), não o dos filtros de domínio.
- A causa é o campo `preco` fora de `condicoes`, que o `z.strictObject` não aceita.
- O corpo também tinha `titulo: ""`, e **a fronteira não reclamou disso**: para o schema, `""` é uma string válida. Título vazio é uma regra do **domínio** (D-UC03-01). Ela não foi avaliada aqui porque a requisição parou antes.

**Ressalva:** este 400 comprova a validação de formato da fronteira HTTP. Não comprova que o `PublicarServico`, chamado diretamente, recusaria um título vazio. Essa garantia vem do domínio e está provada nos testes unitários (`servico.spec.ts`, "recusa título vazio") e, por HTTP, no `07-05` (título só com espaços → 400 com `{"statusCode":400,"message":"O título: informe ao menos 1 caractere."}`).

## 5. Resposta HTTP × armazenamento

| Evidência | O que mostra | O que **não** mostra |
| --- | --- | --- |
| **Resposta HTTP** (201 com `id`) | Que o fluxo terminou sem erro e devolveu o Serviço que o `PublicarServico` criou e retornou | Que o Serviço está dentro do `ServicosEmMemoria` |
| **Inspeção do repositório** | O estado interno depois da requisição | — |

Nesta execução manual **não houve inspeção do repositório**. Os registros do `ServicosEmMemoria` são `private readonly` e a API não tem endpoint de consulta de Serviços (`GET` está fora do escopo do UC03: listagem é UC04). Pelo código, `PublicarServico.executar` faz `await this.servicos.adicionar(servico)` antes de retornar. Mas uma leitura do código não é observação da execução. A verificação do estado interno fica para o teste integrado (Fases 7 e 8), por meio do provider resolvido no container e dos métodos que **já fazem parte do contrato** (`buscarPorId`, `listarPorPerfil`).

## 6. Limitações e conclusões

- O fluxo HTTP → controller → serviço → repositórios funciona com componentes reais: 201 no válido, 400 na fronteira no inválido.
- A presença no repositório de Serviços não foi observada diretamente nesta fase.
- O Serviço `88a1b7a2-…` existe só na memória do processo 11784 e some quando ele parar.
- O perfil usado está no banco de **desenvolvimento**; nenhum dado novo foi gravado no PostgreSQL nesta fase (o 409 não grava nada).
