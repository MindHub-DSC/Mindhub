# 01-01 — Análise técnica do caso de uso

**Caso de uso:** UC09 — Agendar Sessão Contratada  
**Contexto:** C4 — Agenda e Atendimento (iniciado por C3 pelo contrato C01)  
**Classificação no MVP:** Central  
**Situação da especificação:** Derivado — a validar  
**Fonte:** `docs/casos-de-uso.md` §5 (UC09) (UC09)  
**Data do planejamento:** 10/11/2026

> **Atenção:** este caso de uso está classificado como *Derivado — a validar* em `docs/casos-de-uso.md`. Os passos marcados **[PROP]** na especificação são hipóteses; este planejamento os trata como **propostas técnicas** e exige a confirmação do responsável antes de qualquer Sub-Issue ir para `Ready` (`docs/casos-de-uso.md` §9).

## 1. Identificação

- **Código e título:** UC09 — Agendar Sessão Contratada
- **Objetivo:** Escolher o horário de uma Contratação sob proposta: o Cliente obtém uma Reserva `Retida`, com intervalo e limite de validade, pelo contrato C01 [T5 §3].
- **Escopo no projeto:** Retenção atômica e idempotente de um horário para uma Contratação formada (contrato C01 completo), incluindo a liberação da retenção expirada por tempo.
- **Fora do escopo:** pagamento e confirmação da Reserva (UC10), reagendamento (UC11), cancelamento (UC12), definição de disponibilidade do especialista (lacuna), pacotes com várias sessões (D-UC09-01), contratação organizacional (RN11), persistência durável.

## 2. Atores e papéis

| Ator | Papel no caso de uso |
| --- | --- |
| Cliente | Ator principal; escolhe o intervalo |
| Sistema — C3 | Reconhece a Contratação e solicita a retenção (C01) |
| Sistema — C4 (Agenda) | Valida e registra a Reserva `Retida` |

## 3. Pré-condições e pós-condições

**Pré-condições**

- **PRE-01:** Existe uma Contratação formada (UC07).

**Pós-condições**

- **POS-01:** Existe uma Reserva `Retida` para a Contratação, com intervalo e limite de validade.
- **POS-02:** A Reserva conserva o valor esperado recebido de C3 (C4 não recalcula preço).
- **POS-03:** Nenhuma retenção válida incompatível foi produzida para o mesmo especialista.

## 4. Fluxos

**Fluxo principal**

1. O Cliente escolhe o intervalo da sessão (início, fim e fuso).
2. C3 reconhece a Contratação e verifica que o ator é o cliente dela.
3. C3 solicita a retenção (C01) com identificação, Contratação, condições, especialista, cliente, intervalo, duração e valor esperado.
4. A Agenda valida o intervalo, a duração contratada e a disponibilidade (RN02, RN03).
5. A Agenda registra a Reserva `Retida` e seu prazo, de forma atômica com a verificação de disponibilidade.
6. O sistema informa o Cliente: Reserva, intervalo e limite de validade.

**Fluxos alternativos e de exceção**

| Código | Tipo | Condição e comportamento |
| --- | --- | --- |
| FA-01 | Fluxo alternativo | Repetição reconhecida: devolve a mesma Reserva e sua situação atual. |
| FA-02 | Fluxo alternativo | Repetição após a expiração: informa a situação atual; não renova a retenção. |
| FE-01 | Fluxo de exceção | Intervalo ou duração inválidos: recusa com motivo; nada é registrado. |
| FE-02 | Fluxo de exceção | Horário ocupado: recusa; a operação vencedora é preservada. |
| FE-03 | Fluxo de exceção | Mesma identificação com outro intervalo: recusa por conflito. |
| FE-04 | Fluxo de exceção | Resposta perdida após a gravação: repetir a identificação recupera a Reserva. |
| FE-05 | Fluxo de exceção | Dois pedidos concorrentes para intervalos incompatíveis: apenas um recebe retenção válida (TC-C4-01). |
| FE-06 | Fluxo de exceção | Ator não é o cliente da Contratação: recusa. [PROP] |
| FE-07 | Fluxo de exceção | Prazo da retenção vence antes do pagamento: a Reserva é liberada por política de domínio (RN08 por tempo). |

## 5. Regras de negócio e invariantes

| ID | Regra | Origem |
| --- | --- | --- |
| RN02 | Confirmação só com intervalo disponível. | Documentado |
| RN03 | Sem Reservas sobrepostas para o mesmo especialista. | Documentado |
| RN08 | Expiração libera a retenção. | Documentado |
| RN11 | Em contratação organizacional, o sistema verifica o vínculo. | Documentado |
| INV-01 | O fim do intervalo é posterior ao início. | Documentado |

## 6. Validações de entrada e de processamento

- **Documentado:** fim do intervalo posterior ao início; compatibilidade com a duração contratada; disponibilidade do especialista (RN02, RN03).
- **Proposta técnica (T4 §8.1.4):** intervalos comparados com início incluído e fim excluído, permitindo sessões adjacentes.
- **Proposta técnica:** identificação da operação em UUID, fornecida por C3; campos extras proibidos no corpo HTTP.

## 7. Componentes e camadas envolvidas

| Componente / camada | Responsabilidade |
| --- | --- |
| C4 — domínio | Reserva, Intervalo de Tempo, situações `Retida` e `Liberada` |
| C4 — repositório | Registro atômico com disponibilidade e idempotência |
| C4 — aplicação (contrato C01) | Porta pública de retenção, expiração |
| C3 — aplicação | Reconhecimento da Contratação e do ator; chamada a C01 |
| C3 — HTTP | Endpoint e tradução de erros |

## 8. Considerações arquiteturais preliminares

Estas considerações são **propostas técnicas** e exigem confirmação, salvo onde indicado o contrário.

- A Reserva guarda o valor esperado recebido de C3 e não recalcula preço; também guarda a referência da Contratação e das condições aceitas.
- A atomicidade entre verificar disponibilidade e gravar é exigida pela documentação; em memória é uma seção crítica, e um banco exigirá restrição de exclusão ou bloqueio (D-UC09-08).
- A expiração é política de domínio disparada por tempo, não ação do usuário (`trabalho5.md` §4.2).
- **Documentado:** monólito modular em contextos C1 a C6 (ADR-01) e módulos NestJS organizados em `dominio`, `aplicacao`, `infra` e `http`, como em `identidade/` e `oferta/` [CÓD].

## 9. Restrições, dúvidas e decisões pendentes

Itens "Dúvida documentada" constam em `docs/casos-de-uso.md`; itens "Proposta técnica" são decisões deste planejamento que dependem de confirmação.

| ID | Item | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC09-01 | Pacotes: quando a Contratação prevê várias sessões, uma Reserva por sessão ou várias de uma vez? Este planejamento trata uma Reserva por chamada. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-03 |
| D-UC09-02 | Disponibilidade do especialista: o que torna um horário disponível além de não colidir com outras Reservas (lacuna `casos-de-uso.md` §8)? | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC09-03 | Intervalo de preparação entre sessões: precisa de validação do domínio. Não implementado. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC09-04 | Prazo numérico da retenção e prazo de histórico das operações. Proposta: valor configurável. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-03 |
| D-UC09-05 | Exclusividade das retenções (não só das confirmadas): hipótese de T4 §8.1.4 que complementa RN03. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC09-06 | Intervalos com início incluído e fim excluído (proposta de T4 §8.1.4). | Proposta técnica | @leohsm | Antes da SUB-01 |
| D-UC09-07 | Mecanismo de expiração: verificação no momento do acesso mais varredura periódica no processo, com relógio injetável. | Proposta técnica | @leohsm | Antes da SUB-05 |
| D-UC09-08 | Persistência em memória nesta etapa; exclusão de sobreposição no banco só na persistência durável. | Proposta técnica | @leohsm | Antes da SUB-02 |
| D-UC09-09 | Origem do identificador do Cliente (D1). | Dúvida documentada | @leohsm | Antes da SUB-06 |
| D-UC09-10 | Rota e códigos HTTP: `POST /contratacoes/{id}/reservas`; 409 horário ocupado e conflito de identificação, 422 intervalo inválido, 403 ator não cliente. | Proposta técnica | @leohsm | Antes da SUB-06 |
