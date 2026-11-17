# 02-03 — Matriz de distribuição das Sub-Issues

**Caso de uso:** UC20 — Abrir Disputa (épico [#118](https://github.com/MindHub-DSC/Mindhub/issues/118))  
**Equipe:** um integrante (Leonardo Herrero S. Martins, @leohsm), trabalho individual.  
**Data:** 11/11/2026

| Sub-Issue | GitHub | Título | Complexidade | Depende de | Responsável | Revisor | Status atual | Status recomendado | Justificativa |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | [#119](https://github.com/MindHub-DSC/Mindhub/issues/119) | Modelar a Disputa e seu ciclo provisório | Média | D-UC20-03, D-UC20-04, D-UC20-05 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC20-03, D-UC20-05 |
| SUB-02 | [#120](https://github.com/MindHub-DSC/Mindhub/issues/120) | Definir as portas de verificação das partes e do pertencimento | Média | UC07, UC13, UC10, UC15 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-03 | [#121](https://github.com/MindHub-DSC/Mindhub/issues/121) | Implementar o serviço de aplicação Abrir Disputa | Média | SUB-01, SUB-02, D-UC20-06 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-04 | [#122](https://github.com/MindHub-DSC/Mindhub/issues/122) | Expor o endpoint de abertura de Disputa e verificar a jornada | Média | SUB-03, D-UC20-07, D-UC20-08 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC20-08 |
| SUB-05 | [#123](https://github.com/MindHub-DSC/Mindhub/issues/123) | Documentar o UC20 e o endpoint | Baixa | SUB-04 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |

## Critérios aplicados

1. **Segregação de funções:** não é possível, pois a equipe tem um integrante. Responsável e revisor coincidem e isso está declarado em cada linha.
2. **Equilíbrio de carga:** toda a carga é de @leohsm (1 Baixa, 4 Média, 0 Alta). O equilíbrio vem da **ordem** de execução e do limite de WIP de 2 issues em `In Progress`, somando todos os casos de uso.
3. **Dependências:** a ordem está na [matriz de dependências](01-06-matriz-dependencias.md).

*Complexidade:* estimativa da pré-análise, a partir do número de critérios de aceite e da presença de concorrência. É proposta, e a equipe pode ajustá-la.
