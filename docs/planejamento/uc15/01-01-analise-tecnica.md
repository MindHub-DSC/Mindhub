# 01-01 — Análise técnica do caso de uso

**Caso de uso:** UC15 — Indicar Participantes da Sessão  
**Contexto:** C4 — Agenda e Atendimento (consulta C1)  
**Classificação no MVP:** Futuro  
**Situação da especificação:** Derivado — a validar  
**Fonte:** `docs/casos-de-uso.md` §5 (UC15) (UC15)  
**Data do planejamento:** 10/11/2026

> **Atenção:** este caso de uso está classificado como *Derivado — a validar* em `docs/casos-de-uso.md`. Os passos marcados **[PROP]** na especificação são hipóteses; este planejamento os trata como **propostas técnicas** e exige a confirmação do responsável antes de qualquer Sub-Issue ir para `Ready` (`docs/casos-de-uso.md` §9). Além disso, o caso de uso é classificado como **Futuro** no MVP: o planejamento existe para completar o catálogo, mas a implementação só deve começar depois que as dúvidas impeditivas citadas abaixo forem respondidas.

## 1. Identificação

- **Código e título:** UC15 — Indicar Participantes da Sessão
- **Objetivo:** Definir quem será atendido: o Representante de uma organização indica os membros que participarão da Sessão, que podem diferir do contratante [T5 §3].
- **Escopo no projeto:** Indicação de Participações em uma Sessão por um Representante com vínculo compatível (RN11), com verificação dos membros em C1 (RN12).
- **Fora do escopo:** limite de participantes, papéis fixos e indicação por Contratação (não documentados), atualização automática diante de vínculos revogados, avisos reais aos participantes.

## 2. Atores e papéis

| Ator | Papel no caso de uso |
| --- | --- |
| Representante de organização | Ator principal; indica os membros |
| Sistema — C1 | Fornece a verificação de vínculos |
| Sistema — C4 | Registra as Participações |

## 3. Pré-condições e pós-condições

**Pré-condições**

- **PRE-01:** Existe uma Contratação organizacional (UC07 ou UC08) e a Sessão correspondente.
- **PRE-02:** Os membros a indicar estão vinculados à Organização (UC17).

**Pós-condições**

- **POS-01:** Existem Participações que ligam cada membro indicado à Sessão, com seu papel.
- **POS-02:** Contratante e participantes podem ser pessoas diferentes (RN12).

## 4. Fluxos

**Fluxo principal**

1. O Representante escolhe a Sessão e indica os membros participantes.
2. O sistema verifica, em C1, que o Representante tem vínculo compatível (RN11).
3. O sistema verifica, em C1, que cada membro é vinculado à Organização.
4. O sistema registra as Participações.
5. O sistema informa o Representante; os participantes são avisados [PROP].

**Fluxos alternativos e de exceção**

| Código | Tipo | Condição e comportamento |
| --- | --- | --- |
| FE-01 | Fluxo de exceção | Representante sem vínculo compatível: recusa (RN11). |
| FE-02 | Fluxo de exceção | Membro sem vínculo com a Organização: recusa da indicação desse membro. [PROP] |
| FE-03 | Fluxo de exceção | Vínculo de um membro revogado depois da indicação: a Participação não é alterada automaticamente. |
| FE-04 | Fluxo de exceção | Sessão `Concluída` ou `Cancelada`: recusa. [PROP] |

## 5. Regras de negócio e invariantes

| ID | Regra | Origem |
| --- | --- | --- |
| RN11 | Agir em nome de organização exige vínculo compatível. | Documentado |
| RN12 | Contratante e participantes podem diferir. | Documentado |
| INV-01 | Sessão — Participação `1 : 1..*`; Participação é entidade associativa. | Documentado |

## 6. Validações de entrada e de processamento

- **Documentado:** o Representante tem vínculo compatível (RN11); cada membro é vinculado à Organização; a Sessão não está `Concluída` nem `Cancelada` (FE-04, [PROP]).
- **Proposta técnica:** lista de membros sem repetição; campos extras proibidos.

## 7. Componentes e camadas envolvidas

| Componente / camada | Responsabilidade |
| --- | --- |
| C1 — contrato público | Visão de vínculos: representante e membros |
| C4 — domínio | Participação na Sessão |
| C4 — aplicação | Serviço Indicar Participantes |
| C4 — HTTP | Endpoint |

## 8. Considerações arquiteturais preliminares

Estas considerações são **propostas técnicas** e exigem confirmação, salvo onde indicado o contrário.

- C4 nunca lê o Agregado de Organização; pergunta a C1 pela visão pública (T4 TC-C1-02).
- A Participação é registrada por referência ao Usuário e não é alterada quando o vínculo é revogado depois (FE-03).
- **Documentado:** monólito modular em contextos C1 a C6 (ADR-01) e módulos NestJS organizados em `dominio`, `aplicacao`, `infra` e `http`, como em `identidade/` e `oferta/` [CÓD].

## 9. Restrições, dúvidas e decisões pendentes

Itens "Dúvida documentada" constam em `docs/casos-de-uso.md`; itens "Proposta técnica" são decisões deste planejamento que dependem de confirmação.

| ID | Item | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC15-01 | Limite de participantes por Sessão: não documentado; nenhuma regra criada. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC15-02 | Os papéis da Participação (especialista, cliente, convidado) são fixos? Não documentado. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC15-03 | A indicação é por Sessão ou para toda a Contratação? Este planejamento trata por Sessão. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC15-04 | Membro sem vínculo recusa só essa indicação (proposta do documento) ou toda a lista? Proposta: toda a lista, sem registro parcial. | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC15-05 | Aviso aos participantes pela porta de notificações; falha não desfaz a indicação. | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC15-06 | Rota e códigos HTTP: `POST /sessoes/{id}/participantes`; 403, 404, 409 e 422. | Proposta técnica | @leohsm | Antes da SUB-04 |
