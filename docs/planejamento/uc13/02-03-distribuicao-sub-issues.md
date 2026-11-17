# 02-03 — Matriz de distribuição das Sub-Issues

**Caso de uso:** UC13 — Realizar Sessão (épico [#75](https://github.com/MindHub-DSC/Mindhub/issues/75))  
**Equipe:** um integrante (Leonardo Herrero S. Martins, @leohsm), trabalho individual.  
**Data:** 11/11/2026

| Sub-Issue | GitHub | Título | Complexidade | Depende de | Responsável | Revisor | Status atual | Status recomendado | Justificativa |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | [#76](https://github.com/MindHub-DSC/Mindhub/issues/76) | Modelar a Sessão, a Participação e o ciclo de vida | Alta | D-UC13-06 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-02 | [#77](https://github.com/MindHub-DSC/Mindhub/issues/77) | Criar a Sessão `Programada` a partir da Reserva confirmada | Baixa | SUB-01, UC10, D-UC13-02 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC13-02 |
| SUB-03 | [#78](https://github.com/MindHub-DSC/Mindhub/issues/78) | Definir a porta do Serviço de videoconferência e o adaptador simulado | Baixa | D-UC13-05 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-04 | [#79](https://github.com/MindHub-DSC/Mindhub/issues/79) | Implementar o serviço de aplicação Iniciar e Concluir Sessão | Alta | SUB-01, SUB-03, D-UC13-01 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC13-01 |
| SUB-05 | [#80](https://github.com/MindHub-DSC/Mindhub/issues/80) | Expor os endpoints de início e conclusão e verificar a jornada | Média | SUB-02, SUB-04, D-UC13-07, D-UC13-08 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC13-08 |
| SUB-06 | [#81](https://github.com/MindHub-DSC/Mindhub/issues/81) | Documentar o UC13 e o endpoint | Baixa | SUB-05 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |

## Critérios aplicados

1. **Segregação de funções:** não é possível, pois a equipe tem um integrante. Responsável e revisor coincidem e isso está declarado em cada linha.
2. **Equilíbrio de carga:** toda a carga é de @leohsm (3 Baixa, 1 Média, 2 Alta). O equilíbrio vem da **ordem** de execução e do limite de WIP de 2 issues em `In Progress`, somando todos os casos de uso.
3. **Dependências:** a ordem está na [matriz de dependências](01-06-matriz-dependencias.md).

*Complexidade:* estimativa da pré-análise, a partir do número de critérios de aceite e da presença de concorrência. É proposta, e a equipe pode ajustá-la.
