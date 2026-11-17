# 09-01 — Diagnóstico da persistência e linha de base

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue de persistência:** [#37](https://github.com/MindHub-DSC/Mindhub/issues/37) — [UC03-SUB-02] Persistir o Serviço com TypeORM e migration
**Responsável:** Leonardo Herrero S. Martins (@leohsm)
**Data:** 17/11/2026
**Diretório de artefatos:** `docs/planejamento/uc03/` (o mesmo dos Materiais 01 a 08)
**Fontes:** `08-01` a `08-08` (na `main`); código da branch `feature/40-uc03-endpoint-publicar-servico` @ `13afeba`; `mindhub-backend/compose.yaml`, `.env.example`, `src/config/ambiente.ts`, `src/database/*`, `test/setup/*`.

## 1. Diagnóstico (20 pontos)

| # | Ponto | Situação |
| --- | --- | --- |
| 1 | Projeto / caso de uso | MindHub, C2 Oferta Profissional; UC03 — Publicar Serviço |
| 2 | Contratos | `Servico` (`publicar`, `reconstituir`, `paraDados`, `DadosDoServico`, `CondicoesVigentes`); `ServicosRepositorio { adicionar; buscarPorId; listarPorPerfil }` + `SERVICOS_REPOSITORIO`; `PublicarServico.executar`; `ServicosController` (`POST /servicos`); `publicarServicoSchema` |
| 3 | Estrutura | `src/<contexto>/{dominio,aplicacao,infra,http}`, `src/database`, `src/config`, `src/compartilhado`; testes em `test/{unit,integracao,e2e,support,setup}` |
| 4 | Módulos | `AppModule` (TypeORM root, pipe e filtro globais) → `IdentidadeModule`, `OfertaModule` |
| 5 | PostgreSQL | **Já existe e está em uso** pelo UC01 (usuários) e pelo UC02 (perfis) |
| 6 | Docker | `compose.yaml`: serviço único `postgres` (`postgres:18-alpine`), porta `${DB_PORT:-5433}:5432`, volume `mindhub-pgdata`, healthcheck `pg_isready`. Container `mindhub-postgres-1` **healthy** |
| 7 | TypeORM no `AppModule` | `TypeOrmModule.forRootAsync` com `opcoesTypeOrm(lerAmbienteDoBanco())`, `retryAttempts: 3`. Entidades explícitas (`ENTIDADES_ORM`), **não** `autoLoadEntities` |
| 8 | DataSource da CLI | `src/database/data-source.ts` (usado compilado em `dist/`), mesmas opções da API; destino = `DB_NAME` |
| 9 | Migrations | Uma: `1794334070122-EsquemaInicialIdentidadeOferta` (schemas `identidade` e `oferta`, tabelas `usuarios` e `perfis_especialista`), registrada em `src/database/migracoes.ts` (lista explícita, sem glob); tabela de histórico `migrations` |
| 10 | Variáveis | `.env` (não versionado) e `.env.example`: `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_TEST_NAME`. Validação com zod; erros citam nomes, nunca valores |
| 11 | Testes | Unitários (domínio, aplicação, contrato em memória, HTTP com mock, integrado em memória, composição), integração TypeORM (UC01, UC02) e E2E (UC01, UC02, UC03) |
| 12 | Scripts | `test`, `test:e2e`, `build`, `start`, `lint`, `db:up`, `db:stop`, `migration:generate`, `migration:run`, `migration:revert`, `migration:show` (os de migration compilam antes) |
| 13 | Issues | Épico #35; #36 domínio (PR #131); **#37 persistência**; #38 aplicação (PR #134); #39 concorrência; #40 HTTP (PR #135); #41 documentação |
| 14 | Responsável / revisor | @leohsm; autorrevisão (equipe de um integrante) |
| 15 | Dependências | #37 depende de #36. #39 depende de #37 |
| 16 | Estado da #37 | Aberta, sem branch nem PR; `Backlog` (não reconferido: token sem escopo de Project). Comentário de decisões registrado em 17/11/2026 |
| 17 | WIP | 2 em `In Progress`. Hoje: #40 em `In Progress`; #36 e #38 em `In Review` |
| 18 | Branches | `main` (sem código do UC03) → `feature/36-…` → `feature/38-…` → `feature/40-…`, encadeadas |
| 19 | PRs | #131 → `main`, #134 → `feature/36-…`, #135 → `feature/38-…`, todos Draft |
| 20 | Pendências do 08 | Decisão A2 e limites de texto **decididos** (registrados na #36 e na #37), mas **não implementados** no domínio; cards do Project não verificáveis pela CLI |

## 2. Infraestrutura já presente

```text
compose.yaml
  services.postgres  image postgres:18-alpine
                     ports "${DB_PORT:-5433}:5432"      (host 5433 → contêiner 5432)
                     volume mindhub-pgdata:/var/lib/postgresql
                     healthcheck pg_isready
src/database/opcoes-typeorm.ts   synchronize: false, migrationsRun: false,
                                 entities: ENTIDADES_ORM, migrations: MIGRACOES
test/setup/banco-de-teste.ts     DB_TEST_NAME precisa casar com /^[a-z0-9_]+_test$/
                                 e ser diferente de DB_NAME; troca DB_NAME pelo de teste
test/setup/global-setup.ts       cria o banco de teste se faltar e roda as migrations nele
```

O banco de testes é **outro banco no mesmo servidor e com o mesmo usuário** (não há serviço nem credencial separados). Isso será analisado na Fase 3.

## 3. Definition of Ready da #37

| Código | Condição | Situação | Evidência |
| --- | --- | --- | --- |
| DoR-01 | Objetivo | Atende | "Gravar e recuperar Serviços no PostgreSQL com a mesma interface da porta de domínio" |
| DoR-02 | Escopo | Atende | Inclui entidade ORM, mapper, repositório TypeORM, migration reversível, testes de contrato; exclui regras no repositório e busca (UC04) |
| DoR-03 | Critérios verificáveis | Atende | 5 critérios (migration reversível; adicionar/buscar preservam campos; 1 : 0..*; falha técnica → armazenamento indisponível; contrato nos dois adaptadores) |
| DoR-04 | Dependências | **Parcial** | #36 tem os 6 critérios no código, mas **A2 (`publicadoEm`) e os limites de texto ainda não foram implementados** no domínio; sem eles a migration teria de mudar depois |
| DoR-05 | Informações técnicas | Atende | `08-07` + comentário de decisões na #37 (coluna `publicado_em`, `varchar(120)`/`varchar(2000)`, FK para perfis, sem `UNIQUE`) |
| DoR-06 | Responsável | Atende | @leohsm |
| DoR-07 | Revisão de planejamento | Atende | Comentário de decisões na #37 (autorrevisão) |

### WIP

A #37 ocuparia a 2ª vaga de `In Progress`, ao lado da #40. A regra da equipe aceita a 2ª vaga só para issue **independente** da 1ª. A #37 não depende da #40 (as duas dependem da #36), então a regra é atendida. Nenhuma issue será movida artificialmente.

## 4. Linha de base

Branch `feature/40-uc03-endpoint-publicar-servico` @ `13afeba`, sincronizada com a remota.

```text
$ pnpm test
 Test Files  11 passed (11)
      Tests  99 passed (99)
   Start at  15:22:38
   Duration  3.12s (transform 1.21s, setup 0ms, import 8.07s, tests 1.35s, environment 2ms)

$ pnpm test:e2e
 Test Files  5 passed (5)
      Tests  25 passed (25)
   Start at  15:22:42
   Duration  7.73s (transform 359ms, setup 534ms, import 3.37s, tests 1.67s, environment 2ms)
```

| Suíte | Arquivos | Testes | Falhas | Comparação com o `08-08` |
| --- | --- | --- | --- | --- |
| `pnpm test` | 11 | 99 | 0 | Igual |
| `pnpm test:e2e` | 5 | 25 | 0 | Igual |

## 5. Conflito encontrado: branch-base da #37

No fim do Material 08 ficou registrado (comentário na #37) que a branch da #37 sairia de `feature/36-uc03-modelar-servico`. O Material 09, porém, exige:

- **Fase 7:** trocar o provider de `SERVICOS_REPOSITORIO` no `OfertaModule` e preservar o teste integrado em memória do Material 08;
- **Fase 8:** cadastrar via `POST /servicos` e provar a durabilidade depois de reiniciar o backend.

O provider de `SERVICOS_REPOSITORIO` no `OfertaModule`, o controller e o teste integrado **só existem em `feature/40-…`**. Numa branch a partir de `feature/36-…`, as Fases 7 e 8 não teriam onde acontecer.

| Opção | Branch-base da #37 | Consequência |
| --- | --- | --- |
| A | `feature/40-uc03-endpoint-publicar-servico` | Cadeia `main → 36 → 38 → 40 → 37`. Tudo o que o Material 09 pede fica possível. O PR da #37 aponta para `feature/40-…` e mostra só os commits da #37 |
| B | `feature/36-uc03-modelar-servico` (decisão anterior) | Entidade ORM, mapper, migration, adaptador e testes de contrato são possíveis; troca de provider e durabilidade via HTTP **não** (iriam para a #40 depois) |

## 6. Riscos e condições para prosseguir

| Item | Condição |
| --- | --- |
| A2 e limites de texto | Implementar **antes** da migration, em ciclo TDD da #36 (na branch `feature/36-…`), e propagar para as branches de baixo por merge |
| Branch-base | Escolher entre A e B (seção 5) e corrigir o registro na #37 se mudar |
| Banco de testes | Mesmo servidor e mesmo usuário do desenvolvimento; avaliar na Fase 3 |
| Migrations | Verificar destino e histórico antes de qualquer `migration:run` (Fase 4) |

**Linha de base verde. Prosseguir depende da escolha da branch-base e da implementação de A2/limites.**

---

## 7. Regularização (17/11/2026)

### Decisões de @leohsm

| Item | Decisão | Registro |
| --- | --- | --- |
| Branch-base da #37 | **Opção A**: `feature/40-uc03-endpoint-publicar-servico` | [Comentário de correção na #37](https://github.com/MindHub-DSC/Mindhub/issues/37#issuecomment-6957069933) (substitui a base `feature/36-…` registrada antes) |
| A2 e limites de texto | Implementar na branch da #36 (PR #131) e propagar por merge | Mesmo comentário |

### A2 e limites de texto em TDD (branch `feature/36-uc03-modelar-servico`)

| Commit | Fase | Conteúdo |
| --- | --- | --- |
| `f2602d0` | RED | 6 falhas: `publicadoEm` (guardar `agora`, cópia defensiva, `reconstituir`/`paraDados`, data inválida) e título > 120 / descrição > 2000. Contrato: `publicadoEm` em `DadosDoServico` + getter provisório |
| `a1280a8` | GREEN | `publicadoEm` guardado e validado; `MAX_CARACTERES_TITULO = 120`, `MAX_CARACTERES_DESCRICAO = 2000` (após aparar). `servico.spec.ts` 35/35; suíte da branch 82/82 |

### Propagação

```text
feature/38-uc03-publicar-servico  ← merge de feature/36   f95ddb2   pnpm test 8 arquivos, 88/88   lint 0   build exit 0
feature/40-uc03-endpoint-…        ← merge de feature/38   7eb5cf7   pnpm test 11 arquivos, 107/107   lint 0   build exit 0
                                                                   pnpm test:e2e 5 arquivos, 25/25
$ git push origin feature/38-uc03-publicar-servico feature/40-uc03-endpoint-publicar-servico
   5add296..f95ddb2  feature/38-uc03-publicar-servico -> feature/38-uc03-publicar-servico
   13afeba..7eb5cf7  feature/40-uc03-endpoint-publicar-servico -> feature/40-uc03-endpoint-publicar-servico
```

### Nova linha de base (branch da #40, que será a base da #37)

| Suíte | Antes (seção 4) | Agora | Diferença |
| --- | --- | --- | --- |
| `pnpm test` | 11 arquivos, 99 | 11 arquivos, **107** | +8 testes do A2/limites (`servico.spec.ts`), 0 falhas |
| `pnpm test:e2e` | 5 arquivos, 25 | 5 arquivos, 25 | Igual |

### DoR da #37 reavaliada

DoR-04 passa a **Atende**: o domínio já tem `publicadoEm` e os limites que a migration vai refletir. Os 7 critérios atendem.

**Condições para prosseguir atendidas. Próxima fase: ambiente PostgreSQL e Docker (Fase 3).**
