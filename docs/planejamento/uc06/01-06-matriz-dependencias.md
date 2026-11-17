# 01-06 — Matriz de dependências

**Caso de uso:** UC06 — Enviar Proposta

| Atividade | Pré-requisito | Justificativa técnica | Condição de desbloqueio | Execução em paralelo |
| --- | --- | --- | --- | --- |
| SUB-01 | D-UC06-02 | Define os campos obrigatórios. | Decisão D-UC06-02 registrada em comentário da issue | Sim, com SUB-03 |
| SUB-02 | SUB-01 | Cada Versão carrega Condições Comerciais. | SUB-01 em `Done` | Sim, com SUB-03 |
| SUB-02 | D-UC06-01 | Define quem leva a Proposta a `Em revisão`. | Decisão D-UC06-01 registrada em comentário da issue | Sim, com SUB-03 |
| SUB-02 | D-UC06-03 | Define a identificação da versão. | Decisão D-UC06-03 registrada em comentário da issue | Sim, com SUB-03 |
| SUB-02 | D-UC06-04 | Define o estado inicial. | Decisão D-UC06-04 registrada em comentário da issue | Sim, com SUB-03 |
| SUB-03 | UC05 | Fornece a Solicitação e seu repositório. | UC05 concluído e integrado | Sim, com SUB-01, SUB-02 |
| SUB-04 | SUB-02 | Usa o Agregado e a porta. | SUB-02 em `Done` | Não |
| SUB-04 | SUB-03 | Lê a Solicitação do especialista. | SUB-03 em `Done` | Não |
| SUB-04 | UC05 | Reaproveita a porta de aviso (UC05-SUB-03). | UC05 concluído e integrado | Não |
| SUB-05 | SUB-04 | Chama os serviços de aplicação. | SUB-04 em `Done` | Não |
| SUB-05 | D-UC06-08 | Rotas e códigos. | Decisão D-UC06-08 registrada em comentário da issue | Não |
| SUB-05 | D-UC06-09 | Origem do identificador do ator. | Decisão D-UC06-09 registrada em comentário da issue | Não |
| SUB-06 | SUB-05 | Documenta o contrato HTTP final. | SUB-05 em `Done` | Não |

## Caminho crítico

SUB-01 → SUB-02 → SUB-04 → SUB-05 → SUB-06. A SUB-03 corre em paralelo com SUB-01 e SUB-02 e precisa estar pronta antes da SUB-04.

Não há dependências circulares entre as Sub-Issues (verificado na geração por ordenação topológica).
