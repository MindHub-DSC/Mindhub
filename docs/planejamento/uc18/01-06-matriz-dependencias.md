# 01-06 — Matriz de dependências

**Caso de uso:** UC18 — Suspender Perfil de Especialista

| Atividade | Pré-requisito | Justificativa técnica | Condição de desbloqueio | Execução em paralelo |
| --- | --- | --- | --- | --- |
| SUB-01 | UC02 | Fornece o Perfil de Especialista e a situação (já implementado). | UC02 concluído e integrado | Sim, com SUB-02 |
| SUB-02 | D-UC18-02 | Define a relação de consistência com a suspensão. | Decisão D-UC18-02 registrada em comentário da issue | Sim, com SUB-01 |
| SUB-03 | SUB-01 | Usa a operação de suspensão. | SUB-01 em `Done` | Não |
| SUB-03 | SUB-02 | Usa o registro administrativo. | SUB-02 em `Done` | Não |
| SUB-03 | D-UC18-01 | Define como reconhecer o Administrador. | Decisão D-UC18-01 registrada em comentário da issue | Não |
| SUB-03 | D-UC18-05 | Define o aviso. | Decisão D-UC18-05 registrada em comentário da issue | Não |
| SUB-04 | SUB-03 | Chama o serviço de aplicação. | SUB-03 em `Done` | Não |
| SUB-04 | UC03 | Operação cuja recusa é verificada. | UC03 concluído e integrado | Não |
| SUB-04 | UC05 | Operação cuja recusa é verificada. | UC05 concluído e integrado | Não |
| SUB-05 | SUB-04 | Documenta o comportamento final. | SUB-04 em `Done` | Não |

## Caminho crítico

SUB-01 e SUB-02 (em paralelo) → SUB-03 → SUB-04 → SUB-05.

Não há dependências circulares entre as Sub-Issues (verificado na geração por ordenação topológica).
