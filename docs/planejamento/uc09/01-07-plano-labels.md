# 01-07 — Plano de labels

As labels seguem o padrão `categoria:valor` usado nos demais casos de uso. Nenhuma label representa status; o andamento é controlado pelo campo **Status** do GitHub Project.

| Label | Cor | Situação | Finalidade | Issues |
| --- | --- | --- | --- | --- |
| `usecase:uc09` | `#5319e7` | **Nova** | Caso de uso UC09 — Agendar Sessão Contratada | Épico, SUB-01, SUB-02, SUB-03, SUB-04, SUB-05, SUB-06, SUB-07 |
| `domain:agenda` | `#bfd4f2` | Existente | Contexto C4 - Agenda e Atendimento | Épico, SUB-01, SUB-02, SUB-03, SUB-04, SUB-05, SUB-06, SUB-07 |
| `domain:negociacao` | `#fbca04` | Existente | Contexto C3 - Negociação e Contratação | Épico, SUB-01, SUB-02, SUB-03, SUB-04, SUB-05, SUB-06, SUB-07 |
| `type:docs` | `#0075ca` | Existente | Documentação técnica | SUB-07 |
| `type:epic` | `#3e4b9e` | Existente | Issue principal de um caso de uso | Épico |
| `type:feature` | `#a2eeef` | Existente | Implementação de comportamento | SUB-01, SUB-02, SUB-03, SUB-04, SUB-05, SUB-06 |
| `layer:api` | `#fef2c0` | Existente | Interface HTTP | SUB-06 |
| `layer:application` | `#bfdadc` | Existente | Aplicação e contratos públicos | SUB-03, SUB-04, SUB-05 |
| `layer:domain` | `#c5def5` | Existente | Camada de domínio | SUB-01 |
| `layer:integration` | `#e99695` | Existente | Composição de módulos e testes de ponta a ponta | SUB-06 |
| `layer:repository` | `#d4c5f9` | Existente | Persistência e adaptadores de armazenamento | SUB-02 |
| `priority:high` | `#b60205` | Existente | Fornece contratos ou concentra risco | Épico, SUB-01, SUB-02, SUB-03, SUB-04, SUB-05, SUB-06 |
| `priority:low` | `#c2e0c6` | Existente | Não bloqueia o fluxo principal | SUB-07 |

## Observações

- O épico e as Sub-Issues recebem as labels de domínio do contexto responsável (`domain:agenda`, `domain:negociacao`).
- 6 das 7 Sub-Issues têm prioridade alta; documentação tem prioridade baixa e não bloqueia o fluxo principal.
- Labels existentes são reutilizadas com a mesma cor e descrição; se algum caso de uso anterior ainda não tiver sido publicado, a label deve ser criada com os valores acima.
