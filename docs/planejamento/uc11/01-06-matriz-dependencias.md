# 01-06 — Matriz de dependências

**Caso de uso:** UC11 — Reagendar Sessão

| Atividade | Pré-requisito | Justificativa técnica | Condição de desbloqueio | Execução em paralelo |
| --- | --- | --- | --- | --- |
| SUB-01 | UC09 | Fornece o Agregado Reserva. | UC09 concluído e integrado | Não |
| SUB-01 | UC10 | Fornece a situação `CONFIRMADA`. | UC10 concluído e integrado | Não |
| SUB-02 | SUB-01 | Usa a operação de domínio. | SUB-01 em `Done` | Não |
| SUB-02 | UC09 | Estende o repositório atômico. | UC09 concluído e integrado | Não |
| SUB-03 | SUB-02 | Usa a troca atômica. | SUB-02 em `Done` | Não |
| SUB-03 | D-UC11-03 | Define o efeito sobre a Sessão. | Decisão D-UC11-03 registrada em comentário da issue | Não |
| SUB-03 | D-UC11-04 | Define a autorização. | Decisão D-UC11-04 registrada em comentário da issue | Não |
| SUB-03 | D-UC11-05 | Define o aviso. | Decisão D-UC11-05 registrada em comentário da issue | Não |
| SUB-04 | SUB-03 | Chama o serviço de aplicação. | SUB-03 em `Done` | Não |
| SUB-04 | D-UC11-06 | Rota e códigos. | Decisão D-UC11-06 registrada em comentário da issue | Não |
| SUB-04 | D-UC11-07 | Origem do identificador do ator. | Decisão D-UC11-07 registrada em comentário da issue | Não |
| SUB-05 | SUB-04 | Documenta o contrato HTTP final. | SUB-04 em `Done` | Não |

## Caminho crítico

SUB-01 → SUB-02 → SUB-03 → SUB-04 → SUB-05.

Não há dependências circulares entre as Sub-Issues (verificado na geração por ordenação topológica).
