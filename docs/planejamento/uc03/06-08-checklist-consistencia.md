# 06-08 — Checklist e relatório de consistência

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36)
**PR:** [#131](https://github.com/MindHub-DSC/Mindhub/pull/131)
**Data:** 17/11/2026

## 1. Sincronização do GitHub Project e das issues (Fase 10)

| Item | Estado | Justificativa |
| --- | --- | --- |
| Issue #36 | **Aberta** | 1 de 6 critérios de aceite concluído |
| Checklist da #36 | Critério 1 **marcado**, com referência aos commits do PR #131; critérios 2 a 6 desmarcados | O critério 1 tem teste e implementação; os demais não |
| Épico #35 | **Aberto** | A Sub-Issue #36 e as demais Sub-Issues do UC03 seguem em andamento |
| PR #131 | Aberto, **Draft** | Decisão C do `06-07` |
| Card #36 no Project "Planejamento - Mindhub" | Coluna correta: **`In Progress`** (nem `In Review`, nem `Done`) | O PR segue em Draft e há ciclos TDD por fazer. Último registro: `In Progress` (`05-07`) |

Verificação do card **não foi possível nesta sessão**:

```text
$ gh project list --owner MindHub-DSC
error: your authentication token is missing required scopes [read:project]
To request it, run:  gh auth refresh -s read:project
```

Ação pendente do responsável: conferir no GitHub que o card #36 continua em `In Progress` (ou rodar `gh auth refresh -s project` para que a verificação possa ser feita pela CLI).

```text
$ gh issue view 36 --json body -q .body | grep -E '^- \['
- [x] O Serviço nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação declarado. _(teste e implementação no PR #131: `c1a8af0`, `db56884`, `8c98453`, `992c8f1`)_
- [ ] Modelo de Contratação ausente ou fora de Reserva Direta/Sob Proposta é recusado pelo domínio.
- [ ] Reserva Direta só é criada com condições vigentes completas, conforme D-UC03-02.
- [ ] Sob Proposta é criada sem condições vigentes obrigatórias (D-UC03-03).
- [ ] Preço negativo ou não inteiro, moeda vazia e duração não positiva são recusados.
- [ ] A porta permite adicionar, buscar por identificador e listar por perfil; o adaptador em memória devolve cópias defensivas.
```

## 2. Checklist de encerramento (Fase 11)

| # | Item | Situação | Evidência |
| --- | --- | --- | --- |
| 1 | Implementação GREEN recuperada da etapa anterior | **Confirmado** | `06-01`, seção 2: `servico.ts` e `servico.spec.ts` completos @ `db56884` |
| 2 | Linha de base reexecutada e verde antes da refatoração | **Confirmado** | `06-01`, seção 4: 1/1 e 42/42 |
| 3 | Código inspecionado com critérios de qualidade | **Confirmado** | `06-02`, seção 1: 8 critérios |
| 4 | Distinção refatoração × bug fix × evolução aplicada | **Confirmado** | `06-02`, seções 2 e 3: D1 refatoração; D2, D3, D5 a D7 evolução; nenhum defeito |
| 5 | Decisão sobre refatoração justificada | **Confirmado** | `06-02`, seção 4: Cenário A, escopo mínimo |
| 6 | Refatoração preservando comportamento | **Confirmado** | `06-03`: remoção de `NaoImplementado` (−8 linhas), contratos iguais, spec inalterado |
| 7 | Suíte reexecutada sem regressões | **Confirmado** | `06-04`: 42/42, lint e build exit 0 |
| 8 | Matriz linha de base × pós-refatoração com saídas reais | **Confirmado** | `06-04`, seção 2: 6 arquivos, 42 testes |
| 9 | Alterações inspecionadas com `git status`/`git diff` e commitadas com semântica | **Confirmado** | `8c98453` `refactor(oferta)…` e `992c8f1` `test(oferta)…`, adicionados por caminho |
| 10 | PRs dependentes revisados individualmente (Refinamento 1) | **Não aplicável** (com adaptação) | Não há PRs dependentes (Cenário A). A revisão separou RED, GREEN e REFACTOR por commit (`06-05`, seção 2) |
| 11 | Matriz comparativa entre PRs dependentes | **Não aplicável** (com adaptação) | Substituída pela matriz por commit (`06-05`, seção 2) |
| 12 | Níveis de revisão distinguidos | **Confirmado** | `06-05`, seção 4: autoavaliação, parecer de IA e revisão humana (não realizada) |
| 13 | Apontamentos tratados e documentados | **Confirmado** | `06-06`: A1, A3, A4 acatados; A2, A5 postergados; A6 recusado; B1 aberto. Respostas publicadas; A3 e A4 resolvidos no GitHub |
| 14 | Critérios de integração inspecionados item a item | **Confirmado** | `06-07`, seção 2: 10 critérios |
| 15 | Aprovação técnica ≠ autorização para merge (Refinamento 2) | **Confirmado** | `06-07`, seção 3 |
| 16 | PRs classificados nos estados A a D | **Confirmado** | `06-07`: #131 no **Estado A** |
| 17 | Decisão fundamentada sobre merge, sem integração prematura | **Confirmado** | `06-07`, seção 5: **Decisão C**; `mergedAt: null` |
| 18 | GitHub Project sincronizado | **Pendente** | Issue #36 atualizada; card não verificado por falta do escopo `read:project` (seção 1) |
| 19 | Nenhuma issue encerrada prematuramente | **Confirmado** | #36 e #35 `OPEN` |
| 20 | 8 artefatos gravados no diretório informado | **Confirmado** | `docs/planejamento/uc03/06-01` a `06-08` |

**Resumo dos 20 itens:** 17 confirmados, 2 não aplicáveis (com adaptação), 1 pendente.

## 3. Restrições obrigatórias

| Restrição | Cumprida? |
| --- | --- |
| Nenhum dado inventado (saídas, hashes, URLs) | Sim: todas as saídas vêm de execuções desta sessão |
| Nenhuma convenção do CeliLac imposta | Sim: TypeScript/NestJS, Vitest e o padrão do `PerfilEspecialista` |
| Nenhuma regra de negócio sob o rótulo de refatoração | Sim: só a remoção de código morto |
| Nenhuma asserção alterada para mascarar falha | Sim: asserções só foram acrescentadas (A3, A4), com verificação por mutação |
| Nenhuma refatoração artificial | Sim: um único passo com evidência |
| Aprovação técnica não confundida com autorização de merge | Sim |
| Nenhum merge do #131 na `main` | Sim |
| Nenhum `git push --force` ou `git reset --hard` | Sim |
| Nenhuma issue principal encerrada | Sim |

## 4. Rastreabilidade

UC03 → épico #35 → Sub-Issue #36 (critério 1) → branch `feature/36-uc03-modelar-servico` → teste RED `c1a8af0` → GREEN `db56884` → REFACTOR `8c98453` → ajustes de revisão `992c8f1` → PR #131 (Draft, Estado A) → revisão [5943028245](https://github.com/MindHub-DSC/Mindhub/pull/131#pullrequestreview-5943028245) → Decisão C (sem merge).

## 5. Entregáveis práticos

| Entregável | Onde |
| --- | --- |
| Código analisado e refatorado | `mindhub-backend/src/oferta/dominio/servico.ts` @ `8c98453` |
| Evidências reais de regressão | `06-04` e `06-06`, seção 4 |
| Commits semânticos | `8c98453`, `992c8f1` em `origin/feature/36-uc03-modelar-servico` |
| PR atualizado e revisado | #131: título, descrição, revisão e respostas |
| Matriz comparativa e apontamentos | `06-04` (testes), `06-05` (por commit e apontamentos) |
| GitHub Project | Issue #36 atualizada; card a conferir (seção 1) |

## 6. Parecer final

A unidade de **Refatoração, Revisão Técnica e Integração Controlada** está **consistente**. A linha de base foi revalidada antes de qualquer alteração. A única refatoração aplicada tinha evidência de necessidade e não mudou comportamento (42/42 antes e depois). A revisão gerou apontamentos tratados com decisão e evidência, e o teste do critério 1 ficou mais forte (43/43, com verificação por mutação). A integração foi avaliada critério a critério e **não foi feita**, porque o escopo da #36 está incompleto, falta revisão humana e não há autorização formal. Esse é o resultado esperado pelo material.

**Pendências:**

1. Conferir o card #36 no Project (`In Progress`).
2. Versionar os artefatos `05-*` e `06-*` (hoje não rastreados em `docs/planejamento/uc03/`), fora do PR #131.
3. Ciclos TDD dos critérios 2 a 6 da #36 e decisão sobre `agora` (A2).
4. Revisão humana independente antes do merge.
