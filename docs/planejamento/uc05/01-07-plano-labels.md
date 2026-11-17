# 01-07 — Plano de labels

As labels seguem o padrão `categoria:valor` já usado no UC02. Nenhuma label representa status; o andamento é controlado pelo campo **Status** do GitHub Project. Labels já existentes no repositório são reutilizadas.

| Label | Cor | Situação | Finalidade | Issues |
| --- | --- | --- | --- | --- |
| `usecase:uc05` | `#5319e7` | **Nova** | Caso de uso UC05 — Enviar Solicitação de Atendimento | Épico, SUB-01 a SUB-07 |
| `domain:oferta` | `#0e8a16` | Existente | Contexto C2 — Oferta Profissional | SUB-01, SUB-06 |
| `domain:negociacao` | `#fbca04` | **Nova** | Contexto C3 — Negociação e Contratação | Épico, SUB-02 a SUB-07 |
| `type:epic` | `#3e4b9e` | Existente | Issue principal de um caso de uso | Épico |
| `type:feature` | `#a2eeef` | Existente | Implementação de comportamento | SUB-01 a SUB-06 |
| `type:docs` | `#0075ca` | Existente | Documentação técnica | SUB-07 |
| `layer:domain` | `#c5def5` | Existente | Camada de domínio | SUB-02 |
| `layer:application` | `#bfdadc` | Existente | Aplicação e contratos públicos | SUB-01, SUB-04, SUB-06 |
| `layer:repository` | `#d4c5f9` | Existente | Persistência e adaptadores de armazenamento | SUB-02 |
| `layer:adapter` | `#f9d0c4` | **Nova** | Portas e adaptadores de sistemas externos (notificações, provedor de pagamento) | SUB-03 |
| `layer:api` | `#fef2c0` | Existente | Interface HTTP | SUB-05, SUB-06 |
| `layer:integration` | `#e99695` | Existente | Composição de módulos e testes de ponta a ponta | SUB-05 |
| `priority:high` | `#b60205` | Existente | Fornece contratos ou está no caminho crítico | Épico, SUB-01, SUB-02, SUB-04 |
| `priority:medium` | `#d93f0b` | Existente | Necessária, mas depende de contratos ou decisões | SUB-03, SUB-05 |
| `priority:low` | `#c2e0c6` | Existente | Não bloqueia o fluxo principal | SUB-06, SUB-07 |

## Observações

- A SUB-06 recebe `domain:oferta` e `domain:negociacao`, porque cria a visão do Serviço em C2 e a regra de RN13 em C3.
- A SUB-06 tem prioridade baixa por estar bloqueada externamente (UC03) e cobrir um passo opcional, não por ter pouca importância.
- `layer:adapter` também será usada pelo UC10 (provedor de pagamento).
