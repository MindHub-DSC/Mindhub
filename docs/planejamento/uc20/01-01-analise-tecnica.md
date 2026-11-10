# 01-01 — Análise técnica do caso de uso

**Caso de uso:** UC20 — Abrir Disputa  
**Contexto:** C6 — Governança e Disputas  
**Classificação no MVP:** Futuro  
**Situação da especificação:** Derivado — a validar  
**Fonte:** `docs/casos-de-uso.md` §6 (UC20) (UC20)  
**Data do planejamento:** 10/11/2026

> **Atenção:** este caso de uso está classificado como *Derivado — a validar* em `docs/casos-de-uso.md`. Os passos marcados **[PROP]** na especificação são hipóteses; este planejamento os trata como **propostas técnicas** e exige a confirmação do responsável antes de qualquer Sub-Issue ir para `Ready` (`docs/casos-de-uso.md` §9). Além disso, o caso de uso é classificado como **Futuro** no MVP: o planejamento existe para completar o catálogo, mas a implementação só deve começar depois que as dúvidas impeditivas citadas abaixo forem respondidas.

## 1. Identificação

- **Código e título:** UC20 — Abrir Disputa
- **Objetivo:** Questionar uma contratação: Cliente, Especialista ou Representante abre uma Disputa associada a uma Contratação, Sessão ou Pagamento [T5 §3].
- **Escopo no projeto:** Registro da Disputa `Aberta` com o questionamento e as evidências, verificando que o ator é parte da Contratação.
- **Fora do escopo:** decidir a Disputa (UC21), prazo para abrir, efeitos sobre repasse ou demais operações (abrir não bloqueia nada, TC-C6-02), recurso, autenticação.

## 2. Atores e papéis

| Ator | Papel no caso de uso |
| --- | --- |
| Cliente, Especialista ou Representante | Ator principal; abre a Disputa |
| Administrador | Informado da abertura [PROP] |
| Outra parte | Informada da abertura [PROP] |

## 3. Pré-condições e pós-condições

**Pré-condições**

- **PRE-01:** Existe a Contratação questionada (UC07 ou UC08).

**Pós-condições**

- **POS-01:** Existe uma Disputa `Aberta`, associada à Contratação e, quando aplicável, a uma Sessão ou Pagamento.
- **POS-02:** O questionamento e as evidências apresentadas ficam preservados.

## 4. Fluxos

**Fluxo principal**

1. O ator escolhe a Contratação (e, se for o caso, a Sessão ou o Pagamento) e descreve o questionamento.
2. O sistema verifica que o ator é parte da Contratação; o Representante precisa de vínculo (RN11).
3. O sistema registra a Disputa como `Aberta`.
4. O sistema informa a outra parte e a administração [PROP].

**Fluxos alternativos e de exceção**

| Código | Tipo | Condição e comportamento |
| --- | --- | --- |
| FE-01 | Fluxo de exceção | Ator não é parte da Contratação: recusa. [PROP] |
| FE-02 | Fluxo de exceção | Sessão ou Pagamento indicado não pertence à Contratação: recusa. [PROP] |
| FE-03 | Fluxo de exceção | Representante sem vínculo: recusa (RN11). |

## 5. Regras de negócio e invariantes

| ID | Regra | Origem |
| --- | --- | --- |
| RN11 | Agir em nome de organização exige vínculo compatível. | Documentado |
| RN15 | Ações administrativas e de governança são rastreáveis: autor, instante e referência. | Documentado |
| INV-01 | Contratação — Disputa `1 : 0..*`; abrir Disputa não bloqueia as demais operações (TC-C6-02). | Documentado |

## 6. Validações de entrada e de processamento

- **Documentado:** o ator é parte da Contratação; o Representante precisa de vínculo compatível (RN11); a Sessão ou o Pagamento indicados pertencem à Contratação.
- **Proposta técnica:** questionamento com `trim` e limite de tamanho; evidências como lista de referências textuais; campos extras proibidos.

## 7. Componentes e camadas envolvidas

| Componente / camada | Responsabilidade |
| --- | --- |
| C6 — domínio | Disputa e ciclo provisório |
| C6 — adaptadores | Visões públicas de C1, C3, C4 e C5 |
| C6 — aplicação | Serviço Abrir Disputa |
| C6 — HTTP | Endpoint |

## 8. Considerações arquiteturais preliminares

Estas considerações são **propostas técnicas** e exigem confirmação, salvo onde indicado o contrário.

- A Disputa referencia a Contratação, a Sessão e o Pagamento por identificador; as evidências são copiadas do questionamento do ator, não lidas dos outros contextos.
- A abertura não tem efeito nos demais contextos, como recomenda o TC-C6-02.
- **Documentado:** monólito modular em contextos C1 a C6 (ADR-01) e módulos NestJS organizados em `dominio`, `aplicacao`, `infra` e `http`, como em `identidade/` e `oferta/` [CÓD].

## 9. Restrições, dúvidas e decisões pendentes

Itens "Dúvida documentada" constam em `docs/casos-de-uso.md`; itens "Proposta técnica" são decisões deste planejamento que dependem de confirmação.

| ID | Item | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC20-01 | Prazo para abrir disputa depois da Sessão ou do Pagamento: não documentado; nenhuma regra criada. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC20-02 | A abertura suspende algum efeito (por exemplo, repasse)? Não documentado; T4 TC-C6-02 recomenda não. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC20-03 | Ciclo da Disputa (`Aberta`, `Em análise`, `Aguardando informações`, `Resolvida`, `Cancelada`, `Encerrada`) é provisório [T3 §11.5]. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC20-04 | Forma das evidências preservadas (texto e referências). Proposta: texto e identificadores de itens relacionados. | Proposta técnica | @leohsm | Antes da SUB-01 |
| D-UC20-05 | Contratação — Disputa `1 : 0..*` (hipótese plausível de T3 §8): mais de uma Disputa por Contratação é aceita. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC20-06 | Aviso à outra parte e à administração pela porta de notificações; falha não invalida a abertura. | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC20-07 | Rota e códigos HTTP: `POST /disputas`; 403, 404 e 422. | Proposta técnica | @leohsm | Antes da SUB-04 |
| D-UC20-08 | Origem do identificador do ator (D1). | Dúvida documentada | @leohsm | Antes da SUB-04 |
