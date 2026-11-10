# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC13 — Realizar Sessão  
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **6 unidades de trabalho**. Cada uma entrega comportamento verificável com seus próprios testes (o teste faz parte da unidade, sem tarefas separadas de RED/GREEN). Os títulos no GitHub usam o prefixo `[UC13-SUB-XX]`.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Modelar a Sessão, a Participação e o ciclo de vida | Representar a Sessão e seu ciclo, com Participação mínima e uma Sessão por Reserva. | Agregado, entidade, erros de domínio, porta, adaptador em memória e testes. | C4 — domain, repository | POS-01, POS-02; passos 2 e 3; FE-01, FE-04; invariantes de T3 §10 e §8. | D-UC13-06 | A Sessão nasce `PROGRAMADA`, pertence a uma Contratação e deriva de uma Reserva; demais critérios na SUB-Issue |
| SUB-02 | Criar a Sessão `Programada` a partir da Reserva confirmada | Garantir que cada Reserva confirmada gere exatamente uma Sessão com suas Participações. | Consumidor, idempotência, testes com dublês e integração com a confirmação do UC10. | C4 — application | PRE-01; passo 1 (origem da Sessão); `trabalho3.md` §7; D-UC13-02. | SUB-01, UC10, D-UC13-02 | Reserva `CONFIRMADA` gera uma Sessão `PROGRAMADA` com as Participações do cliente e do especialista; demais critérios na SUB-Issue |
| SUB-03 | Definir a porta do Serviço de videoconferência e o adaptador simulado | Isolar o Serviço de videoconferência e tolerar sua indisponibilidade. | Porta, adaptador simulado, erro de aplicação e testes. | C4 — adapter | Passo 1; FE-03; `trabalho5.md` §2.2, §4.2. | D-UC13-05 | A porta obtém o ambiente remoto de uma Sessão e o devolve ao chamador; demais critérios na SUB-Issue |
| SUB-04 | Implementar o serviço de aplicação Iniciar e Concluir Sessão | Coordenar autoria, ambiente remoto, transições e aviso ao cliente. | Dois serviços de aplicação, erros de aplicação e testes com dublês. | C4 — application | Passos 1 a 4; FE-01 a FE-04; RN09. | SUB-01, SUB-03, D-UC13-01 | O especialista da Contratação inicia a Sessão `PROGRAMADA` e recebe a Sessão `EM_ANDAMENTO` com o ambiente remoto; demais critérios na SUB-Issue |
| SUB-05 | Expor os endpoints de início e conclusão e verificar a jornada | Disponibilizar o caso de uso pela API e comprovar a jornada da Reserva confirmada à Sessão concluída. | DTOs, controllers, filtro de erros, ligação dos módulos e testes HTTP. | C4 — api, integration | Passos 1 a 4; FE-01 a FE-04; D1. | SUB-02, SUB-04, D-UC13-07, D-UC13-08 | O início responde 200 com a Sessão `EM_ANDAMENTO` e o ambiente remoto; a conclusão responde 200 com a Sessão `CONCLUIDA`; demais critérios na SUB-Issue |
| SUB-06 | Documentar o UC13 e o endpoint | Manter a documentação coerente com o comportamento entregue. | README, `requests.http` e registro de limitações. | C4 —  | Rastreabilidade do planejamento. | SUB-05 | Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais; demais critérios na SUB-Issue |

## Justificativa da decomposição

- **Sessão e criação separadas (SUB-01 e SUB-02).** O Agregado é independente do UC10; a criação reage ao fato de confirmação e tem a decisão aberta D-UC13-02, com risco próprio de duplicação.
- **Videoconferência isolada (SUB-03).** É dependência externa; sua falha tem comportamento próprio (FE-03), testado sem o domínio.
- **Iniciar e concluir juntos (SUB-04).** Compartilham a autoria e as portas; o ciclo é curto e a decisão D-UC13-01 afeta só a conclusão.

**Não foram criadas unidades para:** cancelar Sessão, indicar participantes (UC15), no-show, atraso, anotações, metas, entregas, provedor real e persistência durável.
