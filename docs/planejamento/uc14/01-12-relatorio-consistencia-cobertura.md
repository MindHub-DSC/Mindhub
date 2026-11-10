# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC14 — Avaliar Sessão

## Quantidades

- **Issue principal:** 1 (`[UC14] Avaliar Sessão`).
- **Sub-Issues:** 5 (SUB-01 a SUB-05): 5 em C4.
- **Labels novas:** `usecase:uc14`.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pré-condições | 1 | 1 | 0 | 0 |
| Pós-condições | 2 | 2 | 0 | 0 |
| Passos do fluxo principal | 4 | 4 | 0 | 0 |
| Fluxos de exceção | 4 | 4 | 0 | 0 |
| Regras de negócio | 2 | 2 | 0 | 0 |
| Invariantes | 1 | 1 | 0 | 0 |

Não há cobertura parcial: todos os itens documentados têm Sub-Issue e critério de aceite.

## Dependências críticas

1. **UC13.** Fornece a Sessão `Concluída`; sem ela a SUB-03 só é verificável com dublês.
2. **D-UC14-01.** Define o contrato da Avaliação; mudar depois afeta modelo, API e testes.

## Decisões que dependem de validação

| ID | Decisão | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC14-01 | Conteúdo da Avaliação (nota, escala, comentário): não definido. Proposta: nota inteira de 1 a 5 e comentário opcional. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC14-02 | Prazo para avaliar e possibilidade de editar: não documentados; a Avaliação não tem edição. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC14-03 | Em contratação organizacional, quem é o cliente que avalia (contratante ou participantes)? RN09 fala em cliente. | Dúvida documentada | @leohsm (domínio) | Antes dos UC15/UC16 |
| D-UC14-04 | Resposta do especialista e reputação agregada: capacidades futuras sem regras; não planejadas. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC14-05 | Rota e códigos HTTP: `POST /sessoes/{id}/avaliacao`; 403, 404, 409 (já avaliada ou Sessão não concluída) e 422. | Proposta técnica | @leohsm | Antes da SUB-04 |
| D-UC14-06 | Origem do identificador do Cliente (D1). | Dúvida documentada | @leohsm | Antes da SUB-04 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| Duas Avaliações por corrida | Viola RN10 | Seção crítica no repositório e teste de concorrência (SUB-02) |
| Conteúdo da Avaliação inventado | Retrabalho | Manter o mínimo e marcá-lo como D-UC14-01 |

**Recomendação para o início:** fechar D-UC14-01 e iniciar pelas SUB-01 e SUB-02; a SUB-03 espera o UC13.
