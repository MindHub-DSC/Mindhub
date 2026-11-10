# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC14 — Avaliar Sessão  
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **5 unidades de trabalho**. Cada uma entrega comportamento verificável com seus próprios testes (o teste faz parte da unidade, sem tarefas separadas de RED/GREEN). Os títulos no GitHub usam o prefixo `[UC14-SUB-XX]`.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Modelar a Avaliação | Representar a opinião do cliente sobre uma Sessão, com conteúdo válido e imutável. | Entidade, erros de domínio e testes. | C4 — domain | POS-01; passo 1; `trabalho3.md` §5.1, §8, §10. | D-UC14-01 | A Avaliação referencia a Sessão e o autor (cliente); demais critérios na SUB-Issue |
| SUB-02 | Garantir a unicidade da Avaliação por Sessão no repositório | Impedir duas Avaliações do mesmo cliente para a mesma Sessão, mesmo sob concorrência. | Porta, adaptador em memória, testes de contrato e de concorrência. | C4 — repository | POS-02; FE-03, FE-04; RN10; `trabalho4.md` TC-C4-02; `trabalho3.md` §8. | SUB-01 | A segunda Avaliação do mesmo cliente para a Sessão é recusada; demais critérios na SUB-Issue |
| SUB-03 | Implementar o serviço de aplicação Avaliar Sessão | Coordenar a elegibilidade (RN09), o registro atômico (RN10) e a resposta ao cliente. | Serviço de aplicação, erros de aplicação e testes com dublês. | C4 — application | Passos 2 a 4; PRE-01; FE-01 a FE-03; RN09, RN10. | SUB-01, SUB-02, UC13 | O cliente da Sessão `CONCLUIDA` avalia e recebe a Avaliação; demais critérios na SUB-Issue |
| SUB-04 | Expor o endpoint de avaliação e verificar a concorrência | Disponibilizar a avaliação pela API e comprovar a unicidade sob concorrência. | DTO, controller, filtro de erros e testes HTTP. | C4 — api, integration | Passos 1 e 4; FE-02, FE-04; D1. | SUB-03, D-UC14-05, D-UC14-06 | A requisição válida responde 201 com a Avaliação; demais critérios na SUB-Issue |
| SUB-05 | Documentar o UC14 e o endpoint | Manter a documentação coerente com o comportamento entregue. | README, `requests.http` e registro de limitações. | C4 —  | Rastreabilidade do planejamento. | SUB-04 | Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais; demais critérios na SUB-Issue |

## Justificativa da decomposição

- **Unicidade em unidade própria (SUB-02).** RN10 sob concorrência (TC-C4-02) é o risco do caso de uso e se verifica no repositório, independente da elegibilidade.
- **Modelo separado do serviço (SUB-01 e SUB-03).** O conteúdo da Avaliação depende de D-UC14-01; separá-lo limita o impacto se a decisão mudar.

**Não foram criadas unidades para:** resposta do especialista, reputação agregada, edição, prazo de avaliação e avaliação organizacional.
