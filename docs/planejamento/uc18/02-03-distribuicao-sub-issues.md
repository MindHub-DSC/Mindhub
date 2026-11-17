# 02-03 — Matriz de distribuição das Sub-Issues

**Caso de uso:** UC18 — Suspender Perfil de Especialista (épico [#106](https://github.com/MindHub-DSC/Mindhub/issues/106))  
**Equipe:** um integrante (Leonardo Herrero S. Martins, @leohsm), trabalho individual.  
**Data:** 11/11/2026

| Sub-Issue | GitHub | Título | Complexidade | Depende de | Responsável | Revisor | Status atual | Status recomendado | Justificativa |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | [#107](https://github.com/MindHub-DSC/Mindhub/issues/107) | Implementar a transição de suspensão no Perfil de Especialista | Alta | UC02 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-02 | [#108](https://github.com/MindHub-DSC/Mindhub/issues/108) | Registrar a ação administrativa em C6 | Média | D-UC18-02 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-03 | [#109](https://github.com/MindHub-DSC/Mindhub/issues/109) | Implementar o serviço de aplicação Suspender Perfil | Alta | SUB-01, SUB-02, D-UC18-01, D-UC18-05 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-04 | [#110](https://github.com/MindHub-DSC/Mindhub/issues/110) | Expor o endpoint de suspensão e provar a concorrência com publicação | Baixa | SUB-03, UC03, UC05 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-05 | [#111](https://github.com/MindHub-DSC/Mindhub/issues/111) | Documentar o UC18 e o endpoint | Baixa | SUB-04 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |

## Critérios aplicados

1. **Segregação de funções:** não é possível, pois a equipe tem um integrante. Responsável e revisor coincidem e isso está declarado em cada linha.
2. **Equilíbrio de carga:** toda a carga é de @leohsm (2 Baixa, 1 Média, 2 Alta). O equilíbrio vem da **ordem** de execução e do limite de WIP de 2 issues em `In Progress`, somando todos os casos de uso.
3. **Dependências:** a ordem está na [matriz de dependências](01-06-matriz-dependencias.md).

*Complexidade:* estimativa da pré-análise, a partir do número de critérios de aceite e da presença de concorrência. É proposta, e a equipe pode ajustá-la.
