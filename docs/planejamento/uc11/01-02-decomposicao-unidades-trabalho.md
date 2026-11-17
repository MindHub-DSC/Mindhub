# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC11 — Reagendar Sessão  
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **5 unidades de trabalho**. Cada uma entrega comportamento verificável com seus próprios testes (o teste faz parte da unidade, sem tarefas separadas de RED/GREEN). Os títulos no GitHub usam o prefixo `[UC11-SUB-XX]`.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Implementar a operação de reagendamento na Reserva | Permitir trocar o intervalo de uma Reserva `CONFIRMADA` preservando sua identidade. | Operação de domínio, erros de domínio e testes. | C4 — domain | Passos 3 e 4; POS-01, POS-02; FE-02, FE-03; INV (intervalo); `trabalho3.md` §10, §11.2. | UC09, UC10 | Reserva `CONFIRMADA` aceita o novo intervalo e continua `CONFIRMADA` com a mesma identidade; demais critérios na SUB-Issue |
| SUB-02 | Trocar o intervalo de forma atômica no repositório | Garantir que verificação e troca do intervalo não possam ser separadas. | Extensão da porta, adaptador em memória, testes de contrato e teste de concorrência. | C4 — repository | Passo 3 e 4; FE-01, FE-05; RN02, RN03, RN14; `trabalho4.md` TC-C4-01. | SUB-01, UC09 | O novo intervalo é aceito só se não se sobrepõe a outra Reserva do especialista, desconsiderado o intervalo atual da própria Reserva; demais critérios na SUB-Issue |
| SUB-03 | Implementar o serviço de aplicação Reagendar Sessão | Coordenar autorização, reagendamento e aviso às duas partes. | Serviço de aplicação, erros de aplicação e testes com dublês. | C4 — application | Passos 2, 3 e 5; FE-01 a FE-04; RN14. | SUB-02, D-UC11-03, D-UC11-04, D-UC11-05 | O cliente ou o especialista da Contratação reagenda a Reserva `CONFIRMADA` para um intervalo livre e recebe a Reserva com o novo intervalo; demais critérios na SUB-Issue |
| SUB-04 | Expor o endpoint de reagendamento e verificar a concorrência | Disponibilizar o reagendamento pela API e comprovar o comportamento sob concorrência. | DTO, controller, filtro de erros e testes HTTP. | C4 — api, integration | Passo 1; FE-01 a FE-05; D1. | SUB-03, D-UC11-06, D-UC11-07 | O reagendamento válido responde 200 com o novo intervalo e a Reserva `CONFIRMADA`; demais critérios na SUB-Issue |
| SUB-05 | Documentar o UC11 e o endpoint | Manter a documentação coerente com o comportamento entregue. | README, `requests.http` e registro de limitações. | C4 —  | Rastreabilidade do planejamento. | SUB-04 | Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais; demais critérios na SUB-Issue |

## Justificativa da decomposição

- **Domínio e repositório separados (SUB-01 e SUB-02).** A regra de que só `CONFIRMADA` reagenda é do Agregado; a troca atômica e a concorrência (TC-C4-01) exigem teste próprio sobre o repositório.
- **Serviço de aplicação (SUB-03).** Concentra a autorização pela Contratação e o aviso, que têm falhas e decisões independentes.

**Não foram criadas unidades para:** concordância da outra parte, limite de reagendamentos, efeito sobre a Sessão, cancelamento e persistência durável.
