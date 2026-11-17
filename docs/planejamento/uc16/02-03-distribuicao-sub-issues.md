# 02-03 — Matriz de distribuição das Sub-Issues

**Caso de uso:** UC16 — Registrar Organização (épico [#94](https://github.com/MindHub-DSC/Mindhub/issues/94))  
**Equipe:** um integrante (Leonardo Herrero S. Martins, @leohsm), trabalho individual.  
**Data:** 11/11/2026

| Sub-Issue | GitHub | Título | Complexidade | Depende de | Responsável | Revisor | Status atual | Status recomendado | Justificativa |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | [#95](https://github.com/MindHub-DSC/Mindhub/issues/95) | Modelar a Organização e o Vínculo Organizacional | Média | D-UC16-01, D-UC16-04 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC16-01, D-UC16-04 |
| SUB-02 | [#96](https://github.com/MindHub-DSC/Mindhub/issues/96) | Persistir Organização e Vínculo na mesma transação | Média | SUB-01, UC01, D-UC16-02, D-UC16-07 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC16-02 |
| SUB-03 | [#97](https://github.com/MindHub-DSC/Mindhub/issues/97) | Implementar o serviço de aplicação Registrar Organização | Média | SUB-02, UC01 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-04 | [#98](https://github.com/MindHub-DSC/Mindhub/issues/98) | Expor o endpoint de registro de Organização | Média | SUB-03, D-UC16-05, D-UC16-06 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC16-05 |
| SUB-05 | [#99](https://github.com/MindHub-DSC/Mindhub/issues/99) | Documentar o UC16 e o endpoint | Baixa | SUB-04 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |

## Critérios aplicados

1. **Segregação de funções:** não é possível, pois a equipe tem um integrante. Responsável e revisor coincidem e isso está declarado em cada linha.
2. **Equilíbrio de carga:** toda a carga é de @leohsm (1 Baixa, 4 Média, 0 Alta). O equilíbrio vem da **ordem** de execução e do limite de WIP de 2 issues em `In Progress`, somando todos os casos de uso.
3. **Dependências:** a ordem está na [matriz de dependências](01-06-matriz-dependencias.md).

*Complexidade:* estimativa da pré-análise, a partir do número de critérios de aceite e da presença de concorrência. É proposta, e a equipe pode ajustá-la.
