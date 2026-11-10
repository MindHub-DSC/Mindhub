# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC11 — Reagendar Sessão

## Quantidades

- **Issue principal:** 1 (`[UC11] Reagendar Sessão`).
- **Sub-Issues:** 5 (SUB-01 a SUB-05): 5 em C4.
- **Labels novas:** `usecase:uc11`.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pré-condições | 1 | 1 | 0 | 0 |
| Pós-condições | 3 | 3 | 0 | 0 |
| Passos do fluxo principal | 5 | 5 | 0 | 0 |
| Fluxos de exceção | 5 | 5 | 0 | 0 |
| Regras de negócio | 3 | 3 | 0 | 0 |

Não há cobertura parcial: todos os itens documentados têm Sub-Issue e critério de aceite.

## Dependências críticas

1. **UC09 e UC10.** Sem Reserva e sem confirmação, o caso de uso só é verificável com dublês.
2. **Atomicidade da troca.** Compartilha a seção crítica do UC09; mudar a estratégia afeta os dois.
3. **D-UC11-03.** Se o domínio decidir que a Sessão acompanha o reagendamento, surge uma dependência com o UC13.

## Decisões que dependem de validação

| ID | Decisão | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC11-01 | A outra parte precisa concordar com o novo horário? Não documentado; nenhuma etapa de concordância foi criada. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC11-02 | Antecedência mínima e limite de reagendamentos: não documentados. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC11-03 | Efeito sobre a Sessão `Programada` ligada à Reserva (Reserva — Sessão `1 : 0..1`): não documentado. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-03 |
| D-UC11-04 | Autorização: ator é o cliente ou o especialista da Contratação (proposta derivada de T1 §2). | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC11-05 | Aviso às duas partes pela porta de notificações; falha não desfaz o reagendamento. | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC11-06 | Rota e códigos HTTP: `POST /reservas/{id}/reagendamento`; 409 intervalo ocupado ou Reserva não confirmada, 422 intervalo inválido, 403 ator não parte. | Proposta técnica | @leohsm | Antes da SUB-04 |
| D-UC11-07 | Origem do identificador do ator (D1). | Dúvida documentada | @leohsm | Antes da SUB-04 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| Troca não atômica | Reserva com dois intervalos ou nenhum | Teste de falha simulada e de concorrência (SUB-02) |
| Sobreposição consigo mesma | Reagendar para um intervalo parcialmente igual ao atual é recusado | Desconsiderar o intervalo atual da própria Reserva (SUB-02) |
| Efeito sobre a Sessão indefinido | Sessão e Reserva divergentes | Registrar D-UC11-03 e não implementar sem decisão |

**Recomendação para o início:** aguardar o UC10 e iniciar pelas SUB-01 e SUB-02; fechar D-UC11-03 antes da SUB-03.
