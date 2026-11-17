# 01-06 — Matriz de dependências

**Caso de uso:** UC19 — Reativar Perfil de Especialista

| Atividade | Pré-requisito | Justificativa técnica | Condição de desbloqueio | Execução em paralelo |
| --- | --- | --- | --- | --- |
| SUB-01 | UC18 | Fornece a situação `SUSPENSO` e o mecanismo de versão da situação. | UC18 concluído e integrado | Não |
| SUB-01 | D-UC19-02 | Confirma a exigência de justificativa. | Decisão D-UC19-02 registrada em comentário da issue | Não |
| SUB-02 | SUB-01 | Usa a operação de reativação. | SUB-01 em `Done` | Não |
| SUB-02 | UC18 | Fornece o registro administrativo e a verificação do Administrador. | UC18 concluído e integrado | Não |
| SUB-02 | D-UC19-03 | Define o aviso. | Decisão D-UC19-03 registrada em comentário da issue | Não |
| SUB-03 | SUB-02 | Chama o serviço de aplicação. | SUB-02 em `Done` | Sim, com SUB-04 |
| SUB-03 | UC03 | Operação cuja aceitação é verificada. | UC03 concluído e integrado | Sim, com SUB-04 |
| SUB-04 | UC18 | Fornece o registro administrativo. | UC18 concluído e integrado | Sim, com SUB-03 |
| SUB-04 | SUB-02 | Fornece o segundo tipo de ação. | SUB-02 em `Done` | Sim, com SUB-03 |
| SUB-05 | SUB-03 | Documenta o comportamento final. | SUB-03 em `Done` | Não |
| SUB-05 | SUB-04 | Documenta a consulta de rastreabilidade. | SUB-04 em `Done` | Não |

## Caminho crítico

UC18 → SUB-01 → SUB-02 → SUB-03 → SUB-05 (SUB-04 em paralelo à SUB-03).

Não há dependências circulares entre as Sub-Issues (verificado na geração por ordenação topológica).
