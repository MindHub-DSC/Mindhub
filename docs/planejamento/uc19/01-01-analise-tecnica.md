# 01-01 — Análise técnica do caso de uso

**Caso de uso:** UC19 — Reativar Perfil de Especialista  
**Contexto:** C2 — Oferta Profissional (registro em C6)  
**Classificação no MVP:** Secundário  
**Situação da especificação:** Derivado — a validar  
**Fonte:** `docs/casos-de-uso.md` §3 (UC19) (UC19)  
**Data do planejamento:** 10/11/2026

> **Atenção:** este caso de uso está classificado como *Derivado — a validar* em `docs/casos-de-uso.md`. Os passos marcados **[PROP]** na especificação são hipóteses; este planejamento os trata como **propostas técnicas** e exige a confirmação do responsável antes de qualquer Sub-Issue ir para `Ready` (`docs/casos-de-uso.md` §9).

## 1. Identificação

- **Código e título:** UC19 — Reativar Perfil de Especialista
- **Objetivo:** Restabelecer a atuação do especialista: o Administrador devolve o perfil `SUSPENSO` à situação `ATIVO` com ação rastreável (RN15) [T5 §3].
- **Escopo no projeto:** Mudança de situação `SUSPENSO → ATIVO` por C2 e registro da ação administrativa por C6, em par com o UC18.
- **Fora do escopo:** limite de suspensões e prazo mínimo (não documentados), efeitos sobre propostas e reservas, autenticação real (D1).

## 2. Atores e papéis

| Ator | Papel no caso de uso |
| --- | --- |
| Administrador | Ator principal; reativa o perfil |
| Sistema — C2 | Decide a mudança de situação |
| Sistema — C6 | Registra a ação (RN15) |
| Serviço de notificações | Avisa o especialista [PROP] |

## 3. Pré-condições e pós-condições

**Pré-condições**

- **PRE-01:** Existe o Perfil de Especialista (UC02).

**Pós-condições**

- **POS-01:** O perfil volta a `ATIVO`.
- **POS-02:** A reativação tem autor, justificativa e instante registrados (RN15).
- **POS-03:** O perfil volta a poder publicar e receber solicitações (RN01).

## 4. Fluxos

**Fluxo principal**

1. O Administrador seleciona o perfil suspenso e informa a justificativa.
2. O sistema verifica que o ator é Administrador [PROP].
3. O sistema muda a situação do perfil para `ATIVO`.
4. O sistema registra a ação administrativa (RN15).
5. O sistema informa o Administrador; o especialista é avisado [PROP].

**Fluxos alternativos e de exceção**

| Código | Tipo | Condição e comportamento |
| --- | --- | --- |
| FE-01 | Fluxo de exceção | Justificativa ausente: recusa. [PROP] |
| FE-02 | Fluxo de exceção | Perfil já `ATIVO`: recusa sem novo registro. [PROP] |
| FE-03 | Fluxo de exceção | Ator não é Administrador: recusa. |

## 5. Regras de negócio e invariantes

| ID | Regra | Origem |
| --- | --- | --- |
| RN01 | Perfil `ATIVO` volta a publicar Serviços e a receber Solicitações. | Documentado |
| RN15 | Ações administrativas são rastreáveis: autor, justificativa e instante. | Documentado |

## 6. Validações de entrada e de processamento

- **Documentado:** justificativa obrigatória e perfil já `ATIVO` recusado (FE-01 e FE-02, [PROP]).
- **Proposta técnica:** mesmas regras de formato do UC18 para o identificador e a justificativa.

## 7. Componentes e camadas envolvidas

| Componente / camada | Responsabilidade |
| --- | --- |
| C2 — domínio | Transição `SUSPENSO → ATIVO` |
| C6 — domínio/infra | Ação administrativa de tipo reativação |
| C2/C6 — aplicação | Serviço que verifica o ator, reativa e registra |
| C2/C6 — HTTP | Endpoint administrativo |

## 8. Considerações arquiteturais preliminares

Estas considerações são **propostas técnicas** e exigem confirmação, salvo onde indicado o contrário.

- Mesma fronteira do UC18: C2 decide a situação e C6 registra, sem dependência de C6 em C2.
- A reativação reaproveita a consistência escolhida no UC18 (D-UC18-02).
- **Documentado:** monólito modular em contextos C1 a C6 (ADR-01) e módulos NestJS organizados em `dominio`, `aplicacao`, `infra` e `http`, como em `identidade/` e `oferta/` [CÓD].

## 9. Restrições, dúvidas e decisões pendentes

Itens "Dúvida documentada" constam em `docs/casos-de-uso.md`; itens "Proposta técnica" são decisões deste planejamento que dependem de confirmação.

| ID | Item | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC19-01 | Há limite de suspensões e reativações ou prazo mínimo de suspensão? Não documentado; nenhuma regra é criada. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC19-02 | Reativação exige justificativa e registra autor e instante, como a suspensão (proposta derivada de RN15). | Proposta técnica | @leohsm | Antes da SUB-01 |
| D-UC19-03 | O aviso ao especialista usa a mesma porta do UC18; falha não invalida a reativação. | Proposta técnica | @leohsm | Antes da SUB-02 |
