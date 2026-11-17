# 01-06 — Matriz de dependências

**Caso de uso:** UC04 — Buscar Especialistas e Serviços

| Atividade | Pré-requisito | Justificativa técnica | Condição de desbloqueio | Execução em paralelo |
| --- | --- | --- | --- | --- |
| SUB-01 | D-UC04-05 | Define os campos da visão pública. | Decisão D-UC04-05 registrada em comentário da issue | Não |
| SUB-02 | SUB-01 | Usa o modelo e a porta de consulta. | SUB-01 em `Done` | Sim, com SUB-03 |
| SUB-02 | UC03 | Fornece os Serviços publicados. | UC03 concluído e integrado | Sim, com SUB-03 |
| SUB-02 | D-UC04-01 | Define o filtro de perfis suspensos. | Decisão D-UC04-01 registrada em comentário da issue | Sim, com SUB-03 |
| SUB-02 | D-UC04-02 | Define os critérios existentes. | Decisão D-UC04-02 registrada em comentário da issue | Sim, com SUB-03 |
| SUB-03 | SUB-01 | Implementa a porta e o modelo de leitura. | SUB-01 em `Done` | Sim, com SUB-02 |
| SUB-03 | UC03 | A tabela de Serviço precisa existir. | UC03 concluído e integrado | Sim, com SUB-02 |
| SUB-03 | D-UC04-03 | Define o limite. | Decisão D-UC04-03 registrada em comentário da issue | Sim, com SUB-02 |
| SUB-04 | SUB-02 | Chama o serviço de busca. | SUB-02 em `Done` | Não |
| SUB-04 | SUB-03 | Usa a consulta real no teste de ponta a ponta. | SUB-03 em `Done` | Não |
| SUB-04 | D-UC04-04 | Define se há identificação do chamador. | Decisão D-UC04-04 registrada em comentário da issue | Não |
| SUB-05 | SUB-04 | Documenta o comportamento final. | SUB-04 em `Done` | Não |

## Caminho crítico

SUB-01 → SUB-02 → SUB-03 → SUB-04 → SUB-05.

Não há dependências circulares entre as Sub-Issues (verificado na geração por ordenação topológica).
