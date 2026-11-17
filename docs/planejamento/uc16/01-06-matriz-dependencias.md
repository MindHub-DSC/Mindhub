# 01-06 — Matriz de dependências

**Caso de uso:** UC16 — Registrar Organização

| Atividade | Pré-requisito | Justificativa técnica | Condição de desbloqueio | Execução em paralelo |
| --- | --- | --- | --- | --- |
| SUB-01 | D-UC16-01 | Define os dados da Organização. | Decisão D-UC16-01 registrada em comentário da issue | Não |
| SUB-01 | D-UC16-04 | Define o papel do vínculo. | Decisão D-UC16-04 registrada em comentário da issue | Não |
| SUB-02 | SUB-01 | Persiste o modelo. | SUB-01 em `Done` | Não |
| SUB-02 | UC01 | A tabela de Usuário precisa existir (já implementado). | UC01 concluído e integrado | Não |
| SUB-02 | D-UC16-02 | Define a unicidade. | Decisão D-UC16-02 registrada em comentário da issue | Não |
| SUB-02 | D-UC16-07 | Define a transação. | Decisão D-UC16-07 registrada em comentário da issue | Não |
| SUB-03 | SUB-02 | Usa o repositório transacional. | SUB-02 em `Done` | Não |
| SUB-03 | UC01 | Fornece o reconhecimento de Usuário (já implementado). | UC01 concluído e integrado | Não |
| SUB-04 | SUB-03 | Chama o serviço. | SUB-03 em `Done` | Não |
| SUB-04 | D-UC16-05 | Origem do identificador. | Decisão D-UC16-05 registrada em comentário da issue | Não |
| SUB-04 | D-UC16-06 | Rota e códigos. | Decisão D-UC16-06 registrada em comentário da issue | Não |
| SUB-05 | SUB-04 | Documenta o contrato HTTP final. | SUB-04 em `Done` | Não |

## Caminho crítico

SUB-01 → SUB-02 → SUB-03 → SUB-04 → SUB-05.

Não há dependências circulares entre as Sub-Issues (verificado na geração por ordenação topológica).
