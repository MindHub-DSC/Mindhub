# 11-01 — Diagnóstico do contrato HTTP

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#144](https://github.com/MindHub-DSC/Mindhub/issues/144) — Estabilizar e testar o contrato HTTP de POST /servicos
**Branch:** `feature/144-uc03-contrato-http` (de `feature/141-uc03-containerizar-backend`) · **PR:** [#145](https://github.com/MindHub-DSC/Mindhub/pull/145) (Draft)
**Data:** 24/11/2026

Legenda: **[DOC]** documentado anteriormente · **[CÓD]** confirmado no código · **[EXE]** executado nesta atividade · **[PEN]** pendente.
**Diretório de artefatos:** `docs/planejamento/uc03/` (o mesmo dos Materiais anteriores)

## 1. Projeto e arquitetura

MindHub — NestJS 12, TypeORM 1, PostgreSQL 18, Zod, Vitest + Supertest. Camadas por contexto (`src/oferta/{dominio,aplicacao,http,infra}`). Escopo deste material (decisão de @leohsm): **só `POST /servicos`**; `/usuarios` e `/especialistas` ficam fora.

## 2. Issue, branch e dependências

| Item | Situação |
| --- | --- |
| Issue de estabilização | **Não existia** [EXE]: #35–#41 e #141 não a contemplam (#41 só documenta, sem alterar código). Criada a **#144**, sub-issue do épico #35, labels `usecase:uc03`, `layer:integration`, `priority:medium`, responsável @leohsm (decisão de @leohsm) |
| Branch-base | `feature/141-…` (ponta da cadeia, com UC03 persistido e Docker) → nova `feature/144-uc03-contrato-http` |
| Cadeia de PRs | #131 → #134 → #135 → #139 → #142 → **#145**, todos Draft; nenhum integrado à `main` |
| Dependências | #40 (endpoint) e #141 (API containerizada) — ambas implementadas e em revisão |
| DoR | Objetivo, escopo, 5 critérios verificáveis, dependências, responsável: atendidos. Revisão: autorrevisão (equipe de um integrante) |
| WIP | #144 em `In Progress` (ver `11-08`, seção 19) |

## 3. Código inspecionado [CÓD]

| Componente | Arquivo | Observação |
| --- | --- | --- |
| Controller | `src/oferta/http/servicos.controller.ts` | `@Post()` → `publicarServico.executar(dados)` → `paraResposta(servico)`; `@UseFilters(ErrosDePublicacaoFilter)` |
| DTO de entrada | `src/oferta/http/publicar-servico.dto.ts` | `publicarServicoSchema` = `z.strictObject` (rejeita campos não previstos) |
| DTO de resposta | idem | `interface ServicoResponse` — **já existia** |
| Mapper de resposta | idem | `paraResposta(servico)` — **já existia** |
| Validação | `app.module.ts` | `APP_PIPE` = `StandardSchemaValidationPipe` (não é `ValidationPipe` com `whitelist`) |
| Erros | `erros-de-publicacao.filter.ts`, `armazenamento-indisponivel.filter.ts` | 404, 403, 422, 400, 503 (D-UC03-07) |
| Serviço de aplicação | `PublicarServico.executar(comando)` | **Não alterado** |
| Domínio | `Servico` (getters `id, perfilId, titulo, descricao, modeloContratacao, situacao, publicadoEm, condicoes`) | **Não alterado** |
| ORM e mapper de persistência | `servico.orm-entity.ts`, `servico.mapper.ts` | **Não alterados** |
| Teste HTTP existente | `test/unit/oferta/servicos.http.spec.ts` | Material 07: sucesso, 6 entradas inválidas, 5 erros mapeados |

Já havia proteção equivalente ao DTO de resposta e ao mapper: foram **preservados** (nenhum componente duplicado).

## 4. Linha de base (executada agora) [EXE]

Sem `node`/`pnpm` no host: executado em contêiner `node:24.19.0-bookworm-slim`, rede `mindhub_default`, `DB_HOST=postgres`.

```text
$ pnpm test        Test Files 12 passed (12) · Tests 110 passed (110)
$ pnpm test:e2e    Test Files  6 passed (6)  · Tests  35 passed (35)   (banco mindhub_test)
$ git status --short   (limpo; lockfile não reescrito)
```

## 5. Contrato observado (Fase 3) [EXE]

Requisição real à API containerizada (porta 3000), antes de qualquer alteração de código:

```text
POST /servicos  Content-Type: application/json
{"usuarioId":"<uuid>","titulo":"Contrato","descricao":"D","modeloContratacao":"RESERVA_DIRETA",
 "condicoes":{"preco":100,"moeda":"BRL","duracaoMinutos":30,"modalidade":"ONLINE"}}

HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
X-Powered-By: Express · Content-Length: 273 · ETag: W/"111-…"
{"id":"403ded8e-…","perfilId":"eeb8450f-…","titulo":"Contrato","descricao":"D",
 "modeloContratacao":"RESERVA_DIRETA",
 "condicoes":{"preco":100,"moeda":"BRL","duracaoMinutos":30,"modalidade":"ONLINE"},
 "situacao":"PUBLICADO"}
```

| Pergunta (material) | Resposta |
| --- | --- |
| Retorna os campos previstos? | Sim, 7 campos de topo + 4 em `condicoes` |
| Campos adicionais? | Nenhum observado (`publicadoEm` do domínio **não** aparece) |
| Status corresponde ao comportamento? | Sim, 201 |
| A resposta depende da entidade interna? | Parcialmente: `paraResposta` copia os campos de topo, mas devolvia `servico.condicoes` **por referência** (ver seção 6) |
| Estrutura documentada? | Só no código (`ServicoResponse`); sem documento de contrato — resolvido em `11-02` |
| Precisa mudar a serialização? | Sim, só em `condicoes` (seção 6) |

## 6. Divergência encontrada

`paraResposta` copiava os campos de topo, mas `condicoes: servico.condicoes` repassava o **objeto do domínio**. Qualquer propriedade a mais nele (hoje não existe) iria para o JSON. Os testes do Material 07 não detectavam isso: o mock devolvia um `Servico` real. Tratado nos artefatos `11-03` e `11-05` (RED → GREEN).

## 7. Decisões

| # | Decisão |
| --- | --- |
| 1 | Preservar `ServicoResponse` e `paraResposta`; só tornar a cópia de `condicoes` explícita |
| 2 | `publicadoEm` continua fora do contrato (nenhum requisito pede) |
| 3 | Manter `StandardSchemaValidationPipe` e `z.strictObject`: campo extra → **400**, não é descartado |
| 4 | Não inventar erros: só os de D-UC03-07 |

## 8. Pendências

Token do `gh` sem escopo `project` de escrita (ver `11-08`). Nenhum merge executado.
