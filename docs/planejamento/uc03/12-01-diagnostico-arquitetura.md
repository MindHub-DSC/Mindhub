# 12-01 — Diagnóstico da arquitetura

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#147](https://github.com/MindHub-DSC/Mindhub/issues/147) — [UC03-SUB-09] Auditar a arquitetura do fluxo POST /servicos
**Código auditado:** branch `feature/144-uc03-contrato-http` @ `472cdac` (ponta da cadeia do UC03)
**Diretório de artefatos:** `docs/planejamento/uc03/` (o mesmo dos Materiais anteriores)
**Data:** 24/11/2026

Legenda: **[DOC]** documentado · **[CÓD]** confirmado no código · **[EXE]** executado nesta atividade · **[PEN]** pendente.

## 1. Projeto e caso de uso

MindHub — NestJS 12, TypeORM 1, PostgreSQL 18, Zod, Vitest + Supertest, Docker Compose. Fluxo auditado: `POST /servicos` (UC03), no contexto C2 (Oferta), com a dependência de leitura do perfil do especialista.

## 2. Documentação recuperada

Os oito artefatos do Material 11 (`11-01` a `11-08`, PR #146 ainda aberto) foram lidos. Dele vêm: contrato público fechado (`201`, 7 campos + `condicoes`), `paraResposta` com cópia explícita de `condicoes`, matriz de erros com dois formatos, 112 testes unitários e 35 E2E, API containerizada verificada. Esses números são **históricos**; os atuais estão na seção 5.

## 3. Componentes [CÓD]

| Camada | Componente | Arquivo |
| --- | --- | --- |
| HTTP | `ServicosController` | `oferta/http/servicos.controller.ts` |
| HTTP | DTO de entrada (`publicarServicoSchema`), DTO de resposta (`ServicoResponse`) e mapper HTTP (`paraResposta`) | `oferta/http/publicar-servico.dto.ts` |
| HTTP | `ErrosDePublicacaoFilter`, `ArmazenamentoIndisponivelFilter` | `oferta/http/…`, `compartilhado/http/…` |
| Aplicação | `PublicarServico.executar` (+ `AtorSemPerfil`, `PerfilSuspenso`) | `oferta/aplicacao/publicar-servico.ts` |
| Domínio | `Servico` (`publicar`, `reconstituir`, `paraDados`), `ServicoInvalido`, `CondicoesVigentesAusentes` | `oferta/dominio/` |
| Porta | `ServicosRepositorio` + token `SERVICOS_REPOSITORIO`; `PerfisEspecialistaRepositorio` | `oferta/dominio/` |
| Infra | `ServicosTypeOrmRepositorio`, `ServicoMapper`, `ServicoOrmEntity`, `ServicosEmMemoria` | `oferta/infra/` |
| Composição | `OfertaModule` (`useFactory`), `AppModule` (`APP_PIPE`, `APP_FILTER`, `TypeOrmModule.forRootAsync`) | `oferta/oferta.module.ts`, `app.module.ts` |

## 4. Contratos a preservar

| Contrato | Assinatura |
| --- | --- |
| Service usado pelo Controller | `PublicarServico.executar(comando): Promise<Servico>` |
| Porta de persistência | `ServicosRepositorio { adicionar, buscarPorId, listarPorPerfil }` e token `SERVICOS_REPOSITORIO` |
| Mapper HTTP | `paraResposta(servico: Servico): ServicoResponse` |
| Contrato HTTP | `POST /servicos` → `201` com `{ id, perfilId, titulo, descricao, modeloContratacao, condicoes \| null, situacao }` |

## 5. Verificações atuais (linha de base) [EXE]

Sem `node`/`pnpm` no host: contêiner `node:24.19.0-bookworm-slim` na rede `mindhub_default`, `DB_HOST=postgres`.

```text
$ pnpm build        → exit 0
$ pnpm lint         → Found 0 warnings and 0 errors (75 arquivos)
$ pnpm test         → Test Files 12 passed (12) · Tests 112 passed (112)
$ pnpm test:e2e     → Test Files  6 passed (6)  · Tests  35 passed (35)   (banco mindhub_test)
$ git status --short   (limpo)
$ docker compose ps    mindhub-api-1 Up · mindhub-postgres-1 Up (healthy)
$ SELECT current_database(), count(*) FROM oferta.servicos → mindhub | 7   (banco de desenvolvimento)
```

O banco de desenvolvimento ficou com as 7 linhas criadas manualmente nas verificações dos Materiais 10 e 11: os testes não o alteraram.

## 6. Infraestrutura [DOC] [EXE]

Serviço `api` (porta 3000) e `postgres` (PostgreSQL 18, host 5433 → 5432, volume `mindhub_mindhub-pgdata`). O banco de testes é o `mindhub_test`, **no mesmo serviço** (decisão do `09-02`). O volume atual foi recriado em 24/11/2026 (o ambiente anterior não existia mais; ver `10-07`, seção 12).

## 7. GitHub

| Item | Situação |
| --- | --- |
| Issue efetiva | **Não existia** [EXE]: #35 a #41, #141 e #144 não contemplam auditoria arquitetural. Criada a **#147**, sub-issue do #35, labels `usecase:uc03`, `layer:integration`, `priority:medium`, responsável @leohsm (decisão de @leohsm). A Issue da containerização (#141) e a do contrato (#144) **não** foram reutilizadas |
| DoR | Objetivo, escopo, 5 critérios verificáveis, dependências (#144, #141) e responsável: atendidos. Revisão: autorrevisão (equipe de um integrante) |
| Cadeia de PRs | #131 → #134 → #135 → #139 → #142 → #145, todos Draft, **nenhum integrado à `main`**; #143 e #146 (documentação) abertos |
| Branch | A auditoria não gera código: nenhuma branch de código foi criada. Só uma branch documental, `docs/material-12-uc03` (de `main`) |
| WIP | #147 em `In Progress` durante a auditoria |

## 8. Riscos e pendências

- Parte da cadeia só existe em PRs Draft: a conclusão vale para o código dessa cadeia (`472cdac`), não para a `main`.
- Concorrência (#39) e falhas reais de infraestrutura (403/503 na API real) estão fora do escopo verificado.
- Revisão humana pendente.

## 9. Plano de auditoria

1. Reconstruir fluxo e dependências (`12-02`).
2. Auditar os oito critérios por componente, separando hipóteses de problemas (`12-03`).
3. Priorizar e decidir (`12-04`); refatorar só se houver problema comprovado (`12-05`).
4. Reexecutar a regressão (`12-06`), registrar decisões (`12-07`) e o parecer (`12-08`).
