# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC05 — Enviar Solicitação de Atendimento

## Quantidades

- **Issue principal:** 1 (`[UC05] Enviar Solicitação de Atendimento`).
- **Sub-Issues:** 7 (SUB-01 a SUB-07).
- **Labels novas:** 3 (`usecase:uc05`, `domain:negociacao`, `layer:adapter`); as demais são reutilizadas do UC02.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pré-condições | 2 | 2 | 0 | 0 |
| Pós-condições | 2 | 2 | 0 | 0 |
| Passos do fluxo principal | 6 | 6 | 0 | 0 |
| Fluxos alternativos e de exceção | 6 | 3 (FE-01, FE-02, FE-03) | 1 (FA-02) | 2 (FA-01, FE-04) |
| Regras de negócio | 3 | 2 (RN01, RN13) | 0 | 1 (RN11) |

As lacunas são decisões declaradas (D-UC05-01 e D-UC05-02), não esquecimentos.

## Dependências críticas

1. **UC02 inteiro antes do UC05.** A SUB-01 depende da #3 e a SUB-05 da #6. O UC05 não tem caminho próprio até o UC02 ser implementado.
2. **Contrato de habilitação (SUB-01).** É a primeira consulta de C3 a C2. Se a interpretação de `ATIVO` vazar para C3, o teste crítico TC-C2-01 do `trabalho4.md` fica invalidado.
3. **UC03 para a SUB-06.** Enquanto o UC03 não for planejado, o passo 4 fica bloqueado.

## Decisões que dependem de validação

| ID | Decisão | Quem decide | Quando |
| --- | --- | --- | --- |
| D1 | Origem do `clienteId` | @leohsm | Antes da SUB-05 (mesma decisão da #6) |
| D-UC05-01 | Representante fora do épico | @leohsm | Antes de mover o épico para `Ready` |
| D-UC05-02 | Aviso sem reentrega | @leohsm | Antes da SUB-03 |
| D-UC05-03 | Limites de Objetivo e Escopo | @leohsm (domínio) | Antes da SUB-02 |
| D-UC05-04 | Autossolicitação | Domínio | Antes da SUB-04 |
| D-UC05-05 | Tradução HTTP (409 / 422) | @leohsm | Antes da SUB-05 |
| D-UC05-06 | Consulta de solicitações recebidas fora | @leohsm | Antes do UC06 |
| D-UC05-07 | Mensagem genérica para especialista suspenso | @leohsm | Antes da SUB-05 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| Suspensão concorrente com nova solicitação (TC-C2-01) | Solicitação aceita depois de uma suspensão | Aceitável enquanto UC18 não existir; rever quando a suspensão for implementada |
| Contrato de C2 mudar depois do UC05 começar | Retrabalho na SUB-04 | Iniciar a SUB-04 só com a SUB-01 integrada |
| `clienteId` no corpo (D1) | Qualquer cliente HTTP pode enviar em nome de outro | Limitação documentada (SUB-07); issue futura de autenticação |
| Avisos pendentes perdidos ao reiniciar | Especialista não fica sabendo | Aceitável em memória; resolver com a persistência durável |
| Autossolicitação sem regra | Comportamento indefinido no domínio | Decidir D-UC05-04 antes da SUB-04 |

**Recomendação para o início:** implementar o UC02 primeiro (#3 e #2, depois #5 e #6). No UC05, começar pela SUB-03, que não tem dependências, e pela SUB-02, assim que D-UC05-03 for decidida.
