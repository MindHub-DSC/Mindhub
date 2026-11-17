# 02-03 — Matriz de distribuição das Sub-Issues

**Caso de uso:** UC08 — Contratar Serviço de Reserva Direta (épico [#55](https://github.com/MindHub-DSC/Mindhub/issues/55))  
**Equipe:** um integrante (Leonardo Herrero S. Martins, @leohsm), trabalho individual.  
**Data:** 11/11/2026

| Sub-Issue | GitHub | Título | Complexidade | Depende de | Responsável | Revisor | Status atual | Status recomendado | Justificativa |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | [#56](https://github.com/MindHub-DSC/Mindhub/issues/56) | Expor a visão pública do Serviço e suas condições vigentes | Baixa | UC03 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-02 | [#57](https://github.com/MindHub-DSC/Mindhub/issues/57) | Estender a Contratação com origem Reserva Direta e snapshot das condições | Média | UC07 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-03 | [#58](https://github.com/MindHub-DSC/Mindhub/issues/58) | Implementar o serviço de aplicação Contratar Reserva Direta | Alta | SUB-01, SUB-02, UC09, D-UC08-06, D-UC08-07 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-04 | [#59](https://github.com/MindHub-DSC/Mindhub/issues/59) | Expor o endpoint de contratação e verificar a jornada de ponta a ponta | Média | SUB-03, UC09, D-UC08-08, D-UC08-09 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC08-08 |
| SUB-05 | [#60](https://github.com/MindHub-DSC/Mindhub/issues/60) | Documentar o UC08 e o endpoint | Baixa | SUB-04 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |

## Critérios aplicados

1. **Segregação de funções:** não é possível, pois a equipe tem um integrante. Responsável e revisor coincidem e isso está declarado em cada linha.
2. **Equilíbrio de carga:** toda a carga é de @leohsm (2 Baixa, 2 Média, 1 Alta). O equilíbrio vem da **ordem** de execução e do limite de WIP de 2 issues em `In Progress`, somando todos os casos de uso.
3. **Dependências:** a ordem está na [matriz de dependências](01-06-matriz-dependencias.md).

*Complexidade:* estimativa da pré-análise, a partir do número de critérios de aceite e da presença de concorrência. É proposta, e a equipe pode ajustá-la.
