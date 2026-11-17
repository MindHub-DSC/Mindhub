# 09-08 — Versionamento e checklist consolidado

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#37](https://github.com/MindHub-DSC/Mindhub/issues/37) — Persistir o Serviço com TypeORM e migration
**Data:** 17/11/2026

## 1. Versionamento (Fase 11)

### Estratégia de branch

```text
main  (sem código do UC03)
  └── feature/36-uc03-modelar-servico                       PR #131 (Draft) → main
        └── feature/38-uc03-publicar-servico                PR #134 (Draft) → feature/36-…
              └── feature/40-uc03-endpoint-publicar-servico PR #135 (Draft) → feature/38-…
                    └── feature/37-uc03-persistir-servico   PR #139 (Draft) → feature/40-…
```

A branch da #37 saiu de `feature/40-…` (e não da `main` nem da `feature/36-…`), porque a troca do provider e o endpoint só existem lá. A decisão foi de @leohsm e está registrada na #37 (corrigindo o registro anterior). Antes, `publicadoEm` e os limites de texto entraram na #36 e foram propagados por merge (`f95ddb2` na #38, `7eb5cf7` na #40). Nenhum merge na `main`.

### Inspeção e segurança

```text
$ git status
?? docs/planejamento/uc03/09-01 … 09-07   (artefatos, fora dos commits de código)

$ git diff --name-only feature/40-uc03-endpoint-publicar-servico..HEAD
mindhub-backend/src/database/migracoes.ts
mindhub-backend/src/database/migrations/1794941417929-ServicosDoUc03.ts
mindhub-backend/src/database/opcoes-typeorm.ts
mindhub-backend/src/oferta/infra/servico.mapper.ts
mindhub-backend/src/oferta/infra/servico.orm-entity.ts
mindhub-backend/src/oferta/infra/servicos.typeorm-repositorio.ts
mindhub-backend/src/oferta/oferta.module.ts
mindhub-backend/test/integracao/servicos.typeorm.spec.ts
mindhub-backend/test/support/contrato-servicos.ts
mindhub-backend/test/support/limpeza.ts
mindhub-backend/test/unit/oferta/servicos.integracao.spec.ts
mindhub-backend/test/unit/oferta/servicos.typeorm-repositorio.spec.ts

$ .env versionado?
  não
.gitignore:10:.env	mindhub-backend/.env
$ segredos nos commits da #37?   (busca por senha/token no diff)
  (nada encontrado)
```

Arquivos adicionados sempre por caminho (sem `git add .`).

### Commits

| Branch | Hash | Mensagem |
| --- | --- | --- |
| `feature/36-…` | `f2602d0` | `test(oferta): teste RED de publicadoEm e dos limites de texto do Serviço (ref #36)` |
| `feature/36-…` | `a1280a8` | `feat(oferta): guarda publicadoEm e limita título e descrição do Serviço (ref #36)` |
| `feature/38-…` | `f95ddb2` | merge de `feature/36-…` |
| `feature/40-…` | `7eb5cf7` | merge de `feature/38-…` |
| `feature/37-…` | `c819fc2` | `test(oferta): teste RED do contrato ServicosRepositorio no PostgreSQL (ref #37)` |
| `feature/37-…` | `c8dd26e` | `feat(oferta): migration da tabela oferta.servicos (ref #37)` |
| `feature/37-…` | `1290ff9` | `test(oferta): teste RED de falha de conexão e de registro corrompido no adaptador TypeORM (ref #37)` |
| `feature/37-…` | `33b8ace` | `feat(oferta): implementa ServicoMapper e ServicosTypeOrmRepositorio (ref #37)` |
| `feature/37-…` | `be24806` | `feat(oferta): liga SERVICOS_REPOSITORIO ao adaptador TypeORM (ref #37)` |
| `feature/37-…` | `e66b59e` | `test(oferta): confere identidade do banco de testes e o registro gravado no PostgreSQL (ref #37)` |

```text
$ git push origin feature/38-uc03-publicar-servico feature/40-uc03-endpoint-publicar-servico
   5add296..f95ddb2  feature/38-uc03-publicar-servico -> feature/38-uc03-publicar-servico
   13afeba..7eb5cf7  feature/40-uc03-endpoint-publicar-servico -> feature/40-uc03-endpoint-publicar-servico
$ git push -u origin feature/37-uc03-persistir-servico
 * [new branch]      feature/37-uc03-persistir-servico -> feature/37-uc03-persistir-servico
```

### Pull Request e issues

| Item | Situação |
| --- | --- |
| PR | [#139](https://github.com/MindHub-DSC/Mindhub/pull/139), Draft, `feature/37-…` → `feature/40-…`. A descrição traz a cadeia, os commits exclusivos, os componentes, os testes, a durabilidade, o checklist e as limitações |
| PRs anteriores | #131, #134 e #135 preservados (Draft, bases inalteradas); recebem os commits de A2/limites pelos merges |
| #37 | Aberta; **5 de 5** critérios marcados. O critério 1 ("migration reversível") só foi marcado depois de `migration:revert` + `migration:run` no banco de testes, com autorização explícita de @leohsm (`09-04` seção 6) |
| #36 | Aberta; decisões A2/limites registradas e implementadas |
| #35, #38, #40 | Abertas |
| GitHub Project | **Não verificável pela CLI** (token sem escopo de Project). Estado correto: #37 em `In Progress` (PR em Draft), ao lado da #40; nenhuma em `Done` |

## 2. Checklist

### Planejamento e diagnóstico

| Item | Situação | Evidência |
| --- | --- | --- |
| Oito artefatos do Material 08 recuperados e analisados | Confirmado | `docs/planejamento/uc03/08-01` a `08-08` (`09-01`) |
| Diretório de destino informado | Confirmado | `docs/planejamento/uc03/` |
| Contratos preservados | Confirmado | Porta, token, serviço, controller e DTO inalterados. O domínio ganhou `publicadoEm`/limites por TDD na #36 (decisão de requisito, não para acomodar o ORM) |
| Sub-Issue de persistência identificada | Confirmado | #37 |
| DoR verificada | Confirmado | `09-01` seções 3 e 7 |
| Dependências e WIP | Confirmado | #37 independente da #40; 2ª vaga |
| Linha de base executada | Confirmado | 99/25 → 107/25 depois de A2 (`09-01`) |
| Branch-base definida com segurança | Confirmado | `feature/40-…` (decisão registrada) |

### Ambiente PostgreSQL e Docker

| Item | Situação | Evidência |
| --- | --- | --- |
| Infraestrutura inspecionada sem destruir volumes | Confirmado | `09-02`; nenhum `down`, nenhum volume removido |
| Banco de desenvolvimento verificado | Confirmado | `mindhub`, `current_database()` |
| Banco de testes isolado | Confirmado | `mindhub_test` (mesmo serviço; nome imposto em código) |
| Portas e `inet_server_port()` | Confirmado | 5433 no host, 5432 informada pelo servidor |
| Credenciais protegidas | Confirmado | Nenhuma senha nos artefatos nem no Git |
| Conexão comprovada | Confirmado | `psql` TCP e cliente `pg` no host |
| Credenciais de teste distintas (requisito do material) | **Pendente** | Mesmo usuário `mindhub`; decisão de manter registrada no `09-02` |

### TypeORM, entidade e migrations

| Item | Situação | Evidência |
| --- | --- | --- |
| `AppModule` preservado | Confirmado | Sem alteração |
| `DataSource` verificado | Confirmado | `09-03` |
| `synchronize: false` | Confirmado | `opcoesTypeOrm` (API, CLI e testes) |
| Entidade ORM separada do domínio | Confirmado | `src/oferta/infra/servico.orm-entity.ts` |
| Mapper sem regras de negócio | Confirmado | `09-04` seção 5 |
| Migration de acordo com a entidade | Confirmado | Gerada da entidade; `\d` igual (`09-04`) |
| Migration aplicada no banco correto após verificação | Confirmado | `migration:show` antes; `mindhub` e `mindhub_test` |
| Histórico e esquema verificados via SQL | Confirmado | `migrations` (id 3) e `\d oferta.servicos` |

### Adaptador e providers

| Item | Situação | Evidência |
| --- | --- | --- |
| Adaptador com tipagem completa | Confirmado | `Repository<ServicoOrmEntity>`, `Promise<Servico \| null>` etc. |
| Assinaturas do contrato preservadas | Confirmado | `adicionar`, `buscarPorId`, `listarPorPerfil` (o `save` do material não é o contrato do projeto) |
| Imports TypeScript/ESM | Confirmado | `.js` e `import type` |
| Compilação sem erros | Confirmado | `build exit=0` |
| Provider atualizado com `forFeature` | Confirmado | `be24806` |
| Aplicação inicializada | Confirmado | PIDs 2716 e 15676 (`09-05`, `09-06`) |
| Testes em memória preservados e independentes | Confirmado | `servicos.integracao.spec.ts` sem banco, asserções intactas |

### Persistência e durabilidade

| Item | Situação | Evidência |
| --- | --- | --- |
| Cadastro HTTP com PostgreSQL real | Confirmado | 201, id `49e6042b-…` |
| Registro consultado via SQL | Confirmado | `09-06` seção 3 |
| UUID confirmado no banco | Confirmado | `WHERE id = '49e6042b-…'` |
| Backend encerrado e reiniciado (banco no ar) | Confirmado | `taskkill 2716`; `docker compose ps` healthy; novo PID 15676 |
| Registro consultado após o reinício | Confirmado | `09-06` seção 4 |
| Durabilidade comprovada | Confirmado | `diff` antes × depois vazio |

### Testes com PostgreSQL real

| Item | Situação | Evidência |
| --- | --- | --- |
| Banco exclusivo de testes | Confirmado | `mindhub_test` |
| Identidade validada antes de escrever | Confirmado | `beforeAll` do `servicos.typeorm.spec.ts` |
| Teste em arquivo único e completo | Confirmado | `09-07` seção 3 |
| `synchronize: false` e `destroy()` seguro | Confirmado | `opcoesTypeOrm`; `afterAll` + `catch` |
| Teste executado e aprovado | Confirmado | 10/10 |
| Suíte anterior sem regressões | Confirmado | `pnpm test` 110/110, `pnpm test:e2e` 35/35 |

### Versionamento e GitHub

| Item | Situação | Evidência |
| --- | --- | --- |
| Alterações inspecionadas | Confirmado | Seção 1 |
| Arquivos selecionados; credenciais fora do Git | Confirmado | `.env` ignorado; busca sem resultados |
| Commits semânticos com hash real | Confirmado | Seção 1 |
| Branch publicada | Confirmado | `[new branch] feature/37-uc03-persistir-servico` |
| PR com rastreabilidade | Confirmado | #139 |
| GitHub Project atualizado | **Não foi possível verificar** | Token sem escopo de Project |
| Nenhum merge prematuro e 8 artefatos salvos | Confirmado | PRs #131/#134/#135/#139 sem merge; `09-01` a `09-08` em `docs/planejamento/uc03/` |

**Resumo (49 itens: os 48 do material + a linha de credenciais de teste distintas):** 47 confirmados, 1 pendente (credenciais de teste distintas, mantido por decisão) e 1 não foi possível verificar (Project).

## 3. Relatório consolidado

| # | Ponto | Resumo |
| --- | --- | --- |
| 1 | Projeto | MindHub (NestJS 12, TypeORM 1, PostgreSQL 18) |
| 2 | Caso de uso | UC03 — Publicar Serviço |
| 3 | Issue e Sub-Issue | Épico #35; #37 (persistência). Suporte: #36 (A2/limites) |
| 4 | Diagnóstico inicial | Infra PostgreSQL/TypeORM/Docker já existia (UC01/UC02); DoR da #37 parcial até implementar A2/limites; base da #37 corrigida para `feature/40-…` |
| 5 | Contratos preservados | Porta, token, serviço, controller, DTO; domínio só mudou por decisão de requisito e TDD na #36 |
| 6 | Ambientes | Dev `mindhub` e testes `mindhub_test` no mesmo serviço (`localhost:5433` → 5432); mesmo usuário (decisão registrada) |
| 7 | Entidade ORM | `ServicoOrmEntity` → `oferta.servicos`, PK do domínio, FK para perfil, 6 CHECKs, `ordem` técnica |
| 8 | Mapper | `ServicoMapper.paraOrm`/`paraDominio` via `paraDados`/`reconstituir`; `RegistroDeServicoCorrompido` |
| 9 | Migration | `ServicosDoUc031794941417929`, gerada e aplicada nos dois bancos; reversão e reaplicação comprovadas no banco de testes (autorizadas) |
| 10 | Adaptador | `ServicosTypeOrmRepositorio` (`insert`, `findOneBy`, `find` por `ordem`, `traduzirFalhaDeConexao`) |
| 11 | Provider e módulo | `forFeature([…, ServicoOrmEntity])` + `useFactory`; `ENTIDADES_ORM` e `MIGRACOES` atualizados |
| 12 | Testes | PostgreSQL 10/10 (contrato, SQL direto, corrompido, FK, CHECK); falha de conexão 3/3; `pnpm test` 110/110; `pnpm test:e2e` 35/35 |
| 13 | Durabilidade | `49e6042b-…` idêntico antes e depois de reiniciar o backend |
| 14 | Salvaguardas | Identidade do banco no teste; sem `TRUNCATE`/`DROP`/`down -v`; `migration:revert` só no banco de testes, com destino conferido e autorização; senhas nunca impressas; `migration:show` antes de cada operação |
| 15 | Branch | `feature/37-uc03-persistir-servico` a partir de `feature/40-…` |
| 16 | Commits | `c819fc2`, `c8dd26e`, `1290ff9`, `33b8ace`, `be24806`, `e66b59e` (#37); `f2602d0`, `a1280a8` (#36); merges `f95ddb2`, `7eb5cf7` |
| 17 | Pull Request | #139 (Draft) → `feature/40-…` |
| 18 | Project | #37 deveria estar em `In Progress`; não verificável pela CLI |
| 19 | Checklist | 47 confirmados, 1 pendente, 1 não verificável |
| 20 | Pendências | Conferir/mover cards; revisão humana; integrar #131 → #134 → #135 → #139; credenciais de teste distintas (se a equipe quiser); versionar `09-*` |
| 21 | Próximas ações | #39 (concorrência: bloqueio ou versão do perfil na mesma transação, agora possível com o banco real) e #41 (documentação) |
