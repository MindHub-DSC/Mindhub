# 01-06 — Matriz de dependências

**Caso de uso:** UC17 — Vincular Membro à Organização

| Atividade | Pré-requisito | Justificativa técnica | Condição de desbloqueio | Execução em paralelo |
| --- | --- | --- | --- | --- |
| SUB-01 | UC16 | Fornece o Vínculo e a Organização. | UC16 concluído e integrado | Não |
| SUB-01 | D-UC17-01 | Define os papéis. | Decisão D-UC17-01 registrada em comentário da issue | Não |
| SUB-02 | SUB-01 | Persiste o Vínculo de membro. | SUB-01 em `Done` | Não |
| SUB-02 | D-UC17-03 | Define a duplicidade. | Decisão D-UC17-03 registrada em comentário da issue | Não |
| SUB-03 | SUB-02 | Usa a verificação e o registro. | SUB-02 em `Done` | Não |
| SUB-03 | UC01 | Fornece o reconhecimento de Usuário (já implementado). | UC01 concluído e integrado | Não |
| SUB-03 | D-UC17-02 | Define se há aceite. | Decisão D-UC17-02 registrada em comentário da issue | Não |
| SUB-03 | D-UC17-05 | Define o aviso. | Decisão D-UC17-05 registrada em comentário da issue | Não |
| SUB-04 | SUB-03 | Chama o serviço. | SUB-03 em `Done` | Não |
| SUB-04 | D-UC17-06 | Rota e códigos. | Decisão D-UC17-06 registrada em comentário da issue | Não |
| SUB-04 | D-UC17-07 | Origem do identificador. | Decisão D-UC17-07 registrada em comentário da issue | Não |
| SUB-05 | SUB-04 | Documenta o contrato HTTP final. | SUB-04 em `Done` | Não |

## Caminho crítico

UC16 → SUB-01 → SUB-02 → SUB-03 → SUB-04 → SUB-05.

Não há dependências circulares entre as Sub-Issues (verificado na geração por ordenação topológica).
