# 11-08 — Versionamento e checklist consolidado

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#144](https://github.com/MindHub-DSC/Mindhub/issues/144) — [UC03-SUB-08] Estabilizar e testar o contrato HTTP de POST /servicos
**Data:** 24/11/2026

## 1. Projeto

MindHub — backend NestJS 12, TypeORM 1, PostgreSQL 18 (`mindhub-backend/`).

## 2. Caso de uso

UC03 — Publicar Serviço. Escopo: só `POST /servicos` (decisão de @leohsm).

## 3. Issue

[#144](https://github.com/MindHub-DSC/Mindhub/issues/144), criada nesta atividade (não havia Issue de estabilização), sub-issue do épico #35, labels `usecase:uc03`, `layer:integration`, `priority:medium`, responsável @leohsm. 5 critérios de aceite, **ainda não marcados** (aguardam revisão do PR #145). Aberta.

## 4. Branch

```text
main
  └── feature/36 (#131) → feature/38 (#134) → feature/40 (#135) → feature/37 (#139)
        → feature/141-uc03-containerizar-backend (#142, Draft)
              └── feature/144-uc03-contrato-http   PR #145 (Draft) → feature/141-…
```

Base `feature/141-…` por decisão de @leohsm (tem UC03 persistido e Docker).

## 5. Estado inicial

`POST /servicos` com DTO de entrada estrito, `ServicoResponse`, `paraResposta` e filtros de erro já implementados; 110 testes unitários e 35 E2E aprovados (executados agora). Sem documento de contrato; sem teste de propriedade interna simulada.

## 6. Contrato público

`201` com `{ id, perfilId, titulo, descricao, modeloContratacao, condicoes | null, situacao }`; `condicoes` = `{ preco, moeda, duracaoMinutos, modalidade }` (`11-02`). Contrato anterior preservado.

## 7. DTO de entrada

`publicarServicoSchema` (`z.strictObject`), inalterado.

## 8. DTO de resposta

`ServicoResponse` já existia; preservado.

## 9. Mapper

`paraResposta` já existia; alterado só para copiar os 4 campos de `condicoes` (`11-03`). Mapper de persistência (`ServicoMapper`) intacto.

## 10. Controller

Inalterado; continua delegando a `PublicarServico.executar`.

## 11. Semântica HTTP

Matriz de 12 cenários (`11-04`): 201, 400, 422, 404 observados na API containerizada; 403 e 503 só com serviço simulado. Dois formatos de erro coexistem (com e sem `error`); registrado, não alterado.

## 12. Testes de contrato

2 testes novos em `servicos.http.spec.ts` (não exposição com propriedade interna simulada e `condicoes: null`); RED `7900d91` → GREEN `472cdac` (`11-05`).

## 13. Compatibilidade

7 cenários analisados (`11-06`): 5 potencialmente incompatíveis, 2 dependentes do consumidor; nenhum implementado, sem `/v2`.

## 14. API containerizada

Imagem reconstruída; 201 com só os campos públicos; erros 400/422 conferidos; registro em `oferta.servicos` (`11-07`).

## 15. Regressão

| Suíte | Antes | Depois | Regressão |
| --- | --- | --- | --- |
| `pnpm test` | 12 arq / 110 | 12 arq / **112** | Nenhuma (+2 novos) |
| `pnpm test:e2e` | 6 arq / 35 | 6 arq / 35 | Nenhuma |
| `pnpm lint` / `pnpm build` | — | 0 erros / exit 0 | — |

Executado em contêiner `node:24.19.0` (sem Node/pnpm no host); lockfile intacto; banco de desenvolvimento não tocado pelos testes.

## 16. Alterações realizadas

| Arquivo | Tipo |
| --- | --- |
| `mindhub-backend/src/oferta/http/publicar-servico.dto.ts` | Alterado (`paraResposta`) |
| `mindhub-backend/test/unit/oferta/servicos.http.spec.ts` | Alterado (+2 testes) |
| `docs/planejamento/uc03/11-01` a `11-08` | Criados (PR de documentação) |

Não alterados: domínio, aplicação, repositórios, ORM, migrations, Dockerfile, Compose, `.env`.

## 17. Commits reais

| Branch | Hash | Mensagem |
| --- | --- | --- |
| `feature/144-uc03-contrato-http` | `7900d91` | `test(oferta): teste RED de não exposição de propriedades internas em POST /servicos (ref #144)` |
| `feature/144-uc03-contrato-http` | `472cdac` | `fix(oferta): copia explicitamente os campos de condicoes na resposta de POST /servicos (ref #144)` |

Arquivos adicionados por caminho (sem `git add .`); `.env` ignorado e não versionado; senhas não impressas nem commitadas.

## 18. Pull Request

[#145](https://github.com/MindHub-DSC/Mindhub/pull/145) — Draft, `feature/144-uc03-contrato-http` → `feature/141-uc03-containerizar-backend`. PRs #131, #134, #135, #139 e #142 preservados. **Nenhum merge.** Artefatos em PR de documentação separado, para a `main`.

## 19. GitHub Project

A #144 entrou no Project automaticamente, sem status. A primeira tentativa de movê-la falhou (`your authentication token is missing required scopes [project]`: o token tinha só `read:project`). @leohsm ampliou o token (`gh auth refresh -h github.com -s project`) e a operação foi refeita:

```text
$ gh project item-edit … --single-select-option-id <In Review>   (#144)
$ gh issue view 144 --json projectItems
Planejamento - Mindhub=In Review

$ gh project item-list 1 --owner MindHub-DSC   (itens em Done)
(nenhum)
```

A #144 está em **`In Review`** (PR #145 aguarda revisão humana); fluxo `Backlog → Ready → In Progress → In Review → Done` preservado e nada foi para `Done`.

## 20. Checklist

### Planejamento e diagnóstico

| Item | Situação | Evidência |
| --- | --- | --- |
| Oito Markdown do Material 10 analisados | Confirmado | Lidos da branch `docs/material-10-uc03` (PR #143, aberto) |
| Contrato anterior recuperado | Confirmado | `11-01`, seção 5 |
| Controller, DTO de entrada e Service inspecionados e preservados | Confirmado | `11-01`, seção 3; só o mapper mudou |
| Issue identificada; DoR, WIP e branch-base verificados | Confirmado | #144; `11-01`, seção 2; Project (seção 19) |

### Contrato público

| Item | Situação | Evidência |
| --- | --- | --- |
| Campos e tipos públicos definidos e confirmados | Confirmado | `11-02`, `11-07` seção 4 |
| DTO de entrada diferenciado do DTO de resposta | Confirmado | `11-02`, seção 4 |
| Entidade ORM separada do contrato público | Confirmado | `ServicoOrmEntity` não exposta; `ordem` fora da resposta |
| Contrato anterior preservado; nenhum atributo novo | Confirmado | `toEqual` do Material 07 segue passando |

### Serialização

| Item | Situação | Evidência |
| --- | --- | --- |
| DTO de resposta verificado | Confirmado | `ServicoResponse` já existia |
| Mapper verificado, sem regras de negócio | Confirmado | `paraResposta` só copia campos |
| Controller continua delegando ao método original | Confirmado | `executar` |
| Mapper de persistência preservado | Confirmado | `ServicoMapper` intacto |
| Compilação verificada; campos internos não expostos | Confirmado | `build` exit 0; teste de não exposição |

### Semântica HTTP

| Item | Situação | Evidência |
| --- | --- | --- |
| Status de sucesso observado | Confirmado | 201 (`11-04`) |
| Entradas inválidas verificadas; erros analisados | Confirmado | `11-04` |
| Configuração do `ValidationPipe` preservada | Confirmado | `StandardSchemaValidationPipe` e schema estrito inalterados |
| Nenhum erro de domínio inventado | Confirmado | Só os de D-UC03-07 |

### Testes

| Item | Situação | Evidência |
| --- | --- | --- |
| Testes anteriores preservados; novo teste na suíte existente | Confirmado | 2 testes no mesmo `describe` |
| Mock usa o método real do Service | Confirmado | `executar` |
| Propriedade interna simulada com asserção fechada | Confirmado | `toEqual` + `not.toHaveProperty` |
| Testes executados; regressões investigadas | Confirmado | 112/112 e 35/35 |

### Compatibilidade

| Item | Situação | Evidência |
| --- | --- | --- |
| Cenários hipotéticos analisados e classificados | Confirmado | `11-06` |
| Nenhuma alteração incompatível; sem nova versão | Confirmado | Nada implementado |

### API containerizada

| Item | Situação | Evidência |
| --- | --- | --- |
| Imagem reconstruída (o código mudou) | Confirmado | `f97246f7e3cc` |
| Requisição real; status e JSON verificados | Confirmado | `11-07` |
| Ausência de campos internos; observado × definido | Confirmado | `11-07`, seção 4 |

### GitHub

| Item | Situação | Evidência |
| --- | --- | --- |
| Alterações inspecionadas; segredos não versionados | Confirmado | `.env` ignorado |
| Commits reais; PR criado | Confirmado | `7900d91`, `472cdac`; PR #145 |
| Evidências registradas | Confirmado | PR #145 e estes artefatos |
| GitHub Project atualizado | Confirmado | #144 em `In Review` (seção 19) |
| Nenhum merge prematuro | Confirmado | Nenhum PR integrado |

**Resumo:** 31 itens, 31 confirmados.

## 21. Pendências

1. (Resolvida) Card da #144 movido para `In Review`.
2. Revisão humana e integração em ordem: #131 → #134 → #135 → #139 → #142 → #145; o PR de documentação vai direto à `main`.
3. Marcar os critérios da #144 depois da revisão do #145.
4. O PR #143 (documentação do Material 10) segue aberto.

## 22. Próximas ações

- #41: documentar os dois formatos de erro (com e sem `error`) e o contrato do `11-02`.
- Estender o mesmo contrato a `/usuarios` e `/especialistas`, se a equipe quiser (fora deste escopo).
- #39 (concorrência).
