# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC04 — Buscar Especialistas e Serviços

## Quantidades

- **Issue principal:** 1 (`[UC04] Buscar Especialistas e Serviços`).
- **Sub-Issues:** 5 (SUB-01 a SUB-05): 5 em C2.
- **Labels novas:** `usecase:uc04`.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pós-condições | 2 | 2 | 0 | 0 |
| Passos do fluxo principal | 4 | 4 | 0 | 0 |
| Fluxos alternativos | 2 | 2 | 0 | 0 |
| Fluxos de exceção | 1 | 1 | 0 | 0 |
| Regras de negócio | 2 | 1 | 1 | 0 |

As coberturas parciais são decisões declaradas: RN01 — proposta do próprio documento de casos de uso, pendente de D-UC04-01.

## Dependências críticas

1. **UC03.** Sem Serviços publicados a busca só devolve especialistas.
2. **D-UC04-01.** Define o filtro de elegibilidade usado por SUB-02 e SUB-03.
3. **Contrato de leitura.** UC05 e UC08 consomem a visão pública; mudá-la depois afeta ambos.

## Decisões que dependem de validação

| ID | Decisão | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC04-01 | Perfis `SUSPENSO` aparecem na busca? Proposta: não, pois não recebem novas Solicitações (RN01). | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC04-02 | Quais critérios existem (área de atuação, especialidade, Modelo de Contratação)? [T1 §3] cita área e especialidade. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC04-03 | Paginação e tamanho máximo da listagem. | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC04-04 | A busca exige Usuário cadastrado? Não documentado. Proposta: não exige. | Dúvida documentada | @leohsm | Antes da SUB-03 |
| D-UC04-05 | Forma da visão pública de resultado (campos devolvidos). | Proposta técnica | @leohsm | Antes da SUB-01 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| Exposição de dados privados na visão pública | Vazamento de nome, email ou dados internos | Teste de contrato que lista os campos permitidos (SUB-01) |
| Consulta lenta com muitos registros | Latência da busca | Limite de resultados e índices na SUB-03; medir antes de otimizar |
| Critérios de busca inventados | Retrabalho | Manter só os critérios de D-UC04-02 confirmados |

**Recomendação para o início:** confirmar D-UC04-01, D-UC04-02 e D-UC04-05 e iniciar pela SUB-01; a busca só será útil de ponta a ponta depois do UC03.
