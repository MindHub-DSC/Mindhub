# 01-06 — Matriz de dependências

**Caso de uso:** UC08 — Contratar Serviço de Reserva Direta

| Atividade | Pré-requisito | Justificativa técnica | Condição de desbloqueio | Execução em paralelo |
| --- | --- | --- | --- | --- |
| SUB-01 | UC03 | Fornece o Serviço publicado e seu repositório. | UC03 concluído e integrado | Sim, com SUB-02 |
| SUB-02 | UC07 | Fornece o modelo de Contratação (UC07-SUB-02) e seu repositório. | UC07 concluído e integrado | Sim, com SUB-01 |
| SUB-03 | SUB-01 | Usa a visão do Serviço. | SUB-01 em `Done` | Não |
| SUB-03 | SUB-02 | Forma a Contratação. | SUB-02 em `Done` | Não |
| SUB-03 | UC09 | Implementa o lado da Agenda do contrato C01. | UC09 concluído e integrado | Não |
| SUB-03 | D-UC08-06 | Define a política de FE-06. | Decisão D-UC08-06 registrada em comentário da issue | Não |
| SUB-03 | D-UC08-07 | Define a identificação da operação. | Decisão D-UC08-07 registrada em comentário da issue | Não |
| SUB-04 | SUB-03 | Chama o serviço de aplicação. | SUB-03 em `Done` | Não |
| SUB-04 | UC09 | Reserva real nos testes de ponta a ponta. | UC09 concluído e integrado | Não |
| SUB-04 | D-UC08-08 | Origem do identificador do Cliente. | Decisão D-UC08-08 registrada em comentário da issue | Não |
| SUB-04 | D-UC08-09 | Rota e códigos. | Decisão D-UC08-09 registrada em comentário da issue | Não |
| SUB-05 | SUB-04 | Documenta o contrato HTTP final. | SUB-04 em `Done` | Não |

## Caminho crítico

UC03 → SUB-01 → SUB-03 → SUB-04 → SUB-05; UC07 → SUB-02 → SUB-03; UC09 → SUB-03.

Não há dependências circulares entre as Sub-Issues (verificado na geração por ordenação topológica).
