# 01-01 — Análise técnica do caso de uso

**Caso de uso:** UC11 — Reagendar Sessão  
**Contexto:** C4 — Agenda e Atendimento  
**Classificação no MVP:** Secundário  
**Situação da especificação:** Derivado — a validar  
**Fonte:** `docs/casos-de-uso.md` §5 (UC11) (UC11)  
**Data do planejamento:** 10/11/2026

> **Atenção:** este caso de uso está classificado como *Derivado — a validar* em `docs/casos-de-uso.md`. Os passos marcados **[PROP]** na especificação são hipóteses; este planejamento os trata como **propostas técnicas** e exige a confirmação do responsável antes de qualquer Sub-Issue ir para `Ready` (`docs/casos-de-uso.md` §9).

## 1. Identificação

- **Código e título:** UC11 — Reagendar Sessão
- **Objetivo:** Mudar o horário mantendo a Reserva: o Cliente ou o Especialista move a Reserva `Confirmada` para outro intervalo disponível [T5 §3].
- **Escopo no projeto:** Troca atômica do intervalo de uma Reserva `Confirmada`, preservando identidade, Contratação e Pagamento, com verificação de RN02, RN03 e RN14.
- **Fora do escopo:** concordância da outra parte, antecedência mínima e limite de reagendamentos (não documentados), efeito sobre a Sessão `Programada` (D-UC11-03), cancelamento (UC12), persistência durável.

## 2. Atores e papéis

| Ator | Papel no caso de uso |
| --- | --- |
| Cliente ou Especialista | Ator principal; propõe o novo intervalo |
| Sistema — C4 | Verifica disponibilidade e troca o intervalo |
| Serviço de notificações | Avisa as duas partes [PROP] |

## 3. Pré-condições e pós-condições

**Pré-condições**

- **PRE-01:** Existe uma Reserva `Confirmada` (UC10).

**Pós-condições**

- **POS-01:** A Reserva continua `Confirmada`, com o novo Intervalo de Tempo.
- **POS-02:** A identidade da Reserva é preservada.
- **POS-03:** Nenhuma Reserva confirmada do especialista se sobrepõe ao novo intervalo (RN03).

## 4. Fluxos

**Fluxo principal**

1. O ator escolhe a Reserva e o novo intervalo.
2. O sistema verifica que o ator é o cliente ou o especialista da Contratação [PROP].
3. A Agenda verifica que o novo intervalo satisfaz as regras de uma nova reserva (RN14, RN02, RN03), desconsiderando o intervalo atual da própria Reserva [PROP].
4. A Agenda troca o intervalo de forma atômica.
5. O sistema informa as duas partes.

**Fluxos alternativos e de exceção**

| Código | Tipo | Condição e comportamento |
| --- | --- | --- |
| FE-01 | Fluxo de exceção | Novo intervalo ocupado: recusa; a Reserva mantém o horário anterior e a identidade. |
| FE-02 | Fluxo de exceção | Intervalo inválido ou incompatível com a duração contratada: recusa; nada muda. |
| FE-03 | Fluxo de exceção | Reserva não está `Confirmada`: recusa. |
| FE-04 | Fluxo de exceção | Ator não é parte da Contratação: recusa. [PROP] |
| FE-05 | Fluxo de exceção | Dois reagendamentos concorrentes para o mesmo intervalo: apenas um é aplicado. |

## 5. Regras de negócio e invariantes

| ID | Regra | Origem |
| --- | --- | --- |
| RN02 | Confirmação só com intervalo disponível. | Documentado |
| RN03 | Sem Reservas confirmadas sobrepostas. | Documentado |
| RN14 | Reagendamento só com disponibilidade. | Documentado |

## 6. Validações de entrada e de processamento

- **Documentado:** fim do intervalo posterior ao início; compatibilidade com a duração contratada; disponibilidade como em uma nova reserva (RN14, RN02, RN03).
- **Proposta técnica:** o intervalo atual da própria Reserva é desconsiderado na verificação de sobreposição.
- **Proposta técnica:** campos extras proibidos no corpo HTTP.

## 7. Componentes e camadas envolvidas

| Componente / camada | Responsabilidade |
| --- | --- |
| C4 — domínio | Operação `reagendar` na Reserva `Confirmada` |
| C4 — repositório | Troca atômica do intervalo |
| C4 — aplicação | Autorização pela Contratação, delegação, aviso |
| C4 — HTTP | Endpoint e tradução de erros |

## 8. Considerações arquiteturais preliminares

Estas considerações são **propostas técnicas** e exigem confirmação, salvo onde indicado o contrário.

- O reagendamento preserva a identidade da Reserva (`trabalho3.md` §5.1; TC-C4-01); só o intervalo muda.
- A troca é atômica: não há momento em que a Reserva ocupe dois intervalos nem nenhum.
- A autorização usa a Contratação (cliente ou especialista) para decidir se o ator é parte, sem criar papéis.
- **Documentado:** monólito modular em contextos C1 a C6 (ADR-01) e módulos NestJS organizados em `dominio`, `aplicacao`, `infra` e `http`, como em `identidade/` e `oferta/` [CÓD].

## 9. Restrições, dúvidas e decisões pendentes

Itens "Dúvida documentada" constam em `docs/casos-de-uso.md`; itens "Proposta técnica" são decisões deste planejamento que dependem de confirmação.

| ID | Item | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC11-01 | A outra parte precisa concordar com o novo horário? Não documentado; nenhuma etapa de concordância foi criada. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC11-02 | Antecedência mínima e limite de reagendamentos: não documentados. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC11-03 | Efeito sobre a Sessão `Programada` ligada à Reserva (Reserva — Sessão `1 : 0..1`): não documentado. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-03 |
| D-UC11-04 | Autorização: ator é o cliente ou o especialista da Contratação (proposta derivada de T1 §2). | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC11-05 | Aviso às duas partes pela porta de notificações; falha não desfaz o reagendamento. | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC11-06 | Rota e códigos HTTP: `POST /reservas/{id}/reagendamento`; 409 intervalo ocupado ou Reserva não confirmada, 422 intervalo inválido, 403 ator não parte. | Proposta técnica | @leohsm | Antes da SUB-04 |
| D-UC11-07 | Origem do identificador do ator (D1). | Dúvida documentada | @leohsm | Antes da SUB-04 |
