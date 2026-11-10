# 01-01 — Análise técnica do caso de uso

**Caso de uso:** UC06 — Enviar Proposta  
**Contexto:** C3 — Negociação e Contratação  
**Classificação no MVP:** Central  
**Situação da especificação:** Derivado — a validar  
**Fonte:** `docs/casos-de-uso.md` §4 (UC06) (UC06)  
**Data do planejamento:** 10/11/2026

> **Atenção:** este caso de uso está classificado como *Derivado — a validar* em `docs/casos-de-uso.md`. Os passos marcados **[PROP]** na especificação são hipóteses; este planejamento os trata como **propostas técnicas** e exige a confirmação do responsável antes de qualquer Sub-Issue ir para `Ready` (`docs/casos-de-uso.md` §9).

## 1. Identificação

- **Código e título:** UC06 — Enviar Proposta
- **Objetivo:** Oferecer condições para uma Solicitação: o Especialista envia uma Proposta com Condições Comerciais; inclui o envio de nova versão [T5 §3, §4.1].
- **Escopo no projeto:** Primeiro envio da Proposta e envio de nova versão, com versões imutáveis, Proposta única por Solicitação (1 : 0..1) e aviso ao cliente tolerante a falha.
- **Fora do escopo:** aceitar (UC07), recusar, expirar e pedir revisão da Proposta (sem Caso de Uso, `casos-de-uso.md` §8), estado `Em elaboração`, ciclo da Solicitação (`Respondida`), autenticação.

## 2. Atores e papéis

| Ator | Papel no caso de uso |
| --- | --- |
| Especialista | Ator principal; elabora e envia a Proposta |
| Cliente | Destinatário da Proposta; avisado [PROP] |
| Serviço de notificações | Avisa o cliente [PROP]; a falha não invalida o registro |

## 3. Pré-condições e pós-condições

**Pré-condições**

- **PRE-01:** Existe uma Solicitação `Enviada`, direcionada ao perfil do Especialista (UC05).
- **PRE-01a:** (nova versão) Existe uma Proposta `Enviada` ou `Em revisão` para a Solicitação.

**Pós-condições**

- **POS-01:** (primeiro envio) Existe uma Proposta `Enviada`, ligada à Solicitação, com uma primeira Versão.
- **POS-01a:** (nova versão) A Proposta está `Em revisão` e a nova versão é a vigente.
- **POS-02:** Cada versão é retrato imutável das Condições Comerciais; versões anteriores são preservadas.
- **POS-03:** A Solicitação tem no máximo uma Proposta (1 : 0..1).
- **POS-04:** O cliente consegue conhecer a versão vigente (passo 1 do UC07).

## 4. Fluxos

**Fluxo principal**

1. O Especialista consulta a Solicitação recebida.
2. O Especialista elabora as Condições Comerciais.
3. O sistema verifica que a Solicitação é dirigida ao Especialista e ainda não possui Proposta.
4. O sistema registra a Proposta como `Enviada`, com a primeira versão.
5. O sistema informa o Especialista; o cliente é avisado [PROP].

**Fluxos alternativos e de exceção**

| Código | Tipo | Condição e comportamento |
| --- | --- | --- |
| FA-01 | Fluxo alternativo | Nova versão de Proposta `Enviada` ou `Em revisão`: registrada e vigente; Proposta `Em revisão`; versões anteriores preservadas. |
| FA-02 | Fluxo alternativo | Falha no aviso ao cliente: a Proposta continua registrada. |
| FE-01 | Fluxo de exceção | Solicitação de outro especialista: recusa; nada é registrado. [PROP] |
| FE-02 | Fluxo de exceção | Solicitação já possui Proposta: recusa, com orientação para nova versão. |
| FE-03 | Fluxo de exceção | Nova versão para Proposta `Aceita`: recusa; a versão aceita já está preservada. |
| FE-04 | Fluxo de exceção | Nova versão para Proposta `Recusada` ou `Expirada`: recusa. |
| FE-05 | Fluxo de exceção | Nova versão concorrente com um aceite: no máximo uma Contratação; a versão aceita é a indicada e vigente (TC-C3-01). |
| FE-06 | Fluxo de exceção | Condições Comerciais inválidas (preço negativo, validade no passado): recusa; nada é registrado. [PROP] |

## 5. Regras de negócio e invariantes

| ID | Regra | Origem |
| --- | --- | --- |
| RN05 | A versão aceita é identificável: cada versão tem identificação própria. | Documentado |
| RN13 | O Serviço Sob Proposta segue o caminho de Solicitação e Proposta. | Documentado |
| INV-01 | Proposta — Versão `1 : 1..*` após o primeiro envio; Versão é objeto de valor. | Documentado |

## 6. Validações de entrada e de processamento

- **Documentado:** Condições Comerciais incluem preço e moeda, quantidade prevista de sessões, duração, modalidade, validade, condições de pagamento e, quando conhecidas, de cancelamento [T3 §5.2]; entrada inválida (preço negativo, validade no passado) é recusada [PROP, FE-06].
- **Proposta técnica:** preço inteiro em unidade monetária mínima; quantidade de sessões e duração inteiras positivas; validade posterior ao instante do envio — sujeito a D-UC06-02.
- **Documentado:** a Solicitação deve ser dirigida ao Especialista e ainda não possuir Proposta (passo 3).

## 7. Componentes e camadas envolvidas

| Componente / camada | Responsabilidade |
| --- | --- |
| C3 — domínio | Condições Comerciais, Versão, Agregado Proposta e seu ciclo |
| C3 — aplicação | Consulta da Solicitação, Enviar Proposta, Enviar Nova Versão, aviso |
| C3 — repositório | Proposta (em memória), leitura da Solicitação do UC05 |
| C3 — HTTP | Endpoints, DTO e tradução de erros |

## 8. Considerações arquiteturais preliminares

Estas considerações são **propostas técnicas** e exigem confirmação, salvo onde indicado o contrário.

- Proposta é Agregado com Versões como objetos de valor imutáveis (`trabalho3.md` §6.2); a versão vigente é a última.
- O controle de concorrência usa a versão vigente esperada, de modo que um aceite do UC07 e uma nova versão não coexistam (TC-C3-01).
- A porta de aviso do UC05 (SUB-03) é reaproveitada para avisar o cliente.
- **Documentado:** monólito modular em contextos C1 a C6 (ADR-01) e módulos NestJS organizados em `dominio`, `aplicacao`, `infra` e `http`, como em `identidade/` e `oferta/` [CÓD].

## 9. Restrições, dúvidas e decisões pendentes

Itens "Dúvida documentada" constam em `docs/casos-de-uso.md`; itens "Proposta técnica" são decisões deste planejamento que dependem de confirmação.

| ID | Item | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC06-01 | Quem leva a Proposta de `Enviada` para `Em revisão`? Este planejamento usa só FA-01 (nova versão do Especialista); "pedir revisão" não é implementado. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC06-02 | Quais Condições Comerciais são obrigatórias. Proposta: todas, exceto condições de cancelamento. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC06-03 | Identificação da versão: número sequencial por Proposta, a partir de 1 (D-UC07-03). | Proposta técnica | @leohsm | Antes da SUB-02 |
| D-UC06-04 | O estado `Em elaboração` não entra: o primeiro registro já é `Enviada` ([PROP] do documento). | Proposta técnica | @leohsm | Antes da SUB-02 |
| D-UC06-05 | Especialista suspenso pode enviar Proposta para Solicitação recebida antes da suspensão? RN01 só trata de novas Solicitações. Nenhuma regra criada. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC06-06 | A Solicitação passa a `Respondida`? Previsto em T2.1 §13.2, não retomado em T3. Não implementado. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC06-07 | Recusar e expirar Proposta são transições sem Caso de Uso. Não implementadas. | Dúvida documentada | @leohsm (domínio) | Antes do UC07 |
| D-UC06-08 | Rotas e códigos HTTP: `POST /solicitacoes/{id}/propostas`, `POST /propostas/{id}/versoes`; 404, 403, 409 e 422 para as recusas. | Proposta técnica | @leohsm | Antes da SUB-05 |
| D-UC06-09 | Origem do identificador do Especialista (D1). | Dúvida documentada | @leohsm | Antes da SUB-05 |
