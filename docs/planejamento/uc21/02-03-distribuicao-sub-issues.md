# 02-03 — Matriz de distribuição das Sub-Issues

**Caso de uso:** UC21 — Decidir Disputa (épico [#124](https://github.com/MindHub-DSC/Mindhub/issues/124))  
**Equipe:** um integrante (Leonardo Herrero S. Martins, @leohsm), trabalho individual.  
**Data:** 11/11/2026

| Sub-Issue | GitHub | Título | Complexidade | Depende de | Responsável | Revisor | Status atual | Status recomendado | Justificativa |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | [#125](https://github.com/MindHub-DSC/Mindhub/issues/125) | Estender a Disputa com o ciclo de decisão | Média | UC20, D-UC21-01 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC21-01 |
| SUB-02 | [#126](https://github.com/MindHub-DSC/Mindhub/issues/126) | Registrar as ações decorrentes separadamente da decisão | Média | SUB-01 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-03 | [#127](https://github.com/MindHub-DSC/Mindhub/issues/127) | Definir as portas de comandos dos contextos e o adaptador da suspensão | Média | UC18, D-UC21-02 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC21-02 |
| SUB-04 | [#128](https://github.com/MindHub-DSC/Mindhub/issues/128) | Implementar o serviço de aplicação Decidir Disputa | Alta | SUB-01, SUB-02, SUB-03, D-UC21-04, D-UC21-05 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-05 | [#129](https://github.com/MindHub-DSC/Mindhub/issues/129) | Expor os endpoints de decisão e verificar a jornada | Média | SUB-04, D-UC21-06 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-06 | [#130](https://github.com/MindHub-DSC/Mindhub/issues/130) | Documentar o UC21 e o endpoint | Baixa | SUB-05 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |

## Critérios aplicados

1. **Segregação de funções:** não é possível, pois a equipe tem um integrante. Responsável e revisor coincidem e isso está declarado em cada linha.
2. **Equilíbrio de carga:** toda a carga é de @leohsm (1 Baixa, 4 Média, 1 Alta). O equilíbrio vem da **ordem** de execução e do limite de WIP de 2 issues em `In Progress`, somando todos os casos de uso.
3. **Dependências:** a ordem está na [matriz de dependências](01-06-matriz-dependencias.md).

*Complexidade:* estimativa da pré-análise, a partir do número de critérios de aceite e da presença de concorrência. É proposta, e a equipe pode ajustá-la.
