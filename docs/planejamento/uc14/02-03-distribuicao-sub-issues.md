# 02-03 — Matriz de distribuição das Sub-Issues

**Caso de uso:** UC14 — Avaliar Sessão (épico [#82](https://github.com/MindHub-DSC/Mindhub/issues/82))  
**Equipe:** um integrante (Leonardo Herrero S. Martins, @leohsm), trabalho individual.  
**Data:** 11/11/2026

| Sub-Issue | GitHub | Título | Complexidade | Depende de | Responsável | Revisor | Status atual | Status recomendado | Justificativa |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | [#83](https://github.com/MindHub-DSC/Mindhub/issues/83) | Modelar a Avaliação | Baixa | D-UC14-01 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC14-01 |
| SUB-02 | [#84](https://github.com/MindHub-DSC/Mindhub/issues/84) | Garantir a unicidade da Avaliação por Sessão no repositório | Alta | SUB-01 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-03 | [#85](https://github.com/MindHub-DSC/Mindhub/issues/85) | Implementar o serviço de aplicação Avaliar Sessão | Média | SUB-01, SUB-02, UC13 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-04 | [#86](https://github.com/MindHub-DSC/Mindhub/issues/86) | Expor o endpoint de avaliação e verificar a concorrência | Alta | SUB-03, D-UC14-05, D-UC14-06 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC14-06 |
| SUB-05 | [#87](https://github.com/MindHub-DSC/Mindhub/issues/87) | Documentar o UC14 e o endpoint | Baixa | SUB-04 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |

## Critérios aplicados

1. **Segregação de funções:** não é possível, pois a equipe tem um integrante. Responsável e revisor coincidem e isso está declarado em cada linha.
2. **Equilíbrio de carga:** toda a carga é de @leohsm (2 Baixa, 1 Média, 2 Alta). O equilíbrio vem da **ordem** de execução e do limite de WIP de 2 issues em `In Progress`, somando todos os casos de uso.
3. **Dependências:** a ordem está na [matriz de dependências](01-06-matriz-dependencias.md).

*Complexidade:* estimativa da pré-análise, a partir do número de critérios de aceite e da presença de concorrência. É proposta, e a equipe pode ajustá-la.
