# 02-07 — Plano de atualização do GitHub

Legenda: ✅ executado em 10/11/2026 · ⏳ pendente.

| Passo | Ação | Situação |
| --- | --- | --- |
| 1 | **Conferir a integridade:** épico #1 e Sub-Issues #2 a #8 existem e estão vinculados como sub-issues nativas | ✅ |
| 2 | **Atualizar os assignees:** @leohsm em todas as issues | ✅ |
| 3 | **Registrar os revisores:** revisor designado (@leohsm, autorrevisão) declarado em cada comentário de pré-análise | ✅ |
| 4 | **Publicar os comentários de revisão** do [02-05](02-05-comentarios-github.md) em cada Sub-Issue | ✅ |
| 5 | **Ajustar as descrições** apontadas no [02-04](02-04-revisao-cruzada.md): #3, #4, #5 e #7 | ✅ |
| 6 | **Registrar a revisão humana** em cada Sub-Issue com o template do 02-05 | ⏳ Depende de @leohsm |
| 7 | **Registrar a decisão D1** na #6 | ⏳ Depende de @leohsm |
| 8 | **Criar o GitHub Project** `Planejamento - Mindhub UC02` com o campo Status contendo exatamente `Backlog`, `Ready`, `In Progress`, `In Review` e `Done` | ⏳ Depende do escopo `project` no GitHub CLI (`gh auth refresh -s project`) |
| 9 | **Adicionar o épico e as Sub-Issues ao Project** em `Backlog` | ⏳ Depende do passo 8 |
| 10 | **Mover para `Ready`** somente as issues com os 7 critérios da DoR atendidos (após o passo 6: #2, #3, #4, #5 e #8) | ⏳ Depende dos passos 6 e 9 |
| 11 | **Auditar o board:** colunas corretas, nenhuma issue em `In Progress`, `In Review` ou `Done` sem trabalho real | ⏳ |

## Regras de governança

- O fluxo é sempre `Backlog → Ready → In Progress → In Review → Done`.
- Nenhuma label de status (`status:ready`, `status:blocked` etc.) é criada; o estado fica só no campo Status do Project.
- Impedimentos e decisões são registrados em comentários nas issues afetadas, não em colunas novas.
