# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC15 — Indicar Participantes da Sessão

## Quantidades

- **Issue principal:** 1 (`[UC15] Indicar Participantes da Sessão`).
- **Sub-Issues:** 5 (SUB-01 a SUB-05): 1 em C1, 4 em C4.
- **Labels novas:** `usecase:uc15`.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pré-condições | 2 | 2 | 0 | 0 |
| Pós-condições | 2 | 2 | 0 | 0 |
| Passos do fluxo principal | 5 | 5 | 0 | 0 |
| Fluxos de exceção | 4 | 4 | 0 | 0 |
| Regras de negócio | 2 | 2 | 0 | 0 |
| Invariantes | 1 | 1 | 0 | 0 |

Não há cobertura parcial: todos os itens documentados têm Sub-Issue e critério de aceite.

## Dependências críticas

1. **UC16, UC17 e UC13.** Sem eles a indicação só é verificável com dublês.
2. **Classificação Futuro.** Não iniciar sem resolver as dúvidas D-UC15-01 a D-UC15-03.

## Decisões que dependem de validação

| ID | Decisão | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC15-01 | Limite de participantes por Sessão: não documentado; nenhuma regra criada. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC15-02 | Os papéis da Participação (especialista, cliente, convidado) são fixos? Não documentado. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC15-03 | A indicação é por Sessão ou para toda a Contratação? Este planejamento trata por Sessão. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC15-04 | Membro sem vínculo recusa só essa indicação (proposta do documento) ou toda a lista? Proposta: toda a lista, sem registro parcial. | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC15-05 | Aviso aos participantes pela porta de notificações; falha não desfaz a indicação. | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC15-06 | Rota e códigos HTTP: `POST /sessoes/{id}/participantes`; 403, 404, 409 e 422. | Proposta técnica | @leohsm | Antes da SUB-04 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| Participações desatualizadas após revogar vínculo | Participante sem vínculo na Sessão | Comportamento documentado (FE-03); decisão do domínio antes de uso real |
| Regras de limite inventadas | Retrabalho | Não implementar enquanto D-UC15-01 estiver aberta |

**Recomendação para o início:** não iniciar antes de UC16, UC17 e UC13; priorizar a revisão das dúvidas D-UC15-01 a D-UC15-03.
