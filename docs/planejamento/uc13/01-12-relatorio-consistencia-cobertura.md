# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC13 — Realizar Sessão

## Quantidades

- **Issue principal:** 1 (`[UC13] Realizar Sessão`).
- **Sub-Issues:** 6 (SUB-01 a SUB-06): 6 em C4.
- **Labels novas:** `usecase:uc13`.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pré-condições | 1 | 1 | 0 | 0 |
| Pós-condições | 3 | 3 | 0 | 0 |
| Passos do fluxo principal | 4 | 4 | 0 | 0 |
| Fluxos de exceção | 4 | 4 | 0 | 0 |
| Regras de negócio | 2 | 1 | 1 | 0 |
| Invariantes | 1 | 1 | 0 | 0 |

As coberturas parciais são decisões declaradas: RN12 — a indicação de participantes diferentes do contratante é entregue pelo UC15 (Futuro); aqui só a Participação mínima.

## Dependências críticas

1. **D-UC13-01 e D-UC13-02.** São as dúvidas impeditivas do caso de uso; sem elas, SUB-02 e SUB-04 podem ser reescritas.
2. **UC10.** A criação da Sessão depende do efeito de confirmação do UC10-SUB-06.
3. **UC14.** Consome a Sessão `Concluída`; qualquer mudança de situação afeta RN09.

## Decisões que dependem de validação

| ID | Decisão | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC13-01 | Como a conclusão é reconhecida: declaração do Especialista ou fim da videoconferência [T5 §4.1]. Proposta: declaração do Especialista. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-04 |
| D-UC13-02 | Quando a Sessão é criada: [T3 §7] diz que a Reserva a programa. Proposta: na confirmação da Reserva (UC10). | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC13-03 | Ausência do cliente (no-show), atraso e sessão interrompida: não documentados; nenhuma regra criada. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC13-04 | Anotações, metas e entregas [T1 §3]: fora do catálogo atual. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC13-05 | Provedor real de videoconferência: adaptador simulado nesta etapa. | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC13-06 | Participações iniciais: o Cliente e o Especialista da Contratação (proposta; T3 §6.3 cita especialista, cliente e convidado). | Proposta técnica | @leohsm | Antes da SUB-01 |
| D-UC13-07 | Rotas e códigos HTTP: `POST /sessoes/{id}/inicio` e `POST /sessoes/{id}/conclusao`; 403, 404, 409 e 503. | Proposta técnica | @leohsm | Antes da SUB-05 |
| D-UC13-08 | Origem do identificador do Especialista (D1). | Dúvida documentada | @leohsm | Antes da SUB-05 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| Conclusão reconhecida de forma diferente da planejada | Retrabalho na SUB-04 e na SUB-05 | Fechar D-UC13-01 antes da SUB-04; manter o reconhecimento atrás de uma porta |
| Sessão duplicada por reentrega do fato | Duas Sessões para uma Reserva | Idempotência por Reserva (SUB-01 e SUB-02) |
| Videoconferência instável | Sessão sem ambiente | Manter a Sessão `PROGRAMADA` e repetir (SUB-04) |

**Recomendação para o início:** responder D-UC13-01 e D-UC13-02, iniciar pelas SUB-01 e SUB-03 em paralelo e deixar a SUB-02 para depois do UC10.
