# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC04 — Buscar Especialistas e Serviços  
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **5 unidades de trabalho**. Cada uma entrega comportamento verificável com seus próprios testes (o teste faz parte da unidade, sem tarefas separadas de RED/GREEN). Os títulos no GitHub usam o prefixo `[UC04-SUB-XX]`.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Definir o modelo de leitura público da oferta | Fixar a visão pública que a busca devolve, sem dados privados. | Modelo de leitura, porta de consulta e adaptador em memória. | C2 — domain, application | Fluxo principal, passos 3 e 4; POS-01; `trabalho4.md` §6.1. | D-UC04-05 | A visão pública contém especialista, especialidades, Serviços e Modelo de Contratação; demais critérios na SUB-Issue |
| SUB-02 | Implementar a seleção de especialistas habilitados e Serviços publicados | Aplicar o critério de busca e o filtro de elegibilidade sobre a oferta vigente. | Serviço de consulta, regra de seleção e testes com dublês. | C2 — application | Fluxo principal, passo 2; FA-01, FA-02; RN01 (proposta). | SUB-01, UC03, D-UC04-01, D-UC04-02 | Busca sem critério devolve a listagem simples da oferta vigente; demais critérios na SUB-Issue |
| SUB-03 | Implementar a consulta da oferta no armazenamento | Executar a consulta de leitura no PostgreSQL com a mesma interface da porta. | Consulta TypeORM, índices necessários (se houver) e testes de contrato contra o banco. | C2 — repository | Passo 2; FA-01; POS-02. | SUB-01, UC03, D-UC04-03 | Os testes de contrato da porta passam nos adaptadores em memória e TypeORM; demais critérios na SUB-Issue |
| SUB-04 | Expor o endpoint de busca e traduzir os erros | Disponibilizar a busca pela API HTTP com validação de fronteira. | DTO, controller, ligação no `OfertaModule` e testes HTTP. | C2 — api, integration | Fluxo principal, passo 1; FA-01, FA-02; FE-01. | SUB-02, SUB-03, D-UC04-04 | Requisição sem critério responde 200 com a listagem simples; demais critérios na SUB-Issue |
| SUB-05 | Documentar o UC04 e o endpoint | Manter a documentação coerente com o comportamento entregue. | README, `requests.http` e registro de limitações. | C2 —  | Rastreabilidade do planejamento. | SUB-04 | Os exemplos do `requests.http` são executáveis e cobrem busca com e sem critério; demais critérios na SUB-Issue |

## Justificativa da decomposição

- **Modelo de leitura separado da seleção (SUB-01 e SUB-02).** A visão pública protege dados privados (T4 §6.1) e é consumida por UC05 e UC08; a seleção contém as regras de elegibilidade e de critério.
- **Consulta no armazenamento isolada (SUB-03).** A junção e o filtro dependem do banco; o contrato é verificado nos dois adaptadores.
- **Caso de uso somente de leitura:** não há Agregado, concorrência nem fato publicado; por isso o conjunto fica no mínimo de cinco unidades.

**Não foram criadas unidades para:** ordenação, ranking, recomendação inteligente, paginação avançada e cache de resultados.
