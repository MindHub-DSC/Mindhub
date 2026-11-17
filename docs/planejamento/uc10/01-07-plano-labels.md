# 01-07 — Plano de labels

As labels seguem o padrão `categoria:valor` usado nos demais casos de uso. Nenhuma label representa status; o andamento é controlado pelo campo **Status** do GitHub Project.

| Label | Cor | Situação | Finalidade | Issues |
| --- | --- | --- | --- | --- |
| `usecase:uc10` | `#5319e7` | **Nova** | Caso de uso UC10 — Pagar Reserva | Épico, SUB-01 a SUB-08 |
| `domain:pagamentos` | `#006b75` | **Nova** | Contexto C5 — Pagamentos | Épico, SUB-01, SUB-02, SUB-04, SUB-05, SUB-07, SUB-08 |
| `domain:agenda` | `#bfd4f2` | **Nova** | Contexto C4 — Agenda e Atendimento | Épico, SUB-03, SUB-06, SUB-07 |
| `type:epic` | `#3e4b9e` | Existente | Issue principal de um caso de uso | Épico |
| `type:feature` | `#a2eeef` | Existente | Implementação de comportamento | SUB-01 a SUB-07 |
| `type:docs` | `#0075ca` | Existente | Documentação técnica | SUB-08 |
| `layer:domain` | `#c5def5` | Existente | Camada de domínio | SUB-01, SUB-06 |
| `layer:repository` | `#d4c5f9` | Existente | Persistência e adaptadores de armazenamento | SUB-01, SUB-03 |
| `layer:adapter` | `#f9d0c4` | Nova no UC05 | Portas e adaptadores de sistemas externos | SUB-02 |
| `layer:application` | `#bfdadc` | Existente | Aplicação e contratos públicos | SUB-03 a SUB-06 |
| `layer:api` | `#fef2c0` | Existente | Interface HTTP | SUB-07 |
| `layer:integration` | `#e99695` | Existente | Composição de módulos e testes de ponta a ponta | SUB-07 |
| `priority:high` | `#b60205` | Existente | Fornece contratos ou concentra risco | Épico, SUB-01 a SUB-06 |
| `priority:medium` | `#d93f0b` | Existente | Necessária, mas depende de contratos ou decisões | SUB-07 |
| `priority:low` | `#c2e0c6` | Existente | Não bloqueia o fluxo principal | SUB-08 |

## Observações

- O épico recebe `domain:pagamentos` e `domain:agenda`, porque o caso de uso pertence a C5 e o efeito é aplicado por C4.
- `layer:adapter` é criada na execução do UC05. Se o UC10 for publicado antes, a label deve ser criada com a mesma cor e descrição.
- Seis das oito Sub-Issues têm prioridade alta: o UC10 concentra o maior risco técnico do MVP (integração externa assíncrona, `trabalho5.md` §9.2).
