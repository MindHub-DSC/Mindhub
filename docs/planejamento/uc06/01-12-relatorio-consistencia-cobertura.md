# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC06 — Enviar Proposta

## Quantidades

- **Issue principal:** 1 (`[UC06] Enviar Proposta`).
- **Sub-Issues:** 6 (SUB-01 a SUB-06): 6 em C3.
- **Labels novas:** `usecase:uc06`.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pré-condições | 2 | 2 | 0 | 0 |
| Pós-condições | 5 | 4 | 1 | 0 |
| Passos do fluxo principal | 5 | 5 | 0 | 0 |
| Fluxos alternativos | 2 | 2 | 0 | 0 |
| Fluxos de exceção | 6 | 5 | 1 | 0 |
| Regras de negócio | 2 | 2 | 0 | 0 |
| Invariantes | 1 | 1 | 0 | 0 |

As coberturas parciais são decisões declaradas: POS-04 — a consulta pelo Cliente é entregue pelo UC07 (SUB-05); aqui só a recuperação da versão vigente; FE-05 — a Contratação única é garantida pelo UC07 (SUB-03); aqui só a versão vigente esperada.

## Dependências críticas

1. **UC05 (Solicitação e porta de aviso).** Sem a Solicitação `Enviada` não há Proposta.
2. **Modelo de Proposta (SUB-01 e SUB-02).** Bloqueia o UC07 (#19, #20, #21, #23); o formato de Versão e Condições Comerciais deve ser fechado antes de o UC07 sair de `Backlog`.
3. **Concorrência com o aceite (FE-05).** Depende da SUB-03 do UC07 para ser provada de ponta a ponta.

## Decisões que dependem de validação

| ID | Decisão | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC06-01 | Quem leva a Proposta de `Enviada` para `Em revisão`? Este planejamento usa só FA-01 (nova versão do Especialista); "pedir revisão" não é implementado. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC06-02 | Quais Condições Comerciais são obrigatórias. Proposta: todas, exceto condições de cancelamento. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC06-03 | Identificação da versão: número sequencial por Proposta, a partir de 1 (D-UC07-03). | Proposta técnica | @leohsm | Antes da SUB-02 |
| D-UC06-04 | O estado `Em elaboração` não entra: o primeiro registro já é `Enviada` ([PROP] do documento). | Proposta técnica | @leohsm | Antes da SUB-02 |
| D-UC06-05 | Especialista suspenso pode enviar Proposta para Solicitação recebida antes da suspensão? RN01 só trata de novas Solicitações. Nenhuma regra criada. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC06-06 | A Solicitação passa a `Respondida`? Previsto em T2.1 §13.2, não retomado em T3. Não implementado. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC06-07 | Recusar e expirar Proposta são transições sem Caso de Uso. Não implementadas. | Dúvida documentada | @leohsm (domínio) | Antes do UC07 |
| D-UC06-08 | Rotas e códigos HTTP: `POST /solicitacoes/{id}/propostas`, `POST /propostas/{id}/versoes`; 404, 403, 409 e 422 para as recusas. | Proposta técnica | @leohsm | Antes da SUB-05 |
| D-UC06-09 | Origem do identificador do Especialista (D1). | Dúvida documentada | @leohsm | Antes da SUB-05 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| Formato da Versão decidido sem o UC07 | Retrabalho no snapshot da Contratação | Alinhar SUB-01/SUB-02 com UC07-SUB-02 antes de implementar |
| Nova versão aceita durante um aceite | Duas Contratações ou versão aceita diferente da vigente | Versão vigente esperada no repositório; teste conjunto com UC07 |
| Estado `Em revisão` sem gatilho documentado | Ciclo da Proposta incompleto | Manter D-UC06-01 aberta e documentar a limitação |

**Recomendação para o início:** iniciar pela SUB-01 e pela SUB-03 em paralelo, fechar D-UC06-01 a D-UC06-03 e alinhar o modelo com o UC07 antes da SUB-02, porque o UC07 já está planejado sobre ele.
