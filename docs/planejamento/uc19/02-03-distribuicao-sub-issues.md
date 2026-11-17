# 02-03 — Matriz de distribuição das Sub-Issues

**Caso de uso:** UC19 — Reativar Perfil de Especialista (épico [#112](https://github.com/MindHub-DSC/Mindhub/issues/112))  
**Equipe:** um integrante (Leonardo Herrero S. Martins, @leohsm), trabalho individual.  
**Data:** 11/11/2026

| Sub-Issue | GitHub | Título | Complexidade | Depende de | Responsável | Revisor | Status atual | Status recomendado | Justificativa |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | [#113](https://github.com/MindHub-DSC/Mindhub/issues/113) | Implementar a transição de reativação no Perfil de Especialista | Alta | UC18, D-UC19-02 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-02 | [#114](https://github.com/MindHub-DSC/Mindhub/issues/114) | Implementar o serviço de aplicação Reativar Perfil e o registro da ação | Alta | SUB-01, UC18, D-UC19-03 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-03 | [#115](https://github.com/MindHub-DSC/Mindhub/issues/115) | Expor o endpoint de reativação e provar o efeito de RN01 | Baixa | SUB-02, UC03 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-04 | [#116](https://github.com/MindHub-DSC/Mindhub/issues/116) | Garantir a rastreabilidade do ciclo suspensão-reativação | Baixa | UC18, SUB-02 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-05 | [#117](https://github.com/MindHub-DSC/Mindhub/issues/117) | Documentar o UC19 e o endpoint | Baixa | SUB-03, SUB-04 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |

## Critérios aplicados

1. **Segregação de funções:** não é possível, pois a equipe tem um integrante. Responsável e revisor coincidem e isso está declarado em cada linha.
2. **Equilíbrio de carga:** toda a carga é de @leohsm (3 Baixa, 0 Média, 2 Alta). O equilíbrio vem da **ordem** de execução e do limite de WIP de 2 issues em `In Progress`, somando todos os casos de uso.
3. **Dependências:** a ordem está na [matriz de dependências](01-06-matriz-dependencias.md).

*Complexidade:* estimativa da pré-análise, a partir do número de critérios de aceite e da presença de concorrência. É proposta, e a equipe pode ajustá-la.
