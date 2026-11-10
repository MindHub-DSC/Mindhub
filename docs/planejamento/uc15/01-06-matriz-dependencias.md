# 01-06 — Matriz de dependências

**Caso de uso:** UC15 — Indicar Participantes da Sessão

| Atividade | Pré-requisito | Justificativa técnica | Condição de desbloqueio | Execução em paralelo |
| --- | --- | --- | --- | --- |
| SUB-01 | UC17 | Fornece os Vínculos Organizacionais. | UC17 concluído e integrado | Sim, com SUB-02 |
| SUB-02 | UC13 | Fornece a Sessão e a Participação. | UC13 concluído e integrado | Sim, com SUB-01 |
| SUB-02 | D-UC15-01 | Limite de participantes. | Decisão D-UC15-01 registrada em comentário da issue | Sim, com SUB-01 |
| SUB-02 | D-UC15-02 | Papéis. | Decisão D-UC15-02 registrada em comentário da issue | Sim, com SUB-01 |
| SUB-02 | D-UC15-03 | Escopo da indicação. | Decisão D-UC15-03 registrada em comentário da issue | Sim, com SUB-01 |
| SUB-03 | SUB-01 | Usa a visão de vínculos. | SUB-01 em `Done` | Não |
| SUB-03 | SUB-02 | Usa a operação de domínio. | SUB-02 em `Done` | Não |
| SUB-03 | D-UC15-04 | Política da lista. | Decisão D-UC15-04 registrada em comentário da issue | Não |
| SUB-03 | D-UC15-05 | Aviso. | Decisão D-UC15-05 registrada em comentário da issue | Não |
| SUB-04 | SUB-03 | Chama o serviço. | SUB-03 em `Done` | Não |
| SUB-04 | D-UC15-06 | Rota e códigos. | Decisão D-UC15-06 registrada em comentário da issue | Não |
| SUB-05 | SUB-04 | Documenta o contrato HTTP final. | SUB-04 em `Done` | Não |

## Caminho crítico

UC17 → SUB-01 → SUB-03 → SUB-04 → SUB-05; UC13 → SUB-02 → SUB-03.

Não há dependências circulares entre as Sub-Issues (verificado na geração por ordenação topológica).
