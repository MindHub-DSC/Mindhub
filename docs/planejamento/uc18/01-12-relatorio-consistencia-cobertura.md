# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC18 — Suspender Perfil de Especialista

## Quantidades

- **Issue principal:** 1 (`[UC18] Suspender Perfil de Especialista`).
- **Sub-Issues:** 5 (SUB-01 a SUB-05): 4 em C2, 1 em C6.
- **Labels novas:** `usecase:uc18` e `domain:governanca`.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pré-condições | 1 | 1 | 0 | 0 |
| Pós-condições | 4 | 4 | 0 | 0 |
| Passos do fluxo principal | 5 | 5 | 0 | 0 |
| Fluxos de exceção | 5 | 4 | 1 | 0 |
| Regras de negócio | 2 | 2 | 0 | 0 |

As coberturas parciais são decisões declaradas: FE-05 — o registro só aceita a referência; a decisão de disputa é entregue pelo UC21.

## Dependências críticas

1. **D-UC18-01 (papel de Administrador).** Sem a decisão, a SUB-03 não pode verificar o ator.
2. **Concorrência com UC03 e UC05.** FE-04 só é comprovada com os dois casos de uso disponíveis.
3. **Reaproveitamento por UC19 e UC21.** O formato do registro (SUB-02) é consumido por ambos.

## Decisões que dependem de validação

| ID | Decisão | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC18-01 | Como o sistema reconhece que o ator é Administrador, sem autenticação (D1)? Proposta: lista configurada de identificadores. | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC18-02 | Suspensão e registro administrativo na mesma transação ou com consistência eventual. | Proposta técnica | @leohsm | Antes da SUB-02 |
| D-UC18-03 | A suspensão impede aceitar proposta já enviada? Aberta desde o UC07 (D-UC07-02). | Dúvida documentada | @leohsm (domínio) | Antes de usar com o UC07 |
| D-UC18-04 | Reservas confirmadas futuras e visibilidade dos Serviços do especialista suspenso não são documentadas. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC18-05 | O aviso ao especialista usa a porta de notificações; falha não invalida a suspensão. | Proposta técnica | @leohsm | Antes da SUB-03 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| Suspensão sem registro, ou o contrário | Viola RN15 | Operação atômica (D-UC18-02) e teste de falha simulada |
| Papel de Administrador sem autenticação | Qualquer cliente HTTP suspende perfis | Lista configurada de administradores e limitação documentada (SUB-05) |
| Efeitos não documentados sobre propostas e reservas | Comportamento arbitrário | Não implementar; manter como dúvida D-UC18-03/04 |

**Recomendação para o início:** confirmar D-UC18-01 e D-UC18-02 e iniciar por SUB-01 e SUB-02 em paralelo; planejar o UC19 junto, pois reutiliza o registro administrativo.
