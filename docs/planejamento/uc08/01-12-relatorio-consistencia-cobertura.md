# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC08 — Contratar Serviço de Reserva Direta

## Quantidades

- **Issue principal:** 1 (`[UC08] Contratar Serviço de Reserva Direta`).
- **Sub-Issues:** 5 (SUB-01 a SUB-05): 1 em C2, 4 em C3.
- **Labels novas:** `usecase:uc08`.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pré-condições | 1 | 1 | 0 | 0 |
| Pós-condições | 3 | 2 | 1 | 0 |
| Passos do fluxo principal | 7 | 6 | 1 | 0 |
| Fluxos de exceção | 6 | 6 | 0 | 0 |
| Regras de negócio | 4 | 2 | 2 | 0 |
| Invariantes | 1 | 0 | 1 | 0 |

As coberturas parciais são decisões declaradas: POS-03 — a Reserva e o prazo são criados pelo UC09 (C4); aqui só a solicitação e a conferência do resultado; 6 — a validação e o registro são do UC09; aqui só a tradução do resultado; RN02 — regra aplicada pela Agenda (UC09); aqui só a tradução da recusa; RN03 — regra aplicada pela Agenda (UC09); aqui só a tradução da recusa; INV-01 — verificado pela Agenda (UC09); aqui só a tradução da recusa.

## Dependências críticas

1. **UC09 (Agenda).** Sem a retenção real, as SUB-03 e SUB-04 só são verificáveis com dublês.
2. **UC03 e UC07.** O Serviço publicado e o modelo de Contratação precisam existir.
3. **D-UC08-01 e D-UC08-02.** Especialista suspenso e disponibilidade afetam o comportamento do passo 3 e do passo 6.

## Decisões que dependem de validação

| ID | Decisão | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC08-01 | Especialista suspenso: o Serviço de Reserva Direta pode ser contratado? T2.1 INV11 dizia que não; T3 não retomou. Nenhuma regra criada. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-03 |
| D-UC08-02 | Disponibilidade do especialista além de outras Reservas (lacuna `casos-de-uso.md` §8). | Dúvida documentada | @leohsm (domínio) | Antes do UC09 |
| D-UC08-03 | O Cliente precisa confirmar o preço vigente antes de contratar? Não documentado; nenhuma etapa criada. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC08-04 | Prazo numérico da retenção: definido por C4 (UC09). | Dúvida documentada | @leohsm (domínio) | Antes do UC09 |
| D-UC08-05 | Contratação organizacional (Representante) por Reserva Direta não é documentada; fora do escopo. | Dúvida documentada | @leohsm (domínio) | Antes dos UC16/UC17 |
| D-UC08-06 | FE-06: retenção recusada depois de formada a Contratação — a Contratação permanece e a nova tentativa reaproveita a mesma operação de retenção ([PROP]). | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC08-07 | Identificação da operação fornecida pelo cliente HTTP (campo do corpo) para a repetição segura. | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC08-08 | Origem do identificador do Cliente (D1). | Dúvida documentada | @leohsm | Antes da SUB-04 |
| D-UC08-09 | Rota e códigos HTTP: `POST /servicos/{id}/contratacoes`; 409 horário ocupado, 422 intervalo inválido, 409/422 para Serviço Sob Proposta. | Proposta técnica | @leohsm | Antes da SUB-04 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| Duas Reservas para a mesma contratação em repetição | Cobrança e horários duplicados | Identificação da operação fornecida pelo cliente e teste de repetição (SUB-03 e SUB-04) |
| Snapshot incompleto das condições | RN04 violada; preço muda após a contratação | Teste que altera a origem depois da formação (SUB-02) |
| Contratação sem Reserva após recusa | Contratação parada sem horário | Decisão D-UC08-06 explícita e testada; documentar o estado resultante |

**Recomendação para o início:** aguardar a especificação e o planejamento do UC09 (contrato C01) e iniciar pela SUB-01 quando o UC03 estiver disponível; fechar D-UC08-01 e D-UC08-06 antes da SUB-03.
