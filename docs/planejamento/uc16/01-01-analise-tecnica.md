# 01-01 — Análise técnica do caso de uso

**Caso de uso:** UC16 — Registrar Organização  
**Contexto:** C1 — Identidade e Organizações  
**Classificação no MVP:** Futuro  
**Situação da especificação:** Derivado — a validar  
**Fonte:** `docs/casos-de-uso.md` §2 (UC16) (UC16)  
**Data do planejamento:** 10/11/2026

> **Atenção:** este caso de uso está classificado como *Derivado — a validar* em `docs/casos-de-uso.md`. Os passos marcados **[PROP]** na especificação são hipóteses; este planejamento os trata como **propostas técnicas** e exige a confirmação do responsável antes de qualquer Sub-Issue ir para `Ready` (`docs/casos-de-uso.md` §9). Além disso, o caso de uso é classificado como **Futuro** no MVP: o planejamento existe para completar o catálogo, mas a implementação só deve começar depois que as dúvidas impeditivas citadas abaixo forem respondidas.

## 1. Identificação

- **Código e título:** UC16 — Registrar Organização
- **Objetivo:** Atuar em nome de uma organização: um Usuário cadastrado registra uma Organização e passa a ser seu representante [T5 §3].
- **Escopo no projeto:** Registro da Organização e do Vínculo Organizacional do ator como representante, na mesma unidade de consistência.
- **Fora do escopo:** verificação de que a pessoa representa de fato a organização, unicidade da Organização, edição e exclusão de Organização, autenticação.

## 2. Atores e papéis

| Ator | Papel no caso de uso |
| --- | --- |
| Representante de organização (Usuário cadastrado) | Ator principal; registra a Organização |
| Sistema — C1 | Reconhece o Usuário e registra Organização e vínculo |

## 3. Pré-condições e pós-condições

**Pré-condições**

- **PRE-01:** O ator é um Usuário cadastrado (UC01).

**Pós-condições**

- **POS-01:** Existe uma Organização com identidade própria.
- **POS-02:** Existe um Vínculo Organizacional entre o ator e a Organização, com o papel de representante.

## 4. Fluxos

**Fluxo principal**

1. O Usuário informa os dados da organização.
2. O sistema reconhece o Usuário.
3. O sistema registra a Organização e o Vínculo do Usuário como representante, na mesma unidade de consistência [PROP].
4. O sistema informa a Organização registrada.

**Fluxos alternativos e de exceção**

| Código | Tipo | Condição e comportamento |
| --- | --- | --- |
| FE-01 | Fluxo de exceção | Dados fora do formato: recusado na fronteira. |
| FE-02 | Fluxo de exceção | Usuário não reconhecido: recusado no passo 2; nada é registrado. |
| FE-03 | Fluxo de exceção | Falha técnica: nada é registrado. |

## 5. Regras de negócio e invariantes

| ID | Regra | Origem |
| --- | --- | --- |
| RN11 | O vínculo criado é o que permitirá agir em nome da organização. | Documentado |
| INV-01 | Todo Vínculo Organizacional relaciona exatamente um Usuário e uma Organização. | Documentado |

## 6. Validações de entrada e de processamento

- **Documentado:** dados fora do formato são recusados na fronteira (FE-01); usuário não reconhecido é recusado (FE-02).
- **Proposta técnica (D-UC16-01):** nome da Organização com `trim`, 1 a 120 caracteres; campos extras proibidos.

## 7. Componentes e camadas envolvidas

| Componente / camada | Responsabilidade |
| --- | --- |
| C1 — domínio | Organização e Vínculo Organizacional |
| C1 — infraestrutura | Entidades ORM, repositório e migration |
| C1 — aplicação | Serviço Registrar Organização |
| C1 — HTTP | DTO e controller |

## 8. Considerações arquiteturais preliminares

Estas considerações são **propostas técnicas** e exigem confirmação, salvo onde indicado o contrário.

- Organização e Vínculo são Agregados com referências por identificador; o Vínculo relaciona exatamente um Usuário e uma Organização (T3 §10).
- A criação dos dois acontece na mesma transação (D-UC16-07).
- **Documentado:** monólito modular em contextos C1 a C6 (ADR-01) e módulos NestJS organizados em `dominio`, `aplicacao`, `infra` e `http`, como em `identidade/` e `oferta/` [CÓD].

## 9. Restrições, dúvidas e decisões pendentes

Itens "Dúvida documentada" constam em `docs/casos-de-uso.md`; itens "Proposta técnica" são decisões deste planejamento que dependem de confirmação.

| ID | Item | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC16-01 | Quais dados identificam uma Organização (nome, documento fiscal)? Não documentado. Proposta: apenas o nome. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC16-02 | Pode existir mais de uma Organização com os mesmos dados? Não documentado; nenhuma unicidade assumida. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC16-03 | Há verificação de que a pessoa realmente representa a organização? Não documentado; nenhuma verificação criada. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC16-04 | Papel do vínculo do criador: representante (documentado); a lista de papéis é indefinida (T3 §6.1). | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC16-05 | Origem do identificador do Usuário (D1). | Dúvida documentada | @leohsm | Antes da SUB-04 |
| D-UC16-06 | Rota e códigos HTTP: `POST /organizacoes`; 404/422 usuário não reconhecido, 400 formato. | Proposta técnica | @leohsm | Antes da SUB-04 |
| D-UC16-07 | Organização e vínculo gravados na mesma transação. | Proposta técnica | @leohsm | Antes da SUB-02 |
