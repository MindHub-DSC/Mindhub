# 01-01 — Análise técnica do caso de uso

**Caso de uso:** UC08 — Contratar Serviço de Reserva Direta  
**Contexto:** C3 — Negociação e Contratação (retenção em C4)  
**Classificação no MVP:** Secundário  
**Situação da especificação:** Derivado — a validar  
**Fonte:** `docs/casos-de-uso.md` §4 (UC08) (UC08)  
**Data do planejamento:** 10/11/2026

> **Atenção:** este caso de uso está classificado como *Derivado — a validar* em `docs/casos-de-uso.md`. Os passos marcados **[PROP]** na especificação são hipóteses; este planejamento os trata como **propostas técnicas** e exige a confirmação do responsável antes de qualquer Sub-Issue ir para `Ready` (`docs/casos-de-uso.md` §9).

## 1. Identificação

- **Código e título:** UC08 — Contratar Serviço de Reserva Direta
- **Objetivo:** Contratar uma oferta padronizada em um horário: o Cliente forma a Contratação com o snapshot das condições vigentes e solicita à Agenda a retenção do horário [T5 §3].
- **Escopo no projeto:** Contratação de Serviço de Reserva Direta, correspondente aos passos 1 a 3 do Fluxo A [T3 §1.3]: verificar RN13, formar a Contratação (RN04) e solicitar a retenção pelo contrato C01.
- **Fora do escopo:** a Reserva e suas regras de disponibilidade (UC09, em C4), pagamento (UC10), contratação organizacional por Reserva Direta (não documentada), disponibilidade definida pelo especialista (lacuna), autenticação.

## 2. Atores e papéis

| Ator | Papel no caso de uso |
| --- | --- |
| Cliente | Ator principal; escolhe Serviço e horário |
| Sistema — C3 | Forma a Contratação e solicita a retenção |
| Sistema — C4 (Agenda) | Valida o intervalo e registra a Reserva `Retida` (UC09) |
| Sistema — C2 | Fornece a visão pública do Serviço |

## 3. Pré-condições e pós-condições

**Pré-condições**

- **PRE-01:** Existe um Serviço publicado (UC03). O Modelo de Contratação não é pré-condição: é a RN13 (passo 3).

**Pós-condições**

- **POS-01:** Existe uma Contratação de origem Reserva Direta, sem Proposta.
- **POS-02:** A Contratação preserva o snapshot das condições vigentes (RN04).
- **POS-03:** Existe uma Reserva `Retida` para a Contratação, com prazo definido por C4.

## 4. Fluxos

**Fluxo principal**

1. O Cliente escolhe um Serviço e um horário (início, fim e fuso).
2. O sistema obtém de C2 a visão pública da oferta.
3. O sistema verifica que o Serviço é de Reserva Direta (RN13).
4. O sistema forma a Contratação com o snapshot das condições vigentes (RN04).
5. O sistema solicita à Agenda a retenção do horário (C01), informando duração e valor esperado.
6. A Agenda valida intervalo, duração e disponibilidade e registra a Reserva `Retida` com prazo.
7. O sistema informa o Cliente, com o prazo da retenção.

**Fluxos alternativos e de exceção**

| Código | Tipo | Condição e comportamento |
| --- | --- | --- |
| FE-01 | Fluxo de exceção | Serviço Sob Proposta: recusa com orientação para o UC05 (RN13). |
| FE-02 | Fluxo de exceção | Horário ocupado: recusa da retenção; o Cliente escolhe outro horário. |
| FE-03 | Fluxo de exceção | Intervalo inválido ou duração incompatível: recusa da retenção; o Cliente corrige. |
| FE-04 | Fluxo de exceção | Resposta da retenção perdida: repetir com a mesma identificação recupera a Reserva original. |
| FE-05 | Fluxo de exceção | Preço do Serviço muda depois da contratação: a Contratação mantém as condições aceitas. |
| FE-06 | Fluxo de exceção | Retenção recusada depois de formada a Contratação: a Contratação permanece; o Cliente escolhe outro horário. [PROP] |

## 5. Regras de negócio e invariantes

| ID | Regra | Origem |
| --- | --- | --- |
| RN02 | Confirmação só com intervalo disponível (aplicada pela Agenda). | Documentado |
| RN03 | Sem Reservas confirmadas sobrepostas (aplicada pela Agenda). | Documentado |
| RN04 | Condições aceitas são preservadas na Contratação. | Documentado |
| RN13 | Reserva Direta sem proposta; Sob Proposta com negociação. | Documentado |
| INV-01 | O fim do intervalo é posterior ao início (verificado pela Agenda). | Documentado |

## 6. Validações de entrada e de processamento

- **Documentado:** o intervalo (início, fim e fuso) e a duração são validados pela Agenda (RN02, RN03; fim depois do início); C3 traduz as recusas.
- **Proposta técnica:** identificação da operação (UUID) informada pelo cliente para tornar a repetição segura (C01, FE-04).
- **Proposta técnica:** campos extras proibidos no corpo (`z.strictObject`).

## 7. Componentes e camadas envolvidas

| Componente / camada | Responsabilidade |
| --- | --- |
| C2 — contrato público | Visão do Serviço: especialista, Modelo de Contratação, condições vigentes |
| C3 — domínio | Contratação de origem Reserva Direta com snapshot (RN04) |
| C3 — aplicação | Contratar Reserva Direta, tradução das recusas, repetição segura |
| C4 — contrato C01 | Porta de retenção implementada pelo UC09 |
| C3 — HTTP | Endpoint e tradução de erros |

## 8. Considerações arquiteturais preliminares

Estas considerações são **propostas técnicas** e exigem confirmação, salvo onde indicado o contrário.

- A visão do Serviço é uma interface pública de C2; C3 nunca lê o Agregado Serviço (`trabalho4.md` §6.1).
- O contrato C01 é a única forma de C3 pedir a retenção; C3 informa duração e valor esperado e C4 não recalcula preço.
- A Contratação é formada antes da retenção; em recusa da Agenda ela permanece (FE-06, proposta).
- **Documentado:** monólito modular em contextos C1 a C6 (ADR-01) e módulos NestJS organizados em `dominio`, `aplicacao`, `infra` e `http`, como em `identidade/` e `oferta/` [CÓD].

## 9. Restrições, dúvidas e decisões pendentes

Itens "Dúvida documentada" constam em `docs/casos-de-uso.md`; itens "Proposta técnica" são decisões deste planejamento que dependem de confirmação.

| ID | Item | Natureza | Quem decide | Quando |
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
