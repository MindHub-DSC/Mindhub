# 07-08 — Checklist e relatório de consistência

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue HTTP:** [#40](https://github.com/MindHub-DSC/Mindhub/issues/40)
**Data:** 17/11/2026

## 1. Estado final verificado

```text
#131 OPEN draft=true merged=null base=main
#134 OPEN draft=true merged=null base=feature/36-uc03-modelar-servico
#135 OPEN draft=true merged=null base=feature/38-uc03-publicar-servico
#35 OPEN   #36 OPEN   #38 OPEN   #40 OPEN
origin/main = 7c7c6b6 (sem código do UC03)
```

## 2. Checklist (Fase 11)

| # | Item | Situação | Evidência |
| --- | --- | --- | --- |
| 1 | Oito arquivos do Material 06 recebidos e analisados | **Confirmado** | Localizados em `docs/planejamento/uc03/06-01` a `06-08` (`07-01`, fontes) |
| 2 | Diretório de destino informado | **Confirmado** | `docs/planejamento/uc03/`, escolhido pelo responsável |
| 3 | Contratos existentes identificados | **Confirmado** | `07-01` seções 5 e 14: `Servico`, `PublicarServico`, `ServicosRepositorio`/`SERVICOS_REPOSITORIO`, erros |
| 4 | Serviço de aplicação GREEN recuperado | **Confirmado** | Ausente no diagnóstico inicial; implementado em TDD na #38 (PR #134) antes de retomar (`07-01` seção 14) |
| 5 | Sub-Issue HTTP identificada | **Confirmado** | #40 (UC03-SUB-05) |
| 6 | DoR-01 a DoR-07 verificada | **Confirmado** | `07-01` seção 12 (não pronta) e seção 14 (pronta após regularização) |
| 7 | Responsabilidades entre Sub-Issues (Refinamento 1) | **Confirmado** | `07-01` seção 2: DTO e testes no escopo da #40; regras na #36/#38 |
| 8 | Política de WIP considerada | **Confirmado** | Limite 2; #36 e #38 para `In Review` por decisão registrada na #40 |
| 9 | Pacotes verificados (`package.json`) | **Confirmado** | `07-01` seção 7: zod, supertest, `@nestjs/testing`; sem `class-validator` |
| 10 | Estratégia de branch dependente (Refinamento 2) | **Confirmado** | `07-02` seção 2 |
| 11 | Branch criada a partir da base correta | **Confirmado** | `feature/40-…` a partir de `feature/38-…` @ `5add296` (`07-03`) |
| 12 | Controller com separação de camadas | **Confirmado** | `07-03` seção 1: só delega e traduz |
| 13 | Rota conforme o caso de uso | **Confirmado** | `POST /servicos` (D-UC03-07); `Mapped {/servicos, POST} route` (`07-04`) |
| 14 | Delegação ao método real verificada | **Confirmado** | `toHaveBeenCalledWith(corpoValido)` + mutação detectada (`07-06`); E2E com o serviço real |
| 15 | DTO conforme o contrato de entrada | **Confirmado** | `publicarServicoSchema` (`07-03` seção 2) |
| 16 | Validação HTTP configurada e ativa | **Confirmado** | `StandardSchemaValidationPipe` global + schema zod (equivalente ao `ValidationPipe` do material, `07-04` seção 2); 400 reais (`07-05`) |
| 17 | Regras de negócio fora do controller | **Confirmado** | Título vazio → 400 e Reserva Direta sem condições → 422 vêm do domínio (`07-05` seção 5) |
| 18 | Provider/token do repositório configurado | **Confirmado** | `SERVICOS_REPOSITORIO` → `ServicosEmMemoria` (provisório, `07-04` seção 4) |
| 19 | Módulo composto sem erro de injeção | **Confirmado** | `OfertaModule dependencies initialized` |
| 20 | Aplicação inicializada localmente | **Confirmado** | `Nest application successfully started` (`07-04` seção 5) |
| 21 | Requisição válida executada e documentada | **Confirmado** | 201 Reserva Direta e Sob Proposta (`07-05` seção 3) |
| 22 | Requisição inválida rejeitada com 400 | **Confirmado** | `07-05` seção 4 |
| 23 | Respostas HTTP reais analisadas | **Confirmado** | `07-05` seção 6, incluindo a questão de codificação do `curl` |
| 24 | Teste automatizado do cenário válido (Refinamento 3) | **Confirmado** | Teste 1 de `servicos.http.spec.ts` |
| 25 | Teste automatizado do cenário inválido (Refinamento 3) | **Confirmado** | Teste 2, 6 variações, `not.toHaveBeenCalled()` |
| 26 | Testes HTTP executados e aprovados | **Confirmado** | 12/12 e E2E 2/2 |
| 27 | Teste unitário anterior do serviço reexecutado | **Confirmado** | `servico.spec.ts` + `publicar-servico.spec.ts`: 33/33 |
| 28 | Suíte completa sem regressões | **Confirmado** | `pnpm test` 92/92; `pnpm test:e2e` 25/25; lint e build limpos |
| 29 | Alterações inspecionadas (`git status`, `git diff`) | **Confirmado** | `07-07` seção 2 |
| 30 | Commit semântico com hash real | **Confirmado** | `0ca0e19`, `2545027` |
| 31 | Branch publicada | **Confirmado** | `[new branch] feature/40-uc03-endpoint-publicar-servico` |
| 32 | PR documentando dependências entre PRs | **Confirmado** | #135 com a cadeia #131 → #134 → #135 e commits exclusivos |
| 33 | GitHub Project atualizado | **Pendente** | Token do `gh` sem escopo de Project; mudança dos cards é manual (`07-07` seção 6) |
| 34 | Nenhum merge prematuro na `main` | **Confirmado** | Os três PRs com `merged=null`; `main` sem código do UC03 |
| 35 | Nenhuma issue encerrada indevidamente | **Confirmado** | #35, #36, #38, #40 abertas |
| 36 | 8 artefatos gravados no diretório informado | **Confirmado** | `07-01` a `07-08` em `docs/planejamento/uc03/` (ainda não versionados) |

**Resumo dos 36 itens:** 35 confirmados, 1 pendente.

## 3. Relatório consolidado (21 pontos)

| # | Ponto | Resumo |
| --- | --- | --- |
| 1 | Projeto e caso de uso | MindHub, backend NestJS 12; UC03 — Publicar Serviço |
| 2 | Issue HTTP | #40 (UC03-SUB-05) |
| 3 | Responsáveis e revisores | @leohsm; autorrevisão (equipe de um integrante); revisão humana independente pendente |
| 4 | Critérios de aceite | #40: 5/5 atendidos no PR #135. #36: 6/6 (PR #131). #38: 6/6 (PR #134). Épico: faltam #37, #39, #41 |
| 5 | Contratos preservados | `PublicarServico.executar`, erros, `Servico`, `ServicosRepositorio` e token: usados sem alteração pela #40 |
| 6 | Componentes | Controller, DTO, filtro de erros, ligação no `OfertaModule`, adaptador em memória movido para `src`, testes HTTP e E2E |
| 7 | Controller | `ServicosController`, `POST /servicos`, só delega e devolve `paraResposta` |
| 8 | DTO | `z.strictObject` com `usuarioId` UUID, textos, enum do modelo e condições opcionais tipadas |
| 9 | Validação | `StandardSchemaValidationPipe` global (zod), já existente; nenhuma biblioteca nova |
| 10 | Módulo e providers | `PublicarServico` por `useFactory`; `SERVICOS_REPOSITORIO` → `ServicosEmMemoria` (provisório até a #37) |
| 11 | Requisições HTTP | 7 cenários reais com `curl` + 1 de verificação de UTF-8 |
| 12 | Respostas | 201 (2), 400 de fronteira (2), 400 de domínio, 422, 404, todas como esperado; 403 e 503 cobertos só por teste automatizado |
| 13 | Testes HTTP | 12 com serviço simulado (mutação detectada) + 2 E2E |
| 14 | Suíte | Unitários 92/92; integração/E2E 25/25; lint e build limpos |
| 15 | Commits | Da #40: `0ca0e19`, `2545027`. Regularização: 11 da #36 e 4 da #38 |
| 16 | Branch | `feature/40-uc03-endpoint-publicar-servico` a partir de `feature/38-uc03-publicar-servico` |
| 17 | Pull Request | #135 (Draft) → `feature/38-…` |
| 18 | Dependências com PRs anteriores | #131 → `main`; #134 → `feature/36-…`; #135 → `feature/38-…`. Integração de baixo para cima |
| 19 | GitHub Project | Pendente (manual): #36 e #38 `In Review`; #40 `In Progress`; nenhuma em `Done` |
| 20 | Pendências | Cards do Project; revisão humana; Serviços em memória; 403 sem E2E (sem UC18); #39 adiada; decisão A2 (`agora`) |
| 21 | Próximas ações | Revisar e integrar #131 → #134 → #135; #37 persistência TypeORM (trocar só o provider); #39; #41; prompt 08 (verificação integrada e persistência real) |

## 4. Restrições obrigatórias

| Restrição | Cumprida? |
| --- | --- |
| Não recriar Issues/PRs anteriores | Sim: #131 só recebeu commits; #134 e #135 são novos para issues sem PR |
| Não reimplementar o serviço no controller | Sim |
| Não alterar contratos arbitrariamente | Sim: a #40 não mudou nenhum contrato. As mudanças no `Servico` vieram dos ciclos TDD da #36 |
| Não impor o CeliLac | Sim: zod em vez de `class-validator`; rotas, nomes e erros do projeto |
| Não misturar runners | Sim: só `vi.fn()` |
| Não introduzir banco fora do escopo | Sim: os Serviços ficam em memória; o PostgreSQL usado já existia (perfis) |
| Não confundir 400 de DTO com regra de negócio | Sim (`07-03` seção 5, `07-05` seção 7) |
| Não presumir DoR | Sim: a #40 foi declarada não pronta e só seguiu após a regularização |
| Não criar branch sem o serviço na base | Sim |
| Não fazer merge prematuro | Sim |
| Não inventar saídas | Sim. Uma afirmação sem medição ("23 testes E2E antes") foi detectada no rascunho do `07-06` e removida |
| Não encerrar Issues prematuramente | Sim |

## 5. Parecer final

O Material 07 está **concluído com uma pendência operacional** (cards do Project). A fronteira HTTP do UC03 existe, delega ao serviço de aplicação construído em TDD, valida o formato na entrada com o mecanismo do próprio projeto, traduz os erros conforme D-UC03-07 e está coberta por testes de fronteira e E2E, sem regressões. Nada foi integrado à `main`: os três PRs seguem em Draft, encadeados, aguardando revisão.
