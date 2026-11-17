# 02-03 — Matriz de distribuição das Sub-Issues

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))  
**Equipe:** um integrante (Leonardo Herrero S. Martins, @leohsm), trabalho individual.  
**Data:** 11/11/2026

| Sub-Issue | GitHub | Título | Complexidade | Depende de | Responsável | Revisor | Status atual | Status recomendado | Justificativa |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | [#36](https://github.com/MindHub-DSC/Mindhub/issues/36) | Modelar o Serviço e suas condições vigentes | Média | D-UC03-01, D-UC03-02 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC03-01, D-UC03-02 |
| SUB-02 | [#37](https://github.com/MindHub-DSC/Mindhub/issues/37) | Persistir o Serviço com TypeORM e migration | Média | SUB-01 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-03 | [#38](https://github.com/MindHub-DSC/Mindhub/issues/38) | Implementar o serviço de aplicação Publicar Serviço | Média | SUB-01, UC02 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-04 | [#39](https://github.com/MindHub-DSC/Mindhub/issues/39) | Proteger a publicação contra suspensão concorrente | Alta | SUB-02, SUB-03, D-UC03-06 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-05 | [#40](https://github.com/MindHub-DSC/Mindhub/issues/40) | Expor o endpoint de publicação de Serviço e traduzir os erros | Média | SUB-03, SUB-04, D-UC03-05, D-UC03-07 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC03-05 |
| SUB-06 | [#41](https://github.com/MindHub-DSC/Mindhub/issues/41) | Documentar o UC03 e o endpoint | Baixa | SUB-05 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |

## Critérios aplicados

1. **Segregação de funções:** não é possível, pois a equipe tem um integrante. Responsável e revisor coincidem e isso está declarado em cada linha.
2. **Equilíbrio de carga:** toda a carga é de @leohsm (1 Baixa, 4 Média, 1 Alta). O equilíbrio vem da **ordem** de execução e do limite de WIP de 2 issues em `In Progress`, somando todos os casos de uso.
3. **Dependências:** a ordem está na [matriz de dependências](01-06-matriz-dependencias.md).

*Complexidade:* estimativa da pré-análise, a partir do número de critérios de aceite e da presença de concorrência. É proposta, e a equipe pode ajustá-la.
