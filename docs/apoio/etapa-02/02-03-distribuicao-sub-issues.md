# 02-03 — Matriz de distribuição das Sub-Issues

**Épico:** [#1 — [UC02] Cadastrar Perfil de Especialista](https://github.com/MindHub-DSC/Mindhub/issues/1)

| Sub-Issue | GitHub | Título | Complexidade | Depende de | Responsável | Revisor | Status atual | Status recomendado | Justificativa |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | [#2](https://github.com/MindHub-DSC/Mindhub/issues/2) | Interface pública de reconhecimento (C1) | Baixa | — | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Ready` após revisão humana | Pequena; altera C1 e exige regressão do UC01 |
| SUB-02 | [#3](https://github.com/MindHub-DSC/Mindhub/issues/3) | Modelo do Perfil de Especialista | Média | D2, D3 (decididas) | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Ready` após revisão humana | Concentra as invariantes do domínio |
| SUB-03 | [#4](https://github.com/MindHub-DSC/Mindhub/issues/4) | Contrato de persistência e unicidade | Média | SUB-02 (contrato) | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Ready` após revisão humana | Principal risco técnico: unicidade |
| SUB-04 | [#5](https://github.com/MindHub-DSC/Mindhub/issues/5) | Serviço de aplicação | Média | SUB-01, SUB-03 (contrato); SUB-02 (implementação) | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Ready` após revisão humana | Coordena três abstrações |
| SUB-05 | [#6](https://github.com/MindHub-DSC/Mindhub/issues/6) | Endpoint HTTP | Média | SUB-04 (contrato); D1 | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` até decidir D1 | Contrato HTTP depende da origem da identidade |
| SUB-06 | [#7](https://github.com/MindHub-DSC/Mindhub/issues/7) | Integração e testes HTTP | Média | SUB-01, SUB-03, SUB-04, SUB-05 (integração) | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Backlog` até decidir D1 | Depende do contrato da SUB-05 |
| SUB-07 | [#8](https://github.com/MindHub-DSC/Mindhub/issues/8) | Documentação | Baixa | SUB-05 (contrato) | @leohsm | @leohsm (autorrevisão) | `Backlog` | `Ready` após revisão humana | Pode começar pela descrição do caso de uso |

## Critérios aplicados

1. **Segregação de funções:** não é possível, porque a equipe tem um integrante. Responsável e revisor coincidem, e isso está declarado em cada linha como autorrevisão.
2. **Equilíbrio de carga:** toda a carga é do mesmo integrante (2 issues de complexidade baixa e 5 de média). O equilíbrio é obtido pela **ordem** e pelo **limite de WIP**, e não pela divisão entre pessoas.
3. **Respeito às dependências:** a ordem sugerida está no [planejamento operacional](../planejamento-operacional.md).
