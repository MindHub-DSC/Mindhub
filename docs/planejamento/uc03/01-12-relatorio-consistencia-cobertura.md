# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC03 — Publicar Serviço

## Quantidades

- **Issue principal:** 1 (`[UC03] Publicar Serviço`).
- **Sub-Issues:** 6 (SUB-01 a SUB-06): 6 em C2.
- **Labels novas:** `usecase:uc03`.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pré-condições | 1 | 1 | 0 | 0 |
| Pós-condições | 4 | 3 | 1 | 0 |
| Passos do fluxo principal | 5 | 5 | 0 | 0 |
| Fluxos alternativos | 1 | 1 | 0 | 0 |
| Fluxos de exceção | 6 | 6 | 0 | 0 |
| Regras de negócio | 2 | 2 | 0 | 0 |

As coberturas parciais são decisões declaradas: POS-03 — a visibilidade para clientes é entregue pelo UC04 (D-UC03-04); aqui só a situação publicada.

## Dependências críticas

1. **D-UC03-02 (campos das condições vigentes).** Define o contrato consumido pelo snapshot do UC08 (RN04); mudá-lo depois afeta contratações.
2. **UC02.** Já implementado; qualquer mudança na situação do perfil afeta a SUB-03.
3. **TC-C2-01.** A SUB-04 só é verificável contra banco real; deve entrar cedo no ciclo para não revelar tarde um problema de modelo.

## Decisões que dependem de validação

| ID | Decisão | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC03-01 | Atributos que descrevem um Serviço (título, descrição, modalidade, área). Proposta: título e descrição. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC03-02 | Quais campos das condições vigentes são obrigatórios em Reserva Direta (preço, moeda, duração, modalidade são apenas exemplos em T3 §5.2). | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC03-03 | Serviço Sob Proposta possui preço de referência? Este planejamento assume que não. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC03-04 | Serviços de perfil suspenso deixam de ser visíveis? Fora do UC03; decidido no UC04/UC18. | Dúvida documentada | @leohsm (domínio) | Antes do UC04 |
| D-UC03-05 | Origem da identidade do ator (D1): identificador informado pelo cliente HTTP até existir autenticação. | Dúvida documentada | @leohsm | Antes da SUB-05 |
| D-UC03-06 | Estratégia para FE-06: verificar o estado do perfil e gravar o Serviço na mesma transação, com bloqueio ou versão do perfil. | Proposta técnica | @leohsm | Antes da SUB-04 |
| D-UC03-07 | Rota e códigos HTTP dos erros (ex.: `POST /servicos`; 404 sem perfil, 403 perfil suspenso, 422 condições ausentes). | Proposta técnica | @leohsm | Antes da SUB-05 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| Condições vigentes mal definidas | O snapshot do UC08 (RN04) herda a imprecisão | Fechar D-UC03-02 antes da SUB-01; versionar o formato |
| Corrida entre suspensão e publicação | Serviço publicado por perfil suspenso (viola RN01) | Transação única com bloqueio ou versão do perfil (SUB-04) |
| Atributos do Serviço inventados | Retrabalho quando o domínio decidir | Manter o conjunto mínimo e marcá-lo como D-UC03-01 |
| Identidade do ator sem autenticação | Qualquer cliente HTTP publica em nome de outro | Documentar como limitação (SUB-06); tratar em issue futura de autenticação |

**Recomendação para o início:** responder D-UC03-01 e D-UC03-02, iniciar pela SUB-01 e preparar o teste de concorrência da SUB-04 cedo, porque ele valida a estratégia de consistência.
