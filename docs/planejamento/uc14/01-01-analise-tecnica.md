# 01-01 — Análise técnica do caso de uso

**Caso de uso:** UC14 — Avaliar Sessão  
**Contexto:** C4 — Agenda e Atendimento  
**Classificação no MVP:** Secundário  
**Situação da especificação:** Derivado — a validar  
**Fonte:** `docs/casos-de-uso.md` §5 (UC14) (UC14)  
**Data do planejamento:** 10/11/2026

> **Atenção:** este caso de uso está classificado como *Derivado — a validar* em `docs/casos-de-uso.md`. Os passos marcados **[PROP]** na especificação são hipóteses; este planejamento os trata como **propostas técnicas** e exige a confirmação do responsável antes de qualquer Sub-Issue ir para `Ready` (`docs/casos-de-uso.md` §9).

## 1. Identificação

- **Código e título:** UC14 — Avaliar Sessão
- **Objetivo:** Registrar opinião sobre o atendimento: o Cliente avalia a Sessão `Concluída`, uma única vez [T5 §3].
- **Escopo no projeto:** Registro da Avaliação do cliente de uma Sessão concluída, com RN09 e RN10 e unicidade atômica (TC-C4-02).
- **Fora do escopo:** resposta do especialista e reputação agregada (capacidades futuras sem regras), edição da Avaliação e prazo para avaliar (não documentados), contratação organizacional (quem avalia).

## 2. Atores e papéis

| Ator | Papel no caso de uso |
| --- | --- |
| Cliente | Ator principal; avalia a Sessão |
| Sistema — C4 | Verifica elegibilidade e registra a Avaliação |

## 3. Pré-condições e pós-condições

**Pré-condições**

- **PRE-01:** Existe a Sessão (UC13). A situação `Concluída` e a ausência de Avaliação não são pré-condições: são RN09 e RN10.

**Pós-condições**

- **POS-01:** Existe uma Avaliação do cliente referenciando uma Sessão concluída.
- **POS-02:** Existe no máximo uma Avaliação do cliente para a Sessão (RN10).

## 4. Fluxos

**Fluxo principal**

1. O Cliente escolhe a Sessão e informa sua avaliação.
2. O sistema verifica que o autor é o cliente da Sessão e que a Sessão está `Concluída` (RN09).
3. O sistema registra a Avaliação garantindo que não exista outra do mesmo cliente (RN10), de forma atômica.
4. O sistema informa o Cliente.

**Fluxos alternativos e de exceção**

| Código | Tipo | Condição e comportamento |
| --- | --- | --- |
| FE-01 | Fluxo de exceção | Sessão não `Concluída`: recusa (RN09); nada é registrado. |
| FE-02 | Fluxo de exceção | Autor não é o cliente da Sessão: recusa (RN09). |
| FE-03 | Fluxo de exceção | Já existe Avaliação do cliente: recusa (RN10). |
| FE-04 | Fluxo de exceção | Duas avaliações simultâneas: apenas uma é registrada (TC-C4-02). |

## 5. Regras de negócio e invariantes

| ID | Regra | Origem |
| --- | --- | --- |
| RN09 | Só o cliente de uma Sessão concluída avalia. | Documentado |
| RN10 | No máximo uma Avaliação por Sessão do cliente. | Documentado |
| INV-01 | Sessão — Avaliação `1 : 0..1`; a Avaliação referencia Sessão concluída. | Documentado |

## 6. Validações de entrada e de processamento

- **Documentado:** a Sessão deve estar `Concluída` (RN09) e o autor deve ser o cliente da Sessão; não pode existir outra Avaliação do mesmo cliente para a Sessão (RN10).
- **Proposta técnica (D-UC14-01):** nota inteira de 1 a 5 e comentário opcional com limite de tamanho; campos extras proibidos.

## 7. Componentes e camadas envolvidas

| Componente / camada | Responsabilidade |
| --- | --- |
| C4 — domínio | Avaliação |
| C4 — repositório | Unicidade por Sessão e cliente |
| C4 — aplicação | Serviço Avaliar Sessão |
| C4 — HTTP | Endpoint |

## 8. Considerações arquiteturais preliminares

Estas considerações são **propostas técnicas** e exigem confirmação, salvo onde indicado o contrário.

- A Avaliação referencia a Sessão por identificador; a unicidade `Sessão — Avaliação 1 : 0..1` é aplicada no repositório de forma atômica.
- A elegibilidade (RN09) é verificada no serviço com a Sessão do UC13, sem copiar a situação da Sessão.
- **Documentado:** monólito modular em contextos C1 a C6 (ADR-01) e módulos NestJS organizados em `dominio`, `aplicacao`, `infra` e `http`, como em `identidade/` e `oferta/` [CÓD].

## 9. Restrições, dúvidas e decisões pendentes

Itens "Dúvida documentada" constam em `docs/casos-de-uso.md`; itens "Proposta técnica" são decisões deste planejamento que dependem de confirmação.

| ID | Item | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC14-01 | Conteúdo da Avaliação (nota, escala, comentário): não definido. Proposta: nota inteira de 1 a 5 e comentário opcional. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC14-02 | Prazo para avaliar e possibilidade de editar: não documentados; a Avaliação não tem edição. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC14-03 | Em contratação organizacional, quem é o cliente que avalia (contratante ou participantes)? RN09 fala em cliente. | Dúvida documentada | @leohsm (domínio) | Antes dos UC15/UC16 |
| D-UC14-04 | Resposta do especialista e reputação agregada: capacidades futuras sem regras; não planejadas. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC14-05 | Rota e códigos HTTP: `POST /sessoes/{id}/avaliacao`; 403, 404, 409 (já avaliada ou Sessão não concluída) e 422. | Proposta técnica | @leohsm | Antes da SUB-04 |
| D-UC14-06 | Origem do identificador do Cliente (D1). | Dúvida documentada | @leohsm | Antes da SUB-04 |
