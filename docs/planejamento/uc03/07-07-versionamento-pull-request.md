# 07-07 — Versionamento e Pull Request

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#40](https://github.com/MindHub-DSC/Mindhub/issues/40)
**Data:** 17/11/2026

## 1. Branch de origem e base

| Item | Valor |
| --- | --- |
| Origem | `feature/40-uc03-endpoint-publicar-servico` |
| Base do PR | `feature/38-uc03-publicar-servico` |
| Justificativa | Só essa base tem o `PublicarServico` (#38) e, por herança, o agregado, os erros e a porta da #36. Com ela, o diff do PR mostra apenas os commits da #40 (Refinamento 2, `07-02`) |

```text
main
  └── feature/36-uc03-modelar-servico            (PR #131 → main, Draft)
        └── feature/38-uc03-publicar-servico     (PR #134 → feature/36-…, Draft)
              └── feature/40-uc03-endpoint-publicar-servico   (PR #135 → feature/38-…, Draft)
```

## 2. Inspeção antes do commit

```text
$ git status
On branch feature/40-uc03-endpoint-publicar-servico
Changes to be committed:
	renamed:    mindhub-backend/test/support/servicos.em-memoria.ts -> mindhub-backend/src/oferta/infra/servicos.em-memoria.ts
Changes not staged for commit:
	modified:   mindhub-backend/src/oferta/infra/servicos.em-memoria.ts
	modified:   mindhub-backend/src/oferta/oferta.module.ts
	modified:   mindhub-backend/test/unit/oferta/contrato-servicos-em-memoria.spec.ts
	modified:   mindhub-backend/test/unit/oferta/publicar-servico.spec.ts
Untracked files:
	docs/planejamento/uc03/07-01-diagnostico-fronteira-http.md
	… (07-02 a 07-06)
	docs/prompts/08-verificacao-integrada-do-backend-e-preparacao-para-persistencia-real.md
	mindhub-backend/src/oferta/http/erros-de-publicacao.filter.ts
	mindhub-backend/src/oferta/http/publicar-servico.dto.ts
	mindhub-backend/src/oferta/http/servicos.controller.ts
	mindhub-backend/test/e2e/servicos.e2e-spec.ts
	mindhub-backend/test/unit/oferta/servicos.http.spec.ts

$ git diff --stat
 .../src/oferta/infra/servicos.em-memoria.ts          | 11 +++++------
 mindhub-backend/src/oferta/oferta.module.ts          | 20 +++++++++++++++++++-
 .../unit/oferta/contrato-servicos-em-memoria.spec.ts |  2 +-
 .../test/unit/oferta/publicar-servico.spec.ts        |  2 +-
```

Só arquivos de `mindhub-backend/` do escopo da #40 entraram nos commits, adicionados por caminho. Ficaram fora: os artefatos `07-*` (documentação) e o prompt `08-…`, que apareceu em `docs/prompts/` durante a etapa e não pertence a ela.

## 3. Commits

| Hash | Mensagem | Arquivos |
| --- | --- | --- |
| `0ca0e19` | `refactor(oferta): move ServicosEmMemoria para src/oferta/infra (ref #40)` | 3 arquivos, +7 −8 (movimento + imports) |
| `2545027` | `feat(oferta): adiciona o endpoint POST /servicos (ref #40)` | 6 arquivos, +387 −1 (controller, DTO, filtro, módulo, testes HTTP e E2E) |

```text
$ git log --oneline feature/38-uc03-publicar-servico..HEAD
2545027 feat(oferta): adiciona o endpoint POST /servicos (ref #40)
0ca0e19 refactor(oferta): move ServicosEmMemoria para src/oferta/infra (ref #40)
```

**Exclusivos desta etapa:** `0ca0e19` e `2545027`. **Herdados da base:** os 4 commits da #38 (`9ec3ff1`, `68fb01d`, `33f9f22`, `5add296`) e os da #36.

Commits que regularizaram as dependências antes do Material 07 (registrados no `07-01`, seção 14): #36 `d88a046` … `3ed335f` (11 commits, PR #131) e #38 (4 commits, PR #134).

## 4. Push

```text
$ git push -u origin feature/40-uc03-endpoint-publicar-servico
 * [new branch]      feature/40-uc03-endpoint-publicar-servico -> feature/40-uc03-endpoint-publicar-servico
branch 'feature/40-uc03-endpoint-publicar-servico' set up to track 'origin/feature/40-uc03-endpoint-publicar-servico'.
```

## 5. Pull Request

| Item | Valor |
| --- | --- |
| Número / URL | [#135](https://github.com/MindHub-DSC/Mindhub/pull/135) |
| Título | `feat(oferta): endpoint POST /servicos (UC03-SUB-05, ref #40)` |
| Estado | `OPEN`, **Draft** |
| Origem → base | `feature/40-uc03-endpoint-publicar-servico` → `feature/38-uc03-publicar-servico` |
| Descrição | Issues, objetivo, cadeia de branches com os commits exclusivos, componentes, requisições reais, testes, checklist da #40, limitações e condições de integração |

Evidências anexadas à descrição: tabela das requisições reais (`07-05`) e as saídas `12 passed`, `2 passed`, `92 passed (92)`, `25 passed (25)`, lint e build (`07-06`).

## 6. Revisão, issues e GitHub Project

| Item | Situação |
| --- | --- |
| Revisão | Autorrevisão; revisão humana independente pendente (equipe de um integrante). O PR fica em Draft até os PRs-base serem revisados |
| Issue #40 | Aberta; 5 de 5 critérios marcados com referência ao PR #135 (`2545027`) |
| Issues #36, #38 | Abertas; critérios marcados; PRs #131 e #134 em Draft |
| Épico #35 | Aberto (faltam #37, #39 e #41) |
| Project | **Manual** (o token do `gh` não tem escopo de Project). Estado correto: #40 em `In Progress` enquanto o PR estiver em Draft (ou `In Review` se você tirá-lo de Draft); #36 e #38 em `In Review`. **Nenhuma em `Done`** |

## 7. Pendências e próximas ações

1. Mover os cards no Project.
2. Revisar e integrar de baixo para cima: #131 → `main`; rebasear a base do #134 para `main`; depois a do #135.
3. #37 (persistência TypeORM de Serviços), trocando só o provider de `SERVICOS_REPOSITORIO`.
4. #39 (concorrência) e #41 (documentação do endpoint).
5. Decisão A2 (`agora`/`publicadoEm`) antes da #37.
