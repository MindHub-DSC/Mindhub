# 07-01 — Diagnóstico da fronteira HTTP

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue HTTP:** [#40](https://github.com/MindHub-DSC/Mindhub/issues/40) — [UC03-SUB-05] [C2] Expor o endpoint de publicação de Serviço e traduzir os erros
**Responsável:** Leonardo Herrero S. Martins (@leohsm)
**Data:** 17/11/2026
**Fontes:** `06-01` a `06-08` desta pasta; `01-01`, `01-02`, `01-04`, `02-03`; `docs/planejamento-operacional.md`; issues #35 a #41; código da branch `feature/36-uc03-modelar-servico` @ `c487f1f`.

## 1. Projeto e caso de uso

| Item | Valor |
| --- | --- |
| Projeto | MindHub (backend NestJS 12 + TypeScript, `mindhub-backend/`) |
| Caso de uso | UC03 — Publicar Serviço |
| Issue principal | #35 (aberta) |
| Sub-Issue HTTP | **#40** (UC03-SUB-05) |

## 2. Sub-Issues do UC03 e responsabilidades (Refinamento 1)

| Issue | Escopo | Estado no código | Relação com a #40 |
| --- | --- | --- | --- |
| #36 SUB-01 | Agregado `Servico`, objeto de valor das condições, erros, **porta** e adaptador em memória | Só o critério 1 de 6 (`Servico.publicar`); **porta não existe**; PR #131 em Draft | Fornece o agregado e a porta que a #38 usa |
| #37 SUB-02 | Persistência TypeORM e migration | Não iniciada | Fornece o adaptador real; a #40 pode usar o em memória (Material 07, 10.3), que também é da #36 |
| #38 SUB-03 | **Serviço de aplicação `PublicarServico`**: reconhecer perfil, RN01, criar e registrar; erros de aplicação | **Não iniciada: a classe não existe** (`grep PublicarServico` vazio) | **A #40 só delega a ele.** Dependência direta |
| #39 SUB-04 | Proteção contra suspensão concorrente (FE-06) | Não iniciada | Dependência declarada da #40 |
| **#40 SUB-05** | **DTO (`z.strictObject`), controller, filtro de erros, ligação no `OfertaModule`, testes HTTP** | Não iniciada | — |
| #41 SUB-06 | Documentação do UC03 e do endpoint | Não iniciada | Consome a #40 |

Delimitação entre validação e regra:

| Tipo | Onde fica | Sub-Issue |
| --- | --- | --- |
| Formato do corpo (tipos, UUID, campos não previstos → 400, FE-01) | DTO zod na fronteira | #40 |
| Título/descrição vazios, Modelo de Contratação inválido, condições da Reserva Direta, preço/moeda/duração | Domínio (`Servico`) | #36, critérios 2 a 5 |
| Perfil inexistente, perfil `SUSPENSO` (RN01), nada registrado em recusa | Aplicação (`PublicarServico`) | #38 |
| Tradução em 201/400/403/404/422/503 | Filtro HTTP | #40 |

Nesta estrutura, **não há Sub-Issue separada para o DTO nem para os testes**: os dois fazem parte do escopo da #40.

## 3. Critérios de aceite

**#40:**

- [ ] Requisição válida responde 201 com identificador, Modelo de Contratação, condições (quando houver) e situação.
- [ ] Corpo fora do formato ou com campos não previstos responde 400 sem iniciar o caso de uso (FE-01).
- [ ] Perfil suspenso, ator sem perfil e Reserva Direta sem condições respondem com códigos e mensagens distintos e estáveis.
- [ ] Falha de armazenamento responde 503 sem registro.
- [ ] O teste HTTP cobre a jornada UC02 → UC03 com perfil `ATIVO`.

**Situação das camadas de baixo:** na #36, só o critério 1 está atendido (`06-08`). A #38 não tem nenhum critério atendido. Os critérios 1 e 3 da #40 dependem de "condições" e de erros de aplicação que ainda não existem.

## 4. Responsável, revisor e WIP

| Item | Valor | Fonte |
| --- | --- | --- |
| Responsável pela #40 | @leohsm | Assignee no GitHub |
| Revisor | @leohsm (autorrevisão; equipe de um integrante) | `02-01`, `06-05` |
| Limite de WIP | **2 issues em `In Progress`**, somando todos os épicos; a 2ª vaga só para issue **independente** da 1ª | `docs/planejamento-operacional.md`, `02-03` |
| Ocupação atual | #36 em `In Progress` (1 de 2) | `06-08` |

## 5. Contratos existentes recuperados

| Contrato | Existe? | Detalhe |
| --- | --- | --- |
| Entidade `Servico` | Sim | `src/oferta/dominio/servico.ts`: `Servico.publicar({ perfilId, titulo, descricao, modeloContratacao, agora })`, getters `id`, `perfilId`, `titulo`, `descricao`, `modeloContratacao`, `situacao`. Sem condições vigentes |
| Serviço de aplicação | **Não** | Nenhuma classe `PublicarServico`; não há assinatura para o controller delegar |
| Porta do repositório de Serviços + token | **Não** | Não há interface nem `Symbol` para Serviços (só `PERFIS_ESPECIALISTA_REPOSITORIO`) |
| Adaptador em memória de Serviços | **Não** | Só existe `test/support/perfis-especialista.em-memoria.ts` (perfis) |
| Erros de aplicação do UC03 | **Não** | `erros.ts` tem só `PerfilInvalido` e `PerfilJaExistente` |

## 6. Estrutura NestJS atual (referência para a #40)

| Elemento | Situação |
| --- | --- |
| `main.ts` | `NestFactory.create(AppModule)`, `app.listen(PORT ?? 3000)`. Sem pipe global aqui |
| `AppModule` | `TypeOrmModule.forRootAsync`, importa `IdentidadeModule` e `OfertaModule`; **pipe global `APP_PIPE` = `StandardSchemaValidationPipe`**; filtro global `ArmazenamentoIndisponivelFilter` (503) |
| `OfertaModule` | Controller `PerfisEspecialistaController`; providers por `useFactory` (domínio e aplicação não conhecem o Nest) |
| Controller existente | `POST /especialistas` (UC02): `@Body({ schema })`, delega a `CadastrarPerfilEspecialista.executar`, mapeia com `paraResposta`, `@UseFilters(ErrosDeOfertaFilter)` |
| DTO existente | `cadastrar-perfil.dto.ts`: `z.strictObject` + tipo de resposta + `paraResposta` |
| Filtros | `ErrosDeOfertaFilter` (400/409/422), `responderErro` compartilhado |

**Validação na fronteira:** o projeto **não usa** `class-validator`/`class-transformer` nem `ValidationPipe`. Usa **zod 4.6.5** com `StandardSchemaValidationPipe` do `@nestjs/common` 12, registrado globalmente. A #40 deve seguir esse padrão (a própria issue pede `z.strictObject`), sem instalar `class-validator`.

## 7. Dependências e pacotes (`package.json`)

| Necessidade | Pacote | Instalado? |
| --- | --- | --- |
| Framework | `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` ^12 | Sim |
| Validação | `zod` 4.6.5 | Sim |
| Testes | `vitest` ^4.1.2, `@nestjs/testing` ^12 | Sim |
| HTTP nos testes | `supertest` ^7, `@types/supertest` ^7 | Sim |
| `class-validator` / `class-transformer` | — | **Não** (e não são necessários) |

Scripts: `pnpm test` (unitários), `pnpm test:e2e` (integração/E2E com PostgreSQL), `pnpm build`, `pnpm start`, `pnpm lint`.

## 8. Testes (execução atual)

```text
$ pnpm exec vitest run test/unit/oferta/servico.spec.ts
 Test Files  1 passed (1)
      Tests  2 passed (2)
   Duration  239ms (transform 35ms, setup 0ms, import 50ms, tests 3ms, environment 0ms)

$ pnpm test
 Test Files  6 passed (6)
      Tests  43 passed (43)
   Start at  14:16:18
   Duration  851ms (transform 541ms, setup 0ms, import 1.04s, tests 77ms, environment 1ms)
```

Igual ao fim do Material 06 (`06-06`: 43/43). Existem testes E2E de referência para o UC02 em `test/e2e/perfis-especialista.e2e-spec.ts` (não executados aqui: exigem PostgreSQL).

## 9. Branches e Pull Requests

```text
$ git status -sb
## feature/36-uc03-modelar-servico...origin/feature/36-uc03-modelar-servico

$ git log -n 3 --oneline
c487f1f Merge branch 'main' into feature/36-uc03-modelar-servico
7c7c6b6 Merge pull request #133 from MindHub-DSC/docs/materiais-02-05-06-e-prompts
f85547d docs: registra Materiais 02, 05 e 06 e reúne os prompts 04 a 07
```

| Branch | Situação |
| --- | --- |
| `main` @ `7c7c6b6` | Sem nenhum código do `Servico` |
| `feature/36-uc03-modelar-servico` @ `c487f1f` | Único lugar onde existe `Servico`; PR **#131** → `main`, Draft, Estado A, Decisão C (`06-07`) |
| Branch da #38 | **Não existe** |
| Branch da #40 | Não existe |

PRs abertos: só o #131.

## 10. GitHub Project

| Issue | Estado | Fonte |
| --- | --- | --- |
| #36 | `In Progress` | `06-08` (não reconferido: o token do `gh` não tem `read:project`) |
| #38, #40 | `Backlog` (estado inicial recomendado na issue) | Corpo das issues; não reconferido pelo mesmo motivo |

## 11. Decisões de planejamento que a #40 exige

| Decisão | Conteúdo | Situação |
| --- | --- | --- |
| D-UC03-01 a 03 | Atributos do Serviço e condições vigentes | **Decididas** (comentário de @leohsm na #36, 11/11/2026) |
| **D-UC03-05** | Origem do identificador do ator: informado pelo cliente até existir autenticação | **"Dúvida documentada"** em `01-01`; sem registro de decisão na #35 ou na #40 |
| **D-UC03-07** | Rota e códigos: `POST /servicos`; 404 sem perfil, 403 perfil suspenso, 422 condições ausentes | **"Proposta técnica"** em `01-01`; sem registro de decisão |

## 12. Definition of Ready da #40

| Código | Condição | Classificação | Evidência |
| --- | --- | --- | --- |
| DoR-01 | Objetivo definido | **Atende** | "Disponibilizar o caso de uso pela API HTTP com validação de fronteira e respostas estáveis" |
| DoR-02 | Escopo delimitado | **Atende** | Inclui DTO, controller, filtro, ligação no `OfertaModule` e testes; exclui autenticação e listagem |
| DoR-03 | Critérios verificáveis | **Atende** | 5 critérios com status HTTP e comportamento observáveis |
| DoR-04 | Dependências identificadas | **Atende como identificação, mas as dependências não estão satisfeitas** | #38 e #39 identificadas; nenhuma das duas foi iniciada |
| DoR-05 | Informações disponíveis (contrato de entrada/saída, rota, status) | **Não atende** | Não existe o serviço `PublicarServico` (assinatura, retorno e erros a traduzir); D-UC03-05 e D-UC03-07 não foram decididas; o corpo de resposta com "condições" depende dos critérios 3 e 5 da #36 |
| DoR-06 | Responsável definido | **Atende** | @leohsm |
| DoR-07 | Revisão de planejamento | **Não foi possível verificar** | A #40 não tem comentário de revisão (a #36 tem); nenhum registro de DoR específico da #40 |

Considerações práticas:

| Condição | Situação |
| --- | --- |
| Implementação GREEN do serviço de aplicação disponível | **Não**: a #38 não existe no código |
| Sub-Issue do serviço (#38) concluída | **Não**: não iniciada |
| Contrato de entrada definido | Parcial: campos do agregado conhecidos; ator e condições ainda não |
| WIP | A #40 seria a 2ª issue em `In Progress`, mas **não é independente** da #36 (depende dela via #38): viola a regra da 2ª vaga |
| Bloqueios | #38, #39, D-UC03-05, D-UC03-07 |
| Branch onde o serviço GREEN está | Nenhuma: o serviço não existe |

## 13. Pendências e condição para prosseguir

**A #40 não está pronta (DoR-05 não atende, DoR-07 não verificado, dependências não satisfeitas).** Pelas regras do Material 07, não se cria o controller sem o serviço de aplicação, não se reimplementa o serviço no controller e não se cria branch a partir de uma base onde o serviço não existe.

O que precisa ser regularizado antes de alterar código de produção para a #40:

1. **#36:** critério 6 (porta de Serviços + adaptador em memória), além dos critérios 2 a 5 que definem o que o domínio recusa.
2. **#38:** `PublicarServico` em ciclo TDD próprio (RED → GREEN → REFACTOR), com os erros "perfil inexistente" e "perfil suspenso".
3. **#39:** proteção contra suspensão concorrente, ou decisão registrada de que a #40 pode começar antes dela.
4. **D-UC03-05 e D-UC03-07:** registrar a decisão na #35 ou na #40.
5. **DoR-07 da #40:** registrar a revisão de planejamento na issue.
6. **WIP:** liberar a vaga (concluir a #36) ou seguir a ordem #36 → #38 → #39 → #40.

**Condição atendida para prosseguir para a Fase 4 (planejamento da branch e do controller): não.**

---

## 14. Atualização — regularização das pendências (17/11/2026)

Por decisão de @leohsm, as dependências foram feitas antes de retomar o Material 07:

| Pendência (seção 13) | Regularização | Evidência |
| --- | --- | --- |
| 1. #36 critérios 2 a 6 | Ciclos RED → GREEN no PR #131: `d88a046`→`5cf8662` (C2), `2e49da3`→`dba61ff` (C3), `8a74b94`→`306a96e` (C5; C4 já coberto), `2bf6e12`→`1369f7c` (D-UC03-01), `95ed27c`→`55a1ec2` (C6), `3ed335f` (testes de `reconstituir`) | Checklist da #36: 6 de 6 marcados; suíte 74/74 |
| 2. #38 `PublicarServico` | Branch `feature/38-uc03-publicar-servico` (base `feature/36-uc03-modelar-servico`), Draft PR [#134](https://github.com/MindHub-DSC/Mindhub/pull/134): `9ec3ff1`→`68fb01d`, `33f9f22`→`5add296` | Checklist da #38: 6 de 6; suíte 80/80, lint e build limpos |
| 3. #39 | Decisão: a #40 segue antes da #39 | [Comentário na #40](https://github.com/MindHub-DSC/Mindhub/issues/40#issuecomment-6955709621) |
| 4. D-UC03-05 e D-UC03-07 | Decididas: ator = `usuarioId` no corpo; `POST /servicos` com 201/400/404/403/422/503 | [Comentário na #35](https://github.com/MindHub-DSC/Mindhub/issues/35#issuecomment-6955709016) |
| 5. DoR-07 da #40 | Revisão de planejamento registrada (autorrevisão) | Comentário na #40 |
| 6. WIP | #36 e #38 passam para `In Review`, liberando a vaga | Decisão de @leohsm; **a mudança dos cards é manual** (token sem escopo de Project) |

### Contratos agora disponíveis (branch `feature/38-uc03-publicar-servico`)

| Contrato | Definição |
| --- | --- |
| Serviço de aplicação | `PublicarServico.executar(comando: PublicarServicoCommand): Promise<Servico>`; comando `{ usuarioId, titulo, descricao, modeloContratacao, condicoes? }` |
| Erros de aplicação | `AtorSemPerfil`, `PerfilSuspenso` (`src/oferta/aplicacao/publicar-servico.ts`) |
| Erros de domínio | `ServicoInvalido`, `CondicoesVigentesAusentes extends ServicoInvalido` (`src/oferta/dominio/erros.ts`) |
| Porta + token | `ServicosRepositorio` (`adicionar`, `buscarPorId`, `listarPorPerfil`) e `SERVICOS_REPOSITORIO` |
| Implementação | `ServicosEmMemoria` (hoje em `test/support/`); TypeORM fica para a #37 |
| Entidade | `Servico` com `condicoes: CondicoesVigentes \| null` (`preco`, `moeda`, `duracaoMinutos`, `modalidade`) |

### DoR da #40 reavaliada

| Código | Antes | Agora |
| --- | --- | --- |
| DoR-01 a 03 | Atende | Atende |
| DoR-04 | Dependências não satisfeitas | **Atende**: #38 pronta; #39 postergada por decisão registrada |
| DoR-05 | Não atende | **Atende**: serviço, erros, rota e códigos definidos |
| DoR-06 | Atende | Atende |
| DoR-07 | Não verificado | **Atende** (autorrevisão registrada) |

**A #40 está pronta. Autorizado prosseguir para a Fase 4.**
