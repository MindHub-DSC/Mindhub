# 07-02 — Planejamento HTTP e da branch

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue HTTP:** [#40](https://github.com/MindHub-DSC/Mindhub/issues/40)
**Data:** 17/11/2026

## 1. Issues relacionadas

| Issue | Papel nesta etapa | Situação |
| --- | --- | --- |
| #35 | Épico; guarda D-UC03-05 e D-UC03-07 | Aberta |
| #36 | Agregado, erros de domínio, porta e adaptador em memória | 6/6 critérios; PR #131 (Draft) |
| #38 | `PublicarServico`, chamado pelo controller | 6/6 critérios; PR #134 (Draft) |
| #39 | Proteção contra concorrência | Postergada (decisão na #40) |
| **#40** | **DTO, controller, filtro, ligação no `OfertaModule`, testes HTTP** | Esta etapa |
| #37 | Persistência TypeORM | Futura: a #40 usa a implementação em memória |
| #41 | Documentação do endpoint | Consome a #40 |

## 2. Topologia Git (Refinamento 2)

```text
$ git branch -vv  (resumo)
  main                              7c7c6b6 [origin/main]
  feature/36-uc03-modelar-servico   3ed335f [origin/feature/36-uc03-modelar-servico]
* feature/38-uc03-publicar-servico  5add296 [origin/feature/38-uc03-publicar-servico]
```

| Branch | Contém | PR |
| --- | --- | --- |
| `main` | Nenhum código do `Servico` | — |
| `feature/36-uc03-modelar-servico` | Agregado, erros, porta, adaptador em memória | #131 → `main` (Draft) |
| `feature/38-uc03-publicar-servico` | Tudo da #36 + `PublicarServico` | #134 → `feature/36-…` (Draft) |

Árvore planejada:

```text
main
  └── feature/36-uc03-modelar-servico          (PR #131 → main)
        └── feature/38-uc03-publicar-servico   (PR #134 → feature/36-…)
              └── feature/40-uc03-endpoint-publicar-servico   (novo PR → feature/38-…)
```

**Nova branch:** `feature/40-uc03-endpoint-publicar-servico`, criada a partir de `feature/38-uc03-publicar-servico`.

Justificativa:

- É a única base que tem o serviço de aplicação (#38) e os contratos da #36. Criar a partir da `main` deixaria o controller sem o serviço.
- Nenhum merge na `main` é necessário para começar.
- O PR da #40 terá base `feature/38-…`, então o diff dele mostra **só** os commits exclusivos da #40.

## 3. Estratégia de Pull Request e consolidação

1. Novo **Draft PR** `feature/40-…` → `feature/38-uc03-publicar-servico`, com a cadeia descrita.
2. Integração de baixo para cima: #131 → `main`; depois a base do #134 muda para `main`; depois a base do PR da #40 muda para `main`. Antes de cada merge, atualizar a branch com a nova base e rodar `pnpm test`, `pnpm lint` e `pnpm build`.
3. Nenhum PR anterior tem a base alterada nesta etapa.

## 4. Matriz de planejamento técnico

| Componente | Responsabilidade | Arquivo (caminho real) | Contrato associado | Sub-Issue | Alteração prevista | Dependências | Critério de aceite (#40) | Verificação |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Controller HTTP | Receber `POST /servicos` e delegar | `src/oferta/http/servicos.controller.ts` | `PublicarServico.executar(comando)` | #40 | Criar | Serviço + DTO + filtro | C1 (201) | Teste HTTP + requisição real |
| DTO de entrada/saída | Formato do corpo e da resposta | `src/oferta/http/publicar-servico.dto.ts` | `z.strictObject` (padrão de `cadastrar-perfil.dto.ts`); resposta `{ id, perfilId, titulo, descricao, modeloContratacao, condicoes, situacao }` | #40 | Criar | `zod` 4.6.5 | C1, C2 (400 FE-01) | Teste 400 |
| Validação de fronteira | Validar o corpo antes do controller | `src/app.module.ts` (já existe) | `APP_PIPE` = `StandardSchemaValidationPipe` + `@Body({ schema })` | #40 | **Nenhuma**: reutilizar | `@nestjs/common` 12 | C2 | Rejeição de payload inválido |
| Filtro de erros da publicação | Traduzir erros em códigos de D-UC03-07 | `src/oferta/http/erros-de-publicacao.filter.ts` | `ServicoInvalido`→400, `CondicoesVigentesAusentes`→422, `AtorSemPerfil`→404, `PerfilSuspenso`→403 | #40 | Criar | `responderErro` | C3 | Testes HTTP dos 3 erros |
| 503 de armazenamento | Falha técnica | `src/compartilhado/http/armazenamento-indisponivel.filter.ts` (já global) | `ArmazenamentoIndisponivel` → 503 | #40 | **Nenhuma**: reutilizar | — | C4 | Teste HTTP com dublê que falha |
| Módulo / providers | Compor controller, serviço e porta | `src/oferta/oferta.module.ts` | `PublicarServico` por `useFactory`; `SERVICOS_REPOSITORIO` → implementação em memória | #40 | Registrar | `PERFIS_ESPECIALISTA_REPOSITORIO` (já existe) | C1 | Inicialização do app + rota mapeada |
| Repositório em memória | Resolver o token até a #37 | **Mover** `test/support/servicos.em-memoria.ts` → `src/oferta/infra/servicos.em-memoria.ts` | `ServicosRepositorio` (mesmo contrato, mesma suíte) | #36/#40 | Mover (sem mudar comportamento) e atualizar imports dos testes | — | — | Suíte de contrato continua verde |
| Testes HTTP (fronteira) | 201 + delegação e 400 sem chamar o serviço; erros 404/403/422/503 | `test/unit/oferta/servicos.http.spec.ts` | Supertest + `vi.fn()` (Vitest) | #40 | Criar | `@nestjs/testing`, `supertest` | C1–C4 | `pnpm test` |
| Teste E2E | Jornada UC01 → UC02 → UC03 | `test/e2e/servicos.e2e-spec.ts` | App real + PostgreSQL (perfis) + Serviços em memória | #40 | Criar | `pnpm db:up`, `pnpm test:e2e` | C5 | `pnpm test:e2e` |

## 5. Decisões e riscos

| Item | Decisão / mitigação |
| --- | --- |
| Validação | Zod com `StandardSchemaValidationPipe` (já global). Não instalar `class-validator`/`class-transformer`: não são a stack do projeto |
| `modeloContratacao` na fronteira | `z.enum(['RESERVA_DIRETA', 'SOB_PROPOSTA'])`: é formato (valor fora da lista → 400). O domínio continua recusando por conta própria (critério 2 da #36) |
| Valores das condições | A fronteira só exige os tipos (`number`, `string`). Inteiro, ≥ 0 e > 0 são invariantes do domínio (`ServicoInvalido` → 400), como o UC02 faz com limites de tamanho |
| Implementação em memória em `src/` | Finalidade operacional até a #37; o registro some ao reiniciar a aplicação. Registrar isso no PR e no `07-04` |
| Mover o adaptador | Movimento sem mudança de comportamento; a suíte de contrato prova isso |
| Concorrência (#39) | Fora desta etapa por decisão registrada |
| WIP | #36 e #38 para `In Review` (manual), #40 para `In Progress` (manual) |

## 6. Pendências

- Mover os cards no Project (manual: o token do `gh` não tem escopo de Project).
- A integração final depende das revisões dos PRs #131 e #134.
