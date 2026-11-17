# 02-03 — Matriz de distribuição das Sub-Issues

**Caso de uso:** UC11 — Reagendar Sessão (épico [#69](https://github.com/MindHub-DSC/Mindhub/issues/69))  
**Equipe:** um integrante (Leonardo Herrero S. Martins, @leohsm), trabalho individual.  
**Data:** 11/11/2026

| Sub-Issue | GitHub | Título | Complexidade | Depende de | Responsável | Revisor | Status atual | Status recomendado | Justificativa |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | [#70](https://github.com/MindHub-DSC/Mindhub/issues/70) | Implementar a operação de reagendamento na Reserva | Média | UC09, UC10 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-02 | [#71](https://github.com/MindHub-DSC/Mindhub/issues/71) | Trocar o intervalo de forma atômica no repositório | Alta | SUB-01, UC09 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-03 | [#72](https://github.com/MindHub-DSC/Mindhub/issues/72) | Implementar o serviço de aplicação Reagendar Sessão | Média | SUB-02, D-UC11-03, D-UC11-04, D-UC11-05 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC11-03 |
| SUB-04 | [#73](https://github.com/MindHub-DSC/Mindhub/issues/73) | Expor o endpoint de reagendamento e verificar a concorrência | Alta | SUB-03, D-UC11-06, D-UC11-07 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC11-07 |
| SUB-05 | [#74](https://github.com/MindHub-DSC/Mindhub/issues/74) | Documentar o UC11 e o endpoint | Baixa | SUB-04 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |

## Critérios aplicados

1. **Segregação de funções:** não é possível, pois a equipe tem um integrante. Responsável e revisor coincidem e isso está declarado em cada linha.
2. **Equilíbrio de carga:** toda a carga é de @leohsm (1 Baixa, 2 Média, 2 Alta). O equilíbrio vem da **ordem** de execução e do limite de WIP de 2 issues em `In Progress`, somando todos os casos de uso.
3. **Dependências:** a ordem está na [matriz de dependências](01-06-matriz-dependencias.md).

*Complexidade:* estimativa da pré-análise, a partir do número de critérios de aceite e da presença de concorrência. É proposta, e a equipe pode ajustá-la.
