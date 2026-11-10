# 01-06 — Matriz de dependências

**Caso de uso:** UC03 — Publicar Serviço

| Atividade | Pré-requisito | Justificativa técnica | Condição de desbloqueio | Execução em paralelo |
| --- | --- | --- | --- | --- |
| SUB-01 | D-UC03-01 | Define os atributos do Agregado. | Decisão D-UC03-01 registrada em comentário da issue | Não |
| SUB-01 | D-UC03-02 | Define os campos obrigatórios das condições vigentes. | Decisão D-UC03-02 registrada em comentário da issue | Não |
| SUB-02 | SUB-01 | Implementa a porta e o modelo definidos na SUB-01. | SUB-01 em `Done` | Sim, com SUB-03 |
| SUB-03 | SUB-01 | Usa o Agregado e a porta. | SUB-01 em `Done` | Sim, com SUB-02 |
| SUB-03 | UC02 | Fornece o Perfil de Especialista e sua situação (já implementado). | UC02 concluído e integrado | Sim, com SUB-02 |
| SUB-04 | SUB-02 | Exige o repositório durável para controlar a concorrência. | SUB-02 em `Done` | Não |
| SUB-04 | SUB-03 | Aplica a regra RN01 já implementada. | SUB-03 em `Done` | Não |
| SUB-04 | D-UC03-06 | Define a técnica de consistência. | Decisão D-UC03-06 registrada em comentário da issue | Não |
| SUB-05 | SUB-03 | Chama o serviço de aplicação. | SUB-03 em `Done` | Não |
| SUB-05 | SUB-04 | Expõe o comportamento já protegido contra concorrência. | SUB-04 em `Done` | Não |
| SUB-05 | D-UC03-05 | Origem do identificador do ator. | Decisão D-UC03-05 registrada em comentário da issue | Não |
| SUB-05 | D-UC03-07 | Rota e códigos de erro. | Decisão D-UC03-07 registrada em comentário da issue | Não |
| SUB-06 | SUB-05 | Documenta o comportamento final. | SUB-05 em `Done` | Não |

## Caminho crítico

SUB-01 → SUB-02 → SUB-04 → SUB-05 → SUB-06. A SUB-03 corre depois da SUB-01 e antes da SUB-04.

Não há dependências circulares entre as Sub-Issues (verificado na geração por ordenação topológica).
