# 02-03 — Matriz de distribuição das Sub-Issues

**Caso de uso:** UC09 — Agendar Sessão Contratada (épico [#61](https://github.com/MindHub-DSC/Mindhub/issues/61))  
**Equipe:** um integrante (Leonardo Herrero S. Martins, @leohsm), trabalho individual.  
**Data:** 11/11/2026

| Sub-Issue | GitHub | Título | Complexidade | Depende de | Responsável | Revisor | Status atual | Status recomendado | Justificativa |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | [#62](https://github.com/MindHub-DSC/Mindhub/issues/62) | Modelar a Reserva, o Intervalo de Tempo e o ciclo da retenção | Média | D-UC09-04, D-UC09-06 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC09-04 |
| SUB-02 | [#63](https://github.com/MindHub-DSC/Mindhub/issues/63) | Registrar a retenção de forma atômica e idempotente no repositório | Alta | SUB-01, D-UC09-02, D-UC09-05, D-UC09-08 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC09-02, D-UC09-05 |
| SUB-03 | [#64](https://github.com/MindHub-DSC/Mindhub/issues/64) | Implementar o contrato C01 (porta pública de retenção de horário) | Alta | SUB-01, SUB-02, D-UC09-01, D-UC09-04 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC09-01, D-UC09-04 |
| SUB-04 | [#65](https://github.com/MindHub-DSC/Mindhub/issues/65) | Implementar o serviço de C3 Agendar Sessão Contratada | Média | SUB-03, UC07 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-05 | [#66](https://github.com/MindHub-DSC/Mindhub/issues/66) | Liberar a retenção expirada por tempo | Média | SUB-01, SUB-02, D-UC09-07 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-06 | [#67](https://github.com/MindHub-DSC/Mindhub/issues/67) | Expor o endpoint de agendamento e verificar a concorrência de ponta a ponta | Alta | SUB-04, SUB-05, D-UC09-09, D-UC09-10 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC09-09 |
| SUB-07 | [#68](https://github.com/MindHub-DSC/Mindhub/issues/68) | Documentar o UC09 e o endpoint | Baixa | SUB-06 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |

## Critérios aplicados

1. **Segregação de funções:** não é possível, pois a equipe tem um integrante. Responsável e revisor coincidem e isso está declarado em cada linha.
2. **Equilíbrio de carga:** toda a carga é de @leohsm (1 Baixa, 3 Média, 3 Alta). O equilíbrio vem da **ordem** de execução e do limite de WIP de 2 issues em `In Progress`, somando todos os casos de uso.
3. **Dependências:** a ordem está na [matriz de dependências](01-06-matriz-dependencias.md).

*Complexidade:* estimativa da pré-análise, a partir do número de critérios de aceite e da presença de concorrência. É proposta, e a equipe pode ajustá-la.
