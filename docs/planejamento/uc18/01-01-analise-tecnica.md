# 01-01 — Análise técnica do caso de uso

**Caso de uso:** UC18 — Suspender Perfil de Especialista  
**Contexto:** C2 — Oferta Profissional (registro em C6)  
**Classificação no MVP:** Secundário  
**Situação da especificação:** Derivado — a validar  
**Fonte:** `docs/casos-de-uso.md` §3 (UC18) (UC18)  
**Data do planejamento:** 10/11/2026

> **Atenção:** este caso de uso está classificado como *Derivado — a validar* em `docs/casos-de-uso.md`. Os passos marcados **[PROP]** na especificação são hipóteses; este planejamento os trata como **propostas técnicas** e exige a confirmação do responsável antes de qualquer Sub-Issue ir para `Ready` (`docs/casos-de-uso.md` §9).

## 1. Identificação

- **Código e título:** UC18 — Suspender Perfil de Especialista
- **Objetivo:** Impedir novas demandas a um especialista: o Administrador muda o perfil para `SUSPENSO` com ação administrativa rastreável (RN15) [T5 §3].
- **Escopo no projeto:** Mudança de situação do Perfil de Especialista de `ATIVO` para `SUSPENSO` por C2 e registro da ação administrativa (autor, justificativa, instante) por C6.
- **Fora do escopo:** efeito sobre propostas já enviadas e reservas futuras (dúvidas abertas), visibilidade dos Serviços, avisos ao especialista (serviço de notificações), autenticação e papel de Administrador real (D1).

## 2. Atores e papéis

| Ator | Papel no caso de uso |
| --- | --- |
| Administrador | Ator principal; suspende o perfil |
| Sistema — C2 | Decide a mudança de situação |
| Sistema — C6 | Registra a ação administrativa (RN15) |
| Serviço de notificações | Avisa o especialista [PROP]; a falha não invalida o resultado |

## 3. Pré-condições e pós-condições

**Pré-condições**

- **PRE-01:** Existe o Perfil de Especialista (UC02).

**Pós-condições**

- **POS-01:** O perfil está `SUSPENSO`.
- **POS-02:** A suspensão tem autor, justificativa e instante registrados (RN15).
- **POS-03:** A partir da suspensão, o perfil não publica Serviços nem recebe novas Solicitações (RN01).
- **POS-04:** Solicitações, propostas e contratações anteriores preservam identidade e histórico.

## 4. Fluxos

**Fluxo principal**

1. O Administrador seleciona o perfil e informa a justificativa.
2. O sistema verifica que o ator é Administrador [PROP].
3. O sistema muda a situação do perfil para `SUSPENSO` (decisão de C2).
4. O sistema registra a ação administrativa com autor, justificativa e instante (RN15).
5. O sistema informa o Administrador; o especialista é avisado [PROP].

**Fluxos alternativos e de exceção**

| Código | Tipo | Condição e comportamento |
| --- | --- | --- |
| FE-01 | Fluxo de exceção | Justificativa ausente: recusa (RN15). [PROP] |
| FE-02 | Fluxo de exceção | Perfil já `SUSPENSO`: recusa sem novo registro. [PROP] |
| FE-03 | Fluxo de exceção | Ator não é Administrador: recusa. |
| FE-04 | Fluxo de exceção | Suspensão concorrente com publicação ou nova solicitação: operações posteriores são recusadas; as anteriores são preservadas. |
| FE-05 | Fluxo de exceção | Suspensão solicitada por decisão de disputa (UC21): mesmo fluxo; a decisão é a referência da justificativa. |

## 5. Regras de negócio e invariantes

| ID | Regra | Origem |
| --- | --- | --- |
| RN01 | Perfil suspenso não publica Serviços nem recebe novas Solicitações. | Documentado |
| RN15 | Ações administrativas são rastreáveis: autor, justificativa e instante. | Documentado |

## 6. Validações de entrada e de processamento

- **Documentado:** justificativa obrigatória (FE-01, [PROP] derivada de RN15); perfil já `SUSPENSO` é recusado sem novo registro (FE-02).
- **Proposta técnica:** identificador do perfil em UUID; justificativa com `trim`, mínimo 1 e limite máximo de tamanho; campos extras proibidos.
- **Documentado:** o perfil suspenso continua contando para a unicidade do UC02.

## 7. Componentes e camadas envolvidas

| Componente / camada | Responsabilidade |
| --- | --- |
| C2 — domínio | Transição `ATIVO → SUSPENSO` no Perfil de Especialista (decisão de C2) |
| C6 — domínio/infra | Ação administrativa: autor, justificativa, instante (RN15) |
| C2/C6 — aplicação | Serviço que verifica o ator, suspende e registra |
| C2/C6 — HTTP | Endpoint administrativo e tradução de erros |

## 8. Considerações arquiteturais preliminares

Estas considerações são **propostas técnicas** e exigem confirmação, salvo onde indicado o contrário.

- A decisão de mudar a situação é de C2; C6 apenas registra e solicita. A SUB de aplicação coordena as duas, sem que C2 conheça C6.
- A suspensão e o registro devem ser consistentes: ou os dois acontecem ou nenhum (D-UC18-02).
- A verificação do papel de Administrador é proposta (passo 2 é [PROP]); sem autenticação, usa um identificador informado (D1).
- **Documentado:** monólito modular em contextos C1 a C6 (ADR-01) e módulos NestJS organizados em `dominio`, `aplicacao`, `infra` e `http`, como em `identidade/` e `oferta/` [CÓD].

## 9. Restrições, dúvidas e decisões pendentes

Itens "Dúvida documentada" constam em `docs/casos-de-uso.md`; itens "Proposta técnica" são decisões deste planejamento que dependem de confirmação.

| ID | Item | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC18-01 | Como o sistema reconhece que o ator é Administrador, sem autenticação (D1)? Proposta: lista configurada de identificadores. | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC18-02 | Suspensão e registro administrativo na mesma transação ou com consistência eventual. | Proposta técnica | @leohsm | Antes da SUB-02 |
| D-UC18-03 | A suspensão impede aceitar proposta já enviada? Aberta desde o UC07 (D-UC07-02). | Dúvida documentada | @leohsm (domínio) | Antes de usar com o UC07 |
| D-UC18-04 | Reservas confirmadas futuras e visibilidade dos Serviços do especialista suspenso não são documentadas. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC18-05 | O aviso ao especialista usa a porta de notificações; falha não invalida a suspensão. | Proposta técnica | @leohsm | Antes da SUB-03 |
