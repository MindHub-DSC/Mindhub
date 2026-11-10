# 01-06 — Matriz de dependências

**Caso de uso:** UC13 — Realizar Sessão

| Atividade | Pré-requisito | Justificativa técnica | Condição de desbloqueio | Execução em paralelo |
| --- | --- | --- | --- | --- |
| SUB-01 | D-UC13-06 | Define as Participações iniciais. | Decisão D-UC13-06 registrada em comentário da issue | Sim, com SUB-03 |
| SUB-02 | SUB-01 | Usa o Agregado e o repositório. | SUB-01 em `Done` | Sim, com SUB-03, SUB-04 |
| SUB-02 | UC10 | Fornece a Reserva `CONFIRMADA` (UC10-SUB-06). | UC10 concluído e integrado | Sim, com SUB-03, SUB-04 |
| SUB-02 | D-UC13-02 | Define quando a Sessão é criada. | Decisão D-UC13-02 registrada em comentário da issue | Sim, com SUB-03, SUB-04 |
| SUB-03 | D-UC13-05 | Define o provedor. | Decisão D-UC13-05 registrada em comentário da issue | Sim, com SUB-01, SUB-02 |
| SUB-04 | SUB-01 | Usa o Agregado. | SUB-01 em `Done` | Sim, com SUB-02 |
| SUB-04 | SUB-03 | Obtém o ambiente remoto. | SUB-03 em `Done` | Sim, com SUB-02 |
| SUB-04 | D-UC13-01 | Define como a conclusão é reconhecida. | Decisão D-UC13-01 registrada em comentário da issue | Sim, com SUB-02 |
| SUB-05 | SUB-02 | A Sessão precisa existir. | SUB-02 em `Done` | Não |
| SUB-05 | SUB-04 | Chama os serviços. | SUB-04 em `Done` | Não |
| SUB-05 | D-UC13-07 | Rotas e códigos. | Decisão D-UC13-07 registrada em comentário da issue | Não |
| SUB-05 | D-UC13-08 | Origem do identificador do ator. | Decisão D-UC13-08 registrada em comentário da issue | Não |
| SUB-06 | SUB-05 | Documenta o contrato HTTP final. | SUB-05 em `Done` | Não |

## Caminho crítico

SUB-01 → SUB-02 (com UC10) e SUB-01 + SUB-03 → SUB-04 → SUB-05 → SUB-06.

Não há dependências circulares entre as Sub-Issues (verificado na geração por ordenação topológica).
