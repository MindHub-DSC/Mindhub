# 08-08 — Versionamento e checklist

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Data:** 17/11/2026

## 1. Versionamento (Fase 11)

### Sub-Issue e branch

| Item | Valor |
| --- | --- |
| Sub-Issue dos testes integrados | **#40**: o UC03 não tem Sub-Issue de testes separada e o escopo da #40 inclui "testes HTTP" (`08-01`) |
| Branch | `feature/40-uc03-endpoint-publicar-servico`: a única onde controller, DTO, módulo, serviço e repositório em memória estão juntos |
| Cadeia | `main` → `feature/36-…` (PR #131) → `feature/38-…` (PR #134) → `feature/40-…` (PR #135). Nenhuma branch nova, nenhuma base alterada |
| WIP | Inalterado: a #40 já estava em `In Progress` |

### Inspeção

```text
$ git status
On branch feature/40-uc03-endpoint-publicar-servico
Your branch is up to date with 'origin/feature/40-uc03-endpoint-publicar-servico'.
Untracked files:
	docs/planejamento/uc03/08-01-diagnostico-arquitetura.md
	… (08-02 a 08-07)
	mindhub-backend/test/unit/oferta/servicos.composicao.spec.ts
	mindhub-backend/test/unit/oferta/servicos.integracao.spec.ts

$ git diff
(vazio = nenhum arquivo rastreado alterado)

$ git diff --staged --stat     (depois de git add dos dois testes, por caminho)
 .../test/unit/oferta/servicos.composicao.spec.ts   |  82 +++++++++++
 .../test/unit/oferta/servicos.integracao.spec.ts   | 157 +++++++++++++++++++++
 2 files changed, 239 insertions(+)
```

Os artefatos `08-*` ficaram fora do commit de código (vão para uma branch de documentação, como os `07-*`).

### Commit e push

```text
13afebadae19bcdb4d0d880589d96aea6dfb901b
test(oferta): testes integrados do backend e diagnóstico de composição (ref #40)
 .../test/unit/oferta/servicos.composicao.spec.ts   |  82 +++++++++++
 .../test/unit/oferta/servicos.integracao.spec.ts   | 157 +++++++++++++++++++++
 2 files changed, 239 insertions(+)

$ git push
   2545027..13afeba  feature/40-uc03-endpoint-publicar-servico -> feature/40-uc03-endpoint-publicar-servico
```

### Pull Request

| Item | Valor |
| --- | --- |
| PR | [#135](https://github.com/MindHub-DSC/Mindhub/pull/135) (o mesmo do Material 07; não recriado) |
| Estado | `OPEN`, Draft, base `feature/38-uc03-publicar-servico`, head `13afeba`, 3 commits exclusivos |
| Descrição | Atualizada: commit `13afeba` na lista de commits e na tabela de componentes; saídas `4 passed`, `3 passed` e `99 passed (99)` |

### GitHub Project e issues

| Item | Situação |
| --- | --- |
| #40 | Aberta; continua em `In Progress` (PR em Draft) |
| #37 (persistência) | **Não movida**: continua em `Backlog`; só foi planejada (`08-07`) |
| #36, #38 | Abertas; `In Review` (decisão do Material 07) |
| #35 | Aberto |
| Verificação dos cards | **Não foi possível verificar**: o token do `gh` não tem escopo de Project |
| Merge | Nenhum |

## 2. Checklist (38 itens)

| # | Item | Situação | Evidência |
| --- | --- | --- | --- |
| 1 | Oito artefatos do Material 07 recebidos e analisados | Confirmado | `docs/planejamento/uc03/07-01` a `07-08` (`08-01`) |
| 2 | Diretório de destino informado | Confirmado | `docs/planejamento/uc03/` |
| 3 | Arquitetura recuperada | Confirmado | `08-01` seção 2 |
| 4 | Contratos identificados e preservados | Confirmado | `08-01` seção 3; nenhum arquivo de `src/` alterado nesta etapa |
| 5 | Componentes reais disponíveis | Confirmado | Todos na branch da #40 |
| 6 | Linha de base executada | Confirmado | `pnpm test` 92/92, `pnpm test:e2e` 25/25 (`08-01`) |
| 7 | Resultados anteriores confirmados | Confirmado | Iguais ao `07-06` |
| 8 | Três níveis comparados em matriz | Confirmado | `08-02` |
| 9 | Módulo verificado | Confirmado | `08-03` |
| 10 | Controller real verificado | Confirmado | `08-03`; `servicos.composicao.spec.ts` |
| 11 | Serviço real verificado | Confirmado | `instanceof PublicarServico` no integrado e na sonda |
| 12 | Repositório em memória real verificado | Confirmado | `instanceof ServicosEmMemoria` resolvido pelo token |
| 13 | Token confirmado | Confirmado | `SERVICOS_REPOSITORIO = Symbol('ServicosRepositorio')` |
| 14 | Cadeia de DI verificada e explicada | Confirmado | `08-03` seção 4 (via `useFactory`/`inject`) |
| 15 | Aplicação inicializada | Confirmado | Processo 11784, `Nest application successfully started` |
| 16 | Requisição válida no fluxo integrado | Confirmado | 201 (`08-04`) |
| 17 | Requisição inválida rejeitada na fronteira | Confirmado | 400 `Unrecognized key: "preco"` (`08-04`) |
| 18 | Respostas reais analisadas | Confirmado | `08-04` seções 3 a 5 |
| 19 | Teste integrado em arquivo único | Confirmado | `servicos.integracao.spec.ts` |
| 20 | Teste integrado no repositório | Confirmado | Commit `13afeba` |
| 21 | Teste integrado executado com sucesso | Confirmado | 4/4 |
| 22 | Serviço **não** mockado | Confirmado | `PublicarServico` vem do `useFactory` do `OfertaModule` |
| 23 | Repositório em memória **não** mockado | Confirmado | `ServicosEmMemoria` vem do `useClass` do módulo. A porta de **perfis** (UC02) usa a implementação em memória do UC02, documentada (`08-05` seção 3) |
| 24 | Resultados do integrado analisados | Confirmado | `08-05`, inclusive a mutação "serviço não grava" |
| 25 | Evidência de armazenamento delimitada | Confirmado | `08-05` seção 8 |
| 26 | Testes anteriores reexecutados | Confirmado | `publicar-servico.spec.ts` 6/6, `servicos.http.spec.ts` 12/12, suítes completas |
| 27 | Sem regressões | Confirmado | 92 → 99 unitários (+7 novos), 25/25 E2E, 0 falhas |
| 28 | Falha de composição investigada | Confirmado | `08-03` (DataSource) e `08-06` |
| 29 | Diagnóstico em contexto isolado | Confirmado | `servicos.composicao.spec.ts`; mensagem real capturada |
| 30 | Seis limitações analisadas | Confirmado | `08-07` seção 4 |
| 31 | Planejamento da persistência real | Confirmado | `08-07` |
| 32 | Nenhum banco/ORM/migration antecipado | Confirmado | Nenhum arquivo de `src/` alterado; #37 não iniciada |
| 33 | Sub-Issue identificada e respeitada | Confirmado | #40 (testes), #37 (persistência, só planejada) |
| 34 | WIP considerado | Confirmado | Nenhuma issue nova em `In Progress` |
| 35 | Branch e PR conforme a cadeia | Confirmado | Commit na branch da #40; PR #135 atualizado, base inalterada |
| 36 | Commit com hash real | Confirmado | `13afebadae19bcdb4d0d880589d96aea6dfb901b` |
| 37 | GitHub Project atualizado sem encerramento prematuro | **Não foi possível verificar** | Nenhuma issue fechada ou movida por mim; o estado dos cards não pôde ser lido (token sem escopo de Project) |
| 38 | Nenhum merge prematuro e 8 artefatos gravados | Confirmado | PRs #131/#134/#135 sem merge; `08-01` a `08-08` em `docs/planejamento/uc03/` |

**Resumo:** 37 confirmados, 1 não foi possível verificar.

## 3. Relatório final (20 pontos)

| # | Ponto | Resumo |
| --- | --- | --- |
| 1 | Projeto e caso de uso | MindHub (NestJS 12), UC03 — Publicar Serviço |
| 2 | Sub-Issues | Testes e HTTP: #40. Persistência: #37 (planejada, não iniciada) |
| 3 | Arquitetura | `POST /servicos` → `ServicosController` → `PublicarServico` → `SERVICOS_REPOSITORIO` → `ServicosEmMemoria`; perfis via TypeORM (UC02) |
| 4 | Linha de base | 92/92 unitários, 25/25 E2E |
| 5 | Níveis de teste | A (serviço com *fakes*), B (HTTP com `vi.fn()`), C (módulo real). B não substitui C |
| 6 | Módulos e providers | 8/8 pontos; tokens `Symbol`; serviço por `useFactory` |
| 7 | Requisições integradas | 201 (válido), 400 (fronteira), 409 de verificação do perfil |
| 8 | Testes integrados | `servicos.integracao.spec.ts` (4) e `servicos.composicao.spec.ts` (3) |
| 9 | Resultados | 4/4 e 3/3; mutação pega pelo nível C e não pelo B |
| 10 | Evolução da suíte | Unitários 9 → 11 arquivos, 92 → 99 testes; E2E 25 → 25 |
| 11 | Evidência de armazenamento | Provider real lido pelo token, por métodos do contrato e pelo contador existente; nenhum acesso privado, endpoint ou método novo |
| 12 | Diagnóstico de DI | `UnknownDependenciesException`: `PublicarServico`, posição 1 do `inject`, token `Symbol(ServicosRepositorio)`; correção `useClass` |
| 13 | Limitações da memória | Volatilidade (observada), instância única, concorrência (#39), sem ACID, sem constraints, sem durabilidade |
| 14 | Persistência real | Adaptador TypeORM, mapper, migration e suíte de contrato contra o PostgreSQL; troca de uma linha no módulo; decidir A2 antes |
| 15 | Branch | `feature/40-uc03-endpoint-publicar-servico` |
| 16 | Commits | `13afeba` (Material 08). Anteriores da #40: `0ca0e19`, `2545027` |
| 17 | Pull Request | #135 (Draft) atualizado |
| 18 | Project | #40 `In Progress`, #37 `Backlog`; cards não verificáveis pela CLI |
| 19 | Pendências | Conferir cards; revisão humana; integrar #131 → #134 → #135; decisão A2; limites de texto; versionar `08-*` |
| 20 | Próximas ações | #37 (persistência real em TDD), depois #39 (concorrência) e #41 (documentação) |
