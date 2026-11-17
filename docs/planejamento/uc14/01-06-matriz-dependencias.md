# 01-06 — Matriz de dependências

**Caso de uso:** UC14 — Avaliar Sessão

| Atividade | Pré-requisito | Justificativa técnica | Condição de desbloqueio | Execução em paralelo |
| --- | --- | --- | --- | --- |
| SUB-01 | D-UC14-01 | Define o conteúdo. | Decisão D-UC14-01 registrada em comentário da issue | Não |
| SUB-02 | SUB-01 | Usa a entidade Avaliação. | SUB-01 em `Done` | Não |
| SUB-03 | SUB-01 | Usa a Avaliação. | SUB-01 em `Done` | Não |
| SUB-03 | SUB-02 | Usa a unicidade atômica. | SUB-02 em `Done` | Não |
| SUB-03 | UC13 | Fornece a Sessão e sua situação. | UC13 concluído e integrado | Não |
| SUB-04 | SUB-03 | Chama o serviço. | SUB-03 em `Done` | Não |
| SUB-04 | D-UC14-05 | Rota e códigos. | Decisão D-UC14-05 registrada em comentário da issue | Não |
| SUB-04 | D-UC14-06 | Origem do identificador do cliente. | Decisão D-UC14-06 registrada em comentário da issue | Não |
| SUB-05 | SUB-04 | Documenta o contrato HTTP final. | SUB-04 em `Done` | Não |

## Caminho crítico

SUB-01 → SUB-02 → SUB-03 → SUB-04 → SUB-05.

Não há dependências circulares entre as Sub-Issues (verificado na geração por ordenação topológica).
