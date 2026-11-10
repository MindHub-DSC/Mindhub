# 01-05 — Matriz de rastreabilidade

**Caso de uso:** UC10 — Pagar Reserva

| Requisito / regra / fluxo | Sub-Issue | Atividade técnica | Critério de aceite vinculado | Comportamento a verificar |
| --- | --- | --- | --- | --- |
| PRE-01 — Reserva `Retida`, no prazo, ligada a Contratação | SUB-03, SUB-04 | Visão da retenção; conferência no serviço | `ReservaNaoRetida`; `PrazoDaRetencaoVencido`; 409 | Só reserva retida e válida é cobrada |
| Passo 1 — Cliente solicita o pagamento | SUB-04, SUB-07 | Command; `POST /reservas/{id}/pagamentos` | `AgenteNaoAutorizado`; 403 | Só o cliente da Reserva paga |
| Passo 2 — Pagamento `Pendente` com valor esperado | SUB-01, SUB-03, SUB-04 | Agregado; correlação em C4; valor vindo de C4 | Nasce `Pendente` com o valor esperado | Cliente não define o valor |
| Passo 2 — correlação antes da cobrança | SUB-03, SUB-04 | `registrarPagamentoEsperado` antes de `solicitarCobranca` | Correlação recusada → nenhuma cobrança | Ordem de C02 §8.2.1 |
| Passo 3 — solicitar cobrança | SUB-02, SUB-04 | Porta do Provedor; idempotência por `pagamentoId` | Sem segunda cobrança | Cobrança única por Pagamento |
| Passo 4 — Provedor informa (assíncrono) | SUB-02, SUB-07 | Tradução; `POST /pagamentos/retorno-provedor` | Retorno traduzido; 401 sem segredo | Resultado externo vira resultado da Mindhub |
| Passo 5 — `Aprovado` | SUB-01, SUB-05 | Transição e fato gravados juntos | Um fato por transição | Estado financeiro decidido em C5 |
| Passo 6 — Agenda confirma (RN02, RN07) | SUB-06 | Consumidor confere correlação, valor, prazo e sobreposição | Aprovação válida confirma | C4 decide a Reserva |
| Passo 7 — Cliente informado | SUB-06, SUB-07 | Porta de aviso de C4; `GET /pagamentos/{id}` | Falha do aviso tolerada | Cliente toma conhecimento |
| POS-01 — `Aprovado` | SUB-01, SUB-05 | Transição | `Pendente` → `Aprovado` | Pós-condição financeira |
| POS-02 — `Confirmada` uma única vez | SUB-06 | Deduplicação + atomicidade local | Confirmação única | RN06 no consumidor |
| FA-01 — recusado | SUB-01, SUB-05, SUB-06 | `Recusado`; liberação conforme D-UC10-01 | Reserva `Liberada` | RN08 |
| FA-02 — expira | SUB-01, SUB-05, SUB-06 | `Expirado` informado pelo provedor; liberação | Reserva `Liberada` | RN08 (origem em D-UC10-05) |
| FA-03 — nova tentativa | SUB-01, SUB-03, SUB-04 | Novo Pagamento; correlação substituída quando permitido | Identidade própria | Condicionado a D-UC10-01 e D-UC10-03 |
| FE-01 — confirmação repetida | SUB-01, SUB-05, SUB-06 | `JA_REGISTRADO` em C5; deduplicação em C4 | Uma confirmação; 200 repetido | RN06, TC-C5-01 |
| FE-02 — aprovação após liberação | SUB-06, SUB-07 | Sem efeito; divergência registrada | Reserva não reconfirmada | TC-C5-02 |
| FE-03 — valor ou moeda divergente | SUB-06 | Conferência com valor esperado | Pendência sem alteração | TC-C5-02 |
| FE-04 — provedor não responde | SUB-02, SUB-04, SUB-07 | `RESULTADO_DESCONHECIDO`; Pagamento `Pendente` | Nada presumido | Recuperação fora (D-UC10-07) |
| RN02 / RN03 | SUB-06 | Conferência de sobreposição na confirmação | Sem sobreposição | INV-RES |
| RN06 | SUB-01, SUB-05, SUB-06 | Idempotência nas duas camadas | Efeito único | Repetição sem efeito |
| RN07 | SUB-06 | Confirmação por aprovação | `Retida` → `Confirmada` | Efeito da aprovação |
| RN08 | SUB-06 | Liberação por recusa ou expiração | `Retida` → `Liberada` | Efeito da recusa |
| INV-PAG | SUB-01 | Resultado contraditório preserva o estado | Estado reconhecido mantido | Sem estados exclusivos |
| Tentativa antiga (C02 §8.2.4) | SUB-06 | Correlação atual conferida | Recusa antiga sem efeito | TC-C5-02 |
| Entrega repetível (C02 §8.2.5) | SUB-05 | Outbox e despachante | Fato reentregue | TC-C5-01 |
| Documentação | SUB-08 | README e `requests.http` | Exemplos executáveis | Documentação coerente |

## Lacunas apontadas

- **Cobertura condicionada:** FA-01 e FA-03 dependem da decisão D-UC10-01. As duas opções foram previstas: só a regra da SUB-06 muda.
- **Cobertura parcial:** FA-02 cobre apenas a expiração informada pelo provedor (D-UC10-05); FE-04 cobre a ausência de presunção, mas não a recuperação ativa (D-UC10-07); FE-02 e FE-03 registram a pendência, mas não há política de reconciliação (D-UC10-08).
- **Atividades sem origem direta na especificação:** nenhuma. O despachante (SUB-05) decorre de C02 §8.2.5 e do `trabalho4.md` §7; a autenticação do retorno (SUB-07) decorre da necessidade de não aceitar resultado financeiro de qualquer origem. A SUB-08 decorre do `trabalho5.md` §24.
- **Dependência fora do planejamento:** a Reserva retida vem do UC09, ainda não especificado.
