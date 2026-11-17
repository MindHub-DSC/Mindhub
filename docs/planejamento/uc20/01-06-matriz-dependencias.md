# 01-06 — Matriz de dependências

**Caso de uso:** UC20 — Abrir Disputa

| Atividade | Pré-requisito | Justificativa técnica | Condição de desbloqueio | Execução em paralelo |
| --- | --- | --- | --- | --- |
| SUB-01 | D-UC20-03 | Define o ciclo provisório. | Decisão D-UC20-03 registrada em comentário da issue | Sim, com SUB-02 |
| SUB-01 | D-UC20-04 | Define as evidências. | Decisão D-UC20-04 registrada em comentário da issue | Sim, com SUB-02 |
| SUB-01 | D-UC20-05 | Define a cardinalidade. | Decisão D-UC20-05 registrada em comentário da issue | Sim, com SUB-02 |
| SUB-02 | UC07 | Fornece a Contratação. | UC07 concluído e integrado | Sim, com SUB-01 |
| SUB-02 | UC13 | Fornece a Sessão. | UC13 concluído e integrado | Sim, com SUB-01 |
| SUB-02 | UC10 | Fornece o Pagamento. | UC10 concluído e integrado | Sim, com SUB-01 |
| SUB-02 | UC15 | Fornece a visão de vínculos (UC15-SUB-01). | UC15 concluído e integrado | Sim, com SUB-01 |
| SUB-03 | SUB-01 | Usa o Agregado e o repositório. | SUB-01 em `Done` | Não |
| SUB-03 | SUB-02 | Usa as visões. | SUB-02 em `Done` | Não |
| SUB-03 | D-UC20-06 | Define o aviso. | Decisão D-UC20-06 registrada em comentário da issue | Não |
| SUB-04 | SUB-03 | Chama o serviço. | SUB-03 em `Done` | Não |
| SUB-04 | D-UC20-07 | Rota e códigos. | Decisão D-UC20-07 registrada em comentário da issue | Não |
| SUB-04 | D-UC20-08 | Origem do identificador. | Decisão D-UC20-08 registrada em comentário da issue | Não |
| SUB-05 | SUB-04 | Documenta o contrato HTTP final. | SUB-04 em `Done` | Não |

## Caminho crítico

SUB-01 → SUB-03 e SUB-02 → SUB-03 → SUB-04 → SUB-05.

Não há dependências circulares entre as Sub-Issues (verificado na geração por ordenação topológica).
