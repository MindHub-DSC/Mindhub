# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC03 — Publicar Serviço  
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **6 unidades de trabalho**. Cada uma entrega comportamento verificável com seus próprios testes (o teste faz parte da unidade, sem tarefas separadas de RED/GREEN). Os títulos no GitHub usam o prefixo `[UC03-SUB-XX]`.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Modelar o Serviço e suas condições vigentes | Representar o Serviço como Agregado de C2, com Modelo de Contratação e, quando Reserva Direta, condições vigentes válidas. | Agregado, objeto de valor, erros de domínio, porta, adaptador em memória e testes de domínio e de contrato. | C2 — domain, repository | Fluxo principal, passos 1, 2 e 4; POS-01 a POS-04; FE-04, FE-05; RN13; `trabalho3.md` §5.1 a §5.3 e §8. | D-UC03-01, D-UC03-02 | O Serviço nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação declarado; demais critérios na SUB-Issue |
| SUB-02 | Persistir o Serviço com TypeORM e migration | Gravar e recuperar Serviços no PostgreSQL com a mesma interface da porta de domínio. | Entidade ORM, mapper, repositório TypeORM, migration reversível e testes de contrato contra o banco. | C2 — repository | FA-01 (1 : 0..*); POS-01; `trabalho3.md` §8; padrão do UC02 [CÓD]. | SUB-01 | A migration cria a tabela de Serviço com referência ao perfil e é reversível; demais critérios na SUB-Issue |
| SUB-03 | Implementar o serviço de aplicação Publicar Serviço | Coordenar o fluxo principal: reconhecer o perfil do ator, aplicar RN01 e registrar o Serviço publicado. | Serviço de aplicação, erros de aplicação e testes com dublês das portas. | C2 — application | Fluxo principal, passos 3 e 4; FA-01; FE-02, FE-03; RN01. | SUB-01, UC02 | Ator com perfil `ATIVO` publica o Serviço e recebe identificador, modelo e situação publicada; demais critérios na SUB-Issue |
| SUB-04 | Proteger a publicação contra suspensão concorrente | Garantir que a publicação posterior à suspensão do perfil seja recusada e a anterior seja preservada (TC-C2-01). | Estratégia de consistência, ajuste do repositório e do serviço e teste de concorrência. | C2 — application, repository | FE-06; RN01; `trabalho4.md` TC-C2-01. | SUB-02, SUB-03, D-UC03-06 | Com publicação e suspensão simultâneas, a publicação posterior à suspensão é recusada; demais critérios na SUB-Issue |
| SUB-05 | Expor o endpoint de publicação de Serviço e traduzir os erros | Disponibilizar o caso de uso pela API HTTP com validação de fronteira e respostas estáveis. | DTO, controller, filtro, ligação no `OfertaModule` e testes HTTP. | C2 — api, integration | Fluxo principal, passos 1 e 5; FE-01 a FE-05; D1. | SUB-03, SUB-04, D-UC03-05, D-UC03-07 | Requisição válida responde 201 com identificador, Modelo de Contratação, condições (quando houver) e situação; demais critérios na SUB-Issue |
| SUB-06 | Documentar o UC03 e o endpoint | Manter a documentação coerente com o comportamento entregue. | README, `requests.http` e registro de limitações e decisões. | C2 —  | Rastreabilidade do planejamento; `casos-de-uso.md` UC03. | SUB-05 | Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais; demais critérios na SUB-Issue |

## Justificativa da decomposição

- **Modelo e persistência separados (SUB-01 e SUB-02).** O domínio precisa de testes rápidos com adaptador em memória; a persistência exige migration e testes contra PostgreSQL, com ritmo e risco diferentes, como no UC02.
- **Concorrência em unidade própria (SUB-04).** FE-06 é o único requisito do UC03 que depende do armazenamento real e da estratégia de consistência (TC-C2-01); isolá-lo evita esconder o risco dentro do serviço.
- **HTTP separado do serviço (SUB-03 e SUB-05).** O serviço é testável sem transporte; o endpoint concentra a tradução de erros e a decisão de D1.

**Não foram criadas unidades para:** editar ou despublicar Serviço (fora do catálogo), busca de Serviços (UC04), visibilidade conforme situação do perfil (D-UC03-04) e autenticação.
