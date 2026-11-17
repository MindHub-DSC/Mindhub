# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC20 — Abrir Disputa  
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **5 unidades de trabalho**. Cada uma entrega comportamento verificável com seus próprios testes (o teste faz parte da unidade, sem tarefas separadas de RED/GREEN). Os títulos no GitHub usam o prefixo `[UC20-SUB-XX]`.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Modelar a Disputa e seu ciclo provisório | Representar a Disputa `Aberta` com questionamento e evidências preservados. | Agregado, erros de domínio, porta, adaptador em memória e testes. | C6 — domain, repository | POS-01, POS-02; passo 3; RN15; INV-01; `trabalho3.md` §5.1, §8, §11.5. | D-UC20-03, D-UC20-04, D-UC20-05 | A Disputa nasce `ABERTA` com Contratação, autor, papel do autor, questionamento, evidências e instante; demais critérios na SUB-Issue |
| SUB-02 | Definir as portas de verificação das partes e do pertencimento | Permitir que C6 verifique, por visões públicas, as partes da Contratação e o pertencimento de Sessão e Pagamento. | Portas, adaptadores simulados, contratos e testes. | C6 — adapter | Passo 2; FE-01 a FE-03; RN11; `trabalho4.md` §3.6, TC-C6-02. | UC07, UC13, UC10, UC15 | A visão da Contratação informa cliente, especialista e Organização (quando houver); demais critérios na SUB-Issue |
| SUB-03 | Implementar o serviço de aplicação Abrir Disputa | Coordenar a verificação das partes, o registro e o aviso sem alterar os outros contextos. | Serviço de aplicação, porta de notificação, erros de aplicação e testes com dublês. | C6 — application | Passos 2 a 4; FE-01 a FE-03; RN11; TC-C6-02. | SUB-01, SUB-02, D-UC20-06 | Uma parte da Contratação abre a Disputa e recebe a Disputa `ABERTA` com o questionamento preservado; demais critérios na SUB-Issue |
| SUB-04 | Expor o endpoint de abertura de Disputa e verificar a jornada | Disponibilizar a abertura pela API e comprovar a jornada com Contratação real. | DTO, controller, filtro de erros, ligação dos módulos e testes HTTP. | C6 — api, integration | Passo 1; FE-01 a FE-03; D1. | SUB-03, D-UC20-07, D-UC20-08 | A requisição válida responde 201 com a Disputa `ABERTA`; demais critérios na SUB-Issue |
| SUB-05 | Documentar o UC20 e o endpoint | Manter a documentação coerente com o comportamento entregue. | README, `requests.http` e registro de limitações. | C6 —  | Rastreabilidade do planejamento. | SUB-04 | Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais; demais critérios na SUB-Issue |

## Justificativa da decomposição

- **Modelo e verificações separados (SUB-01 e SUB-02).** O Agregado Disputa é independente; as portas de visão protegem a autoridade dos outros contextos (TC-C6-02) e têm contrato próprio.
- **Serviço e HTTP separados (SUB-03 e SUB-04).** O teste de que a abertura não altera nada exige dublês que falhem se chamados, difícil de combinar com o transporte.

**Não foram criadas unidades para:** decidir a Disputa (UC21), prazo para abrir, efeitos sobre repasse, recurso, estados intermediários e autenticação.
