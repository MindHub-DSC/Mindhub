# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC18 — Suspender Perfil de Especialista  
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **5 unidades de trabalho**. Cada uma entrega comportamento verificável com seus próprios testes (o teste faz parte da unidade, sem tarefas separadas de RED/GREEN). Os títulos no GitHub usam o prefixo `[UC18-SUB-XX]`.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Implementar a transição de suspensão no Perfil de Especialista | Permitir que C2 mude o perfil de `ATIVO` para `SUSPENSO` preservando identidade e histórico. | Operação de domínio, erro de domínio, persistência da situação, controle de versão e testes. | C2 — domain, repository | Passo 3; POS-01, POS-03, POS-04; FE-02, FE-04; RN01; `trabalho3.md` §9, §11. | UC02 | Perfil `ATIVO` passa a `SUSPENSO`, mantendo identidade, Usuário e data de criação; demais critérios na SUB-Issue |
| SUB-02 | Registrar a ação administrativa em C6 | Guardar autor, justificativa e instante de cada ação administrativa, de forma reutilizável por UC19 e UC21. | Entidade de registro, porta, adaptadores, migration e testes de contrato. | C6 — domain, repository | Passo 4; POS-02; FE-01, FE-05; RN15; `trabalho4.md` §3.6. | D-UC18-02 | O registro guarda autor, justificativa, instante e perfil alvo e não pode ser alterado depois de gravado; demais critérios na SUB-Issue |
| SUB-03 | Implementar o serviço de aplicação Suspender Perfil | Coordenar verificação do ator, suspensão, registro e aviso. | Serviço de aplicação, porta de notificação, erros de aplicação e testes com dublês. | C2 — application | Fluxo principal, passos 2 a 5; FE-01 a FE-03; RN15. | SUB-01, SUB-02, D-UC18-01, D-UC18-05 | Administrador suspende perfil `ATIVO` com justificativa e recebe o perfil `SUSPENSO`; demais critérios na SUB-Issue |
| SUB-04 | Expor o endpoint de suspensão e provar a concorrência com publicação | Disponibilizar a suspensão pela API e verificar o efeito de RN01 nos demais casos de uso. | DTO, controller, filtro de erros, ligação nos módulos e testes HTTP e de integração. | C2 — api, integration | Passo 1; FE-01, FE-03, FE-04; RN01; TC-C2-01. | SUB-03, UC03, UC05 | Requisição válida responde 200 com o perfil `SUSPENSO`; demais critérios na SUB-Issue |
| SUB-05 | Documentar o UC18 e o endpoint | Manter a documentação coerente com o comportamento entregue. | README, `requests.http` e registro de limitações. | C2 —  | Rastreabilidade do planejamento. | SUB-04 | Os exemplos do `requests.http` são executáveis e cobrem sucesso e recusas principais; demais critérios na SUB-Issue |

## Justificativa da decomposição

- **C2 e C6 em unidades separadas (SUB-01 e SUB-02).** C2 decide a situação do perfil e C6 apenas registra (T4 §3.6). Juntar as duas esconderia a fronteira entre os contextos.
- **Registro reutilizável.** O mesmo registro de ação administrativa atende ao UC19 e ao UC21; criá-lo aqui evita duplicação e mantém a rastreabilidade (RN15) em um ponto único.
- **Serviço de aplicação à parte (SUB-03).** Concentra a verificação do ator, a consistência entre perfil e registro e o aviso opcional, que têm falhas e decisões distintas.

**Não foram criadas unidades para:** reativação (UC19), decisão de disputa (UC21), consulta de ações administrativas, entrega real de notificações e autenticação.
