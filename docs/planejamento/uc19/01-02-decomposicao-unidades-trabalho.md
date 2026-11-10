# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC19 — Reativar Perfil de Especialista  
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **5 unidades de trabalho**. Cada uma entrega comportamento verificável com seus próprios testes (o teste faz parte da unidade, sem tarefas separadas de RED/GREEN). Os títulos no GitHub usam o prefixo `[UC19-SUB-XX]`.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Implementar a transição de reativação no Perfil de Especialista | Permitir que C2 devolva o perfil de `SUSPENSO` a `ATIVO` sem alterar identidade nem histórico. | Operação de domínio, erro de domínio, persistência e testes. | C2 — domain, repository | Passo 3; POS-01, POS-03; FE-02; RN01; `trabalho3.md` §9, §11. | UC18, D-UC19-02 | Perfil `SUSPENSO` passa a `ATIVO`, mantendo identidade, Usuário e data de criação; demais critérios na SUB-Issue |
| SUB-02 | Implementar o serviço de aplicação Reativar Perfil e o registro da ação | Coordenar verificação do ator, reativação, registro e aviso. | Serviço de aplicação, novo tipo de ação administrativa, erros e testes com dublês. | C2 — application | Fluxo principal, passos 2 a 5; FE-01 a FE-03; RN15. | SUB-01, UC18, D-UC19-03 | Administrador reativa perfil `SUSPENSO` com justificativa e recebe o perfil `ATIVO`; demais critérios na SUB-Issue |
| SUB-03 | Expor o endpoint de reativação e provar o efeito de RN01 | Disponibilizar a reativação pela API e verificar que o perfil volta a operar. | DTO, controller, filtro de erros e testes HTTP e de integração. | C2 — api, integration | Passo 1; FE-01, FE-03; RN01. | SUB-02, UC03 | Requisição válida responde 200 com o perfil `ATIVO`; demais critérios na SUB-Issue |
| SUB-04 | Garantir a rastreabilidade do ciclo suspensão-reativação | Comprovar que cada ciclo de suspensão e reativação fica registrado em ordem, sem lacunas. | Consulta de leitura das ações de um perfil e teste de encadeamento. | C6 — domain, application | POS-02; RN15; `trabalho3.md` §9. | UC18, SUB-02 | As ações de um perfil são devolvidas em ordem cronológica com tipo, autor, justificativa e instante; demais critérios na SUB-Issue |
| SUB-05 | Documentar o UC19 e o endpoint | Manter a documentação coerente com o comportamento entregue. | README, `requests.http` e registro de limitações. | C2 —  | Rastreabilidade do planejamento. | SUB-03, SUB-04 | Os exemplos do `requests.http` são executáveis e cobrem sucesso e recusas principais; demais critérios na SUB-Issue |

## Justificativa da decomposição

- **Mesmo desenho do UC18, sem duplicar o registro.** O registro administrativo é entregue no UC18; aqui só entram a transição, o serviço e o endpoint.
- **Rastreabilidade em unidade própria (SUB-04).** RN15 exige que o ciclo completo fique registrado; a consulta mínima torna o comportamento verificável sem criar regras de limite.
- **Cinco unidades:** o caso de uso é pequeno; não foi criada unidade para validações isoladas, que ficam em cada serviço.

**Não foram criadas unidades para:** limite de suspensões e reativações, prazo mínimo de suspensão, relatórios administrativos e autenticação.
