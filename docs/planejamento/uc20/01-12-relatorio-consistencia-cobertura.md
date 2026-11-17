# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC20 — Abrir Disputa

## Quantidades

- **Issue principal:** 1 (`[UC20] Abrir Disputa`).
- **Sub-Issues:** 5 (SUB-01 a SUB-05): 5 em C6.
- **Labels novas:** `usecase:uc20`.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pré-condições | 1 | 1 | 0 | 0 |
| Pós-condições | 2 | 2 | 0 | 0 |
| Passos do fluxo principal | 4 | 4 | 0 | 0 |
| Fluxos de exceção | 3 | 3 | 0 | 0 |
| Regras de negócio | 2 | 2 | 0 | 0 |
| Invariantes | 1 | 1 | 0 | 0 |

Não há cobertura parcial: todos os itens documentados têm Sub-Issue e critério de aceite.

## Dependências críticas

1. **UC07, UC08, UC10, UC13 e UC15/UC17.** Sem os contextos vizinhos as portas só têm adaptadores simulados.
2. **TC-C6-02.** C6 não pode alterar nem bloquear os outros contextos; é critério da SUB-03.

## Decisões que dependem de validação

| ID | Decisão | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC20-01 | Prazo para abrir disputa depois da Sessão ou do Pagamento: não documentado; nenhuma regra criada. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC20-02 | A abertura suspende algum efeito (por exemplo, repasse)? Não documentado; T4 TC-C6-02 recomenda não. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC20-03 | Ciclo da Disputa (`Aberta`, `Em análise`, `Aguardando informações`, `Resolvida`, `Cancelada`, `Encerrada`) é provisório [T3 §11.5]. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC20-04 | Forma das evidências preservadas (texto e referências). Proposta: texto e identificadores de itens relacionados. | Proposta técnica | @leohsm | Antes da SUB-01 |
| D-UC20-05 | Contratação — Disputa `1 : 0..*` (hipótese plausível de T3 §8): mais de uma Disputa por Contratação é aceita. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC20-06 | Aviso à outra parte e à administração pela porta de notificações; falha não invalida a abertura. | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC20-07 | Rota e códigos HTTP: `POST /disputas`; 403, 404 e 422. | Proposta técnica | @leohsm | Antes da SUB-04 |
| D-UC20-08 | Origem do identificador do ator (D1). | Dúvida documentada | @leohsm | Antes da SUB-04 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| C6 passa a alterar outros contextos | Quebra a autoridade de C2 a C5 | Portas somente de leitura e teste com dublês que falham se chamados (SUB-03) |
| Ciclo provisório fixado cedo demais | Retrabalho no UC21 | Implementar só `Aberta` e declarar os demais estados |

**Recomendação para o início:** não iniciar antes de revisar a classificação Futuro; começar pela SUB-01 depois de responder D-UC20-03 a D-UC20-05.
