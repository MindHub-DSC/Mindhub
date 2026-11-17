# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC17 — Vincular Membro à Organização

## Quantidades

- **Issue principal:** 1 (`[UC17] Vincular Membro à Organização`).
- **Sub-Issues:** 5 (SUB-01 a SUB-05): 5 em C1.
- **Labels novas:** `usecase:uc17`.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pré-condições | 2 | 2 | 0 | 0 |
| Pós-condições | 1 | 1 | 0 | 0 |
| Passos do fluxo principal | 5 | 5 | 0 | 0 |
| Fluxos de exceção | 4 | 3 | 1 | 0 |
| Regras de negócio | 1 | 1 | 0 | 0 |
| Invariantes | 1 | 1 | 0 | 0 |

As coberturas parciais são decisões declaradas: FE-03 — a revogação não é Caso de Uso; é simulada em teste (D-UC17-04).

## Dependências críticas

1. **UC16.** Define Organização e Vínculo; sem ele não há o que vincular.
2. **RN11 e TC-C1-01.** São a base do UC15 e da variação organizacional de UC05 e UC07.

## Decisões que dependem de validação

| ID | Decisão | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC17-01 | Quais papéis existem? T3 §6.1 cita representante, colaborador e participante autorizado, sem lista fechada. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC17-02 | O membro precisa aceitar o vínculo? Não documentado; o vínculo é registrado diretamente. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-03 |
| D-UC17-03 | Um Usuário pode ter dois vínculos com a mesma Organização (papéis diferentes)? Não documentado. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC17-04 | Revogar vínculo é usado em TC-C1-01 sem Caso de Uso; a revogação é simulada em teste e não implementada. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC17-05 | Aviso ao membro pela porta de notificações; falha não invalida o vínculo. | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC17-06 | Rota e códigos HTTP: `POST /organizacoes/{id}/vinculos`; 403, 404 e 422. | Proposta técnica | @leohsm | Antes da SUB-04 |
| D-UC17-07 | Origem do identificador do Representante (D1). | Dúvida documentada | @leohsm | Antes da SUB-04 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| Verificação do Representante fora da transação | Vínculo registrado por Representante já revogado | Leitura e registro na mesma operação (SUB-02) |
| Papéis inventados | Retrabalho | Manter conjunto provisório e marcar D-UC17-01 |

**Recomendação para o início:** aguardar o UC16 e responder D-UC17-01 e D-UC17-03 antes de iniciar a SUB-01.
