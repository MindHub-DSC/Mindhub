# 02-03 — Matriz de distribuição das Sub-Issues

**Caso de uso:** UC06 — Enviar Proposta (épico [#48](https://github.com/MindHub-DSC/Mindhub/issues/48))  
**Equipe:** um integrante (Leonardo Herrero S. Martins, @leohsm), trabalho individual.  
**Data:** 11/11/2026

| Sub-Issue | GitHub | Título | Complexidade | Depende de | Responsável | Revisor | Status atual | Status recomendado | Justificativa |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | [#49](https://github.com/MindHub-DSC/Mindhub/issues/49) | Modelar as Condições Comerciais | Média | D-UC06-02 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC06-02 |
| SUB-02 | [#50](https://github.com/MindHub-DSC/Mindhub/issues/50) | Modelar a Proposta, suas Versões e o repositório em memória | Alta | SUB-01, D-UC06-01, D-UC06-03, D-UC06-04 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC06-01 |
| SUB-03 | [#51](https://github.com/MindHub-DSC/Mindhub/issues/51) | Expor a Solicitação recebida ao Especialista destinatário | Baixa | UC05 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-04 | [#52](https://github.com/MindHub-DSC/Mindhub/issues/52) | Implementar os serviços de aplicação Enviar Proposta e Enviar Nova Versão | Alta | SUB-02, SUB-03, UC05 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |
| SUB-05 | [#53](https://github.com/MindHub-DSC/Mindhub/issues/53) | Expor os endpoints de Proposta e verificar o envio de ponta a ponta | Alta | SUB-04, D-UC06-08, D-UC06-09 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido; decisão aberta: D-UC06-09 |
| SUB-06 | [#54](https://github.com/MindHub-DSC/Mindhub/issues/54) | Documentar o UC06 e os endpoints | Baixa | SUB-05 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` | DoR-07 ainda não atendido |

## Critérios aplicados

1. **Segregação de funções:** não é possível, pois a equipe tem um integrante. Responsável e revisor coincidem e isso está declarado em cada linha.
2. **Equilíbrio de carga:** toda a carga é de @leohsm (2 Baixa, 1 Média, 3 Alta). O equilíbrio vem da **ordem** de execução e do limite de WIP de 2 issues em `In Progress`, somando todos os casos de uso.
3. **Dependências:** a ordem está na [matriz de dependências](01-06-matriz-dependencias.md).

*Complexidade:* estimativa da pré-análise, a partir do número de critérios de aceite e da presença de concorrência. É proposta, e a equipe pode ajustá-la.
