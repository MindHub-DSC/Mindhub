# 01-01 — Análise técnica do caso de uso

**Caso de uso:** UC13 — Realizar Sessão  
**Contexto:** C4 — Agenda e Atendimento  
**Classificação no MVP:** Central  
**Situação da especificação:** Derivado — a validar  
**Fonte:** `docs/casos-de-uso.md` §5 (UC13) (UC13)  
**Data do planejamento:** 10/11/2026

> **Atenção:** este caso de uso está classificado como *Derivado — a validar* em `docs/casos-de-uso.md`. Os passos marcados **[PROP]** na especificação são hipóteses; este planejamento os trata como **propostas técnicas** e exige a confirmação do responsável antes de qualquer Sub-Issue ir para `Ready` (`docs/casos-de-uso.md` §9).

## 1. Identificação

- **Código e título:** UC13 — Realizar Sessão
- **Objetivo:** Prestar o atendimento contratado: o Especialista inicia e conclui a Sessão `Programada`, com apoio do serviço de videoconferência [T5 §3].
- **Escopo no projeto:** Ciclo `Programada → Em andamento → Concluída` da Sessão, ambiente remoto pela porta de videoconferência e habilitação da avaliação (RN09).
- **Fora do escopo:** no-show, atraso e sessão interrompida (não documentados), anotações, metas e entregas (fora do catálogo), cancelamento da Sessão (UC12), videoconferência real (adaptador simulado).

## 2. Atores e papéis

| Ator | Papel no caso de uso |
| --- | --- |
| Especialista | Ator principal; inicia e conclui a Sessão |
| Serviço de videoconferência | Fornece o ambiente remoto da sessão |
| Cliente | Informado da conclusão; passa a poder avaliar (UC14) |

## 3. Pré-condições e pós-condições

**Pré-condições**

- **PRE-01:** Existe uma Sessão `Programada`, originada de uma Reserva `Confirmada` (UC10).

**Pós-condições**

- **POS-01:** A Sessão está `Concluída`.
- **POS-02:** A Sessão pertence a uma Contratação e possui pelo menos uma Participação.
- **POS-03:** O cliente passa a poder avaliar a Sessão (RN09).

## 4. Fluxos

**Fluxo principal**

1. No horário programado, o Especialista inicia o atendimento; o sistema obtém do Serviço de videoconferência o ambiente remoto.
2. A Sessão passa a `Em andamento`.
3. Ao terminar, a conclusão é reconhecida e a Sessão passa a `Concluída`.
4. O sistema informa o cliente e habilita o UC14.

**Fluxos alternativos e de exceção**

| Código | Tipo | Condição e comportamento |
| --- | --- | --- |
| FE-01 | Fluxo de exceção | Sessão não `Programada` (por exemplo, `Cancelada`): recusa ao iniciar. |
| FE-02 | Fluxo de exceção | Ator não é o especialista da Contratação: recusa. [PROP] |
| FE-03 | Fluxo de exceção | Serviço de videoconferência indisponível: a Sessão não muda; o especialista pode tentar de novo. [PROP] |
| FE-04 | Fluxo de exceção | Conclusão registrada duas vezes: nenhum efeito adicional. [PROP] |

## 5. Regras de negócio e invariantes

| ID | Regra | Origem |
| --- | --- | --- |
| RN09 | A avaliação só pode ser feita pelo cliente de Sessão concluída. | Documentado |
| RN12 | Contratante e participantes podem ser pessoas diferentes. | Documentado |
| INV-01 | Toda Sessão pertence a uma Contratação; Sessão — Participação `1 : 1..*`; Reserva — Sessão `1 : 0..1`. | Documentado |

## 6. Validações de entrada e de processamento

- **Documentado:** transições válidas `Programada → Em andamento → Concluída`; invariantes: toda Sessão pertence a uma Contratação e tem ao menos uma Participação.
- **Proposta técnica:** a conclusão é informada pelo Especialista (D-UC13-01); campos extras proibidos no corpo HTTP.

## 7. Componentes e camadas envolvidas

| Componente / camada | Responsabilidade |
| --- | --- |
| C4 — domínio | Sessão, Participação, ciclo de vida |
| C4 — aplicação | Criar Sessão da Reserva confirmada; Iniciar e Concluir |
| C4 — adaptador | Porta e adaptador simulado do Serviço de videoconferência |
| C4 — HTTP | Endpoints de início e conclusão |

## 8. Considerações arquiteturais preliminares

Estas considerações são **propostas técnicas** e exigem confirmação, salvo onde indicado o contrário.

- A Sessão é Agregado próprio, ligada à Reserva (`1 : 0..1`) e à Contratação; a Participação é entidade associativa (`trabalho3.md` §6.3).
- A videoconferência é isolada por porta; sua falha não muda a Sessão (FE-03).
- A criação da Sessão reage à confirmação da Reserva do UC10, com idempotência.
- **Documentado:** monólito modular em contextos C1 a C6 (ADR-01) e módulos NestJS organizados em `dominio`, `aplicacao`, `infra` e `http`, como em `identidade/` e `oferta/` [CÓD].

## 9. Restrições, dúvidas e decisões pendentes

Itens "Dúvida documentada" constam em `docs/casos-de-uso.md`; itens "Proposta técnica" são decisões deste planejamento que dependem de confirmação.

| ID | Item | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC13-01 | Como a conclusão é reconhecida: declaração do Especialista ou fim da videoconferência [T5 §4.1]. Proposta: declaração do Especialista. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-04 |
| D-UC13-02 | Quando a Sessão é criada: [T3 §7] diz que a Reserva a programa. Proposta: na confirmação da Reserva (UC10). | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC13-03 | Ausência do cliente (no-show), atraso e sessão interrompida: não documentados; nenhuma regra criada. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC13-04 | Anotações, metas e entregas [T1 §3]: fora do catálogo atual. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC13-05 | Provedor real de videoconferência: adaptador simulado nesta etapa. | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC13-06 | Participações iniciais: o Cliente e o Especialista da Contratação (proposta; T3 §6.3 cita especialista, cliente e convidado). | Proposta técnica | @leohsm | Antes da SUB-01 |
| D-UC13-07 | Rotas e códigos HTTP: `POST /sessoes/{id}/inicio` e `POST /sessoes/{id}/conclusao`; 403, 404, 409 e 503. | Proposta técnica | @leohsm | Antes da SUB-05 |
| D-UC13-08 | Origem do identificador do Especialista (D1). | Dúvida documentada | @leohsm | Antes da SUB-05 |
