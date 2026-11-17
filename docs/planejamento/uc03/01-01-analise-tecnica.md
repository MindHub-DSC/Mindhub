# 01-01 — Análise técnica do caso de uso

**Caso de uso:** UC03 — Publicar Serviço  
**Contexto:** C2 — Oferta Profissional  
**Classificação no MVP:** Central  
**Situação da especificação:** Derivado — a validar  
**Fonte:** `docs/casos-de-uso.md` §3 (UC03) (UC03)  
**Data do planejamento:** 10/11/2026

> **Atenção:** este caso de uso está classificado como *Derivado — a validar* em `docs/casos-de-uso.md`. Os passos marcados **[PROP]** na especificação são hipóteses; este planejamento os trata como **propostas técnicas** e exige a confirmação do responsável antes de qualquer Sub-Issue ir para `Ready` (`docs/casos-de-uso.md` §9).

## 1. Identificação

- **Código e título:** UC03 — Publicar Serviço
- **Objetivo:** Divulgar uma oferta: o Especialista publica um Serviço com Modelo de Contratação declarado (Reserva Direta ou Sob Proposta) [T5 §3].
- **Escopo no projeto:** Criação e publicação de um Serviço vinculado ao Perfil de Especialista do ator, com verificação de RN01 e, para Reserva Direta, registro das condições vigentes.
- **Fora do escopo:** editar ou despublicar Serviço (fora do catálogo, `casos-de-uso.md` §8), busca e visibilidade (UC04), contratação (UC05/UC08), autenticação e verificação de que o ator é o dono do perfil além do identificador informado (D1).

## 2. Atores e papéis

| Ator | Papel no caso de uso |
| --- | --- |
| Especialista | Ator principal; publica o Serviço |
| Sistema — C2 | Reconhece o perfil, aplica RN01 e registra o Serviço |

## 3. Pré-condições e pós-condições

**Pré-condições**

- **PRE-01:** O ator possui Perfil de Especialista (UC02). A situação `ATIVO` não é pré-condição: é a RN01 (passo 3).

**Pós-condições**

- **POS-01:** Existe um Serviço com identidade própria, oferecido pelo Perfil do ator.
- **POS-02:** O Serviço declara seu Modelo de Contratação (Reserva Direta ou Sob Proposta).
- **POS-03:** O Serviço está publicado e visível a clientes.
- **POS-04:** Serviço de Reserva Direta possui as condições vigentes da oferta padronizada.

## 4. Fluxos

**Fluxo principal**

1. O Especialista descreve o Serviço e escolhe o Modelo de Contratação.
2. Se o Serviço for de Reserva Direta, o Especialista informa as condições vigentes.
3. O sistema verifica que o perfil do Especialista está `ATIVO` (RN01).
4. O sistema registra o Serviço como publicado, vinculado ao perfil.
5. O sistema informa o Serviço publicado.

**Fluxos alternativos e de exceção**

| Código | Tipo | Condição e comportamento |
| --- | --- | --- |
| FA-01 | Fluxo alternativo | O Especialista publica outro Serviço: mesmo fluxo; um perfil pode ter vários Serviços (1 : 0..*). |
| FE-01 | Fluxo de exceção | Dados fora do formato: recusado na fronteira. |
| FE-02 | Fluxo de exceção | Perfil `SUSPENSO`: recusa (RN01); nada é registrado. |
| FE-03 | Fluxo de exceção | Ator sem Perfil de Especialista: recusa; nada é registrado. [PROP] |
| FE-04 | Fluxo de exceção | Modelo de Contratação ausente: recusa; nada é registrado. [PROP] |
| FE-05 | Fluxo de exceção | Reserva Direta sem condições vigentes: recusa; nada é registrado. [PROP] |
| FE-06 | Fluxo de exceção | Suspensão concorrente com a publicação: a publicação posterior à suspensão é recusada (TC-C2-01). |

## 5. Regras de negócio e invariantes

| ID | Regra | Origem |
| --- | --- | --- |
| RN01 | Só Perfil de Especialista `ATIVO` publica Serviços e recebe Solicitações. | Documentado |
| RN13 | O Modelo de Contratação declarado define o caminho comercial (Reserva Direta sem proposta; Sob Proposta com negociação). | Documentado |

## 6. Validações de entrada e de processamento

- **Documentadas:** validação de entrada não é pré-condição; formato dos dados é recusado na fronteira (FE-01).
- **Proposta técnica:** título e descrição do Serviço com limites de tamanho análogos ao UC02 (`trim`, mínimo 1), campos extras proibidos — sujeito a D-UC03-01.
- **Proposta técnica:** condições vigentes de Reserva Direta com preço inteiro não negativo em unidade monetária mínima, moeda, duração positiva e modalidade — sujeito a D-UC03-02.

## 7. Componentes e camadas envolvidas

| Componente / camada | Responsabilidade |
| --- | --- |
| C2 — domínio (`oferta/dominio`) | Agregado Serviço, Modelo de Contratação, condições vigentes, porta de repositório |
| C2 — aplicação (`oferta/aplicacao`) | Serviço Publicar Serviço; reconhecimento do perfil e RN01 |
| C2 — infraestrutura (`oferta/infra`) | Entidade ORM, mapper, repositório TypeORM, migration |
| C2 — HTTP (`oferta/http`) | DTO, controller e tradução de erros |

## 8. Considerações arquiteturais preliminares

Estas considerações são **propostas técnicas** e exigem confirmação, salvo onde indicado o contrário.

- O Serviço é um Agregado próprio, referenciando o perfil por identificador, sem copiar dados do perfil nem do Usuário.
- A verificação de RN01 e o registro devem ocorrer na mesma unidade de consistência para atender ao TC-C2-01 (D-UC03-06).
- O repositório segue o padrão do UC02: porta no domínio, adaptador em memória para testes de domínio e adaptador TypeORM com migration.
- **Documentado:** monólito modular em contextos C1 a C6 (ADR-01) e módulos NestJS organizados em `dominio`, `aplicacao`, `infra` e `http`, como em `identidade/` e `oferta/` [CÓD].

## 9. Restrições, dúvidas e decisões pendentes

Itens "Dúvida documentada" constam em `docs/casos-de-uso.md`; itens "Proposta técnica" são decisões deste planejamento que dependem de confirmação.

| ID | Item | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC03-01 | Atributos que descrevem um Serviço (título, descrição, modalidade, área). Proposta: título e descrição. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC03-02 | Quais campos das condições vigentes são obrigatórios em Reserva Direta (preço, moeda, duração, modalidade são apenas exemplos em T3 §5.2). | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC03-03 | Serviço Sob Proposta possui preço de referência? Este planejamento assume que não. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC03-04 | Serviços de perfil suspenso deixam de ser visíveis? Fora do UC03; decidido no UC04/UC18. | Dúvida documentada | @leohsm (domínio) | Antes do UC04 |
| D-UC03-05 | Origem da identidade do ator (D1): identificador informado pelo cliente HTTP até existir autenticação. | Dúvida documentada | @leohsm | Antes da SUB-05 |
| D-UC03-06 | Estratégia para FE-06: verificar o estado do perfil e gravar o Serviço na mesma transação, com bloqueio ou versão do perfil. | Proposta técnica | @leohsm | Antes da SUB-04 |
| D-UC03-07 | Rota e códigos HTTP dos erros (ex.: `POST /servicos`; 404 sem perfil, 403 perfil suspenso, 422 condições ausentes). | Proposta técnica | @leohsm | Antes da SUB-05 |
