# 01-06 — Matriz de dependências

**Caso de uso:** UC09 — Agendar Sessão Contratada

| Atividade | Pré-requisito | Justificativa técnica | Condição de desbloqueio | Execução em paralelo |
| --- | --- | --- | --- | --- |
| SUB-01 | D-UC09-04 | Define o prazo da retenção. | Decisão D-UC09-04 registrada em comentário da issue | Não |
| SUB-01 | D-UC09-06 | Define a comparação dos intervalos. | Decisão D-UC09-06 registrada em comentário da issue | Não |
| SUB-02 | SUB-01 | Usa a Reserva e o Intervalo. | SUB-01 em `Done` | Não |
| SUB-02 | D-UC09-02 | Define o que torna um horário disponível. | Decisão D-UC09-02 registrada em comentário da issue | Não |
| SUB-02 | D-UC09-05 | Define se retenções válidas também bloqueiam. | Decisão D-UC09-05 registrada em comentário da issue | Não |
| SUB-02 | D-UC09-08 | Define a persistência. | Decisão D-UC09-08 registrada em comentário da issue | Não |
| SUB-03 | SUB-01 | Usa o domínio da Reserva. | SUB-01 em `Done` | Sim, com SUB-05 |
| SUB-03 | SUB-02 | Usa o repositório atômico. | SUB-02 em `Done` | Sim, com SUB-05 |
| SUB-03 | D-UC09-01 | Define que a chamada reserva um intervalo. | Decisão D-UC09-01 registrada em comentário da issue | Sim, com SUB-05 |
| SUB-03 | D-UC09-04 | Define o prazo. | Decisão D-UC09-04 registrada em comentário da issue | Sim, com SUB-05 |
| SUB-04 | SUB-03 | Chama o contrato C01. | SUB-03 em `Done` | Sim, com SUB-05 |
| SUB-04 | UC07 | Fornece a Contratação formada e seu repositório. | UC07 concluído e integrado | Sim, com SUB-05 |
| SUB-05 | SUB-01 | Usa `liberarPorExpiracao`. | SUB-01 em `Done` | Sim, com SUB-03, SUB-04 |
| SUB-05 | SUB-02 | Lista as retenções vencidas. | SUB-02 em `Done` | Sim, com SUB-03, SUB-04 |
| SUB-05 | D-UC09-07 | Define o gatilho. | Decisão D-UC09-07 registrada em comentário da issue | Sim, com SUB-03, SUB-04 |
| SUB-06 | SUB-04 | Chama o serviço de C3. | SUB-04 em `Done` | Não |
| SUB-06 | SUB-05 | Liberação por tempo disponível para os testes. | SUB-05 em `Done` | Não |
| SUB-06 | D-UC09-09 | Origem do identificador do Cliente. | Decisão D-UC09-09 registrada em comentário da issue | Não |
| SUB-06 | D-UC09-10 | Rota e códigos. | Decisão D-UC09-10 registrada em comentário da issue | Não |
| SUB-07 | SUB-06 | Documenta o contrato HTTP final. | SUB-06 em `Done` | Não |

## Caminho crítico

SUB-01 → SUB-02 → SUB-03 → SUB-04 → SUB-06 → SUB-07. A SUB-05 corre depois da SUB-02, em paralelo com SUB-03 e SUB-04.

Não há dependências circulares entre as Sub-Issues (verificado na geração por ordenação topológica).
