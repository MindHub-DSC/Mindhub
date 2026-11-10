# 01-07 — Plano de labels

As labels seguem o padrão `categoria:valor`. Nenhuma label representa status; o andamento é controlado exclusivamente pelo campo **Status** do GitHub Project.

| Label | Cor | Finalidade | Issues |
| --- | --- | --- | --- |
| `usecase:uc02` | `#5319e7` | Caso de uso UC02 — Cadastrar Perfil de Especialista | Épico, SUB-01 a SUB-07 |
| `domain:identidade` | `#1d76db` | Contexto C1 — Identidade e Organizações | SUB-01 |
| `domain:oferta` | `#0e8a16` | Contexto C2 — Oferta Profissional | Épico, SUB-02, SUB-03, SUB-04, SUB-05, SUB-07 |
| `type:epic` | `#3e4b9e` | Issue principal de um caso de uso | Épico |
| `type:feature` | `#a2eeef` | Implementação de comportamento | SUB-01 a SUB-05 |
| `type:test` | `#fbca04` | Integração e verificação de ponta a ponta | SUB-06 |
| `type:docs` | `#0075ca` | Documentação técnica | SUB-07 |
| `layer:domain` | `#c5def5` | Camada de domínio | SUB-02 |
| `layer:application` | `#bfdadc` | Camada de aplicação e contratos públicos | SUB-01, SUB-04 |
| `layer:repository` | `#d4c5f9` | Persistência e adaptadores de armazenamento | SUB-03 |
| `layer:api` | `#fef2c0` | Interface HTTP | SUB-05 |
| `layer:integration` | `#e99695` | Composição de módulos e testes de ponta a ponta | SUB-06 |
| `priority:high` | `#b60205` | Fornece contratos ou concentra risco | Épico, SUB-01 a SUB-04 |
| `priority:medium` | `#d93f0b` | Necessária, mas depende de contratos ou decisões | SUB-05, SUB-06 |
| `priority:low` | `#c2e0c6` | Pode avançar sem bloquear outras | SUB-07 |

## Observações

- As labels padrão do GitHub (`documentation`, `enhancement` etc.) são mantidas no repositório, mas não são usadas neste caso de uso, para evitar duplicidade com `type:docs` e `type:feature`.
- A SUB-06 não recebe label `domain:`, porque integra os dois contextos.
