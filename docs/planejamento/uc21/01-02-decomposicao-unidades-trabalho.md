# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC21 — Decidir Disputa  
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **6 unidades de trabalho**. Cada uma entrega comportamento verificável com seus próprios testes (o teste faz parte da unidade, sem tarefas separadas de RED/GREEN). Os títulos no GitHub usam o prefixo `[UC21-SUB-XX]`.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Estender a Disputa com o ciclo de decisão | Registrar a decisão de forma imutável e conduzir a Disputa por seus estados provisórios. | Extensão do Agregado, entidade Decisão, erros de domínio e testes. | C6 — domain | Passo 2; POS-01, POS-03; FA-01, FA-02; RN15; `trabalho3.md` §11.5. | UC20, D-UC21-01 | A decisão é registrada com autor, fundamento, referência à Disputa e instante, e não pode ser alterada; demais critérios na SUB-Issue |
| SUB-02 | Registrar as ações decorrentes separadamente da decisão | Guardar a solicitação e o resultado de cada ação, com idempotência por decisão. | Entidade, porta, adaptador em memória e testes de contrato. | C6 — domain, repository | Passo 4; POS-02; FE-01, FE-02; `trabalho4.md` TC-C6-01. | SUB-01 | A solicitação de cada ação é registrada com decisão, tipo e instante; demais critérios na SUB-Issue |
| SUB-03 | Definir as portas de comandos dos contextos e o adaptador da suspensão | Solicitar ações aos contextos proprietários por comandos públicos, sem alterá-los diretamente. | Porta, adaptador do UC18, tradução de respostas e testes. | C6 — adapter | Passo 3; FE-01, FE-02; INV-01; `trabalho4.md` §3.6, TC-C6-01. | UC18, D-UC21-02 | O comando de suspensão é solicitado pelo serviço público de C2 e nunca por acesso direto ao perfil; demais critérios na SUB-Issue |
| SUB-04 | Implementar o serviço de aplicação Decidir Disputa | Coordenar a verificação do Administrador, a decisão, as ações e o aviso às partes. | Três serviços de aplicação, erros de aplicação e testes com dublês. | C6 — application | Passos 1 a 5; FA-01, FA-02; FE-01 a FE-03; RN15. | SUB-01, SUB-02, SUB-03, D-UC21-04, D-UC21-05 | O Administrador decide a Disputa aberta e a decisão fica registrada com autor e fundamento; a Disputa fica `RESOLVIDA`; demais critérios na SUB-Issue |
| SUB-05 | Expor os endpoints de decisão e verificar a jornada | Disponibilizar decidir, pedir informações e cancelar pela API e comprovar a jornada UC20 → UC21 → UC18. | DTOs, controllers, filtro de erros, ligação dos módulos e testes HTTP. | C6 — api, integration | Passos 1 a 5; FA-01, FA-02; FE-01 a FE-03. | SUB-04, D-UC21-06 | A decisão responde 200 com a Disputa `RESOLVIDA` e as ações registradas; demais critérios na SUB-Issue |
| SUB-06 | Documentar o UC21 e o endpoint | Manter a documentação coerente com o comportamento entregue. | README, `requests.http` e registro de limitações. | C6 —  | Rastreabilidade do planejamento. | SUB-05 | Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais; demais critérios na SUB-Issue |

## Justificativa da decomposição

- **Decisão e ações em unidades distintas (SUB-01 e SUB-02).** TC-C6-01 exige que a decisão permaneça registrada ainda que a ação seja recusada; modelá-las juntas esconderia essa independência.
- **Portas de comando separadas (SUB-03).** São a fronteira de autoridade com C2 (e futuramente C3 a C5); a recusa por mudança de estado tem comportamento próprio.
- **Serviço único para os três fluxos (SUB-04).** Compartilham o reconhecimento do Administrador e as portas; o fluxo principal e os alternativos usam as mesmas transições.

**Não foram criadas unidades para:** estorno, compensação e demais ações financeiras, recurso, estado `Encerrada`, autenticação e relatórios.
