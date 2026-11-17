# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC21 — Decidir Disputa

## Quantidades

- **Issue principal:** 1 (`[UC21] Decidir Disputa`).
- **Sub-Issues:** 6 (SUB-01 a SUB-06): 6 em C6.
- **Labels novas:** `usecase:uc21`.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pré-condições | 1 | 1 | 0 | 0 |
| Pós-condições | 3 | 3 | 0 | 0 |
| Passos do fluxo principal | 5 | 5 | 0 | 0 |
| Fluxos alternativos | 2 | 2 | 0 | 0 |
| Fluxos de exceção | 3 | 3 | 0 | 0 |
| Regras de negócio | 1 | 1 | 0 | 0 |
| Invariantes | 1 | 1 | 0 | 0 |

Não há cobertura parcial: todos os itens documentados têm Sub-Issue e critério de aceite.

## Dependências críticas

1. **UC20 e UC18.** Sem a Disputa e o comando de suspensão, o caso de uso só é verificável com dublês.
2. **TC-C6-01.** Independência entre decisão e ações é o critério central; deve ser testada na SUB-04.

## Decisões que dependem de validação

| ID | Decisão | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC21-01 | Os estados intermediários (`Em análise`, `Aguardando informações`) e `Resolvida → Encerrada` são provisórios [T3 §11.5]; T2.1 §13.8 incluía `Em triagem`. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC21-02 | Quais ações uma decisão pode solicitar? Estorno e compensação dependem de política inexistente. Este planejamento trata só a suspensão de perfil. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-03 |
| D-UC21-03 | Há recurso contra a decisão? Não documentado; nenhuma etapa criada. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC21-04 | Reconhecimento do Administrador sem autenticação (mesma decisão do UC18, D-UC18-01). | Proposta técnica | @leohsm | Antes da SUB-04 |
| D-UC21-05 | Evidências analisadas por visões dos outros contextos (TC-C6-02); nenhum acesso direto. | Proposta técnica | @leohsm | Antes da SUB-04 |
| D-UC21-06 | Rota e códigos HTTP: `POST /disputas/{id}/decisao`, `POST /disputas/{id}/pedido-de-informacoes`, `POST /disputas/{id}/cancelamento`; 403, 404 e 409. | Proposta técnica | @leohsm | Antes da SUB-05 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| Decisão desfeita pela recusa de uma ação | Perde-se a rastreabilidade (RN15) | Registros separados e teste de recusa (SUB-02 e SUB-04) |
| Ação reaplicada em repetição | Efeito duplicado no contexto proprietário | Idempotência por decisão e tipo (SUB-02 e SUB-03) |
| Ciclo provisório fixado cedo demais | Retrabalho | Isolar as transições no Agregado e revisar D-UC21-01 |

**Recomendação para o início:** aguardar UC20 e UC18 e responder D-UC21-01 e D-UC21-02 antes de iniciar a SUB-01.
