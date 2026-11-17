# 02-03 — Matriz de distribuição das Sub-Issues

**Caso de uso:** UC04 — Buscar Especialistas e Serviços (épico [#42](https://github.com/MindHub-DSC/Mindhub/issues/42))  
**Equipe:** um integrante (Leonardo Herrero S. Martins, @leohsm), trabalho individual.  
**Data:** 11/11/2026

| Sub-Issue | GitHub | Título | Complexidade | Depende de | Responsável | Revisor | Status atual | Status recomendado | Justificativa |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | [#43](https://github.com/MindHub-DSC/Mindhub/issues/43) | Definir o modelo de leitura público da oferta | Baixa | D-UC04-05 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-02 | [#44](https://github.com/MindHub-DSC/Mindhub/issues/44) | Implementar a seleção de especialistas habilitados e Serviços publicados | Média | SUB-01, UC03, D-UC04-01, D-UC04-02 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC04-01, D-UC04-02 |
| SUB-03 | [#45](https://github.com/MindHub-DSC/Mindhub/issues/45) | Implementar a consulta da oferta no armazenamento | Baixa | SUB-01, UC03, D-UC04-03 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-04 | [#46](https://github.com/MindHub-DSC/Mindhub/issues/46) | Expor o endpoint de busca e traduzir os erros | Baixa | SUB-02, SUB-03, D-UC04-04 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC04-04 |
| SUB-05 | [#47](https://github.com/MindHub-DSC/Mindhub/issues/47) | Documentar o UC04 e o endpoint | Baixa | SUB-04 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |

## Critérios aplicados

1. **Segregação de funções:** não é possível, pois a equipe tem um integrante. Responsável e revisor coincidem e isso está declarado em cada linha.
2. **Equilíbrio de carga:** toda a carga é de @leohsm (4 Baixa, 1 Média, 0 Alta). O equilíbrio vem da **ordem** de execução e do limite de WIP de 2 issues em `In Progress`, somando todos os casos de uso.
3. **Dependências:** a ordem está na [matriz de dependências](01-06-matriz-dependencias.md).

*Complexidade:* estimativa da pré-análise, a partir do número de critérios de aceite e da presença de concorrência. É proposta, e a equipe pode ajustá-la.
