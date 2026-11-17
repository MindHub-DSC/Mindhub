# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC16 — Registrar Organização  
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **5 unidades de trabalho**. Cada uma entrega comportamento verificável com seus próprios testes (o teste faz parte da unidade, sem tarefas separadas de RED/GREEN). Os títulos no GitHub usam o prefixo `[UC16-SUB-XX]`.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Modelar a Organização e o Vínculo Organizacional | Representar a Organização e o vínculo do representante, sem Organização sem representante. | Agregado, entidade, erros de domínio e testes. | C1 — domain | POS-01, POS-02; passo 3; INV-01; RN11; `trabalho3.md` §5.1, §6.1, §10. | D-UC16-01, D-UC16-04 | A Organização nasce com identidade própria e dados conforme D-UC16-01; demais critérios na SUB-Issue |
| SUB-02 | Persistir Organização e Vínculo na mesma transação | Gravar Organização e vínculo do representante como uma só operação. | Entidades ORM, mappers, repositórios, migration e testes de contrato. | C1 — repository | Passo 3; FE-03; garantia mínima; padrão do UC01 [CÓD]. | SUB-01, UC01, D-UC16-02, D-UC16-07 | A migration cria as tabelas de Organização e de Vínculo, com chaves para Usuário e Organização, e é reversível; demais critérios na SUB-Issue |
| SUB-03 | Implementar o serviço de aplicação Registrar Organização | Coordenar o reconhecimento do Usuário e o registro de Organização e vínculo. | Serviço de aplicação, erros de aplicação e testes com dublês. | C1 — application | Passos 2 a 4; PRE-01; FE-02, FE-03; RN11. | SUB-02, UC01 | O Usuário cadastrado registra a Organização e recebe a Organização com identificador e dados; demais critérios na SUB-Issue |
| SUB-04 | Expor o endpoint de registro de Organização | Disponibilizar o registro pela API com validação de fronteira. | DTO, controller, filtro de erros, ligação no `IdentidadeModule` e testes HTTP. | C1 — api, integration | Passos 1 e 4; FE-01 a FE-03; D1. | SUB-03, D-UC16-05, D-UC16-06 | A requisição válida responde 201 com a Organização; demais critérios na SUB-Issue |
| SUB-05 | Documentar o UC16 e o endpoint | Manter a documentação coerente com o comportamento entregue. | README, `requests.http` e registro de limitações. | C1 —  | Rastreabilidade do planejamento. | SUB-04 | Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais; demais critérios na SUB-Issue |

## Justificativa da decomposição

- **Modelo e persistência separados (SUB-01 e SUB-02).** A regra de não existir Organização sem representante é do domínio; a transação única e a migration têm risco e teste próprios.
- **Serviço e HTTP separados (SUB-03 e SUB-04).** O serviço é verificável sem transporte; o endpoint concentra a tradução de erros e a decisão de D1.

**Não foram criadas unidades para:** verificação de representação, unicidade, edição ou exclusão de Organização, inclusão de membros (UC17) e autenticação.
