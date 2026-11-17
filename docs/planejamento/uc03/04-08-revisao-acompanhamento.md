# 04-08 — Revisão técnica inicial e acompanhamento

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36)
**Data:** 11/11/2026

## Links

| Item | Link |
| --- | --- |
| Draft PR | <https://github.com/MindHub-DSC/Mindhub/pull/131> |
| Comentário de revisão | <https://github.com/MindHub-DSC/Mindhub/pull/131#issuecomment-6805227348> |
| Comentário de decisões (DoR) | <https://github.com/MindHub-DSC/Mindhub/issues/36#issuecomment-6804988906> |
| Commit | `c1a8af0` |

## Parecer da revisão técnica inicial

Revisor: @leohsm, por **autorrevisão** (a equipe tem um integrante; não houve revisor independente). Comentário publicado em 11/11/2026, 19:25 UTC.

| Item do checklist | Parecer |
| --- | --- |
| Teste claro, padrão AAA, cobre só o critério 1 da #36 | Ok |
| Falha RED legítima (`NaoImplementado`), não é erro de ambiente | Ok |
| Só 2 arquivos; o stub não tem regra de negócio | Ok |
| PR marcado como Draft, sem merge | Ok, depois da correção abaixo |

**Ocorrência:** às 19:25:27 UTC o PR foi marcado como *Ready for review* (provavelmente um clique acidental ao abri-lo), 30 s antes do comentário. Foi detectado na conferência e o PR voltou a **Draft** (`gh pr ready --undo`); verificado em seguida: `isDraft: true`, `state: OPEN`, sem merge. Isso mostra o risco de o PR sair de Draft sem querer, e a política de não integrar antes do GREEN depende da proteção da `main`.

**Limitação:** a autorrevisão não cumpre a segregação de funções que a revisão por pares busca. Se a equipe passar a ter outro integrante, a revisão do GREEN deve ser feita por ele.

## Status no GitHub Project

| Item | Antes | Agora |
| --- | --- | --- |
| Card #36 | `Backlog` | **`In Progress`** (verificado com `gh project item-list`) |
| WIP | 0 issues em `In Progress` | 1 de 2 (limite de `02-03`) |

Não foi movido para `In Review` nem `Done`: Draft PR é trabalho em andamento. A issue #36 permanece **aberta**, e **não houve merge**.

## Próximas ações

1. **Fase GREEN (Material 05):** implementar `Servico.publicar` no mínimo para o teste passar, na mesma branch e no mesmo PR.
2. **Novos testes RED** para os critérios 2 a 6 da #36 (modelo inválido, Reserva Direta com condições completas, Sob Proposta sem condições, valores inválidos, porta e adaptador em memória).
3. **REFACTOR**, depois `pnpm test`, `pnpm lint` e `pnpm build` verdes (evidências esperadas na #36).
4. Só então tirar o PR de Draft, mover o card para `In Review`, revisar e fazer o merge.
5. Versionar os artefatos `04-*` na branch `docs/planejamento-casos-de-uso` (não no PR #131).
