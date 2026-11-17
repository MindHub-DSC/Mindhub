# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC09 — Agendar Sessão Contratada  
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **7 unidades de trabalho**. Cada uma entrega comportamento verificável com seus próprios testes (o teste faz parte da unidade, sem tarefas separadas de RED/GREEN). Os títulos no GitHub usam o prefixo `[UC09-SUB-XX]`.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Modelar a Reserva, o Intervalo de Tempo e o ciclo da retenção | Representar a Reserva `Retida` com intervalo, prazo, valor esperado e a liberação por expiração. | Objeto de valor, Agregado, erros de domínio e testes de domínio. | C4 — domain | POS-01, POS-02; passos 4 e 5; RN02, RN08; INV-01; `trabalho3.md` §5.1, §10, §11.2; `trabalho4.md` §8.1.2, §8.1.4. | D-UC09-04, D-UC09-06 | A Reserva nasce `RETIDA` com identidade, Contratação, especialista, cliente, intervalo, duração contratada, valor esperado, identificação da operação e limite de validade; demais critérios na SUB-Issue |
| SUB-02 | Registrar a retenção de forma atômica e idempotente no repositório | Garantir que a verificação de disponibilidade e a gravação não possam ser separadas e que a repetição não crie outra Reserva. | Porta, adaptador em memória, testes de contrato e teste de concorrência. | C4 — repository | POS-03; passo 5; FA-01; FE-03, FE-05; RN03; `trabalho4.md` §8.1.4, TC-C4-01. | SUB-01, D-UC09-02, D-UC09-05, D-UC09-08 | Duas retenções simultâneas para intervalos incompatíveis do mesmo especialista: apenas uma é registrada (TC-C4-01); demais critérios na SUB-Issue |
| SUB-03 | Implementar o contrato C01 (porta pública de retenção de horário) | Disponibilizar a C3 uma única operação pública que valida, retém e informa a Reserva, com as recusas documentadas. | Interface pública, serviço de aplicação, tipos de resposta, configuração do prazo e testes com o repositório em memória. | C4 — application | Passos 3 a 5; FA-01, FA-02; FE-01 a FE-04; RN02, RN03; `trabalho4.md` §8.1. | SUB-01, SUB-02, D-UC09-01, D-UC09-04 | Retenção válida devolve a Reserva `RETIDA`, o intervalo e o limite de validade; demais critérios na SUB-Issue |
| SUB-04 | Implementar o serviço de C3 Agendar Sessão Contratada | Reconhecer a Contratação e o ator em C3 e chamar o contrato C01 com os dados corretos. | Serviço de aplicação, erros de aplicação e testes com dublê da porta de C4. | C3 — application | Passos 2, 3 e 6; PRE-01; FA-01; FE-04, FE-06; RN11 (cliente individual). | SUB-03, UC07 | A chamada a C01 leva identificação da operação, Contratação, condições aceitas, especialista, cliente, intervalo, duração contratada e valor esperado; demais critérios na SUB-Issue |
| SUB-05 | Liberar a retenção expirada por tempo | Aplicar RN08 por tempo: a retenção vencida libera o horário sem ação do usuário. | Serviço, gatilho, relógio injetável e testes. | C4 — application | FE-07; RN08; `trabalho5.md` §4.2; `trabalho4.md` §8.1.4. | SUB-01, SUB-02, D-UC09-07 | Reserva `RETIDA` vencida é liberada pela política de domínio, sem ação do usuário; demais critérios na SUB-Issue |
| SUB-06 | Expor o endpoint de agendamento e verificar a concorrência de ponta a ponta | Disponibilizar o caso de uso pela API e comprovar o comportamento sob concorrência e repetição. | DTO, controller, filtro de erros, ligação dos módulos e testes HTTP. | C3 — api, integration | Passos 1 e 6; FE-02, FE-04 a FE-06; D1. | SUB-04, SUB-05, D-UC09-09, D-UC09-10 | A requisição válida responde 201 com a Reserva, o intervalo e o limite de validade; demais critérios na SUB-Issue |
| SUB-07 | Documentar o UC09 e o endpoint | Manter a documentação coerente com o comportamento entregue. | README, `requests.http` e registro de limitações. | C4 —  | Rastreabilidade do planejamento. | SUB-06 | Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais; demais critérios na SUB-Issue |

## Justificativa da decomposição

- **Domínio e repositório separados (SUB-01 e SUB-02).** A atomicidade entre disponibilidade e gravação (T4 §8.1.4) é o maior risco do caso de uso e merece teste de concorrência próprio, independente das regras do Agregado.
- **Contrato C01 em unidade própria (SUB-03).** É a fronteira entre C3 e C4 compartilhada com o UC08 e o UC10; precisa de resposta tipada e de recusas estáveis.
- **Serviço de C3 separado (SUB-04).** A autoria e a montagem da chamada pertencem a C3; manter essa responsabilidade fora de C4 preserva a fronteira dos contextos.
- **Expiração em unidade própria (SUB-05).** É política de domínio disparada por tempo, com gatilho e relógio próprios, e bloqueia o UC10.

**Não foram criadas unidades para:** pagamento e confirmação (UC10), reagendamento (UC11), cancelamento (UC12), pacotes, disponibilidade do especialista e persistência durável.
