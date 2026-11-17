# 01-01 — Análise técnica do caso de uso

**Caso de uso:** UC04 — Buscar Especialistas e Serviços  
**Contexto:** C2 — Oferta Profissional  
**Classificação no MVP:** Secundário  
**Situação da especificação:** Derivado — a validar  
**Fonte:** `docs/casos-de-uso.md` §3 (UC04) (UC04)  
**Data do planejamento:** 10/11/2026

> **Atenção:** este caso de uso está classificado como *Derivado — a validar* em `docs/casos-de-uso.md`. Os passos marcados **[PROP]** na especificação são hipóteses; este planejamento os trata como **propostas técnicas** e exige a confirmação do responsável antes de qualquer Sub-Issue ir para `Ready` (`docs/casos-de-uso.md` §9).

## 1. Identificação

- **Código e título:** UC04 — Buscar Especialistas e Serviços
- **Objetivo:** Encontrar orientação adequada: o Cliente recebe especialistas e Serviços publicados compatíveis com o critério informado [T5 §3].
- **Escopo no projeto:** Consulta somente leitura da oferta vigente, com visão pública de especialista, especialidades, Serviços e Modelo de Contratação. "Uma listagem simples basta no início" [T5 §9.2].
- **Fora do escopo:** ordenação, ranking por reputação e recomendação inteligente (sem regras confirmadas, [T5 §4.2]); contratação (UC05/UC08); autenticação.

## 2. Atores e papéis

| Ator | Papel no caso de uso |
| --- | --- |
| Cliente | Ator principal; consulta a oferta |
| Sistema — C2 | Seleciona e apresenta a visão pública |

## 3. Pré-condições e pós-condições

**Pré-condições**

- Nenhuma confirmada na documentação.

**Pós-condições**

- **POS-01:** O Cliente recebe especialistas e Serviços compatíveis com o critério informado.
- **POS-02:** Nenhum estado do sistema é alterado.

## 4. Fluxos

**Fluxo principal**

1. O Cliente informa critérios de busca (ex.: área de atuação ou especialidade).
2. O sistema seleciona especialistas habilitados e seus Serviços publicados [PROP].
3. O sistema apresenta uma visão pública, sem dados privados.
4. O Cliente escolhe um especialista ou Serviço e segue para UC05 ou UC08.

**Fluxos alternativos e de exceção**

| Código | Tipo | Condição e comportamento |
| --- | --- | --- |
| FA-01 | Fluxo alternativo | Nenhum resultado: lista vazia, não é erro. [PROP] |
| FA-02 | Fluxo alternativo | Busca sem critério: listagem simples da oferta vigente. |
| FE-01 | Fluxo de exceção | Critério fora do formato: recusado na fronteira. |

## 5. Regras de negócio e invariantes

| ID | Regra | Origem |
| --- | --- | --- |
| RN01 | Como filtro de elegibilidade [PROP]: só perfis `ATIVO`. | Documentado |
| RN13 | O Modelo de Contratação orienta o próximo caso de uso. | Documentado |

## 6. Validações de entrada e de processamento

- **Documentado:** critério fora do formato é recusado na fronteira (FE-01).
- **Proposta técnica:** critério por texto de especialidade ou área, comparado sem diferenciar maiúsculas e minúsculas, com limite de tamanho — sujeito a D-UC04-02.
- **Proposta técnica:** campos de consulta não previstos são recusados (`z.strictObject`).

## 7. Componentes e camadas envolvidas

| Componente / camada | Responsabilidade |
| --- | --- |
| C2 — aplicação/consulta | Seleção de especialistas habilitados e Serviços publicados |
| C2 — leitura (`oferta/aplicacao`) | Modelo de leitura público, sem dados privados |
| C2 — infraestrutura | Consulta ao armazenamento (TypeORM) |
| C2 — HTTP | Query string, controller e resposta |

## 8. Considerações arquiteturais preliminares

Estas considerações são **propostas técnicas** e exigem confirmação, salvo onde indicado o contrário.

- Operação de leitura pura (POS-02): o serviço não usa Agregados com comportamento, apenas uma porta de consulta própria.
- A visão pública omite dados do Usuário e dados privados do perfil; só especialidades, Serviços e Modelo de Contratação [T4 §6.1].
- Paginação não consta da documentação; a listagem simples pode devolver todos os resultados (D-UC04-03).
- **Documentado:** monólito modular em contextos C1 a C6 (ADR-01) e módulos NestJS organizados em `dominio`, `aplicacao`, `infra` e `http`, como em `identidade/` e `oferta/` [CÓD].

## 9. Restrições, dúvidas e decisões pendentes

Itens "Dúvida documentada" constam em `docs/casos-de-uso.md`; itens "Proposta técnica" são decisões deste planejamento que dependem de confirmação.

| ID | Item | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC04-01 | Perfis `SUSPENSO` aparecem na busca? Proposta: não, pois não recebem novas Solicitações (RN01). | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC04-02 | Quais critérios existem (área de atuação, especialidade, Modelo de Contratação)? [T1 §3] cita área e especialidade. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC04-03 | Paginação e tamanho máximo da listagem. | Proposta técnica | @leohsm | Antes da SUB-03 |
| D-UC04-04 | A busca exige Usuário cadastrado? Não documentado. Proposta: não exige. | Dúvida documentada | @leohsm | Antes da SUB-03 |
| D-UC04-05 | Forma da visão pública de resultado (campos devolvidos). | Proposta técnica | @leohsm | Antes da SUB-01 |
