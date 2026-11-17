# 08-01 — Diagnóstico da arquitetura e linha de base

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Responsável:** Leonardo Herrero S. Martins (@leohsm)
**Data:** 17/11/2026
**Fontes:** `07-01` a `07-08` desta pasta (na `main` desde o PR #136); código da branch `feature/40-uc03-endpoint-publicar-servico` @ `2545027`.

## 1. Projeto, caso de uso e issues

| Item | Valor |
| --- | --- |
| Projeto / domínio | MindHub — C2 Oferta Profissional (backend NestJS 12 + TypeScript) |
| Caso de uso | UC03 — Publicar Serviço |
| Épico | #35 (aberto) |
| Agregado, porta e adaptador em memória | #36 (UC03-SUB-01), PR #131 |
| **Persistência** (equivalente à SUB-04 do material) | **#37 (UC03-SUB-02)**, "Persistir o Serviço com TypeORM e migration", **não iniciada** |
| Serviço de aplicação | #38 (UC03-SUB-03), PR #134 |
| Concorrência | #39 (UC03-SUB-04), postergada por decisão registrada na #40 |
| **Endpoint HTTP** | **#40 (UC03-SUB-05)**, PR #135 |
| Documentação | #41 (UC03-SUB-06) |
| **Sub-Issue de testes** (equivalente à SUB-07) | **Não existe no UC03.** Cada Sub-Issue inclui os próprios testes no escopo; a #40 inclui "testes HTTP". O teste integrado do Material 08 será relacionado à **#40** |

### Critérios de aceite

| Issue | Situação |
| --- | --- |
| #36 | 6/6 com teste (PR #131) |
| #38 | 6/6 com teste unitário (PR #134) |
| #40 | 5/5 com teste HTTP (serviço simulado) e E2E (PR #135); o 403 só com serviço simulado (não há como suspender perfil pela API) |
| #37 | 0/5: os Serviços ficam em memória |
| #39 | Não iniciada |

### Responsáveis, revisores e WIP

| Item | Valor |
| --- | --- |
| Responsável por todas as Sub-Issues | @leohsm |
| Revisor | Autorrevisão (equipe de um integrante); revisão humana independente pendente |
| WIP | 2 issues em `In Progress`. Por decisão registrada na #40: #36 e #38 em `In Review`, #40 em `In Progress` (cards movidos manualmente; o token do `gh` não tem escopo de Project, não reconferido) |

## 2. Componentes reais e camadas

```text
HTTP  POST /servicos
  │   StandardSchemaValidationPipe (APP_PIPE global) + publicarServicoSchema (zod)
  ▼
ServicosController           src/oferta/http/servicos.controller.ts
  │   @UseFilters(ErrosDePublicacaoFilter)    src/oferta/http/erros-de-publicacao.filter.ts
  ▼
PublicarServico.executar     src/oferta/aplicacao/publicar-servico.ts
  │        │
  │        └─► PerfisEspecialistaRepositorio (PERFIS_ESPECIALISTA_REPOSITORIO)
  │              └─ PerfisEspecialistaTypeOrmRepositorio → PostgreSQL   (UC02)
  ▼
Servico.publicar             src/oferta/dominio/servico.ts
  ▼
ServicosRepositorio (SERVICOS_REPOSITORIO)   src/oferta/dominio/servicos.repositorio.ts
  └─ ServicosEmMemoria       src/oferta/infra/servicos.em-memoria.ts
```

**Diferença em relação ao exemplo do material:** o serviço de aplicação depende de **duas** portas. A de Serviços está em memória, mas a de **perfis já é TypeORM/PostgreSQL** (UC02). Por isso, o `OfertaModule` real importa `TypeOrmModule.forFeature([PerfilEspecialistaOrmEntity])` e o `IdentidadeModule`, e não compila sem uma conexão TypeORM. Isso afeta a forma do teste integrado (Fase 7).

## 3. Contratos preservados

| Contrato | Definição |
| --- | --- |
| Entidade `Servico` | `id`, `perfilId`, `titulo`, `descricao`, `modeloContratacao` (`RESERVA_DIRETA` \| `SOB_PROPOSTA`), `situacao` (`PUBLICADO`), `condicoes` (`{ preco, moeda, duracaoMinutos, modalidade }` \| `null`); fábrica `publicar`, `reconstituir`, `paraDados` |
| Porta de Serviços | `ServicosRepositorio { adicionar(servico); buscarPorId(id); listarPorPerfil(perfilId) }` |
| Token | `SERVICOS_REPOSITORIO = Symbol('ServicosRepositorio')` |
| Implementação em memória | `ServicosEmMemoria` (registros privados copiados; leituras reconstituídas; contador público `chamadasDeAdicionar`) |
| Serviço de aplicação | `PublicarServico.executar(comando: PublicarServicoCommand): Promise<Servico>`; comando `{ usuarioId, titulo, descricao, modeloContratacao, condicoes? }`; erros `AtorSemPerfil`, `PerfilSuspenso` |
| DTO | `publicarServicoSchema` (`z.strictObject`) + `ServicoResponse` + `paraResposta` |
| Controller | `ServicosController`, `@Controller('servicos')`, `@Post()` |
| Validação | `StandardSchemaValidationPipe` global via `APP_PIPE` no `AppModule` (não `ValidationPipe`/`class-validator`) |
| Módulos | `OfertaModule` (controller + providers) importado pelo `AppModule` |

## 4. Pacotes e configuração

| Item | Valor |
| --- | --- |
| Runner | Vitest 4.1.11; `vitest.config.ts` (`test/unit/**/*.spec.ts`, sem banco) e `vitest.config.e2e.ts` (`test/integracao/**/*.spec.ts`, `test/e2e/**/*.e2e-spec.ts`, com PostgreSQL de teste, banco `*_test`, migrations no `globalSetup`) |
| HTTP nos testes | `supertest` ^7, `@nestjs/testing` ^12 |
| Scripts | `pnpm test`, `pnpm test:e2e`, `pnpm build`, `pnpm lint`, `pnpm db:up` |
| Imports | ESM com sufixo `.js` |
| Banco local | `mindhub-postgres-1` (Docker, healthy) |
| Aplicação | Ainda no ar desde o Material 07 (porta 3000, `GET /` → 200) |

## 5. Testes existentes

| Arquivo | Nível |
| --- | --- |
| `test/unit/oferta/servico.spec.ts` | Unitário de domínio |
| `test/unit/oferta/publicar-servico.spec.ts` | Unitário do serviço de aplicação com dublês em memória das duas portas |
| `test/unit/oferta/contrato-servicos-em-memoria.spec.ts` | Contrato da porta de Serviços |
| `test/unit/oferta/servicos.http.spec.ts` | HTTP com serviço simulado (`vi.fn()`) — Material 07 |
| `test/e2e/servicos.e2e-spec.ts` | E2E com `AppModule` real e PostgreSQL de teste — Material 07 |
| Demais | UC01/UC02 (unitários, integração TypeORM e E2E) |

## 6. Linha de base (Fase 3)

Branch: `feature/40-uc03-endpoint-publicar-servico` @ `2545027`, sincronizada com a remota.

```text
$ pnpm test
 RUN  v4.1.11 C:/Users/leonardo/Desktop/DSC/Mindhub/mindhub-backend
 Test Files  9 passed (9)
      Tests  92 passed (92)
   Start at  14:58:15
   Duration  1.32s (transform 602ms, setup 0ms, import 1.92s, tests 306ms, environment 1ms)

$ pnpm test:e2e
 RUN  v4.1.11 C:/Users/leonardo/Desktop/DSC/Mindhub/mindhub-backend
 Test Files  5 passed (5)
      Tests  25 passed (25)
   Start at  14:58:16
   Duration  5.48s (transform 276ms, setup 351ms, import 2.59s, tests 1.32s, environment 0ms)
```

| Evidência | Unitários | Integração/E2E |
| --- | --- | --- |
| Comando | `pnpm test` | `pnpm test:e2e` |
| Branch | `feature/40-uc03-endpoint-publicar-servico` | idem |
| Arquivos | 9 | 5 |
| Testes | 92 | 25 |
| Aprovados | 92 | 25 |
| Falhas | 0 | 0 |
| Erros | Nenhum | Nenhum |
| Situação | Verde, igual ao `07-06` | Verde, igual ao `07-06` |

## 7. Branches e Pull Requests

```text
main  973e42c  (sem código do UC03)
  └── feature/36-uc03-modelar-servico            3ed335f   PR #131 (Draft) → main
        └── feature/38-uc03-publicar-servico     5add296   PR #134 (Draft) → feature/36-…
              └── feature/40-uc03-endpoint-publicar-servico   2545027   PR #135 (Draft) → feature/38-…
```

Todos os componentes necessários (controller, DTO, módulo, serviço, porta e adaptador em memória) estão reunidos **só** na branch da #40.

## 8. Pendências e condições para prosseguir

| Pendência | Efeito no Material 08 |
| --- | --- |
| `OfertaModule` depende de TypeORM (perfis) | O teste integrado com o módulo real precisa do PostgreSQL de teste **ou** de troca explícita do provider de perfis pela implementação em memória já existente. Decidir na Fase 5/7 |
| Já existe E2E do UC03 (`servicos.e2e-spec.ts`) | Ele já usa os componentes reais; o Material 08 precisa deixar claro o que o novo teste acrescenta (ex.: inspeção do repositório em memória e foco no `OfertaModule`) |
| Revisão humana, cards do Project, #37, #39 | Não bloqueiam esta etapa |

**Linha de base verde e componentes reais disponíveis. Autorizado prosseguir para a Fase 4 (comparação dos níveis de teste).**
