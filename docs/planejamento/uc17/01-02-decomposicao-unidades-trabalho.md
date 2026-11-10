# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC17 — Vincular Membro à Organização  
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **5 unidades de trabalho**. Cada uma entrega comportamento verificável com seus próprios testes (o teste faz parte da unidade, sem tarefas separadas de RED/GREEN). Os títulos no GitHub usam o prefixo `[UC17-SUB-XX]`.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Estender o Vínculo Organizacional com papéis de membro | Permitir registrar vínculos de membros com papel, mantendo a invariante do Vínculo. | Extensão do domínio, objeto de valor, erros de domínio e testes. | C1 — domain | Passo 4; POS-01; INV-01; `trabalho3.md` §6.1, §8, §10. | UC16, D-UC17-01 | O Vínculo de membro relaciona exatamente um Usuário e uma Organização, com um papel válido; demais critérios na SUB-Issue |
| SUB-02 | Verificar o vínculo do Representante no instante da operação | Garantir que o vínculo do Representante seja lido e o novo vínculo registrado na mesma unidade de consistência. | Extensão da porta, adaptadores, migration (se houver restrição) e testes de contrato e de concorrência. | C1 — repository | Passo 2 e 4; FE-03; RN11; `trabalho4.md` TC-C1-01. | SUB-01, D-UC17-03 | O repositório indica se o Representante tem vínculo compatível com a Organização; demais critérios na SUB-Issue |
| SUB-03 | Implementar o serviço de aplicação Vincular Membro | Coordenar a verificação do Representante, o reconhecimento do membro, o registro e o aviso. | Serviço de aplicação, porta de notificação, erros de aplicação e testes com dublês. | C1 — application | Passos 2 a 5; PRE-01, PRE-02; FE-01 a FE-04; RN11. | SUB-02, UC01, D-UC17-02, D-UC17-05 | O Representante com vínculo compatível vincula o Usuário com um papel e recebe o vínculo; demais critérios na SUB-Issue |
| SUB-04 | Expor o endpoint de vínculo e verificar a jornada | Disponibilizar o vínculo pela API e comprovar a jornada UC16 → UC17. | DTO, controller, filtro de erros e testes HTTP. | C1 — api, integration | Passos 1 e 5; FE-01 a FE-03; D1. | SUB-03, D-UC17-06, D-UC17-07 | A requisição válida responde 201 com o vínculo; demais critérios na SUB-Issue |
| SUB-05 | Documentar o UC17 e o endpoint | Manter a documentação coerente com o comportamento entregue. | README, `requests.http` e registro de limitações. | C1 —  | Rastreabilidade do planejamento. | SUB-04 | Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais; demais critérios na SUB-Issue |

## Justificativa da decomposição

- **Verificação no instante (SUB-02).** TC-C1-01 exige que a revogação concorrente seja respeitada; isolá-la permite testar a consistência no repositório.
- **Papéis no domínio (SUB-01).** A lista de papéis é dúvida documentada; limitá-la ao domínio reduz o impacto da decisão.

**Não foram criadas unidades para:** revogar vínculo, aceite do vínculo pelo membro, edição de papéis e autenticação.
