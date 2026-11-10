# 01-05 — Matriz de rastreabilidade

**Caso de uso:** UC07 — Aceitar Proposta

| Requisito / regra / fluxo | Sub-Issue | Atividade técnica | Critério de aceite vinculado | Comportamento a verificar |
| --- | --- | --- | --- | --- |
| PRE-01 — Proposta `Enviada`/`Em revisão` de Solicitação do Cliente | SUB-01, SUB-04 | Situação conferida no agregado; autoria conferida no serviço | `PropostaNaoAceitavel`; `AgenteNaoAutorizado` | Só o cliente da Solicitação aceita proposta em negociação |
| Passo 1 — consultar versão vigente | SUB-04, SUB-05 | Query `ConsultarPropostaVigente`; `GET /propostas/{id}` | 200 com versão vigente; outro agente recusado | O cliente vê o que está aceitando |
| Passo 2 — aceitar indicando a versão | SUB-01, SUB-05 | `aceitar(versao, agora)`; schema com `versao` | 400 para formato inválido | A versão é sempre explícita |
| Passo 3 — versão vigente e situação | SUB-01, SUB-03 | Conferência no agregado e de novo na gravação | `VersaoNaoVigente`; `VERSAO_ALTERADA` | Versão antiga ou alterada durante o aceite é recusada |
| Passo 4 — vínculo organizacional (RN11) | — | **Sem cobertura neste épico** | — | D-UC07-01 |
| Passo 5 — registrar aceite e Contratação | SUB-02, SUB-03, SUB-04 | Fábrica da Contratação; gravação atômica | Ambos gravados juntos | Nunca um sem o outro |
| Passo 6 — informar as partes | SUB-04, SUB-05 | Aviso pela porta de C3; resposta 201 | Falha do aviso não desfaz o aceite | Partes informadas |
| POS-01 — `Aceita` e versão identificável | SUB-01, SUB-02 | Situação e versão aceita no agregado e na Contratação | Versão aceita registrada | RN05 observável |
| POS-02 — uma Contratação com snapshot | SUB-02, SUB-03 | Snapshot imutável; unicidade por Proposta | Uma Contratação; snapshot preservado | RN04 observável |
| POS-03 — não volta a `Em revisão` | SUB-01 | Nova versão recusada após aceite | Nova versão recusada | Ciclo de vida protegido |
| FE-01 — versão não vigente | SUB-01, SUB-03, SUB-04, SUB-05 | Recusa informando a versão vigente | 409 com versão vigente | Cliente vê a versão atual |
| FE-02 — `Recusada` ou `Expirada` | SUB-01, SUB-05 | Recusa no agregado | 409 | Exige nova negociação |
| FE-02 — validade vencida | SUB-01 | Relógio injetado (D-UC07-04) | Recusa sem mudar a situação | Proposta vencida não é aceita |
| FE-03 — aceites simultâneos | SUB-03, SUB-05 | Operação atômica; teste HTTP concorrente | Um 201 e um 409; uma Contratação | TC-C3-01 |
| FE-04 — Representante sem vínculo | — | **Sem cobertura neste épico** | — | D-UC07-01 |
| RN04 | SUB-02 | Snapshot imutável | Alterar a origem não altera a Contratação | Acordo preservado |
| RN05 / INV-01 | SUB-01, SUB-02 | Versão aceita no agregado e na Contratação | Sem versão é recusado | Versão aceita identificável |
| INV-02 | SUB-02 | Snapshot congelado | Alteração não tem efeito | Sem alteração retroativa |
| CARD-01 — `1 : 0..1` | SUB-03 | Unicidade por Proposta | Uma única Contratação | Sem duplicidade |
| RN11 | — | **Sem cobertura neste épico** | — | D-UC07-01 |
| RN13 | SUB-02 | Origem `SOB_PROPOSTA` | Contratação nasce com origem | Caminho Sob Proposta identificado |
| Repetição após resposta perdida | SUB-04, SUB-05 | `PropostaJaAceita` com a Contratação existente | 409 com referência | D-UC07-05 |
| ADR-04 — snapshots | SUB-02 | Cópia imutável | Critérios de imutabilidade | Mudança posterior do Serviço não afeta o acordo |
| Documentação | SUB-06 | README e `requests.http` | Exemplos executáveis | Documentação coerente |

## Lacunas apontadas

- **Sem cobertura:** passo 4, FE-04 e RN11, por decisão D-UC07-01. Precisam de um épico futuro junto com UC16/UC17.
- **Dúvida sem regra:** especialista suspenso depois de enviar a Proposta (D-UC07-02). Nenhuma atividade foi criada.
- **Atividades sem origem direta na especificação:** nenhuma. A leitura da Solicitação (SUB-04) decorre de PRE-01 ("Solicitação do Cliente") e da necessidade de identificar as partes na Contratação (D-UC07-09). A SUB-06 decorre do `trabalho5.md` §24.
- **Dependência fora do planejamento:** todo o modelo da Proposta vem do UC06, ainda não especificado. Os critérios de SUB-01 a SUB-03 assumem a estrutura descrita no `trabalho3.md` §5.2 e §11.1.
