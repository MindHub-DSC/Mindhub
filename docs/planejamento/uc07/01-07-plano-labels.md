# 01-07 — Plano de labels

As labels seguem o padrão `categoria:valor` usado no UC02 e no UC05. Nenhuma label representa status; o andamento é controlado pelo campo **Status** do GitHub Project.

| Label | Cor | Situação | Finalidade | Issues |
| --- | --- | --- | --- | --- |
| `usecase:uc07` | `#5319e7` | **Nova** | Caso de uso UC07 — Aceitar Proposta | Épico, SUB-01 a SUB-06 |
| `domain:negociacao` | `#fbca04` | Nova no UC05 | Contexto C3 — Negociação e Contratação | Épico, SUB-01 a SUB-06 |
| `type:epic` | `#3e4b9e` | Existente | Issue principal de um caso de uso | Épico |
| `type:feature` | `#a2eeef` | Existente | Implementação de comportamento | SUB-01 a SUB-05 |
| `type:docs` | `#0075ca` | Existente | Documentação técnica | SUB-06 |
| `layer:domain` | `#c5def5` | Existente | Camada de domínio | SUB-01, SUB-02 |
| `layer:repository` | `#d4c5f9` | Existente | Persistência e adaptadores de armazenamento | SUB-03 |
| `layer:application` | `#bfdadc` | Existente | Aplicação e contratos públicos | SUB-04 |
| `layer:api` | `#fef2c0` | Existente | Interface HTTP | SUB-05 |
| `layer:integration` | `#e99695` | Existente | Composição de módulos e testes de ponta a ponta | SUB-05 |
| `priority:high` | `#b60205` | Existente | Fornece contratos ou concentra risco | Épico, SUB-01 a SUB-04 |
| `priority:medium` | `#d93f0b` | Existente | Necessária, mas depende de contratos ou decisões | SUB-05 |
| `priority:low` | `#c2e0c6` | Existente | Não bloqueia o fluxo principal | SUB-06 |

## Observações

- Todo o UC07 pertence a C3; por isso só `domain:negociacao` é usada.
- `domain:negociacao` é criada na execução do UC05. Se o UC07 for publicado antes, a label deve ser criada com a mesma cor e descrição.
- A SUB-03 tem prioridade alta, apesar de ser de persistência, porque concentra o risco do caso de uso (TC-C3-01).
