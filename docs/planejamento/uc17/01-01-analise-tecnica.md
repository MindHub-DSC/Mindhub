# 01-01 — Análise técnica do caso de uso

**Caso de uso:** UC17 — Vincular Membro à Organização  
**Contexto:** C1 — Identidade e Organizações  
**Classificação no MVP:** Futuro  
**Situação da especificação:** Derivado — a validar  
**Fonte:** `docs/casos-de-uso.md` §2 (UC17) (UC17)  
**Data do planejamento:** 10/11/2026

> **Atenção:** este caso de uso está classificado como *Derivado — a validar* em `docs/casos-de-uso.md`. Os passos marcados **[PROP]** na especificação são hipóteses; este planejamento os trata como **propostas técnicas** e exige a confirmação do responsável antes de qualquer Sub-Issue ir para `Ready` (`docs/casos-de-uso.md` §9). Além disso, o caso de uso é classificado como **Futuro** no MVP: o planejamento existe para completar o catálogo, mas a implementação só deve começar depois que as dúvidas impeditivas citadas abaixo forem respondidas.

## 1. Identificação

- **Código e título:** UC17 — Vincular Membro à Organização
- **Objetivo:** Incluir colaboradores: o Representante vincula outro Usuário cadastrado à Organização, com um papel [T5 §3].
- **Escopo no projeto:** Registro do Vínculo Organizacional de um membro por um Representante cujo vínculo é verificado no instante da operação (RN11, TC-C1-01).
- **Fora do escopo:** revogar vínculo (sem Caso de Uso), aceite do vínculo pelo membro, lista fechada de papéis (não documentados), autenticação.

## 2. Atores e papéis

| Ator | Papel no caso de uso |
| --- | --- |
| Representante de organização | Ator principal; vincula o membro |
| Usuário a vincular | Recebe o vínculo; é avisado [PROP] |
| Serviço de notificações | Avisa o membro; a falha não invalida o vínculo |

## 3. Pré-condições e pós-condições

**Pré-condições**

- **PRE-01:** Existe a Organização (UC16).
- **PRE-02:** O membro a vincular é um Usuário cadastrado (UC01).

**Pós-condições**

- **POS-01:** Existe um Vínculo Organizacional entre o membro e a Organização, com um papel.

## 4. Fluxos

**Fluxo principal**

1. O Representante indica a Organização, o Usuário a vincular e o papel.
2. O sistema verifica que o Representante possui vínculo compatível (RN11), no instante da operação.
3. O sistema reconhece o Usuário a vincular.
4. O sistema registra o Vínculo Organizacional.
5. O sistema informa o Representante; o membro é avisado [PROP].

**Fluxos alternativos e de exceção**

| Código | Tipo | Condição e comportamento |
| --- | --- | --- |
| FE-01 | Fluxo de exceção | Representante sem vínculo compatível: recusa (RN11); nada é registrado. |
| FE-02 | Fluxo de exceção | Usuário a vincular não reconhecido: recusa; nada é registrado. |
| FE-03 | Fluxo de exceção | Vínculo do Representante revogado durante a operação: a operação posterior à revogação é recusada (TC-C1-01). |
| FE-04 | Fluxo de exceção | Falha do aviso ao membro: o vínculo continua registrado. |

## 5. Regras de negócio e invariantes

| ID | Regra | Origem |
| --- | --- | --- |
| RN11 | Agir em nome de organização exige vínculo compatível. | Documentado |
| INV-01 | Todo Vínculo relaciona exatamente um Usuário e uma Organização; Usuário — Vínculo `1 : 0..*` e Organização — Vínculo `1 : 0..*`. | Documentado |

## 6. Validações de entrada e de processamento

- **Documentado:** o Representante precisa de vínculo compatível no instante da operação (RN11); o Usuário a vincular deve ser reconhecido.
- **Proposta técnica (D-UC17-01):** papel dentro de um conjunto provisório (representante, colaborador, participante autorizado); campos extras proibidos.

## 7. Componentes e camadas envolvidas

| Componente / camada | Responsabilidade |
| --- | --- |
| C1 — domínio | Vínculo Organizacional de membro, papéis |
| C1 — repositório | Vínculos por Organização e Usuário |
| C1 — aplicação | Serviço Vincular Membro e aviso |
| C1 — HTTP | Endpoint |

## 8. Considerações arquiteturais preliminares

Estas considerações são **propostas técnicas** e exigem confirmação, salvo onde indicado o contrário.

- A verificação do vínculo do Representante e o registro do novo vínculo ocorrem na mesma unidade de consistência para respeitar o instante da operação (TC-C1-01).
- O aviso ao membro usa a porta de notificações e não participa da transação.
- **Documentado:** monólito modular em contextos C1 a C6 (ADR-01) e módulos NestJS organizados em `dominio`, `aplicacao`, `infra` e `http`, como em `identidade/` e `oferta/` [CÓD].

## 9. Restrições, dúvidas e decisões pendentes

Itens "Dúvida documentada" constam em `docs/casos-de-uso.md`; itens "Proposta técnica" são decisões deste planejamento que dependem de confirmação.

| ID | Item | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC17-01 | Quais papéis existem? T3 §6.1 cita representante, colaborador e participante autorizado, sem lista fechada. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC17-02 | O membro precisa aceitar o vínculo? Não documentado; o vínculo é registrado diretamente. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-03 |
| D-UC17-03 | Um Usuário pode ter dois vínculos com a mesma Organização (papéis diferentes)? Não documentado. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC17-04 | Revogar vínculo é usado em TC-C1-01 sem Caso de Uso; a revogação é simulada em teste e não implementada. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC17-05 | Aviso ao membro pela porta de notificações; falha não invalida o vínculo. | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC17-06 | Rota e códigos HTTP: `POST /organizacoes/{id}/vinculos`; 403, 404 e 422. | Proposta técnica | @leohsm | Antes da SUB-04 |
| D-UC17-07 | Origem do identificador do Representante (D1). | Dúvida documentada | @leohsm | Antes da SUB-04 |
