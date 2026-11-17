# 01-06 — Matriz de dependências

**Caso de uso:** UC21 — Decidir Disputa

| Atividade | Pré-requisito | Justificativa técnica | Condição de desbloqueio | Execução em paralelo |
| --- | --- | --- | --- | --- |
| SUB-01 | UC20 | Fornece o Agregado Disputa. | UC20 concluído e integrado | Sim, com SUB-03 |
| SUB-01 | D-UC21-01 | Define os estados provisórios. | Decisão D-UC21-01 registrada em comentário da issue | Sim, com SUB-03 |
| SUB-02 | SUB-01 | Referencia a Decisão. | SUB-01 em `Done` | Sim, com SUB-03 |
| SUB-03 | UC18 | Fornece o comando de suspensão. | UC18 concluído e integrado | Sim, com SUB-01, SUB-02 |
| SUB-03 | D-UC21-02 | Define as ações possíveis. | Decisão D-UC21-02 registrada em comentário da issue | Sim, com SUB-01, SUB-02 |
| SUB-04 | SUB-01 | Usa a decisão e o ciclo. | SUB-01 em `Done` | Não |
| SUB-04 | SUB-02 | Registra as ações. | SUB-02 em `Done` | Não |
| SUB-04 | SUB-03 | Solicita as ações. | SUB-03 em `Done` | Não |
| SUB-04 | D-UC21-04 | Define o reconhecimento do Administrador. | Decisão D-UC21-04 registrada em comentário da issue | Não |
| SUB-04 | D-UC21-05 | Define as evidências. | Decisão D-UC21-05 registrada em comentário da issue | Não |
| SUB-05 | SUB-04 | Chama os serviços. | SUB-04 em `Done` | Não |
| SUB-05 | D-UC21-06 | Rotas e códigos. | Decisão D-UC21-06 registrada em comentário da issue | Não |
| SUB-06 | SUB-05 | Documenta o contrato HTTP final. | SUB-05 em `Done` | Não |

## Caminho crítico

UC20 → SUB-01 → SUB-02 → SUB-04 → SUB-05 → SUB-06; UC18 → SUB-03 → SUB-04.

Não há dependências circulares entre as Sub-Issues (verificado na geração por ordenação topológica).
